var dataslayer = dataslayer || {};
dataslayer.options = dataslayer.options || {};

$(function(){
	$('input').change(function(){saveSettings();});
	loadSettings();
});

function loadSettings(){
	var ourKeys = [];
	$('input').each(function(){
		ourKeys.push($(this).attr('id'));
	});

	chrome.storage.sync.get(null,function(items){
		var ourItems = items;

		$.each(['showFloodlight','showUniversal','showClassic','showSitecatalyst'],function(i,prop){
			if (!ourItems.hasOwnProperty(prop)) ourItems[prop] = true;  
		});

		$.each(ourItems,function(i,v){
			$('#'+i).prop('checked',v);
		});		
	});
}

function saveSettings(){
	$('input').each(function(){
		dataslayer.options[$(this).attr('id')] = $(this).prop('checked');
	});
	chrome.storage.sync.set(dataslayer.options);
	chrome.runtime.sendMessage({type: 'dataslayer_loadsettings',data: dataslayer.options});
}