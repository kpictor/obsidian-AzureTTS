# Azure TTS for Obsidian

A powerful Text-to-Speech plugin for Obsidian with **native iOS support**, **offline capability**, and **premium voice options**.

[![Version](https://img.shields.io/badge/version-1.5.0-blue.svg)](https://github.com/kpictor/obsidian-AzureTTS)
[![Platform](https://img.shields.io/badge/platform-Desktop%20%7C%20iOS%20%7C%20iPadOS-green.svg)](https://github.com/kpictor/obsidian-AzureTTS)

## ✨ Features

### 🎯 Dual TTS Engines
- **Azure TTS**: Premium neural voices with 400+ options
- **Native TTS**: Free, unlimited, offline reading using device voices

### 📱 Full iOS/Mac Support
- ✅ Lock screen controls (play/pause from Control Center)
- ✅ Modern flow window design with glassy effects
- ✅ Touch-friendly controls optimized for mobile
- ✅ Works offline with native TTS

### 🎚️ Advanced Playback Controls
- Adjustable speed (0.5x - 2.0x)
- Adjustable pitch (0.5x - 2.0x)
- Play, pause, resume, and stop controls
- Smart button: detect new selections and auto-switch

### 🌍 Voice Selection
- 400+ Azure neural voices (when using Azure)
- Chinese voices sorted to top
- Premium (👑) and Enhanced (✨) voice indicators
- System voices for native TTS

## 🚀 Quick Start

### Option 1: Native TTS (Recommended for Mobile)
1. Install the plugin from Obsidian Community Plugins
2. Open Settings → Azure TTS
3. Select **"Native TTS"** as engine
4. Choose a voice (optional)
5. Click the ribbon icon to start reading!

**No API keys required! Works offline!**

### Option 2: Azure TTS (Premium Quality)
1. Get Azure Speech Service credentials from [Azure Portal](https://portal.azure.com)
2. Open Settings → Azure TTS
3. Select **"Azure TTS"** as engine
4. Enter your **Subscription Key** and **Service Region**
5. Click **"Validate and Fetch Voices"**
6. Select your preferred voice
7. Start reading!

## 📖 How to Use

1. **Position cursor** or **select text** in your note
2. **Click the audio icon** in the ribbon (left sidebar)
3. **Smart playback**:
   - New selection → Switches to new text
   - Same text → Pauses/resumes
   - From cursor → Reads to end of note

### Platform-Specific Controls

**Desktop**: Status bar buttons (pause/resume/stop)  
**Mobile/iOS**: Modal with playback controls + speed/pitch sliders

### Lock Screen Controls (iOS/Mac)
When using native TTS, control playback from:
- iOS Control Center
- Mac Touch Bar / media keys
- Lock screen widgets

## ⚙️ Settings

### Engine Selection
- **Native TTS**: Free, unlimited, works offline
- **Azure TTS**: Premium quality, requires API key

### Playback Options
- Speed: 0.5x - 2.0x (normal = 1.0x)
- Pitch: 0.5x - 2.0x (normal = 1.0x)
- Voice selection per engine

### Azure Configuration
- Subscription Key
- Service Region
- Voice selection from 400+ options

## 🎨 UI Features

- Modern flow window design
- Glassy backdrop blur effects
- Smooth animations
- Gradient accents
- Touch-friendly buttons (48px minimum)

## 💡 Tips

- **Mobile users**: Use Native TTS to avoid rate limits
- **Offline reading**: Native TTS works without internet
- **Change speed/pitch**: Adjust sliders and click "Apply Changes"
- **Switch text**: Select new text and click button to immediately switch
- **Premium iOS voices**: Download via Settings → Accessibility → Spoken Content → Voices

## 🔧 Technical Details

- Built with TypeScript and esbuild
- Uses Web Speech API for native TTS
- Media Session API for lock screen controls
- Platform detection for optimal UX
- Base64 audio encoding for iOS compatibility

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Credits

Author: [kpictor](https://github.com/kpictor)

## 🐛 Support

Report issues on [GitHub](https://github.com/kpictor/obsidian-AzureTTS/issues)

---

**Enjoy listening to your notes!** 🎧
