import React from 'react';
export const optionMap = {
  General: [
    {
      name: 'threeColumnLayout',
      description: 'use three-column layout where available',
      type: 'checkbox',
    },
    {
      name: 'showGTMLoad',
      description: 'show data layer presence',
      type: 'checkbox',
    },
    {
      name: 'collapseNested',
      description: 'auto-collapse nested data layer variables',
      type: 'checkbox',
    },
    {
      name: 'collapseGTMNativeEvents',
      description: 'auto-collapse gtm.* events',
      type: 'checkbox',
    },
    {
      name: 'hideEmpty',
      description: 'hide empty data layer variables',
      type: 'checkbox',
    },
    {
      name: 'showArrayIndices',
      description: 'show array indices',
      type: 'checkbox',
    },
    {
      name: 'showTimestamps',
      description: 'show navigation timestamps',
      type: 'checkbox',
    },
    {
      name: 'showFriendlyNames',
      description: 'show friendly names for query parameters where available',
      type: 'checkbox',
    },
    {
      name: 'blockTags',
      description:
        'block tags from firing (experimental, requires Chrome dev/beta channel)',
      type: 'checkbox',
    },
    {
      name: 'dontDecode',
      description: "don't decode query string values",
      type: 'checkbox',
    },
  ],
  Tags: [
    {
      name: 'showUniversal',
      description: 'show Universal Analytics tags',
      type: 'checkbox',
    },
    {
      name: 'showClassic',
      description: 'show GA Classic tags',
      type: 'checkbox',
    },
    {
      name: 'showFloodlight',
      description: 'show Floodlight tags',
      type: 'checkbox',
    },
    {
      name: 'showSitecatalyst',
      description: 'show Adobe Analytics tags',
      type: 'checkbox',
    },
    {
      name: 'ignoredTags',
      description: (
        <span>
          <u>Ignored IDs</u> (separated by semicolons)
        </span>
      ),
      type: 'input',
      placeholder: 'UA-XXX-Y;UA-AAA-B',
    },
    {
      name: 'dataLayers',
      description: (
        <span>
          <u>Additional data layer objects</u> (separated by semicolons)
        </span>
      ),
      type: 'input',
      placeholder: 'digitalData;testDataLayer',
    },
  ],
};
export const defaults = {
  showFloodlight: true,
  showUniversal: true,
  showClassic: true,
  showSitecatalyst: true,
  showGTMLoad: true,
  ignoredTags: [],
  collapseNested: false,
  blockTags: false,
  hideEmpty: false,
  showArrayIndices: false,
  collapseGTMNativeEvents: false,
  showTimestamps: false,
  showFriendlyNames: true,
  dontDecode: false,
  threeColumnLayout: false,
};
