import React, { Component } from 'react';
import PropTypes from 'prop-types'
import lookupParameter from './lookupParameter';

const parseUniversal = (data, keyPrefix = '') => {
  let params = [];

  let hasEnhanced = false;
  for (let param in data.allParams) {
    if (data.allParams.hasOwnProperty(param)) {
      hasEnhanced = hasEnhanced || (param.match(/(pr[\d+].*|il[\d+].*|promo[\d+a].*|pa(l*)|tcc|co[sl])$/) !== null);
    }
  }

  if (hasEnhanced) {
    params.push((<tr><td /><td><i>(contains enhanced ecommerce)</i></td></tr>));
  }

  if (data.uid) {
    params.push((<tr><td><b>user ID</b></td><td><span>{data.uid}</span></td></tr>));
  }

  switch (data.t) {  // what type of hit is it?
    case 'event':
      params.push((<tr key={`${keyPrefix}ec`}><td><b>category</b></td><td><span>{data.ec}</span></td></tr>),
        (<tr key={`${keyPrefix}ea`}><td><b>action</b></td><td><span>{data.ea}</span></td></tr>));
      if (data.el) params.push((<tr key={`${keyPrefix}el`}><td><b>label</b></td><td><span>{data.el}</span></td></tr>));
      if (data.ev) params.push((<tr key={`${keyPrefix}ev`}><td><b>value</b></td><td><span>{data.ev}</span></td></tr>));
      break;
    case 'pageview':
      params.push((<tr key={`${keyPrefix}dp`}><td><b>{data.dp ? 'path' : 'url'}</b></td><td><span>{data.dp ? data.dp : data.dl}</span></td></tr>));
      break;
    case 'social':
      params.push((<tr key={`${keyPrefix}sn`}><td><b>network</b></td><td><span>{data.sn}</span></td></tr>),
        (<tr key={`${keyPrefix}sa`}><td><b>action</b></td><td><span>{data.sa}</span></td></tr>),
        (<tr key={`${keyPrefix}st`}><td><b>target</b></td><td><span>{data.st}</span></td></tr>));
      break;
    case 'transaction':
      params.push((<tr key={`${keyPrefix}ti`}><td /><td><b>transaction {data.ti}</b></td></tr>));
      if (data.tr) {
        params.push((<tr key={`${keyPrefix}tr`}><td><b>revenue</b></td><td><span>{`${data.tr} ${(data.cu || '')}`}</span></td></tr>));
      }
      if (data.ts) {
        params.push((<tr key={`${keyPrefix}ts`}><td><b>shipping</b></td><td><span>{`${data.ts} ${(data.cu || '')}`}</span></td></tr>));
      }
      if (data.tt) {
        params.push((<tr key={`${keyPrefix}tt`}><td><b>tax</b></td><td><span>{`${data.tt} ${(data.cu || '')}`}</span></td></tr>));
      }
      if (data.ta) {
        params.push((<tr key={`${keyPrefix}ta`}><td><b>affiliation</b></td><td><span>{data.ta}</span></td></tr>));
      }
      break;
    case 'item':
      params.push((<tr key={`${keyPrefix}ti`}><td /><td><b>transaction {data.ti}</b></td></tr>));
      if (data.in) {
        params.push((<tr key={`${keyPrefix}iq`}><td><b>item/qty</b></td><td><span>({data.iq}x) {data.in}</span></td></tr>));
      }
      if (data.ic) {
        params.push((<tr key={`${keyPrefix}ic`}><td><b>sku</b></td><td><span>{data.ic}</span></td></tr>));
      }
      if (data.iv) {
        params.push((<tr key={`${keyPrefix}iv`}><td><b>variation</b></td><td><span>{data.iv}</span></td></tr>));
      }
      if (data.ip) {
        params.push((<tr key={`${keyPrefix}ip`}><td><b>price</b></td><td><span>{`${data.ip}${(data.cu || '')}`}</span></td></tr>));
      }
      break;
    case 'timing':
      params.push((<tr key={`${keyPrefix}timing`}><td /><td><b>timing hit</b></td></tr>));
      if (data.allParams.utc) {
        params.push((<tr key={`${keyPrefix}utc`}><td><b>category</b></td><td><span>{data.allParams.utc}</span></td></tr>));
      }
      if (data.allParams.utv) {
        params.push((<tr key={`${keyPrefix}utv`}><td><b>variable</b></td><td><span>{data.allParams.utv}</span></td></tr>));
      }
      if (data.allParams.utt) {
        params.push((<tr key={`${keyPrefix}utt`}><td><b>time</b></td><td><span>{data.allParams.utt}</span></td></tr>));
      }
      if (data.allParams.utl) {
        params.push((<tr key={`${keyPrefix}utl`}><td><b>label</b></td><td><span>{data.allParams.utl}</span></td></tr>));
      }
      if (data.allParams.dns) {
        params.push((<tr key={`${keyPrefix}dns`}><td><b>DNS time</b></td><td><span>{data.allParams.dns}</span></td></tr>));
      }
      if (data.allParams.pdt) {
        params.push((<tr key={`${keyPrefix}pdt`}><td><b>page time</b></td><td><span>{data.allParams.pdt}</span></td></tr>));
      }
      if (data.allParams.rrt) {
        params.push((<tr key={`${keyPrefix}rrt`}><td><b>redirect time</b></td><td><span>{data.allParams.rrt}</span></td></tr>));
      }
      if (data.allParams.tcp) {
        params.push((<tr key={`${keyPrefix}tcp`}><td><b>TCP time</b></td><td><span>{data.allParams.tcp}</span></td></tr>));
      }
      if (data.allParams.srt) {
        params.push((<tr key={`${keyPrefix}srt`}><td><b>server time</b></td><td><span>{data.allParams.srt}</span></td></tr>));
      }
      break;
    default:
      break;
  }

  for (let cd in data.utmCD) {
    if (data.utmCD.hasOwnProperty(cd)) {
      params.push((<tr key={`${keyPrefix}cd_${cd}`}>
        <td><b>CD {cd}</b></td><td><span>{data.utmCD[cd]}</span></td>
      </tr>));
    }
  }
  for (let cm in data.utmCM) {
    if (data.utmCM.hasOwnProperty(cm)) {
      params.push((<tr key={`${keyPrefix}cm_${cm}`}>
        <td><b>CM {cm}</b></td><td><span>{data.utmCM[cm]}</span></td>
      </tr>));
    }
  }
  for (let cg in data.utmCG) {
    if (data.utmCG.hasOwnProperty(cg)) {
      params.push((<tr key={`${keyPrefix}cg_${cg}`}>
        <td><b>CG {cg}</b></td><td><span>{data.utmCG[cg]}</span></td>
      </tr>));
    }
  }

  return params;
};

const parseClassic = (data, keyPrefix = '') => {
  let params = [];
  let v = data;

  switch (v.utmt) {
    case 'event':
      if (v.utme.indexOf('5(') >= 0) {
        // find events and unescape
        let eventdata = v.utme
        .match(/5\([^)]+\)(\(\d+\))?/i)[0]
        .replace(/'1/g, ')')
        .replace(/'3/g, '!')
        .replace(')(', '*')
        .substring(2)
        .split('*');

        // chop trailing paren
        eventdata[eventdata.length - 1] = eventdata[eventdata.length - 1]
        .substring(0, eventdata[eventdata.length - 1].length - 1);

        for (let a in eventdata) {
          if (eventdata.hasOwnProperty(a)) {
            eventdata[a] = eventdata[a].replace(/'2/g, '*').replace(/'0/g, '\'');
          }
        }
        params.push((<tr><td><b>category</b></td><td><span>{eventdata[0]}</span></td></tr>),
          (<tr><td><b>action</b></td><td><span>{eventdata[1]}</span></td></tr>),
          (<tr><td><b>label</b></td><td><span>{eventdata[2]}</span></td></tr>));
        if (eventdata[3]) {
          params.push((<tr><td><b>value</b></td><td>{eventdata[3]}</td></tr>));
        }
      }
      break;
    case 'transaction':
      params.push((<tr><td /><td><b>transaction {v.utmtid}</b></td></tr>));
      if (v.utmtto) {
        params.push((<tr><td><b>revenue</b></td><td><span>{v.utmtto}</span></td></tr>));
      }
      if (v.utmtsp) {
        params.push((<tr><td><b>shipping</b></td><td><span>{v.utmtsp}</span></td></tr>));
      }
      if (v.utmttx) {
        params.push((<tr><td><b>tax</b></td><td><span>{v.utmttx}</span></td></tr>));
      }
      if (v.utmtst) {
        params.push((<tr><td><b>affiliation</b></td><td><span>{v.utmtst}</span></td></tr>));
      }
      break;
    case 'item':
      params.push((<tr><td /><td><b>transaction {v.utmtid}</b></td></tr>));
      if (v.utmipn) {
        params.push((<tr><td><b>item/qty</b></td>
          <td><span>({v.utmiqt}x) {v.utmipn}</span></td></tr>));
      }
      if (v.utmipc) {
        params.push((<tr><td><b>sku</b></td><td><span>{v.utmipc}</span></td></tr>));
      }
      if (v.utmiva) {
        params.push((<tr><td><b>category</b></td><td><span>{v.utmiva}</span></td></tr>));
      }
      if (v.utmipr) {
        params.push((<tr><td><b>price</b></td><td><span>{v.utmipr}</span></td></tr>));
      }
      break;
    case 'social':
      params.push((<tr><td><b>network</b></td><td><span>{v.utmsn}</span></td></tr>),
        (<tr><td><b>action</b></td><td><span>{v.utmsa}</span></td></tr>),
        (<tr><td><b>target</b></td><td><span>{v.utmsid}</span></td></tr>));
      break;
    case 'var':
      params.push((<tr><td /><td><b>user-defined variable</b></td></tr>));
      try {
        if (v.utmcc && v.utmcc.match(/__utmv=[^;]*/)[0]) {
          params.push((<tr><td><b>value</b></td><td><span>{v.utmcc.match(/__utmv=[^;]*/)[0].replace('__utmv=', '')}</span></td></tr>));
        }
      } catch (err) {
        console.log('user-defined variable error: ', err);
      }
      break;
    default:
      // pageview
      params.push((<tr key={`${keyPrefix}pageview`}><td><b>url</b></td><td><span>{v.utmhn + v.utmp}</span></td></tr>));
      break;
  }

  // page groupings
  if (v.utmpg) {
    for (let pg in v.utmpg) {
      if (v.utmpg.hasOwnProperty[pg]) {
        try {
          const grouping = v.utmpg[pg].split(':');
          params.push((<tr><td><b>page grouping {grouping[0]}</b></td>
            <td><span>{grouping[1]}</span></td></tr>));
        } catch (e) {
          console.log('error parsing classic page groupings');
        }
      }
    }
  }

  if (((v.utme) && (v.utme.indexOf('14(') >= 0)) && (v.utme.match(/14\([\d*]+\)\([\d*]+\)/i) !== null)) {
    // we have performance information
    let performancedata = v.utme.match(/14\([\d*]+\)\([\d*]+\)/i)[0].substring(2);
    params.push((<tr><td><b>speed</b></td><td><span>{performancedata.replace(')(', ')\n(')}</span></td></tr>));
  }
  if ((v.utme) && (v.utme.indexOf('12(') >= 0)) {
    // we have in-page information
    let inpagedata = v.utme.match(/12\([^)]+(?=\))/i)[0]
    .substring(3)
    .replace('\'1', ')')
    .replace('\'2', '*')
    .replace('\'3', '!')
    .replace('\'0', '\'');
    params.push((<tr><td><b>in-page ID</b></td><td><span>{inpagedata}</span></td></tr>));
  }
  if ((v.utme) && (v.utme.indexOf('8(') >= 0)) {
    // we have CVs here
    let gaCVs = v.utme.substring(v.utme.indexOf('8(')).match(/[^)]+(\))/g);

    for (let i in gaCVs) {
      if (gaCVs.hasOwnProperty(i)) {
        gaCVs[i] = gaCVs[i].replace(/^[8910]+\(/, '').match(/[^*|^)]+(?=[*)])/g);
      }
    }

    let newspot = 0;
    let gaCVsfixed = [{}, {}, {}];
    for (let row in gaCVs[0]) {
      if (gaCVs[0][row].indexOf('!') >= 0) {
        newspot = gaCVs[0][row].substring(0, gaCVs[0][row].indexOf('!')) - 1;

        for (let c in gaCVs) {
          if (gaCVs[c].hasOwnProperty(row)) {
            gaCVs[c][row] = gaCVs[c][row].substring(gaCVs[c][row].indexOf('!') + 1);
          }
        }
      }

      gaCVsfixed[0][newspot] = gaCVs[0][row];
      gaCVsfixed[1][newspot] = gaCVs[1][row];
      try {
        if ((typeof gaCVs[2] !== 'undefined') && (typeof gaCVs[2][row] !== 'undefined')) {
          gaCVsfixed[2][newspot] = gaCVs[2][row].charAt(0);
        } else {
          gaCVsfixed[2][newspot] = '0';
        }
        // gaCVsfixed[2][newspot] = typeof gaCVs[2] !== 'undefined' ?
        // (typeof gaCVs[2][row] !== 'undefined' ? gaCVs[2][row].charAt(0) : '0') : '0';
      } catch (err) {
        console.log(`${err} @ CV ${newspot}`);
      }

      newspot++;
    }

    newspot = 0;
    for (let s in gaCVs[2]) {
      if (gaCVs[2][s].indexOf('!') >= 0) {
        newspot = gaCVs[2][s].substring(0, gaCVs[2][s].indexOf('!')) - 1;
        for (let i = 0; i < newspot; i++) {
          gaCVsfixed[2][i] = '0';
        }
        gaCVs[2][s] = gaCVs[2][s].substring(gaCVs[2][s].indexOf('!') + 1);
      }
      try {
        if ((typeof gaCVs[2] !== 'undefined') && (typeof gaCVs[2][s] !== 'undefined')) {
          gaCVsfixed[2][newspot] = gaCVs[2][s].charAt(0);
        } else {
          gaCVsfixed[2][newspot] = '0';
        }
      } catch (err) {
        console.log(`${err} @ CV ${newspot}`);
      }

      newspot++;
    }

    gaCVs = gaCVsfixed;

    for (let ii in gaCVs[0]) {
      if (typeof gaCVs[0] !== 'undefined') {
        gaCVs[0][ii] = gaCVs[0][ii]
        .replace('\'1', ')')
        .replace('\'2', '*')
        .replace('\'3', '!')
        .replace('\'0', '\'');
        if (gaCVs[1][ii]) {
          gaCVs[1][ii] = gaCVs[1][ii]
          .replace('\'1', ')')
          .replace('\'2', '*')
          .replace('\'3', '!')
          .replace('\'0', '\'');
        }

        let scope;
        switch (String(gaCVs[2][ii])) {
          case '0': scope = 'no scope-&gt; page';
            break;
          case '1': scope = 'visitor scope';
            break;
          case '2': scope = 'session scope';
            break;
          case '3': scope = 'page scope';
            break;
          default:
            break;
        }
        params.push((<tr><td><b>CV {(parseInt(ii, 10) + 1)}</b></td>
          <td><span>{gaCVs[0][ii]} <b>=</b> {gaCVs[1][ii]} <i>({scope})</i></span></td></tr>));
      }
    }
  }

  return params;
};

const parseFloodlight = (data, keyPrefix = '') =>
  Object.keys(data.allParams).map(name =>
    (<tr key={`${keyPrefix}${name}`}><td><b>{name}</b></td><td><span>{data.allParams[name]}</span></td></tr>));

const parseSiteCatalyst = (data, keyPrefix = '') => {
  let params = [];
  let allParams = data.allParams;
  if (allParams.pe === 'lnk_o') {
    params.push((<tr key={`${keyPrefix}lnk_o`}><td /><td><span><b>click event</b></span></td></tr>));
    if (allParams.pev2) {
      params.push((<tr key={`${keyPrefix}pev2`}><td><b>link name</b></td><td><span>{allParams.pev2}</span></td></tr>));
    }
  } else if (allParams.pe === 'lnk_e') {
    params.push((<tr key={`${keyPrefix}lnk_e`}><td /><td><span><b>exit link</b></span></td></tr>));
    if (allParams.pev2) {
      params.push((<tr key={`${keyPrefix}pev2`}><td><b>link name</b></td><td><span>{allParams.pev2}</span></td></tr>));
    }
    if (allParams.pev1) {
      params.push((<tr key={`${keyPrefix}pev1`}><td><b>link url</b></td><td><span>{allParams.pev1}</span></td></tr>));
    }
  }

  if (allParams.pageName) {
    params.push((<tr key={`${keyPrefix}pageName`}><td><b>pageName</b></td><td><span>{allParams.pageName}</span></td></tr>));
  }
  if (allParams.ch) {
    params.push((<tr key={`${keyPrefix}siteSection`}><td><b>site section</b></td><td><span>{allParams.ch}</span></td></tr>));
  }
  if (allParams.events) {
    params.push((<tr key={`${keyPrefix}events`}><td><b>events</b></td><td><span>{allParams.events}</span></td></tr>));
  }
  if (allParams.products) {
    const productsArray = allParams.products.split(',');
    if (productsArray.length > 1) {
      for (let productKey in productsArray) {
        if (productsArray.hasOwnProperty(productKey)) {
          params.push((<tr key={`${keyPrefix}product${productKey}`}><td><b>product {productKey}</b></td><td><span>{productsArray[productKey]}</span></td></tr>));
        }
      }
    } else {
      params.push((<tr><td><b>product</b></td><td><span>{allParams.products}</span></td></tr>));
    }
  }

  if (allParams.vid) {
    params.push((<tr><td><b>visitor ID</b></td><td><span>{allParams.vid}</span></td></tr>));
  }
  if (allParams.xact) {
    params.push((<tr><td><b>transaction ID</b></td><td><span>{allParams.xact}</span></td></tr>));
  }
  if (allParams.purchaseID) {
    params.push((<tr><td><b>purchase ID</b></td>
      <td><span>{allParams.purchaseID}</span></td></tr>));
  }
  if (allParams.zip) {
    params.push((<tr><td><b>ZIP code</b></td><td><span>{allParams.zip}</span></td></tr>));
  }
  if (allParams.state) {
    params.push((<tr><td><b>state</b></td><td><span>{allParams.state}</span></td></tr>));
  }

  const varRegex = /^D=(([vc]\d+)|(\w+))$/;

  // enumerate eVars and props
  for (let cd in data.scEvars) {
    if (data.scEvars.hasOwnProperty(cd)) {
      if (cd === '0') {
        params.push((<tr key={`${keyPrefix}campaign`}><td><b>campaign</b></td><td><span>{data.scEvars[cd]}</span></td></tr>));
      } else if (varRegex.test(data.scEvars[cd])) {
        // Value is copied from another variable
        let prop = data.scEvars[cd].match(varRegex)[1];
        params.push(
          (<tr key={`${keyPrefix}eVar${cd}`}>
            <td>
              <b>eVar{cd}</b>
            </td>
            <td>
              <span>{data.scEvars[cd]}</span> <em style={{ color: '#919191' }}>{data.allParams[prop]}</em>
            </td>
          </tr>)
        );
      } else {
        params.push((<tr key={`${keyPrefix}eVar${cd}`}><td><b>eVar{cd}</b></td><td><span>{data.scEvars[cd]}</span></td></tr>));
      }
    }
  }
  for (let cm in data.scProps) {
    if (data.scProps.hasOwnProperty(cm)) {
      if (varRegex.test(data.scProps[cm])) {
        // Value is copied from another variable
        let eVar = data.scProps[cm].match(varRegex)[1];
        params.push(
          (<tr key={`${keyPrefix}prop${cm}`}>
            <td>
              <b>prop{cm}</b>
            </td>
            <td>
              <span>{data.scProps[cm]}</span> <em style={{ color: '#919191' }}>{data.allParams[eVar]}</em>
            </td>
          </tr>)
        );
      } else {
        params.push((<tr key={`${keyPrefix}prop${cm}`}><td><b>prop{cm}</b></td><td><span>{data.scProps[cm]}</span></td></tr>));
      }
    }
  }
  return params;
};

class Tag extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    };
  }

  toggleParameters = () => {
    this.setState({ expanded: !this.state.expanded });
  }

  render() {
    let data = this.props.data;
    let tagType;
    let propertyId;
    let specificParams;

    const { showFriendlyNames } = this.props.options;

    switch (data.reqType) {
      case 'classic':
      case 'dc_js':
        tagType = `(${data.reqType})`;
        propertyId = data.allParams.utmac;
        specificParams = parseClassic(data, `${this.props.keyAncestor}_shownParams_`);
        break;
      case 'universal':
        tagType = '(Universal)';
        propertyId = data.allParams.tid;
        specificParams = parseUniversal(data, `${this.props.keyAncestor}_shownParams_`);
        break;
      case 'floodlight':
        propertyId = 'Floodlight';
        specificParams = parseFloodlight(data, `${this.props.keyAncestor}_shownParams_`);
        break;
      case 'sitecatalyst':
        tagType = '(Adobe Analytics)';
        propertyId = data.rsid;
        specificParams = parseSiteCatalyst(data, `${this.props.keyAncestor}_shownParams_`);
        break;
      default:
        break;
    }

    return (<li className="event submenu">
      <table cols="2">
        <tbody>
          <tr>
            <td />
            <td>
              <u>{propertyId}</u> {tagType}
              {data.reqType !== 'floodlight' && (<a className="toggle" onClick={this.toggleParameters}>{this.state.expanded ? '-' : '+'}</a>)}
            </td>
          </tr>
          {
            Object.keys(data.allParams).map(name =>
              (<tr key={`${this.props.keyAncestor}_allparams_${name}`} className={`allparams ${this.state.expanded ? '' : 'hidden'}`}>
                <td>{(data.reqType === 'universal' && showFriendlyNames && lookupParameter(name)) || name}</td>
                <td>{data.allParams[name]}</td>
              </tr>))
          }
          { data.allParams.gtm && (<tr><td /><td><i>(via {data.allParams.gtm.replace(/2wg241|2wg3b2/ig, 'GTM-')})</i></td></tr>)}
          { data.allParams.ni && Number(data.allParams.ni) === 1 ? (<tr><td /><td><i>non-interactive</i></td></tr>) : null}
          { specificParams }
        </tbody>
      </table>
    </li>);
  }
}

Tag.propTypes = {
  data: PropTypes.object.isRequired,
  options: PropTypes.object.isRequired,
  keyAncestor: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.number.isRequired
  ]).isRequired,
  searchQuery: PropTypes.string,
};

const TagBreak = () => (<li className="eventbreak submenu" />);

const Tags = (props) => {
  const testTag = ({ allParams }, query) =>
    JSON.stringify(allParams).toLowerCase().indexOf(query) > -1;
  let tags = [];
  for (let i = props.data.length - 1; i >= 0; i--) {
    let tag = props.data[i];
    let showTag = true;
    if (!props.options.showFloodlight && tag.reqType === 'floodlight') {
      showTag = false;
    } else if (!props.options.showSitecatalyst && tag.reqType === 'sitecatalyst') {
      showTag = false;
    } else if (!props.options.showClassic && (tag.reqType === 'classic' || tag.reqType === 'dc_js')) {
      showTag = false;
    } else if (!props.options.showUniversal && tag.reqType === 'universal') {
      showTag = false;
    } else if (tag.tid && props.options.ignoredTags.includes(tag.tid)) {
      showTag = false;
    } else if (tag.utmac && props.options.ignoredTags.includes(tag.utmac)) {
      showTag = false;
    } else if (tag.rsid && props.options.ignoredTags.includes(tag.rsid)) {
      showTag = false;
    } else if (props.searchQuery && props.searchQuery.length > 0 && !testTag(tag, props.searchQuery)) {
      showTag = false;
    }

    if (showTag) {
      tags = tags.concat(i === 0 ?
      [
        (<Tag
          data={tag}
          key={tag.__uuid || i}
          keyAncestor={tag.__uuid || i}
          options={props.options}
          searchQuery={props.searchQuery}
        />)
      ] :
      [
        (<Tag
          data={tag}
          key={tag.__uuid || i}
          keyAncestor={tag.__uuid || i}
          options={props.options}
          searchQuery={props.searchQuery}
        />),
        (<TagBreak key={`${tag.__uuid}break` || `${i}break`} />)
      ]
      );
    }
  }

  return (tags.length > 0) && (
    <td className="utm">
      <ul>
        {tags}
      </ul>
    </td>
  );
};

Tags.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  options: PropTypes.object,
  searchQuery: PropTypes.string,
};

export default Tags;
