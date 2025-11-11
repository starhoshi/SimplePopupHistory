# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Simple Popup History is a Chrome extension that displays browsing history from the past 30 days in a searchable popup. It complies with Manifest V3 and features real-time search, copy functionality, and light/dark mode support.

## Directory Structure

- `extension/` - Production-ready extension files (load this folder in Chrome)
  - `manifest.json` - Chrome extension manifest file (Manifest V3)
  - `popup.html` - Popup UI (includes inline CSS)
  - `popup.js` - Popup logic (history retrieval, search, display)
  - `icon*.png` - Icons in various sizes (16px, 48px, 128px)
  - `_locales/` - Internationalization resources (Chrome i18n)
    - `en/messages.json` - English messages (default locale)
    - `ja/messages.json` - Japanese messages
- `design/` - Design assets
  - `icon512.png` - Source icon image
  - `icon.svg` - Icon in SVG format
  - `simplepopuphistory.key` - Keynote design file

## Key Components

### popup.js Architecture

1. **Initialization Flow** (`init()`)
   - Initially displays only 20 items for instant popup rendering
   - Lazy loads remaining 980 items in background after 100ms (max 1000 items)
   - Chrome History API: Retrieves history from the past 30 days

2. **History Display** (`displayHistory()`)
   - Favicons use Google's favicon service (64px size)
   - SVG icons (copy and check) are defined inline
   - Uses `escapeHtml()` for XSS prevention
   - Stores `data-url` and `data-title` on each item

3. **Search Functionality**
   - Real-time search (targets both title and URL)
   - Filters and re-displays `allHistory` array

4. **Copy Functionality**
   - Separate copy buttons for title and URL
   - Copy buttons only visible on hover (opacity control)
   - Changes to check icon on successful copy, resets when hover ends

5. **Navigation**
   - Normal click: Opens in current tab
   - Cmd/Ctrl+Click: Opens in new tab
   - Uses `stopPropagation()` on copy button clicks to prevent navigation

### popup.html Structure

- All styles are inline (within `<style>` tag)
- Light/dark mode automatically switches via `@media (prefers-color-scheme: dark)`
- Layout: Header (search), scrollable history list, footer (view all button)
- Initially sets `#app` to `visibility: hidden`, displays after history loads (prevents flashing)

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

### Message Definitions

Define messages for each language in `_locales/{language_code}/messages.json`:

```json
{
  "extName": {
    "message": "Simple Popup History",
    "description": "Name of the extension"
  },
  "searchPlaceholder": {
    "message": "Search history...",
    "description": "Placeholder text for search input"
  }
}
```

### Placeholder Feature

Use `placeholders` for messages containing dynamic values:

```json
{
  "minutesAgo": {
    "message": "$COUNT$ minutes ago",
    "description": "Time format for minutes",
    "placeholders": {
      "count": {
        "content": "$1"
      }
    }
  }
}
```

In JavaScript, use `chrome.i18n.getMessage("minutesAgo", [number])`.

### Usage in manifest.json

Internationalize extension name and description:

```json
{
  "name": "__MSG_extName__",
  "description": "__MSG_extDescription__"
}
```

### Usage in HTML

Specify message keys using `data-i18n` or `data-i18n-placeholder` attributes:

```html
<!-- Text content -->
<button id="viewAllHistory" data-i18n="viewAllHistory"></button>

<!-- Placeholder -->
<input type="text" id="searchBar" data-i18n-placeholder="searchPlaceholder">
```

Set values to these elements using `chrome.i18n.getMessage()` during JavaScript initialization.

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
