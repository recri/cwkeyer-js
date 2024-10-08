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
import { CWKeyerBase } from './CWKeyerBase.js';
import { hasakProperties } from './hasakProperties.js';
import { hasakDescriptors } from './hasakDescriptors.js'

/* eslint no-bitwise: ["error", { "allow": ["&","|","<<",'>>',"~"] }] */
export class CWKeyerHasak extends CWKeyerBase {

  // and CWKeyerDefault inherits from KeyerEvent

  constructor(context, name) {
    super(context, name, 'hasak');
    Object.defineProperties(this, hasakDescriptors);
    this._version = 0;
    // trigger exactly one roll call of set parameters on first note or nrpn
    this.on('nrpn', (nrpn, value) => this.needUpdate(nrpn, value));
    setTimeout(() => this.tickle(), 500)
  }

  activate(state) {
    super.activate(state)
    if (state) {
      this.nrpns.forEach(nrpn => this.needUpdate(nrpn))
    }
  }
  
  needUpdate(nrpn) { // , value
    const np = hasakProperties[hasakProperties[nrpn]]
    if (np && np.property) this.requestUpdate(np.property, this.getnrpn(nrpn));
  }  

  get KYRP_VERSION() { return this.nrpnvalue(hasakProperties.KYRP_VERSION.nrpn); }

  get KYRP_NRPN_SIZE() { return this.nrpnvalue(hasakProperties.KYRP_NRPN_SIZE.nrpn); }

  get KYRP_MSG_SIZE() { return this.nrpnvalue(hasakProperties.KYRP_MSG_SIZE.nrpn); }

  get KYRP_SAMPLE_RATE() { return this.nrpnvalue(hasakProperties.KYRP_SAMPLE_RATE.nrpn); }

  get KYRP_EEPROM_LENGTH() { return this.nrpnvalue(hasakProperties.KYRP_EEPROM_LENGTH.nrpn); }

  get KYRP_ID_CPU() { return this.nrpnvalue(hasakProperties.KYRP_ID_CPU.nrpn); }

  get KYRP_ID_CODEC() { return this.nrpnvalue(hasakProperties.KYRP_ID_CODEC.nrpn); }

  tickle() {
    console.log(`requesting info from ${this.name}`);
    this.sendnrpn(hasakProperties.KYRP_VERSION.nrpn, 0);
    this.sendnrpn(hasakProperties.KYRP_NRPN_SIZE.nrpn, 0);
    this.sendnrpn(hasakProperties.KYRP_MSG_SIZE.nrpn, 0);
    this.sendnrpn(hasakProperties.KYRP_SAMPLE_RATE.nrpn, 0);
    this.sendnrpn(hasakProperties.KYRP_EEPROM_LENGTH.nrpn, 0);
    this.sendnrpn(hasakProperties.KYRP_ID_CPU.nrpn, 0);
    this.sendnrpn(hasakProperties.KYRP_ID_CODEC.nrpn, 0);
    this.sendnrpn(hasakProperties.KYRP_ECHO_ALL.nrpn, 0);
  }

  sendnrpn(nrpn, val) {
    const c = this.nrpnvalue(hasakProperties.KYRP_CHAN_CC.nrpn) || this._channel || 1; 
    const cc = 0xB0|(c-1);
    this.sendmidi([cc, 99, (nrpn>>7)&127, cc, 98, nrpn&127, cc, 6, (val>>7)&127, cc, 38, val&127]);
  }

  setnrpn(nrpn, v) {
    // console.log(`setnrpn ${nrpn} ${v}`);
    this.sendnrpn(nrpn, v)
  }

  getnrpn(nrpn) {
    // console.log(`getnrpn ${nrpn} label ${hasakProperties[hasakProperties[nrpn]].label} value ${this.nrpnvalue(nrpn)}`)
    return this.nrpnvalue(nrpn)
  }
  
  setvoxnrpn(voice, nrpn, v) {
    console.log(`setvoxnrpn(${voice},${nrpn},${v})`);
    this.sendnrpn(voice*hasakProperties.KYRP_VOX_OFFSET.nrpn+nrpn, v)
  }

  getvoxnrpn(voice, nrpn) {
    const vv = this.nrpnvalue(voice*hasakProperties.KYRP_VOX_OFFSET.nrpn+nrpn)
    console.log(`getvoxnrpn(${voice},${nrpn},${vv})`);
    return (vv !== undefined) ? vv : this.getnrpn(nrpn)
  }
  
}
// Local Variables:
// mode: JavaScript
// js-indent-level: 2
// End:

