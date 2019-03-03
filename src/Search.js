import React, { Component } from 'react';
import PropTypes from 'prop-types'

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
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
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
  value: PropTypes.string,
  onChange: PropTypes.func,
  toggleSearch: PropTypes.func,
};

Search.defaultProps = {
  value: '',
  onChange: () => null,
  toggleSearch: () => null,
};

export default Search;
