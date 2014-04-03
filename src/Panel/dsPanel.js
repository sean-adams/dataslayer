
function updateUI() {
  $('#datalayeritems').html('');

  // dL = window.lastDL;

  $.each(window.lastDL,function(a,dL){
    $('#datalayeritems').prepend('<div id="sub'+a+'" class="pure-menu pure-menu-open"><ul></ul><table cols=2 width=100%><tbody><tr><td class="dlt"><ul></ul></td><td class="utm"><ul></ul></td></tr></tbody></table></div>\n');
    $('#datalayeritems').append('\n');    

    $.each(dL,function(i,v){
      therow = '';
      $.each(v,function(k,x){
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

      //UA params we want:
      // tid:   UA-id
      // t:     event/pageview/etc
      // dl:    URL
      // dt:    page title
      // ea:    event action
      // ec:    event category
      // el:    event label
      // ev:    event value
      // _utmz: acqusition etc cookie
      // more for ecom

      //GA params:
      // utmac: UA-id
      // utmcc: cookie
      // utme:  events/CV
      // utmhn: hostname
      // utmdt: page title
      // utmp:  URL
      // more for ecom

      switch(v.reqType){
        case 'classic':
          therow = '<tr><td></td><td><b>'+v.utmac+'</b> (Classic)</td></tr>';
          if (v.utmt=='event'){
            // Google Analytics uses the value of the utme parameter to track events in the form of 5(object*action*label)(value):
            // CV: 8(2!Abandoned Cart*User ID)9(2!13*8aaf21b4-22de-4a7b-a737-d74755ef976d)11(2!1*1)
            //     8 is variable, 9 is value, 11 is scope
            var eventdata = v.utme.split(')')[0].substring(2).split('*');
            therow = therow + '\n<tr><td><b>category</b></td><td>'+eventdata[0]+'</td></tr>\n<tr><td><b>action</b></td><td>'+eventdata[1]+'</td></tr>\n<tr><td><b>label</b></td><td>'+eventdata[2]+'</td></tr>';  
            if (eventdata[3]) {therow = therow + '\n<tr><td><b>value</b></td><td>'+eventdata[3]+'</td></tr>';  }

          }
          else{
            therow = therow + '\n<tr><td><b>url</b></td><td>'+v.utmhn+v.utmp+'</td></tr>';  
          }
          
          break;
        case 'universal':
          therow = '<tr><td></td><td><b>'+v.tid+'</b> (Universal)</td></tr>';
          if (v.t=='event'){
            therow = therow + '\n<tr><td><b>category</b></td><td>'+v.ec+'</td></tr>\n<tr><td><b>action</b></td><td>'+v.ea+'</td></tr>\n<tr><td><b>label</b></td><td>'+v.el+'</td></tr>';
            if (v.ev) {therow = therow + '\n<tr><td><b>value</b></td><td>'+v.ev+'</td></tr>';  }  
          }
          else
          if (v.t=='pageview'){
            if (v.dp) {
              therow = therow + '\n<tr><td><b>path</b></td><td>'+v.dp+'</td></tr>';
            }
            else {
            therow = therow + '\n<tr><td><b>url</b></td><td>'+v.dl+'</td></tr>';
            }
          }
          break;
        default:

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
// request arrives in HAR format: http://www.softwareishard.com/blog/har-12-spec/
// GA requests:
// classic: __utm.gif
// UA: www.google-analytics.com/collect
function newRequest(request){
  if (/__utm.gif/i.test(request.request.url)){
    //GA classic request
    var reqType = 'classic';
  }
  else if (/google-analytics.com\/collect/i.test(request.request.url)){
    //universal analytics request
    var reqType = 'universal';
  }
  else return;

  // parse query string into key/value pairs
  var queryParams = {};
  request.request.url.split('?')[1].split('&').forEach(function(pair){pair = pair.split('='); queryParams[pair[0]] = decodeURIComponent(pair[1] || ''); })
  var testParams = ['tid','t','dl','dt','dp','ea','ec','ev','el','_utmz','utmac','utmcc','utme','utmhn','utmdt','utmp','utmt'];

  var utmParams = {reqType:reqType};
  $.each(queryParams,function(k,v){if ($.inArray(k,testParams)>=0){utmParams[k]=v;}});
  if (utmParams) { window.lastUTM[window.numDL].push(utmParams); }
  console.log(window.lastUTM[window.numDL]);

  updateUI();
}

setInterval(testDL,100);

chrome.devtools.inspectedWindow.eval('window.location.href',function(url,error){window.lastURL[numDL]=url;});

chrome.devtools.network.onNavigated.addListener(newPageLoad);
chrome.devtools.network.onRequestFinished.addListener(newRequest);