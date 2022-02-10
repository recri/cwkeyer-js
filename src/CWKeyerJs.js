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
import { cwkeyerDescriptors } from './cwkeyerDescriptors.js'
import { cwkeyerCommonStyles, cwkeyerRootStyles } from './cwkeyerStyles.js'
import { shownSymbol, hiddenSymbol, // playSymbol, pauseSymbol, 
	 uncheckedCheckBox, checkedCheckBox } from './cwkeyerConstants.js'

function displayColumns(cols, items) {
  if (items.length === 0) return html`<div>nothing here!</div>`;
  const nth = Math.max(2, Math.floor(items.length / cols));
  const split = [];
  for (let last = 0; last < items.length; last += nth) split.push(last);
  return html`${split.map(i => items.slice(Math.min(i, items.length), Math.min(i+nth, items.length))).map(c => html`<div class="column${cols}">${c.map(d => html`${d}<br/>`)}</div>`)}`;
}
    
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
    Object.defineProperties(this, cwkeyerDescriptors);
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

  deviceNoteName(x) { return this.device.notename(x) }
  
  get deviceCtrls() { return this.device.ctrls }

  deviceCtrlName(x) { return this.device.ctrlname(x) }
  
  midiNotesUpdate() { this.requestUpdate('midiNotes') }

  midiControlsUpdate() { this.requestUpdate('midiControls') }

  //
  // incoming event handlers
  //
  midiNamesUpdate() {
    // console.log(`midNamesUpdate: devices ${Object.keys(this.devices).join(', ')} midiNames: ${this.midiNames.join(', ')}`);
    // remove deleted devices, though there never seem to be any
    Object.keys(this.devices)
      .filter(x => x !== 'none' && ! this.midiNames.find(y => x === y))
      .forEach(x => {
	const dev = this.devices[x]
	// console.log(`midiNamesUpdate ${dev.name} is not in ${this.midiNames.join(', ')}`)
	dev.off('midi:send', this.onMidiSendHandler)
	dev.off('update', this.keyerUpdateHandler)
	delete this.devices[dev.name]
      });
    // add new devices
    this.midiNames
      .filter(id => ! this.devices[id])
      .forEach(id => {
	if (id.match(/.*[hH]asak.*/)) {
	  // console.log(`midiNamesUpdate ${id} creating hasak keyer`)
	  this.devices[id] = new CWKeyerHasak(this.audioContext, id);
	  if (this.deviceSelect === 'none') this.device = this.devices[id];
	} else if (id.match(/.*Keyer.*/)) {
	  // console.log(`midiNamesUpdate ${id} creating CWKeyer keyer`)
	  this.devices[id] = new CWKeyerTwinkey(this.audioContext, id);
	  if (this.deviceSelect === 'none') this.device = this.devices[id];
	} else {
	  // console.log(`midiNamesUpdate ${id} creating default keyer`)
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
      // console.log(`keyerUpdate(${dev}, ${control}, ${value})`)
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
    if (this.devices[name]) this.devices[name].onmidimessage(name, data)
    if (this.devices.none) this.devices.none.onmidimessage(name, data)
  }

  //
  // old context for Web Audio API
  //
  get audioContext() { return this._audioContext; }

  set audioContext(v) {
    if (v !== null) {
      // update audio context in keyer instances
    }
    this._audioContext = v
  }
 
  //
  // control value updaters
  //
  controlUpdate(control, oldv, newv) {
    // console.log(`controlUpdate(${control}, ${oldv}, ${newv})`)
    this[control] = newv;
    // const c = cwkeyerProperties[control];
    // Ah, that's what c.value signalled, I remember
    // if (c.value) localStorage[control] = JSON.stringify(newv);
    // if (c.lit) 
    this.requestUpdate(control, oldv);
  }

  controlToggle(control) { this.controlUpdate(control, this[control], ! this[control]); }

  controlSelect(control, e) { this.controlUpdate(control, this[control], e.target.value); }

  controlSelectNew(e) { this.controlSelect(e.detail.control, e.detail.event); }
  
  controlToggleNew(e) { this.controlToggle(e.detail.control); }

  //
  // styles
  //
  static get styles() { 
    return css`
	${cwkeyerRootStyles}
	${cwkeyerCommonStyles}
	`
  }

  // render a user interface control element
  controlRender(control) {
    const ctl = cwkeyerProperties[control];
    if ( ! ctl) return html`<h1>No controlRender for ${control}</h1>`;
    switch (ctl.type) {
      // folder is a label button which shows or hides content
    case 'block':
      return html`${this.render(control)}`
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
	<div class="${dclass}">${this.render(control)}</div>
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
  
  //
  // lit-html render overloaded with control argument
  // for rendering parts of template
  render(control) {
    if ( ! control) {
      // render the root of the document
      return html`
<main>
  ${this.render('displayHeader')}
  ${this.render('displayDevice')}
  ${this.render('displayKeyer')}
  ${this.render('displayAbout')}
  ${this.render('displayLicense')}
  ${this.render('displayColophon')}
</main>
${this.render('displayFooter')}`
    }
    // otherwise render the part of the document named control
    switch (control) {

      // Top level controls
      
    case 'displayHeader':
      return html`
  <div class="logo">${cwkeyerLogo}</div>
  <div><h3>cwkeyer-js</h3></div>`

    case 'displayDevice':
      return html`
<uh-folder control="displayDevice" value="${this.displayDevice}"
    @uh-click=${(e) => this.controlToggleNew(e)}>
    <uh-options slot="header" control="deviceSelect" value="${this.deviceSelect}" .options=${this.deviceSelectOptions}
        @uh-change=${(e) => this.controlSelectNew(e)}>
    </uh-options>
</uh-folder>`

    case 'displayKeyer':
      switch (this.device.type) {
      case 'hasak': return this.render('displayHasak')
      case 'twinkey': return this.render('displayTwinkey')
      case 'default': return this.render('displayDefault')
      default: return html`<p>No code to displayKeyer for type ${this.device.type}</p>`
      }

    case 'displayAbout':
      return html`
<uh-folder control="displayAbout" value="${this.displayAbout}"
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
</uh-folder>`

    case 'displayLicense':
      return html`
<uh-folder control="displayLicense" value="${this.displayLicense}"
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
</uh-folder>`

    case 'displayColophon':
      return html`
<uh-folder control="displayColophon" value="${this.displayColophon}" 
    @uh-click=${(e) => this.controlToggleNew(e)}>
  <p>
    cwkeyer-js was written with emacs on a laptop running Ubuntu using the development guides
    from open-wc.org.
  </p><p>
    The immediate impetus was the Steve (kf7o) Haynal's CWKeyer project,
    https://github.com/softerhardware/CWKeyer.
  </p><p>
    A lot of background can be found in <a href="https://github.com/recri/keyer">keyer</a>,
    a collection of software defined radio software built using Jack, Tcl, and C.
  </p><p>
    The polymer project, the PWA starter kit, open-wc, lit-element, lit-html, web audio, 
    web MIDI provided the web development tools.
  </p><p>
    The source for <a href="https://github.com/recri/cwkeyer-js">cwkeyer-js</a>
  </p>
</uh-folder>`
     
    case 'displayFooter':
      return html`
<p class="app-footer">
🚽 Made with thanks to <a target="_blank" rel="noopener noreferrer" href="https://github.com/open-wc" >open-wc</a>.
</p>`

      // heads of keyer branches
    case 'displayHasak':
      return html`
${this.render('hasakFlags')}
${this.render('hasakBasic')}
${this.render('hasakTiming')}
${this.render('hasakPaddle')}
${this.render('hasakPTT')}
${this.render('hasakEnvelope')}
${this.render('hasakCodec')}
${this.render('hasakMisc')}
${this.render('hasakMIDI')}
${this.render('hasakAdc')}
${this.render('hasakInfo')}
<uh-folder control="hasakTLDR" value="${this.hasakTLDR}"
    @uh-click=${(e) => this.controlToggleNew(e)}>
  ${this.render('hasakButton')}
  ${this.render('hasakIQ')}
  ${this.render('hasakCommands')}
  ${this.render('displayDeviceDetails')}
</uh-folder>
`
// ${this.render('hasakVoice')}
// ${this.render('hasakMorse')}
// ${this.render('hasakMixers')}

    case 'displayTwinkey': return html`${this.render('displayDefault')}`

    case 'displayDefault': return html`
${this.render('displayMidiDetails')}
${this.render('displayDeviceDetails')}`

      // parts of hasak keyer tree
    case 'hasakBasic':
      return html`
<uh-folder control="hasakBasic" value="${this.hasakBasic}" 
    @uh-click=${(e) => this.controlToggleNew(e)}>
  <uh-spinner control='masterVolume' value="${this.masterVolume}"
      @uh-input=${(e) => this.controlSelectNew(e)}></uh-spinner>
  <uh-spinner control="keyerLevel" value="${this.keyerLevel}"
      @uh-input=${(e) => this.controlSelectNew(e)}></uh-spinner>
  <uh-spinner control="keyerTone" value="${this.keyerTone}"
      @uh-input=${(e) => this.controlSelectNew(e)}></uh-spinner>
  <uh-spinner control="keyerSpeed" value="${this.keyerSpeed}"
      @uh-input=${(e) => this.controlSelectNew(e)}></uh-spinner>
</uh-folder>`

    case 'hasakTiming':
      return html`
<uh-folder control="hasakTiming" value="${this.hasakTiming}" @uh-click=${(e) => this.controlToggleNew(e)}>
  <uh-spinner control="keyerWeight" value="${this.keyerWeight}"
      @uh-input=${(e) => this.controlSelectNew(e)}
      ></uh-spinner>
  <uh-spinner control="keyerRatio" value="${this.keyerRatio}"
      @uh-input=${(e) => this.controlSelectNew(e)}></uh-spinner>
  <uh-spinner control="keyerCompensation" value="${this.keyerCompensation}"
      @uh-input=${(e) => this.controlSelectNew(e)}></uh-spinner>
  <uh-spinner control="keyerFarnsworth" value="${this.keyerFarnsworth}"
      @uh-input=${(e) => this.controlSelectNew(e)}></uh-spinner>
  <uh-spinner control="keyerSpeedFraction" value="${this.keyerSpeedFraction}"
      @uh-input=${(e) => this.controlSelectNew(e)}></uh-spinner>
</uh-folder>`

    case 'hasakVoice': 
      return html`
<uh-folder control="hasakVoice" value="${this.hasakVoice}"  @uh-click=${(e) => this.controlToggleNew(e)}>
  <uh-options control="voice" value="${this.voice}" .options=${this.voices}
      @uh-change=${(e) => this.controlSelectNew(e)}></uh-options>
  <uh-spinner control="keyerLevel" value="${this.keyerLevel}"
      @uh-input=${(e) => this.controlSelectNew(e, this.voice)}></uh-spinner>
  <uh-spinner control="keyerTone" value="${this.keyerTone}"
      @uh-input=${(e) => this.controlSelectNew(e, this.voice)}></uh-spinner>
  <uh-spinner control="keyerSpeed" value="${this.keyerSpeed}"
      @uh-input=${(e) => this.controlSelectNew(e, this.voice)}></uh-spinner>
  <uh-spinner control="keyerWeight" value="${this.keyerWeight}"
      @uh-input=${(e) => this.controlSelectNew(e, this.voice)}></uh-spinner>
  <uh-spinner control="keyerRatio" value="${this.keyerRatio}"
      @uh-input=${(e) => this.controlSelectNew(e, this.voice)}></uh-spinner>
  <uh-spinner control="keyerCompensation" value="${this.keyerCompensation}"
      @uh-input=${(e) => this.controlSelectNew(e, this.voice)}></uh-spinner>
  <uh-spinner control="keyerFarnsworth" value="${this.keyerFarnsworth}"
      @uh-input=${(e) => this.controlSelectNew(e, this.voice)}></uh-spinner>
  <uh-spinner control="keyerSpeedFraction" value="${this.keyerSpeedFraction}"
      @uh-input=${(e) => this.controlSelectNew(e, this.voice)}></uh-spinner>
</uh-folder>`

    case 'hasakStatus': return html`
<uh-folder control="hasakStatus" value="${this.hasakStatus}"
     @uh-click=${(e) => this.controlToggleNew(e)}>
  <p>FIX.ME - Status monitor, say what?</p>
</uh-folder>`

    case 'hasakFlags': return html`
<uh-folder control="hasakFlags" value="${this.hasakFlags}"
     @uh-click=${(e) => this.controlToggleNew(e)}>
  <uh-check control="txEnable" value="${this.txEnable}"
      @uh-click=${(e) => this.controlToggleNew(e)}>
    ${cwkeyerProperties.txEnable.label}
  </uh-check>
  <uh-check control="externalPTTRequire" value="${this.externalPTTRequire}"
      @uh-click=${(e) => this.controlToggleNew(e)}>
    ${cwkeyerProperties.externalPTTRequire.label}
  </uh-check>
  <uh-check control="sidetoneEnable" value="${this.sidetoneEnable}"
       @uh-click=${(e) => this.controlToggleNew(e)}>
    ${cwkeyerProperties.sidetoneEnable.label}
  </uh-check>
  <uh-check control="adcEnable" value="${this.adcEnable}"
      @uh-click=${(e) => this.controlToggleNew(e)}>
    ${cwkeyerProperties.adcEnable.label}
  </uh-check>
  <uh-check control="remoteKey" value="${this.remoteKey}"
      @uh-click=${(e) => this.controlToggleNew(e)}>
    ${cwkeyerProperties.remoteKey.label}
  </uh-check>
</uh-folder>`

    case 'hasakPTT': return html`
<uh-folder control="hasakPTT" value="${this.hasakPTT}"
     @uh-click=${(e) => this.controlToggleNew(e)}>
  <uh-spinner control="pttHeadTime" value="${this.pttHeadTime}"
      @uh-input=${(e) => this.controlSelectNew(e)}></uh-spinner>
  <uh-spinner control="pttTailTime" value="${this.pttTailTime}"
      @uh-input=${(e) => this.controlSelectNew(e)}></uh-spinner>
  <uh-spinner control="pttHangTime" value="${this.pttHangTime}"
      @uh-input=${(e) => this.controlSelectNew(e)}></uh-spinner>
</uh-folder>`

    case 'hasakEnvelope': return html`
<uh-folder control="hasakEnvelope" value="${this.hasakEnvelope}"
     @uh-click=${(e) => this.controlToggleNew(e)}>
  <div class="column2">
  <uh-spinner control="keyerRiseTime" value="${this.keyerRiseTime}"
      @uh-input=${(e) => this.controlSelectNew(e)}></uh-spinner>
  <uh-options control="keyerRiseRamp" value="${this.keyerRiseRamp}" .options=${this.keyerRamps}
      @uh-change=${(e) => this.controlSelectNew(e)}></uh-options>
  </div><div class="column2">
  <uh-spinner control="keyerFallTime" value="${this.keyerFallTime}"
      @uh-input=${(e) => this.controlSelectNew(e)}></uh-spinner>
  <uh-options control="keyerFallRamp" value="${this.keyerFallRamp}" .options=${this.keyerRamps}
      @uh-change=${(e) => this.controlSelectNew(e)}></uh-options>
  </div>
</uh-folder>`

    case 'hasakPaddle': return html`
<uh-folder control="hasakPaddle" value="${this.hasakPaddle}"
     @uh-click=${(e) => this.controlToggleNew(e)}>
  <uh-options control="paddleMode" value="${this.paddleMode}" .options=${this.paddleModes}
      @uh-change=${(e) => this.controlSelectNew(e)}></uh-options>
  <uh-check control="paddleSwapped" value="${this.paddleSwapped}"
      @uh-click=${(e) => this.controlToggleNew(e)}>Swap</uh-check>
  <uh-options control="paddleAdapter" value="${this.paddleAdapter}" .options=${this.paddleAdapters}
      @uh-change=${(e) => this.controlSelectNew(e)}></uh-options>
  <uh-check control="autoLetterSpace" value="${this.autoLetterSpace}"
      @uh-click=${(e) => this.controlToggleNew(e)}>ALS</uh-check>
  <uh-check control="autoWordSpace" value="${this.autoWordSpace}"
      @uh-click=${(e) => this.controlToggleNew(e)}>AWS</uh-check>
  <uh-options control="paddleKeyer" value="${this.paddleKeyer}" .options=${this.paddleKeyers}
      @uh-change=${(e) => this.controlSelectNew(e)}></uh-options>
</uh-folder>`
	
    case 'hasakCodec': return html`
<uh-folder control="hasakCodec" value="${this.hasakCodec}"
     @uh-click=${(e) => this.controlToggleNew(e)}>
  <uh-spinner control='masterVolume' value="${this.masterVolume}"
      @uh-input=${(e) => this.controlSelectNew(e)}></uh-spinner>
  <uh-options control="inputSelect" value="${this.inputSelect}"
      .options=${this.inputSelects}
      @uh-change=${(e) => this.controlSelectNew(e)}></uh-options>
  <uh-spinner control='inputLevel' value="${this.inputLevel}"
      @uh-input=${(e) => this.controlSelectNew(e)}></uh-spinner>
</uh-folder>`
	
    case 'hasakButton': return html`
<uh-folder control="hasakButton" value="${this.hasakButton}"
     @uh-click=${(e) => this.controlToggleNew(e)}>
  <uh-spinner control="buttonLevel0" value="${this.buttonLevel0}"
       @uh-input=${(e) => this.controlSelectNew(e)}></uh-spinner>
  <uh-spinner control="buttonLevel1" value="${this.buttonLevel1}"
       @uh-input=${(e) => this.controlSelectNew(e)}></uh-spinner>
  <uh-spinner control="buttonLevel2" value="${this.buttonLevel2}"
       @uh-input=${(e) => this.controlSelectNew(e)}></uh-spinner>
  <uh-spinner control="buttonLevel3" value="${this.buttonLevel3}"
       @uh-input=${(e) => this.controlSelectNew(e)}></uh-spinner>
  <uh-spinner control="buttonLevel4" value="${this.buttonLevel4}"
       @uh-input=${(e) => this.controlSelectNew(e)}></uh-spinner>
</uh-folder>`
	
    case 'hasakIQ': return html`
<uh-folder control="hasakIQ" value="${this.hasakIQ}"
    @uh-click=${(e) => this.controlToggleNew(e)}>
  <uh-options control="iqModeSelect" value="this.iqModeSelect" 
      .options=${this.iqModeSelects}
      @uh-change=${(e) => this.controlSelectNew(e)}></uh-options>
  <uh-spinner control="iqAdjustPhase" value="${this.iqAdjustPhase}"
       @uh-input=${(e) => this.controlSelectNew(e)}></uh-spinner>
  <uh-spinner control="iqAdjustBalance" value="${this.iqAdjustBalance}"
       @uh-input=${(e) => this.controlSelectNew(e)}></uh-spinner>
</uh-folder>`
	
    case 'hasakMisc': return html`
<uh-folder control="hasakMisc" value="${this.hasakMisc}"
     @uh-click=${(e) => this.controlToggleNew(e)}>
  <uh-spinner control="debouncePeriod" value="${this.debouncePeriod}"
       @uh-input=${(e) => this.controlSelectNew(e)}></uh-spinner>
</uh-folder>`
	
    case 'hasakMIDI': return html`
<uh-folder control="hasakMIDI" value="${this.hasakMIDI}"
     @uh-click=${(e) => this.controlToggleNew(e)}>
  <uh-folder control="hasakMIDIChannels" value="${this.hasakMIDIChannels}"
     @uh-click=${(e) => this.controlToggleNew(e)}>
    <uh-spinner control="channelCC" value="${this.channelCC}"
         @uh-input=${(e) => this.controlSelectNew(e)}></uh-spinner>
    <uh-spinner control="channelNote" value="${this.channelNote}"
         @uh-input=${(e) => this.controlSelectNew(e)}></uh-spinner>
    <uh-spinner control="channelNrpn" value="${this.channelNrpn}"
         @uh-input=${(e) => this.controlSelectNew(e)}></uh-spinner>
  </uh-folder>
  <uh-folder control="hasakMIDINotes" value="${this.hasakMIDINotes}"
     @uh-click=${(e) => this.controlToggleNew(e)}>
    <uh-spinner control="noteLeftPaddle" value="${this.noteLeftPaddle}"
         @uh-input=${(e) => this.controlSelectNew(e)}></uh-spinner>
    <uh-spinner control="noteRightPaddle" value="${this.noteRightPaddle}"
         @uh-input=${(e) => this.controlSelectNew(e)}></uh-spinner>
    <uh-spinner control="noteStraightKey" value="${this.noteStraightKey}"
         @uh-input=${(e) => this.controlSelectNew(e)}></uh-spinner>
    <uh-spinner control="noteExternalPTT" value="${this.noteExternalPTT}"
         @uh-input=${(e) => this.controlSelectNew(e)}></uh-spinner>
    <uh-spinner control="noteKeyOut" value="${this.noteKeyOut}"
         @uh-input=${(e) => this.controlSelectNew(e)}></uh-spinner>
    <uh-spinner control="notePTTOut" value="${this.notePTTOut}"
         @uh-input=${(e) => this.controlSelectNew(e)}></uh-spinner>
  </uh-folder>
  <uh-multiple control="noteEnable" value=${this.noteEnable}
       @uh-change=${(e) => this.controlSelectNew(e)}></uh-multiple>
</uh-folder>`

    case 'hasakAdc': return html`
<uh-folder control="hasakAdc" value="${this.hasakAdc}" 
     @uh-click=${(e) => this.controlToggleNew(e)}>
  <p>FIX.ME - adcEnable bitmap for enabled adc inputs</p>
  <uh-options control="adc0Control" value="this.adc0Control" 
      .options=${this.adcControls}
      @uh-change=${(e) => this.controlSelectNew(e)}></uh-options>
  <uh-options control="adc1Control" value="this.adc1Control" 
      .options=${this.adcControls}
      @uh-change=${(e) => this.controlSelectNew(e)}></uh-options>
  <uh-options control="adc2Control" value="this.adc2Control" 
      .options=${this.adcControls}
      @uh-change=${(e) => this.controlSelectNew(e)}></uh-options>
  <uh-options control="adc3Control" value="this.adc3Control" 
      .options=${this.adcControls}
      @uh-change=${(e) => this.controlSelectNew(e)}></uh-options>
  <uh-options control="adc4Control" value="this.adc4Control" 
      .options=${this.adcControls}
      @uh-change=${(e) => this.controlSelectNew(e)}></uh-options>
</uh-folder>`

    case 'hasakInfo': return html`
<uh-folder control="hasakInfo" value="${this.hasakInfo}"
     @uh-click=${(e) => this.controlToggleNew(e)}>
  <p>
    Keyer identifier: ${this.keyerIdentifier}<br/>
    Keyer version: ${this.keyerVersion}<br/>
    Parameter set size: ${this.nrpnSize} short ints.<br/>
    Stored message size: ${this.messageSize} bytes.<br/>
    Audio sample rate: ${this.sampleRate*100} samples/second.<br/>
    EEPROM size: ${this.eepromSize} bytes.<br/>
    Teensy microprocessor: ${this.identifyCPU}.<br/>
    Codec: ${this.identifyCodec}.
  </p>
</uh-folder>`

      /*
    "KYRP_WRITE_EEPROM": {nrpn: 2000, type: "cmd", title: "write nrpn+msgs to eeprom"},
    "KYRP_READ_EEPROM": {nrpn: 2001, type: "cmd", title: "read nrpn+msgs from eeprom"},
    "KYRP_SET_DEFAULT": {nrpn: 2002, type: "cmd", title: "load nrpn with default values"},
    "KYRP_ECHO_ALL": {nrpn: 2003, type: "cmd", title: "echo all set nrpns to midi"},
    "KYRP_SEND_WINK": {nrpn: 2004, type: "cmd", title: "send character value to wink vox"},
    "KYRP_SEND_KYR": {nrpn: 2005, type: "cmd", title: "send character value to kyr vox"},
    "KYRP_MSG_INDEX": {nrpn: 2006, type: "cmd", title: "set index into msgs"},
    "KYRP_MSG_WRITE": {nrpn: 2007, type: "cmd", title: "set msgs[index++] to value"},
    "KYRP_MSG_READ": {nrpn: 2008, type: "cmd", title: "read msgs[index++] and echo the value"},
    */
    case 'hasakCommands': return html`
<uh-folder control="hasakCommands" value="${this.hasakCommands}"
     @uh-click=${(e) => this.controlToggleNew(e)}>
  <p>FIX.ME - Controls for performing operations on hasak.</p>
</uh-folder>`

    case 'hasakMorse': return html`
<uh-folder control="hasakMorse" value="${this.hasakMorse}"
     @uh-click=${(e) => this.controlToggleNew(e)}>
	<p>FIX.ME - place holder for morse code table</p>
</uh-folder>`

    case 'hasakMixers': return html`
<uh-folder control="hasakMixers" value="${this.hasakMixers}"
     @uh-click=${(e) => this.controlToggleNew(e)}>
  <p>FIX.ME - place holder for mixer matrix</p>
</uh-folder>`

      // generic information

    case 'displayMidiDetails':
      return html`
<uh-folder control="displayMidiDetails" value="${this.displayMidiDetails}"
     @uh-click=${(e) => this.controlToggleNew(e)}>
  <div class="group" title="Midi activity">
     <p>Devices: ${this.midiNames.join(', ')}</p>
     <p>Notes: ${this.midiNotes.join(', ')}</p>
     <p>Controls: ${this.midiControls.join(', ')}</p>
  </div>
</uh-folder>`

    case 'displayDeviceDetails':
      return html`
<uh-folder control="displayDeviceDetails" value="${this.displayDeviceDetails}" 
    @uh-click=${(e) => this.controlToggleNew(e)}>
  <div class="group" title="Device activity">
    <p>Notes: ${this.deviceNotes.join(', ')}</p>
    <p>${this.render('displayNoteDetails')}</p>	
    <p>Controls: ${this.deviceCtrls.join(', ')}</p>
    <p>${this.render('displayCtrlDetails')}</p>	
    <p>NRPNs: ${this.device.nrpns.join(', ')}</p>
    <p>${this.render('displayNrpnDetails')}</p>	
  </div>
</uh-folder>`

    case 'displayNoteDetails':
      return html`
<div class="group" title="Device note details.">
  ${this.deviceNotes.map(x => html`${x} -> ${this.device.notevalue(x)}<br/>`)}
</div>`
      
    case 'displayCtrlDetails':
      return html`
<div class="group" title="Device control details.">
  ${this.deviceCtrls.map(x => html`${x} -> ${this.device.ctrlvalue(x)}<br/>`)}
</div>`

    case 'displayNrpnDetails':
      return html`
<div class="group" title="Device non-registered parameter details.">
  ${displayColumns(2, this.device.nrpns.map(x => html`${this.device.nrpnname(x)} = ${this.device.nrpnvalue(x)}`))}
</div>`

    default: 
      return html`<h1>There is no ${control} case in render()<h1>`;
    }
  }

}
