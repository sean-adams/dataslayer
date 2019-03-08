/* global chrome */

chrome.devtools.panels.create(
    'dataslayer' + (chrome.runtime.id === 'ikbablmmjldhamhcldjjigniffkkjgpo' ? '' : ' beta'),
    null, // No icon path
    'index.html',
    null // no callback needed
);
