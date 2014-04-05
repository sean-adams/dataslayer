
function updateUI() {
  $('#datalayeritems').html('');

  $.each(window.lastDL,function(a,dL){
    $('#datalayeritems').prepend('<div id="sub'+a+'" class="pure-menu pure-menu-open"><ul></ul><table cols=2 width=100%><tbody><tr><td class="dlt"><ul></ul></td><td class="utm"><ul></ul></td></tr></tbody></table></div>\n');
    $('#datalayeritems').append('\n');    

    $.each(dL,function(i,v){
      therow = '';
      $.each(v,function(k,x){
        if(typeof x == 'object'){
          for (var q in x){
            if(typeof q == 'object'){
              for (var z in x[q])
                therow = therow + '\n' + '<tr><td><b>'+k+'['+q+'].'+z+'</b></td><td>'+x[q][z]+'</td></tr>';
            }
            else{
              therow = therow + '\n' + '<tr><td><b>'+k+'['+q+']</b></td><td>'+x[q]+'</td></tr>';
            }
          }          
        }
        else
          therow = therow + '\n' + '<tr><td><b>'+k+'</b></td><td>'+x+'</td></tr>';
      }); 
      $('#sub'+a+' td.dlt ul').prepend('<li class="event submenu dlnum'+a+'"><table cols=2>'+therow+'</table></li>\n');
      $('#sub'+a+' td.dlt ul').prepend('<li class="eventbreak submenu dlnum'+a+'"></li>\n');
    });

    $('#sub'+a+'>ul').prepend('<li class="newpage" data-dlnum="'+a+'"><a href="#" class="newpage page'+a+' currentpage" data-dlnum="'+a+'">'+window.lastURL[a]+'</a></li>\n');
  });

  $.each(window.lastUTM,function(a,dL){
    $.each(dL,function(i,v){
      therow = '';

      //GA params:
      // utmcc: cookie
      var allParams = '';
      for (var param in v.allParams)
        allParams = allParams + param + ': ' + v.allParams[param]+'\n';

      switch(v.reqType){
        case 'classic':
          therow = '<tr><td></td><td title="'+allParams+'"><b>'+v.utmac+'</b> (Classic)</td></tr>';
          switch(v.utmt){
            case 'event':
              // Google Analytics uses the value of the utme parameter to track events in the form of 5(object*action*label)(value):
              // CV: 8(2!Abandoned Cart*User ID)9(2!13*8aaf21b4-22de-4a7b-a737-d74755ef976d)11(2!1*1)
              //     8 is variable, 9 is value, 11 is scope
              var eventdata = v.utme.split(')')[0].substring(2).split('*');
              therow = therow + '\n<tr><td><b>category</b></td><td>'+eventdata[0]+'</td></tr>\n<tr><td><b>action</b></td><td>'+eventdata[1]+'</td></tr>\n<tr><td><b>label</b></td><td>'+eventdata[2]+'</td></tr>';  
              if (eventdata[3]) {therow = therow + '\n<tr><td><b>value</b></td><td>'+eventdata[3]+'</td></tr>';  }
              break;
            case 'transaction':
              therow = therow + '\n<tr><td></td><td><b>transaction '+v.utmtid+'</b></td></tr>\n';
              if(v.utmtto) therow = therow + '<tr><td><b>revenue</b></td><td>'+v.utmtto+'</td></tr>\n';
              if(v.utmtsp) therow = therow + '<tr><td><b>shipping</b></td><td>'+v.utmtsp+'</td></tr>\n';
              if(v.utmttx) therow = therow + '<tr><td><b>tax</b></td><td>'+v.utmttx+'</td></tr>\n';
              if(v.utmtst) therow = therow + '<tr><td><b>affiliation</b></td><td>'+v.utmtst+'</td></tr>\n';
              break;
            case 'item':
              therow = therow + '\n<tr><td></td><td><b>transaction '+v.utmtid+'</b></td></tr>\n';
              if(v.utmipn) therow = therow + '<tr><td><b>item/qty</b></td><td>('+v.utmiqt+'x) '+v.utmipn+'</td></tr>\n';
              if(v.utmipc) therow = therow + '<tr><td><b>sku</b></td><td>'+v.utmipc+'</td></tr>\n';
              if(v.utmiva) therow = therow + '<tr><td><b>category</b></td><td>'+v.utmiva+'</td></tr>\n';
              if(v.utmipr) therow = therow + '<tr><td><b>price</b></td><td>'+v.utmipr+'</td></tr>\n';
              break;
            case 'social':
              // utmsn:network
              // utmsa:action
              // utmsid:target
              therow = therow + '\n<tr><td><b>network</b></td><td>'+v.utmsn+'</td></tr>\n<tr><td><b>action</b></td><td>'+v.utmsa+'</td></tr>\n<tr><td><b>target</b></td><td>'+v.utmsid+'</td></tr>';
              break;
            default:  //pageview
              therow = therow + '\n<tr><td><b>url</b></td><td>'+v.utmhn+v.utmp+'</td></tr>';  
              break;
            }
          if ((v.utme)&&(v.utme.indexOf('8(')>=0)) { //we have CVs here
            var gaCVs = v.utme.substring(v.utme.indexOf('8(')).match(/[^\)]+(\))/g);
            //gaCVs 0: variable name, 1 value, 2 scope
            // ["8(2!Abandoned Cart*User ID)", "9(2!13*8aaf21b4-22de-4a7b-a737-d74755ef976d)", "11(2!1*1)"] 
            
            $.each(gaCVs,function(i,d){
              gaCVs[i]=gaCVs[i].replace(/^[891][01(]+/,'').match(/[^\*|^.\!|^\)]+(\*|\!|\))/g); //split on * separators or ! that lets us know nothing was set or ) for the end
            });
            // console.log(gaCVs);
            $.each(gaCVs[0],function(i,d){
              if (d.substring(d.length-1)=='!'){
                gaCVs[0][i]=''; gaCVs[1][i]=''; gaCVs[2][i]='';
              }
              else {
                gaCVs[0][i]=gaCVs[0][i].substring(0,gaCVs[0][i].length-1); gaCVs[1][i]=gaCVs[1][i].substring(0,gaCVs[1][i].length-1); gaCVs[2][i]=gaCVs[2][i].substring(0,gaCVs[2][i].length-1);
                therow = therow + '<tr><td><b>CV '+(i+1)+'</b></td><td>'+gaCVs[0][i]+' <b>=</b> '+gaCVs[1][i]+' <i>(scope '+gaCVs[2][i]+')</i></td></tr>\n';
              }
            });
          }
          break;
        case 'universal':
          therow = '<tr><td></td><td title="'+allParams+'"><b>'+v.tid+'</b> (Universal)</td></tr>';
          switch(v.t) {  //what type of hit is it?
            case 'event':
              // ea:    event action
              // ec:    event category
              // el:    event label
              // ev:    event value            
              therow = therow + '\n<tr><td><b>category</b></td><td>'+v.ec+'</td></tr>\n<tr><td><b>action</b></td><td>'+v.ea+'</td></tr>';
              if (v.el) {therow = therow + '\n<tr><td><b>label</b></td><td>'+v.el+'</td></tr>';  }  
              if (v.ev) {therow = therow + '\n<tr><td><b>value</b></td><td>'+v.ev+'</td></tr>';  }  
              break;
            case 'pageview':
              if (v.dp) {  // for virtual pageview, show virtual path
                therow = therow + '\n<tr><td><b>path</b></td><td>'+v.dp+'</td></tr>';
              }
              else {
                therow = therow + '\n<tr><td><b>url</b></td><td>'+v.dl+'</td></tr>';
              }
              break;
            case 'social':
              therow = therow + '\n<tr><td><b>network</b></td><td>'+v.sn+'</td></tr>\n<tr><td><b>action</b></td><td>'+v.sa+'</td></tr>\n<tr><td><b>target</b></td><td>'+v.st+'</td></tr>';
              break;
            case 'transaction':
              //transaction hit type:
              // ti: transaction ID
              // ta: transaction affil
              // tr: transaction revenue
              // ts: transaction shipping
              // tt: transaction tax
              // cu: currency code
              if (!v.cu) v.cu='';
              therow = therow + '\n<tr><td></td><td><b>transaction '+v.ti+'</b></td></tr>\n';
              if(v.tr) therow = therow + '<tr><td><b>revenue</b></td><td>'+v.tr+' '+v.cu+'</td></tr>\n';
              if(v.ts) therow = therow + '<tr><td><b>shipping</b></td><td>'+v.ts+' '+v.cu+'</td></tr>\n';
              if(v.tt) therow = therow + '<tr><td><b>tax</b></td><td>'+v.tt+' '+v.cu+'</td></tr>\n';
              if(v.ta) therow = therow + '<tr><td><b>affiliation</b></td><td>'+v.ta+'</td></tr>\n';
              break;
            case 'item':
              //item hit type:
              // in: item name
              // ip: item price
              // iq: item quantity
              // ic: item code (sku)
              // iv: item category
              // cu: currency code
              if (!v.cu) v.cu='';
              therow = therow + '\n<tr><td></td><td><b>transaction '+v.ti+'</b></td></tr>\n';
              if(v.in) therow = therow + '<tr><td><b>item/qty</b></td><td>('+v.iq+'x) '+v.in+'</td></tr>\n';
              if(v.ic) therow = therow + '<tr><td><b>sku</b></td><td>'+v.ic+'</td></tr>\n';
              if(v.iv) therow = therow + '<tr><td><b>category</b></td><td>'+v.iv+'</td></tr>\n';
              if(v.ip) therow = therow + '<tr><td><b>price</b></td><td>'+v.ip+v.cu+'</td></tr>\n';
              break;
          }
          $.each(v.utmCD,function(k,val){
            therow = therow + '<tr><td><b>dimension '+k+'</b></td><td>'+val+'</td></tr>\n';
          });
          $.each(v.utmCM,function(k,val){
            therow = therow + '<tr><td><b>metric '+k+'</b></td><td>'+val+'</td></tr>\n';
          });
          
          break;
        }

      $('#sub'+a+' td.utm ul').prepend('<li class="event submenu dlnum'+a+'"><table cols=2>'+therow+'</table></li>\n');
      $('#sub'+a+' td.utm ul').prepend('<li class="eventbreak submenu dlnum'+a+'"></li>\n');
    });
  });

  for (var i=0;i<window.lastDL.length-1;i++){
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
  });
}

var lastDL = [[]];
var lastUTM = [[]];
var numDL = 0;
var lastURL = [];

function testDL() {
  function onEval(isLoaded, isException) {
    if (isLoaded) {
      if (JSON.stringify(window.lastDL[window.numDL])!=JSON.stringify(isLoaded)){
        window.lastDL[numDL]=isLoaded;
        chrome.devtools.inspectedWindow.eval('window.location.href',function(url,error){window.lastURL[numDL]=url;});
        updateUI();
      }
    }
  }
  chrome.devtools.inspectedWindow.eval('dataLayer', onEval);
}

// newPageLoad: called when user navigates to a new page 
function newPageLoad(newurl){
  window.numDL = window.numDL + 1;
  window.lastDL[window.numDL] = [];
  window.lastURL[window.numDL] = newurl;
  window.lastUTM[window.numDL] = [];
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
  request.request.url.split('?')[1].split('&').forEach(function(pair){pair = pair.split('='); queryParams[pair[0]] = decodeURIComponent(pair[1] || ''); });
  var testParams = ['tid','t','dl','dt','dp','ea','ec','ev','el','ti','ta','tr','ts','tt','in','ip','iq','ic','iv','cu','sn','sa','st','uid',   //UA
                    '_utmz','utmac','utmcc','utme','utmhn','utmdt','utmp','utmt','utmsn','utmsa','utmsid','utmtid','utmtto','utmtsp','utmttx','utmtst','utmipn','utmiqt','utmipc','utmiva','utmipr'  //classic
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
  });
  if (utmCM!={}) utmParams['utmCM']=utmCM;
  if (utmCD!={}) utmParams['utmCD']=utmCD;
  if (utmParams) window.lastUTM[window.numDL].push(utmParams);
  // console.log(window.lastUTM[window.numDL]);

  updateUI();
}

setInterval(testDL,100);

chrome.devtools.inspectedWindow.eval('window.location.href',function(url,error){window.lastURL[numDL]=url;});

chrome.devtools.network.onNavigated.addListener(newPageLoad);
chrome.devtools.network.onRequestFinished.addListener(newRequest);