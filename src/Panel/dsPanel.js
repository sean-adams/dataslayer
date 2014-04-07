// dsPanel.js
// this is where the magic happens

var dataslayer = {};
dataslayer.datalayers = [[]];
dataslayer.tags = [[]];
dataslayer.gtmIDs = [];
dataslayer.activeIndex = 0;
dataslayer.urls = [];

// updateUI: called whenever dataLayer changes or a new tag fires
// parses dataslayer.tags and dataslayer.datalayers arrays and displays them
function updateUI() {
  $('#datalayeritems').html('');
  var therow = '';

  $.each(dataslayer.datalayers,function(a,dL){
    $('#datalayeritems').prepend('<div id="sub'+a+'" class="pure-menu pure-menu-open"><ul></ul><table cols=2 width=100%><tbody><tr><td class="dlt"><ul></ul></td><td class="utm"><ul></ul></td></tr></tbody></table></div>\n');
    $('#datalayeritems').append('\n');    

    $.each(dL,function(i,v){
      therow = '';
      $.each(v,function(k,x){
          if(typeof x == 'object'){
            for (var q in x){
              if(typeof q == 'object'){
                for (var z in x[q])
                  therow = therow + '\n' + '<tr><td><b>'+k+'['+q+'].'+z+'</b></td><td><span>'+x[q][z]+'</span></td></tr>';
              }
              else{
                therow = therow + '\n' + '<tr><td><b>'+k+'['+q+']</b></td><td><span>'+x[q]+'</span></td></tr>';
              }
            }          
          }
          else
            therow = therow + '\n' + '<tr><td><b>'+k+'</b></td><td><span>'+x+'</span></td></tr>';
        }
      ); 
      $('#sub'+a+' td.dlt ul').prepend('<li class="event submenu dlnum'+a+'"><table cols=2>'+therow+'</table></li>\n');
      $('#sub'+a+' td.dlt ul').prepend('<li class="eventbreak submenu dlnum'+a+'"></li>\n');
    });

    if(dataslayer.gtmIDs[a]){
      $('#sub'+a+' td.dlt ul').prepend('<li class="event submenu dlnum'+a+'"><table cols=2><tr><td></td><td><u>'+dataslayer.gtmIDs[a]+'</u></td></tr></table></li>\n');
      // $('#sub'+a+' td.dlt ul').prepend('<li class="eventbreak submenu dlnum'+a+'"></li>\n');
    }

    $('#sub'+a+'>ul').prepend('<li class="newpage" data-dlnum="'+a+'"><a href="#" class="newpage page'+a+' currentpage" data-dlnum="'+a+'">'+dataslayer.urls[a]+'</a></li>\n');
  });

  $.each(dataslayer.tags,function(a,dL){
    $.each(dL,function(i,v){
      therow = '';

      // GA params:
      // utmcc: cookie
      var allParams = '';
      for (var param in v.allParams)
        allParams = allParams + param + ': ' + v.allParams[param]+'\n';

      switch(v.reqType){
        case 'classic':
          therow = '<tr><td></td><td title="'+allParams+'"><u>'+v.utmac+'</u> (classic)</td></tr>';
          switch(v.utmt){
            case 'event':
              var eventdata = v.utme.split(')')[0].substring(2).split('*');
              therow = therow + '\n<tr><td><b>category</b></td><td><span>'+eventdata[0]+'</span></td></tr>\n<tr><td><b>action</b></td><td><span>'+eventdata[1]+'</span></td></tr>\n<tr><td><b>label</b></td><td><span>'+eventdata[2]+'</span></td></tr>';  
              if (eventdata[3]) therow = therow + '\n<tr><td><b>value</b></td><td>'+eventdata[3]+'</td></tr>';
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
          if ((v.utme)&&(v.utme.indexOf('8(')>=0)) { //we have CVs here
            var gaCVs = v.utme.substring(v.utme.indexOf('8(')).match(/[^\)]+(\))/g);
            
            $.each(gaCVs,function(i,d){
              //split on * separators or ! that lets us know nothing was set or ) for the end
              gaCVs[i]=gaCVs[i].replace(/^[891][01(]+/,'').match(/[^\*|^.\!|^\)]+(\*|\!|\))/g); 
              }
            );

            $.each(gaCVs[0],function(i,d){
                if (d.substring(d.length-1)=='!'){
                  gaCVs[0][i]=''; gaCVs[1][i]=''; gaCVs[2][i]='';
                }
                else {
                  gaCVs[0][i]=gaCVs[0][i].substring(0,gaCVs[0][i].length-1);
                  gaCVs[1][i]=gaCVs[1][i].substring(0,gaCVs[1][i].length-1);

                  //scope is optional so we may have errors with [2]
                  try {
                    gaCVs[2][i]=gaCVs[2][i].substring(0,gaCVs[2][i].length-1);
                  }
                  catch(error) {
                    console.log(error);
                    if (!gaCVs[2]) gaCVs[2] = [];
                    if (!gaCVs[2][i]) gaCVs[2][i]='0'; //scope defaults to page, let's make this a special case
                  }
                  finally {
                    therow = therow + '<tr><td><b>CV '+(i+1)+'</b></td><td><span>'+gaCVs[0][i]+' <b>=</b> '+gaCVs[1][i]+' <i>(';
                    switch (String(gaCVs[2][i])){
                      case '0': 
                        therow = therow + 'no scope-&gt; page';
                        break;
                      case '1':
                        therow = therow + 'visitor scope';
                        break;
                      case '2':
                        therow = therow + 'session scope';
                        break;
                      case '3':
                        therow = therow + 'page scope';
                        break;
                    }
                    therow = therow + ')</i></span></td></tr>\n';
                  }
                }
              }
            );
          }
          break;
        case 'universal':
          therow = '<tr><td></td><td title="'+allParams+'"><u>'+v.tid+'</u> (Universal)</td></tr>';
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
              therow = therow + '\n<tr><td><b>network</b></td><td><span>'+v.sn+'</span></td></tr>\n<tr><td><b>action</b></td><td><span>'+v.sa+'</span></td></tr>\n<tr><td><b>target</b></td><td><span>'+v.st+'</span></td></tr>';
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
            therow = therow + '<tr><td><b>dimension '+cd+'</b></td><td><span>'+cdv+'</span></td></tr>\n';
          });
          $.each(v.utmCM,function(cm,cmv){
            therow = therow + '<tr><td><b>metric '+cm+'</b></td><td><span>'+cmv+'</span></td></tr>\n';
          });
          
          break;
        }

      $('#sub'+a+' td.utm ul').prepend('<li class="event submenu dlnum'+a+'"><table cols=2>'+therow+'</table></li>\n');
      // $('#sub'+a+' td.utm ul').prepend('<li class="eventbreak submenu dlnum'+a+'"></li>\n');
    }
    );
  }
  );

  for (var i=0;i<dataslayer.datalayers.length-1;i++){
      $('.dlnum'+i).toggleClass('submenu-hidden');
      $('.dlnum'+i).toggleClass('submenu');
      $('.page'+i).toggleClass('currentpage');
    }

  $('.pure-menu').has('td.dlt li').find('td.utm').has('li').css('border-left','1px dashed rgb(112, 111, 111)');
  $('.pure-menu').has('td.utm li').find('td.dlt').has('li').css('border-right','1px dashed rgb(112, 111, 111)');
  $('.pure-menu').not($('.pure-menu').has('td.dlt li')).find('td.utm').has('li').css('border-left','none');
  $('.pure-menu').not($('.pure-menu').has('td.utm li')).find('td.dlt').has('li').css('border-right','none');
  $('td.dlt').not($('td.dlt').has('li')).css('width','0');
  $('td.utm').not($('td.utm').has('li')).css('width','0');


  $('a.newpage').click(function(){
      $('.dlnum'+$(this).data('dlnum')).toggleClass('submenu-hidden');
      $('.dlnum'+$(this).data('dlnum')).toggleClass('submenu');
    }
  );
}


function testDL() {
  function onEval(isLoaded, isException) {
    if (isLoaded) {
      if (JSON.stringify(dataslayer.datalayers[dataslayer.activeIndex])!=JSON.stringify(isLoaded)){
        dataslayer.datalayers[dataslayer.activeIndex]=isLoaded;

        // get the current URL and grab it
        chrome.devtools.inspectedWindow.eval('window.location.href',
          function(url,error){dataslayer.urls[dataslayer.activeIndex]=url;}
          );

        // find first GTM tag and get its ID
        chrome.devtools.inspectedWindow.eval('document.querySelector(\'script[src*=googletagmanager\\\\.com]\').getAttribute(\'src\').match(/GTM.*/)',
          function(gtm,error){dataslayer.gtmIDs[dataslayer.activeIndex]=gtm;}
          );
        updateUI();
      }
    }
  }
  chrome.devtools.inspectedWindow.eval('dataLayer', onEval);
}

// newPageLoad: called when user navigates to a new page 
function newPageLoad(newurl){
  dataslayer.activeIndex = dataslayer.activeIndex + 1;
  dataslayer.datalayers[dataslayer.activeIndex] = [];
  dataslayer.urls[dataslayer.activeIndex] = newurl;
  dataslayer.tags[dataslayer.activeIndex] = [];
  updateUI();
}

// newRequest: called on a new network request of any kind
// we use this to capture tags for parsing
function newRequest(request){
  var reqType = '';
  if (/__utm.gif/i.test(request.request.url)){
    //classic request
    reqType = 'classic';
  }
  else if (/google-analytics.com\/collect/i.test(request.request.url)){
    //universal request
    reqType = 'universal';
  }
  else return;  //break out if it's not a tag we're looking for, else...
  // parse query string into key/value pairs
  var queryParams = {};
  if ((reqType == 'classic') || (reqType == 'universal')){
    request.request.url.split('?')[1].split('&').
                                      forEach(function(pair){
                                        pair = pair.split('=');
                                        queryParams[pair[0]] = decodeURIComponent(pair[1] || '');
                                      }
    );
  }
  var testParams = ['tid','t','dl','dt','dp','ea','ec','ev','el','ti','ta','tr','ts','tt',  //UA
                    'in','ip','iq','ic','iv','cu','sn','sa','st','uid',                     //UA
                    '_utmz','utmac','utmcc','utme','utmhn','utmdt','utmp','utmt','utmsn',   //classic
                    'utmsa','utmsid','utmtid','utmtto','utmtsp','utmttx','utmtst','utmipn', //classic
                    'utmiqt','utmipc','utmiva','utmipr',                                    //classic
                    ];

  var utmParams = {reqType:reqType,allParams:queryParams};
  
  var utmCM = {};
  var utmCD = {};
  $.each(queryParams,function(k,v){
      if ($.inArray(k,testParams)>=0){utmParams[k]=v;}
      else if (k.substring(0,2)=='cd'){
        utmCD[k.substring(2)]=v;
      }
      else if (k.substring(0,2)=='cm'){
        utmCM[k.substring(2)]=v;
      }
    }
  );
  if (utmCM!={}) utmParams.utmCM=utmCM;
  if (utmCD!={}) utmParams.utmCD=utmCD;

  if (utmParams) dataslayer.tags[dataslayer.activeIndex].push(utmParams);

  updateUI();
}

setInterval(testDL,100);

chrome.devtools.inspectedWindow.eval('window.location.href',
  function(url,error){dataslayer.urls[dataslayer.activeIndex]=url;}
  );
chrome.devtools.inspectedWindow.eval('document.querySelector(\'script[src*=googletagmanager\\\\.com]\').getAttribute(\'src\').match(/GTM.*/)',
  function(gtm,error){dataslayer.gtmIDs[dataslayer.activeIndex]=gtm;}
  );

chrome.devtools.network.onNavigated.addListener(newPageLoad);
chrome.devtools.network.onRequestFinished.addListener(newRequest);