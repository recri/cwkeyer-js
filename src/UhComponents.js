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
import { LitElement, html, css } from 'lit';
import { cwkeyerProperties } from './cwkeyerProperties.js'
import { cwkeyerCommonStyles, cwkeyerFolderStyles, cwkeyerComponentStyles } from './cwkeyerStyles.js'

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

//
// a folder component
// trying to pass a Boolean value is a problem, 
// so treat true and false as strings
//
class UhFolder extends LitElement {
  static get styles() { return css`${cwkeyerFolderStyles}\n${cwkeyerCommonStyles}` }

  // properties are reflected from html attributes
  static get properties() {
    return {
      value: {type:String},
      control: {type:String},
    }
  }

  connectedCallback() {
    super.connectedCallback()
    this.ctl = cwkeyerProperties[this.control]
  }

  render() {
    const pclass = this.ctl.level === 2 ? 'panel' : 'subpanel';
    const hclass = `h${Math.max(6,this.ctl.level+1)}`;
    const marker = this.value === 'true' ? shownSymbol : hiddenSymbol;
    const dclass = `${pclass} group${this.value === 'true' ? '' : ' hidden'}`;

    return html`
<div class="${pclass}" title="${this.ctl.title}">
  <button class="${hclass}" @click=${(e) => this._click(e)}>
    ${marker} ${this.ctl.label}
  </button><slot name="header"></slot>
    <div class="${dclass}"><slot></slot></div>
</div>`
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
  static get styles() { return css`${cwkeyerComponentStyles}\n${cwkeyerCommonStyles}` }

  static get properties() {
    return {
      value: { type: Number },
      control: { type: String }
    }
  }
  
  connectedCallback() {
    super.connectedCallback()
    this.ctl = cwkeyerProperties[this.control]
  }

  render() {
    return html`
	<div class="chunk" title="${this.ctl.title}">
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
  static get styles() { return css`${cwkeyerComponentStyles}\n${cwkeyerCommonStyles}` }

  static get properties() {
    return {
      value: { type: Number },
      control: { type: String }
    }
  }

  connectedCallback() {
    super.connectedCallback()
    this.ctl = cwkeyerProperties[this.control]
  }

  render() {
      return html`
	<div class="chunk" title="${this.ctl.title}">
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
	    ${this.ctl.unit && this.ctl.unit !== '' ? `(${this.ctl.unit})` : ``}
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
// .options is either [ String, ... ], where the strings are the values and the labels,
//  or [ { value: 0, label: "Option label", title: "Option title string" }, ...]
//
class UhOptions extends LitElement {

  static get styles() { return css`${cwkeyerComponentStyles}\n${cwkeyerCommonStyles}` }

  static get properties() {
    return {
      control: { type: String },
      value: { type: String },
      options: { type: Array }
    }
  }

  connectedCallback() {
    super.connectedCallback()
    this.ctl = cwkeyerProperties[this.control]
  }

  renderOption(x) {
    if ( ! x) 
      return html``
    if (x.label)
      return html`<option .value=${x.value} ?selected=${x.value === this.value} title="${x.title}">${x.label}</option>`;
    return html`<option .value=${x} ?selected=${x === this.value} title="no title for option ${x}">${x}</option>`
  }


  render() {
    return html`
<label for="${this.control}" title="${this.ctl.title}">
  ${this.ctl.label}
  <select
      name="${this.control}"
      .value=${this.value} 
      @change=${(e) => this._change(e)}>
    ${(this.options || ['empty']).map(x => this.renderOption(x))}
  </select>
</label>`
  }

  _change(e) {
    this.dispatchEvent(new CustomEvent('uh-change', { detail: { control: this.control, event: e } }));
  }

}

customElements.define('uh-options', UhOptions);

class UhMultiple extends LitElement {

  static get styles() { return css`${cwkeyerComponentStyles}\n${cwkeyerCommonStyles}` }

  static get properties() {
    return {
      control: { type: String },
      value: { type: String },
      options: { type: Array }
    }
  }

  connectedCallback() {
    super.connectedCallback()
    this.ctl = cwkeyerProperties[this.control]
  }

  renderOption(x) {
    if ( ! x) 
      return html``
    if (x.label)
      return html`<option .value=${x.value} ?selected=${x.value === this.value} title="${x.title}">${x.label}</option>`;
    return html`<option .value=${x} ?selected=${x === this.value} title="no title for option ${x}">${x}</option>`
  }


  render() {
    return html`
<label for="${this.control}" title="${this.ctl.title} multiple">
  ${this.ctl.label}
  <select
      name="${this.control}"
      .value=${this.value} 
      @change=${(e) => this._change(e)}>
    ${(this.options || ['empty']).map(x => this.renderOption(x))}
  </select>
</label>`
  }

  _change(e) {
    this.dispatchEvent(new CustomEvent('uh-change', { detail: { control: this.control, event: e } }));
  }

}

customElements.define('uh-multiple', UhMultiple);

//
// a play/pause toggle input
//
class UhToggle extends LitElement {
  static get styles() { return css`${cwkeyerComponentStyles}\n${cwkeyerCommonStyles}` }

  static get properties() {
    return {
      control: { type: String },
      value: { type: String }
    }
  }

  connectedCallback() {
    super.connectedCallback()
    this.ctl = cwkeyerProperties[this.control]
  }

  render() {
    return html`
	<div class="chunk" title="${this.ctl.title}"><label for="${this.control}">${this.ctl.label}
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
  static get styles() { return css`${cwkeyerComponentStyles}\n${cwkeyerCommonStyles}` }

  static get properties() {
    return {
      control: { type: String },
      value: { type: String }
    }
  }

  connectedCallback() {
    super.connectedCallback()
    this.ctl = cwkeyerProperties[this.control]
  }

  render() {
      return html`
	<div class="chunk" title="${this.ctl.title}"><button
	    role="switch" 
	    aria-checked=${this.value} 
	    @click=${(e) => this._click(e)}>
	    ${this.value === "true" ? checkedCheckBox : uncheckedCheckBox} ${this.ctl.label}
	  </button></div>
	`;
  }

  _click(e) {
    this.dispatchEvent(new CustomEvent('uh-click', { detail: { control: this.control, event: e } }));
  }

}

customElements.define('uh-check', UhCheck);

