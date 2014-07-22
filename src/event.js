var devtoolsPort = [];
var notifId = '';
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

chrome.runtime.onInstalled.addListener(function(details){
	if (details.reason=='install')
		chrome.tabs.create({url:'chrome-extension://'+chrome.runtime.id+'/options.html#install',active:true});
	else if (details.reason=='update')
		{chrome.notifications.create('', {type:'basic',title:'dataslayer', message:'dataslayer has been updated to version '+chrome.runtime.getManifest().version+'.\nClick here to see what\'s new.',iconUrl: 'i128.png'},function(notificationId){notifId=notificationId;});
				chrome.notifications.onClicked.addListener(function(notificationId){if (notificationId==notifId) chrome.tabs.create({url:'chrome-extension://'+chrome.runtime.id+'/options.html#whatsnew',active:true});});}
});