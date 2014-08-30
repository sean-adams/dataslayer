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
