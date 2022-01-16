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

/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint no-bitwise: ["error", { "allow": ["&","|","<<"] }] */
/* eslint class-methods-use-this: ["error", { "exceptMethods": ["shorten","lengthen"] }] */

import { KeyerEvent } from './KeyerEvent.js';
/*
 ** The MIDI interface may need to be enabled in chrome://flags,
 ** but even then it may not implement everything needed.
 **
 ** This works in chrome-stable as of 2020-11-04, Version 86.0.4240.111 (Official Build) (64-bit)
 */

export class KeyerMidiSource extends KeyerEvent {
  constructor(context) {
    super(context);
    this.midiAvailable = false;
    this.midiAccess = null;	// global MIDIAccess object
    this.notesCache = [];	// device:notes received
    this.notesList = [];	// cache of device:notes list
    this.controlsCache = [];	// per name list of controls
    this.controlsList = [];	// cache of device:controls list
    this.namesList = [];	// cache of device names list
    this.rawNamesList = [];
    this.refresh();
  }

  cacheNote(note) {
    if (this.notesCache[note] === undefined) {
      // console.log(`adding midi:note ${note} to notesCache`);
      this.notesCache[note] = true;
      this.notesList = ['None'].concat(Array.from(Object.keys(this.notesCache)).sort())
      this.emit('midi:notes');
    }
  }

  cacheControl(note) {
    if (this.controlsCache[note] === undefined) {
      this.controlsCache[note] = true;
      this.controlsList = ['None'].concat(Array.from(Object.keys(this.controlsCache)).sort())
      this.emit('midi:controls');
    }
  }
  
  onmidimessage(name, e) { 
    // accumulate the NoteOn/NoteOff events seen channel:note
    if (e.data.length === 3) {
      this.emit('midi:message', name, e.data);
      const note = `${name}:${1+(e.data[0]&0x0F)}:${e.data[1]}`; // device:channel:note 
      switch (e.data[0] & 0xf0) {
      case 0x90:		// note on
	this.cacheNote(note);
	this.emit('midi:event', note, e.data[2] !== 0);
	break;
      case 0x80:		// note off
	this.cacheNote(note);
	this.emit('midi:event', note, false);
        break;
      case 0xB0:
	this.cacheControl(note);
	break;
      default:
	break
      }
    }
  }
  
  // shortened names would be nice.
  shorten(name) { return name; }

  lengthen(name) { return name; }

  get names() { return this.namesList; }
  
  get rawnames() { return this.rawNamesList; }
  
  get inputs() { return this.midiAccess ? Array.from(this.midiAccess.inputs.values()) : []; }

  get outputs() { return this.midiAccess ? Array.from(this.midiAccess.outputs.values()) : []; }

  get notes() { return this.notesList; }

  get controls() { return this.controlsList; }
  
  // filter the notesCache for loss/gain of devices
  rebind() {
    const { notesCache, controlsCache } = this;
    this.notesCache = []
    this.controlsCache = []
    this.inputs.forEach(input => {
      const name = this.shorten(input.name);
      // console.log(`rebind ${input.name} to ${name}`);
      notesCache.forEach(note => { if (note.startsWith(name)) this.notesCache[note] = true; });
      controlsCache.forEach(note => { if (note.startsWith(name)) this.controlsCache[note] = true; });
      input.onmidimessage = e => this.onmidimessage(name, e)
    });
    this.notesList = ['None'].concat(Array.from(Object.keys(this.notesCache)).sort())
    this.controlsList = ['None'].concat(Array.from(Object.keys(this.controlsCache)).sort())
    this.rawNamesList = ['None'].concat(this.midiAccess ? this.inputs.map(input => input.name) : []);
    this.namesList = this.rawNamesList.map(name => this.shorten(name));
    this.emit('midi:notes');
    this.emit('midi:controls');
    this.emit('midi:names');
  }

  onStateChange() { this.rebind() }
  
  onMIDISuccess(midiAccess) {
    this.midiAccess = midiAccess;
    this.midiAvailable = true;
    this.midiAccess.onstatechange = (event) => this.onStateChange(event);
    this.rebind();
  }

  onMIDIFailure() {
    this.midiAccess = null;

    this.rebind();
  }

  refresh() {
    if (navigator.requestMIDIAccess) {
      navigator
        .requestMIDIAccess({ sysex: false })
        .then((...args) => this.onMIDISuccess(...args), (...args) => this.onMIDIFailure(...args));
    } else {
      console.log("no navigator.requestMIDIAccess found");
    }
  }

}
// Local Variables: 
// mode: JavaScript
// js-indent-level: 2
// End:
