//
// cwkeyer-js - a progressive web app for morse code
// Copyright (c) 2022 Roger E Critchlow Jr, Charlestown, MA, USA
//
import { KeyerEvent } from './KeyerEvent.js';

// toplevel management of CWKeyer midi devices
/* eslint no-bitwise: ["error", { "allow": ["&"] }] */
export class CWKeyerDevice extends KeyerEvent {

  constructor(context, name) {
    super(context);
    this._name = name;
    this._type = 'unknown';
  }

  get name() { return this._name; }

  get type() { return this._keyer.type; }
  
  // keyer properties
  set pitch(v) { this.keyer.pitch = v; }

  get pitch() { return this.keyer.pitch; }

  set gain(v) { this.keyer.gain = v; }
  
  get gain() { return this.keyer.gain; }

  set speed(v) { this.keyer.speed = v; }

  get speed() { return this.keyer.speed; }

  // keyer properties for keyer timing
  set weight(v) { this.keyer.weight = v; }

  get weight() { return  this.keyer.weight; }

  set ratio(v) { this.keyer.ratio = v; }

  get ratio() { return  this.keyer.ratio; }

  set compensation(v) { this.keyer.compensation = v; }

  get compensation() { return  this.keyer.compensation; }

  set farnsworth(v) { this.keyer.farnsworth = v; }

  get farnsworth() { return  this.keyer.farnsworth; }

  // keyer properties for keying envelope
  set rise(v) { this.keyer.rise = v; }

  get rise() { return  this.keyer.rise; }

  set fall(v) { this.keyer.fall = v; }

  get fall() { return  this.keyer.fall; }

  set envelope(v) { this.keyer.envelope = v; }

  get envelope() { return  this.keyer.envelope; }

  set envelope2(v) { this.keyer.envelope2 = v; }

  get envelope2() { return  this.keyer.envelope2; }

  get envelopes() { return  this.keyer.envelopes; }
  
  // keyer properties for paddle
  set paddleSwapped(v) { this.keyer.swapped = v; }

  get paddleSwapped() { return  this.keyer.swapped; }

  get paddleKeyers() { return  this.keyer.keyers; }

  set paddleKeyer(v) { this.keyer.keyer = v; }

  get paddleKeyer() { return  this.keyer.keyer; }

  set paddleAdapt(v) { this.keyer.adapt = v; }

  get paddleAdapt() { return this.keyer.adapt; }

  // vox specific keyer properties
  get voices() { return this.keyer.voices; }
  
  set voice(v) { this.keyer.voice = v; }

  get voice() { return this.keyer.voice; }

  set voicePitch(v) {  this.keyer.vox[this.keyer.voice].pitch = v; }

  get voicePitch() { return this.keyer.vox[this.keyer.voice].pitch; }

  set voiceGain(v) { this.keyer.vox[this.keyer.voice].gain = v; }
  
  get voiceGain() { return this.keyer.vox[this.keyer.voice].gain; }

  set voiceSpeed(v) { this.keyer.vox[this.keyer.voice].speed = v; }

  get voiceSpeed() { return this.keyer.vox[this.keyer.voice].speed; }

  set voiceWeight(v) { this.keyer.vox[this.keyer.voice].weight = v; }

  get voiceWeight() { return this.keyer.vox[this.keyer.voice].weight; }

  set voiceRatio(v) { this.keyer.vox[this.keyer.voice].ratio = v; }

  get voiceRatio() { return this.keyer.vox[this.keyer.voice].ratio; }

  set voiceCompensation(v) { this.keyer.vox[this.keyer.voice].compensation = v; }

  get voiceCompensation() { return this.keyer.vox[this.keyer.voice].compensation; }

  set voiceFarnsworth(v) { this.keyer.vox[this.keyer.voice].farnsworth = v; }

  get voiceFarnsworth() { return this.keyer.vox[this.keyer.voice].farnsworth; }

}
// Local Variables:
// mode: JavaScript
// js-indent-level: 2
// End:
