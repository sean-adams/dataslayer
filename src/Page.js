import React, { Component } from 'react';
import Datalayers from './Datalayers';
import Tags from './Tags';

const PageHeader = props =>
  (<ul>
    <li className={`newpage ${props.className}`}>
      <a
        className={`newpage ${props.isCurrent ? 'currentpage' : ''}`}
        onClick={props.onClick}
      >
        { props.url }
        <span style={{
          float: 'right',
          fontWeight: 'lighter',
          marginRight: '72px'
        }}>
        { props.timestamp && props.timestamp.toLocaleTimeString() }
        </span>
      </a>
    </li>
  </ul>);

PageHeader.propTypes = {
  url: React.PropTypes.string,
  onClick: React.PropTypes.func,
  className: React.PropTypes.string,
  isCurrent: React.PropTypes.bool,
  timestamp: React.PropTypes.object,
};

PageHeader.defaultProps = {
  url: '',
  onClick: () => null,
  className: '',
  isCurrent: false
};

class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: this.props.isCurrent,
      touched: false
    };
  }

  toggleExpanded = () => {
    if (!this.state.touched && !this.props.isCurrent) {
      this.setState({
        expanded: true,
        touched: true
      });
    } else {
      this.setState({
        expanded: !this.state.expanded,
        touched: true
      });
    }
  }

  render() {
    let data = this.props.data;

    let containsDTM = !!data.dtmDatas && (Object.getOwnPropertyNames(data.dtmDatas).length > 0);
    let containsGTM = data.GTM && data.GTM.length > 0;
    let containsTLM = data.TLM && data.utagDatas && data.TLM.id;
    let containsTCO = data.TCO && data.tcoDatas && data.TCO.id;

    let containsTags = this.props.data.tags && this.props.data.tags.length > 0 ? 'containsTAG' : '';
    let containsData = containsDTM || containsGTM || containsTLM || containsTCO ? 'containsGTM' : '';

    let headerClass = '';
    if (this.props.options.showGTMLoad) {
      if (containsGTM && !containsDTM && !containsTLM) {
        headerClass = 'hasGTM';
      } else if (containsDTM && !containsGTM && !containsTLM && !containsTCO) {
        headerClass = 'hasDTM';
      } else if (containsTLM && !containsGTM && !containsDTM && !containsTCO) {
        headerClass = 'hasTLM';
      } else if (containsTCO && !containsGTM && !containsDTM && !containsTLM) {
        headerClass = 'hasTCO';
      } else if (containsDTM || containsGTM || containsTLM || containsTCO) {
        headerClass = 'hasMULTI';
      } else if (this.props.isCurrent && this.props.loading) {
        headerClass = 'seeking';
      } else {
        headerClass = 'noGTM';
      }
    }

    let expanded = this.state.touched ? this.state.expanded : this.props.isCurrent;

    return (
      <div id={`sub${this.props.index}`} className={`pure-menu pure-menu-open ${containsTags} ${containsData}`}>
        <PageHeader
          url={this.props.url}
          onClick={this.toggleExpanded}
          isCurrent={this.props.isCurrent}
          className={headerClass}
          timestamp={this.props.options.showTimestamps ? this.props.timestamp : null}
        />
        <table cols="2" width="100%" style={{ borderCollapse: 'unset' }}>
          <tbody className={expanded || this.props.searchMode ? '' : 'hidden'}>
            <tr>
              <Datalayers
                data={this.props.data}
                options={this.props.options}
                page={this.props.index}
                searchQuery={this.props.searchQuery}
              />
              <Tags
                data={this.props.data.tags}
                options={this.props.options}
                page={this.props.index}
                searchQuery={this.props.searchQuery}
              />
              {this.props.children}
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

Page.propTypes = {
  url: React.PropTypes.string,
  data: React.PropTypes.object,
  index: React.PropTypes.number,
  isCurrent: React.PropTypes.bool,
  loading: React.PropTypes.bool,
  options: React.PropTypes.object,
  children: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node),
    React.PropTypes.node
  ]),
  timestamp: React.PropTypes.object,
  searchQuery: React.PropTypes.string,
  searchMode: React.PropTypes.bool,
};

Page.defaultProps = {
  url: '',
  data: {},
  index: 0,
  isCurrent: false,
  loading: false,
  options: {},
  children: [],
  searchQuery: '',
  searchMode: false
};

export default Page;
