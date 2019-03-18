/* eslint-disable */
// prettier-ignore
(function(){/* jQuery v1.9.1 (c) 2005, 2012 jQuery Foundation, Inc. jquery.org/license.*/
var g=/\\[object (Boolean|Number|String|Function|Array|Date|RegExp)\\]/;function h(a){return null==a?String(a):(a=g.exec(Object.prototype.toString.call(Object(a))))?a[1].toLowerCase():"object"}function k(a,b){return Object.prototype.hasOwnProperty.call(Object(a),b)}function m(a){if(!a||"object"!=h(a)||a.nodeType||a==a.window)return!1;try{if(a.constructor&&!k(a,"constructor")&&!k(a.constructor.prototype,"isPrototypeOf"))return!1}catch(b){return!1}for(var c in a);return void 0===c||k(a,c)};/*'+
 Copyright 2012 Google Inc. All rights reserved. */
// prettier-ignore
function n(a,b,c,z){this.z=z;this.b=a;this.f=b||function(){};this.d=!1;this.a={};this.c=[];this.e=p(this);r(this,a,!c);var d=a.push,e=this;a.push=function(){var b=[].slice.call(arguments,0),c=d.apply(a,b);r(e,b);return c}}window.DataLayerHelper=n;n.prototype.get=function(a){var b=this.a;a=a.split(".");for(var c=0;c<a.length;c++){if(void 0===b[a[c]])return;b=b[a[c]]}return b};n.prototype.flatten=function(){this.b.splice(0,this.b.length);this.b[0]={};s(this.a,this.b[0])};
// prettier-ignore
function r(a,b,c){for(a.c.push.apply(a.c,b);!1===a.d&&0<a.c.length;){b=a.c.shift();if("array"==h(b))a:{var d=b,e=a.a;if("string"==h(d[0])){for(var f=d[0].split("."),u=f.pop(),d=d.slice(1),l=0;l<f.length;l++){if(void 0===e[f[l]])break a;e=e[f[l]]}try{e[u].apply(e,d)}catch(v){}}}else if("function"==typeof b)try{b.call(a.e)}catch(w){}else if(m(b))for(var q in b)s(t(q,b[q]),a.a);else continue;c||(a.d=!0,a.f(a.a,b),a.d=!1)}}
// prettier-ignore
function p(a){return{set:function(b,c){s(t(b,c),a.a)},get:function(b){return a.get(b)}}}function t(a,b){for(var c={},d=c,e=a.split("."),f=0;f<e.length-1;f++)d=d[e[f]]={};d[e[e.length-1]]=b;return c}function s(a,b){for(var c in a)if(k(a,c)){var d=a[c];"array"==h(d)?("array"==h(b[c])||(b[c]=[]),s(d,b[c])):m(d)?(m(b[c])||(b[c]={}),s(d,b[c])):b[c]=d}};})();
/* eslint-enable */


var dataslayer = {
  helper: {},
  dLN: [],
  gtmID: [],
  gtmAnnounced: [],
  udoname: 'utag_data',
  utagID: '',
  tcvname: 'tc_vars',
  tcoID: 'TagCommander',
};

dataslayer.sanitize = function(obj) {
  var localDL = {};
  for (var ddel in obj) {
    if (obj[ddel] instanceof Element) {
      localDL[ddel] = 'element';
      if (obj.event === 'gtm.linkClick' || obj.event === 'gtm.click')
        localDL['Click Text'] = obj[ddel].innerText;
    } else if (obj[ddel] instanceof Function) {
    } //tag commander has many of these
    else if (ddel.substr(0, 9) === 'function ') {
    } //tag commander has many of these
    else if (Array.isArray(obj[ddel])) {
      var convert = {};
      for (var i in Object.keys(obj[ddel])) {
        if (!(obj[ddel][i] instanceof Function)) convert[i] = obj[ddel][i];
        if (Array.isArray(convert[i]))
          convert[i] = dataslayer.sanitize(convert[i]);
      }
      localDL[ddel] = convert;
    } else localDL[ddel] = obj[ddel];
  }
  return localDL;
};

dataslayer.helperListener = function(message, model) {
  window.parent.postMessage(
    {
      type: 'dataslayer_gtm_push',
      // gtmID: dataslayer.gtmID[this.z],
      dLN: dataslayer.dLN[this.z],
      url: window == window.parent ? window.location.href : 'iframe',
      data: JSON.stringify(dataslayer.sanitize(model)),
    },
    '*'
  );
};

dataslayer.refresh = function() {
  if (
    document.readyState === 'complete' &&
    document.querySelectorAll('script[src*=googletagmanager\\.com]').length ===
      0
  ) {
    window.parent.postMessage(
      {
        url: window == window.parent ? window.location.href : 'iframe',
        type: 'dataslayer_gtm',
        data: 'notfound',
      },
      '*'
    );
  } else {
    for (var d = 0; d < dataslayer.gtmID.length; d++) {
      if (typeof window[dataslayer.dLN[d]] !== 'undefined') {
        window.parent.postMessage(
          {
            type: 'dataslayer_gtm',
            data: 'found',
            gtmID: dataslayer.gtmID[d],
            url: window == window.parent ? window.location.href : 'iframe',
            dLN: dataslayer.dLN[d],
          },
          '*'
        );
        for (var i = 0; i < window[dataslayer.dLN[d]].length; i++)
          window.parent.postMessage(
            {
              type: 'dataslayer_gtm_push',
              gtmID: dataslayer.gtmID[d],
              dLN: dataslayer.dLN[d],
              url: window == window.parent ? window.location.href : 'iframe',
              data: JSON.stringify(
                dataslayer.sanitize(window[dataslayer.dLN[d]][i])
              ),
            },
            '*'
          );
      }
    }
  }

  if (typeof window[dataslayer.udoname] !== 'undefined') {
    window.parent.postMessage(
      {
        type: 'dataslayer_tlm',
        data: 'found',
        gtmID: dataslayer.utagID,
        url: window == window.parent ? window.location.href : 'iframe',
        dLN: dataslayer.udoname,
      },
      '*'
    );
    dataslayer.tlmHelperListener();
  } else if (
    document.readyState === 'complete' &&
    typeof window[dataslayer.udoname] === 'undefined'
  ) {
    window.parent.postMessage(
      {
        type: 'dataslayer_tlm',
        url: window == window.parent ? window.location.href : 'iframe',
        data: 'notfound',
      },
      '*'
    );
  }

  if (typeof window[dataslayer.tcvname] !== 'undefined') {
    window.parent.postMessage(
      {
        type: 'dataslayer_tco',
        data: 'found',
        gtmID: dataslayer.tcoID,
        url: window == window.parent ? window.location.href : 'iframe',
        dLN: dataslayer.tcvname,
      },
      '*'
    );
    dataslayer.tcoHelperListener();
  } else if (
    document.readyState === 'complete' &&
    typeof window[dataslayer.tcvname] === 'undefined'
  ) {
    window.parent.postMessage(
      {
        type: 'dataslayer_tco',
        url: window == window.parent ? window.location.href : 'iframe',
        data: 'notfound',
      },
      '*'
    );
  }
};

