
function updateUI() {
  $('#datalayeritems').html('');

  // dL = window.lastDL;

  $.each(window.lastDL,function(a,dL){
    $('#datalayeritems').prepend('<div id="sub'+a+'" class="pure-menu pure-menu-open"><ul></ul></div>\n');
    $('#datalayeritems').append('\n');    

    $.each(dL,function(i,v){
      therow = '';
      $.each(v,function(k,x){
        therow = therow + '\n' + '<tr><td><b>'+k+'</b></td><td>'+x+'</td></tr>';
      }); 
      $('#sub'+a+' ul').prepend('<li class="event submenu dlnum'+a+'"><table cols=2>'+therow+'</table></li>\n');
      $('#sub'+a+' ul').prepend('<li class="eventbreak submenu dlnum'+a+'"></li>\n');
    });

    $('#sub'+a+' ul').prepend('<li class="newpage" data-dlnum="'+a+'"><a href="#" class="newpage page'+a+' currentpage" data-dlnum="'+a+'">'+window.lastURL[a]+'</a></li>\n');
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
  var testParams = ['tid','t','dl','dt','ea','ec','ev','el','_utmz'];

  // var wantedParams = queryParams.filter(function(value,index){return ($.inArray(index,testParams)>=0);});

  $.each(queryParams,function(k,v){if ($.inArray(k,testParams)>=0){$('body').prepend(k+':'+v+'<br>\n');};});
  // $.each(wantedParams,function(k,v){$('body').prepend(k+':'+v+'<br>\n');});

  //UA params we want:
  // tid: UA-id
  // t: event/pageview/etc
  // dl: URL
  // dt: page title
  // ea: event action
  // ec: event category
  // el: event label
  // ev: event value
  // _utmz: acqusition etc cookie
  // more for ecom
}

setInterval(testDL,100);

chrome.devtools.inspectedWindow.eval('window.location.href',function(url,error){window.lastURL[numDL]=url;});

chrome.devtools.network.onNavigated.addListener(newPageLoad);
chrome.devtools.network.onRequestFinished.addListener(newRequest);