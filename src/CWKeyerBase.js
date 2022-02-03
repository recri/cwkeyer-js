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

//
// map notes, nrpns, and other control change messages
// maintain a state map for the device such that current note,
// nrpn, and control change values can be retrieved
//
// also provide a base class for other keyer implementations to extend.
//
/* eslint no-bitwise: ["error", { "allow": ["&","|","<<","~"] }] */
export class CWKeyerBase extends KeyerEvent {

  constructor(context, name, type, active) {
    super(context);
    this._name = name;
    this._type = type;
    this._active = active;
    this._channels = {};
    this._channel = 0;
    this._notes = {};		// note state map
    this._ctrls = {};		// control change state map
    this._nrpns = {};		// nrpn state map
  }

  activate(state) { this._active = state }
  
  // on receipt of a midi message from our device
  onmidimessage(name, msg) {
    // console.log(`onmidimessage(${name}, ${msg[0]}, ${msg[1]}, ${msg[2]})`)
    const [cmd,,] = msg
    const chan = 1+(cmd&0xF)
    if ( ! this._channels[chan]) this._channels[chan] = 0;
    this._channels[chan] += 1;
    this._channel = chan;
    switch (cmd & 0xf0) {
    case 0x90: 			// note on, or maybe off
      this._notes[msg[1]] = msg[2] === 0 ? false : msg[2];
      this.emit('note', true, msg[1], msg[2]);
      break;
    case 0x80: 			// note off
      this._notes[msg[1]] = false; 
      this.emit('note', false, msg[1], msg[2]);
      break;
    case 0xB0: {		// control change
      const [, ctrl, data] = msg
      this._ctrls[ctrl] = data;
      if (ctrl === 38) {
	const nrpnData = (this._ctrls[6]<<7) | (data&127); 
	const nrpn = (this._ctrls[99]<<7) | this._ctrls[98]
	this._nrpns[nrpn] = nrpnData;
	this.emit('nrpn', nrpn, nrpnData);
	// console.log(`emitted nrpn ${nrpn} ${nrpnData}`);
	break;
      }
      this.emit('ctrl', ctrl, this._ctrls[ctrl])
      break;
    }
    default:
      console.log(`CWKeyerDefault: other message ${msg[0]} ${msg[1]} ${msg[2]}}`);
      break;
    }
  }

  get name() { return this._name; }

  get type() { return this._type; }
  
  get label() { return `${this.name} as ${this.type}` }
  
  get channels() { return this._channels }

  get nrpns() { return Object.keys(this._nrpns) }

  get ctrls() { return Object.keys(this._ctrls) }
  
  get notes() { return Object.keys(this._notes) }
  
  nrpnvalue(nrpn) { return this._nrpns[nrpn] }

  ctrlvalue(ctrl) { return this._ctrls[ctrl] }
  
  notevalue(note) { return this._notes[note] }

  sendmidi(message) { this.emit('midi:send', this.name, message); }

  requestUpdate(control, value) { this.emit('update', this.name, control, value); }

}
// Local Variables:
// mode: JavaScript
// js-indent-level: 2
// End:
