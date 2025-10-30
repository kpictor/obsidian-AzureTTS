# Azure TTS for Obsidian

This plugin integrates Microsoft Azure's Text-to-Speech service directly into Obsidian, allowing you to listen to your notes with high-quality neural voices.

## Features

- **One-Click Reading**: A convenient icon in the left-hand ribbon menu to start reading your notes.
- **Intelligent Playback**:
    - If you have text selected, playback will start from your selection and continue to the end of the note.
    - If you have no text selected, playback will start from your current cursor position.
- **Playback Controls**: A simple controller appears in the status bar during playback, allowing you to pause, resume, and stop the audio.
- **Easy Voice Selection**: Validate your Azure credentials and fetch a list of available voices directly within the plugin's settings.

## How to Set Up

1.  **Install the Plugin**: Install the Azure TTS plugin from the community plugins list in Obsidian.
2.  **Configure Settings**:
    - Open Obsidian's settings and navigate to "Azure TTS".
    - Enter your **Subscription Key** and **Service Region** from your Azure Speech Service resource.
    - Click the **"Validate and Fetch Voices"** button. If your credentials are correct, a success message will appear.
    - A new **"Voice"** dropdown menu will appear. Select your preferred voice from the list. Your settings are saved automatically.

## How to Use

1.  **Open a Note**: Open any note you wish to have read aloud.
2.  **Position Your Cursor or Select Text**:
    - To read from a specific point, place your cursor where you want to begin.
    - To read a specific section and everything after it, highlight the desired text.
3.  **Click the Ribbon Icon**: Click the **audio file icon** (looks like a musical note on a page) in Obsidian's left-hand ribbon menu.
4.  **Control Playback**:
    - Speech synthesis will begin. A notice will confirm it's "Synthesizing speech...".
    - A new set of controls will appear in the bottom status bar.
    - Use the **"Pause" / "Resume"** button to control playback.
    - Use the **"Stop"** button to end the reading completely. The controls will disappear.
    - When the reading is finished, the controls will also disappear automatically.
