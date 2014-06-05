var devtoolsPort = [];
chrome.runtime.onConnect.addListener(function(port){
	devtoolsPort.push(port);
});

chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
	// console.log(message);
	if (message.type=='dataslayer_gtm'){
		message.tabID=sender.tab.id;
		devtoolsPort.forEach(function(v,i,x){
			try{v.postMessage(message);}catch(e){console.log(e);}
		});
	}
	else if ((message.type=='dataslayer_pageload')||(message.type=='dataslayer_opened')){
			chrome.tabs.executeScript(message.tabID,{ file: 'content.js', runAt: 'document_idle' });
			chrome.tabs.executeScript(message.tabID,{ file: 'insert.js', runAt: 'document_idle' });
		}
	else if (message.type=='dataslayer_refresh'){
		chrome.tabs.executeScript(message.tabID,{code:'window.postMessage({type:"dataslayer_gtm",gtmID:dataslayer.gtmID,dLN:dataslayer.dLN,data: "found"},"*");'});
	}
	else if (message.type=='dataslayer_unload')
		chrome.tabs.executeScript(message.tabID,{ code: 'document.head.removeChild(document.getElementById(\'dataslayer_script\'));', runAt: "document_idle" });
	else if (message.type=='dataslayer_loadsettings')
		devtoolsPort.forEach(function(v,i,x){
			v.postMessage(message);
		});
});

