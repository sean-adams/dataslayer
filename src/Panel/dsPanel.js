// dsPanel.js
// this is where the magic happens

var dataslayer = {};
dataslayer.datalayers = [{}];
dataslayer.utag_datas = [{}];
dataslayer.tco_datas = [{}];
dataslayer.var_datas = [{}];
dataslayer.tags = [[]];
dataslayer.GTMs = [[]];
dataslayer.TLMs = [];
dataslayer.TCOs = [];
dataslayer.vars = [[]];
dataslayer.activeIndex = 0;
dataslayer.urls = [];
dataslayer.options = {
  showFloodlight: true, 
  showUniversal: true, 
  showClassic: true, 
  showSitecatalyst: true, 
  showGTMLoad: true, 
  ignoredTags: [],
  collapseNested: false,
  blockTags: false,
  hideEmpty: false
};


try{
  if (typeof localStorage.options !== 'undefined') dataslayer.options = JSON.parse(localStorage.options);
}
catch(error){
  console.log(error);
}

dataslayer.loading = false;

dataslayer.port = chrome.runtime.connect();

dataslayer.debug = (chrome.runtime.id == 'ikbablmmjldhamhcldjjigniffkkjgpo' ? false : true);

// loadSettings:
function loadSettings(){
  dataslayer.options = {
    showFloodlight: true, 
    showUniversal: true, 
    showClassic: true, 
    showSitecatalyst: true, 
    showGTMLoad: true, 
    ignoredTags: [],
    collapseNested: false,
    blockTags: false,
    hideEmpty: false
  };


  try{
    if (typeof localStorage.options !== 'undefined') dataslayer.options = JSON.parse(localStorage.options);
  }
  catch(error){
    console.log(error);
  }

  $.each(['showFloodlight','showUniversal','showClassic','showSitecatalyst','showGTMLoad'],function(i,prop){
      if (!dataslayer.options.hasOwnProperty(prop)) dataslayer.options[prop] = true;  
    });
  if (!dataslayer.options.hasOwnProperty('ignoredTags')) dataslayer.options.ignoredTags = [];  
  if (!dataslayer.options.hasOwnProperty('collapseNested')) dataslayer.options.collapseNested = false;  
  if (!dataslayer.options.hasOwnProperty('hideEmpty')) dataslayer.options.hideEmpty = false;  
  if (!dataslayer.options.hasOwnProperty('blockTags')) dataslayer.options.blockTags = false;
  
  chrome.storage.sync.get(null,function(items){
    dataslayer.options = items;
    $.each(['showFloodlight','showUniversal','showClassic','showSitecatalyst','showGTMLoad'],function(i,prop){
      if (!dataslayer.options.hasOwnProperty(prop)) dataslayer.options[prop] = true;  
    });
    if (!dataslayer.options.hasOwnProperty('ignoredTags')) dataslayer.options.ignoredTags = [];  
    if (!dataslayer.options.hasOwnProperty('collapseNested')) dataslayer.options.collapseNested = false;
    if (!dataslayer.options.hasOwnProperty('hideEmpty')) dataslayer.options.hideEmpty = false;  
    if (!dataslayer.options.hasOwnProperty('blockTags')) dataslayer.options.blockTags = false;
    try{
      localStorage.options = JSON.stringify(dataslayer.options);
    }
    catch(error){
      console.log(error);
    }
  });

}


// parseUniversal:
// - v: tag object
// - ref: pageindex_tagindex e.g '2_3'
function parseUniversal(v,ref){
  var allParams = '';
  var hasEnhanced = false;
  for (var param in v.allParams){
      allParams = allParams + '<tr class="allparams allparams' + ref + '"><td>' + param + '</td><td>' + v.allParams[param]+'</td></tr>\n';
      hasEnhanced = hasEnhanced||(param.match(/(pr[\d+].*|il[\d+].*|promo[\d+a].*|pa(l*)|tcc|co[sl])$/)!==null);
    }
  var therow = '<tr><td></td><td><u>'+v.tid+'</u> (Universal) <a class="toggle" data-toggle="' + ref + '">+</a></td></tr>\n'+allParams;
  if(hasEnhanced) therow = therow + '\n<tr><td></td><td><i>(contains enhanced ecommerce)</i></td></tr>\n';
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
    case 'timing':
      therow = therow + '\n<tr><td></td><td><b>timing hit</b></td></tr>\n';
      if(v.allParams.utc) therow = therow + '<tr><td><b>category</b></td><td><span>'+v.allParams.utc+'</span></td></tr>\n';
      if(v.allParams.utv) therow = therow + '<tr><td><b>variable</b></td><td><span>'+v.allParams.utv+'</span></td></tr>\n';
      if(v.allParams.utt) therow = therow + '<tr><td><b>time</b></td><td><span>'+v.allParams.utt+'</span></td></tr>\n';
      if(v.allParams.utl) therow = therow + '<tr><td><b>label</b></td><td><span>'+v.allParams.utl+'</span></td></tr>\n';
      if(v.allParams.dns) therow = therow + '<tr><td><b>DNS time</b></td><td><span>'+v.allParams.dns+'</span></td></tr>\n';
      if(v.allParams.pdt) therow = therow + '<tr><td><b>page time</b></td><td><span>'+v.allParams.pdt+'</span></td></tr>\n';
      if(v.allParams.rrt) therow = therow + '<tr><td><b>redirect time</b></td><td><span>'+v.allParams.rrt+'</span></td></tr>\n';
      if(v.allParams.tcp) therow = therow + '<tr><td><b>TCP time</b></td><td><span>'+v.allParams.tcp+'</span></td></tr>\n';
      if(v.allParams.srt) therow = therow + '<tr><td><b>server time</b></td><td><span>'+v.allParams.srt+'</span></td></tr>\n';
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
  if (v.ch) therow = therow + '<tr><td><b>site section</b></td><td><span>'+v.ch+'</span></td></tr>\n';
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

  if (v.vid) therow = therow + '<tr><td><b>visitor ID</b></td><td><span>'+v.vid+'</span></td></tr>\n';
  if (v.xact) therow = therow + '<tr><td><b>transaction ID</b></td><td><span>'+v.xact+'</span></td></tr>\n';
  if (v.purchaseID) therow = therow + '<tr><td><b>purchase ID</b></td><td><span>'+v.purchaseID+'</span></td></tr>\n';
  if (v.zip) therow = therow + '<tr><td><b>ZIP code</b></td><td><span>'+v.zip+'</span></td></tr>\n';
  if (v.state) therow = therow + '<tr><td><b>state</b></td><td><span>'+v.state+'</span></td></tr>\n';


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
        var eventdata = v.utme.match(/5\([^)]+\)(\(\d+\))?/i)[0].replace(/\'1/g,')').replace(/\'3/g,'!').replace(')(','*').substring(2).split('*'); //find events and unescape
        eventdata[eventdata.length-1] = eventdata[eventdata.length-1].substring(0,eventdata[eventdata.length-1].length-1); //chop trailing paren
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
    case 'var':
      therow = therow + '\n<tr><td></td><td><b>user-defined variable</b></td></tr>\n';
      try{
        if (v.utmcc&&v.utmcc.match(/__utmv=[^;]*/)[0]) therow = therow + '\n<tr><td><b>value</b></td><td><span>'+v.utmcc.match(/__utmv=[^;]*/)[0].replace('__utmv=','')+'</span></td></tr>';
      }
      catch(err){
        console.log('user-defined variable error: '+err);
      }
      break;
    default:  //pageview
      therow = therow + '\n<tr><td><b>url</b></td><td><span>'+v.utmhn+v.utmp+'</span></td></tr>';
      break;
    }
  if (((v.utme)&&(v.utme.indexOf('14(')>=0))&&(v.utme.match(/14\([\d\*]+\)\([\d\*]+\)/i)!==null)) { //we have performance information
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
      gaCVs[i]=gaCVs[i].replace(/^[8910]+\(/,'').match(/[^\*|^\)]+(?=[\*\)])/g); 
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
    for (var s in gaCVs[2]){
      if (gaCVs[2][s].indexOf('!')>=0){
        newspot = gaCVs[2][s].substring(0,gaCVs[2][s].indexOf('!'))-1;
        for (i=0;i<newspot;i++){gaCVsfixed[2][i]='0';}
        gaCVs[2][s] = gaCVs[2][s].substring(gaCVs[2][s].indexOf('!')+1);
      }
      try{
      gaCVsfixed[2][newspot] = typeof gaCVs[2] !== 'undefined' ? (typeof gaCVs[2][s] !== 'undefined' ? gaCVs[2][s].charAt(0) : '0') : '0';
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

// collapseStack
// - obj: object to populate based on keys
// - keys: array of key names (i.e. to populate test.demo.property, ['test','demo','property'])
// - val: value for key to be assigned
// returns stacked object
function collapseStack(obj,keys,val){
  var result = obj;
  if ((keys.length<2)&&(Array.isArray(val)))
    result[keys[0]] = val.slice(0);
  else if (keys.length<2)
    result[keys[0]] = val;
  else
    result[keys[0]] = collapseStack(obj[keys[0]]||{},keys.slice(1),val);
  return result;
}

// collapseUDO
// - udo: Tealium-style data object
// returns data object with properties converted to object paradigm
function collapseUDO(udo){
  var newUDO = {};
  var props = Object.getOwnPropertyNames(udo).sort();
  for (var i in props){
    var stack = props[i].split('.');
    if (stack.length==1)
      newUDO[stack[0]] = udo[stack[0]];
    else {
      newUDO[stack[0]] = newUDO[stack[0]] || {};
      newUDO[stack[0]] = collapseStack(newUDO[stack[0]],stack.slice(1),udo[props[i]]);
    }
  }
  return newUDO;
}



// addSpaces
// returns as many HTML nbsp entities as argument length
function addSpaces(obj){
  var spaces = '';
  for (var i=0;i<obj.length;i++)
    spaces = spaces + '&nbsp;';
  return spaces;
}

// datalayerPushHTML
// - push: object 
// - index: index of dataslayer.datalayers[data layer name] | dataslayer.utag_datas
function datalayerPushHTML(push,index){
  var therow = '<li class="eventbreak submenu dlnum'+index+' datalayer"></li>\n' + '<li class="event submenu dlnum'+index+' datalayer"><table cols=2>';
  $.each(push,function(k1,x){ //iterate each individual up to 5 levels of keys-- clean this up later
        if(typeof x == 'object'){
          var level1Id = k1+'-'+Math.ceil(Math.random()*10000000);
          therow = therow + '\n' + '<tr class="object-row" id="'+level1Id+'"><td><em><a href="#" title="shift-click to expand all" data-id="'+level1Id+'">'+(dataslayer.options.collapseNested?'+':'-')+'</a></em><b>'+k1+'</b></td><td><span>'+'<i>object</i>'+'</span></td></tr>';
          for (var k2 in x){
            if(typeof x[k2] == 'object'){
              var level2Id = k1+k2+'-'+Math.ceil(Math.random()*10000000);
              therow = therow + '\n' + '<tr'+(dataslayer.options.collapseNested?' style="display: none;"':'')+' class="object-row child-of-'+level1Id+'" id="'+level2Id+'"><td><em><a href="#" title="shift-click to expand all" data-id="'+level2Id+'">'+(dataslayer.options.collapseNested?'+':'-')+'</a></em><b>'+addSpaces(k1)+'.'+k2+'</b></td><td><span>'+'<i>object</i>'+'</span></td></tr>';
              for (var k3 in x[k2]) {
                if (typeof x[k2][k3] == 'object'){
                  var level3Id = k1+k2+k3+'-'+Math.ceil(Math.random()*10000000);
                  therow = therow + '\n' + '<tr'+(dataslayer.options.collapseNested?' style="display: none;"':'')+' class="object-row child-of-'+level2Id+' child-of-'+level1Id+'" id="'+level3Id+'"><td><em><a href="#" title="shift-click to expand all" data-id="'+level3Id+'">'+(dataslayer.options.collapseNested?'+':'-')+'</a></em><b>'+addSpaces(k1)+'&nbsp;'+addSpaces(k2)+'.'+k3+'</b></td><td><span>'+'<i>object</i>'+'</span></td></tr>';
                  for (var k4 in x[k2][k3]){
                    if (typeof x[k2][k3][k4] == 'object'){
                      var level4Id = k1+k2+k3+k4+'-'+Math.ceil(Math.random()*10000000);
                      therow = therow + '\n' + '<tr'+(dataslayer.options.collapseNested?' style="display: none;"':'')+' class="object-row child-of-'+level3Id+' child-of-'+level2Id+' child-of-'+level1Id+'" id="'+level4Id+'"><td><em><a href="#" title="shift-click to expand all" data-id="'+level4Id+'">'+(dataslayer.options.collapseNested?'+':'-')+'</a></em><b>'+addSpaces(k1)+'&nbsp;'+addSpaces(k2)+'&nbsp;'+addSpaces(k3)+'.'+k4+'</b></td><td><span>'+'<i>object</i>'+'</span></td></tr>';
                      for (var k5 in x[k2][k3][k4]){
                        if (!(dataslayer.options.hideEmpty&&(x[k2][k3][k4][k5]==='')))
                        therow = therow + '\n' + '<tr'+(dataslayer.options.collapseNested?' style="display: none;"':'')+' class="child-of-'+level4Id+' child-of-'+level3Id+' child-of-'+level2Id+' child-of-'+level1Id+'"><td><b>'+addSpaces(k1)+'&nbsp;'+addSpaces(k2)+'&nbsp;'+addSpaces(k3)+'&nbsp;'+addSpaces(k4)+'.'+k5+'</b></td><td><span>'+x[k2][k3][k4][k5]+'</span></td></tr>';    
                      }
                    }
                    else if (!(dataslayer.options.hideEmpty&&(x[k2][k3][k4]==='')))
                      therow = therow + '\n' + '<tr'+(dataslayer.options.collapseNested?' style="display: none;"':'')+' class="child-of-'+level3Id+' child-of-'+level2Id+' child-of-'+level1Id+'"><td><b>'+addSpaces(k1)+'&nbsp;'+addSpaces(k2)+'&nbsp;'+addSpaces(k3)+'.'+k4+'</b></td><td><span>'+x[k2][k3][k4]+'</span></td></tr>';  
                  }
                }
                else if (!(dataslayer.options.hideEmpty&&(x[k2][k3]==='')))
                  therow = therow + '\n' + '<tr'+(dataslayer.options.collapseNested?' style="display: none;"':'')+' class="child-of-'+level2Id+' child-of-'+level1Id+'"><td><b>'+addSpaces(k1)+'&nbsp;'+addSpaces(k2)+'.'+k3+'</b></td><td><span>'+x[k2][k3]+'</span></td></tr>';
              }
            }
            else if (!(dataslayer.options.hideEmpty&&(x[k2]==='')))
              therow = therow + '\n' + '<tr'+(dataslayer.options.collapseNested?' style="display: none;"':'')+' class="child-of-'+level1Id+'"><td><b>'+addSpaces(k1)+'.'+k2+'</b></td><td><span>'+x[k2]+'</span></td></tr>';
          }          
        }
        else if (!(dataslayer.options.hideEmpty&&(x==='')))
          therow = therow + '\n' + '<tr><td><b>'+k1+'</b></td><td><span>'+x+'</span></td></tr>';
      }
    );
    therow = therow +  '</table></li>';
  return therow;
}


// datalayerHTML
// - datalayers: dataslayer.datalayers | dataslayer.utag_datas
// - index: index of dataslayer.datalayers | dataslayer.utag_datas
// - type: 'tlm' | 'gtm'
// - gtmIndex: which GTM container (defaults to index 0)
// returns contents of td.dlt > ul
function datalayerHTML(datalayers,index,type,gtmIndex) {
  gtmIndex = gtmIndex || 0;
  if ((type=='tlm'||type=='var')&&($.isEmptyObject(datalayers[index]))) return '';  //if empty utag_data get us out of here

  var allrows = '';

  if (!((type=='gtm')&&(dataslayer.GTMs[index].length===0)))
  {
    var arrLayer = (type=='tlm'||type=='var'?[datalayers[index]]:datalayers[index][dataslayer.GTMs[index][gtmIndex].name]);
  
    if (typeof arrLayer!= 'undefined')
      $.each(arrLayer,function(i,v){ //iterate each push group on the page
        allrows = datalayerPushHTML(v,index) + allrows;
      });
  }

  if(((dataslayer.GTMs[index]&&dataslayer.GTMs[index][gtmIndex])&&dataslayer.GTMs[index][gtmIndex].hasOwnProperty('id'))&&(type=='gtm')){
    var dropdown = '';
    if (dataslayer.GTMs[index].length>1){
      for (var i=0;i<dataslayer.GTMs[index].length;i++){
        dropdown = dropdown+'<option '+(gtmIndex==i?'selected':'')+' value="'+i+'">'+dataslayer.GTMs[index][i].id+' ('+dataslayer.GTMs[index][i].name+')'+
        (dataslayer.GTMs[index][i].iframe?'[iframe]':'')+'</option>';
      }
      dropdown = '<select id="gtmSelect'+index+'" data-index="'+index+'">'+dropdown+'</select>';
    }
    allrows = '<li class="event submenu dlnum'+index+' dlheader" data-dln="'+dataslayer.GTMs[index][gtmIndex].name+'"><table cols=2><tr><td></td><td><u>'+
    (dropdown.length===0?dataslayer.GTMs[index][gtmIndex].id+(dataslayer.GTMs[index].iframe?' [iframe]':''):dropdown)+'</u>'+(dropdown.length>0||dataslayer.GTMs[index][gtmIndex].name=='dataLayer'||typeof dataslayer.GTMs[index][gtmIndex].name=='undefined'?'':' <i>('+dataslayer.GTMs[index][gtmIndex].name+')</i>')+'</td></tr></table></li>\n' + allrows;
  }
  else if((dataslayer.TLMs[index]&&dataslayer.TLMs[index].hasOwnProperty('id'))&&(type=='tlm'))
    allrows = '<li class="event submenu dlnum'+index+' dlheader"><table cols=2><tr><td></td><td><u>'+dataslayer.TLMs[index].id+'</u>'+(dataslayer.TLMs[index].name=='utag_data'||typeof dataslayer.TLMs[index].name=='undefined'?'':' <i>('+dataslayer.TLMs[index].name+')</i>')+'</td></tr></table></li>\n' + allrows;
  else if(dataslayer.TCOs[index]&&type=='tlm')
    allrows = '<li class="event submenu dlnum'+index+' dlheader"><table cols=2><tr><td></td><td><u>'+dataslayer.TCOs[index].id+'</u></td></tr></table></li>\n' + allrows;
  else if(dataslayer.vars[index]&&dataslayer.vars[index][gtmIndex]&&type=='var')
    allrows = '<li class="event submenu dlnum'+index+' dlheader"><table cols=2><tr><td></td><td><u>Custom watch objects</u></td></tr></table></li>\n' + allrows+'<li class="eventbreak submenu dlnum'+index+' datalayer"></li>\n';

  return allrows;
}


function multivarDLHTML(pageIndex){
  return datalayerHTML(dataslayer.var_datas,pageIndex,'var');
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
    
    if(((v.reqType=='classic') || (v.reqType=='dc_js')) && dataslayer.options.showClassic)
        therow = parseClassic(v,index + '_' + q);
    else if ((v.reqType=='universal') && dataslayer.options.showUniversal)
        therow = parseUniversal(v,index + '_' + q);
    else if ((v.reqType=='floodlight') && dataslayer.options.showFloodlight)
        therow = parseFloodlight(v);
    else if ((v.reqType=='sitecatalyst') && dataslayer.options.showSitecatalyst)
        therow = parseSiteCatalyst(v,index + '_' + q);
    else
        return;  

    therow = '<li class="event submenu dlnum'+index+' '+v.reqType+'"><table cols=2>'+therow+'</table></li>\n';
    if (q<(dataslayer.tags[index].length-1)) therow = '<li class="eventbreak submenu dlnum'+index+' '+v.reqType+'"></li>\n'+therow;
  allrows = therow + allrows;
  }
  );
return allrows;
}

// dsObjPlusClick: handle clicks on plus/minus for datalayer objects
function dsObjPlusClick(e){
      e.preventDefault();
      if (e.shiftKey){
        switch($(this).text()){
          case '-':
            $('.child-of-'+$(this).data('id')).css('display','none').find('.object-row').text('+');
            $(this).text('+');
            break;
          case '+':
            $('tr.child-of-'+$(this).closest('tr.object-row').attr('id')).slideDown().find('em>a').text('-');
            $(this).text('-');
            break;
        }
      }
      else{
        switch($(this).text()){
          case '-':
            $('.child-of-'+$(this).data('id')).css('display','none').find('.object-row').text('+');
            $(this).text('+');
            break;
          case '+':
            $('tr[class="child-of-'+($(this).closest('tr.object-row').attr('id')+' '+$(this).closest('tr.object-row').attr('class').replace('object-row','').trim()).trim()+'"]').slideDown();
            $('tr[class="object-row child-of-'+($(this).closest('tr.object-row').attr('id')+' '+$(this).closest('tr.object-row').attr('class').replace('object-row','').trim()).trim()+'"]').slideDown().find('a').text('+');
            $(this).text('-');
            break;
        }
      }
    }

// clickSetup: called by UI updates
// makes sure interactive behavior and various CSS settings are in place
// - type: datalayer|tag|all (default: all)
function clickSetup(type){
  $('select').off('change.dataslayer');
  $('select').on('change.dataslayer',function(){
    $(this).closest('ul').html(datalayerHTML(dataslayer.datalayers,$(this).data('index'),'gtm',$(this).find('option:selected').val()));
    clickSetup();
  });

  for (var q=0;q<dataslayer.datalayers.length-1;q++){
    $('#sub'+q+':not(.clicked-open)').addClass('clicked-closed');
    $('.page'+q).removeClass('currentpage');
  }

  for (var i=0;i<dataslayer.datalayers.length;i++){
    $('#sub'+i).removeClass('containsGTM').removeClass('containsTAG');
    if (dataslayer.tags[i].length>0) $('#sub'+i).addClass('containsTAG');
    if (!($.isEmptyObject(dataslayer.GTMs[i])&&$.isEmptyObject(dataslayer.TLMs[i])&&$.isEmptyObject(dataslayer.TCOs[i])&&$.isEmptyObject(dataslayer.vars[i])))
      $('#sub'+i).addClass('containsGTM');
  }


  $('td.utm>ul>li:first-child.eventbreak').remove();


  if (type!='datalayer'){
    //set up clicks for tags
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
  }

  if (type!='tag'){
    $('a[title="shift-click to expand all"]').off('click.dataslayer');
    $('a[title="shift-click to expand all"]').on('click.dataslayer',dsObjPlusClick);
  }


  $('a.newpage').off('click.dataslayer');
  $('a.newpage').on('click.dataslayer',function(){
      $('#sub'+$(this).data('dlnum')+'>table>tbody ul').slideToggle(200);
      $('#sub'+$(this).data('dlnum')).toggleClass('clicked-open');
    }
  );
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
  if (!dataslayer.options.hasOwnProperty('collapseNested')) dataslayer.options.collapseNested = false;
  if (!dataslayer.options.hasOwnProperty('hideEmpty')) dataslayer.options.hideEmpty = false;

  if (pageIndex !== 0) pageIndex = pageIndex || -1;
  type = type || 'all';

  if (pageIndex > -1){
    $('.pure-menu:not(#sub'+pageIndex+') li.newpage').removeClass('seeking');
    if ($('#sub'+pageIndex).length>0){
      if (type!=='tag')
        $('#sub'+pageIndex+'>table td.dlt>ul')
          .html(multivarDLHTML(pageIndex))
          .append(datalayerHTML(dataslayer.datalayers,pageIndex,'gtm'))
          .append(datalayerHTML(dataslayer.utag_datas,pageIndex,'tlm'))
          .append(datalayerHTML(dataslayer.tco_datas,pageIndex,'tlm'));
      if (type!=='datalayer')
        $('#sub'+pageIndex+'>table td.utm>ul').html(tagHTML(pageIndex));
    }
    else{
        $('#datalayeritems').prepend('<div id="sub'+pageIndex+'" class="pure-menu pure-menu-open"><ul>'+
        '<li class="newpage" data-dlnum="'+pageIndex+'"><a class="newpage page'+pageIndex+' currentpage" data-dlnum="'+pageIndex+'">'+dataslayer.urls[pageIndex]+'</a></li>\n'+
        '</ul><table cols=2 width=100%><tbody><tr><td class="dlt"><ul>'+multivarDLHTML(pageIndex)+datalayerHTML(dataslayer.datalayers,pageIndex,'gtm')+datalayerHTML(dataslayer.utag_datas,pageIndex,'tlm')+datalayerHTML(dataslayer.tco_datas,pageIndex,'tlm')+'</ul></td>'+
        '<td class="utm"><ul>'+tagHTML(pageIndex)+'</ul></td></tr></tbody></table></div>\n');
        if (dataslayer.options.showGTMLoad){
          if (dataslayer.GTMs.hasOwnProperty(pageIndex)&&(dataslayer.GTMs[pageIndex].length>0))
            $('#sub'+dataslayer.activeIndex+' li.newpage').addClass('hasGTM').removeClass('seeking').removeClass('noGTM').removeClass('hasTLM');
          else if ((!($.isEmptyObject(dataslayer.utag_datas[pageIndex])))||(dataslayer.TLMs.hasOwnProperty(pageIndex)&&!($.isEmptyObject(dataslayer.TLMs[pageIndex]))))
            $('#sub'+dataslayer.activeIndex+' li.newpage').addClass('hasTLM').removeClass('seeking').removeClass('noGTM').removeClass('hasGTM');
          else if (dataslayer.loading)
            $('#sub'+dataslayer.activeIndex+' li.newpage').addClass('seeking').removeClass('hasGTM').removeClass('noGTM').removeClass('hasTLM');
          else if (!($('#sub'+dataslayer.activeIndex+' li.newpage').hasClass('hasGTM')||$('#sub'+dataslayer.activeIndex+' li.newpage').hasClass('hasTLM')))
            $('#sub'+dataslayer.activeIndex+' li.newpage').addClass('noGTM').removeClass('seeking').removeClass('hasGTM').removeClass('hasTLM');
          }
        else $('li.newpage').removeClass('noGTM').removeClass('seeking').removeClass('hasGTM');
        
    }
  }
  else if (pageIndex === -1) {  //refresh all
    $('#datalayeritems').html('');

    $.each(dataslayer.datalayers,function(a,dL){  //iterate each page's dataLayer
      $('#datalayeritems').prepend('<div id="sub'+a+'" class="pure-menu pure-menu-open"><ul>'+
        '<li class="newpage" data-dlnum="'+a+'"><a class="newpage page'+a+' currentpage" data-dlnum="'+a+'">'+dataslayer.urls[a]+'</a></li>\n'+
        '</ul><table cols=2 width=100%><tbody><tr><td class="dlt"><ul>'+multivarDLHTML(a)+datalayerHTML(dataslayer.datalayers,a,'gtm')+datalayerHTML(dataslayer.utag_datas,a,'tlm')+datalayerHTML(dataslayer.tco_datas,a,'tlm')+'</ul></td>'+
        '<td class="utm"><ul>'+tagHTML(a)+'</ul></td></tr></tbody></table></div>\n');

        if (dataslayer.options.showGTMLoad){
          if (!($.isEmptyObject(dataslayer.datalayers[a]))||(dataslayer.GTMs.hasOwnProperty(a)&&(dataslayer.GTMs[a].length>0)))
            $('#sub'+a+' li.newpage').addClass('hasGTM').removeClass('seeking').removeClass('noGTM').removeClass('hasTLM');
          else if ((!($.isEmptyObject(dataslayer.utag_datas[a])))||(dataslayer.TLMs.hasOwnProperty(a)&&!($.isEmptyObject(dataslayer.TLMs[a]))))
            $('#sub'+a+' li.newpage').addClass('hasTLM').removeClass('seeking').removeClass('noGTM').removeClass('hasGTM');
          else if (dataslayer.loading)
            $('#sub'+a+' li.newpage').addClass('seeking').removeClass('hasGTM').removeClass('noGTM').removeClass('hasTLM');
          else if (!($('#sub'+dataslayer.activeIndex+' li.newpage').hasClass('hasGTM')||$('#sub'+dataslayer.activeIndex+' li.newpage').hasClass('hasTLM')))
            $('#sub'+a+' li.newpage').addClass('noGTM').removeClass('seeking').removeClass('hasGTM').removeClass('hasTLM');
          }
        else $('#sub'+dataslayer.activeIndex+' li.newpage').removeClass('noGTM').removeClass('seeking').removeClass('hasGTM').removeClass('hasTLM');
    });
  } //end refresh all

  clickSetup(type);
}

function messageListener(message,sender,sendResponse){
  if (dataslayer.debug) console.log(message.type+' received: ',message);
  if ((message.type=='dataslayer_gtm')&&(message.tabID==chrome.devtools.inspectedWindow.tabId)){
    if (message.url!= 'iframe') dataslayer.urls[dataslayer.activeIndex]=message.url;
    $('a.currentpage').text(dataslayer.urls[dataslayer.activeIndex]);
    // chrome.devtools.inspectedWindow.eval('window.location.href',
    //   function(url,error){dataslayer.urls[dataslayer.activeIndex]=url;}
    //   );

    if (message.data=='notfound'){
      dataslayer.loading = false;
      if ((dataslayer.options.showGTMLoad)&&(!($('#sub'+dataslayer.activeIndex+' li.newpage').hasClass('hasGTM')||$('#sub'+dataslayer.activeIndex+' li.newpage').hasClass('hasTLM')||$('#sub'+dataslayer.activeIndex+' li.newpage').hasClass('hasTCO'))))
        $('#sub'+dataslayer.activeIndex+' li.newpage').addClass('noGTM').removeClass('seeking');
      else
        $('#sub'+dataslayer.activeIndex+' li.newpage').removeClass('seeking');
      // updateUI();
    }
    else if (message.data=='found'){
      dataslayer.loading = false;

      var exists = false;

      if (dataslayer.GTMs[dataslayer.activeIndex].length>0)
        for (var i=0;i<dataslayer.GTMs[dataslayer.activeIndex].length;i++)
          if (dataslayer.GTMs[dataslayer.activeIndex][i].id == message.gtmID)
            exists = true;

      if (!exists)
        dataslayer.GTMs[dataslayer.activeIndex].push({id: message.gtmID, name: message.dLN, iframe: (message.url=='iframe'?true:false)});

      if (dataslayer.options.showGTMLoad)
        $('#sub'+dataslayer.activeIndex+' li.newpage').addClass('hasGTM').removeClass('seeking');
      else
        $('#sub'+dataslayer.activeIndex+' li.newpage').removeClass('seeking');

      updateUI(dataslayer.activeIndex,'datalayer');

    }
    else{   
      $('#sub'+dataslayer.activeIndex+' li.newpage').addClass('hasGTM').removeClass('seeking').removeClass('noGTM');
      // dataslayer.datalayers[dataslayer.activeIndex]=JSON.parse(message.data);
      
      // dataslayer.GTMs[dataslayer.activeIndex] = {id: message.gtmID, name: message.dLN};

      updateUI(dataslayer.activeIndex,'datalayer');
    }
  }
  else if ((message.type=='dataslayer_tlm')&&(message.tabID==chrome.devtools.inspectedWindow.tabId)){
    if (message.url!= 'iframe') dataslayer.urls[dataslayer.activeIndex]=message.url;
    $('a.currentpage').text(dataslayer.urls[dataslayer.activeIndex]);

    if (message.data=='notfound'){
      dataslayer.loading = false;
      if ((dataslayer.options.showGTMLoad)&&(!($('#sub'+dataslayer.activeIndex+' li.newpage').hasClass('hasGTM')||$('#sub'+dataslayer.activeIndex+' li.newpage').hasClass('hasTLM')||$('#sub'+dataslayer.activeIndex+' li.newpage').hasClass('hasTCO'))))
        $('#sub'+dataslayer.activeIndex+' li.newpage').addClass('noGTM').removeClass('seeking');
      else
        $('#sub'+dataslayer.activeIndex+' li.newpage').removeClass('seeking');
      // updateUI();
    }
    else if (message.data=='found'){
      dataslayer.loading = false;

      dataslayer.TLMs[dataslayer.activeIndex] = {id: message.gtmID, name: message.dLN, iframe: (message.url=='iframe'?true:false)};

      if (dataslayer.options.showGTMLoad)
        $('#sub'+dataslayer.activeIndex+' li.newpage').addClass('hasTLM').removeClass('seeking');
      else
        $('#sub'+dataslayer.activeIndex+' li.newpage').removeClass('seeking');

      updateUI(dataslayer.activeIndex,'datalayer');

    }
    else{   
      $('#sub'+dataslayer.activeIndex+' li.newpage').addClass('hasTLM').removeClass('seeking').removeClass('noGTM');
      dataslayer.utag_datas[dataslayer.activeIndex] = collapseUDO(JSON.parse(message.data));
            
      dataslayer.TLMs[dataslayer.activeIndex] = {id: message.gtmID, name: message.dLN, iframe: (message.url=='iframe'?true:false)};

      updateUI(dataslayer.activeIndex,'datalayer');
    }
  }
  else if ((message.type=='dataslayer_tco')&&(message.tabID==chrome.devtools.inspectedWindow.tabId)){
    console.log(message);
    if (message.url!= 'iframe') dataslayer.urls[dataslayer.activeIndex]=message.url;
    $('a.currentpage').text(dataslayer.urls[dataslayer.activeIndex]);

    if (message.data=='notfound'){
      dataslayer.loading = false;
      if ((dataslayer.options.showGTMLoad)&&(!($('#sub'+dataslayer.activeIndex+' li.newpage').hasClass('hasGTM')||$('#sub'+dataslayer.activeIndex+' li.newpage').hasClass('hasTLM')||$('#sub'+dataslayer.activeIndex+' li.newpage').hasClass('hasTCO'))))
        $('#sub'+dataslayer.activeIndex+' li.newpage').addClass('noGTM').removeClass('seeking');
      else
        $('#sub'+dataslayer.activeIndex+' li.newpage').removeClass('seeking');
      // updateUI();
    }
    else if (message.data=='found'){
      dataslayer.loading = false;

      dataslayer.TCOs[dataslayer.activeIndex] = {id: message.gtmID, name: message.dLN, iframe: (message.url=='iframe'?true:false)};

      if (dataslayer.options.showGTMLoad)
        $('#sub'+dataslayer.activeIndex+' li.newpage').addClass('hasTCO').removeClass('seeking');
      else
        $('#sub'+dataslayer.activeIndex+' li.newpage').removeClass('seeking');

      updateUI(dataslayer.activeIndex,'datalayer');

    }
    else{   
      $('#sub'+dataslayer.activeIndex+' li.newpage').addClass('hasTCO').removeClass('seeking').removeClass('noGTM');
      dataslayer.tco_datas[dataslayer.activeIndex] = collapseUDO(JSON.parse(message.data));
            
      dataslayer.TCOs[dataslayer.activeIndex] = {id: message.gtmID, name: message.dLN, iframe: (message.url=='iframe'?true:false)};

      updateUI(dataslayer.activeIndex,'datalayer');
    }
  }
  else if ((message.type=='dataslayer_var')&&(message.tabID==chrome.devtools.inspectedWindow.tabId)){
    if (message.url!= 'iframe') dataslayer.urls[dataslayer.activeIndex]=message.url;
    $('a.currentpage').text(dataslayer.urls[dataslayer.activeIndex]);

    if (message.data=='found'){
      dataslayer.loading = false;

      if (dataslayer.vars[dataslayer.activeIndex])
        dataslayer.vars[dataslayer.activeIndex].push({name: message.dLN, iframe: (message.url=='iframe'?true:false)});
      else
        dataslayer.vars[dataslayer.activeIndex] = [{name: message.dLN, iframe: (message.url=='iframe'?true:false)}];

      if (!dataslayer.var_datas[dataslayer.activeIndex]) dataslayer.var_datas[dataslayer.activeIndex] = {};
      dataslayer.var_datas[dataslayer.activeIndex][message.dLN] = {};

      if (dataslayer.options.showGTMLoad)
        $('#sub'+dataslayer.activeIndex+' li.newpage').addClass('hasVAR').removeClass('seeking');
      else
        $('#sub'+dataslayer.activeIndex+' li.newpage').removeClass('seeking');

      updateUI(dataslayer.activeIndex,'datalayer');

    }
    else{   
      $('#sub'+dataslayer.activeIndex+' li.newpage').addClass('hasVAR').removeClass('seeking').removeClass('noGTM');
      dataslayer.var_datas[dataslayer.activeIndex][message.dLN] = collapseUDO(JSON.parse(message.data));
            
      // dataslayer.vars[dataslayer.activeIndex] = {name: message.dLN, iframe: (message.url=='iframe'?true:false)};

      updateUI(dataslayer.activeIndex,'datalayer');
    }
  }
  if ((message.type=='dataslayer_gtm_push')&&(message.tabID==chrome.devtools.inspectedWindow.tabId)){
    if (message.url!= 'iframe') dataslayer.urls[dataslayer.activeIndex]=message.url;
    $('#sub'+dataslayer.activeIndex+' li.newpage').addClass('hasGTM').removeClass('seeking').removeClass('noGTM');
    // dataslayer.GTMs[dataslayer.activeIndex] = {id: message.gtmID, name: message.dLN};
    if (dataslayer.datalayers[dataslayer.activeIndex].hasOwnProperty(message.dLN))
      dataslayer.datalayers[dataslayer.activeIndex][message.dLN].push(JSON.parse(message.data));
    else 
      dataslayer.datalayers[dataslayer.activeIndex][message.dLN] = [JSON.parse(message.data)];
    if ($('.dlnum'+dataslayer.activeIndex+'.dlheader').data('dln')==message.dLN)
      $('.dlnum'+dataslayer.activeIndex+'.dlheader').after(datalayerPushHTML(JSON.parse(message.data),dataslayer.activeIndex));
    clickSetup('datalayer');
  }
  else if (message.type=='dataslayer_loadsettings'){
    for (var a in message.data) { dataslayer.options[a] = message.data[a]; }
    if (!dataslayer.options.showGTMLoad)
      $('li.newpage').removeClass('seeking').removeClass('hasTLM').removeClass('hasGTM').removeClass('noGTM');
    for (var eachPage in dataslayer.datalayers){
      updateUI(eachPage,'datalayer');
      updateUI(eachPage,'tag');
    }
    $('td.utm>ul>li:first-child.eventbreak').remove();
  }
}

// newPageLoad: called when user navigates to a new page 
function newPageLoad(newurl){
  dataslayer.loading = true;
  loadSettings();

  dataslayer.activeIndex = dataslayer.activeIndex + 1;
  dataslayer.datalayers[dataslayer.activeIndex] = {};
  dataslayer.GTMs[dataslayer.activeIndex] = [];
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
      reqType = 'dc_js';
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
  }

  // parse query string into key/value pairs
  var queryParams = {};
  if ((reqType == 'classic') || (reqType == 'universal') || (reqType == 'dc_js') || (reqType == 'sitecatalyst'))
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
                  'in','ip','iq','ic','iv','cu','sn','sa','st','uid','linkid','pa',              //UA
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
    var scTestParams = ['pageName','pe','events','products','pev2','pev1','purchaseID','zip','vid','xact','state','ch'];
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
    dataslayer.datalayers = [{}];
    dataslayer.tags = [[]];
    dataslayer.utag_datas = [{}];
    dataslayer.tco_datas = [{}];
    dataslayer.var_datas = [{}];
    dataslayer.GTMs = [dataslayer.GTMs[dataslayer.activeIndex]];
    dataslayer.TLMs = [dataslayer.TLMs[dataslayer.activeIndex]];
    dataslayer.TCOs = [dataslayer.TCOs[dataslayer.activeIndex]];
    dataslayer.vars = [dataslayer.vars[dataslayer.activeIndex]];
    dataslayer.urls = [dataslayer.urls[dataslayer.activeIndex]];
    dataslayer.activeIndex = 0;
    updateUI();
    // $('.dlnum0').toggleClass('submenu-hidden');
    $("#lean_overlay").fadeOut(200);$('#clearconfirm').css({"display":"none"});
});

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
    dataslayer.GTMs[dataslayer.activeIndex] = [];
    for (var i in exists.gtmID)
      dataslayer.GTMs[dataslayer.activeIndex].push({id: exists.gtmID[i], name: exists.dLN[i]});
    dataslayer.TLMs[dataslayer.activeIndex]={id: exists.utagID, name: exists.udoname};
    chrome.runtime.sendMessage({type: 'dataslayer_refresh',tabID: chrome.devtools.inspectedWindow.tabId});
    // testDL(exists.dLN);
  }
  else {  //was not already injected
    chrome.runtime.sendMessage({type: 'dataslayer_opened',tabID: chrome.devtools.inspectedWindow.tabId});
    // testDL('dataLayer');
  }
});

// look for existing SiteCatalyst tags
chrome.devtools.inspectedWindow.eval('(function(){ var abla=[]; for (var attr in window)if (((typeof window[attr]==="object")&&(window[attr]))&&("src" in window[attr])) if ((attr.substring(0,4)==="s_i_")&&(window[attr].src.indexOf("/b/ss/"))) abla.push(window[attr].src); return abla; })();',
  function(exists,error){
    if(!error) for (var a in exists)newRequest({request:{url:exists[a],method:'GET'}});
});
