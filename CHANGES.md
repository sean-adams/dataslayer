dataslayer Changelog
====================

0.7.12
------
+ fixed breaking with odd CV scope sets

0.7.9
-----
+ fixed silent failure on DevTools disconnect
+ SiteCatalyst: capture exit links

0.7.5
-----
+ fixed SiteCatalyst detection
+ added direct link to options in panel
+ added info on bug reporting in options

0.7
---
+ totally revamped dataLayer grabbing based on the [Google Data Layer Helper Library](https://github.com/google/data-layer-helper); should fix sites that lagged from the old method
+ fixed lots of issues with parsing classic utme data, including:
    + CVs in wrong slot
    + CVs/events not unescaped properly
    + site speed & in-page link attribution info showing up incorrectly
+ fixed elements passed to dataLayer by GTM click listener
+ parse SiteCatalyst tags
+ fixed Floodlight regex to avoid triggered subtags being captured
+ fixed options logic

0.6.5
-----
+ fixed Floodlight regex so tags are not displayed twice (once for script load, once for image request)
+ expanded depth of dataLayer object/array parsing
+ callouts for GA classic now split into classic & dc.js
+ changed expanded tag parameters from hoverable to expandable/collapsible (hovers were cut off on Chrome OS, maybe elsewhere)
+ minor UI improvements
