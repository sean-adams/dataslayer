var devtoolsPort = {};
chrome.runtime.onConnect.addListener(function(port){
	devtoolsPort = port;
});

chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
	devtoolsPort.postMessage(message);
});

