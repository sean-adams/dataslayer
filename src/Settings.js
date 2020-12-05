import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { isChrome, timestamp } from './helpers';
import { HelpCircle, Save, Search, Settings as SettingsIcon, XCircle } from 'react-feather';


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
    let { options, loading, port, ...download } = this.props.appState;

    let downloadFile = encodeURIComponent(JSON.stringify(download));

    const platformName = isChrome() ? 'Chrome' : 'Firefox';

    return (
      <div>
        <button
          className="actionBar settings"
          title="Options"
          onClick={this.props.onSettingsClick}
        >
          <SettingsIcon
            alt="Options"
          />
        </button>
        <button
          className="actionBar clearbtn"
          title="Clear History"
          onClick={this.showClearHistoryModal}
        >
          <XCircle
            alt="Clear History"
          />
        </button>
        <button
          className="actionBar filebtn"
          title="Import / Export"
          onClick={this.showFileModal}
        >
          <Save
            alt="Import / Export"
          />
        </button>
        <button
          className="actionBar searchbtn"
          title="Toggle Search (Ctrl+Alt+F)"
          onClick={this.props.onSearchClick}
        >
          <Search
            alt="Toggle Search (Ctrl+Alt+F)"
          />
        </button>
        <a
          className="actionBar helpbtn"
          title="Documentation"
          href={`https://dataslayer.org/documentation/?utm_medium=extension&utm_source=dataslayer-sidebar&utm_campaign=${platformName}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <HelpCircle
            alt="Documentation"
          />
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
              <button className="pure-button" onClick={this.clearHistory} >Yes</button>
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
                    download={`dataslayer-export-${timestamp()}.json`}
                    href={`data:text;charset=utf-8,${downloadFile}`}
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
