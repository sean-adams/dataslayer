import React, { Component } from 'react';

class Search extends Component {
  state = {
    showModal: false,
    fileModal: false,
    errorMessage: ''
  }
  
  showFileModal = () => {
    this.setState({ fileModal: true, errorMessage: '' });
  }
  
  render() {
    let { onChange, value, toggleSearch } = this.props;
    
    return (<div style={{
        textAlign: 'center'
      }}>
        <input
          type="text"
          style={{
            fontFamily: 'Open Sans'
          }}
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
          value={value}
          onChange={onChange}
          onKeyDown={(e) => e.ctrlKey && e.altKey && e.key === 'f' && toggleSearch()}
          autoFocus
          placeholder={"Search (case insensitive)"}
        />
      </div>);
  }
}

Search.propTypes = {
  value: React.PropTypes.string,
  onChange: React.PropTypes.func,
  toggleSearch: React.PropTypes.func,
};

Search.defaultProps = {
  value: '',
  onChange: () => null,
  toggleSearch: () => null,
};

export default Search;
