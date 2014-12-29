if (document.getElementById('dataslayer_script') === null){
dataslayers = document.createElement('script');
dataslayers.id = 'dataslayer_script';
dataslayers.src = chrome.runtime.getURL('inject.js');
dataslayers.type = 'text/javascript';
chrome.storage.sync.get(null,function(items){
		if (items.hasOwnProperty('dataLayers'))
			dataslayers.setAttribute('layers',items.dataLayers.join(';'));
		document.head.appendChild(dataslayers);
	});

}


function iframeCheck(){
	iframeDS = [];
	var iframes = document.querySelectorAll('iframe');
	if (iframes.length > 0){
		for (i=0;i<iframes.length;i++){
			if (iframes[i].contentWindow.document.getElementById('dataslayer_script') === null){
				iframeDS[i] = document.createElement('script');
				iframeDS[i].id = 'dataslayer_script';
				iframeDS[i].src = chrome.runtime.getURL('inject.js');
				iframeDS[i].type = 'text/javascript';
				if (iframes[i].contentWindow.document.head) iframes[i].contentWindow.document.head.appendChild(iframeDS[i]);
			}
		}
	}
}

if (document.readyState == 'complete')
	iframeCheck();
else
	document.onreadystatechange = function(){ if (document.readyState == 'complete') { window.setTimeout(iframeCheck,500);}};

var dataslayer = {};
dataslayer.helperListener = function(event){
	if ((event.data.type && (event.data.type.substr(0,10)=='dataslayer'))){
		try{
			if (event.source == window)
				chrome.runtime.sendMessage(event.data);
			else{
				event.data.iframed = true;
				chrome.runtime.sendMessage(event.data);
			}
		}
		catch(e){
			// nothing to be done here, really, as generally an error here 
			// means we have lost a previous version of the devtools panel
			// that initially injected this iteration of the content script
		}
	}
};
window.addEventListener('message',dataslayer.helperListener);

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
  	if (request.ask=='refresh')
  		var refreshTag = document.createElement('script');
  		refreshTag.type = 'text/javascript';
  		refreshTag.innerHTML = 'dataslayer.refresh();';
	  	document.head.appendChild(refreshTag);
  }
);