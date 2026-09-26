# Derot — Minimal YouTube

Zero-distraction YouTube for Chrome. Search and watch only. No feed to fall into.

## What it does

- Home `/` becomes a centered search box (no feed)
- `/shorts/*` redirects to `/watch?v=*`
- `/feed/trending`, `/feed/explore`, `/feed/shorts` redirect home
- Hides: Shorts shelves/links, sidebar recommendations + live chat, end screens/cards, comments, left guide
- Popup toggles to re-enable anything (stored in `chrome.storage.sync`)

## Install (unpacked)

1. Open `chrome://extensions`
2. Enable Developer mode (top right)
3. Load unpacked → select this folder
4. Open `youtube.com`, search for what you need

## Files

- `manifest.json` — MV3, `storage` only, runs on `youtube.com`
- `content.css` — all hiding, gated by `html[data-derot-hide-*]`
- `content.js` — defaults (no flash), SPA redirects, home search box, storage sync
- `popup.html` — 5 checkboxes, inline style + script (no deps)
- `icons/icon128.png` — extension icon

## Toggles

Hide home feed / Block Shorts / Hide recommendations / Hide end screens / Hide comments.
