dataslayer
==========

A Chrome extension to enhance debugging of some frequently-used tag management platforms (Google Tag Manager, Adobe DTM / Launch, Tealium, TagCommander) in combination with some frequently-used tags (Google Analytics, Adobe Analytics/Omniture, Floodlight).

Installation
------------
The latest official version will always be available at the [Chrome Web Store](https://chrome.google.com/webstore/detail/dataslayer/ikbablmmjldhamhcldjjigniffkkjgpo).

If you're working on the source, please see Developing.

Use
---
A new panel will appear in Developer Tools titled **dataslayer**, containing a page group and URL for each pageload in the tab, with each push to the dataLayer variable (in the case of GTM's array-based data layer) appearing in a subgroup.

![](http://i.imgur.com/ffdmxmU.png)

1. Current URL / TMS logo (or X if no TMS found); click to collapse/expand this page
2. TMS container ID; becomes a dropdown menu if multiple containers are present
3. Data layer items; items with a **+** are objects containing sub-items and can be expanded one level by clicking **+** or expanded fully by shift-clicking **+**
4. Information on fired tags (GA, Floodlight, SiteCatalyst); click **+** here to see all parameters in the request
5. dataslayer settings and information
6. Clear history

All items are in reverse chronological order (newest on top).

Note that vertical alignment between the data layer and any fired tags does **not** necessarily indicate a tie between the two. If a page contains only a data layer, or only tags, that side of the panel will expand to take up the width of the entire panel.

Import / Export
---------------
dataslayer allows you to export your current session to a JSON file. This file can then be imported later to review or confirm the output of a previous session.

Search
------
dataslayer allows you to search for a specific key or value within the session. When you enter search mode, all page groups will be exposed; as you type, only data layer entries and tags that include your text will be included.

Search mode can be toggled with the keyboard shortcut Ctrl+Alt+F

The search basis is a simple ```JSON.stringify()``` of the tag or data layer values.


Settings
--------
### General
- **show data layer presence**: enable (default) or disable the TMS logo / X in each page group. Useful for disabling if you are using dataslayer for e.g. pure GA debugging rather than tag management debugging.
- **auto-collapse nested data layer variables**: when this option is enabled (default), nested variables such as Google Analytics enhanced ecommerce will automatically be collapsed to save space.
- **auto-collapse gtm.\* events**: when this option is enabled, data layer events like gtm.click and gtm.scrollDepth will be collapsed by default; click the event to toggle it.
- **hide empty data layer variables**: when enabled, if no value is set for a key, hide it entirely.
- **show array indices**: when enabled, show a faint indicator of the array index for values inside array-like data layers.
- **block tags from firing**: requires use of the Chrome dev or beta channels. When this option is enabled, supported tags will be blocked from actually sending to the analytics platform. Note that blocking does not take the Tags selections into account (i.e. all supported tags are blocked, regardless of whether or not they are shown).

### Tags
All supported tag types are shown by default; these can be individually disabled.

### Ignored IDs
To filter out tags hitting specific analytics properties, enter the property IDs here.

### Additional data layer objects
Add global Javascript objects to watch here (e.g. _digitalData_).

Developing
--------
dataslayer is built with create-react-app and depends on react-scripts. This makes the build process very easy, although it makes live debugging *as an extension* slightly annoying.

To use the development version, enable Developer mode in the [Chrome extensions page](chrome://extensions/), ```npm run build```, and *Load unpacked extension* from the **build** folder. You will need to reload the extension from the same page each time you build.

- `npm run start` will start a local development server for working on UI only
- `npm run build` packages the extension into /build - /build is the folder to load as an unpacked extension

In general, data layer / tag state is managed solely in App (which is also responsible for monitoring network requests and communicating with the background / content scripts) and cascades down to a number of presentation components.

Misc
----
dataslayer was built with and thanks to the following:
- React / create-react-app
- [Google Data Layer Helper Library](https://github.com/google/data-layer-helper)
- [Pure](http://purecss.io/)
- [jQuery](http://jquery.com/)
- [Open Sans](http://www.google.com/fonts/specimen/Open+Sans)
- [Massimo Artizzu's O.o polyfill](https://github.com/MaxArt2501/object-observe)

dataslayer is under the MIT License. See LICENSE.md.