dataslayer.gtmSearch = function() {
  var gtmList = document.querySelectorAll(
    'script[src*=googletagmanager\\.com]'
  );
  if (gtmList.length > 0) {
    for (var i = 0; i < gtmList.length; i++) {
      try {
        var gtmLocation = new URL(gtmList[i].src);
        dataslayer.gtmID[i] = gtmLocation.searchParams.get('id');
        dataslayer.dLN[i] = gtmLocation.searchParams.get('l') || 'dataLayer';
      } catch (e) {
        console.warn(
          "Your browser likely doesn't support the URL type; please upgrade."
        );
      }

      // var gtmQSP = gtmList[i].src.split('?')[1];
      // if (gtmQSP.indexOf('&')>-1){
      //     dataslayer.gtmID[i]=gtmQSP.substring(3,gtmQSP.indexOf('&'));
      //     dataslayer.dLN[i]=gtmQSP.substr(gtmQSP.indexOf('&')+3);
      // }
      // else{
      //     dataslayer.gtmID[i]=gtmQSP.substr(3);
      //     dataslayer.dLN[i]='dataLayer';
      // }

      if (
        typeof window[dataslayer.dLN[i]] !== 'undefined' &&
        dataslayer.gtmAnnounced.indexOf(dataslayer.gtmID[i]) == -1
      ) {
        dataslayer.gtmAnnounced.push(dataslayer.gtmID[i]);
        window.parent.postMessage(
          {
            type: 'dataslayer_gtm',
            data: 'found',
            gtmID: dataslayer.gtmID[i],
            url: window == window.parent ? window.location.href : 'iframe',
            dLN: dataslayer.dLN[i],
          },
          '*'
        );
        if (!dataslayer.helper.hasOwnProperty(dataslayer.dLN[i]))
          dataslayer.helper[dataslayer.dLN[i]] = new DataLayerHelper(
            window[dataslayer.dLN[i]],
            dataslayer.helperListener,
            true,
            i
          );
      }
    }
  } else if (
    document.readyState === 'complete' &&
    document.querySelectorAll('script[src*=googletagmanager\\.com]').length ===
      0
  ) {
    window.parent.postMessage(
      {
        url: window == window.parent ? window.location.href : 'iframe',
        type: 'dataslayer_gtm',
        data: 'notfound',
      },
      '*'
    );
    window.clearInterval(dataslayer.timerID);
  }
  if (document.readyState === 'complete' && dataslayer.timerID !== null) {
    window.clearInterval(dataslayer.timerID);
    dataslayer.timerID = null;
    dataslayer.gtmSearch();
  }
};

dataslayer.timerID = window.setInterval(dataslayer.gtmSearch, 200);

// Tealium
dataslayer.tlmHelperListener = function(change) {
  window.parent.postMessage(
    {
      type: 'dataslayer_tlm',
      gtmID: dataslayer.utagID,
      dLN: dataslayer.udoname,
      url: window == window.parent ? window.location.href : 'iframe',
      data: JSON.stringify(dataslayer.sanitize(window[dataslayer.udoname])),
    },
    '*'
  );
};

dataslayer.tlmTimerID = window.setInterval(function() {
  if (window.hasOwnProperty('utag')) {
    dataslayer.udoname = window.utag.udoname;
    dataslayer.utagID = window.utag.id;
  }
  if (typeof window[dataslayer.udoname] !== 'undefined') {
    window.parent.postMessage(
      {
        type: 'dataslayer_tlm',
        data: 'found',
        gtmID: dataslayer.utagID,
        url: window == window.parent ? window.location.href : 'iframe',
        dLN: dataslayer.udoname,
      },
      '*'
    );
    Object.observe(window[dataslayer.udoname], dataslayer.tlmHelperListener);
    window.clearInterval(dataslayer.tlmTimerID);
    dataslayer.tlmHelperListener();
  } else if (
    document.readyState === 'complete' &&
    typeof window[dataslayer.udoname] === 'undefined'
  ) {
    window.parent.postMessage(
      {
        type: 'dataslayer_tlm',
        url: window == window.parent ? window.location.href : 'iframe',
        data: 'notfound',
      },
      '*'
    );
    window.clearInterval(dataslayer.tlmTimerID);
  }
}, 200);

// TagCommander
dataslayer.tcoHelperListener = function(change) {
  window.parent.postMessage(
    {
      type: 'dataslayer_tco',
      gtmID: dataslayer.tcoID,
      dLN: dataslayer.tcvname,
      url: window == window.parent ? window.location.href : 'iframe',
      data: JSON.stringify(dataslayer.sanitize(window[dataslayer.tcvname])),
    },
    '*'
  );
};

dataslayer.tcoTimerID = window.setInterval(function() {
  if (typeof window[dataslayer.tcvname] !== 'undefined') {
    if (window.tC && window.tC.containerVersion)
      dataslayer.tcoID =
        dataslayer.tcoID + ' [' + window.tC.containerVersion + ']';
    window.parent.postMessage(
      {
        type: 'dataslayer_tco',
        data: 'found',
        gtmID: dataslayer.tcoID,
        url: window == window.parent ? window.location.href : 'iframe',
        dLN: dataslayer.tcvname,
      },
      '*'
    );
    Object.observe(window[dataslayer.tcvname], dataslayer.tcoHelperListener);
    window.clearInterval(dataslayer.tcoTimerID);
    dataslayer.tcoHelperListener();
  } else if (
    document.readyState === 'complete' &&
    typeof window[dataslayer.tcvname] === 'undefined'
  ) {
    window.parent.postMessage(
      {
        type: 'dataslayer_tco',
        url: window == window.parent ? window.location.href : 'iframe',
        data: 'notfound',
      },
      '*'
    );
    window.clearInterval(dataslayer.tcoTimerID);
  }
}, 200);

// Adobe DTM
dataslayer.dtmLoad = function() {
  var hasNoAdobe =
    typeof window._satellite === 'undefined' ||
    !(window._satellite.buildDate || window._satellite.buildInfo);
  var satellite = window._satellite;
  var dtmNotif = [];
  if (hasNoAdobe) {
    window.parent.postMessage(
      {
        type: 'dataslayer_dtm',
        url: window == window.parent ? window.location.href : 'iframe',
        data: 'notfound',
      },
      '*'
    );
  } else {
    var isLaunch = !satellite.configurationSettings;
    // console.log(satellite);

    if (!isLaunch) {
      // DTM
      // page load rules
      var plrs =
        satellite.configurationSettings.pageLoadRules ||
        satellite.pageLoadRules;
      for (var rule in plrs) {
        for (var phase in satellite.pageLoadPhases) {
          if (
            satellite.ruleInScope(plrs[rule]) &&
            satellite.isRuleActive(plrs[rule])
          ) {
            if (
              satellite.ruleMatches(
                plrs[rule],
                {
                  target: document.location,
                  type: satellite.pageLoadPhases[phase],
                },
                document.location
              )
            ) {
              dtmNotif.push({});
              dtmNotif[dtmNotif.length - 1][satellite.pageLoadPhases[phase]] =
                plrs[rule].name;
              for (var a in plrs[rule].trigger) {
                dtmNotif[dtmNotif.length - 1]['trigger ' + a] = {
                  command:
                    (plrs[rule].trigger[a].engine
                      ? plrs[rule].trigger[a].engine + ' / '
                      : '') + plrs[rule].trigger[a].command,
                };
                for (var c in plrs[rule].trigger[a].arguments) {
                  dtmNotif[dtmNotif.length - 1]['trigger ' + a][
                    'argument ' + c
                  ] = plrs[rule].trigger[a].arguments[c];
                }
              }
            }
          }
        }
      }

      window.parent.postMessage(
        {
          type: 'dataslayer_dtm',
          url: window == window.parent ? window.location.href : 'iframe',
          data: 'found',
          loadRules: JSON.stringify(dtmNotif),
          buildDate: satellite.buildDate || '',
        },
        '*'
      );
    } else {
      // WIP Adobe Launch
      // console.log('isLaunch');

      var propertyInfo = '';
      if (satellite.property && satellite.property.name) {
        propertyInfo += satellite.property.name;
      }
      if (satellite.buildInfo && satellite.buildInfo.environment) {
        propertyInfo += ' (' + satellite.buildInfo.environment + ')';
      }

      var buildDate = '';
      if (satellite.buildInfo && satellite.buildInfo.buildDate) {
        if (/Z$/.test(satellite.buildInfo.buildDate)) {
          buildDate =
            new Date(satellite.buildInfo.buildDate).toLocaleString() +
            ' [local time]';
        } else {
          buildDate = satellite.buildInfo.buildDate;
        }
      }

      window.parent.postMessage(
        {
          type: 'dataslayer_dtm',
          url: window == window.parent ? window.location.href : 'iframe',
          data: 'found',
          loadRules: JSON.stringify(dtmNotif),
          property: propertyInfo,
          buildDate,
        },
        '*'
      );
    }
  }
};

if (document.readyState === 'complete') {
  dataslayer.dtmLoad();
} else {
  document.addEventListener('readystatechange', function() {
    if (document.readyState === 'complete') {
      dataslayer.dtmLoad();
    }
  });
}

