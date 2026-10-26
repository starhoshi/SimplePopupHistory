# AGENTS.md

## Project Overview

Simple Popup History is a Chrome extension that displays browsing history from the past 30 days in a searchable popup. It complies with Manifest V3 and features real-time search, copy functionality, and light/dark mode support.

## Development Commands

### Local Testing

1. Open `chrome://extensions/` in Chrome
2. Enable Developer mode
3. Click "Load unpacked" and select the `extension/` folder

### Updating Icons

```bash
# Generate from design/icon512.png (macOS sips command)
sips -z 16 16 design/icon512.png --out extension/icon16.png
sips -z 48 48 design/icon512.png --out extension/icon48.png
sips -z 128 128 design/icon512.png --out extension/icon128.png
```

### Release

```bash
cd extension
zip -r ../simple-popup-history.zip .
```

Upload the generated ZIP file to Chrome Web Store Developer Dashboard.

## Internationalization (i18n) Implementation

This extension uses the Chrome i18n API for multilingual support.

### Basic Structure

- **Default locale**: `en` (English) - Set via `"default_locale": "en"` in manifest.json
- **Supported languages**: English (en), Japanese (ja)

### Adding a New Language

1. Create `extension/_locales/{language_code}/` folder
2. Create `messages.json` and translate all existing message keys
3. Reload extension (automatically selects based on browser language settings)

## Technical Considerations

- **Manifest V3 Compliance**: Only uses `chrome.history` permission
- **Performance**: Improves perceived speed with lazy loading after initial 20-item display
- **Security**: XSS prevention via `escapeHtml()`, no external scripts
- **Accessibility**: Keeps UI clean by showing copy buttons only on hover
- **Responsive Design**: Fixed-size popup (480x550px)
- **History Retrieval Limits**: Chrome History API constraints limit to max 1000 items from past 30 days
- **Internationalization**: Full multilingual support via Chrome i18n API, automatic switching based on browser settings

文書だけの変更は、内容・参照先・差分を確認する。アプリのビルド・起動・配布は不要。
