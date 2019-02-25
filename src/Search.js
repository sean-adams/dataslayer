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
          value={value}
          onChange={onChange}
          onKeyUp={({ key }) => key === 'Escape' && toggleSearch()}
          autoFocus
          placeholder={"Search (press Escape to exit)"}
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
