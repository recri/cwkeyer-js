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

import { CWKeyerDefault } from './CWKeyerDefault.js';
import { hasakProperties } from './CWKeyerHasakProperties.js';

/* eslint no-bitwise: ["error", { "allow": ["&","|","<<",'>>',"~"] }] */
export class CWKeyerHasak extends CWKeyerDefault {

  // and CWKeyerDefault inherits from KeyerEvent

  constructor(context, name) {
    super(context, name);
    this._type = 'hasak';
    this._version = 0;
    this.kp = hasakProperties;
    this.np = Object.fromEntries(Object.values(hasakProperties).filter(v => v && v.type && v.type === 'par').map(v => [v.value, v]))
    // console.log("in forEach")
    // Object.values(kyrp100).filter(v => v && v.type === 'par').forEach(v => console.log(`in forEach ${v.type} ${v.value} ${v.label}`))
    // console.log("in this.np");
    // Object.entries(this.np).forEach(([k,v]) => console.log(`in this.np ${k} ${v.label}`))
    // console.log("by ref");
    // Object.entries(this.np).forEach(([k,]) => console.log(`in this.np[${k}] ${k} ${this.np[k].label}`))
    // console.log("end poking");
    // Object.entries(this.np).forEach(([k,v]) => console.log(`in nrpn ${k} ${v.label}`))
    this._keyers = ['vk6ph', 'k1el', 'nd7pa', 'ad5dz'];
    this._envelopes = ['hann', 'blackman-harris', 'linear'];
    this._voices = ['default', 'tune', 'straight key', 'paddle', 'winkey', 'kyr', 'button'];
    // trigger exactly one roll call of set parameters on first note or nrpn
    this._tickled = false
    this.tickleOnce = () => {
      if (this._tickled) return
      this._tickled = true
      this.off('nrpn', this.tickleOnce)
      this.off('note', this.tickleOnce)
      this.tickle();
    }
    this.on('nrpn', this.tickleOnce);
    this.on('note', this.tickleOnce);
    this.on('nrpn', (nrpn, value) => this.needUpdate(nrpn, value));
  }

  needUpdate(nrpn) { // , value
    if ( ! this.np) {
      // console.log(`needupdate(${nrpn}, ${value}) not sent (no this.np)`);
      return
    }
    if ( ! this.np[nrpn]) {
      // console.log(`needupdate(${nrpn}, ${value}) not sent (no this.np[nrpn])`);
      return
    }
    if ( ! this.np[nrpn].control) {
      // console.log(`needupdate(${nrpn}, ${value}) not sent (no this.np[nrpn].control)`);
      return
    }
    // console.log(`needupdate(${nrpn}, ${value}) sent`);
    this.emit('update', this.np[nrpn].control)
  }  

  get KYRP_VERSION() { return this.nrpnvalue(this.kp.KYRP_VERSION); }

  get KYRP_NRPN_SIZE() { return this.nrpnvalue(this.kp.KYRP_NRPN_SIZE); }

  get KYRP_MSG_SIZE() { return this.nrpnvalue(this.kp.KYRP_MSG_SIZE); }

  get KYRP_SAMPLE_RATE() { return this.nrpnvalue(this.kp.KYRP_SAMPLE_RATE); }

  get KYRP_EEPROM_LENGTH() { return this.nrpnvalue(this.kp.KYRP_EEPROM_LENGTH); }

  get KYRP_ID_CPU() { return this.nrpnvalue(this.kp.KYRP_ID_CPU); }

  get KYRP_ID_CODEC() { return this.nrpnvalue(this.kp.KYRP_ID_CODEC); }

  tickle() {
    console.log(`requesting info from ${this.name}`);
    this.sendnrpn(this.kp.KYRP_VERSION.value, 0);
    this.sendnrpn(this.kp.KYRP_NRPN_SIZE.value, 0);
    this.sendnrpn(this.kp.KYRP_MSG_SIZE.value, 0);
    this.sendnrpn(this.kp.KYRP_SAMPLE_RATE.value, 0);
    this.sendnrpn(this.kp.KYRP_EEPROM_LENGTH.value, 0);
    this.sendnrpn(this.kp.KYRP_ID_CPU.value, 0);
    this.sendnrpn(this.kp.KYRP_ID_CODEC.value, 0);
    this.sendnrpn(this.kp.KYRP_ECHO_ALL.value, 0);
  }

  sendnrpn(nrpn, val) {
    const c = this.nrpnvalue(this.kp.KYRP_CHAN_RECV_CC.value) || this._channel;
    const cc = 0xB0|(c-1);
    this.emit('midi:send', this.name, [cc, 99, (nrpn>>7)&127, cc, 98, nrpn&127, cc, 6, (val>>7)&127, cc, 38, val&127]);
  }

  setnrpn(kyrp, v) {
    // console.log(`setnrpn ${kyrp} ${v}`);
    this.sendnrpn(kyrp.value, v)
  }

  getnrpn(kyrp) {
    // console.log(`getnrpn ${kyrp.value} label ${kyrp.label} value ${this.nrpnvalue(kyrp.value)}`)
    return this.nrpnvalue(kyrp.value)
  }
  
  setvoxnrpn(voice, kyrp, v) {
    this.sendnrpn(voice*this.kp.KYRP_VOX_OFFSET.value+kyrp.value, v)
  }

  getvoxnrpn(voice, kyrp) {
    const vv = this.nrpnvalue(voice*this.kp.KYRP_VOX_OFFSET.value+kyrp.value)
    return (vv !== undefined) ? vv : this.getnrpn(kyrp)
  }
  
  // keyer properties

  set masterVolumne(v) { this.setnrpn(this.kp.KYRP_VOLUME, Math.round(4*v)); }

  get masterVolume() { return this.getnrpn(this.kp.KYRP_VOLUME)/4.0; }

  set pitch(v) { this.setnrpn(this.kp.KYRP_TONE, v); }

  get pitch() { return this.getnrpn(this.kp.KYRP_TONE); }

  set sidetoneVolume(v) { this.setnrpn(this.kp.KYRP_LEVEL, Math.round(4*v)); }
  
  get sidetoneVolume() { return this.getnrpn(this.kp.KYRP_LEVEL)/4.0; }

  set speed(v) { this.setnrpn(this.kp.KYRP_SPEED, v); }

  get speed() { return this.getnrpn(this.kp.KYRP_SPEED); }

  // keyer properties for keyer timing

  set weight(v) { this.setnrpn(this.kp.KYRP_WEIGHT, v); }

  get weight() { return this.getnrpn(this.kp.KYRP_WEIGHT); }

  set ratio(v) { this.setnrpn(this.kp.KYRP_RATIO, v); }

  get ratio() { return this.getnrpn(this.kp.KYRP_RATIO); }

  set compensation(v) { this.setnrpn(this.kp.KYRP_COMP, v); }

  get compensation() { return this.getnrpn(this.kp.KYRP_COMP); }

  set farnsworth(v) { this.setnrpn(this.kp.KYRP_FARNS, v); }

  get farnsworth() { return this.getnrpn(this.kp.KYRP_FARNS); }

  // keyer properties for keying envelope

  set riseTime(v) { this.setnrpn(this.kp.KYRP_RISE_TIME, v); }

  get riseTime() { return this.getnrpn(this.kp.KYRP_RISE_TIME); }

  set fallTime(v) { this.setnrpn(this.kp.KYRP_FALL_TIME, v); }

  get fallTime() { return this.getnrpn(this.kp.KYRP_FALL_TIME); }

  set riseRamp(v) { this.setnrpn(this.kp.KYRP_RISE_RAMP, v); }

  get riseRamp() { return this.getnrpn(this.kp.KYRP_RISE_RAMP); }

  set fallRamp(v) { this.setnrpn(this.kp.KYRP_FALL_RAMP, v); }

  get fallRamp() { return this.getnrpn(this.kp.KYRP_FALL_RAMP); }

  get envelopes() { return this._envelopes; }
  
  // keyer properties for paddle

  set paddleSwapped(v) { this.setnrpn(this.kp.KYRP_SWAP, v); }

  get paddleSwapped() { return this.getnrpn(this.kp.KYRP_SWAP); }

  get paddleKeyers() { return this._keyers; }

  set paddleKeyer(v) { this.setnrpn(this.kp.KYRP_PAD_KEYER, v); }

  get paddleKeyer() { return this.getnrpn(this.kp.KYRP_PAD_KEYER); }

  set paddleAdapt(v) { this.setnrpn(this.kp.KYRP_PAD_ADAPT, v); }

  get paddleAdapt() { return this.getnrpn(this.kp.KYRP_PAD_ADAPT); }

  // vox specific keyer properties

  get voices() { return this._voices; }
  
  set voice(v) { this._voice = v; }

  get voice() { return this._voice; }

  set voicePitch(v) {  this.setvoxnrpn(this._voice, this.kp.KYRP_TONE, v); }

  get voicePitch() { return this.getvoxnrpn(this._voice, this.kp.KYRP_TONE); }

  set voiceGain(v) { this.setvoxnrpn(this._voice, this.kp.KYRP_LEVEL, v); }
  
  get voiceGain() { return this.getvoxnrpn(this._voice, this.kp.KYRP_LEVEL); }

  set voiceSpeed(v) { this.setvoxnrpn(this._voice, this.kp.KYRP_SPEED, v); }

  get voiceSpeed() { return this.getvoxnrpn(this._voice, this.kp.KYRP_SPEED); }

  set voiceWeight(v) { this.setvoxnrpn(this._voice, this.kp.KYRP_WEIGHT, v); }

  get voiceWeight() { return this.getvoxnrpn(this._voice, this.kp.KYRP_WEIGHT); }

  set voiceRatio(v) { this.setvoxnrpn(this._voice, this.kp.KYRP_RATIO, v); }

  get voiceRatio() { return this.getvoxnrpn(this._voice, this.kp.KYRP_RATIO); }

  set voiceCompensation(v) { this.setvoxnrpn(this._voice, this.kp.KYRP_COMP, v); }

  get voiceCompensation() { return this.getvoxnrpn(this._voice, this.kp.KYRP_COMP); }

  set voiceFarnsworth(v) { this.setvoxnrpn(this._voice, this.kp.KYRP_FARNS, v); }

  get voiceFarnsworth() { return this.getvoxnrpn(this._voice, this.kp.KYRP_FARNS); }
}
// Local Variables:
// mode: JavaScript
// js-indent-level: 2
// End:

