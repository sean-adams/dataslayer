var dataslayer = dataslayer || {};
dataslayer.options = dataslayer.options || {
  showFloodlight: true, 
  showUniversal: true, 
  showClassic: true, 
  showSitecatalyst: true, 
  showGTMLoad: true, 
  ignoredTags: [],
  collapseNested: false,
  blockTags: false,
  hideEmpty: false,
  dataLayers: []
};

$(function(){
  $('input').change(function(){saveSettings();});
  $('#version').html(chrome.runtime.getManifest().version);
  loadSettings();
  if (!chrome.declarativeWebRequest)
    $('#blockTags').prop('disabled',true);
});

function loadSettings(){
  dataslayer.options = typeof localStorage['options'] !== 'undefined' ? JSON.parse(localStorage['options']) : {
    showFloodlight: true, 
    showUniversal: true, 
    showClassic: true, 
    showSitecatalyst: true, 
    showGTMLoad: true, 
    ignoredTags: [],
    collapseNested: false,
    blockTags: false,
    hideEmpty: false,
    dataLayers: []
  };

  $.each(['showFloodlight','showUniversal','showClassic','showSitecatalyst','showGTMLoad'],function(i,prop){
    if (!dataslayer.options.hasOwnProperty(prop)) dataslayer.options[prop] = true;
  });
  if(!dataslayer.options.hasOwnProperty('blockTags')) dataslayer.options.blockTags = false;
  if(!dataslayer.options.hasOwnProperty('collapseNested')) dataslayer.options.collapseNested = false;
  if(!dataslayer.options.hasOwnProperty('hideEmpty')) dataslayer.options.hideEmpty = false;
  if(!dataslayer.options.hasOwnProperty('ignoredTags')) dataslayer.options.ignoredTags = [];
  if(!dataslayer.options.hasOwnProperty('dataLayers')) dataslayer.options.dataLayers = [];

  chrome.storage.sync.get(null,function(items){
    var ourItems = items;

    $.each(['showFloodlight','showUniversal','showClassic','showSitecatalyst','showGTMLoad'],function(i,prop){
      if (!ourItems.hasOwnProperty(prop)) ourItems[prop] = true;
    });
    if(!ourItems.hasOwnProperty('blockTags')) ourItems.blockTags = false;
    if(!ourItems.hasOwnProperty('collapseNested')) ourItems.collapseNested = false;
    if(!ourItems.hasOwnProperty('hideEmpty')) ourItems.hideEmpty = false;
    if(!ourItems.hasOwnProperty('ignoredTags')) ourItems.ignoredTags = [];
    if(!ourItems.hasOwnProperty('dataLayers')) ourItems.dataLayers = [];

    localStorage['options'] = JSON.stringify(ourItems);

    $.each(ourItems,function(i,v){
      if (i==='ignoredTags')
        $('#ignoredTags').val(v.join(';'));
      else if (i==='dataLayers')
        $('#dataLayers').val(v.join(';'));
      else
        $('#'+i).prop('checked',v);
      });		
  });
}

function saveSettings(){
  $('input').each(function(){
    if ($(this).attr('id')=='ignoredTags')
  	  dataslayer.options[$(this).attr('id')] = $(this).val().split(';');
    else if ($(this).attr('id')=='dataLayers')
      dataslayer.options[$(this).attr('id')] = $(this).val().split(';');
    else
  	  dataslayer.options[$(this).attr('id')] = $(this).prop('checked');
  });
  localStorage['options'] = JSON.stringify(dataslayer.options);
  chrome.storage.sync.set(dataslayer.options);
  chrome.runtime.sendMessage({type: 'dataslayer_loadsettings',data: dataslayer.options});
}