var dataslayer = dataslayer || {};
dataslayer.options = dataslayer.options || {};

$(function(){
	$('input').change(function(){saveSettings();});
	$('#version').html(chrome.runtime.getManifest().version);
	loadSettings();
	if (!chrome.declarativeWebRequest)
		$('#blockTags').prop('disabled',true);
});

function loadSettings(){
	var ourKeys = [];
	$('input').each(function(){
		ourKeys.push($(this).attr('id'));
	});

	chrome.storage.sync.get(null,function(items){
		var ourItems = items;

		$.each(['showFloodlight','showUniversal','showClassic','showSitecatalyst','showGTMLoad'],function(i,prop){
			if (!ourItems.hasOwnProperty(prop)) ourItems[prop] = true;  
		});
		if(!ourItems.hasOwnProperty('blockTags')) ourItems.blockTags = false;
		if(!ourItems.hasOwnProperty('collapseNested')) ourItems.collapseNested = false;
		if(!ourItems.hasOwnProperty('ignoredTags')) ourItems.ignoredTags = [];

		$.each(ourItems,function(i,v){
			if (i==='ignoredTags')
				$('#ignoredTags').val(v.join(';'));
			else
				$('#'+i).prop('checked',v);
		});		
	});
}

function saveSettings(){
	$('input').each(function(){
		if ($(this).attr('id')=='ignoredTags')
			dataslayer.options[$(this).attr('id')] = $(this).val().split(';');
		else
			dataslayer.options[$(this).attr('id')] = $(this).prop('checked');
	});
	chrome.storage.sync.set(dataslayer.options);
	chrome.runtime.sendMessage({type: 'dataslayer_loadsettings',data: dataslayer.options});
}