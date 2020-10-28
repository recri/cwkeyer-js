import { LitElement, html, css } from 'lit-element';
import { keyerLogo } from './keyer-logo.js';
import { Keyer } from './Keyer.js';

// wpm speed limits
const qrqStep = 1;
const qrsStep = 1;
const qrqMax = 150;
const qrsMax = 50;
const qrqMin = 10;
const qrsMin = 10;

// application color scheme, from material design color tool
// const colorPrimary = css`#1d62a7`;
// const colorPLight = css`#5b8fd9`;
// const colorPDark  = css`#003977`;
// const colorSecondary = css`#9e9e9e`;
// const colorSLight = css`#cfcfcf`;
// const colorSDark =  css`#707070`;

export class RecriKeyer extends LitElement {

  // declare LitElement properties
  static get properties() {
    return {
      title: { type: String },
      page: { type: String },
      pitch: { type: Number },
      gain: { type: Number },
      speed: { type: Number },
      qrq: { type: Boolean },
      weight: { type: Number },
      ratio: { type: Number },
      compensation: { type: Number },
      rise: { type: Number },
      fall: { type: Number },
      midi: { type: String },
      swapped: { type: Boolean },
      type: { type: String },

      itemsPerSession: { type: Number },
      repsPerItem: { type: Number },

      running: { type: Boolean },
      text: { type: Array },
    };
  }

  // setter with updateRequest
  updateControl(control, newv) {
    // console.log(`updateControl ${control} ${newv}`);
    const oldv = this.keyer[control];
    this.keyer[control] = newv;
    this.requestUpdate(control, oldv);
  }

  // set and get properties, delegate to keyer
  set pitch(v) { this.updateControl('pitch', v); }

  get pitch() { return this.keyer.pitch; }

  set gain(v) { this.updateControl('gain', v); }
  
  get gain() { return Math.round(this.keyer.gain); }

  set speed(v) { this.updateControl('speed', v); }

  get speed() { return this.keyer.speed; }

  set weight(v) { this.updateControl('weight', v); }

  get weight() { return this.keyer.weight; }

  set ratio(v) { this.updateControl('ratio', v); }

  get ratio() { return this.keyer.ratio; }

  set compensation(v) { this.updateControl('compensation', v); }

  get compensation() { return this.keyer.compensation; }

  set rise(v) { this.updateControl('rise', v); }

  get rise() { return this.keyer.rise; }

  set fall(v) {  this.updateControl('fall', v); }

  get fall() { return this.keyer.fall; }

  set swapped(v) {  this.updateControl('swapped', v); }

  get swapped() { return this.keyer.swapped; }

  set type(v) { this.updateControl('type', v); }

  get type() { return this.keyer.type; }

  set midi(v) { this.updateControl('midi', v); }

  get midi() { return this.keyer.midi; }

