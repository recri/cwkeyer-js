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

const knownMidiNames = {
  'hasak MIDI 1': 'hasak1',
  'hasak MIDI 2': 'hasak2',
  'hasak MIDI 3': 'hasak3',
  'Midi Through Port-0' : 'through0',
  'Midi Through Port-1' : 'through1',
  'Midi Through Port-2' : 'through2',
};
  
export class KeyerMidiSource extends KeyerEvent {
  constructor(context) {
    super(context);
    this.midiAvailable = false;
    this.midiAccess = null;	// global MIDIAccess object
    this.notesCache = [];	// device:notes received
    this.notesList = [];	// cache of device:notes list
    this.controlsCache = [];	// per name list of controls
    this.controlsList = [];	// cache of device:controls list
    this._shorten = {};		// full name to shortened name map
    this._lengthen = {}; 	// shortened name to full name map
    this.outputMap = {};
    this.inputMap = {};
    this.on('midi:send', (name, msg) => this.onMIDISend(name, msg))
    this.refresh();
  }

  cacheNote(note) {
    if (this.notesCache[note] === undefined) {
      // console.log(`adding midi:note ${note} to notesCache`);
      this.notesCache[note] = 0;
      this.notesList = [].concat(Array.from(Object.keys(this.notesCache)).sort())
      this.emit('midi:notes');
    }
    this.notesCache[note] += 1;
  }

  cacheControl(note) {
    if (this.controlsCache[note] === undefined) {
      this.controlsCache[note] = 0;
      this.controlsList = [].concat(Array.from(Object.keys(this.controlsCache)).sort())
      this.emit('midi:controls');
    }
    this.controlsCache[note] += 1;
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
      case 0xB0:		// control change
	this.cacheControl(note);
	break;
      default:
	break
      }
    }
  }
  
  shortenname(name) {
    if ( ! this._shorten[name]) {
      if (knownMidiNames[name]) {
	this._shorten[name] = knownMidiNames[name]
	this._lengthen[knownMidiNames[name]] = name
      } else {
	this._shorten[name] = name
	this._lengthen[name] = name
      }
    }
    return this._shorten[name];
  }

  recordOutput(name, id) {
    const sname = this.shortenname(name);
    if ( ! this.outputMap[sname]) {
      this.outputMap[sname] = id;
    } else if (this.outputMap[sname] !== id) {
      console.log(`two outputs with same short name: sname ${sname} name ${name} id ${id} outputMap[sname] ${outputMap[sname]}`);
    }
    return sname;
  }

  recordInput(name, id) {
    const sname = this.shortenname(name);
    if ( ! this.inputMap[sname]) {
      this.inputMap[sname] = id;
    } else if (this.inputMap[sname] !== id) {
      console.log(`two inputs with same short name: sname ${sname} name ${name} id ${id} inputMap[sname] ${inputMap[sname]}`);
    }
    return sname;
  }

  shorten(name) { return this._shorten[name] }

  lengthen(name) { return this._lengthen[name]; }

  get names() { return Object.getOwnPropertyNames(this._lengthen); }
  
  get rawnames() { return Object.getOwnPropertyNames(this._shorten); }
  
  get inputs() { return this.midiAccess ? Array.from(this.midiAccess.inputs.values()) : []; }

  get outputs() { return this.midiAccess ? Array.from(this.midiAccess.outputs.values()) : []; }

  get notes() { return this.notesList; }

  get controls() { return this.controlsList; }
  
  output(name) { return this.midiAccess.outputs.get(this.outputMap[name]); }

  input(name) { return this.midiAccess.inputs.get(this.inputMap[name]); }
  
  // filter the notesCache for loss/gain of devices
  rebind() {
    const { notesCache, controlsCache } = this;
    this.notesCache = []
    this.controlsCache = []
    this.inputMap = {}
    this.outputMap = {}
    this._shorten = {}
    this._lengthen = {}
    this.inputs.forEach(input => {
      const name = this.recordInput(input.name, input.id);
      // console.log(`rebind ${input.name} to ${name}`);
      notesCache.forEach(note => { if (note.startsWith(name)) this.notesCache[note] = true; });
      controlsCache.forEach(note => { if (note.startsWith(name)) this.controlsCache[note] = true; });
      input.onmidimessage = e => this.onmidimessage(name, e)
    });
    this.outputs.forEach(output => this.recordOutput(output.name, output.id))
    this.notesList = ['None'].concat(Array.from(Object.keys(this.notesCache)).sort())
    this.controlsList = ['None'].concat(Array.from(Object.keys(this.controlsCache)).sort())
    this.emit('midi:notes');
    this.emit('midi:controls');
    this.emit('midi:names');
  }

  onMIDISend(name, data) {
    const out = this.output(name)
    if (out) out.send(data)
    // console.log(`KeyerMidiSource.send midi ${name} ${data} to ${out}`);
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
