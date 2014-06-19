// dsPanel.js
// this is where the magic happens

var dataslayer = {};
dataslayer.datalayers = [[]];
dataslayer.tags = [[]];
dataslayer.gtmIDs = [];
dataslayer.dLNs = [];
dataslayer.activeIndex = 0;
dataslayer.urls = [];
dataslayer.options = {showFloodlight: true, showUniversal: true, showClassic: true, showSitecatalyst: true, showGTMLoad: true, ignoredTags: []};
dataslayer.loading = false;

dataslayer.port = chrome.runtime.connect();


// loadSettings:
function loadSettings(){
  chrome.storage.sync.get(null,function(items){
    dataslayer.options = items;
    $.each(['showFloodlight','showUniversal','showClassic','showSitecatalyst','showGTMLoad'],function(i,prop){
      if (!dataslayer.options.hasOwnProperty(prop)) dataslayer.options[prop] = true;  
    });
    if (!dataslayer.options.hasOwnProperty('ignoredTags')) dataslayer.options.ignoredTags = [];  
  });

}


// parseUniversal:
// - v: tag object
// - ref: pageindex_tagindex e.g '2_3'
function parseUniversal(v,ref){
  var allParams = '';
  for (var param in v.allParams)
    allParams = allParams + '<tr class="allparams allparams' + ref + '"><td>' + param + '</td><td>' + v.allParams[param]+'</td></tr>\n';
  var therow = '<tr><td></td><td><u>'+v.tid+'</u> (Universal) <a class="toggle" data-toggle="' + ref + '">+</a></td></tr>\n'+allParams;
  switch(v.t) {  // what type of hit is it?
    case 'event':
      therow = therow + '\n<tr><td><b>category</b></td><td><span>'+v.ec+'</span></td></tr>' +
                        '\n<tr><td><b>action</b></td><td><span>'+v.ea+'</span></td></tr>';
      if (v.el) therow = therow + '\n<tr><td><b>label</b></td><td><span>'+v.el+'</span></td></tr>';
      if (v.ev) therow = therow + '\n<tr><td><b>value</b></td><td><span>'+v.ev+'</span></td></tr>';
      break;
    case 'pageview':
      therow = therow + '\n<tr><td><b>' + (v.dp ? 'path' : 'url') + '</b></td><td><span>' + (v.dp ? v.dp : v.dl) + '</span></td></tr>';
      break;
    case 'social':
      therow = therow + '\n<tr><td><b>network</b></td><td><span>'+v.sn+
        '</span></td></tr>\n<tr><td><b>action</b></td><td><span>'+v.sa+
        '</span></td></tr>\n<tr><td><b>target</b></td><td><span>'+v.st+'</span></td></tr>';
      break;
    case 'transaction':
      if(!v.cu) v.cu='';  // if no currency code set, blank it for display purposes
      therow = therow + '\n<tr><td></td><td><b>transaction '+v.ti+'</b></td></tr>\n';
      if(v.tr) therow = therow + '<tr><td><b>revenue</b></td><td><span>'+v.tr+' '+v.cu+'</span></td></tr>\n';
      if(v.ts) therow = therow + '<tr><td><b>shipping</b></td><td><span>'+v.ts+' '+v.cu+'</span></td></tr>\n';
      if(v.tt) therow = therow + '<tr><td><b>tax</b></td><td><span>'+v.tt+' '+v.cu+'</span></td></tr>\n';
      if(v.ta) therow = therow + '<tr><td><b>affiliation</b></td><td><span>'+v.ta+'</span></td></tr>\n';
      break;
    case 'item':
      if(!v.cu) v.cu='';  // if no currency code set, blank it for display purposes
      therow = therow + '\n<tr><td></td><td><b>transaction '+v.ti+'</b></td></tr>\n';
      if(v.in) therow = therow + '<tr><td><b>item/qty</b></td><td><span>('+v.iq+'x) '+v.in+'</span></td></tr>\n';
      if(v.ic) therow = therow + '<tr><td><b>sku</b></td><td><span>'+v.ic+'</span></td></tr>\n';
      if(v.iv) therow = therow + '<tr><td><b>variation</b></td><td><span>'+v.iv+'</span></td></tr>\n';
      if(v.ip) therow = therow + '<tr><td><b>price</b></td><td><span>'+v.ip+v.cu+'</span></td></tr>\n';
      break;
  }

  // enumerate custom dimensions and metrics
  $.each(v.utmCD,function(cd,cdv){
    therow = therow + '<tr><td><b>CD '+cd+'</b></td><td><span>'+cdv+'</span></td></tr>\n';
  });
  $.each(v.utmCM,function(cm,cmv){
    therow = therow + '<tr><td><b>CM '+cm+'</b></td><td><span>'+cmv+'</span></td></tr>\n';
  });
  $.each(v.utmCG,function(cm,cmv){
    therow = therow + '<tr><td><b>CG '+cm+'</b></td><td><span>'+cmv+'</span></td></tr>\n';
  });
  
  return therow;

}

// parseSiteCatalyst:
// - v: tag object
// - ref: pageindex_tagindex e.g '2_3'
function parseSiteCatalyst(v,ref){
  var allParams = '';
  for (var param in v.allParams)
    allParams = allParams + '<tr class="allparams allparams' + ref + '"><td>' + param + '</td><td>' + v.allParams[param]+'</td></tr>\n';
  var therow = '<tr><td></td><td><u>'+v.rsid+'</u> (SiteCatalyst) <a class="toggle" data-toggle="' + ref + '">+</a></td></tr>\n'+allParams;
  if (v.pe=='lnk_o') {
    therow = therow + '<tr><td></td><td><span><b>click event</b></td></tr>\n';
    if (v.pev2) therow = therow + '<tr><td><b>link name</b></td><td><span>'+v.pev2+'</span></td></tr>\n';
  }
  else if (v.pe=='lnk_e') {
    therow = therow + '<tr><td></td><td><span><b>exit link</b></td></tr>\n';
    if (v.pev2) therow = therow + '<tr><td><b>link name</b></td><td><span>'+v.pev2+'</span></td></tr>\n';
    if (v.pev1) therow = therow + '<tr><td><b>link url</b></td><td><span>'+v.pev1+'</span></td></tr>\n';
  }
  if (v.pageName) therow = therow + '<tr><td><b>pageName</b></td><td><span>'+v.pageName+'</span></td></tr>\n';
  if (v.events) therow = therow + '<tr><td><b>events</b></td><td><span>'+v.events+'</span></td></tr>\n';
  if (v.products){
    var productsArray = v.products.split(',');
    if (productsArray.length > 1)
      $.each(productsArray,function(productKey,productValue){
        therow = therow + '<tr><td><b>product '+productKey+'</b></td><td><span>'+productValue+'</span></td></tr>\n';  
      });
    else
      therow = therow + '<tr><td><b>product</b></td><td><span>'+v.products+'</span></td></tr>\n';
  }


  // enumerate eVars and props
  $.each(v.scEvars,function(cd,cdv){
    if (cd == '0')
      therow = therow + '<tr><td><b>campaign</b></td><td><span>'+cdv+'</span></td></tr>\n';
    else
    therow = therow + '<tr><td><b>eVar'+cd+'</b></td><td><span>'+cdv+'</span></td></tr>\n';
  });
  $.each(v.scProps,function(cm,cmv){
    therow = therow + '<tr><td><b>prop'+cm+'</b></td><td><span>'+cmv+'</span></td></tr>\n';
  });

  return therow;
}

// parseClassic:
// - v: tag object
// - ref: pageindex_tagindex e.g '2_3'
function parseClassic(v,ref){
  var allParams = '';
  for (var param in v.allParams)
    allParams = allParams + '<tr class="allparams allparams' + ref + '"><td>' + param + '</td><td>' + v.allParams[param]+'</td></tr>\n';
  var therow = '<tr><td></td><td><u>'+v.utmac+'</u> ('+v.reqType+') <a class="toggle" data-toggle="' + ref + '">+</a></td></tr>\n'+allParams;
  switch(v.utmt){
    case 'event':
      if (v.utme.indexOf('5(')>=0){
        // console.log(v.utme);
        var eventdata = v.utme.match(/5\([^)]+(?=\))/i)[0].replace(/\'1/g,')').replace(/\'3/g,'!').substring(2).split('*'); //find events and unescape
        $.each(eventdata,function(a,b){eventdata[a]=eventdata[a].replace(/\'2/g,'*').replace(/\'0/g,'\'');});
        therow = therow + '\n<tr><td><b>category</b></td><td><span>'+eventdata[0]+
          '</span></td></tr>\n<tr><td><b>action</b></td><td><span>'+eventdata[1]+
          '</span></td></tr>\n<tr><td><b>label</b></td><td><span>'+eventdata[2]+'</span></td></tr>';  
        if (eventdata[3]) therow = therow + '\n<tr><td><b>value</b></td><td>'+eventdata[3]+'</td></tr>';
        }
      break;
    case 'transaction':
      therow = therow + '\n<tr><td></td><td><b>transaction '+v.utmtid+'</b></td></tr>\n';
      if(v.utmtto) therow = therow + '<tr><td><b>revenue</b></td><td><span>'+v.utmtto+'</span></td></tr>\n';
      if(v.utmtsp) therow = therow + '<tr><td><b>shipping</b></td><td><span>'+v.utmtsp+'</span></td></tr>\n';
      if(v.utmttx) therow = therow + '<tr><td><b>tax</b></td><td><span>'+v.utmttx+'</span></td></tr>\n';
      if(v.utmtst) therow = therow + '<tr><td><b>affiliation</b></td><td><span>'+v.utmtst+'</span></td></tr>\n';
      break;
    case 'item':
      therow = therow + '\n<tr><td></td><td><b>transaction '+v.utmtid+'</b></td></tr>\n';
      if(v.utmipn) therow = therow + '<tr><td><b>item/qty</b></td><td><span>('+v.utmiqt+'x) '+v.utmipn+'</span></td></tr>\n';
      if(v.utmipc) therow = therow + '<tr><td><b>sku</b></td><td><span>'+v.utmipc+'</span></td></tr>\n';
      if(v.utmiva) therow = therow + '<tr><td><b>category</b></td><td><span>'+v.utmiva+'</span></td></tr>\n';
      if(v.utmipr) therow = therow + '<tr><td><b>price</b></td><td><span>'+v.utmipr+'</span></td></tr>\n';
      break;
    case 'social':
      therow = therow + '\n<tr><td><b>network</b></td><td><span>'+v.utmsn+
              '</span></td></tr>\n<tr><td><b>action</b></td><td><span>'+v.utmsa+
              '</span></td></tr>\n<tr><td><b>target</b></td><td><span>'+v.utmsid+'</span></td></tr>';
      break;
    default:  //pageview
      therow = therow + '\n<tr><td><b>url</b></td><td><span>'+v.utmhn+v.utmp+'</span></td></tr>';
      break;
    }
  if ((v.utme)&&(v.utme.indexOf('14(')>=0)) { //we have performance information
    var performancedata = v.utme.match(/14\([\d\*]+\)\([\d\*]+\)/i)[0].substring(2);
    therow = therow + '\n<tr><td><b>speed</b></td><td><span>'+performancedata.replace(')(',')<br>(')+'</span></td></tr>';
  }
  if ((v.utme)&&(v.utme.indexOf('12(')>=0)) { //we have in-page information
    var inpagedata = v.utme.match(/12\([^)]+(?=\))/i)[0].substring(3).replace('\'1',')').replace('\'2','*').replace('\'3','!').replace('\'0','\'');
    therow = therow + '\n<tr><td><b>in-page ID</b></td><td><span>'+inpagedata+'</span></td></tr>';
  }
  if ((v.utme)&&(v.utme.indexOf('8(')>=0)) { //we have CVs here
    var gaCVs = v.utme.substring(v.utme.indexOf('8(')).match(/[^\)]+(\))/g);
    
    $.each(gaCVs,function(i,d){
      gaCVs[i]=gaCVs[i].replace(/^[891][01(]+/,'').match(/[^\*|^\)]+(?=[\*\)])/g); 
      }
    );
    var newspot=0;
    var gaCVsfixed = [{},{},{}];
    for (var row in gaCVs[0]){
      if (gaCVs[0][row].indexOf('!')>=0){
        newspot = gaCVs[0][row].substring(0,gaCVs[0][row].indexOf('!'))-1;

        $.each(gaCVs,function(a,b){
          if (b.hasOwnProperty(row)) b[row] = b[row].substring(b[row].indexOf('!')+1);
        });
      }

      gaCVsfixed[0][newspot] = gaCVs[0][row];
      gaCVsfixed[1][newspot] = gaCVs[1][row];
      try{
      gaCVsfixed[2][newspot] = typeof gaCVs[2] !== 'undefined' ? (typeof gaCVs[2][row] !== 'undefined' ? gaCVs[2][row].charAt(0) : '0') : '0';
      }
      catch(err){
        console.log(err+' @ CV '+newspot);
      }

      newspot = newspot+1;
    }

    newspot = 0;
    for (var row in gaCVs[2]){
      if (gaCVs[2][row].indexOf('!')>=0){
        newspot = gaCVs[2][row].substring(0,gaCVs[2][row].indexOf('!'))-1;
        for (i=0;i<newspot;i++){gaCVsfixed[2][i]='0';}
        gaCVs[2][row] = gaCVs[2][row].substring(gaCVs[2][row].indexOf('!')+1);
      }
      try{
      gaCVsfixed[2][newspot] = typeof gaCVs[2] !== 'undefined' ? (typeof gaCVs[2][row] !== 'undefined' ? gaCVs[2][row].charAt(0) : '0') : '0';
      }
      catch(err){
        console.log(err+' @ CV '+newspot);
      }

      newspot = newspot+1;
    }

    gaCVs = gaCVsfixed;

    $.each(gaCVs[0],function(i,d){
          gaCVs[0][i]=gaCVs[0][i].replace('\'1',')').replace('\'2','*').replace('\'3','!').replace('\'0','\'');
          gaCVs[1][i]=gaCVs[1][i].replace('\'1',')').replace('\'2','*').replace('\'3','!').replace('\'0','\'');

          therow = therow + '<tr><td><b>CV '+(parseInt(i)+1)+'</b></td><td><span>'+gaCVs[0][i]+' <b>=</b> '+gaCVs[1][i]+' <i>(';
          switch (String(gaCVs[2][i])){
            case '0': therow = therow + 'no scope-&gt; page';
              break;
            case '1': therow = therow + 'visitor scope';
              break;
            case '2': therow = therow + 'session scope';
              break;
            case '3': therow = therow + 'page scope';
              break;
          }
          therow = therow + ')</i></span></td></tr>\n';
        // }
      }
    );
  }

  return therow;
}

// parseFloodlight:
// - v: tag object
function parseFloodlight(v){
  var therow = '<tr><td></td><td><u>Floodlight</u></td></tr>';
  for (var flParam in v.allParams)
    therow = therow + '\n<tr><td><b>'+flParam+'</b></td><td><span>'+v.allParams[flParam]+'</span></td></tr>';
  return therow;
}


// datalayerHTML
// - index: index of dataslayer.datalayers
// returns contents of td.dlt > ul
function datalayerHTML(index) {
  var allrows = '';

  $.each(dataslayer.datalayers[index],function(i,v){ //iterate each push group on the page
    var therow = '<li class="eventbreak submenu dlnum'+index+'"></li>\n' + '<li class="event submenu dlnum'+index+'"><table cols=2>';
    $.each(v,function(k1,x){ //iterate each individual up to 5 levels of keys-- clean this up later
        if(typeof x == 'object'){
          for (var k2 in x){
            if(typeof x[k2] == 'object'){
              for (var k3 in x[k2]) {
                if (typeof x[k2][k3] == 'object'){
                  for (var k4 in x[k2][k3]){
                    if (typeof x[k2][k3][k4] == 'object'){
                      for (var k5 in x[k2][k3][k4]){
                        therow = therow + '\n' + '<tr><td><b>'+k1+'.'+k2+'.'+k3+'.'+k4+'.'+k5+'</b></td><td><span>'+x[k2][k3][k4][k5]+'</span></td></tr>';    
                      }
                    }
                    else
                      therow = therow + '\n' + '<tr><td><b>'+k1+'.'+k2+'.'+k3+'.'+k4+'</b></td><td><span>'+x[k2][k3][k4]+'</span></td></tr>';  
                  }
                }
                else
                  therow = therow + '\n' + '<tr><td><b>'+k1+'.'+k2+'.'+k3+'</b></td><td><span>'+x[k2][k3]+'</span></td></tr>';
              }
            }
            else
              therow = therow + '\n' + '<tr><td><b>'+k1+'.'+k2+'</b></td><td><span>'+x[k2]+'</span></td></tr>';
          }          
        }
        else
          therow = therow + '\n' + '<tr><td><b>'+k1+'</b></td><td><span>'+x+'</span></td></tr>';
      }
    );
    therow = therow +  '</table></li>';
    allrows = therow + allrows;
  });

  if(dataslayer.gtmIDs[index])
    allrows = '<li class="event submenu dlnum'+index+'"><table cols=2><tr><td></td><td><u>'+dataslayer.gtmIDs[index]+'</u>'+(dataslayer.dLNs[index]=='dataLayer'||typeof dataslayer.dLNs[index]=='undefined'?'':' <i>('+dataslayer.dLNs[index]+')</i>')+'</td></tr></table></li>\n' + allrows;

  return allrows;
}

// tagHTML:
// - index: index of dataslayer.tags
// returns contents of td.utm > ul
function tagHTML(index){
  var allrows = '';
  $.each(dataslayer.tags[index],function(q,v){
    if (v.tid && (dataslayer.options.ignoredTags.indexOf(v.tid)>-1)) return;
    if (v.utmac && (dataslayer.options.ignoredTags.indexOf(v.utmac)>-1)) return;

    var therow = '';
    
    if(((v.reqType=='classic') || (v.reqType=='dc.js')) && dataslayer.options.showClassic)
        therow = parseClassic(v,index + '_' + q);
    else if ((v.reqType=='universal') && dataslayer.options.showUniversal)
        therow = parseUniversal(v,index + '_' + q);
    else if ((v.reqType=='floodlight') && dataslayer.options.showFloodlight)
        therow = parseFloodlight(v);
    else if ((v.reqType=='sitecatalyst') && dataslayer.options.showSitecatalyst)
        therow = parseSiteCatalyst(v,index + '_' + q);
    else
        return;  

    therow = '<li class="event submenu dlnum'+index+'"><table cols=2>'+therow+'</table></li>\n';
    if (q<(dataslayer.tags[index].length-1)) therow = '<li class="eventbreak submenu dlnum'+index+'"></li>\n'+therow;
  allrows = therow + allrows;
  }
  );
return allrows;
}


// updateUI: called whenever dataLayer changes or a new tag fires
// parses dataslayer.tags and dataslayer.datalayers arrays and displays them
// - pageIndex: page index or -1 (default: -1)
// - type: datalayer|tag|all (default: all)
function updateUI(pageIndex,type) {
  $.each(['showFloodlight','showUniversal','showClassic','showSitecatalyst','showGTMLoad'],function(i,prop){
    if (!dataslayer.options.hasOwnProperty(prop)) dataslayer.options[prop] = true;  
  });
  if (!dataslayer.options.hasOwnProperty('ignoredTags')) dataslayer.options.ignoredTags = [];

  if (pageIndex !== 0) pageIndex = pageIndex || -1;
  type = type || 'all';

  if (pageIndex > -1){
    $('.pure-menu:not(#sub'+pageIndex+') li.newpage').removeClass('seeking');
    if ($('#sub'+pageIndex).length>0){
      if (type!=='tag')
        $('#sub'+pageIndex+'>table td.dlt>ul').html(datalayerHTML(pageIndex));
      if (type!=='datalayer')
        $('#sub'+pageIndex+'>table td.utm>ul').html(tagHTML(pageIndex));
    }
    else{
        $('#datalayeritems').prepend('<div id="sub'+pageIndex+'" class="pure-menu pure-menu-open"><ul>'+
        '<li class="newpage" data-dlnum="'+pageIndex+'"><a class="newpage page'+pageIndex+' currentpage" data-dlnum="'+pageIndex+'">'+dataslayer.urls[pageIndex]+'</a></li>\n'+
        '</ul><table cols=2 width=100%><tbody><tr><td class="dlt"><ul>'+datalayerHTML(pageIndex)+'</ul></td>'+
        '<td class="utm"><ul>'+tagHTML(pageIndex)+'</ul></td></tr></tbody></table></div>\n');
        if (dataslayer.options.showGTMLoad){
          if (dataslayer.datalayers[pageIndex].length>0)
            $('#sub'+dataslayer.activeIndex+' li.newpage').addClass('hasGTM').removeClass('seeking').removeClass('noGTM');
          else if (dataslayer.loading)
            $('#sub'+dataslayer.activeIndex+' li.newpage').addClass('seeking').removeClass('hasGTM').removeClass('noGTM');
          else
            $('#sub'+dataslayer.activeIndex+' li.newpage').addClass('noGTM').removeClass('seeking').removeClass('hasGTM');
          }
        else $('li.newpage').removeClass('noGTM').removeClass('seeking').removeClass('hasGTM');
        
    }
    $('#sub'+pageIndex+'.clicked-closed .dlnum'+pageIndex).addClass('submenu-hidden');
  }
  else if (pageIndex === -1) {  //refresh all
    $('#datalayeritems').html('');

    $.each(dataslayer.datalayers,function(a,dL){  //iterate each page's dataLayer
      $('#datalayeritems').prepend('<div id="sub'+a+'" class="pure-menu pure-menu-open"><ul>'+
        '<li class="newpage" data-dlnum="'+a+'"><a class="newpage page'+a+' currentpage" data-dlnum="'+a+'">'+dataslayer.urls[a]+'</a></li>\n'+
        '</ul><table cols=2 width=100%><tbody><tr><td class="dlt"><ul>'+datalayerHTML(a)+'</ul></td>'+
        '<td class="utm"><ul>'+tagHTML(a)+'</ul></td></tr></tbody></table></div>\n');

        if (dataslayer.options.showGTMLoad){
          if (dataslayer.datalayers[a].length>0)
            $('#sub'+a+' li.newpage').addClass('hasGTM').removeClass('seeking').removeClass('noGTM');
          else if (dataslayer.loading)
            $('#sub'+a+' li.newpage').addClass('seeking').removeClass('hasGTM').removeClass('noGTM');
          else
            $('#sub'+a+' li.newpage').addClass('noGTM').removeClass('seeking').removeClass('hasGTM');
          }
        else $('#sub'+dataslayer.activeIndex+' li.newpage').removeClass('noGTM').removeClass('seeking').removeClass('hasGTM');
    });
  } //end refresh all

  // click setup and various cleanup
  for (var i=0;i<dataslayer.datalayers.length-1;i++){
      $('#sub'+i+':not(.clicked-open) .dlnum'+i).addClass('submenu-hidden');
      $('.page'+i).removeClass('currentpage');
    }

  $('.pure-menu').has('td.dlt li').find('td.utm').has('li').css('border-left','1px dashed rgb(112, 111, 111)');
  $('.pure-menu').has('td.utm li').find('td.dlt').has('li').css('border-right','1px dashed rgb(112, 111, 111)');
  $('.pure-menu').not($('.pure-menu').has('td.dlt li')).find('td.utm').has('li').css('border-left','none');
  $('.pure-menu').not($('.pure-menu').has('td.utm li')).find('td.dlt').has('li').css('border-right','none');
  $('td.dlt').not($('td.dlt').has('li')).css('width','0');
  $('td.utm').not($('td.utm').has('li')).css('width','0');
  $('td.dlt').has('li').css('width','auto');
  $('td.utm').has('li').css('width','auto');
  $('td.utm>ul>li:first-child.eventbreak').remove();

  $('a.toggle').off('click.dataslayer');

  $('a.toggle').on('click.dataslayer',function(){
    if($(this).html()=='+'){
      $('.allparams'+$(this).data('toggle')).addClass('allparams-visible')  ;
      $(this).html('-');
    }
    else{
      $('.allparams'+$(this).data('toggle')).removeClass('allparams-visible');
      $(this).html('+');
    }
  });

  $('a.newpage').off('click.dataslayer');
  $('a.newpage').on('click.dataslayer',function(){
      $('.dlnum'+$(this).data('dlnum')).toggleClass('submenu-hidden');
      $('#sub'+$(this).data('dlnum')).addClass('clicked');
      if ($('.dlnum'+$(this).data('dlnum')).hasClass('submenu-hidden')) $('#sub'+$(this).data('dlnum')).addClass('clicked-closed').removeClass('clicked-open');
      else $('#sub'+$(this).data('dlnum')).addClass('clicked-open').removeClass('clicked-closed');
    }
  );
  // end click setup and various cleanup

}


function testDL(dlName) {
  function onEval(result, isException) {
    if (result) {
        dataslayer.datalayers[dataslayer.activeIndex]=result;
    }
    // get the current URL and grab it
    chrome.devtools.inspectedWindow.eval('window.location.href',
      function(url,error){
        dataslayer.urls[dataslayer.activeIndex]=url;
        // console.log(url);
        // find first GTM tag and get its ID
        chrome.devtools.inspectedWindow.eval('document.querySelector(\'script[src*=googletagmanager\\\\.com]\').getAttribute(\'src\').match(/GTM.*/)',
          function(gtm,error){
            if (!error)
              dataslayer.gtmIDs[dataslayer.activeIndex]=gtm[0].split('&')[0];
            updateUI();
          }
        );
      }
    );
  }
  chrome.devtools.inspectedWindow.eval(dlName, onEval);
}

function messageListener(message,sender,sendResponse){
  // console.log(message);
  if ((message.type=='dataslayer_gtm')&&(message.tabID==chrome.devtools.inspectedWindow.tabId)){
    chrome.devtools.inspectedWindow.eval('window.location.href',
      function(url,error){dataslayer.urls[dataslayer.activeIndex]=url;}
      );

    if (message.data=='notfound'){
      dataslayer.loading = false;
      if (dataslayer.options.showGTMLoad)
        $('#sub'+dataslayer.activeIndex+' li.newpage').addClass('noGTM').removeClass('seeking');
      else
        $('#sub'+dataslayer.activeIndex+' li.newpage').removeClass('seeking');
      
    }
    else if (message.data=='found'){
      dataslayer.loading = false;
      if (dataslayer.options.showGTMLoad)
        $('#sub'+dataslayer.activeIndex+' li.newpage').addClass('hasGTM').removeClass('seeking');
      else
        $('#sub'+dataslayer.activeIndex+' li.newpage').removeClass('seeking');
      
      dataslayer.gtmIDs[dataslayer.activeIndex]=message.gtmID;
      dataslayer.dLNs[dataslayer.activeIndex]=message.dLN;

      updateUI(dataslayer.activeIndex,'datalayer');

    }
    else{   
      $('#sub'+dataslayer.activeIndex+' li.newpage').addClass('hasGTM').removeClass('seeking').removeClass('noGTM');
      dataslayer.datalayers[dataslayer.activeIndex]=JSON.parse(message.data);
      // get the current URL and grab it
      
      dataslayer.gtmIDs[dataslayer.activeIndex]=message.gtmID;
      dataslayer.dLNs[dataslayer.activeIndex]=message.dLN;

      updateUI(dataslayer.activeIndex,'datalayer');
    }
  }
  else if (message.type=='dataslayer_loadsettings'){
    // console.log(message.data);
    for (var a in message.data) { dataslayer.options[a] = message.data[a]; }
    updateUI();
  }
}

// newPageLoad: called when user navigates to a new page 
function newPageLoad(newurl){
  dataslayer.loading = true;
  loadSettings();
  dataslayer.port = chrome.runtime.connect();
  dataslayer.port.onMessage.addListener(messageListener);

  dataslayer.activeIndex = dataslayer.activeIndex + 1;
  dataslayer.datalayers[dataslayer.activeIndex] = [];
  dataslayer.urls[dataslayer.activeIndex] = newurl;
  dataslayer.tags[dataslayer.activeIndex] = [];

  updateUI(dataslayer.activeIndex);

  chrome.runtime.sendMessage({type: 'dataslayer_pageload',tabID: chrome.devtools.inspectedWindow.tabId});
}

// newRequest: called on a new network request of any kind
// we use this to capture tags for parsing
function newRequest(request){
  var reqType = '';
  if (/__utm\.gif/i.test(request.request.url)){
    if (/stats\.g\.doubleclick\.net/i.test(request.request.url))
      reqType = 'dc.js';
    else reqType = 'classic';
  }
  else if (/google-analytics\.com\/collect/i.test(request.request.url)){
    reqType = 'universal';
  }
  else if ((/\.doubleclick\.net\/activity/i.test(request.request.url.split('?')[0]))&&(request.response.status!==302)){
    reqType = 'floodlight';
  }
  else if (/\/b\/ss\//i.test(request.request.url)){
    reqType = 'sitecatalyst';
  }
  else return;  //break out if it's not a tag we're looking for, else...

  var requestURI;

  if (request.request.method=='GET'){
    requestURI = (reqType=='floodlight') ? request.request.url : request.request.url.split('?')[1];
  }
  else if (request.request.method=='POST') {
    requestURI = request.request.postData.text;
    // console.log(requestURI);
  }

  // parse query string into key/value pairs
  var queryParams = {};
  if ((reqType == 'classic') || (reqType == 'universal') || (reqType == 'dc.js') || (reqType == 'sitecatalyst'))
      {try{requestURI.split('&').
                                                    forEach(function(pair){
                                                      pair = pair.split('=');
                                                      try{
                                                        queryParams[pair[0]] = decodeURIComponent(pair[1] || '');
                                                      }
                                                      catch(e) {
                                                        console.log(e+' error with '+pair[0]+' = '+pair[1]);
                                                      }
                                                    }
                                                    );
                                                  }
                                                  catch(e){console.log('error '+e+' with url '+request.request.url);}}
  else if (reqType == 'floodlight')
    requestURI.split(';').slice(1).
                                      forEach(function(pair){
                                        pair = pair.split('=');
                                        queryParams[pair[0]] = decodeURIComponent(pair[1] || '');
                                      }
                                      );
  


  var utmParams = {reqType:reqType,allParams:queryParams};
  
  //push params we're looking for if it's not a floodlight (we'll just show them all)
  if ((reqType != 'floodlight') && (reqType != 'sitecatalyst')){
    var utmTestParams = ['tid','t','dl','dt','dp','ea','ec','ev','el','ti','ta','tr','ts','tt',  //UA
                  'in','ip','iq','ic','iv','cu','sn','sa','st','uid','linkid',                    //UA
                  '_utmz','utmac','utmcc','utme','utmhn','utmdt','utmp','utmt','utmsn',   //classic
                  'utmsa','utmsid','utmtid','utmtto','utmtsp','utmttx','utmtst','utmipn', //classic
                  'utmiqt','utmipc','utmiva','utmipr',                                    //classic
                  ];
    var utmCM = {};
    var utmCD = {};
    var utmCG = {};
    $.each(queryParams,function(k,v){
        if ($.inArray(k,utmTestParams)>=0){utmParams[k]=v;}
        else if (k.substring(0,2)=='cd'){
          utmCD[k.substring(2)]=v;
        }
        else if (k.substring(0,2)=='cm'){
          utmCM[k.substring(2)]=v;
        }
        else if (k.substring(0,2)=='cg'){
          utmCG[k.substring(2)]=v;
        }
      }
    );
    if (utmCM!={}) utmParams.utmCM=utmCM;
    if (utmCD!={}) utmParams.utmCD=utmCD;
    if (utmCG!={}) utmParams.utmCG=utmCG;
  }
  else if (reqType == 'sitecatalyst'){
    utmParams.rsid = request.request.url.match(/(?:\/b\/ss\/([^\/]+))(?=\/)/)[1];
    var scEvars = {};
    var scProps = {};
    var scTestParams = ['pageName','pe','events','products','pev2','pev1'];
    $.each(queryParams,function(k,v){
        if ($.inArray(k,scTestParams)>=0){utmParams[k]=v;}
        else if (/v[0-9]{1,2}/i.test(k)){
          scEvars[k.substring(1)]=v;
        }
        else if (/c[0-9]{1,2}/i.test(k)){
          scProps[k.substring(1)]=v;
        }
      }
    );
    if (scEvars!={}) utmParams.scEvars=scEvars;
    if (scProps!={}) utmParams.scProps=scProps;    
  }
  utmParams.__url = request.request.url;
  dataslayer.tags[dataslayer.activeIndex].push(utmParams);
  updateUI(dataslayer.activeIndex,'tag');
}


loadSettings();


//set up UI
$('a.settings').prop('href','chrome-extension://'+chrome.runtime.id+'/options.html');
$('a.clearbtn').leanModal({ top : 0});
$('#clearbtnyes').click(function(){
    dataslayer.datalayers = [dataslayer.datalayers[dataslayer.activeIndex]];
    dataslayer.tags = [dataslayer.tags[dataslayer.activeIndex]];
    dataslayer.gtmIDs = [dataslayer.gtmIDs[dataslayer.activeIndex]];
    dataslayer.dLNs = [dataslayer.dLNs[dataslayer.activeIndex]];
    dataslayer.urls = [dataslayer.urls[dataslayer.activeIndex]];
    dataslayer.activeIndex = 0;
    updateUI();
    $('.dlnum0').toggleClass('submenu-hidden');
    $("#lean_overlay").fadeOut(200);$('#clearconfirm').css({"display":"none"});
});

// chrome.devtools.inspectedWindow.eval('window.location.href',
//   function(url,error){dataslayer.urls[dataslayer.activeIndex]=url; updateUI();}
//   );
// chrome.devtools.inspectedWindow.eval('document.querySelector(\'script[src*=googletagmanager\\\\.com]\').getAttribute(\'src\').match(/GTM.*/)',
//   function(gtm,error){dataslayer.gtmIDs[dataslayer.activeIndex]=gtm; updateUI();}
//   );



chrome.devtools.network.getHAR(function(harlog){
  if(harlog && harlog.entries)
    harlog.entries.forEach(function(v,i,a){
      newRequest(v);
    });
  });


chrome.devtools.network.onNavigated.addListener(newPageLoad);
chrome.devtools.network.onRequestFinished.addListener(newRequest);

dataslayer.port.onMessage.addListener(messageListener);


chrome.devtools.inspectedWindow.eval('dataslayer',function(exists,error){
  // if (!error) chrome.runtime.sendMessage({type: 'dataslayer_refresh',tabID: chrome.devtools.inspectedWindow.tabId});
  if (!error) { //was already injected
    dataslayer.gtmIDs[dataslayer.activeIndex]=exists.gtmID;
    dataslayer.dLNs[dataslayer.activeIndex]=exists.dLN;
    testDL(exists.dLN);
  }
  else {  //was not already injected
    chrome.runtime.sendMessage({type: 'dataslayer_opened',tabID: chrome.devtools.inspectedWindow.tabId});
    testDL('dataLayer');
  }
});

chrome.devtools.inspectedWindow.eval('(function(){ var abla=[]; for (var attr in window)if (((typeof window[attr]==="object")&&(window[attr]))&&("src" in window[attr])) if ((attr.substring(0,4)==="s_i_")&&(window[attr].src.indexOf("/b/ss/"))) abla.push(window[attr].src); return abla; })();',
  function(exists,error){
    if(!error) for (var a in exists)newRequest({request:{url:exists[a],method:'GET'}});
});
