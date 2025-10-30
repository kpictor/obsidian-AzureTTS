import { App, MarkdownView, Notice, Plugin, PluginSettingTab, Setting, requestUrl } from 'obsidian';

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
}

// Default settings
const DEFAULT_SETTINGS: AzureTTSSettings = {
	subscriptionKey: '',
	serviceRegion: 'eastasia',
	voiceName: 'zh-CN-XiaoxiaoNeural' // A default voice
}

export default class AzureTTSPlugin extends Plugin {
	settings: AzureTTSSettings;
	voiceList: Voice[] = [];
	private audio: HTMLAudioElement | null = null;
	private statusBarItem: HTMLElement | null = null;
	private playPauseButton: HTMLButtonElement | null = null;


	async onload() {
		await this.loadSettings();

		// Add a ribbon icon to trigger the reading
		this.addRibbonIcon('audio-file', 'Azure TTS Read Aloud', () => this.triggerReading());

		// Add the settings tab
		this.addSettingTab(new AzureTTSSettingTab(this.app, this));
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
		if (selection) {
			// If text is selected, read from the start of selection to the end of the document
			const startIndex = fullText.indexOf(selection);
			textToRead = fullText.substring(startIndex);
		} else {
			// If no text is selected, read from the cursor to the end of the document
			const cursorOffset = editor.posToOffset(editor.getCursor());
			textToRead = fullText.substring(cursorOffset);
		}

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
		if (this.audio) {
			this.audio.pause();
			URL.revokeObjectURL(this.audio.src);
			this.audio = null;
		}
		if (this.statusBarItem) {
			this.statusBarItem.remove();
			this.statusBarItem = null;
			this.playPauseButton = null;
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


	async startReading(text: string) {
		this.stopReading(); // Stop any previous playback

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
			const blob = new Blob([audioData], { type: 'audio/mpeg' });
			const audioUrl = URL.createObjectURL(blob);

			this.audio = new Audio(audioUrl);
			this.setupStatusBarControls();
			this.audio.play();

		} catch (e) {
			console.error("Azure TTS Error:", e);
			new Notice("Failed to synthesize speech. Check console for details.");
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
				.setName('Voice')
				.setDesc('Select the voice to use for text-to-speech.')
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
	}
}