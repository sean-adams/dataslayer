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

	chrome.storage.sync.get(ourKeys,function(items){
		$.each(items,function(i,v){
			$('#'+i).prop('checked',v);
		});		
	});
}

function saveSettings(){
	$('input').each(function(){
		dataslayer.options[$(this).attr('id')] = $(this).prop('checked');
	});
	chrome.storage.sync.set(dataslayer.options);
}