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
import { CWKeyerBase } from './CWKeyerBase.js';
import { hasakProperties } from './hasakProperties.js';
import { hasakDescriptors } from './hasakDescriptors.js'

/* eslint no-bitwise: off */

const morseCharSet = '!"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`'

// translate integer morse code to string code
function codeToString(c) {
  const s = []
  for (let code = c; code !== 1; code >>= 1)
    s.push((code & 1) ? '-' : '.')
  return s.join('')
}

// translate string morse code to integer code
function stringToCode(s) {
  let c = 1
  s.split('').reverse().forEach(e => { c <<= 1; c |= e === '-' ? 1 : 0 })
  return c
}

// sign extend an arbitrary number of bits
// thanks to stackexchange
function uncomplement(val, bitwidth) {
  const isnegative = val & (1 << (bitwidth - 1));
  const boundary = (1 << bitwidth);
  const minval = -boundary;
  const mask = boundary - 1;
  return isnegative ? minval + (val & mask) : val;
}

// sign extend a 14 bit number
function signextend14(val) { return uncomplement(val, 14) }

// mask an int to 14 bits
function mask14(val) { return val&0x3fff }
  
export class CWKeyerHasak extends CWKeyerBase {

  // and CWKeyerDefault inherits from KeyerEvent

  constructor(context, name) {
    super(context, name, 'hasak');
    Object.defineProperties(this, hasakDescriptors);
    this.on('nrpn', (nrpn, value) => this.needUpdate(nrpn, value));
    // trigger a roll call of set parameters in half a second
    setTimeout(() => this.tickle(), 500)
  }

  /* eslint-disable class-methods-use-this */
  // override base on this one
  nrpnname(nrpn) { 
    if (hasakProperties[nrpn]) 
      return hasakProperties[nrpn].slice(5)
    if (nrpn >= hasakProperties.KYRP_MORSE.nrpn && nrpn < hasakProperties.KYRP_MORSE.nrpn+64)
      return `MORSE['${morseCharSet[nrpn-hasakProperties.KYRP_MORSE.nrpn]}']`
    if (nrpn >= hasakProperties.KYRP_MIXER.nrpn && nrpn < hasakProperties.KYRP_MIXER.nrpn+24)
      return `MIXER[${nrpn-hasakProperties.KYRP_MIXER.nrpn}]`
    if (nrpn >= hasakProperties.KYRP_VOX_TUNE.nrpn && nrpn < hasakProperties.KYRP_VOX_BUT.nrpn+hasakProperties.KYRP_VOX_OFFSET.nrpn) {
      const offset = nrpn - hasakProperties.KYRP_VOX_NONE.nrpn
      const vox = Math.floor(offset /  hasakProperties.KYRP_VOX_OFFSET.nrpn);
      const slot = offset % hasakProperties.KYRP_VOX_OFFSET.nrpn + hasakProperties.KYRP_VOX_NONE.nrpn;
      return `vox[${vox}].${hasakProperties[slot].slice(5)}`
    }
    console.log(`nrpname ${nrpn} -> ${hasakProperties[nrpn]}`)
    return `${hasakProperties[nrpn] ? hasakProperties[nrpn].slice(5) : nrpn}`
  }
  /* eslint-enable class-methods-use-this */

  // given that this.mixer is one of the mixers strings
  // fetch or set the mixer value
  get mixerValue() {
    const i = this.mixers.findIndex(x => x === this.mixer)
    if ( ! i && i !== 0) return undefined
    const nrpn = hasakProperties.KYRP_MIXER.nrpn+i
    return signextend14(this.getnrpn(nrpn))
  }

  set mixerValue(v) {
    const i = this.mixers.findIndex(x => x === this.mixer)
    if ( ! i && i !== 0) return
    const nrpn = hasakProperties.KYRP_MIXER.nrpn+i
    this.setnrpn(nrpn, mask14(v))
  }

  // given that code is set to one of the code strings
  // fetch or set the mixer value
  get codeValue() {
    const i = this.codes.findIndex(x => x === this.code)
    if ( ! i && i !== 0) return undefined
    const nrpn = hasakProperties.KYRP_MORSE.nrpn+i;
    const c = this.getnrpn(nrpn)
    return codeToString(c)
  }

  set codeValue(v) {
    const i = this.codes.findIndex(x => x === this.code)
    if ( ! i && i !== 0) return
    const nrpn = hasakProperties.KYRP_MORSE.nrpn+i;
    this.setnrpn(nrpn, stringToCode(v))
  }
  
  activate(state) {
    super.activate(state)
    if (state) {
      this.nrpns.forEach(nrpn => this.needUpdate(nrpn))
    }
  }
  
  // nrpn notification happens before the nrpn array element is updated
  // this allows access to the oldvalue for the lit-element requestUpdate
  needUpdate(nrpn) { // , value
    const np = hasakProperties[hasakProperties[nrpn]]
    if (np && np.property) this.requestUpdate(np.property);
  }  

  tickle() {
    // console.log(`requesting info from ${this.name}`);
    this.sendnrpn(hasakProperties.KYRP_ID_KEYER.nrpn, 0);
    this.sendnrpn(hasakProperties.KYRP_ID_VERSION.nrpn, 0);
    this.sendnrpn(hasakProperties.KYRP_NRPN_SIZE.nrpn, 0);
    this.sendnrpn(hasakProperties.KYRP_MSG_SIZE.nrpn, 0);
    this.sendnrpn(hasakProperties.KYRP_SAMPLE_RATE.nrpn, 0);
    this.sendnrpn(hasakProperties.KYRP_EEPROM_LENGTH.nrpn, 0);
    this.sendnrpn(hasakProperties.KYRP_ID_CPU.nrpn, 0);
    this.sendnrpn(hasakProperties.KYRP_ID_CODEC.nrpn, 0);
    this.sendnrpn(hasakProperties.KYRP_ECHO_ALL.nrpn, 0);
  }

  // these should be batched to debounce UI value streams
  sendnrpn(nrpn, val) {
    const c = this.nrpnvalue(hasakProperties.KYRP_CHAN_CC.nrpn) || this._channel || 1; 
    const cc = 0xB0|(c-1);
    this.sendmidi([cc, 99, (nrpn>>7)&127, cc, 98, nrpn&127, cc, 6, (val>>7)&127, cc, 38, val&127]);
  }

  setnrpn(nrpn, v) {
    // console.log(`setnrpn ${nrpn} ${v}`);
    this.sendnrpn(nrpn, v)
  }

  getnrpn(nrpn) {
    // console.log(`getnrpn ${nrpn} label ${hasakProperties[hasakProperties[nrpn]].label} value ${this.nrpnvalue(nrpn)}`)
    return this.nrpnvalue(nrpn)
  }
  
  setvoxnrpn(voice, nrpn, v) {
    console.log(`setvoxnrpn(${voice},${nrpn},${v})`);
    this.sendnrpn(voice*hasakProperties.KYRP_VOX_OFFSET.nrpn+nrpn, v)
  }

  getvoxnrpn(voice, nrpn) {
    const vv = this.nrpnvalue(voice*hasakProperties.KYRP_VOX_OFFSET.nrpn+nrpn)
    console.log(`getvoxnrpn(${voice},${nrpn},${vv})`);
    return (vv !== undefined) ? vv : this.getnrpn(nrpn)
  }
  
}
// Local Variables:
// mode: JavaScript
// js-indent-level: 2
// End:

