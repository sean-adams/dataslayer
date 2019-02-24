/* global chrome */
import React, { Component } from 'react';

class Options extends Component {
  constructor(props) {
    super(props);
    let version = '1.0.0';
    if (typeof chrome !== 'undefined' && typeof chrome.runtime !== 'undefined') {
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
        { name: 'hideEmpty', description: 'hide empty data layer variables', type: 'checkbox' },
        { name: 'showArrayIndices', description: 'show array indices', type: 'checkbox' },
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
                    (<form className="pure-form pure-form-stacked">
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
                        (<table cols="2">
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
                        <td><span><a href="http://bearcla.ws" target="_blank">Sean Adams</a></span></td>
                      </tr>
                      <tr>
                        <td/><td/>
                      </tr>
                      <tr>
                        <td>using</td>
                        <td><span><a href="http://jquery.com/" target="_blank">jQuery</a></span></td>
                      </tr>
                      <tr>
                        <td/>
                        <td><span><a href="http://purecss.io" target="_blank">Pure</a></span></td>
                      </tr>
                      <tr>
                        <td/>
                        <td><span><a href="https://facebook.github.io/react/" target="_blank">React</a></span></td>
                      </tr>
                      <tr>
                        <td/>
                        <td><span><a href="http://github.com/google/data-layer-helper" target="_blank">data-layer-helper</a></span></td>
                      </tr>
                      <tr>
                        <td/>
                        <td><span><a href="http://leanmodal.finelysliced.com.au/" target="_blank">leanModal</a></span></td>
                      </tr>
                      <tr>
                        <td/>
                        <td><span><a href="https://github.com/MaxArt2501/object-observe" target="_blank">O.o polyfill by MaxArt2501</a></span></td>
                      </tr>
                      <tr>
                        <td/>
                        <td>
                          <span>
                            <a href="http://www.google.com/fonts/specimen/Open+Sans" target="_blank">
                            Open Sans
                            </a>
                            <a href="http://www.apache.org/licenses/LICENSE-2.0.html" target="_blank">
                            (license)
                            </a>
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>icons made by</td>
                        <td>
                          <span>
                            <a href="http://www.flaticon.com/authors/madebyoliver" target="_blank">Madebyoliver</a>
                            from <a href="http://www.flaticon.com" target="_blank">www.flaticon.com</a>
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td/>
                        <td/>
                      </tr>
                      <tr>
                        <td>contribute</td>
                        <td><span><a href="http://github.com/sean-adams/dataslayer" target="_blank">GitHub</a></span></td>
                      </tr>
                      <tr>
                        <td/>
                        <td/>
                      </tr>
                      <tr>
                        <td>report issue</td>
                        <td><span><a href="http://github.com/sean-adams/dataslayer/issues/new" target="_blank">GitHub</a> (preferred)</span></td>
                      </tr>
                      <tr>
                        <td/>
                        <td><span><a href="mailto:dataslayer@bearcla.ws?subject=dataslayer+bug" target="_blank">email</a></span></td>
                      </tr>
                      <tr>
                        <td/>
                        <td/>
                      </tr>
                      <tr>
                        <td>share</td>
                        <td><span><a href="http://dataslayer.org" target="_blank">dataslayer.org</a></span></td>
                      </tr>
                      <tr>
                        <td/>
                        <td>
                          <span>
                            <a href="http://chrome.google.com/webstore/detail/dataslayer/ikbablmmjldhamhcldjjigniffkkjgpo" target="_blank">Chrome Web Store</a>
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>leave a review</td>
                        <td>
                          <span>
                            <a href="https://chrome.google.com/webstore/detail/dataslayer/ikbablmmjldhamhcldjjigniffkkjgpo/reviews" target="_blank">Chrome Web Store</a>
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
                          <td><b>1.0.0</b></td>
                          <td><span>rewrite</span></td>
                        </tr>
                        <tr>
                          <td/>
                          <td><span>improvements & bug fixes</span></td>
                        </tr>
                        <tr>
                          <td/>
                          <td><span>import/export functionality</span></td>
                        </tr>
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
  options: React.PropTypes.object,
  setOption: React.PropTypes.func,
};

export default Options;
