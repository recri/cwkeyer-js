//
// cwkeyer.js - a progressive web app for morse code
// Copyright (c) 2020 Roger E Critchlow Jr, Charlestown, MA, USA
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
    this._tickled = false
    this.tickleOnce = () => {
      if (this._tickled) return
      this._tickled = true
      this.off('nrpn', this.tickleOnce)
      this.off('note', this.tickleOnce)
      this.tickle();
    }
    this.on('nrpn', this.tickleOnce);
    this.on('note', this.tickleOnce);
    this.on('nrpn', (nrpn, value) => this.needUpdate(nrpn, value));
  }

  needUpdate(nrpn, value) { // , value
    const np = hasakProperties[hasakProperties[nrpn]]
    console.log(`needUpdate(${nrpn},${value}) at ${np.label}`)
    if ( ! np) {
      // console.log(`needupdate(${nrpn}, ${value}) not sent (no this.np[nrpn])`);
      return
    }
    if ( ! np.control) {
      // console.log(`needupdate(${nrpn}, ${value}) not sent (no this.np[nrpn].control)`);
      return
    }
    console.log(`needupdate(${nrpn}, ${value}) sent`);
    this.emit('update', np.control)
  }  

  get KYRP_VERSION() { return this.nrpnvalue(hasakProperties.KYRP_VERSION.value); }

  get KYRP_NRPN_SIZE() { return this.nrpnvalue(hasakProperties.KYRP_NRPN_SIZE.value); }

  get KYRP_MSG_SIZE() { return this.nrpnvalue(hasakProperties.KYRP_MSG_SIZE.value); }

  get KYRP_SAMPLE_RATE() { return this.nrpnvalue(hasakProperties.KYRP_SAMPLE_RATE.value); }

  get KYRP_EEPROM_LENGTH() { return this.nrpnvalue(hasakProperties.KYRP_EEPROM_LENGTH.value); }

  get KYRP_ID_CPU() { return this.nrpnvalue(hasakProperties.KYRP_ID_CPU.value); }

  get KYRP_ID_CODEC() { return this.nrpnvalue(hasakProperties.KYRP_ID_CODEC.value); }

  tickle() {
    console.log(`requesting info from ${this.name}`);
    this.sendnrpn(hasakProperties.KYRP_VERSION.value, 0);
    this.sendnrpn(hasakProperties.KYRP_NRPN_SIZE.value, 0);
    this.sendnrpn(hasakProperties.KYRP_MSG_SIZE.value, 0);
    this.sendnrpn(hasakProperties.KYRP_SAMPLE_RATE.value, 0);
    this.sendnrpn(hasakProperties.KYRP_EEPROM_LENGTH.value, 0);
    this.sendnrpn(hasakProperties.KYRP_ID_CPU.value, 0);
    this.sendnrpn(hasakProperties.KYRP_ID_CODEC.value, 0);
    this.sendnrpn(hasakProperties.KYRP_ECHO_ALL.value, 0);
  }

  sendnrpn(nrpn, val) {
    const c = this.nrpnvalue(hasakProperties.KYRP_CHAN_CC.value) || this._channel;
    const cc = 0xB0|(c-1);
    this.emit('midi:send', this.name, [cc, 99, (nrpn>>7)&127, cc, 98, nrpn&127, cc, 6, (val>>7)&127, cc, 38, val&127]);
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
    this.sendnrpn(voice*hasakProperties.KYRP_VOX_OFFSET.value+nrpn, v)
  }

  getvoxnrpn(voice, nrpn) {
    const vv = this.nrpnvalue(voice*hasakProperties.KYRP_VOX_OFFSET.value+nrpn)
    console.log(`getvoxnrpn(${voice},${nrpn},${vv})`);
    return (vv !== undefined) ? vv : this.getnrpn(nrpn)
  }
  
}
// Local Variables:
// mode: JavaScript
// js-indent-level: 2
// End:

