//
// cwkeyer-js - a progressive web app for morse code
// Copyright (c) 2020 Roger E Critchlow Jr, Charlestown, MA, USA
//
// MIT License
//
// Copyright (c) 2022 cwkeyer-js
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
//

/* eslint no-param-reassign: ["error", { "props": false }] */

import { LitElement, html, css } from 'lit';
import './UhComponents.js';
import { cwkeyerLogo } from './cwkeyer-logo.js'; // maybe a scope trace?
import { CWKeyerMidi } from './CWKeyerMidi.js';
import { CWKeyerDefault }  from './CWKeyerDefault.js';
import { CWKeyerHasak } from './CWKeyerHasak.js';
import { CWKeyerTwinkey } from './CWKeyerTwinkey.js';
import { cwkeyerProperties } from './cwkeyerProperties.js'
import { shownSymbol, hiddenSymbol, // playSymbol, pauseSymbol, 
	 uncheckedCheckBox, checkedCheckBox } from './cwkeyerConstants.js'

// application color scheme, from material design color tool
// const colorPrimary = css`#1d62a7`;
// const colorPLight = css`#5b8fd9`;
// const colorPDark  = css`#003977`;
// const colorSecondary = css`#9e9e9e`;
// const colorSLight = css`#cfcfcf`;
// const colorSDark =  css`#707070`;

export class CWKeyerJs extends LitElement {

  // extract LitElement properties from controls
  static get properties() { 
    if ( ! CWKeyerJs._properties) {
      CWKeyerJs._properties = Object.entries(cwkeyerProperties)
	.filter(([,v]) => v.lit)
	.map(([k,v]) => [k, v.lit]);
    }
    return CWKeyerJs._properties;
  }

  constructor() {
    super();
    this.audioContext = null;
    // the event handlers for requests are constant lambdas
    // so they can be added and removed
    this.keyerUpdateHandler = (dev, control, value) => this.keyerUpdate(dev, control, value)
    this.onMidiSendHandler = (dev, message) => this.onmidisend(dev, message)
    this.midiNotesUpdateHandler = () => this.midiNotesUpdate()
    this.midiControlsUpdateHandler = () => this.midiControlsUpdate()
    this.midiNamesUpdateHandler = () => this.midiNamesUpdate()
    this.midiMessageHandler = (name, data) => this.onmidimessage(name, data)
    this.device = new CWKeyerDefault(this.audioContext, 'none');
    this.devices = { none: this.device };
    this.device.on('send:midi', this.onMidiSendHandler)
    this.device.on('update', this.keyerUpdateHandler)
    this.midiSource = new CWKeyerMidi(null);
    this.midiSource.on('midi:notes', this.midiNotesUpdateHandler);
    this.midiSource.on('midi:controls', this.midiControlsUpdateHandler);
    this.midiSource.on('midi:names', this.midiNamesUpdateHandler);
    this.midiSource.on('midi:message', this.midiMessageHandler);

    // only initialize the properties neede for startup
    this.displayMidi = false;
    this.displayHasak = false;
    this.displayTwinkey = false;
    this.displayDefault = false;
    this.displayAbout = false;
    this.displayLicense = false;
    this.displayColophon = false;
    this.displayTest = false
    this.displayTest2 = false
  }

  // these next three methods implement the device selector
  set deviceSelect(deviceSelect) {
    Object.values(this.devices).forEach(device => { 
      if (device.name === deviceSelect) {
	if (device !== this.device) {
	  this.device.activate(false)
	  this.device = device
	  this.device.activate(true)
	}
      }
    });
  }

  get deviceSelect() { return this.device.name; }
  
  get deviceSelectOptions() { return Object.values(this.devices).map(device => device.name); }
  
  get midiNames() { return this.midiSource.names; }
  
  get midiInputs() { return this.midiSource.inputs.map((x)=>x.name); }

  get midiOutputs() { return this.midiSource.outputs.map((x)=>x.name); }
  
  get midiAvailable() { return this.midiSource.midiAvailable; }
  
  get midiNotes() { return this.midiSource.notes; }

  get midiControls() { return this.midiSource.controls; }
  
  get deviceNotes() { return this.device.notes }

  get deviceCtrls() { return this.device.ctrls }

  get deviceNrpns() { return this.device.nrpns }
  
  midiNotesUpdate() { this.requestUpdate('midiNotes', []) }

  midiControlsUpdate() { this.requestUpdate('midiControls', []) }

  midiNamesUpdate() {
    // console.log(`midNamesUpdate: devices ${Object.keys(this.devices).join(', ')} midiNames: ${this.midiNames.join(', ')}`);
    // remove deleted devices, though there never seem to be any
    Object.keys(this.devices)
      .filter(x => x !== 'none' && ! this.midiNames.find(y => x === y))
      .forEach(x => {
	const dev = this.devices[x]
	console.log(`midiNamesUpdate ${dev.name} is not in ${this.midiNames.join(', ')}`)
	dev.off('midi:send', this.onMidiSendHandler)
	dev.off('update', this.keyerUpdateHandler)
	delete this.devices[dev.name]
      });
    // add new devices
    this.midiNames
      .filter(id => ! this.devices[id])
      .forEach(id => {
	if (id.match(/.*[hH]asak.*/)) {
	  console.log(`midiNamesUpdate ${id} creating hasak keyer`)
	  this.devices[id] = new CWKeyerHasak(this.audioContext, id);
	  // if (this.deviceSelect === 'none as default') this.device = this.devices[id];
	} else if (id.match(/.*Keyer.*/)) {
	  console.log(`midiNamesUpdate ${id} creating CWKeyer keyer`)
	  this.devices[id] = new CWKeyerTwinkey(this.audioContext, id);
	  // if (this.deviceSelect === 'none as default') this.device = this.devices[id];
	} else {
	  console.log(`midiNamesUpdate ${id} creating default keyer`)
	  this.devices[id] = new CWKeyerDefault(this.audioContext, id);
	}
	this.devices[id].on('midi:send', this.onMidiSendHandler)
	this.devices[id].on('update', this.keyerUpdateHandler)
      });
    this.requestUpdate('midiNames')
    this.requestUpdate('deviceOptions')
    this.requestUpdate('deviceSelect')
  }

  keyerUpdate(dev, control, value) {
    if ( ! cwkeyerProperties[control]) {
      console.log(`keyerUpdate(${dev}, ${control}, ${value}) not a control`)
    } else if (dev === this.device.name) {
      console.log(`keyerUpdate(${dev}, ${control}, ${value}) requesting`)
      this.requestUpdate(control, value)
    } else {
      console.log(`keyerUpdate(${dev}, ${control}, ${value}) not current device == ${this.device.name}`)
    }
  }

  onmidisend(name, data) {
    // console.log(`CWKeyerJs relaying 'midi:send' ${name} ${data}`);
    this.midiSource.emit('midi:send', name, data);
  }
  
  onmidimessage(name, data) {
    if (this.devices[name]) this.devices[name].onmidimessage(name, data);
  }

  get audioContext() { return this._audioContext; }

  set audioContext(v) {
    if (v !== null) {
      // update audio context in keyer instances
    }
    this._audioContext = v
  }
 
  controlUpdate(control, oldv, newv) {
    this[control] = newv;
    const c = cwkeyerProperties[control];
    if (c.value) localStorage[control] = JSON.stringify(newv);
    if (c.lit) this.requestUpdate(control, oldv);
    switch (control) {
    case 'requestedSampleRate':
      this.start();
      break;
    default:
      break;
    }
  }

  controlToggle(control) { this.controlUpdate(control, this[control], ! this[control]); }

  controlSelect(control, e) { this.controlUpdate(control, this[control], e.target.value); }

  controlSelectNew(e) { this.controlSelect(e.detail.control, e.detail.event); }
  
  controlToggleNew(e) { this.controlToggle(e.detail.control); }
  
  // styles
  static get styles() {
    return css`
      :host {
        min-height: 100vh;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        font-size: calc(10px + 2vmin);
        color: black;
        margin: 0;
        text-align: center;
      }
      .h1 { font-size: 2em; margin: .33em 0; }
      .h2 { font-size: 1.5em; margin: .38em 0; }
      .h3 { font-size: 1.17em; margin: .42em 0; }
      .h5 { font-size: .83em; margin: .75em 0; }
      .h6 { font-size: .75em; margin: .84em 0; }
      .h1, .h2, .h3, .h4, .h5, .h6 { 
	font-weight: bolder;
	width: 60%;
	text-align: left;
      }
      main {
        flex-grow: 1;
      }
      .logo > svg {
        margin-left: 5%;
        max-width: 90%;
        margin-top: 16px;
      }
      div.hidden, div.group.hidden {
	display: none;
      }
      button, select, input {
        font-size: calc(10px + 2vmin);
      }
      input[type="number"][size="5"] {
	 width: 3.25em;
      }
      input[type="number"][size="4"] {
	 width: 2.5em;
      }
      input[type="number"][size="3"] {
	 width: 2em;
      }
      div.panel {
	margin: auto;
	width: 90%;
      }
      div.subpanel {
	margin: auto;
	width: 100%;
      }
     
      .app-footer {
        font-size: calc(12px + 0.5vmin);
        align-items: center;
      }

      .app-footer a {
        margin-left: 5px;
      }
    `;
  }

  displayKeyer(type) {
    const common = html`
<div class="group" title="Basic keyer controls">
  <uh-spinner control='masterVolume' .ctl=${cwkeyerProperties.masterVolume} value="${this.masterVolume}"></uh-spinner>
  <uh-spinner control="keyerLevel" .ctl=${cwkeyerProperties.keyerLevel} value="${this.keyerLevel}"></uh-spinner>
  <uh-spinner control="keyerTone" .ctl=${cwkeyerProperties.keyerTone} value="${this.keyerTone}"></uh-spinner>
  <uh-spinner control="keyerSpeed" .ctl=${cwkeyerProperties.keyerSpeed} value="${this.keyerSpeed}"></uh-spinner>
  <uh-spinner control="keyerWeight" .ctl=${cwkeyerProperties.keyerWeight} value="${this.keyerWeight}"></uh-spinner>
  <uh-spinner control="keyerRatio" .ctl=${cwkeyerProperties.keyerRatio} value="${this.keyerRatio}"></uh-spinner>
  <uh-spinner control="keyerCompensation" .ctl=${cwkeyerProperties.keyerCompensation} value="${this.keyerCompensation}"></uh-spinner>
  <uh-spinner control="keyerFarnsworth" .ctl=${cwkeyerProperties.keyerFarnsworth} value="${this.keyerFarnsworth}"></uh-spinner>
  <uh-spinner control="keyerSpeedFraction" .ctl=${cwkeyerProperties.keyerSpeedFraction} value="${this.keyerSpeedFraction}"></uh-spinner>
</div>
${this.displayRender('displayMidi')}
${this.displayRender('displayDevice')}
	`;
    switch (type) {
    case 'hasak':
      return html`${common}<p>Controller for Hasak keyer goes here</p>`;
    case 'twinkey':
      return html`${common}<p>Controller for Teensy Winkey Emulator keyer goes here</p>`;
    case 'default':
      return html`${common}<p>Controller for Default keyer goes here</p>`;
    default:
      return html`<p>No code to displayKeyer for type ${type}</p>`;
    }
  }

  // render a section of the user interface
  displayRender(control) {
    switch (control) {

    case 'displayMidi':
      if ( ! this.midiSource) return html``;
      return html`
<uh-folder control="displayMidi" value="${this.displayMidi}" .ctl=${cwkeyerProperties.displayMidi}  @uh-click=${(e) => this.controlToggleNew(e)}>
  <div class="group" title="Midi activity">
     <p>Devices: ${this.midiNames.join(', ')}</p>
     <p>Notes: ${this.midiNotes.join(', ')}</p>
     <p>Controls: ${this.midiControls.join(', ')}</p>
  </div>
</uh-folder>
	    `;

    case 'displayDevice':
      return html`
<uh-folder control="displayDevice" value="${this.displayDevice}" .ctl=${cwkeyerProperties.displayDevice}  @uh-click=${(e) => this.controlToggleNew(e)}>
  <div class="group" title="Device activity">
    <p>Notes: ${this.deviceNotes.join(', ')}</p>
    <p>Controls: ${this.deviceCtrls.join(', ')}</p>
    <p>NRPNs: ${this.deviceNrpns.join(', ')}</p>
  </div>
</uh-folder>
      `;

    case 'displayNotes':
      return html`
<div class="group" title="Device notes">
  ${this.deviceNotes.map(x => html`<p>${x} -> ${this.device.notevalue(x)}</p>`)}
</div>
	    `;
      
    case 'displayCtrls':
      return html`
<div class="group" title="Device controls">
  ${this.deviceCtrls.map(x => html`<p>${x} -> ${this.device.ctrlvalue(x)}</p>`)}
</div>
	`;

    case 'displayNrpns':
      return html`
<div class="group" title="Device non-registered parameters">
  ${this.deviceNrpns.map(x => html`<p>${x} -> ${this.device.nrpnvalue(x)}</p>`)}
</div>
	`;
    default: 
      return html`<h1>There is no ${control} case in displayRender<h1>`;
    }
  }

  // render a user interface control element
  controlRender(control) {
    const ctl = cwkeyerProperties[control];
    if ( ! ctl) return html`<h1>No controlRender for ${control}</h1>`;
    switch (ctl.type) {
      // folder is a label button which shows or hides content
    case 'block':
      return html`${this.displayRender(control)}`
    case 'folder': {
      const {level, label, title} = ctl;
      const pclass = level === 2 ? 'panel' : 'subpanel';
      const dclass = `${pclass} ${this[control] ? '' : 'hidden'}`;
      return html`
	<div class="${pclass}" title="${title}">
	  <button class="h${level}" @click=${() => this.controlToggle(control)}>
	    ${this[control] ? shownSymbol : hiddenSymbol} ${label}
	  </button>
	</div>
	<div class="${dclass}">${this.displayRender(control)}</div>
      `;
    }
      // slider adjusts a number between a min and a max by step
    case 'slider': {
      const {label, title, min, max, step, unit} = ctl;
      return html`
	<div class="group" title="${title}">
	  <input
	    type="range"
	    name="${control}" 
	    min="${min}"
	    max="${max}"
	    step="${step}"
	    .value=${this[control]}
	    @input=${(e) => this.controlSelect(control, e)}>
	  <label for="${control}">${label} ${this[control]} (${unit})</label>
	</div>
      `;
    }

      // spinner adjusts a number between a min and a max by step
    case 'spinner': {
      const { label, title, min, max, step, unit, size} = ctl;
      return html`
	<div class="group" title="${title}">
	  <label for="${control}">${label}
	    <input
	      type="number"
	      name="${control}" 
	      min="${min}"
	      max="${max}"
	      step="${step}"
	      size="${size}"
	      .value=${this[control]}
	      @input=${(e) => this.controlSelect(control, e)}>
	    (${unit})
	  </label>
	</div>
      `;
    }
      // options displays a list of options for selection
    case 'options': {
      const {options, label, title} = ctl;
      return html`
	<div class="group" title="${title}"><label for="${control}">${label}
	  <select
	    name="${control}"
	    .value=${this[control]} 
	    @change=${(e) => this.controlSelect(control, e)}>
	      ${this[options].map(x => html`<option .value=${x} ?selected=${x === this[control]}>${x}</option>`)}
	  </select>
	</label></div>
      `;
    }
      // a toggle button shows one of two labels
    case 'toggle': {
      const {label, on, off, title} = ctl;
      return html`
	<div class="group" title="${title}"><label for="${control}">${label}
	  <button
	    name="${control}"
	    role="switch" 
	    aria-checked=${this[control]} 
	    @click=${() => this.controlToggle(control)}>
	    ${this[control] ? on : off}
	  </button></label></div>
      `;
    }
      // an envelope shows two lists of envelope functions
    case 'envelope': {
      const {label, envelope1, envelope2, title} = ctl;
      return html`
	<div class="group" title="${title}"><label>${label}: 
	  ${this.controlRender(envelope1)} * ${this.controlRender(envelope2)}
	</label></div>
      `;
    }
      // a check button shows a label with a filled or unfilled checkbox
    case 'check': {
      const {label, title} = ctl;
      return html`
	<div class="group" title="${title}"><button
	    role="switch" 
	    aria-checked=${this[control]} 
	    @click=${() => this.controlToggle(control)}>
	    ${this[control] ? checkedCheckBox : uncheckedCheckBox} ${label}
	  </button></div>
	`;
    }
    default:
      return html`<h1>No controlRender for ${control} with type ${ctl.type}</h1>`;
    }
  }
  
  /* eslint no-nested-ternary: off */
  render() {
    // 	${this.controlRender('displayAudio')}
    return html`
<main>
  <div class="logo">${cwkeyerLogo}</div>
  <div><h3>cwkeyer-js</h3></div>
  <div class="panel">
    <uh-options control="deviceSelect" value="${this.deviceSelect}" .options="${this.deviceSelectOptions}"
        .ctl=${cwkeyerProperties.deviceSelect} @uh-change=${(e) => this.controlSelectNew(e)}>
    </uh-options>
  </div>
  ${this.displayKeyer(this.device.type)}
  <uh-folder control="displayAbout" value="${this.displayAbout}" .ctl=${cwkeyerProperties.displayAbout}
      @uh-click=${(e) => this.controlToggleNew(e)}>
    <p>
      <b>cwkeyer-js</b> implements a MIDI control panel for compatible
      morse code keyers in a web page.  The compatible keyers are:
      https://github.com/recri/hasak, but there should be at least
      one more.
    </p><p>
      It is a progressive web app, meaning it is a web page which
      can be downloaded and run off-line.
    </p><p>
      It is also an adaptive web app, so it resizes and reorganizes its
      interface to run on devices of different screen sizes. 
    </p><p>
      It uses the Web MIDI API (https://webaudio.github.io/web-midi-api/)
      to send and receive MIDI messages in the browser.  This API is
      implemented by the Chrome, Edge, and Opera desktop browsers and the
      Webview Android, Chrome Android, Opera Android, and Samsung Internet
      mobile browsers as of early 2022.
    </p><p>
      This <b>About</b> panel gives a brief introduction to the app.
    </p><p>
      The <b>License</b> panel describes the licenscing of the app.
    </p><p>
      The <b>Colophon</b> panel describes the construction of the app.
    </p>
  </uh-folder>
  <uh-folder control="displayLicense" value="${this.displayLicense}" .ctl=${cwkeyerProperties.displayLicense}
      @uh-click=${(e) => this.controlToggleNew(e)}>
    <p>
      cwkeyer-js - a PWA for controlling morse code keyers over MIDI.
    </p><p>
      Copyright (c) 2022 Roger E Critchlow Jr, Charlestown, MA, USA
    </p><p>
      MIT License
    </p><p>
      Copyright (c) 2022 Roger E Critchlow Jr, Charlestown, MA, USA
    </p><p>
      Permission is hereby granted, free of charge, to any person obtaining a copy
      of this software and associated documentation files (the "Software"), to deal
      in the Software without restriction, including without limitation the rights
      to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
      copies of the Software, and to permit persons to whom the Software is
      furnished to do so, subject to the following conditions:
      </p><p>
      The above copyright notice and this permission notice shall be included in all
      copies or substantial portions of the Software.
      </p><p>
      THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
      IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
      FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
      AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
      LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
      OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
      SOFTWARE.
    </p>
  </uh-folder>
  <uh-folder control="displayColophon" value="${this.displayTest}" .ctl=${cwkeyerProperties.displayColophon}
    @uh-click=${(e) => this.controlToggleNew(e)}>
      <p>
      cwkeyer-js was written with emacs on a laptop running Ubuntu using the development guides
      from open-wc.org.
    </p><p>
      The immediate impetus was the Steve (kf7o) Haynal's CWKeyer project, https://github.com/softerhardware/CWKeyer.
    </p><p>
      A lot of background can be found in <a href="https://github.com/recri/keyer">keyer</a>,
      a collection of software defined radio software built using Jack, Tcl, and C.
    </p><p>
      The polymer project, the PWA starter kit, open-wc, lit-element, lit-html, web audio, web MIDI provided the
      web development tools.
    </p><p>
      The source for <a href="https://github.com/recri/cwkeyer-js">cwkeyer-js</a>
    </p>
  </uh-folder>
  <uh-folder control="displayTest" value="${this.displayTest}" 
      .ctl=${cwkeyerProperties.displayTest} @uh-click=${(e) => this.controlToggleNew(e)}>
    <uh-folder control="displayTest2" value="${this.displayTest2}" .ctl=${cwkeyerProperties.displayTest2} @uh-click=${(e) => this.controlToggleNew(e)}>
      <p>A bunch of test that should come and go with clicks</p>
    </uh-folder>
  </uh-folder>
</main>

<p class="app-footer">
🚽 Made with thanks to <a target="_blank" rel="noopener noreferrer" href="https://github.com/open-wc" >open-wc</a>.
</p>
    `;
  }

  // BEGIN keyer property getters/setters


  get masterVolume() { return this.device.masterVolume; }

  set masterVolume(v) { this.device.masterVolume = v; };

  get inputSelect() { return this.device.inputSelect; }

  set inputSelect(v) { this.device.inputSelect = v; };

  get inputSelects() { return this.device.inputSelects; }

  get inputLevel() { return this.device.inputLevel; }

  set inputLevel(v) { this.device.inputLevel = v; };

  get buttonLevel0() { return this.device.buttonLevel0; }

  set buttonLevel0(v) { this.device.buttonLevel0 = v; };

  get buttonLevel1() { return this.device.buttonLevel1; }

  set buttonLevel1(v) { this.device.buttonLevel1 = v; };

  get buttonLevel2() { return this.device.buttonLevel2; }

  set buttonLevel2(v) { this.device.buttonLevel2 = v; };

  get buttonLevel3() { return this.device.buttonLevel3; }

  set buttonLevel3(v) { this.device.buttonLevel3 = v; };

  get buttonLevel4() { return this.device.buttonLevel4; }

  set buttonLevel4(v) { this.device.buttonLevel4 = v; };

  get externalPTTRequire() { return this.device.externalPTTRequire; }

  set externalPTTRequire(v) { this.device.externalPTTRequire = v; };

  get iqModeSelect() { return this.device.iqModeSelect; }

  set iqModeSelect(v) { this.device.iqModeSelect = v; };

  get iqModeSelects() { return this.device.iqModeSelects; }

  get iqAdjustPhase() { return this.device.iqAdjustPhase; }

  set iqAdjustPhase(v) { this.device.iqAdjustPhase = v; };

  get iqAdjustBalance() { return this.device.iqAdjustBalance; }

  set iqAdjustBalance(v) { this.device.iqAdjustBalance = v; };

  get txEnable() { return this.device.txEnable; }

  set txEnable(v) { this.device.txEnable = v; };

  get sidetoneEnable() { return this.device.sidetoneEnable; }

  set sidetoneEnable(v) { this.device.sidetoneEnable = v; };

  get sidetonePan() { return this.device.sidetonePan; }

  set sidetonePan(v) { this.device.sidetonePan = v; };

  get outputEnable() { return this.device.outputEnable; }

  set outputEnable(v) { this.device.outputEnable = v; };

  get debouncePeriod() { return this.device.debouncePeriod; }

  set debouncePeriod(v) { this.device.debouncePeriod = v; };

  get pttHeadTime() { return this.device.pttHeadTime; }

  set pttHeadTime(v) { this.device.pttHeadTime = v; };

  get pttTailTime() { return this.device.pttTailTime; }

  set pttTailTime(v) { this.device.pttTailTime = v; };

  get pttHangTime() { return this.device.pttHangTime; }

  set pttHangTime(v) { this.device.pttHangTime = v; };

  get keyerRiseTime() { return this.device.keyerRiseTime; }

  set keyerRiseTime(v) { this.device.keyerRiseTime = v; };

  get keyerFallTime() { return this.device.keyerFallTime; }

  set keyerFallTime(v) { this.device.keyerFallTime = v; };

  get keyerRiseRamp() { return this.device.keyerRiseRamp; }

  set keyerRiseRamp(v) { this.device.keyerRiseRamp = v; };

  get keyerFallRamp() { return this.device.keyerFallRamp; }

  set keyerFallRamp(v) { this.device.keyerFallRamp = v; };

  get keyerRamps() { return this.device.keyerRamps; }

  get paddleMode() { return this.device.paddleMode; }

  set paddleMode(v) { this.device.paddleMode = v; };

  get paddleModes() { return this.device.paddleModes; }

  get paddleSwapped() { return this.device.paddleSwapped; }

  set paddleSwapped(v) { this.device.paddleSwapped = v; };

  get paddleAdapter() { return this.device.paddleAdapter; }

  set paddleAdapter(v) { this.device.paddleAdapter = v; };

  get paddleAdapters() { return this.device.paddleAdapters; }

  get autoLetterSpace() { return this.device.autoLetterSpace; }

  set autoLetterSpace(v) { this.device.autoLetterSpace = v; };

  get autoWordSpace() { return this.device.autoWordSpace; }

  set autoWordSpace(v) { this.device.autoWordSpace = v; };

  get paddleKeyer() { return this.device.paddleKeyer; }

  set paddleKeyer(v) { this.device.paddleKeyer = v; };

  get paddleKeyers() { return this.device.paddleKeyers; }

  get channelCC() { return this.device.channelCC; }

  set channelCC(v) { this.device.channelCC = v; };

  get channelNote() { return this.device.channelNote; }

  set channelNote(v) { this.device.channelNote = v; };

  get noteLeftPaddle() { return this.device.noteLeftPaddle; }

  set noteLeftPaddle(v) { this.device.noteLeftPaddle = v; };

  get noteRightPaddle() { return this.device.noteRightPaddle; }

  set noteRightPaddle(v) { this.device.noteRightPaddle = v; };

  get noteStraightKey() { return this.device.noteStraightKey; }

  set noteStraightKey(v) { this.device.noteStraightKey = v; };

  get noteExternalPTT() { return this.device.noteExternalPTT; }

  set noteExternalPTT(v) { this.device.noteExternalPTT = v; };

  get noteKeyOut() { return this.device.noteKeyOut; }

  set noteKeyOut(v) { this.device.noteKeyOut = v; };

  get notePTTOut() { return this.device.notePTTOut; }

  set notePTTOut(v) { this.device.notePTTOut = v; };

  get adcEnable() { return this.device.adcEnable; }

  set adcEnable(v) { this.device.adcEnable = v; };

  get adcControls() { return this.device.adcControls; }

  get adc0Control() { return this.device.adc0Control; }

  set adc0Control(v) { this.device.adc0Control = v; };

  get adc1Control() { return this.device.adc1Control; }

  set adc1Control(v) { this.device.adc1Control = v; };

  get adc2Control() { return this.device.adc2Control; }

  set adc2Control(v) { this.device.adc2Control = v; };

  get adc3Control() { return this.device.adc3Control; }

  set adc3Control(v) { this.device.adc3Control = v; };

  get adc4Control() { return this.device.adc4Control; }

  set adc4Control(v) { this.device.adc4Control = v; };

  get keyerTone() { return this.device.keyerTone; }

  set keyerTone(v) { this.device.keyerTone = v; };

  get keyerLevel() { return this.device.keyerLevel; }

  set keyerLevel(v) { this.device.keyerLevel = v; };

  get keyerSpeed() { return this.device.keyerSpeed; }

  set keyerSpeed(v) { this.device.keyerSpeed = v; };

  get keyerWeight() { return this.device.keyerWeight; }

  set keyerWeight(v) { this.device.keyerWeight = v; };

  get keyerRatio() { return this.device.keyerRatio; }

  set keyerRatio(v) { this.device.keyerRatio = v; };

  get keyerFarnsworth() { return this.device.keyerFarnsworth; }

  set keyerFarnsworth(v) { this.device.keyerFarnsworth = v; };

  get keyerCompensation() { return this.device.keyerCompensation; }

  set keyerCompensation(v) { this.device.keyerCompensation = v; };

  get keyerSpeedFraction() { return this.device.keyerSpeedFraction; }

  set keyerSpeedFraction(v) { this.device.keyerSpeedFraction = v; };

  get voice() { return this.device.voice; }

  set voice(v) { this.device.voice = v; };

  get voices() { return this.device.voices; }

  get voiceTone() { return this.device.voiceTone; }

  set voiceTone(v) { this.device.voiceTone = v; };

  get voiceLevel() { return this.device.voiceLevel; }

  set voiceLevel(v) { this.device.voiceLevel = v; };

  get voiceSpeed() { return this.device.voiceSpeed; }

  set voiceSpeed(v) { this.device.voiceSpeed = v; };

  get voiceWeight() { return this.device.voiceWeight; }

  set voiceWeight(v) { this.device.voiceWeight = v; };

  get voiceRatio() { return this.device.voiceRatio; }

  set voiceRatio(v) { this.device.voiceRatio = v; };

  get voiceFarnsworth() { return this.device.voiceFarnsworth; }

  set voiceFarnsworth(v) { this.device.voiceFarnsworth = v; };

  get voiceCompensation() { return this.device.voiceCompensation; }

  set voiceCompensation(v) { this.device.voiceCompensation = v; };

  get voiceSpeedFraction() { return this.device.voiceSpeedFraction; }

  set voiceSpeedFraction(v) { this.device.voiceSpeedFraction = v; };

  // END keyer properties

}
