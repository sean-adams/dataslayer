# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

dataslayer is a Chrome and Firefox browser extension for debugging tag management platforms (Google Tag Manager, Adobe DTM/Launch, Tealium, TagCommander) and analytics implementations. It's built using React with create-react-app.

**Version 2.0+ uses Chrome Extension Manifest v3** - this removed the network request blocking functionality that was available in v1.x.

## Architecture

The extension operates across multiple contexts:
- **React DevTools Panel** (`src/`): Main UI components built with React
- **Service Worker** (`public/background.js`): Handles extension lifecycle and message passing (Manifest v3)
- **Content Scripts** (`public/content.js`, `public/inject.js`): Injected into web pages to monitor data layers
- **DevTools Integration** (`public/devtools.html`): Registers the extension panel in browser DevTools

State management is centralized in `App.js`, which:
- Monitors network requests and communicates with background/content scripts
- Manages data layer state for multiple platforms (GTM, DTM, Tealium, etc.)
- Cascades data down to presentation components (`Page.js`, `Tags.js`, `Datalayers.js`, etc.)

The extension monitors various data layer implementations:
- Google Tag Manager (`dataLayer`)
- Adobe DTM/Launch (`digitalData`, `_satellite`)
- Tealium (`utag_data`)
- TagCommander (`tc_vars`)

## Development Commands

**Setup and Build:**
```bash
npm install
npm run build     # Creates production build in ./build/ folder
npm run package   # Builds and creates package.zip for distribution
```

**Development:**
```bash
npm start         # Starts local dev server with demo data (UI development only)
npm test          # Runs React test suite
```

**Extension Testing:**
After `npm run build`, load the extension:
- Chrome: Enable Developer mode at chrome://extensions/ → Load unpacked from `./build/`
- Firefox: Go to about:debugging → Load Temporary Add-on from `./build/manifest.json`

## Critical Build Requirements

- **Must set `INLINE_RUNTIME_CHUNK=false`** - This is handled by the `.env` file and package.json scripts
- Extension uses **Manifest v3** format in `public/manifest.json` (copied to build during build process)
- Static assets in `public/` are copied directly to build output
- Service Worker (`background.js`) replaces traditional background scripts

## Manifest v3 Migration Notes

Version 2.0+ migrated from Manifest v2 to v3 with these key changes:
- **REMOVED**: Network request blocking functionality (no longer possible in Manifest v3)
- **CHANGED**: `background.scripts` → `background.service_worker`
- **CHANGED**: `browser_action` → `action`
- **CHANGED**: `chrome.tabs.executeScript()` → `chrome.scripting.executeScript()`
- **CHANGED**: Host permissions moved from `permissions` to `host_permissions`

## Testing

The extension can be developed in two modes:
1. **Extension mode**: Full functionality with actual browser extension APIs
2. **Demo mode**: UI development using `demoData.js` when not running as extension

Use `npm start` for UI development, but must build and reload extension for full testing.