import React, { Component } from 'react';
import PropTypes from 'prop-types'

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

const SubHeader = (props) =>
  (<li className="event eventbreak submenu dlheader">
    <table cols="2">
      <tbody>
        <tr>
          <td />
          {
            props.headerComponent ||
            (<td>
              {
                (<span><u>{props.mainText}</u> {props.subText}</span>)
              }
            </td>)
          }
        </tr>
      </tbody>
    </table>
  </li>);

const DataLayerLines = (props) => {
  let data = props.data;
  let depth = props.depth;
  let isObject = typeof data === 'object' && data != null;
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
    let isObject = typeof data === 'object' && data != null;
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
            <span onClick={this.props.onClick}>{rowData}</span>
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
  depth: PropTypes.number,
  data: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
  collapseNested: PropTypes.bool,
  spaces: PropTypes.string,
  index: PropTypes.string,
  hideEmpty: PropTypes.bool,
  keyAncestor: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  eventToggleable: PropTypes.bool,
  onClick: PropTypes.func,
};

DataLayerEntry.defaultProps = {
  onClick: () => null,
};

class DataLayerBlock extends Component {
  state = {
    collapsed: this.props.options.collapseGTMNativeEvents &&
      Object.keys(this.props.data).indexOf('event') > -1 &&
      /^gtm\.(click|dom|js|load|linkClick|formSubmit|historyChange|pageError|timer|scrollDepth|video)$/.test(this.props.data.event)
  }

  render = () => {
    const {
      data,
      searchQuery,
      keyAncestor,
      options,
      arrayIndex,
      hasSibling,
      hideKeys
    } = this.props;

    if (searchQuery && searchQuery.length && searchQuery.length > 0) {
      if (JSON.stringify(data).replace(/[{}"]/ig, '').toLowerCase().indexOf(searchQuery) === -1) {
        return (<div/>);
      }
    }
    
    return (<li className={`event ${hasSibling ? 'eventbreak ' : ' '}submenu datalayer`}>
      {options.showArrayIndices && arrayIndex > -1 && (<span className="arrayIndex">{arrayIndex}</span>)}
      <table cols="2">
        {
          Object.keys(data).map((v, i) => {
            if (hideKeys && (hideKeys.indexOf(v) > -1)) {
              return null;
            } else if (v === 'event') {
              return (<DataLayerEntry
                key={`${keyAncestor}_${v}`}
                keyAncestor={`${keyAncestor}_${v}`}
                index={v}
                data={data[v]}
                depth={0}
                hideEmpty={options.hideEmpty}
                collapseNested={options.collapseNested}
                onClick={() => { this.setState({ collapsed: !this.state.collapsed }); }}
              />);
            } else if (!this.state.collapsed) {
              return (<DataLayerEntry
                key={`${keyAncestor}_${v}`}
                keyAncestor={`${keyAncestor}_${v}`}
                index={v}
                data={data[v]}
                depth={0}
                hideEmpty={options.hideEmpty}
                collapseNested={options.collapseNested}
              />);
            } else {
              return null;
            }
          })
        }
      </table>
    </li>);
  }

}

DataLayerBlock.propTypes = {
  data: PropTypes.object,
  options: PropTypes.object,
  keyAncestor: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  arrayIndex: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  searchQuery: PropTypes.string,
  hasSibling: PropTypes.bool,
  hideKeys: PropTypes.array,
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
    <SubHeader headerComponent={header} />
    <DataLayerBlock
      key={`page${props.page}_TLM`}
      keyAncestor={`page${props.page}_TLM`}
      data={udo}
      options={props.options}
      searchQuery={props.searchQuery}
    />
  </ul>);
};

TLM.propTypes = {
  data: PropTypes.object,
  TLM: PropTypes.object,
  options: PropTypes.object,
  page: PropTypes.number,
  searchQuery: PropTypes.string,
};

const TCO = (props) => {
  let udo = collapseUDO(props.data);
  let header;
  header = (<td>
    <u>{props.TCO.id} {props.TCO.iframe ? '[iframe]' : ''}</u>
  </td>);

  return (<ul>
    <SubHeader headerComponent={header} />
    <DataLayerBlock
      key={`page${props.page}_TCO`}
      keyAncestor={`page${props.page}_TCO`}
      page={props.page}
      data={udo}
      options={props.options}
      searchQuery={props.searchQuery}
    />
  </ul>);
};

TCO.propTypes = {
  data: PropTypes.object,
  TCO: PropTypes.object,
  options: PropTypes.object,
  page: PropTypes.number,
  searchQuery: PropTypes.string,
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
      <SubHeader headerComponent={header} />
      {(props.datalayers[this.state.activeDatalayer] || [])
        .slice(0)
        .reverse()
        .map((push, index, array) =>
          <DataLayerBlock
            key={`page${props.page}_GTM_${this.state.activeDatalayer}_${index}`}
            arrayIndex={array.length - 1 - index}
            keyAncestor={`page${props.page}_GTM_${this.state.activeDatalayer}_${index}`}
            data={push}
            options={props.options}
            searchQuery={props.searchQuery}
            hasSibling={index !== props.datalayers[this.state.activeDatalayer].length - 1}
          />
        )
      }
    </ul>);
  }
}

GTM.propTypes = {
  datalayers: PropTypes.object,
  GTMs: PropTypes.array,
  page: PropTypes.number,
  searchQuery: PropTypes.string,
};

const DTM = props =>
  (<ul>
    {
      props.data.property ?
        <SubHeader mainText={props.data.property} subText={props.data.buildDate ? ` (deployed ${props.data.buildDate})` : ''}/>
        :
        <SubHeader mainText="DTM load rules" subText={props.data.buildDate ? ` (deployed ${props.data.buildDate})` : ''}/>
    }
    {
      props.data.loadRules ?
        props.data.loadRules.map((v, i) =>
          <DataLayerBlock
            key={`page${props.page}_DTM_${i}`}
            arrayIndex={i}
            keyAncestor={`page${props.page}_DTM_${i}`}
            data={v}
            options={props.options}
            searchQuery={props.searchQuery}
            hasSibling={i !== props.data.loadRules.length - 1}
          />
        )
        :
        null
    }
    {
      props.data.rules ?
        [
          <SubHeader mainText="Fired rules" subText="" />,
          props.data.rules.slice(0).reverse().map((v, i) =>
            <DataLayerBlock
              key={`page${props.page}_DTM_${i}`}
              arrayIndex={i}
              keyAncestor={`page${props.page}_DTM_${i}`}
              data={v}
              options={props.options}
              searchQuery={props.searchQuery}
              hasSibling={i !== props.data.rules.length - 1}
              hideKeys={['id']}
            />
          ),
        ]
        :
        null
    }
    {
      props.data.elements ?
        [
          <SubHeader mainText="Data elements" subText="" />,
          <DataLayerBlock
            key={`page${props.page}_DTM_${0}_elements`}
            arrayIndex={0}
            keyAncestor={`page${props.page}_DTM_${0}_elements`}
            data={props.data.elements}
            options={props.options}
            searchQuery={props.searchQuery}
          />,
        ]
        :
        null
    }
  </ul>);

DTM.propTypes = {
  data: PropTypes.object,
  options: PropTypes.object,
  page: PropTypes.number,
  searchQuery: PropTypes.string,
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
      <SubHeader headerComponent={header} />
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
  varDatas: PropTypes.object,
  vars: PropTypes.array,
  page: PropTypes.number,
  searchQuery: PropTypes.string,
};

//
// Main component
//
const Datalayers = (props) => {
  let { data, options, page, searchQuery } = props;

  if (!(data.vars && data.vars.length && data.varDatas) &&
    !(data.GTM && data.GTM.length) &&
    !(data.dtmDatas && data.dtmDatas.loadRules && data.dtmDatas.loadRules.length > 0) &&
    !(data.dtmDatas && data.dtmDatas.property) &&
    !(data.TLM && data.TLM.id && data.utagDatas) &&
    !(data.TCO && data.TCO.id && data.tcoDatas)
    ) {
    return null;
  }

  if (searchQuery && searchQuery.length && searchQuery.length > 0) {
    if (JSON.stringify(data).replace(/[{}"]/ig, '').toLowerCase().indexOf(searchQuery) === -1) {
      return (<td />);
    }
  }

  return (
    <td className="dlt">
      {
        (data.vars && data.vars.length && data.varDatas) ?
        (<Vars
          varDatas={data.varDatas}
          vars={data.vars}
          options={options}
          page={page}
          searchQuery={searchQuery}
        />) :
        null
      }
      {
        (data.GTM && data.GTM.length) ?
        (<GTM
          datalayers={data.datalayers}
          GTMs={data.GTM}
          key={`GTM${page}`}
          options={options}
          page={page}
          searchQuery={searchQuery}
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
          options={options}
          page={page}
          searchQuery={searchQuery}
        />) :
        null
      }
      {
        (data.TLM && data.TLM.id && data.utagDatas) ?
        (<TLM
          data={data.utagDatas}
          TLM={data.TLM}
          options={options}
          page={page}
          searchQuery={searchQuery}
        />) :
        null
      }
      {
        (data.TCO && data.TCO.id && data.tcoDatas) ?
        (<TCO
          data={data.tcoDatas}
          TCO={data.TCO}
          options={options}
          page={page}
          searchQuery={searchQuery}
        />) :
        null
      }
    </td>
  );
};

Datalayers.propTypes = {
  data: PropTypes.object,
  options: PropTypes.object,
  page: PropTypes.number,
  searchQuery: PropTypes.string,
};

export default Datalayers;
