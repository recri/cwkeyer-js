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
import { CWKeyerChannel } from './CWKeyerChannel.js';

// toplevel management of CWKeyer midi events
// delegate to the channels manager for the device name
/* eslint no-bitwise: ["error", { "allow": ["&"] }] */
export class CWKeyer extends KeyerEvent {

  constructor(context) {
    super(context);
    this._name = null;
    this._names = []
    this._devices = [];
  }

  onmidimessage(midi, msg) {
    const chan = `${midi}:${1+(msg[0]&0x0f)}`;
    if (! {}.hasOwnProperty.call(this._devices, chan)) {
      this._devices[chan] = new CWKeyerChannel(this.context, chan);
      this._names.push(chan);
      if (this._name === null) this._name = chan;
    }
    this._devices[chan].onmidimessage(msg);
    // console.log(`CWKeyer midi:message ${name} ${msg}`);
  }

  get name() { return this._name; }

  set name(name) { this._name = name; }
  
  get nrpns() { return this._devices[this._name].nrpns; }

  get notes() { return this._devices[this._name].notes; }

  nrpnValue(nrpn) { return this._devices[this._name].nrpnValue(nrpn); }

  noteValue(note) { return this._devices[this._name].noteValue(note); }

}
// Local Variables:
// mode: JavaScript
// js-indent-level: 2
// End:
