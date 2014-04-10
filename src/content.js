var dataslayer = {};
dataslayer.helperListener = function(event){
	if ((event.source == window)&&(event.data.type && (event.data.type=='dataslayergtm'))){
		// console.info(event.data);
		chrome.runtime.sendMessage(event.data);
	}
};
window.addEventListener('message',dataslayer.helperListener);
