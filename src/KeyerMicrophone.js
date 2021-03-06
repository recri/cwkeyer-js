//
// keyer.js - a progressive web app for morse code
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

// this would decode morse heard on the microphone input
export class KeyerMicrophone extends KeyerEvent {

  constructor(context) {
    super(context);
    this.audioSource = null;
    if (navigator.getUserMedia) {
      this.promise = navigator.getUserMedia (
	{ audio: true, video: false },
        stream => { 
	  console.log(`getUserMedia returned ${stream}`);
	  this.audioSource = this.context.createMediaStreamSource(stream);
	  console.log(`createMediaStreamSource returned ${this.audioSource}`);
	},
        err => console.log(`Error initializing user media stream: ${err}`)
      );    
    } else {
      console.log(`no navigator.getUserMedia found`);
    }
  }

  async enabled() { if (this.promise) await this.promise; return this.audioSource !== null; }

}

// Local Variables: 
// mode: JavaScript
// js-indent-level: 2
// End:
