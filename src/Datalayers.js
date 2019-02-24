import React, { Component } from 'react';

//
// Helper functions
//

// collapseStack
// - obj: object to populate based on keys
// - keys: array of key names (i.e. to populate test.demo.property, ['test','demo','property'])
// - val: value for key to be assigned
// returns stacked object
function collapseStack(obj, keys, val) {
  let result = obj;
  if ((keys.length < 2) && (Array.isArray(val))) {
    result[keys[0]] = val.slice(0);
  } else if (keys.length < 2) {
    result[keys[0]] = val;
  } else {
    result[keys[0]] = collapseStack(obj[keys[0]] || {}, keys.slice(1), val);
  }
  return result;
}

// collapseUDO
// - udo: Tealium-style data object
// returns data object with properties converted to object paradigm
function collapseUDO(udo) {
  let newUDO = {};
  let props = Object.getOwnPropertyNames(udo).sort();
  for (let i in props) {
    if (props.hasOwnProperty(i)) {
      let stack = props[i].split('.');
      if (stack.length === 1) {
        newUDO[stack[0]] = udo[stack[0]];
      } else {
        newUDO[stack[0]] = newUDO[stack[0]] || {};
        newUDO[stack[0]] = collapseStack(newUDO[stack[0]], stack.slice(1), udo[props[i]]);
      }
    }
  }
  return newUDO;
}

// getAllNested
// returns array of special selectors for nested objects
function getAllNested(obj, root, startingWith = false) {
  let selectors = [];
  for (let sub in obj) {
    if (obj.hasOwnProperty(sub) && typeof obj[sub] === 'object') {
      if (!startingWith || (startingWith && (`${root}--${sub}`).indexOf(startingWith) === 0)) {
        selectors.push(`${root}--${sub}`);
      }
      selectors = selectors.concat(getAllNested(obj[sub], `${root}--${sub}`));
    }
  }
  return selectors;
}

// addSpaces
// returns as many HTML nbsp entities as argument length
function addSpaces(obj) {
  let spaces = '';
  for (let i = 0; i < obj.length; i++) {
    spaces += '\u00a0';
  }
  return spaces;
}

//
// Data layer subcomponents
//
const DataLayerBreak = () => (<li className="eventbreak submenu" />);

const DataLayerLines = (props) => {
  let data = props.data;
  let depth = props.depth;
  let isObject = typeof data === 'object';
  let spaces = props.spaces || '';
  let showChildren = !props.hidden.includes(`${props.parent}--${props.index}`);

  if (props.hideEmpty && (data === '' || data === {})) {
    return null;
  }

  return [(
    <tr className={isObject ? 'object-row' : ''}>
      <td>
        {
          isObject &&
          (<em><a onMouseDown={props.click} data-tree={`${props.parent}--${props.index}`} title="shift-click to expand all">
            {showChildren ? '-' : '+'}
          </a></em>)
        }
        <b>{depth > 0 && addSpaces(spaces)}.{props.index}</b>
      </td>
      <td>
        <span>{isObject ? (<i>object</i>) : data}</span>
      </td>
    </tr>),
    isObject && showChildren && Object.keys(data).map((v, i) =>
        DataLayerLines({
          key: `${props.keyAncestor}_${v}`,
          keyAncestor: `${props.keyAncestor}_${v}`,
          index: v,
          parent: `${props.parent}--${props.index}`,
          data: data[v],
          spaces: spaces + props.index,
          depth: depth + 1,
          click: props.click,
          hidden: props.hidden
        }))];
};

class DataLayerEntry extends Component {
  constructor(props) {
    super(props);
    let hidden = [];
    if (props.collapseNested && typeof props.data === 'object') {
      hidden = getAllNested(props.data, props.index);
    }
    this.state = {
      expanded: !props.collapseNested,
      hidden
    };
  }

  toggleExpanded = (e) => {
    if (e.button !== 0) {
      return;
    }
    e.preventDefault();
    if (e.shiftKey) {
      if (this.state.expanded) {
        // collapse all
        this.setState({
          hidden: getAllNested(this.props.data, this.props.index),
          expanded: !this.state.expanded
        });
      } else {
        // expand all
        this.setState({ hidden: [], expanded: !this.state.expanded });
      }
    } else {
      this.setState({ expanded: !this.state.expanded });
    }
  }

  toggleSubExpanded = (e) => {
    if (e.button !== 0) {
      return;
    }
    e.preventDefault();
    let selector = e.target.getAttribute('data-tree');
    let hidden = this.state.hidden;
    let index = hidden.indexOf(selector);
    if (e.shiftKey) {
      if (e.target.textContent === '+') {
        // clear all items starting with 'selector' from 'hidden'
        hidden = hidden.filter(item => !(new RegExp(`^${selector}`).test(item)));
      } else {
        // put all sub items into hidden (getAllNested?)
        let subItems = [selector].concat(getAllNested(this.props.data, this.props.index, selector));
        hidden = [...new Set([...hidden, ...subItems])];
      }
    } else if (index > -1) {
      hidden.splice(index, 1);
    } else {
      hidden.push(selector);
    }

    this.setState({ hidden });
  }

  collapse = () => {
    this.setState({ expanded: false });
  }

  expand = () => {
    this.setState({ expanded: true });
  }

  render() {
    let data = this.props.data;
    let depth = this.props.depth;
    let isObject = typeof data === 'object';
    let spaces = this.props.spaces || '';

    if (this.props.hideEmpty && (data === '' || data === {})) {
      return null;
    }

    let rowData;
    if (isObject) {
      rowData = (<i>object</i>);
    } else if (this.props.index === 'gtm.element' && data === 'element') {
      rowData = (<i>element</i>);
    } else {
      rowData = `${data}`;
    }

    return (
      <tbody>
        <tr className={isObject ? 'object-row' : ''}>
          <td>
            {isObject && (<em><a title="shift-click to expand all" onMouseDown={this.toggleExpanded}>{this.state.expanded ? '-' : '+'}</a></em>)}
            <b>{depth > 0 && addSpaces(spaces)}{this.props.index === 'Click Text' ? (<i>{this.props.index}</i>) : this.props.index}</b>
          </td>
          <td>
            <span>{rowData}</span>
          </td>
        </tr>
        {(isObject && this.state.expanded) && Object.keys(data).map((v, i) =>
          DataLayerLines({
            keyAncestor: `${this.props.keyAncestor}_${v}`,
            key: `${this.props.keyAncestor}_${v}`,
            index: v,
            data: data[v],
            parent: this.props.index,
            spaces: spaces + this.props.index,
            depth: depth + 1,
            hideEmpty: this.props.hideEmpty,
            hidden: this.state.hidden,
            click: this.toggleSubExpanded
          }))}
      </tbody>);
  }
}

DataLayerEntry.propTypes = {
  depth: React.PropTypes.number,
  data: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.string,
    React.PropTypes.number
  ]),
  collapseNested: React.PropTypes.bool,
  spaces: React.PropTypes.string,
  index: React.PropTypes.string,
  hideEmpty: React.PropTypes.bool,
  keyAncestor: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number
  ])
};

const DataLayerBlock = props =>
  (<li className="event submenu datalayer">
    {props.options.showArrayIndices && props.arrayIndex > -1 && (<span className="arrayIndex">{props.arrayIndex}</span>)}
    <table cols="2">
      {Object.keys(props.data).map((v, i) =>
        (<DataLayerEntry
          key={`${props.keyAncestor}_${v}`}
          keyAncestor={`${props.keyAncestor}_${v}`}
          index={v}
          data={props.data[v]}
          depth={0}
          hideEmpty={props.options.hideEmpty}
          collapseNested={props.options.collapseNested}
        />)
      )}
    </table>
  </li>);

DataLayerBlock.propTypes = {
  data: React.PropTypes.object,
  options: React.PropTypes.object,
  keyAncestor: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number
  ]),
  arrayIndex: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number
  ])
};

//
// Data layer types
//

const TLM = (props) => {
  let udo = collapseUDO(props.data);
  let header;
  header = (<td>
    <u>{props.TLM.id} {props.TLM.iframe ? '[iframe]' : ''}</u>
  </td>);

  return (<ul>
    <li className="event submenu dlheader">
      <table cols="2">
        <tbody>
          <tr>
            <td />
            {header}
          </tr>
        </tbody>
      </table>
    </li>
    <DataLayerBreak />
    <DataLayerBlock key={`page${props.page}_TLM`} keyAncestor={`page${props.page}_TLM`} data={udo} options={props.options} />
  </ul>);
};

TLM.propTypes = {
  data: React.PropTypes.object,
  TLM: React.PropTypes.object,
  options: React.PropTypes.object,
  page: React.PropTypes.number
};

const TCO = (props) => {
  let udo = collapseUDO(props.data);
  let header;
  header = (<td>
    <u>{props.TCO.id} {props.TCO.iframe ? '[iframe]' : ''}</u>
  </td>);

  return (<ul>
    <li className="event submenu dlheader">
      <table cols="2">
        <tbody>
          <tr>
            <td />
            {header}
          </tr>
        </tbody>
      </table>
    </li>
    <DataLayerBreak />
    <DataLayerBlock key={`page${props.page}_TCO`} keyAncestor={`page${props.page}_TCO`} page={props.page} data={udo} options={props.options} />
  </ul>);
};

TCO.propTypes = {
  data: React.PropTypes.object,
  TCO: React.PropTypes.object,
  options: React.PropTypes.object,
  page: React.PropTypes.number
};

class GTM extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeDatalayer: props.GTMs[0].name || 'dataLayer'
    };
  }

  changeDatalayer = (e) => {
    this.setState({ activeDatalayer: e.target.value });
  }

  render() {
    let props = this.props;

    let header;
    if (props.GTMs.length === 1) {
      header = (<td>
        <u>{props.GTMs[0].id} {props.GTMs[0].iframe ? '[iframe]' : ''}</u> <span>{props.GTMs[0].name === 'dataLayer' ? '' : `(${props.GTMs[0].name})`}</span>
      </td>);
    } else {
      header = (<td>
        <select value={this.state.activeDatalayer} onChange={this.changeDatalayer}>
          {props.GTMs.map((v, i) =>
            <option key={v.name} value={v.name}>{v.id} {v.iframe ? '[iframe]' : ''} ({v.name})</option>
          )}
        </select>
      </td>);
    }

    return (<ul>
      <li className="event submenu dlheader">
        <table cols="2">
          <tbody>
            <tr>
              <td />
              {header}
            </tr>
          </tbody>
        </table>
      </li>
      <DataLayerBreak />
      {(props.datalayers[this.state.activeDatalayer] || [])
        .slice(0)
        .reverse()
        .map((push, index, array) =>
          index !== props.datalayers[this.state.activeDatalayer].length - 1 ?
          [
            <DataLayerBlock
              key={`page${props.page}_GTM_${this.state.activeDatalayer}_${index}`}
              arrayIndex={array.length - 1 - index}
              keyAncestor={`page${props.page}_GTM_${this.state.activeDatalayer}_${index}`}
              data={push}
              options={props.options}
            />,
            <DataLayerBreak />
          ] :
          <DataLayerBlock
            key={`page${props.page}_GTM_${this.state.activeDatalayer}_${index}`}
            arrayIndex={array.length - 1 - index}
            keyAncestor={`page${props.page}_GTM_${this.state.activeDatalayer}_${index}`}
            data={push}
            options={props.options}
          />
        )
      }
    </ul>);
  }
}

GTM.propTypes = {
  datalayers: React.PropTypes.object,
  GTMs: React.PropTypes.array,
  page: React.PropTypes.number
};

const DTM = props =>
  (<ul>
    <li className="event submenu dlheader">
      <table cols="2">
        <tbody>
          <tr>
            <td />
            <td>
              {
                props.data.property ?
                (<span><u>{props.data.property}</u> {props.data.buildDate ? ` (deployed ${props.data.buildDate})` : ''}</span>)
                :
                (<span><u>DTM load rules</u> {props.data.buildDate ? ` (deployed ${props.data.buildDate})` : ''}</span>)
              }
            </td>
          </tr>
        </tbody>
      </table>
    </li>
    <DataLayerBreak />
    {
      props.data.loadRules ?
      props.data.loadRules.map((v, i) =>
        i !== props.data.loadRules.length - 1 ?
        [<DataLayerBlock key={`page${props.page}_DTM_${i}`} arrayIndex={i} keyAncestor={`page${props.page}_DTM_${i}`} data={v} options={props.options} />, <DataLayerBreak />] :
        <DataLayerBlock key={`page${props.page}_DTM_${i}`} arrayIndex={i} keyAncestor={`page${props.page}_DTM_${i}`} data={v} options={props.options} />
      )
      :
      null
    }
  </ul>);

DTM.propTypes = {
  data: React.PropTypes.object,
  options: React.PropTypes.object,
  page: React.PropTypes.number
};

class Vars extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeDatalayer: props.vars[0].name
    };
  }

  changeDatalayer = (e) => {
    this.setState({ activeDatalayer: e.target.value });
  }

  render() {
    let props = this.props;

    let header;
    if (props.vars.length === 1) {
      header = (<td>
        <u>{props.vars[0].id} {props.vars[0].iframe ? '[iframe]' : ''}</u> {props.vars[0].name}
      </td>);
    } else {
      header = (<td>
        <select value={this.state.activeDatalayer} onChange={this.changeDatalayer}>
          {props.vars.map((v, i) =>
            <option key={v.name} value={v.name}>{v.id} {v.iframe ? '[iframe]' : ''} ({v.name})</option>
          )}
        </select>
      </td>);
    }

    return (<ul>
      <li className="event submenu dlheader">
        <table cols="2">
          <tbody>
            <tr>
              <td />
              {header}
            </tr>
          </tbody>
        </table>
      </li>
      <DataLayerBreak />
      { props.varDatas && props.varDatas[this.state.activeDatalayer] &&
      (<DataLayerBlock
        key={`page${props.page}_vars_${this.state.activeDatalayer}`}
        keyAncestor={`page${props.page}_vars_${this.state.activeDatalayer}`}
        data={props.varDatas[this.state.activeDatalayer]}
        options={props.options}
      />)
      }
    </ul>);
  }
}

Vars.propTypes = {
  varDatas: React.PropTypes.object,
  vars: React.PropTypes.array,
  page: React.PropTypes.number
};

//
// Main component
//
const Datalayers = (props) => {
  let data = props.data;

  if (!(data.vars && data.vars.length && data.varDatas) &&
    !(data.GTM && data.GTM.length) &&
    !(data.dtmDatas && data.dtmDatas.loadRules && data.dtmDatas.loadRules.length > 0) &&
    !(data.dtmDatas && data.dtmDatas.property) &&
    !(data.TLM && data.TLM.id && data.utagDatas) &&
    !(data.TCO && data.TCO.id && data.tcoDatas)
    ) {
    return null;
  }

  return (
    <td className="dlt">
      {
        (data.vars && data.vars.length && data.varDatas) ?
        (<Vars
          varDatas={data.varDatas}
          vars={data.vars}
          options={props.options}
          page={props.page}
        />) :
        null
      }
      {
        (data.GTM && data.GTM.length) ?
        (<GTM
          datalayers={data.datalayers}
          GTMs={data.GTM}
          key={`GTM${props.page}`}
          options={props.options}
          page={props.page}
        />) :
        null
      }
      {
        (
          (data.dtmDatas && data.dtmDatas.loadRules && data.dtmDatas.loadRules.length > 0)
          ||
          (data.dtmDatas && data.dtmDatas.property)
        ) ?
        (<DTM
          data={data.dtmDatas}
          options={props.options}
          page={props.page}
        />) :
        null
      }
      {
        (data.TLM && data.TLM.id && data.utagDatas) ?
        (<TLM
          data={data.utagDatas}
          TLM={data.TLM}
          options={props.options}
          page={props.page}
        />) :
        null
      }
      {
        (data.TCO && data.TCO.id && data.tcoDatas) ?
        (<TCO
          data={data.tcoDatas}
          TCO={data.TCO}
          options={props.options}
          page={props.page}
        />) :
        null
      }
    </td>
  );
};

Datalayers.propTypes = {
  data: React.PropTypes.object,
  options: React.PropTypes.object,
  page: React.PropTypes.number
};

export default Datalayers;
