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

// delegate channels to channel handler
/* eslint no-bitwise: ["error", { "allow": ["&"] }] */
export class CWKeyerChannels extends KeyerEvent {

  constructor(context, name) {
    super(context);

    this.name = name;
    this._maps = [];
    this._channels = []
    this._channel = null;
  }

  onmidimessage(msg) {
    const channel = 1+(msg[0]&0x0F);
    if ( ! {}.hasOwnProperty.call(this._channels, channel)) {
      this._channels.push(channel);
      this._maps[channel] = new CWKeyerChannel(this.context, this.name, channel);
      if (this.channel === null) this._channel = channel
    }
    this._maps[channel].onmidimessage(msg);
    // console.log(`CWKeyerChannels midi:message ${msg}`);
  }

  set channel(channel) { this._channel = channel; }
  
  get nrpns() { return this._maps[this._channel].nrpns; }

  get notes() { return this._maps[this._channel].notes; }

  nrpnValue(nrpn) { return this._maps[this._channel].nrpnValue(nrpn); }

  noteValue(note) { return this._maps[this._channel].noteValue(note); }

}
// Local Variables:
// mode: JavaScript
// js-indent-level: 2
// End:
