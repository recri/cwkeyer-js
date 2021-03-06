//
// cwkeyer-js - a progressive web app for morse code
// Copyright (c) 2022 Roger E Critchlow Jr, Charlestown, MA, USA
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
// 

/* eslint no-param-reassign: ["error", { "props": false }] */

import { LitElement, html, css } from 'lit';
import './UhComponents.js';
import { keyerLogo } from './keyer-logo.js'; // maybe a scope trace?
import { KeyerMidiSource } from './KeyerMidiSource.js';
import { CWKeyerDefault }  from './CWKeyerDefault.js';
import { CWKeyerHasak } from './CWKeyerHasak.js';
import { CWKeyerTWE } from './CWKeyerTWE.js';
import { Keyer } from './Keyer.js';
import { cwkeyerProperties, getProperty } from './cwkeyerProperties.js'
import { shownSymbol, hiddenSymbol, // playSymbol, pauseSymbol, 
	 uncheckedCheckBox, checkedCheckBox } from './cwkeyerConstants.js'

// always force default values, because I don't trust what's stored, yet
const alwaysForceDefault = false;

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
    this.midiSource = new KeyerMidiSource(null);
    this.midiSource.on('midi:notes', this.midiNotesUpdateHandler);
    this.midiSource.on('midi:controls', this.midiControlsUpdateHandler);
    this.midiSource.on('midi:names', this.midiNamesUpdateHandler);
    this.midiSource.on('midi:message', this.midiMessageHandler);

    // only initialize the properties neede for startup
    this.displayMidi = false;
    this.displayHasak = false;
    this.displayTWE = false;
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
	} else if (id.match(/.*CWKeyer.*/)) {
	  console.log(`midiNamesUpdate ${id} creating CWKeyer keyer`)
	  this.devices[id] = new CWKeyerTWE(this.audioContext, id);
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
    if ( ! getProperty(control))
      console.log(`keyerUpdate(${control}) not a control`)
    else if (dev === this.device.name)
      this.requestUpdate(control, value)
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
  
  async startAudio() {
    // start the engine

    // retrieve the preferred sample rate
    this.propertySetDefaultValue('requestedSampleRate', false);

    // create the audio context
    this.audioContext = new AudioContext({ sampleRate: parseInt(this.requestedSampleRate, 10) })

    // load the worklet processors
    await this.audioContext.audioWorklet.addModule('src/KeyerASKProcessor.js');
    await this.audioContext.audioWorklet.addModule('src/KeyerPaddleNoneProcessor.js');
    await this.audioContext.audioWorklet.addModule('src/KeyerPaddleNd7paProcessor.js');
    await this.audioContext.audioWorklet.addModule('src/KeyerPaddleVk6phProcessor.js');
    
    // build the keyer
    this.keyer = new Keyer(this.audioContext, this.midiSource);
    // this.cwkeyer = new CWKeyer(context);
    
    // load some constants into the instance
    // shift keys which can be used as key simulators
    // in truth, if I ignored repeats, then any key would work
    this.shiftKeys = ['None','ShiftLeft','ControlLeft','AltLeft','AltRight','ControlRight','ShiftRight'];
    // list of acceptable sample rates 
    this.sampleRates = ['8000', '32000', '44100', '48000', '96000', '192000', '384000' ];

    // using localStorage to persist defaults between sessions
    // defaults set at top of file
    this.propertySetDefaultValues(false);
    
    this.running = true;

    this.clear();

    this.validate();
    
    // this.keyer.outputDecoder.on('letter', (ltr, code) => console.log(`output '${ltr}' '${code}'`));
    this.keyer.inputDecoder.on('letter', (ltr) =>  this.onkeyed(ltr));
    this.keyer.output.on('sent', (ltr) => this.onsent(ltr));
    this.keyer.output.on('unsent', (ltr) => this.onunsent(ltr));
    this.keyer.output.on('skipped', (ltr) => this.onskipped(ltr));

    // this.keyer.midiSource.on('midi:notes', () => this.requestUpdate('midiNotes', []));
    // this.keyer.midiSource.on('midi:controls', () => this.requestUpdate('midiControls', []));
    // this.keyer.midiSource.on('midi:names', () => ['midiInputs', 'midiOutputs'].forEach(x, this.requestUpdate(x, [])));
    // this.keyer.midiSource.on('midi:message', (name, data) => this.cwkeyer.onmidimessage(name, data));

    document.addEventListener('keydown', (e) => this.keyer.input.keyboardKey(e, true));
    document.addEventListener('keyup', (e) => this.keyer.input.keyboardKey(e, false));
  }
  
  // validate that our lists of options are actual options
  // and that default values are chosen from the same lists
  // also use the functions we define for this purpose
  validate() {
    for (const k of Object.keys(CWKeyerJs.properties))
      if (CWKeyerJs.properties[k].type === Boolean && this[k] !== true && this[k] !== false)
	console.log(`property '${k}' failed validate '${this[k]}' is not Boolean value`);
  }
  
  //
  // teletype window
  //
  onfocus() {
    // console.log("keyboard focus");
    this.keyboardFocused = true;
    this.updateContent();	// show cursor
  }

  onblur() { 
    // console.log("keyboard blur");
    this.keyboardFocused = false;
    this.updateContent();	// hide cursor
  }

  updated(/* propertiesChanged */) { 
    if (this.keyboardFocused) {
      // scroll the div up if the cursor goes off bottom of div
      const keyboard = this.shadowRoot.querySelector('.keyboard');
      const cursor = this.shadowRoot.querySelector('.blinker');
      const fromBottom = cursor.offsetTop+cursor.offsetHeight-keyboard.offsetTop-keyboard.offsetHeight;
      if (fromBottom > 0) keyboard.scrollTop += cursor.offsetHeight;
    }
    if (this.keyer && this.keyer.scope && this.keyer.scope.enabled !== this.displayScope) {
      if (this.displayScope) {
	const canvas = this.shadowRoot.querySelector("canvas");
	if (canvas) this.keyer.scope.enable(this.displayScope, canvas);
      } else {
	this.keyer.scope.enable(false, null);
      }
    }
  }
  
  processFinished() {
    return this.finished.map(tagText => { const [tag,text] = tagText; return html`<span class="${tag}">${text}</span>`; });
  }

  blinkenCursen() {
    return this.keyboardFocused ? html`<span class="blinker">|</span>` : html`<span class="blinker"></span>`;
  }
  
  updateContent() {
    this.content = html`${this.processFinished()}<span class="pending">${this.pending.join('')}</span>${this.blinkenCursen()}`;
  }
  
  appendFinished(tag, text) {
    if (this.finished.length === 0)
      this.finished.push([tag, text]);
    else {
      const [ltag, ltext] = this.finished[this.finished.length-1];
      if (tag === ltag)
	this.finished[this.finished.length-1] = [tag, `${ltext}${text}`];
      else
	this.finished.push([tag, text]);
    }
  }
  
  // this is for input keyed manually as opposed to typed on the keyboard
  // it has the same presentation as sent by default
  onkeyed(ltr) {
    this.appendFinished('sent', ltr.toLowerCase());
    this.updateContent();
  }
  
  ttyKeydown(e) { 
    // may need to handle ctrl-V for paste
    // may need to preventDefault on Space to avoid autoscroll
    // may need to catch Escape as cancel key
    // console.log(`ttyKeydown '${e.key}'`);
    if (e.isComposing || e.altKey || e.metaKey || e.ctrlKey) {
      // log.textContent = `keydown code ${e.code} key ${e.key} CAMS ${e.ctrlKey} ${e.altKey} ${e.metaKey} ${e.shiftKey}`;
    } else if (e.key.length === 1 && /^[A-Za-z0-9.,?/*+!@$&()-=+"':; ]$/.test(e.key)) {
      this.pending.push(e.key);
      this.keyer.output.send(e.key);
      this.updateContent();
      if (e.key === ' ') e.preventDefault();
    } else if (e.key === 'Backspace') {
      this.keyer.output.unsend(e.data);
      // this.pending.pop(); the pop happens when the unsent confirmation comes back
      this.updateContent();
    } else if (e.key === 'Enter') {
      this.pending.push('\n');
      this.keyer.output.send('\n');
      this.updateContent();
    } else if (e.key === 'Escape') {
      this.cancel();
    }
  }

  clear() { 
    this.finished = [['sent','']];
    this.pending = [];
    this.updateContent();
  }

  cancel() {
    this.keyer.output.cancel();
    this.keyer.output.cancelPending();
    this.updateContent();
  }

  onsent(ltr) {
    const chr = this.pending.shift();
    if (ltr !== chr) { console.log(`onsent ${ltr} not first in pending ${chr}`); }
    this.appendFinished('sent', ltr);
    this.updateContent()
  }

  onunsent(ltr) {
    const chr = this.pending.pop()
    if (ltr !== chr) { console.log(`onunsent ${ltr} not last in pending ${chr}`); }
    this.updateContent();
  }

  onskipped(ltr) {
    const chr = this.pending.shift();
    if (ltr !== chr) { console.log(`onskipped ${ltr} not first in pending ${chr}`); }
    this.appendFinished('skipped', chr);
    this.updateContent()
  }
  
  // control manipulation
  propertySetDefaultValue(control, forceDefault) {
    const JSONparse = (value) => { 
      try { return JSON.parse(value); }
      catch(e) { return undefined; }
    }
    const controlDefault = (defaultValue) => {
      const localValue = JSONparse(localStorage[control]);
      const value = forceDefault || alwaysForceDefault || localValue === undefined ? defaultValue : localValue;
      localStorage[control] = JSON.stringify(value);
      return value;
    }
    if ('value' in getProperty(control))
      this[control] = controlDefault(getProperty(control).value);
  }

  propertySetDefaultValues(forceDefault) {
    Object.keys(cwkeyerProperties).forEach(property => this.propertySetDefaultValue(property, forceDefault));
  }

  controlUpdate(control, oldv, newv) {
    this[control] = newv;
    const c = getProperty(control);
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
      div.keyboard {
        display: inline-block;
        padding: 10px;
        text-align: left;
	white-space: pre-wrap;
        margin-top: 16px;
	margin: auto;
	width: 90%;
        height: 300px;
	overflow-wrap: break-word;
        overflow-y: auto;
        border: 1px solid #9e9e9e;
        color: #000000;
      }
      div.group {
	display: inline-block;
      }
      .sent {
        color: #888;
      }
      .keyed {
	color: #aaaa;
      }
      .skipped {
        color: #888;
        text-decoration: line-through;
      }

      .blinker {
	font-weight: 100;
	color: #2E3D48;
	-webkit-animation: 1s blink step-end infinite;
	animation: 1s blink step-end infinite;
      }

      @-webkit-keyframes "blink" {
        from, to {
          color: transparent;
        }
        50% {
          color: black;
        }
      }

      @keyframes "blink" {
	from, to {
	  color: transparent;
	}
	50% {
	  color: black;
	}
      }

      div.scope canvas {
	width: 90%;
	height: 400px;
	border: 1px solid black;
	background: #fff;
	background-size: 50px 50px;
	background-image:
	    linear-gradient(to right, grey 1px, transparent 1px),
	    linear-gradient(to bottom, grey 1px, transparent 1px);
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
	  <uh-spinner control='masterVolume' .ctl=${getProperty('masterVolume')} value="${this.masterVolume}"></uh-spinner>
	  <uh-spinner control="keyerLevel" .ctl=${getProperty('keyerLevel')} value="${this.keyerLevel}"></uh-spinner>
	  <uh-spinner control="keyerTone" .ctl=${getProperty('keyerTone')} value="${this.keyerTone}"></uh-spinner>
	  <uh-spinner control="keyerSpeed" .ctl=${getProperty('keyerSpeed')} value="${this.keyerSpeed}"></uh-spinner>
	</div>
	`;
    switch (type) {
    case 'hasak':
      return html`${common}<p>Controller for Hasak keyer goes here</p>`;
    case 'twe':
      return html`${common}<p>Controller for Teensy Winkey Emulator keyer goes here</p>`;
    case 'default':
      return html`${common}<p>Controller for Default keyer goes here</p>`;
    default:
      return html`<p>No code to displayKeyer for type ${type}`;
    }
  }

  // render a section of the user interface
  displayRender(control) {
    function mynote(x) {
      return html`${x} => ${this.noteValue(x)}<br/>`;
    }
    function mynrpn(x) {
      return html`${x} => ${this.nrpnValue(x)}<br/>`;
    }
    switch (control) {

    case 'displayMidi':
      if ( ! this.midiSource) return html``;
      return html`
	<div class="group" title="Midi activity">
	Devices: ${this.midiNames.join(', ')}<br/>
	Notes: ${this.midiNotes.join(', ')}<br/>
	Controls: ${this.midiControls.join(', ')}
	</div>
	`;

    case 'displayNotes':
      return html`
	<div class="group" title="Hasak midi notes">
	${this.notes.map(x => mynote(x))}
	</div>
	`;
      
    case 'displayNrpns':
      return html`
	<div class="group" title="Hasak controls">
	${this.nrpns.map(x => mynrpn(x))}
	</div>
	`;

    case 'displayAudio':
      //      let after = html`
      //	<div class="group" title="Audio controls">
      //        <div class="keyboard" tabindex="0" @keydown=${this.ttyKeydown} @focus=${this.onfocus} @blur=${this.onblur}>${this.content}</div>
      //        <div class="panel">
      //	  ${this.controlRender('running')}
      //	  <button @click=${this.clear}><span>Clear</span></button>
      //	  <button @click=${this.cancel}><span>Cancel</span></button>
      //	</div>
      //	 ${this.controlRender('displaySettings')}
      //	 ${this.controlRender('displayScope')}
      //	 ${this.controlRender('displayStatus')}
      //	</div>`
      return html`${this.keyer === null ? html`
	<div class="group" title="Start audio controls">
	</div>` : html`
	<div class="group" title="Audio controls">
	</div>`}`;
      
    case 'displayTouchStraight': return html``; // FIX.ME

    case 'displayTouchPaddle': return html``; // FIX.ME

    case 'displayKeyboardSettings': 
      return html`
	${this.controlRender('keyerSpeed')},
	${this.controlRender('keyerLevel')},
	${this.controlRender('keyerTone')},
	${this.controlRender('displayAdvancedKeyboardSettings')}
	`;

    case 'displayAdvancedKeyboardSettings':
      return html`
	${this.controlRender('weight')},
	${this.controlRender('ratio')},
	${this.controlRender('compensation')}
	<br/>
	${this.controlRender('riseTime')},
	${this.controlRender('fallTime')}
	<br/>
	${this.controlRender('shape')}
      `;

    case 'displayManualSettings':
      return html`
	<div class="group" title="Paddle options.">Paddles:
	  ${this.controlRender('paddleKeyer')}
	  ${this.controlRender('paddleSwapped')}
	</div><br/>
	<div class="group" title="Keyboard keys used for manual keying.">Keyboard:
	  ${this.controlRender('straightKey')}
	  ${this.controlRender('leftPaddleKey')}
	  ${this.controlRender('rightPaddleKey')}
        </div><br/>
	<div class="group ${this.midiAvailable?'':' hidden'}" title="MIDI device notes used for manual keying.">MIDI:	
	  ${this.controlRender('straightMidi')}
	  ${this.controlRender('leftPaddleMidi')}
	  ${this.controlRender('rightPaddleMidi')}
        </div><br/>
	${this.controlRender('inputSpeed')}
	${this.controlRender('inputLevel')}
	${this.controlRender('inputTone')}
	${this.controlRender('displayAdvancedManualSettings')}
      `;

    case 'displayAdvancedManualSettings':
      return html`
	${this.controlRender('inputWeight')},
	${this.controlRender('inputRatio')},
	${this.controlRender('inputCompensation')}
	<br/>
	${this.controlRender('inputRise')},
	${this.controlRender('inputFall')}
	<br/>
	${this.controlRender('inputShape')}
      `;

    case 'displayMiscSettings':
      return html`
	${this.controlRender('requestedSampleRate')}
	<br/>
	<label>Reset default values: 
	  <button @click=${() => this.propertySetDefaultValues(true)}>Reset</button>
	</label>
	`;

    case 'displaySettings':
      return html`
	${this.controlRender('displayKeyboardSettings')}
	${this.controlRender('displayManualSettings')}
	${this.controlRender('displayMiscSettings')}
	`;

    case 'displayScope':
      return html`
	<div class="scope"><canvas @resize=${this.scopeResize}></canvas></div>
	${this.controlRender('scopeRunning')}
	${this.controlRender('scopeTrigger')}
	${this.controlRender('scopeTriggerChannel')}
	${this.controlRender('scopeHold')}
	<br/>
	${this.controlRender('scopeTimeScale')}
	<br/>
	<b>ch1</b> 
	${this.controlRender('scopeSource1')}
	${this.controlRender('scopeVerticalScale1')}
	${this.controlRender('scopeVerticalOffset1')}
	<br/>
	<b>ch2</b>
	${this.controlRender('scopeSource2')}
	${this.controlRender('scopeVerticalScale2')}
	${this.controlRender('scopeVerticalOffset2')}
	<br/>
	<b>ch3</b>
	${this.controlRender('scopeSource3')}
	${this.controlRender('scopeVerticalScale3')}
	${this.controlRender('scopeVerticalOffset3')}
	<br/>
	<b>ch4</b>
	${this.controlRender('scopeSource4')}
	${this.controlRender('scopeVerticalScale4')}
	${this.controlRender('scopeVerticalOffset4')}
	`;

    case 'displayStatus':
      return html`
	State: ${this.state}<br/>
	Sample rate: ${this.sampleRate}<br/>
	Current time: ${this.currentTime.toFixed(3)}<br/>
	Base latency: ${this.baseLatency.toFixed(3)}<br/>
	Midi available: ${this.midiAvailable}<br/>`;
      
    case 'displayAbout':
      return html`
	`;

    case 'displayLicense':
      return html`
	`;

    case 'displayColophon':
      return html`
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
	`;
    default: 
      return html`<h1>There is no ${control} case in displayRender<h1>`;
    }
  }

  // render a user interface control element
  controlRender(control) {
    const ctl = getProperty(control);
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
	  </button}>
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
      return html`<h1>No controlRender for ${control} with type ${ctl.type}`;
    }
  }
  
  /* eslint no-nested-ternary: off */
  render() {
    // 	${this.controlRender('displayAudio')}
    return html`
<main>
  <div class="logo">${keyerLogo}</div>
  <div><h3>cwkeyer-js</h3></div>
  <div class="panel">
    <uh-options control="deviceSelect" value="${this.deviceSelect}" .options="${this.deviceSelectOptions}"
        .ctl=${getProperty('deviceSelect')} @uh-change=${(e) => this.controlSelectNew(e)}>
    </uh-options>
  </div>
  ${this.displayKeyer(this.device.type)}
  <uh-folder control="displayTest1" value="${this.displayTest1}" .ctl=${getProperty('displayTest1')} @uh-click=${(e) => this.controlToggleNew(e)}>
    <p>this.device: ${this.device.label}</p>
    <p>this.devices as labels: ${Object.values(this.devices).map(dev => dev.label).join(', ')}</p>
    <p>this.deviceSelectOptions: ${Object.values(this.deviceSelectOptions).join(', ')}</p>
  </uh-folder>
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
    <p>
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
      .ctl=${getProperty('displayTest')} @uh-click=${(e) => this.controlToggleNew(e)}>
    <uh-folder control="displayTest2" value="${this.displayTest2}" .ctl=${getProperty('displayTest2')} @uh-click=${(e) => this.controlToggleNew(e)}>
      <p>A bunch of test that should come and go with clicks</p>
    </uh-folder>
  </uh-folder>
</main>

<p class="app-footer">
???? Made with thanks to <a target="_blank" rel="noopener noreferrer" href="https://github.com/open-wc" >open-wc</a>.
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
