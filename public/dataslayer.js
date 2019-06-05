/* global chrome */

chrome.devtools.panels.create(
    'dataslayer' + (chrome.runtime.id === 'ikbablmmjldhamhcldjjigniffkkjgpo' || chrome.runtime.id === 'firefox@dataslayer.org' ? '' : ' beta'),
    'i128.png', // No icon path
    'index.html',
    null // no callback needed
);
