# Simple Popup History

A Chrome extension that displays and searches browsing history in a popup.

[日本語版 README はこちら](./README_ja.md)

## Features

- Display browsing history (up to 1000 items from the past 30 days)
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

[Install from Chrome Web Store](https://chromewebstore.google.com/detail/simple-popup-history/kceolimggmhbcildnddcfnnoogiegijd)

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

## Technical Implementation

### Chrome APIs Used

- **Chrome History API** (`chrome.history.search`)
  - Retrieves browsing history from the past 30 days
  - Maximum 1000 items per query due to API limitations
  - Searches by text, title, and URL

- **Chrome i18n API** (`chrome.i18n`)
  - Full internationalization support
  - Automatic language selection based on browser settings

- **Chrome Tabs API** (`chrome.tabs`)
  - Navigation to history items
  - Support for opening in new tabs

### Performance Optimizations

- **Lazy Loading**: Initially loads only 20 items for instant popup display
- **Background Loading**: Loads remaining items (up to 1000) after 100ms
- **Smart Re-rendering**: Only updates display when search is not active

### Security Features

- **XSS Prevention**: All user-generated content is escaped using `escapeHtml()`
- **No External Scripts**: All code is inline for security
- **Manifest V3**: Uses the latest Chrome extension security standards
- **Minimal Permissions**: Only requests `history` permission

### Architecture

- **Single-file Implementation**: Self-contained `popup.js` with no dependencies
- **Inline CSS**: All styles in `popup.html` for CSP compliance
- **Event-driven**: Uses native DOM events for all interactions
- **Responsive UI**: Fixed 480x550px popup with efficient scrolling

## Supported Languages

- English (default)
- Japanese (日本語)

## License

MIT
