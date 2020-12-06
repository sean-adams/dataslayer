/* global chrome */
import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { optionMap } from './optionMap';
import { isChrome, isFirefox } from './helpers';

class Options extends Component {
  constructor(props) {
    super(props);
    let version = '1.4.0';
    if (typeof chrome !== 'undefined' && typeof chrome.runtime !== 'undefined' && typeof chrome.runtime.getManifest !== 'undefined') {
      version = chrome.runtime.getManifest().version;
    }
    this.state = {
      version
    };
  }

  optionUpdater = (type, name) => {
    return (e) => {
      if (type === 'checkbox') {
        this.props.setOption(name, e.target.checked);
      } else if (type === 'input') {
        console.log(e);
        this.props.setOption(name, e.target.value);
      }
    }
  }

  render() {
    const platformName = isChrome() ? 'Chrome' : 'Firefox';
    const versionHistory = [
      {
        version: '1.4',
        changes: [
        'initial GA App + Web support',
        'bugfixes',
        ]
      },
      {
        version: '1.3',
        changes: [
        'Adobe product string improvements',
        'array improvements',
        'bugfixes',
        ]
      },
      {
        version: '1.2',
        changes: [
        'three-column view for GTM & Launch',
        'improvements to dark mode',
        'fixes for object watching',
        ]
      },
      {
        version: '1.1',
        changes: [
        'initial support for Adobe Launch',
        'toggle friendly param names',
        'toggle param URL decoding',
        ]
      },
      {
        version: '1.0',
        changes: [
        'rewritten UI',
        'import/export functionality',
        'auto collapse gtm.*',
        'fix displayed GTM IDs',
        'misc. bug fixes'
        ]
      }
    ];

    return (
      <div id={`sub${this.props.index}`} className={`pure-menu pure-menu-open`}>
        <ul>
          <li className="newpage options">
            <a className="newpage currentpage options">dataslayer Options</a>
            <a style={{ float:'right', position: 'absolute', top:'0px', right: '0px' }} className="newpage currentpage options" id="version">
              {this.state.version}
            </a>
          </li>
        </ul>
        <table cols="2" width="100%">
        <tbody>
          <tr>
            <td className="dlt" style={{ borderRightWidth: '1px', borderRightStyle: 'dashed', borderRightColor: 'rgb(112, 111, 111)' }}>
              <ul>
              <li className="event submenu">
                {
                  Object.keys(optionMap).map((section) =>
                    (<form className="pure-form pure-form-stacked" key={section}>
                      <table cols="2">
                        <tbody>
                          <tr>
                            <td/>
                            <td>
                              <br/>
                              <u>{section}</u>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      {
                        optionMap[section].map((option) => {
                          if (option.platform) {
                            if (option.platform === 'chrome' && !isChrome()) {
                              return null;
                            } else if (option.platform === 'firefox' && !isFirefox()) {
                              return null;
                            }
                          }
                          return (<table cols="2" key={option.name}>
                            <tbody>
                              <tr>
                                <td />
                                {
                                  option.type === 'checkbox' &&
                                  (<td>
                                    <label htmlFor={option.name} className="pure-checkbox">
                                      <input
                                        id={option.name}
                                        disabled={option.dependsOn && this.props.options[option.dependsOn] !== option.dependsOnValue}
                                        type="checkbox"
                                        checked={this.props.options[option.name]}
                                        onChange={this.optionUpdater('checkbox', option.name)}
                                      />
                                      {option.description}
                                    </label>
                                  </td>)
                                }
                                {
                                  option.type === 'input' &&
                                  (<td>
                                    <br />
                                    {option.description}
                                    <br />
                                    <input
                                      disabled={option.dependsOn && this.props.options[option.dependsOn] !== option.dependsOnValue}
                                      placeholder={option.placeholder}
                                      defaultValue={(this.props.options[option.name] || []).join(';')}
                                      onChange={this.optionUpdater('input', option.name)}
                                    />
                                    <br />
                                  </td>)
                                }
                                {
                                  option.type === 'number' &&
                                  (<td>
                                    <br />
                                    {option.description}
                                    <br />
                                    <input
                                      disabled={option.dependsOn && this.props.options[option.dependsOn] !== option.dependsOnValue}
                                      placeholder={option.placeholder}
                                      type="number"
                                      defaultValue={this.props.options[option.name]}
                                      onChange={this.optionUpdater('input', option.name)}
                                      max={option.max}
                                      min={option.min}
                                    />
                                    <br />
                                  </td>)
                                }
                              </tr>
                            </tbody>
                          </table>);
                        })
                      }
                    </form>)
                  )
                }
              </li>
              </ul>
            </td>
            <td className="utm" style={{ borderLeftWidth: '1px', borderLeftStyle: 'dashed', borderLeftColor: 'rgb(112, 111, 111)' }}>
              <ul>
                <li className="event submenu">
                  <table cols="2">
                    <tbody>
                      <tr>
                        <td/><td><br /></td>
                      </tr>
                      <tr>
                        <td><span><u>About</u></span></td>
                      </tr>
                      <tr>
                        <td/><td/>
                      </tr>
                      <tr>
                        <td><b>by</b></td>
                        <td><span><a href={`https://bearcla.ws?utm_source=dataslayer-options&utm_medium=extension&utm_campaign=${platformName}`} rel="noopener noreferrer" target="_blank">Sean Adams</a></span></td>
                      </tr>
                      <tr>
                        <td></td>
                        <td><span><a href="https://github.com/sean-adams/dataslayer/graphs/contributors" rel="noopener noreferrer" target="_blank">contributors</a></span></td>
                      </tr>
                      <tr>
                        <td/>
                        <td>
                          <br/>
                        </td>
                      </tr>
                      <tr>
                        <td>documentation</td>
                        <td><span><a href={`https://dataslayer.org/documentation/?utm_source=dataslayer-options&utm_medium=extension&utm_campaign=${platformName}`} rel="noopener noreferrer" target="_blank">dataslayer.org/documentation</a></span></td>
                      </tr>
                      <tr>
                        <td/>
                        <td>
                          <br/>
                        </td>
                      </tr>
                      <tr>
                        <td>open source</td>
                        <td><span><a href="http://github.com/sean-adams/dataslayer" rel="noopener noreferrer" target="_blank">GitHub</a></span></td>
                      </tr>
                      <tr>
                        <td/>
                        <td>
                          <br/>
                        </td>
                      </tr>
                      <tr>
                        <td>report bug / request feature</td>
                        <td><span><a href="http://github.com/sean-adams/dataslayer/issues/new" rel="noopener noreferrer" target="_blank">GitHub issues</a> (preferred)</span></td>
                      </tr>
                      <tr>
                        <td/>
                        <td><span><a href="mailto:dataslayer@bearcla.ws?subject=dataslayer+bug" rel="noopener noreferrer" target="_blank">email</a></span></td>
                      </tr>
                      <tr>
                        <td/>
                        <td>
                          <br/>
                        </td>
                      </tr>
                      <tr>
                        <td>leave a review</td>
                        <td>
                          <span>
                            <a href="https://chrome.google.com/webstore/detail/dataslayer/ikbablmmjldhamhcldjjigniffkkjgpo/reviews" rel="noopener noreferrer" target="_blank">Chrome Web Store</a>
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td/>
                        <td><br/></td>
                      </tr>
                      <tr>
                        <td/>
                        <td/>
                      </tr>
                      <tr>
                        <td>links</td>
                        <td><span><a href={`https://dataslayer.org/?utm_source=dataslayer-options&utm_medium=extension&utm_campaign=${platformName}`} rel="noopener noreferrer" target="_blank">dataslayer.org</a></span></td>
                      </tr>
                      <tr>
                        <td/>
                        <td>
                          <span>
                            <a href="http://chrome.google.com/webstore/detail/dataslayer/ikbablmmjldhamhcldjjigniffkkjgpo" rel="noopener noreferrer" target="_blank">Chrome Web Store</a>
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td/>
                        <td>
                          <span>
                            <a href={`https://dataslayer.org/release-notes/?utm_source=dataslayer-options&utm_medium=extension&utm_campaign=${platformName}`} rel="noopener noreferrer" target="_blank">release notes</a>
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td/><td><br/></td>
                      </tr>
                      <tr>
                        <td>made with</td>
                        <td><span><a href="https://facebook.github.io/react/" rel="noopener noreferrer" target="_blank">React</a></span></td>
                      </tr>
                      <tr>
                        <td/>
                        <td><span><a href="http://purecss.io" rel="noopener noreferrer" target="_blank">Pure</a></span></td>
                      </tr>
                      <tr>
                        <td/>
                        <td><span><a href="http://github.com/google/data-layer-helper" rel="noopener noreferrer" target="_blank">data-layer-helper</a></span></td>
                      </tr>
                      <tr>
                        <td/>
                        <td>
                          <span>
                            <a href="http://www.google.com/fonts/specimen/Open+Sans" rel="noopener noreferrer" target="_blank">
                            Open Sans
                            </a>
                            <a href="http://www.apache.org/licenses/LICENSE-2.0.html" rel="noopener noreferrer" target="_blank">
                            (license)
                            </a>
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td></td>
                        <td>
                          <span>
                            <a href="https://github.com/feathericons/react-feather" rel="noopener noreferrer" target="_blank">react-feather</a>
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </li>

                <li className="eventbreak"></li>
                  <li className="event submenu">
                    <table cols="2">
                      <tbody>
                        <tr>
                          <td><br/><span><u>What's New</u></span></td>
                        </tr>
                        <tr>
                          <td/>
                          <td/>
                        </tr>
                        <tr>
                          <td/>
                          <td>
                            <i>x.x.* are bug fix releases</i>
                          </td>
                        </tr>
                        {
                          versionHistory.map(({ version, changes }) => 
                            (<tr key={version}>
                              <td><b>{version}</b></td>
                              <td>
                                {changes.map((note, i) => (<span key={`${note}i`}>{note}<br/></span>))}
                              </td>
                            </tr>)  
                          )
                        }
                        <tr>
                          <td/>
                          <td/>
                        </tr>
                      </tbody>
                    </table>
                  </li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    );
  }
}

Options.propTypes = {
  options: PropTypes.object,
  setOption: PropTypes.func,
};

export default Options;
