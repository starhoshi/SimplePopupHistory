# Simple Popup History

A Chrome extension that displays and searches browsing history in a popup.

[日本語版 README はこちら](./README_ja.md)

## Features

- Display browsing history from the past 7 days (up to 1000 items)
- Real-time search functionality (titles and URLs)
- Copy titles and URLs with one click
- Visual feedback when copying
- Light/Dark mode support
- Open in new tab with Cmd/Ctrl+Click
- Navigate to Chrome history page

## Installation

### Local Development

1. Open `chrome://extensions/` in Chrome
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select the `extension/` folder

### Chrome Web Store

(Link will be added after publication)

## Directory Structure

```
browserhistory/
├── extension/              # Production-ready extension files
│   ├── manifest.json
│   ├── popup.html
│   ├── popup.js
│   ├── icon16.png
│   ├── icon48.png
│   ├── icon128.png
│   └── _locales/           # Internationalization
│       ├── en/
│       │   └── messages.json
│       └── ja/
│           └── messages.json
├── design/                 # Design assets
│   ├── icon512.png
│   ├── icon.svg
│   └── simplepopuphistory.key
└── README.md
```

## Development

### Updating Icons

```bash
# Generate from design/icon512.png
cd /path/to/browserhistory
sips -z 16 16 design/icon512.png --out extension/icon16.png
sips -z 48 48 design/icon512.png --out extension/icon48.png
sips -z 128 128 design/icon512.png --out extension/icon128.png
```

### Adding Languages

1. Create a new folder in `extension/_locales/` (e.g., `fr/`)
2. Copy `messages.json` from `en/` or `ja/`
3. Translate all message values

### Release Process

1. Verify contents of `extension/` directory
2. Create ZIP file:
   ```bash
   cd extension
   zip -r ../simple-popup-history.zip .
   ```
3. Upload to Chrome Web Store Developer Dashboard

## Supported Languages

- English (default)
- Japanese (日本語)

## License

MIT
