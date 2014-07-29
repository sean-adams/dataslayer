dataslayer
==========

A Chrome extension to enhance Google Tag Manager dataLayer debugging (and other tags as well).

Installation
------------
To use the unpacked source version, enable Developer mode in the [Chrome extensions page](chrome://extensions/) and *Load unpacked extension* from the checked-out **src** folder.

The latest official version will always be available at the [Chrome Web Store](https://chrome.google.com/webstore/detail/dataslayer/ikbablmmjldhamhcldjjigniffkkjgpo).

Use
---
A new panel will appear in Developer Tools titled **dataslayer**, containing a page group and URL for each pageload in the tab, with each dataLayer.push appearing in a subgroup.

![](http://i.imgur.com/2H2t85K.png)

If Google Analytics, Floodlight, or SiteCatalyst tags are fired, they will appear on the right side of the page group, with dataLayer information on the left side. Note that vertical alignment does not necessarily indicate a tie between dataLayer items and tags fired. Click the + next to each tag to see all parameters in the request, in case the parameter you're looking for is not pulled out.

All items are in reverse chronological order (newest on top).

To collapse and expand page groups, simply click the URL associated with each page.

To clear history up to the current page, click the X on the top right.

The extension options page (found in the [Chrome extensions page](chrome://extensions/)) will allow you to hide or show certain tag types, as well as specific Google Analytics UA-IDs (separated by semicolons). All tags are shown by default. Settings **should** sync across devices if you're signed in to Chrome.

Misc
----
dataslayer was built with and thanks to the following:
- [Google Data Layer Helper Library](https://github.com/google/data-layer-helper)
- [Pure](http://purecss.io/)
- [jQuery](http://jquery.com/)
- [leanModal](http://leanmodal.finelysliced.com.au/)
- [Open Sans](http://www.google.com/fonts/specimen/Open+Sans)

dataslayer is under the MIT License. See LICENSE.md.