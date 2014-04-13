var devtoolsPort = {};
chrome.runtime.onConnect.addListener(function(port){
	devtoolsPort = port;
});

chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
	if (message.type=='dataslayer_gtm')
		devtoolsPort.postMessage(message);
	else if ((message.type=='dataslayer_pageload')||(message.type=='dataslayer_opened'))
		chrome.tabs.executeScript(message.tabID,{ file: 'insert.js', runAt: "document_idle" });
	else if (message.type=='dataslayer_loadsettings')
		devtoolsPort.postMessage(message);
});

