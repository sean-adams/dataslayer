if (document.getElementById('dataslayer_script') === null){
dataslayers = document.createElement('script');
dataslayers.id = 'dataslayer_script';
dataslayers.src = chrome.runtime.getURL('inject.js');
dataslayers.type = 'text/javascript';
document.head.appendChild(dataslayers);}

var dataslayer = {};
dataslayer.helperListener = function(event){
	if ((event.source == window)&&(event.data.type && (event.data.type.substr(0,10)=='dataslayer'))){
		try{
			chrome.runtime.sendMessage(event.data);
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