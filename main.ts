import { App, MarkdownView, Notice, Plugin, PluginSettingTab, Setting, requestUrl, Platform, Modal } from 'obsidian';

// Defines the structure for a single voice from the API
interface Voice {
	Name: string;
	DisplayName: string;
	LocalName: string;
	ShortName: string;
	Gender: string;
	Locale: string;
	SampleRateHertz: string;
	VoiceType: string;
	Status: string;
}

// Settings interface for our plugin
interface AzureTTSSettings {
	subscriptionKey: string;
	serviceRegion: string;
	voiceName: string;
	ttsEngine: 'azure' | 'native';
	nativeVoice: string;
	playbackRate: number; // 0.5 to 2.0 (for native TTS)
	pitch: number; // 0.5 to 2.0 (for native TTS)
}

// Default settings
const DEFAULT_SETTINGS: AzureTTSSettings = {
	subscriptionKey: '',
	serviceRegion: 'eastasia',
	voiceName: 'zh-CN-XiaoxiaoNeural',
	ttsEngine: Platform.isMobile ? 'native' : 'azure', // Default to native on mobile
	nativeVoice: '',
	playbackRate: 1.0, // Normal speed
	pitch: 1.0 // Normal pitch
}

// Helper function to convert ArrayBuffer to base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
	const bytes = new Uint8Array(buffer);
	let binary = '';
	for (let i = 0; i < bytes.byteLength; i++) {
		binary += String.fromCharCode(bytes[i]);
	}
	return window.btoa(binary);
}

// Modal for mobile audio controls
class AudioControlModal extends Modal {
	private audio: HTMLAudioElement | null = null;
	private utterance: SpeechSynthesisUtterance | null = null;
	private playPauseButton: HTMLButtonElement;
	private onStopCallback: () => void;
	private plugin: AzureTTSPlugin;
	private rateSlider: HTMLInputElement | null = null;
	private pitchSlider: HTMLInputElement | null = null;
	private rateDisplay: HTMLElement | null = null;
	private pitchDisplay: HTMLElement | null = null;

