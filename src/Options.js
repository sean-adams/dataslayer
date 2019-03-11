/* global chrome */
import React, { Component } from 'react';
import PropTypes from 'prop-types'

class Options extends Component {
  constructor(props) {
    super(props);
    let version = '1.1.0';
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
    const optionMap = {
      General: [
        { name: 'showGTMLoad', description: 'show data layer presence', type: 'checkbox' },
        { name: 'collapseNested', description: 'auto-collapse nested data layer variables', type: 'checkbox' },
        { name: 'collapseGTMNativeEvents', description: 'auto-collapse gtm.* events', type: 'checkbox' },
        { name: 'hideEmpty', description: 'hide empty data layer variables', type: 'checkbox' },
        { name: 'showArrayIndices', description: 'show array indices', type: 'checkbox' },
        { name: 'showTimestamps', description: 'show navigation timestamps', type: 'checkbox' },
        { name: 'showFriendlyNames', description: 'show friendly names for query parameters where available', type: 'checkbox' },
        { name: 'blockTags', description: 'block tags from firing (experimental, requires Chrome dev/beta channel)', type: 'checkbox' },  
      ],
      Tags: [
        { name: 'showUniversal', description: 'show Universal Analytics tags', type: 'checkbox' },
        { name: 'showClassic', description: 'show GA Classic tags', type: 'checkbox' },
        { name: 'showFloodlight', description: 'show Floodlight tags', type: 'checkbox' },
        { name: 'showSitecatalyst', description: 'show Adobe Analytics tags', type: 'checkbox' },
        { name: 'ignoredTags', description: <span><u>Ignored IDs</u> (separated by semicolons)</span>, type: 'input', placeholder: 'UA-XXX-Y;UA-AAA-B' },
        { name: 'dataLayers', description: <span><u>Additional data layer objects</u> (separated by semicolons)</span>, type: 'input', placeholder: 'digitalData;testDataLayer' },
      ]
    };

    const versionHistory = [
      {
        version: '1.1',
        changes: [
        'initial support for Adobe Launch'
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
                        optionMap[section].map((option) => 
                        (<table cols="2" key={option.name}>
                          <tbody>
                            <tr>
                              <td/>
                                {
                                  option.type === 'checkbox' &&
                                  (<td>
                                    <label htmlFor={option.name} className="pure-checkbox">
                                      <input
                                        id={option.name}
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
                                    <br/>
                                    {option.description}
                                    <br/>
                                    <input
                                      placeholder={option.placeholder}
                                      defaultValue={(this.props.options[option.name] || []).join(';')}
                                      onChange={this.optionUpdater('input', option.name)}
                                    />
                                    <br/>
                                  </td>)
                                }
                            </tr>
                          </tbody>
                        </table>)
                        )
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
                        <td><span><a href="http://bearcla.ws" rel="noopener noreferrer" target="_blank">Sean Adams</a></span></td>
                      </tr>
                      <tr>
                        <td/><td/>
                      </tr>
                      <tr>
                        <td>using</td>
                        <td><span><a href="https://facebook.github.io/react/" rel="noopener noreferrer" target="_blank">React</a></span></td>
                      </tr>
                      <tr>
                        <td/>
                        <td><span><a href="http://purecss.io" rel="noopener noreferrer" target="_blank">Pure</a></span></td>
                      </tr>
                      <tr>
                        <td/>
                        <td><span><a href="http://jquery.com/" rel="noopener noreferrer" target="_blank">jQuery</a></span></td>
                      </tr>
                      <tr>
                        <td/>
                        <td><span><a href="http://github.com/google/data-layer-helper" rel="noopener noreferrer" target="_blank">data-layer-helper</a></span></td>
                      </tr>
                      <tr>
                        <td/>
                        <td><span><a href="http://leanmodal.finelysliced.com.au/" rel="noopener noreferrer" target="_blank">leanModal</a></span></td>
                      </tr>
                      <tr>
                        <td/>
                        <td><span><a href="https://github.com/MaxArt2501/object-observe" rel="noopener noreferrer" target="_blank">O.o polyfill by MaxArt2501</a></span></td>
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
                        <td>icons made by</td>
                        <td>
                          <span>
                            <a href="http://www.flaticon.com/authors/madebyoliver" rel="noopener noreferrer" target="_blank">Madebyoliver</a>
                            from <a href="http://www.flaticon.com" rel="noopener noreferrer" target="_blank">www.flaticon.com</a>
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td/>
                        <td/>
                      </tr>
                      <tr>
                        <td>contribute</td>
                        <td><span><a href="http://github.com/sean-adams/dataslayer" rel="noopener noreferrer" target="_blank">GitHub</a></span></td>
                      </tr>
                      <tr>
                        <td/>
                        <td/>
                      </tr>
                      <tr>
                        <td>report issue</td>
                        <td><span><a href="http://github.com/sean-adams/dataslayer/issues/new" rel="noopener noreferrer" target="_blank">GitHub</a> (preferred)</span></td>
                      </tr>
                      <tr>
                        <td/>
                        <td><span><a href="mailto:dataslayer@bearcla.ws?subject=dataslayer+bug" rel="noopener noreferrer" target="_blank">email</a></span></td>
                      </tr>
                      <tr>
                        <td/>
                        <td/>
                      </tr>
                      <tr>
                        <td>share</td>
                        <td><span><a href="http://dataslayer.org" rel="noopener noreferrer" target="_blank">dataslayer.org</a></span></td>
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
                            (<tr>
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
