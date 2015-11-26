dataslayer Changelog
====================
0.10.9
------
+ more detail on DTM rules

0.10.8
------
+ fix DTM breaking load rules
+ modify iframe injection method to accommodate Chrome CSP changes
+ show GTM element click text

0.10.7
------
+ capture redirected GA /collects

0.10.6
------
+ misc. fixes

0.10.5
------
+ added Adobe DTM container publish date
+ show when GTM is responsible for firing a GA tag
+ edge case GA fix

0.10.4
------
+ added donate button
+ initial support for Adobe DTM
+ fixed custom watch showing as missing when it wasn't

0.10.3
------
+ misc. fixes and improvements

0.10.2
------
+ surface more SiteCatalyst variables
+ catch classic GA page groupings

0.10.1
------
+ bug fix for disabled third party cookies

0.10.0
------
+ added TagCommander support
+ added capture and display of custom data layers / variables
+ added option to hide empty variables
+ improved iframe display
+ identify Universal Analytics timing hits
+ bug fixes

0.9.7
-----
+ display GA enhanced ecommerce payloads

0.9.5
-----
+ support for multiple GTM containers on a single page (including iframes)

0.9.2
-----
+ fixed GA classic performance data edge case

0.9.1
-----
+ fixed missing event value for GA classic

0.9.0
-----
+ initial support for Tealium
+ a new way to look at nested variables (shift-click + to expand all children)
+ fixed issue with overwriting passed DOM elements (e.g. for link click listening)
+ UI improvements

0.8.6
-----
+ capture SiteCatalyst tags fired before DevTools was opened
+ added option to block tags from being collected (experimental, requires Chrome beta or dev channel)
+ UI adjustments

0.8.2
-----
+ support for GTM variables not named 'dataLayer'
+ pull in more Floodlights, while reducing false positives

0.8.0
-----
+ improved UI performance
+ added option to display dataLayer presence in the panel (and removed content console logging)
+ click open/close is now persistent
+ added option to clear history
+ fixed character parsing
+ added option to ignore specific UA-IDs
+ updated to jQuery 2.1.1

0.7.12
------
+ fixed breaking with odd CV scope sets
+ parse Universal Analytics content groupings
+ handle Universal Analytics POST requests

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