  // styles
  static get styles() {
    return css`
      :host {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        font-size: calc(10px + 2vmin);
        color: black;
        max-width: 960px;
        margin: 0 auto;
        text-align: center;
      }

      main {
        flex-grow: 1;
      }

      .logo > svg {
	margin-left: 5%;
	max-width: 90%;
        margin-top: 16px;
      }

      button > span {
	font-size: calc(10px + 2vmin);
      }

      div.keyboard {
        display: block;
	margin-top: 16px;
	margin-left: 10%
        width: 90%;
        height: 300px;
        overflow-y: auto;
	border: inset;
	border-color: #9e9e9e;
	border-width: 5px;
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

  constructor() {
    super();
    // start the engine
    this.keyer = new Keyer(new AudioContext());
    // default property values
    this.pitch = 700;
    this.gain = -26;
    this.weight = 50;
    this.ratio = 50;
    this.compensation = 0;
    this.rise = 4;
    this.fall = 4;
    this.speed = 20;
    this.qrq = false;
    this.midi = 'none';
    this.swapped = false;
    this.type = 'iambic';
    this.itemsPerSession = 5;
    this.repsPerItem = 5;
    this.running = this.keyer.context.state !== 'suspended';
    this.text = [['sent', ''], ['pending', '']];
  }

  static isshift(key) {
    return key === 'Control' || key === 'Alt' || key === 'Shift';
  }

  keydown(e) {
    if (RecriKeyer.isshift(e.key)) {
      // e.key -> Control | Alt | Shift
      // e.location -> 1 for Left, 2 for Right
      // e.code -> (Control | Alt | Shift) (Left | Right)
      // console.log(`keydown e.key ${e.key} e.location ${e.location} e.code ${e.code}`);
      this.keyer.keydown(e);
    }
    // disable space scrolling of page, but keep space in text entry
    // if (e.keyCode === 32) {
      // this.keypress(e);
      // e.preventDefault();
    // }
  }

  keyup(e) {
    if (RecriKeyer.isshift(e.key)) this.keyer.keyup(e);
  }

  keypress(e) {
    // console.log(`keypress e.key ${e.key}`);
    this.text = this.text.concat([['pending', e.key]]);
    this.keyer.keypress(e);
  }

  /* eslint class-methods-use-this: ["error", { "exceptMethods": ["divBeforeInput","divChange"] }] */
  divBeforeInput(e) {
    switch (e.inputType) {
    case 'insertText': break;
    case 'deleteContentBackward': break;
    case 'insertFromPaste': break;
    case 'insertParagraph': break;
    default:
      console.log('divBeforeInput:');
      console.log(e);
      break;
    }
  }

  divInput(e) {
    switch (e.inputType) {
    case 'insertText':
      this.keyer.outputSend(e.data); break; // e.data inserted
    case 'insertParagraph':
      break;
    case 'deleteContentBackward':
      this.keyer.outputUnsend(e.data); break; // e.data deleted
    case 'deleteByCut':
      this.keyer.outputUnsend(e.data); break; // e.data is null
    case 'insertFromPaste':
      break; // e.data is null
    case 'insertFromDrop':
      break; // e.data is null
    default:
      console.log('divInput:');
      console.log(e);
      break;
    }
  }

  divChange(e) {
    console.log("divChange:");
    console.log(e);
  }

  playPause() {
    // console.log("play/pause clicked");
    if (this.keyer.context.state === 'suspended') {
      this.keyer.context.resume();
      this.running = true;
    } else {
      this.keyer.context.suspend();
      this.running = false;
    }
  }

  clear() { this.text = [['sent',''],['pending','']]; }

  cancel() { 
    this.keyer.outputCancel();
    // clear pending queue
  }

  toggleQrq() {
    this.qrq = ! this.qrq
    if (this.qrq) {
      this.speed = Math.max(qrqMin, qrqStep * Math.floor(this.speed/qrqStep));
    } else {
      this.speed = Math.min(this.speed, qrsMax);
    }
  }

  render() {
    return html`
      <main>
        <div class="logo">${keyerLogo}</div>
	<div>
	<h1>keyer.js</h1>
        <button role="switch" aria-checked=${this.running} @click=${this.playPause}>
	  <span>${this.running ? 'Pause' : 'Play'}</span>
        </button>
        <button @click=${this.clear}>
	  <span>Clear</span>
        </button>
        <button @click=${this.cancel}>
	  <span>Cancel</span>
        </button>
	<div>
	<div class="keyboard" contenteditable="true" @input=${this.divInput} @beforeinput=${this.divBeforeInput} @keydown=${this.keydown} @keyup=${this.keyup}>
	  ${this.text.map(t => t[0] !== 'pending' ? html`<span class="${t[0]}" contenteditable="false">${t[1]}</span>` : html`${t[1]}`)}
	</div>
	<h2>Settings</h2>
	<div>
	  <input type="range" id="speed" name="speed" min=${this.qrq ? qrqMin : qrsMin} max=${this.qrq ? qrqMax : qrsMax}
		.value=${this.speed} step=${this.qrq ? qrqStep : qrsStep}
		@input=${function(e) { this.speed = e.target.value; }}>
	  <label for="speed">Speed ${this.speed} (WPM)</label>
	  <button role="switch" aria-checked=${this.qrq} @click=${this.toggleQrq}>
	    <span>${this.qrq ? 'QRQ' : 'QRS'}</span>
	  </button>
	</div>
	<div>
	  <input type="range" id="gain" name="gain" min="-50" max="10" 
		.value=${this.gain} step="1"
		@input=${function(e) { this.gain = e.target.value; }}>
	  <label for="gain">Gain ${this.gain} (dB)</label>
	</div>
	<div>
	  <input type="range" id="pitch" name="pitch" min="250" max="2000"
		.value=${this.pitch} step="1"
		@input=${function(e) { this.pitch = e.target.value; }}>
	  <label for="pitch">Pitch ${this.pitch} (Hz)</label>
	</div>
	<div>
	  <input type="range" id="weight" name="weight" min="25" max="75"
		.value=${this.weight} step="0.1"
		@input=${function(e) { this.weight = e.target.value; }}>
	  <label for="weight">Weight ${this.weight} (%)</label>
	</div>
	<div>
	  <input type="range" id="ratio" name="ratio" min="25" max="75"
		.value=${this.ratio} step="0.1"
		@input=${function(e) { this.ratio = e.target.value; }}>
	  <label for="ratio">Ratio ${this.ratio} (%)</label>
	</div>
	<div>
	  <input type="range" id="compensation" name="compensation" min="-15" max="15"
		.value=${this.compensation} step="0.1"
		@input=${function(e) { this.compensation = e.target.value; }}>
	  <label for="compensation">Compensation ${this.compensation} (%)</label>
	</div>
	<div>
	  <input type="range" id="rise" name="rise" min="1" max="10" 
		.value=${this.rise} step="0.1"
		@input=${function(e) { this.rise = e.target.value; }}>
	  <label for="rise">Rise ${this.rise} (ms)</label>
	</div>
	<div>
	  <input type="range" id="fall" name="fall" min="1" max="10"
		.value=${this.fall} step="0.1"
		@input=${function(e) { this.fall = e.target.value; }}>
	  <label for="fall">Fall ${this.fall} (ms)</label>
	</div>
	<h2>Status</h2>
	Sample rate: ${this.keyer.context.sampleRate};<br/>
	Current time: ${this.keyer.context.currentTime};<br/>
	Base latency: ${this.keyer.context.baseLatency};<br/>
      </main>

      <p class="app-footer">
        🚽 Made with love by
        <a target="_blank" rel="noopener noreferrer"
          href="https://github.com/open-wc" >open-wc</a>.
      </p>
    `;
  }
}
// Local Variables:
// mode: JavaScript
// js-indent-level: 2
// End:
