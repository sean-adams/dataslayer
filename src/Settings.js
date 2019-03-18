import React, { Component } from 'react';
import PropTypes from 'prop-types'

class Settings extends Component {
  state = {
    showModal: false,
    fileModal: false,
    errorMessage: ''
  }

  showFileModal = () => {
    this.setState({ fileModal: true, errorMessage: '' });
  }

  hideFileModal = () => {
    this.setState({ fileModal: false, errorMessage: '' });
  }

  hideClearHistoryModal = () => {
    this.setState({ showModal: false });
  }

  showClearHistoryModal = () => {
    this.setState({ showModal: true });
  }

  clearHistory = () => {
    this.props.clearHistory();
    this.hideClearHistoryModal();
  }

  importFile = (e) => {
    this.props.handleFile(e, (success) => {
      if (success.success) {
        this.hideFileModal();
      } else if (success.message) {
        this.setState({ errorMessage: success.message });
      }
    });
  }

  render() {
    let { options, loading, port, debug, ...download } = this.props.appState;

    return (
      <div>
        <button
          className="settings"
          title="Options"
          onClick={this.props.onSettingsClick}
        >
          <img alt="options" src="/img/settings.png" />
        </button>
        <button
          className="clearbtn"
          title="Clear History"
          onClick={this.showClearHistoryModal}
        >
          <img alt="clear" src="/img/clearbtn.png" />
        </button>
        <button
          className="filebtn"
          title="Import / Export"
          onClick={this.showFileModal}
        >
          <img alt="import/export" src="/img/save.png" />
        </button>
        <button
          className="searchbtn"
          title="Toggle Search (Ctrl+Alt+F)"
          onClick={this.props.onSearchClick}
        >
          <img alt="search" src="/img/search.png" />
        </button>
        <a
          className="helpbtn"
          title="Documentation"
          href="https://dataslayer.org/documentation/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img alt="documentation" src="/img/help.png" />
        </a>
        {this.state.showModal && (
          <div>
            <div
              id="lean_overlay"
              style={{
                display: 'block',
                opacity: '0.5'
              }}
              onClick={this.hideClearHistoryModal}
            />
            <div
              id="clearconfirm"
              style={{
                display: 'block',
                position: 'fixed',
                opacity: '1',
                zIndex: '11000',
                left: '0',
                right: '0',
                margin: '0 auto',
                top: '25px'
              }}
            >
              <p>Clear history?</p>
              <a id="clearbtnyes" className="pure-button" onClick={this.clearHistory} >Yes</a>
            </div>
          </div>
        )}
        {this.state.fileModal && (
          <div>
            <div
              id="lean_overlay"
              style={{
                display: 'block',
                opacity: '0.5'
              }}
              onClick={this.hideFileModal}
            />
            <div
              id="clearconfirm"
              style={{
                display: 'block',
                position: 'fixed',
                opacity: '1',
                zIndex: '11000',
                left: '0',
                right: '0',
                margin: '0 auto',
                top: '25px'
              }}
            >
              <h1>Import/Export</h1>
              <div style={{ width: '100%' }}>
                <div style={{ width: '50%', float: 'left' }}>
                  <label htmlFor="importFile" className="pure-button">
                    <input
                      type="file"
                      accept=".json"
                      id="importFile"
                      onChange={this.importFile}
                      style={{ display: 'none' }}
                    />
                    Import
                  </label>
                  {this.state.errorMessage && (<div>{this.state.errorMessage}</div>)}
                </div>
                <div style={{ width: '50%', float: 'left' }}>
                  <a
                    className="pure-button"
                    download="dataslayer-export.json"
                    href={`data:text;charset=utf-8,${JSON.stringify(download)}`}
                  >Export</a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

Settings.propTypes = {
  clearHistory: PropTypes.func,
  appState: PropTypes.object,
  handleFile: PropTypes.func,
  onSettingsClick: PropTypes.func,
  onSearchClick: PropTypes.func,
};

Settings.defaultProps = {
  clearHistory: () => null,
  onSettingsClick: () => null,
  appState: {},
  handleFile: e => null,
  onSearchClick: e => null,
};

export default Settings;
