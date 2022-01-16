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
import { KeyerEvent } from './KeyerEvent.js';

// map notes and control change
/* eslint no-bitwise: ["error", { "allow": ["&","|","<<","~"] }] */
export class CWKeyerChannel extends KeyerEvent {

  constructor(context, name, channel) {
    super(context);
    this.name = name;
    this.channel = channel;
    this._notes = {};		// note state map
    this._nrpns = {};		// nrpn state map
    this._nrpn = 0;		// nrpn assembly
    this._data = 0;		// data assembly
  }

  onmidimessage(msg) {
    switch (msg[0] & 0xf0) {
    case 0x90: this._notes[msg[1]] = msg[2] === 0 ? false : msg[2]; break;
    case 0x80: this._notes[msg[1]] = false; break;
    case 0xB0:
      switch (msg[1]) {
      case 6:  this._data = (this._data&127) | ((msg[2]&127)<<7); break;
      case 38: this._data = (this._data&~127) | (msg[2]&127); this._nrpns[this._nrpn] = this._data; break;
      case 98: this._nrpn = (this._nrpn&~127) | (msg[2]&127); break;
      case 99: this._nrpn = (this._nrpn&127) | ((msg[2]&127)<<7); break;
      default:
	console.log(`CWKeyerChannel: other control change ${msg}`);
	break;
      }
      break;
    default:
      console.log(`CWKeyerChannel: other message ${msg}`);
      break;
    }
    // console.log(`CWKeyerChannel: message ${msg}`);
  }

  get nrpns() { return Object.getOwnPropertyNames(this._nrpns); }

  get notes() { return Object.getOwnPropertyNames(this._notes); }
  
  nrpnValue(nrpn) { return this._nrpns[nrpn]; }

  noteValue(note) { return this._notes[note]; }

}
// Local Variables:
// mode: JavaScript
// js-indent-level: 2
// End:
