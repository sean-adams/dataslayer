var devtoolsPort = [];
var notifId = '';
chrome.runtime.onConnect.addListener(function(port){
	devtoolsPort.push(port);
});

var debug = (chrome.runtime.id == 'ikbablmmjldhamhcldjjigniffkkjgpo' ? false : true);


function addBlocking(){
	removeBlocking();
	if (chrome.declarativeWebRequest)
		chrome.declarativeWebRequest.onRequest.addRules([{
			id: 'dataslayerBlocking',
			conditions: [
				new chrome.declarativeWebRequest.RequestMatcher({
					url: { hostSuffix: 'google-analytics.com', pathPrefix: '/collect', schemes: ['http','https'] },
				}),
				new chrome.declarativeWebRequest.RequestMatcher({
					url: { hostSuffix: 'google-analytics.com', pathPrefix: '/__utm.gif', schemes: ['http','https'] },
				}),
				new chrome.declarativeWebRequest.RequestMatcher({
					url: { hostSuffix: 'stats.g.doubleclick.net', pathPrefix: '/__utm.gif', schemes: ['http','https'] },
				}),
				new chrome.declarativeWebRequest.RequestMatcher({
					url: { hostSuffix: 'doubleclick.net', pathPrefix: '/activity', schemes: ['http','https'] },
				}),
				new chrome.declarativeWebRequest.RequestMatcher({
					url: { pathPrefix: '/b/ss', queryContains: 'AQB=1', schemes: ['http','https'] },
				})
				],
			actions: [
				new chrome.declarativeWebRequest.RedirectToTransparentImage()
			]}]);
}

function removeBlocking(){
	if (chrome.declarativeWebRequest)
		chrome.declarativeWebRequest.onRequest.removeRules(['dataslayerBlocking']);
}

chrome.storage.sync.get(null,function(items){
	if (items.hasOwnProperty('blockTags')&&items.blockTags===true) addBlocking();
	else removeBlocking();
});

chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
	if (debug) console.log(message);
	if ((message.type=='dataslayer_gtm_push')||((message.type=='dataslayer_gtm')||(message.type=='dataslayer_tlm'))){
		message.tabID=sender.tab.id;
		devtoolsPort.forEach(function(v,i,x){
			try{v.postMessage(message);}catch(e){console.log(e);}
		});
	}
	else if ((message.type=='dataslayer_pageload')||(message.type=='dataslayer_opened')){
		chrome.tabs.executeScript(message.tabID,{ file: 'content.js', runAt: 'document_idle' });
	}
	else if (message.type=='dataslayer_refresh'){
		chrome.tabs.sendMessage(message.tabID,{ask: 'refresh'});
		// chrome.tabs.executeScript(message.tabID,{code:'dataslayer.refresh();'});
	}
	else if (message.type=='dataslayer_unload')
		chrome.tabs.executeScript(message.tabID,{ code: 'document.head.removeChild(document.getElementById(\'dataslayer_script\'));', runAt: "document_idle" });
	else if (message.type=='dataslayer_loadsettings'){
		if (message.data.blockTags)
			addBlocking();
		else
			removeBlocking();
		devtoolsPort.forEach(function(v,i,x){
			v.postMessage(message);
		});
	}
});

chrome.runtime.onInstalled.addListener(function(details){
	if (details.reason=='install')
		chrome.tabs.create({url:'chrome-extension://'+chrome.runtime.id+'/options.html#install',active:true});
	else if ((details.reason=='update')&&(!debug))
		{chrome.notifications.create('', {type:'basic',title:'dataslayer', message:'dataslayer has been updated to version '+chrome.runtime.getManifest().version+'.\nClick here to see what\'s new.',iconUrl: 'i128.png'},function(notificationId){notifId=notificationId;});
				chrome.notifications.onClicked.addListener(function(notificationId){if (notificationId==notifId) chrome.tabs.create({url:'chrome-extension://'+chrome.runtime.id+'/options.html#whatsnew',active:true});});}
});