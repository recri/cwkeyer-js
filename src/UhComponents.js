import { LitElement, html, css } from 'lit';

/* eslint max-classes-per-file: "off" */

//
// these are direct translations of the pseudo elements used in keyer.elf.org
// nothing complicated, mostly plain html.
// well, they are taking most property values from the controls entry for the control
// 

const shownSymbol = '\u23f7';
const hiddenSymbol = '\u23f5';

const uncheckedCheckBox = '\u2610';
const checkedCheckBox = '\u2611';

const sharedStyles = css`
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
      div.hidden, div.group.hidden {
	display: none;
      }
      div.panel {
	margin: auto;
	width: 90%;
      }
      div.subpanel {
	margin: auto;
	width: 100%;
      }
      div.group {
	display: inline-block;
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
    `
//
// a folder component
// trying to pass a Boolean value is a problem, 
// so treat true and false as strings
//
class UhFolder extends LitElement {
  static get styles() { return sharedStyles }

  // properties are reflected from html attributes
  static get properties() {
    return {
      value: {type:String},
      control: {type:String},
    }
  }

  render() {
    const pclass = this.ctl.level === 2 ? 'panel' : 'subpanel';
    const hclass = `h${Math.max(6,this.ctl.level+1)}`;
    const marker = this.value === 'true' ? shownSymbol : hiddenSymbol;
    const dclass = `${pclass}${this.value === 'true' ? '' : ' hidden'}`;

    return html`
	<div class="${pclass}" title="${this.ctl.title}">
	  <button class="${hclass}" @click=${(e) => this._click(e)}>
	    ${marker} ${this.ctl.label}
	  </button}>
	</div>
	<div class="${dclass}"><slot></slot></div>
	`;
  }
  
  _click(e) {
    this.dispatchEvent(new CustomEvent('uh-click', { detail: { control: this.control, event: e } }));
  }
}

customElements.define('uh-folder', UhFolder);

//
// a numeric value slider input component
//
class UhSlider extends LitElement {
  static get styles() { return sharedStyles }

  static get properties() {
    return {
      value: { type: Number },
      control: { type: String }
    }
  }
  
  render() {
    return html`
	<div class="group" title="${this.ctl.title}">
	  <input
	    type="range"
	    name="${this.control}" 
	    min="${this.ctl.min}"
	    max="${this.ctl.max}"
	    step="${this.ctl.step}"
	    .value=${this.value}
	    @input=${(e) => this._input(e)}>
	  <label for="${this.control}">${this.ctl.label} ${this.value} (${this.ctl.unit})</label>
	</div>
	`;
  }

  _input(e) {
    this.dispatchEvent(new CustomEvent('uh-input', { detail: { control: this.control, event: e } }));
  }

}

customElements.define('uh-slider', UhSlider);

//
// a numeric value spinbox input component
//
class UhSpinner extends LitElement {
  static get styles() { return sharedStyles }

  static get properties() {
    return {
      value: { type: Number },
      control: { type: String }
    }
  }

  render() {
      return html`
	<div class="group" title="${this.ctl.title}">
	  <label for="${this.control}">${this.ctl.label}
	    <input
	      type="number"
	      name="${this.control}" 
	      min="${this.ctl.min}"
	      max="${this.ctl.max}"
	      step="${this.ctl.step}"
	      size="${this.ctl.size}"
	      .value=${this.value}
	      @input=${(e) => this._input(e)}>
	    (${this.ctl.unit})
	  </label>
	</div>
	`;
  }

  _input(e) {
    this.dispatchEvent(new CustomEvent('uh-input', { detail: { control: this.control, event: e } }));
  }

}

customElements.define('uh-spinner', UhSpinner);

//
// an option list value input
// the list of options is passed as a property, 
// ie .options=${list}, not options="${list}"
//
class UhOptions extends LitElement {
  static get styles() { return sharedStyles }

  static get properties() {
    return {
      control: { type: String },
      value: { type: String },
      options: { type: Array }
    }
  }

  render() {
    return html`
	<div class="group" title="${this.ctl.title}"><label for="${this.control}">${this.ctl.label}
	  <select
	    name="${this.control}"
	    value=${this.value} 
	    @change=${(e) => this._change(e)}>
	      ${this.options.map(x => html`<option .value=${x} ?selected=${x === this.value}>${x}</option>`)}
	  </select>
	</label></div>
	`;
  }

  _change(e) {
    this.dispatchEvent(new CustomEvent('uh-change', { detail: { control: this.control, event: e } }));
  }

}

customElements.define('uh-options', UhOptions);

//
// a play/pause toggle input
//
class UhToggle extends LitElement {
  static get styles() { return sharedStyles }

  static get properties() {
    return {
      control: { type: String },
      value: { type: String }
    }
  }

  render() {
    return html`
	<div class="group" title="${this.ctl.title}"><label for="${this.control}">${this.ctl.label}
	  <button
	    name="${this.control}"
	    role="switch" 
	    aria-checked=${this.value} 
	    @click=${(e) => this._click(e)}>
	    ${this.value ? this.ctl.on : this.ctl.off}
	  </button></label></div>
	`;
  }

  _click(e) {
    this.dispatchEvent(new CustomEvent('uh-click', { detail: { control: this.control, event: e } }));
  }

}

customElements.define('uh-toggle', UhToggle);

//
// a check box button component
//
class UhCheck extends LitElement {
  static get styles() { return sharedStyles }

  static get properties() {
    return {
      control: { type: String },
      value: { type: String }
    }
  }

  render() {
      return html`
	<div class="group" title="${this.ctl.title}"><button
	    role="switch" 
	    aria-checked=${this.value} 
	    @click=${(e) => this._click(e)}>
	    ${this.value ? checkedCheckBox : uncheckedCheckBox} ${this.ctl.label}
	  </button></div>
	`;
  }

  _click(e) {
    this.dispatchEvent(new CustomEvent('uh-click', { detail: { control: this.control, event: e } }));
  }

}

customElements.define('uh-check', UhCheck);

//
// a few I haven't sorted out yet
//

//
// a terminal window
//
class UhTerminal extends LitElement {
  render() {
    return html`
	`;
  }
}

customElements.define('un-terminal', UhTerminal);

//
// an oscilloscope
//
class UhScope extends LitElement {
  render() {
    return html`
	`;
  }
}

customElements.define('uh-scope', UhScope);
