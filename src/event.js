var devtoolsPort = {};
chrome.runtime.onConnect.addListener(function(port){
	devtoolsPort = port;
});

chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
	// console.log(message);
	if (message.type=='dataslayergtm') {
		// console.info(message);
		devtoolsPort.postMessage(message);
	}
	else if (message.type=='newpageload'){
		chrome.tabs.executeScript(message.tabId,{ file: 'insert.js', runAt: "document_idle" });
		console.log('code injected');
	}
	else if (message.type=='devtoolsopened'){
		console.log('devtools opened');
		console.log(message);
		chrome.tabs.executeScript(message.tabId,{ file: 'insert.js', runAt: 'document_idle' },function(results){console.log(results);});
		console.log('code injected');
	}	
});

