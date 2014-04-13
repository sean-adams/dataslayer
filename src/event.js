var devtoolsPort = [];
chrome.runtime.onConnect.addListener(function(port){
	devtoolsPort.push(port);
});

chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
	if (message.type=='dataslayer_gtm'){
		message.tabID=sender.tab.id;
		devtoolsPort.forEach(function(v,i,x){
			v.postMessage(message);
		});
	}
	else if ((message.type=='dataslayer_pageload')||(message.type=='dataslayer_opened'))
		chrome.tabs.executeScript(message.tabID,{ file: 'insert.js', runAt: "document_idle" });
	else if (message.type=='dataslayer_loadsettings')
		devtoolsPort.forEach(function(v,i,x){
			v.postMessage(message);
		});
});

