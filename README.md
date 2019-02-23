dataslayer
==========

A Chrome extension to enhance debugging of some frequently-used tag management platforms (Google Tag Manager and Tealium) in combination with some frequently-used tags (Google Analytics, Adobe Analytics/Omniture, Floodlight).

Installation
------------
To use the unpacked source version, enable Developer mode in the [Chrome extensions page](chrome://extensions/) and *Load unpacked extension* from the checked-out **src** folder.

The latest official version will always be available at the [Chrome Web Store](https://chrome.google.com/webstore/detail/dataslayer/ikbablmmjldhamhcldjjigniffkkjgpo).

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

Note that vertical alignment between the data layer and any fired tags does not necessarily indicate a tie between the two. If a page contains only a data layer, or only tags, that side of the panel will expand to take up the width of the entire panel.

Settings
--------
### General
- show data layer presence: enable (default) or disable the TMS logo / X in each page group. Useful for disabling if you are using dataslayer for e.g. pure GA debugging rather than tag management debugging.
- auto-collapse nested data layer variables: when this option is enabled (default), nested variables such as Google Analytics enhanced ecommerce will automatically be collapsed to save space.
- block tags from firing: requires use of the Chrome dev or beta channels. When this option is enabled, supported tags will be blocked from actually sending to the analytics platform. Note that blocking does not take the Tags selections into account (i.e. all supported tags are blocked, regardless of whether or not they are shown).

### Tags
All supported tag types are shown by default; these can be individually disabled.

### Ignored IDs
To filter out tags hitting specific analytics properties, enter the property IDs here.

Developing
--------
- `npm run start` (or `npm run start-win` on Windows) will start a local development server for working on UI
- `npm run build` packages the extension into /dist/build - /dist is the folder to load as an unpacked extension

Misc
----
dataslayer was built with and thanks to the following:
- React
- [Google Data Layer Helper Library](https://github.com/google/data-layer-helper)
- [Pure](http://purecss.io/)
- [jQuery](http://jquery.com/)
- [leanModal](http://leanmodal.finelysliced.com.au/)
- [Open Sans](http://www.google.com/fonts/specimen/Open+Sans)
- [Massimo Artizzu's O.o polyfill](https://github.com/MaxArt2501/object-observe)

dataslayer is under the MIT License. See LICENSE.md.