	constructor(app: App, plugin: AzureTTSPlugin, audio: HTMLAudioElement | null, utterance: SpeechSynthesisUtterance | null, onStopCallback: () => void) {
		super(app);
		this.plugin = plugin;
		this.audio = audio;
		this.utterance = utterance;
		this.onStopCallback = onStopCallback;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.empty();
		contentEl.addClass('azure-tts-modal');

		contentEl.createEl('h3', { text: 'Audio Playback' });

		const controlsContainer = contentEl.createDiv({ cls: 'audio-controls' });

		// Play/Pause button
		this.playPauseButton = controlsContainer.createEl('button', {
			text: this.utterance ?
				(window.speechSynthesis.paused ? 'Resume' : 'Pause') :
				'Pause',
			cls: 'mod-cta'
		});
		this.playPauseButton.onclick = () => {
			if (this.utterance) {
				// Native TTS
				if (window.speechSynthesis.paused) {
					window.speechSynthesis.resume();
					this.playPauseButton.setText('Pause');
				} else if (window.speechSynthesis.speaking) {
					window.speechSynthesis.pause();
					this.playPauseButton.setText('Resume');
				}
			} else if (this.audio) {
				// Azure TTS
				if (this.audio.paused) {
					this.audio.play();
					this.playPauseButton.setText('Pause');
				} else {
					this.audio.pause();
					this.playPauseButton.setText('Resume');
				}
			}
		};

		// Stop button
		const stopButton = controlsContainer.createEl('button', {
			text: 'Stop',
			cls: 'mod-warning'
		});
		stopButton.onclick = () => {
			this.onStopCallback();
			this.close();
		};

		// Live controls for native TTS
		if (this.utterance) {
			const slidersContainer = contentEl.createDiv({ cls: 'tts-sliders' });

			// Speed control
			const speedContainer = slidersContainer.createDiv({ cls: 'slider-container' });
			speedContainer.createEl('label', { text: 'Speed: ' });
			this.rateDisplay = speedContainer.createEl('span', {
				text: `${this.plugin.settings.playbackRate.toFixed(1)}x`,
				cls: 'slider-value'
			});
			this.rateSlider = speedContainer.createEl('input', {
				type: 'range',
				attr: {
					min: '0.5',
					max: '2.0',
					step: '0.1',
					value: this.plugin.settings.playbackRate.toString()
				}
			});
			this.rateSlider.addEventListener('input', (e) => {
				const value = parseFloat((e.target as HTMLInputElement).value);
				this.plugin.settings.playbackRate = value;
				this.plugin.saveSettings();
				if (this.rateDisplay) this.rateDisplay.setText(`${value.toFixed(1)}x`);
			});

			// Pitch control
			const pitchContainer = slidersContainer.createDiv({ cls: 'slider-container' });
			pitchContainer.createEl('label', { text: 'Pitch: ' });
			this.pitchDisplay = pitchContainer.createEl('span', {
				text: `${this.plugin.settings.pitch.toFixed(1)}x`,
				cls: 'slider-value'
			});
			this.pitchSlider = pitchContainer.createEl('input', {
				type: 'range',
				attr: {
					min: '0.5',
					max: '2.0',
					step: '0.1',
					value: this.plugin.settings.pitch.toString()
				}
			});
			this.pitchSlider.addEventListener('input', (e) => {
				const value = parseFloat((e.target as HTMLInputElement).value);
				this.plugin.settings.pitch = value;
				this.plugin.saveSettings();
				if (this.pitchDisplay) this.pitchDisplay.setText(`${value.toFixed(1)}x`);
			});

			// Restart button for applying changes
			const restartButton = slidersContainer.createEl('button', {
				text: '🔄 Apply Changes',
				cls: 'mod-cta apply-changes-btn'
			});
			restartButton.onclick = () => {
				if (this.plugin.currentText) {
					window.speechSynthesis.cancel();
					setTimeout(() => this.plugin.startNativeTTS(this.plugin.currentText), 100);
				}
			};

			contentEl.createEl('p', {
				text: '🎚️ Adjust sliders then click Apply to restart with new settings',
				cls: 'setting-item-description',
				attr: { style: 'text-align: center; margin-top: 10px; font-size: 0.9em;' }
			});
		}

		// Update button text based on audio state
		if (this.audio) {
			this.audio.onplay = () => {
				if (this.playPauseButton) this.playPauseButton.setText('Pause');
			};

			this.audio.onpause = () => {
				if (this.playPauseButton) this.playPauseButton.setText('Resume');
			};

			this.audio.onended = () => {
				this.onStopCallback();
				this.close();
				new Notice('Finished reading.');
			};
		}
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

export default class AzureTTSPlugin extends Plugin {
	settings: AzureTTSSettings;
	voiceList: Voice[] = [];
	private audio: HTMLAudioElement | null = null;
	private statusBarItem: HTMLElement | null = null;
	private playPauseButton: HTMLButtonElement | null = null;
	private audioControlModal: AudioControlModal | null = null;
	private currentAudioUrl: string | null = null;
	private currentUtterance: SpeechSynthesisUtterance | null = null;
	private isNativePlaying: boolean = false;
	public currentText: string = ''; // Public for modal instant restart

	async onload() {
		await this.loadSettings();

		// Add a ribbon icon to trigger the reading
		this.addRibbonIcon('audio-file', 'Azure TTS Read Aloud', () => this.triggerReading());

		// Add the settings tab
		this.addSettingTab(new AzureTTSSettingTab(this.app, this));

		// Setup Media Session API for lock screen controls
		this.setupMediaSession();
	}

	onunload() {
		this.stopReading();
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	setupMediaSession() {
		// Setup Media Session API for lock screen controls (iOS/Mac)
		if ('mediaSession' in navigator) {
			navigator.mediaSession.setActionHandler('play', () => {
				if (this.isNativePlaying && window.speechSynthesis.paused) {
					window.speechSynthesis.resume();
				} else if (this.audio && this.audio.paused) {
					this.audio.play();
				}
			});

			navigator.mediaSession.setActionHandler('pause', () => {
				if (this.isNativePlaying && window.speechSynthesis.speaking) {
					window.speechSynthesis.pause();
				} else if (this.audio && !this.audio.paused) {
					this.audio.pause();
				}
			});

			navigator.mediaSession.setActionHandler('stop', () => {
				this.stopReading();
			});
		}
	}

	updateMediaSessionMetadata(title: string = 'Text-to-Speech') {
		if ('mediaSession' in navigator) {
			navigator.mediaSession.metadata = new MediaMetadata({
				title: title,
				artist: 'Obsidian Azure TTS',
				album: 'Text-to-Speech',
			});
		}
	}

	triggerReading() {
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!view) {
			new Notice('No active editor. Please open a note.');
			return;
		}

		const editor = view.editor;
		const fullText = editor.getValue();
		let textToRead = '';

		const selection = editor.getSelection();

		// Get text to read based on selection or cursor
		if (selection) {
			// If text is selected, read from the start of selection to the end of the document
			const startIndex = fullText.indexOf(selection);
			textToRead = fullText.substring(startIndex);
		} else {
			// If no text is selected, read from the cursor to the end of the document
			const cursorOffset = editor.posToOffset(editor.getCursor());
			textToRead = fullText.substring(cursorOffset);
		}

		// Smart behavior when already playing native TTS
		if (this.isNativePlaying && this.currentUtterance) {
			// If there's a new selection or different text, cancel and start new
			if (textToRead.trim() && textToRead !== this.currentText) {
				// New selection detected - restart with new text
				this.stopReading();
				this.startReading(textToRead);
				return;
			}

			// Same text - toggle pause/resume
			if (window.speechSynthesis.paused) {
				window.speechSynthesis.resume();
				new Notice('Resumed');
			} else if (window.speechSynthesis.speaking) {
				window.speechSynthesis.pause();
				new Notice('Paused');
			}
			return;
		}

		// Not currently playing - start reading
		if (textToRead.trim()) {
			this.startReading(textToRead);
		} else {
			new Notice('No text to read from the current position.');
		}
	}

	async getVoiceList(): Promise<Voice[]> {
		if (!this.settings.subscriptionKey || !this.settings.serviceRegion) {
			throw new Error('Subscription key or region is not set.');
		}

		const url = `https://${this.settings.serviceRegion}.tts.speech.microsoft.com/cognitiveservices/voices/list`;
		const response = await requestUrl({
			url,
			method: 'GET',
			headers: {
				'Ocp-Apim-Subscription-Key': this.settings.subscriptionKey,
			}
		});

		if (response.status !== 200) {
			throw new Error(`Failed to fetch voice list. Status: ${response.status}. Body: ${response.text}`);
		}

		return response.json as Voice[];
	}

	stopReading() {
		// Stop Azure TTS
		if (this.audio) {
			this.audio.pause();
			this.audio.src = '';
			this.audio = null;
		}

		// Stop native TTS
		if (this.isNativePlaying) {
			window.speechSynthesis.cancel();
			this.currentUtterance = null;
			this.isNativePlaying = false;
		}

		// Clean up blob/data URL if exists
		if (this.currentAudioUrl && this.currentAudioUrl.startsWith('blob:')) {
			URL.revokeObjectURL(this.currentAudioUrl);
		}
		this.currentAudioUrl = null;

		// Clean up desktop controls
		if (this.statusBarItem) {
			this.statusBarItem.remove();
			this.statusBarItem = null;
			this.playPauseButton = null;
		}

		// Clean up mobile modal
		if (this.audioControlModal) {
			this.audioControlModal.close();
			this.audioControlModal = null;
		}
	}

	setupStatusBarControls() {
		if (!this.audio) return;

		this.statusBarItem = this.addStatusBarItem();
		this.statusBarItem.empty();

		this.playPauseButton = this.statusBarItem.createEl('button', { text: 'Pause' });
		this.playPauseButton.onclick = () => {
			if (this.audio?.paused) {
				this.audio.play();
			} else {
				this.audio?.pause();
			}
		};

		const stopButton = this.statusBarItem.createEl('button', { text: 'Stop' });
		stopButton.onclick = () => {
			this.stopReading();
			new Notice('Playback stopped.');
		};

		this.audio.onplay = () => {
			if (this.playPauseButton) this.playPauseButton.setText('Pause');
		};

		this.audio.onpause = () => {
			if (this.playPauseButton) this.playPauseButton.setText('Resume');
		};

		this.audio.onended = () => {
			this.stopReading();
			new Notice('Finished reading.');
		};
	}

	setupMobileControls() {
		this.audioControlModal = new AudioControlModal(
			this.app,
			this,
			this.audio,
			this.currentUtterance,
			() => this.stopReading()
		);
		this.audioControlModal.open();
	}

	async startReading(text: string) {
		this.stopReading(); // Stop any previous playback

		// Route to correct TTS engine
		if (this.settings.ttsEngine === 'native') {
			this.startNativeTTS(text);
		} else {
			await this.startAzureTTS(text);
		}
	}

	startNativeTTS(text: string) {
		if (!window.speechSynthesis) {
			new Notice('❌ Native TTS not supported in this browser.');
			return;
		}

		try {
			// Save text for instant restart on speed/pitch change
			this.currentText = text;

			new Notice('Starting native speech...');

			this.currentUtterance = new SpeechSynthesisUtterance(text);

			// Configure voice if specified
			if (this.settings.nativeVoice) {
				const voices = window.speechSynthesis.getVoices();
				const selectedVoice = voices.find(v => v.name === this.settings.nativeVoice);
				if (selectedVoice) {
					this.currentUtterance.voice = selectedVoice;
				}
			}

			// Apply playback settings
			this.currentUtterance.rate = this.settings.playbackRate; // 0.5 to 2.0
			this.currentUtterance.pitch = this.settings.pitch; // 0.5 to 2.0

			// Update media session for lock screen controls
			this.updateMediaSessionMetadata('Reading with Native TTS');

			// Event handlers
			this.currentUtterance.onstart = () => {
				this.isNativePlaying = true;
				if (Platform.isMobile) {
					this.setupMobileControls();
				} else {
					this.setupNativeStatusBarControls();
				}
			};

			this.currentUtterance.onend = () => {
				this.stopReading();
				new Notice('Finished reading.');
			};

			this.currentUtterance.onerror = (e) => {
				console.error('Native TTS Error:', e);
				new Notice('❌ Native TTS failed.');
				this.stopReading();
			};

			window.speechSynthesis.speak(this.currentUtterance);

		} catch (e) {
			console.error('Native TTS Error:', e);
			new Notice('❌ Failed to start native TTS.');
			this.stopReading();
		}
	}

	setupNativeStatusBarControls() {
		this.statusBarItem = this.addStatusBarItem();
		this.statusBarItem.empty();

		this.playPauseButton = this.statusBarItem.createEl('button', {
			text: window.speechSynthesis.paused ? 'Resume' : 'Pause'
		});
		this.playPauseButton.onclick = () => {
			if (window.speechSynthesis.paused) {
				window.speechSynthesis.resume();
				if (this.playPauseButton) this.playPauseButton.setText('Pause');
			} else if (window.speechSynthesis.speaking) {
				window.speechSynthesis.pause();
				if (this.playPauseButton) this.playPauseButton.setText('Resume');
			}
		};

		const stopButton = this.statusBarItem.createEl('button', { text: 'Stop' });
		stopButton.onclick = () => {
			this.stopReading();
			new Notice('Playback stopped.');
		};
	}

	async startAzureTTS(text: string) {
		if (!this.settings.subscriptionKey || !this.settings.serviceRegion) {
			new Notice('Azure TTS settings are not configured.');
			return;
		}

		try {
			new Notice('Synthesizing speech...');
			const url = `https://${this.settings.serviceRegion}.tts.speech.microsoft.com/cognitiveservices/v1`;
			const ssml = `
                <speak version='1.0' xml:lang='${this.settings.voiceName.substring(0, 5)}'>
                    <voice xml:lang='${this.settings.voiceName.substring(0, 5)}' name='${this.settings.voiceName}'>
                        ${text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}
                    </voice>
                </speak>`;

			const response = await requestUrl({
				url,
				method: 'POST',
				headers: {
					'Ocp-Apim-Subscription-Key': this.settings.subscriptionKey,
					'Content-Type': 'application/ssml+xml',
					'X-Microsoft-OutputFormat': 'audio-24khz-96kbitrate-mono-mp3',
					'User-Agent': 'ObsidianAzureTTSPlugin'
				},
				body: ssml
			});

			if (response.status !== 200) {
				throw new Error(`Failed to synthesize speech. Status: ${response.status}. Body: ${response.text}`);
			}

			const audioData = response.arrayBuffer;

			// iOS-compatible audio playback using base64 data URL
			// This approach works better on iOS than blob URLs
			const base64Audio = arrayBufferToBase64(audioData);
			const dataUrl = `data:audio/mpeg;base64,${base64Audio}`;

			this.audio = new Audio();
			this.audio.src = dataUrl;
			this.currentAudioUrl = dataUrl;

			// Critical for iOS: load the audio before playing
			this.audio.load();

			// Set up platform-specific controls
			if (Platform.isMobile) {
				this.setupMobileControls();
			} else {
				this.setupStatusBarControls();
			}

			// Start playback
			await this.audio.play();

		} catch (e) {
			console.error("Azure TTS Error:", e);

			// Provide user-friendly error messages
			const errorMsg = e instanceof Error ? e.message : String(e);

			if (errorMsg.includes('429')) {
				new Notice('⚠️ Azure rate limit exceeded. Trying native TTS fallback...', 5000);
				// Auto-fallback to native TTS
				if (window.speechSynthesis) {
					this.startNativeTTS(text);
				} else {
					new Notice('❌ Native TTS not available. Please wait and try again later.', 6000);
				}
			} else if (errorMsg.includes('401') || errorMsg.includes('403')) {
				new Notice('❌ Invalid Azure credentials. Please check your subscription key and region in settings.', 6000);
			} else if (errorMsg.includes('Connection') || errorMsg.includes('network')) {
				new Notice('❌ Network error. Please check your internet connection.', 5000);
			} else {
				new Notice(`❌ Failed to synthesize speech: ${errorMsg}`, 6000);
			}

			this.stopReading();
		}
	}
}

// Settings Tab implementation
class AzureTTSSettingTab extends PluginSettingTab {
	plugin: AzureTTSPlugin;

	constructor(app: App, plugin: AzureTTSPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl('h2', { text: 'Azure Text-to-Speech Settings' });

		// TTS Engine Selection
		new Setting(containerEl)
			.setName('TTS Engine')
			.setDesc('Choose between Azure TTS (high-quality, requires API key) or Native TTS (free, unlimited, works offline).')
			.addDropdown(dropdown => dropdown
				.addOption('native', '🎯 Native TTS (Recommended for Mobile)')
				.addOption('azure', '☁️ Azure TTS (Premium Quality)')
				.setValue(this.plugin.settings.ttsEngine)
				.onChange(async (value: 'azure' | 'native') => {
					this.plugin.settings.ttsEngine = value;
					await this.plugin.saveSettings();
					this.display(); // Refresh to show/hide Azure settings
				}));

		// Show Azure settings only if Azure engine is selected
		if (this.plugin.settings.ttsEngine === 'azure') {
			new Setting(containerEl)
				.setName('Subscription Key')
				.setDesc('Enter your Azure Speech Service subscription key.')
				.addText(text => text
					.setPlaceholder('Enter your key')
					.setValue(this.plugin.settings.subscriptionKey)
					.onChange(async (value) => {
						this.plugin.settings.subscriptionKey = value.trim();
						await this.plugin.saveSettings();
					}));

			new Setting(containerEl)
				.setName('Service Region')
				.setDesc('Enter your Azure Speech Service region (e.g., eastus, eastasia).')
				.addText(text => text
					.setPlaceholder('Enter your region')
					.setValue(this.plugin.settings.serviceRegion)
					.onChange(async (value) => {
						this.plugin.settings.serviceRegion = value.trim();
						await this.plugin.saveSettings();
					}));

			const validationSetting = new Setting(containerEl)
				.setName('Validate and Fetch Voices')
				.setDesc('Click to validate your credentials and fetch the available voices.')
				.addButton(button => {
					button
						.setButtonText('Validate and Fetch')
						.onClick(async () => {
							button.setDisabled(true).setButtonText('Validating...');
							try {
								this.plugin.voiceList = await this.plugin.getVoiceList();
								new Notice('Successfully validated and fetched voice list!');
								// Re-render the settings tab to show the voice dropdown
								this.display();
							} catch (e) {
								console.error(e);
								new Notice('Validation failed. Please check your key/region and console for details.');
								button.setDisabled(false).setButtonText('Validate and Fetch');
							}
						});
				});

			if (this.plugin.voiceList.length > 0) {
				new Setting(containerEl)
					.setName('Azure Voice')
					.setDesc('Select the Azure voice to use for text-to-speech.')
					.addDropdown(dropdown => {
						this.plugin.voiceList.forEach(voice => {
							dropdown.addOption(voice.ShortName, `${voice.DisplayName} (${voice.Locale})`);
						});
						dropdown
							.setValue(this.plugin.settings.voiceName)
							.onChange(async (value) => {
								this.plugin.settings.voiceName = value;
								await this.plugin.saveSettings();
							});
					});
			} else {
				validationSetting.setDesc('Click to validate your credentials and fetch the available voices. You must do this before you can select a voice.');
			}
		} else {
			// Native TTS settings
			containerEl.createEl('h3', { text: 'Native TTS Settings' });

			new Setting(containerEl)
				.setName('Native Voice')
				.setDesc('Select a voice from your device. Leave empty to use the default voice.')
				.addDropdown(dropdown => {
					dropdown.addOption('', 'Default Voice');

					// Trigger voice loading (important for iOS)
					let voices = window.speechSynthesis.getVoices();

					// If voices haven't loaded yet, wait for them
					if (voices.length === 0) {
						window.speechSynthesis.onvoiceschanged = () => {
							voices = window.speechSynthesis.getVoices();
							this.display(); // Refresh when voices are loaded
						};
					}

					// Sort voices: Chinese first, then by language
					const sortedVoices = voices.sort((a, b) => {
						const aIsChinese = a.lang.startsWith('zh');
						const bIsChinese = b.lang.startsWith('zh');

						if (aIsChinese && !bIsChinese) return -1;
						if (!aIsChinese && bIsChinese) return 1;

						// Within same language category, sort by name
						return a.name.localeCompare(b.name);
					});

					sortedVoices.forEach(voice => {
						// Enhanced voice labels showing quality
						const quality = voice.name.includes('Premium') ? ' 👑' :
							voice.name.includes('Enhanced') ? ' ✨' : '';
						dropdown.addOption(voice.name, `${voice.name} (${voice.lang})${quality}`);
					});

					dropdown
						.setValue(this.plugin.settings.nativeVoice)
						.onChange(async (value) => {
							this.plugin.settings.nativeVoice = value;
							await this.plugin.saveSettings();
						});
				});

			// Load voices button (sometimes voices load asynchronously)
			new Setting(containerEl)
				.setName('Refresh Voices')
				.setDesc('Click to reload available voices from your system.')
				.addButton(button => button
					.setButtonText('Refresh')
					.onClick(() => {
						// Trigger voices reload
						window.speechSynthesis.getVoices();
						setTimeout(() => this.display(), 100);
					}));

			// Playback Speed Control
			new Setting(containerEl)
				.setName('Playback Speed')
				.setDesc(`Adjust reading speed (current: ${this.plugin.settings.playbackRate.toFixed(1)}x)`)
				.addSlider(slider => slider
					.setLimits(0.5, 2.0, 0.1)
					.setValue(this.plugin.settings.playbackRate)
					.onChange(async (value) => {
						this.plugin.settings.playbackRate = value;
						await this.plugin.saveSettings();
						this.display(); // Refresh to update description
					})
					.setDynamicTooltip());

			// Pitch Control
			new Setting(containerEl)
				.setName('Voice Pitch')
				.setDesc(`Adjust voice pitch (current: ${this.plugin.settings.pitch.toFixed(1)}x)`)
				.addSlider(slider => slider
					.setLimits(0.5, 2.0, 0.1)
					.setValue(this.plugin.settings.pitch)
					.onChange(async (value) => {
						this.plugin.settings.pitch = value;
						await this.plugin.saveSettings();
						this.display(); // Refresh to update description
					})
					.setDynamicTooltip());

			containerEl.createEl('p', {
				text: '💡 Native TTS uses your device\'s built-in voices. No internet or API key required!',
				cls: 'setting-item-description'
			});
		}
	}
}