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
export class CWKeyerDefault extends KeyerEvent {

  constructor(context, name) {
    super(context);
    this._name = name;
    this._type = 'default'
    this._active = true;
    this._channels = {};
    this._channel = 0;
    this._notes = {};		// note state map
    this._ctrls = {};		// control change state map
    this._nrpns = {};		// nrpn state map
    this._nrpn = 0;		// nrpn assembly
    this._data = 0;		// data assembly
  }

  onmidimessage(name, msg) {
    const chan = 1+(msg[0]&0xF)
    if ( ! this._channels[chan]) this._channels[chan] = 0;
    this._channels[chan] += 1;
    this._channel = chan;
    switch (msg[0] & 0xf0) {
    case 0x90:
      this._notes[msg[1]] = msg[2] === 0 ? false : msg[2];
      this.emit('note', true, msg[1], msg[2]);
      break;
    case 0x80: this._notes[msg[1]] = false; 
      this.emit('note', false, msg[1], msg[2]);
      break;
    case 0xB0:
      switch (msg[1]) {
      case 99: 
	this._nrpn = (this._nrpn&127) | ((msg[2]&127)<<7);
	break;
      case 98:
	this._nrpn = (this._nrpn&~127) | (msg[2]&127);
	break;
      case 6:
	this._data = (this._data&127) | ((msg[2]&127)<<7);
	break;
      case 38:
	this._data = (this._data&~127) | (msg[2]&127); 
	this._nrpns[this._nrpn] = this._data;
	this.emit('nrpn', this._nrpn, this._data);
	break;
      default:
	console.log(`CWKeyerDefault: other control change ${msg[0]} ${msg[1]} ${msg[2]}`);
	break;
      }
      break;
    default:
      console.log(`CWKeyerDefault: other message ${msg[0]} ${msg[1]} ${msg[2]}}`);
      break;
    }
  }

  get channels() { return this._channels; }

  get nrpns() { return Object.getOwnPropertyNames(this._nrpns); }

  get notes() { return Object.getOwnPropertyNames(this._notes); }
  
  nrpnvalue(nrpn) { return this._nrpns[nrpn]; }

  notevalue(note) { return this._notes[note]; }

  get name() { return this._name; }

  get type() { return this._type; }
  
  // keyer properties

  set pitch(v) { this._pitch = v; }

  get pitch() { return this._pitch; }

  set gain(v) { this._gain = v; }
  
  get gain() { return this._gain; }

  set speed(v) { this._speed = v; }

  get speed() { return this._speed; }

  // keyer properties for keyer timing

  set weight(v) { this._weight = v; }

  get weight() { return this._weight; }

  set ratio(v) { this._ratio = v; }

  get ratio() { return  this._ratio; }

  set compensation(v) { this._compensation = v; }

  get compensation() { return  this._compensation; }

  set farnsworth(v) { this._farnsworth = v; }

  get farnsworth() { return  this._farnsworth; }

  // keyer properties for keying envelope

  set rise(v) { this._rise = v; }

  get rise() { return this._rise; }

  set fall(v) { this._fall = v; }

  get fall() { return  this._fall; }

  set envelope(v) { this._envelope = v; }

  get envelope() { return  this._envelope; }

  set envelope2(v) { this._envelope2 = v; }

  get envelope2() { return  this._envelope2; }

  get envelopes() { return  this._envelopes; }
  
  // keyer properties for paddle

  set paddleSwapped(v) { this._swapped = v; }

  get paddleSwapped() { return  this._swapped; }

  get paddleKeyers() { return  this._keyers; }

  set paddleKeyer(v) { this._keyer = v; }

  get paddleKeyer() { return this._keyer; }

  set paddleAdapt(v) { this._adapt = v; }

  get paddleAdapt() { return this._adapt; }

  // vox specific keyer properties

  get voices() { return this._voices; }
  
  set voice(v) { this._voice = v; }

  get voice() { return this._voice; }

  set voicePitch(v) {  this._vox[this._voice].pitch = v; }

  get voicePitch() { return this._vox[this._voice].pitch; }

  set voiceGain(v) { this._vox[this._voice].gain = v; }
  
  get voiceGain() { return this._vox[this._voice].gain; }

  set voiceSpeed(v) { this._vox[this._voice].speed = v; }

  get voiceSpeed() { return this._vox[this._voice].speed; }

  set voiceWeight(v) { this._vox[this._voice].weight = v; }

  get voiceWeight() { return this._vox[this._voice].weight; }

  set voiceRatio(v) { this._vox[this._voice].ratio = v; }

  get voiceRatio() { return this._vox[this._voice].ratio; }

  set voiceCompensation(v) { this._vox[this._voice].compensation = v; }

  get voiceCompensation() { return this._vox[this._voice].compensation; }

  set voiceFarnsworth(v) { this._vox[this._voice].farnsworth = v; }

  get voiceFarnsworth() { return this._vox[this._voice].farnsworth; }

}
// Local Variables:
// mode: JavaScript
// js-indent-level: 2
// End:
