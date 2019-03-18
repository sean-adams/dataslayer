if (!/addthis\.com|facebook\.com|twitter\.com/.test(document.location.host)) {
  var dataslayer = {
	helperListener: function(event) {
		if (event.data.type && event.data.type.substr(0, 10) === 'dataslayer') {
		  try {
			if (event.source == window) {
			  chrome.runtime.sendMessage(event.data);
			} else {
			  event.data.iframed = true;
			  chrome.runtime.sendMessage(event.data);
			}
		  } catch (e) {
			// nothing to be done here, really, as generally an error here
			// means we have lost a previous version of the devtools panel
			// that initially injected this iteration of the content script
		  }
		}
	}
  };

  window.addEventListener('message', dataslayer.helperListener);

  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.ask == 'refresh') {
      var refreshTag = document.createElement('script');
      refreshTag.type = 'text/javascript';
      refreshTag.innerHTML = 'dataslayer.refresh();';
      document.head.appendChild(refreshTag);
    }
  });

  if (document.getElementById('dataslayer_script') === null) {
    var oopoly = document.createElement('script');
    oopoly.id = 'oo_poly';
    oopoly.src = chrome.runtime.getURL('oo_poly.js');
    oopoly.type = 'text/javascript';
    document.head.appendChild(oopoly);

    var dataslayers = document.createElement('script');
    dataslayers.id = 'dataslayer_script';
    dataslayers.src = chrome.runtime.getURL('inject.js');
    dataslayers.type = 'text/javascript';

    chrome.storage.sync.get(null, function(items) {
      if (items.hasOwnProperty('dataLayers')) {
        dataslayers.setAttribute('data-layers', items.dataLayers.join(';'));
      }

      document.head.appendChild(dataslayers);
    });
  }
}
