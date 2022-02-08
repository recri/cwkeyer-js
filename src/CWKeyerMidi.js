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
/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint no-bitwise: ["error", { "allow": ["&","|","<<"] }] */
/* eslint class-methods-use-this: ["error", { "exceptMethods": ["shorten","lengthen"] }] */

import { CWKeyerEvent } from './CWKeyerEvent.js';
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
  'MidiTouchKey Port 1' : 'touchkey1',
  'MidiTouchKey Port 2' : 'touchkey2',
  'MidiTouchKey Port 3' : 'touchkey3',
  'Midi Through Port-0' : 'through0',
  'Midi Through Port-1' : 'through1',
  'Midi Through Port-2' : 'through2',
};
  
export class CWKeyerMidi extends CWKeyerEvent {
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
      console.log(`two outputs with same short name: sname ${sname} name ${name} id ${id} this.outputMap[sname] ${this.outputMap[sname]}`);
    }
    return sname;
  }

  recordInput(name, id) {
    const sname = this.shortenname(name);
    if ( ! this.inputMap[sname]) {
      this.inputMap[sname] = id;
    } else if (this.inputMap[sname] !== id) {
      console.log(`two inputs with same short name: sname ${sname} name ${name} id ${id} this.inputMap[sname] ${this.inputMap[sname]}`);
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
        .requestMIDIAccess()
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
