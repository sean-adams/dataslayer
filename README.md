dataslayer
==========

_This readme focuses on the developer experience. User documentation is available at https://dataslayer.org/documentation/._

A Chrome and Firefox extension to enhance debugging of some frequently-used tag management platforms (Google Tag Manager, Adobe DTM / Launch, Tealium, TagCommander) in combination with some frequently-used tags (Google Analytics, Adobe Analytics/Omniture, Floodlight).

The latest official version will always be available at the [Chrome Web Store](https://chrome.google.com/webstore/detail/dataslayer/ikbablmmjldhamhcldjjigniffkkjgpo) or [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/dataslayer-firefox/).


Developing
--------
dataslayer is built with create-react-app and depends on react-scripts. This makes the build process very easy, although it makes live debugging *as an extension* slightly annoying.

NOTE: to create a build that your browser will actually run, make sure you set ```INLINE_RUNTIME_CHUNK=false```, either in your environment or in a ```.env``` file at the root of the project. The included ```.env``` handles this.

To build and use the development version from source:
- `npm install`
- `npm run build`
- Chrome: enable Developer mode in the [Chrome extensions page](chrome://extensions/) and *Load unpacked extension* from the **build** folder.
- Firefox: *enable add-on debugging* from [about:debugging](about:debugging) and *Load Temporary Add-on* from the `manifest.json` in the **build** folder.
- You will need to reload the extension from the same page each time you build.

`npm run start` will start a local development server for working on UI only using some dummy data.

In general, data layer / tag state is managed solely in App (which is also responsible for monitoring network requests and communicating with the background / content scripts) and cascades down to a number of presentation components.

Misc
----
dataslayer was built with and thanks to the following:
- React / create-react-app
- [Google Data Layer Helper Library](https://github.com/google/data-layer-helper)
- [Pure](http://purecss.io/)
- [Open Sans](http://www.google.com/fonts/specimen/Open+Sans)
- [react-feather](https://github.com/feathericons/react-feather)

dataslayer is under the MIT License. See LICENSE.md.