// other data layers
dataslayer.reduceIndex = function(obj, i) {
  return obj[i];
};

dataslayer.createListener = function(variable) {
  var listener = function() {
    window.parent.postMessage(
      {
        type: 'dataslayer_var',
        dLN: variable.length === 1 ? variable[0] : variable.join('.'),
        url: window == window.parent ? window.location.href : 'iframe',
        data: JSON.stringify(
          dataslayer.sanitize(
            variable.length === 1
              ? window[variable[0]]
              : variable.reduce(dataslayer.reduceIndex, window)
          )
        ),
      },
      '*'
    );
  };
  return listener;
};

dataslayer.loadOtherLayers = function() {
  dataslayer.layers = document
    .getElementById('dataslayer_script')
    .getAttribute('layers');
  if (dataslayer.layers !== null) {
    dataslayer.layers = dataslayer.layers.split(';');

    for (var i = 0; i < dataslayer.layers.length; i++) {
      dataslayer.layers[i] = dataslayer.layers[i].split('.');
      var type = typeof (dataslayer.layers[i].length === 1
        ? window[dataslayer.layers[i][0]]
        : dataslayer.layers[i].reduce(dataslayer.reduceIndex, window));
      if (type === 'object') {
        window.parent.postMessage(
          {
            type: 'dataslayer_var',
            data: 'found',
            url: window == window.parent ? window.location.href : 'iframe',
            dLN:
              dataslayer.layers[i].length === 1
                ? dataslayer.layers[i][0]
                : dataslayer.layers[i].join('.'),
          },
          '*'
        );
        dataslayer.layers[i] = {
          variable: dataslayer.layers[i],
          listener: dataslayer.createListener(dataslayer.layers[i]),
        };
        Object.observe(
          dataslayer.layers[i].variable.length === 1
            ? window[dataslayer.layers[i].variable[0]]
            : dataslayer.layers[i].variable.reduce(
                dataslayer.reduceIndex,
                window
              ),
          dataslayer.layers[i].listener
        );
        dataslayer.layers[i].listener();
      } else if (type !== 'object' && type !== 'undefined')
        console.warn(
          'dataslayer: cannot watch non-object ',
          dataslayer.layers[i].join('.')
        );
    }
  }
};

dataslayer.loadLaunchDataElements = function() {
  if (window._satellite && window._satellite._container && window._satellite._container.dataElements) {
    var elementNames = Object.keys(window._satellite._container.dataElements).sort(function(a, b) {
      var nameA = a.toUpperCase();
      var nameB = b.toUpperCase();

      if (nameA < nameB) {
        return -1;
      } else if (nameA > nameB) {
        return 1;
      } else {
        return 0;
      }
    });

    for (var i = 0; i < elementNames.length; i++) {
      var newElement = JSON.parse(JSON.stringify(window._satellite._container.dataElements[elementNames[i]]));

      try {
        let cleanValue = window._satellite.getVar(elementNames[i]);
        if (typeof cleanValue === 'function') {
          cleanValue = '(function)';
        } else if (typeof cleanValue === 'object' && typeof cleanValue.then === 'function') {
          cleanValue = '(Promise)';
        }
        window.parent.postMessage(
          {
            type: 'dataslayer_launchdataelement',
            data: 'found',
            url: window == window.parent ? window.location.href : 'iframe',
            key: elementNames[i],
            value: cleanValue,
            element: newElement,
          },
          '*'
        );  
      } catch(e) {
        console.warn(e);
      }
    }  
  }
};

if (document.readyState === 'complete') {
  dataslayer.loadOtherLayers();
  dataslayer.loadLaunchDataElements();
  // window.setInterval(dataslayer.loadLaunchDataElements, 5000);
} else {
  document.addEventListener('readystatechange', function() {
    if (document.readyState === 'complete') {
      dataslayer.loadOtherLayers();
      dataslayer.loadLaunchDataElements();
      // window.setInterval(dataslayer.loadLaunchDataElements, 5000);
    }
  });
}
