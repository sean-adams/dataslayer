dataslayer Changelog
====================

0.7
---
+ totally revamped dataLayer grabbing based on the [Google Data Layer Helper Library](https://github.com/google/data-layer-helper); should fix site lag
+ parse SiteCatalyst tags
+ fixed Floodlight regex to avoid triggered subtags from being captured
+ fixed options logic

0.6.5
-----
+ fixed Floodlight regex so tags are not displayed twice (once for script load, once for image request)
+ expanded depth of dataLayer object/array parsing
+ callouts for GA classic now split into classic & dc.js
+ changed expanded tag parameters from hoverable to expandable/collapsible (hovers were cut off on Chrome OS, maybe elsewhere)
+ minor UI improvements
