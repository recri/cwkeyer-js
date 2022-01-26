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

// parameter map for hasak 100
// generated with .../hasak/doc/nrpn.tcl from .../hasak/config.h
const cwkeyerhasak100 = {
  KYR_N_VOX: {value: "6", type: "def", label: "number of keyer voices"},
    KYR_VOX_NONE: {value: "0", type: "def", label: "no active voice, default parameters for other voices"},
    KYR_VOX_TUNE: {value: "1", type: "def", label: "tune switch"},
    KYR_VOX_S_KEY: {value: "2", type: "def", label: "Straight Key"},
    KYR_VOX_PAD: {value: "3", type: "def", label: "Paddle"},
    KYR_VOX_WINK: {value: "4", type: "def", label: "Winkey Key"},
    KYR_VOX_KYR: {value: "5", type: "def", label: "Kyr Key"},
    KYR_VOX_BUT: {value: "6", type: "def", label: "headset button straight key"},
    KYR_CC_MSB: {value: "6", type: "def", label: "MIDI control change Data Entry (MSB)"},
    KYR_CC_LSB: {value: "38", type: "def", label: "MIDI control change Data Entry (LSB)"},
    KYR_CC_NRPN_LSB: {value: "98", type: "def", label: "MIDI control change Non-registered Parameter (LSB)"},
    KYR_CC_NRPN_MSB: {value: "99", type: "def", label: "MIDI control change Non-registered Parameter (MSB)"},
    KYRV_NOT_SET: {value: "-1", type: "val", label: "16 bit not set value"},
    KYRV_MASK: {value: "16383", type: "val", label: "14 bit mask"},
    KYRP_FIRST: {value: "0", type: "rel", label: "base of nrpns"},
    KYRP_CODEC: {value: "0", type: "rel", label: "base of codec nrpns"},
    KYRP_VOLUME: {value: "0", type: "par", label: "output volume", units: "dB/2", range: "0 127"},
    KYRP_INPUT_SELECT: {value: "1", type: "par", label: "input select", values: "KYRV_INPUT_*"},
    KYRV_INPUT_MIC: {value: "0", type: "val", label: "input select microphone"},
    KYRV_INPUT_LINE: {value: "1", type: "val", label: "input select line in"},
    KYRP_INPUT_LEVEL: {value: "2", type: "par", label: "input level", range: "0 127", units: "pp127"},
    KYRP_SOFT: {value: "3", type: "rel", label: "base of soft params"},
    KYRP_BUTTON_0: {value: "3", type: "par", label: "headset button 0 - none pressed", range: "-8192 8191", units: "adc", ignore: "1"},
    KYRP_BUTTON_1: {value: "4", type: "par", label: "headset button 1 - center or only pressed", range: "-8192 8191", units: "adc", ignore: "1"},
    KYRP_BUTTON_2: {value: "5", type: "par", label: "headset button 2 - up pressed", range: "-8192 8191", units: "adc", ignore: "1"},
    KYRP_BUTTON_3: {value: "6", type: "par", label: "headset button 3 - down pressed", range: "-8192 8191", units: "adc", ignore: "1"},
    KYRP_BUTTON_4: {value: "7", type: "par", label: "headset button 4 - hey pressed", range: "-8192 8191", units: "adc", ignore: "1"},
    KYRP_PTT_ENABLE: {value: "8", type: "par", label: "require EXT_PTT to transmit", range: "0 1", ignore: "1"},
    KYRP_IQ_ENABLE: {value: "9", type: "par", label: "IQ mode", values: "KYRV_IQ_*"},
    KYRV_IQ_NONE: {value: "0", type: "val", label: "no IQ"},
    KYRV_IQ_LSB: {value: "1", type: "val", label: "IQ for lower sideband"},
    KYRV_IQ_USB: {value: "2", type: "val", label: "IQ for upper sideband"},
    KYRP_IQ_ADJUST: {value: "10", type: "par", label: "adjustment to IQ phase", range: "-8192 8191", units: "pp8191", ignore: "1"},
    KYRP_TX_ENABLE: {value: "11", type: "par", label: "soft enable TX", range: "0 1"},
    KYRP_ST_ENABLE: {value: "12", type: "par", label: "enable sidetone generation", range: "0 1"},
    KYRP_IQ_BALANCE: {value: "13", type: "par", label: "adjustment to IQ balance", range: "-8192 8191", units: "pp8191", ignore: "1"},
    KYRP_ST_PAN: {value: "14", type: "par", label: "sidetone pan left or right", range: "-8192 8191", ignore: "1"},
    KYRP_OUT_ENABLE: {value: "15", type: "par", label: "output mixer enable bits", range: "0 4095"},
    KYRP_COMM: {value: "16", type: "rel", label: "keyer parameters shared across voices"},
    KYRP_DEBOUNCE: {value: "16", type: "par", label: "debounce period", range: "0 127", units: "ms"},
    KYRP_PTT: {value: "17", type: "rel", label: "PTT timing parameters"},
    KYRP_HEAD_TIME: {value: "17", type: "par", label: "time ptt should lead key, key delay", range: "0 127", unit: "samples"},
    KYRP_TAIL_TIME: {value: "18", type: "par", label: "time ptt should linger after key", range: "0 127", unit: "samples"},
    KYRP_HANG_TIME: {value: "19", type: "par", label: "time in dits ptt should linger after key", range: "0 127", units: "dits"},
    KYRP_RAMP: {value: "20", type: "rel", label: "base of the keyer ramp parameters"},
    KYRP_RISE_TIME: {value: "20", type: "par", label: "key rise ramp length", range: "0 16383", units: "samples"},
    KYRP_FALL_TIME: {value: "21", type: "par", label: "key fall ramp length", range: "0 16383", units: "samples"},
    KYRP_RISE_RAMP: {value: "22", type: "par", label: "key rise ramp", values: "KYRV_RAMP_*", default: "KYRV_RAMP_HANN"},
    KYRP_FALL_RAMP: {value: "23", type: "par", label: "key fall ramp", values: "KYRV_RAMP_*", default: "KYRV_RAMP_HANN"},
    KYRV_RAMP_HANN: {value: "0", type: "val", label: "ramp from Hann window, raised cosine"},
    KYRV_RAMP_BLACKMAN_HARRIS: {value: "1", type: "val", label: "ramp from Blackman Harris window"},
    KYRV_RAMP_LINEAR: {value: "2", type: "val", label: "linear ramp, for comparison"},
    KYRP_PAD: {value: "24", type: "rel", label: "base of paddle keyer parameters"},
    KYRP_PAD_MODE: {value: "24", type: "par", label: "iambic keyer mode A/B/S", values: "KYRV_MODE_*", default: "KYRV_MODE_A"},
    KYRV_MODE_A: {value: "0", type: "val", label: "paddle keyer iambic mode A"},
    KYRV_MODE_B: {value: "1", type: "val", label: "paddle keyer iambic mode B"},
    KYRV_MODE_S: {value: "2", type: "val", label: "paddle keyer bug mode"},
    KYRP_PAD_SWAP: {value: "25", type: "par", label: "swap paddles", range: "0 1", default: "0"},
    KYRP_PAD_ADAPT: {value: "26", type: "par", label: "paddle adapter normal/ultimatic/single lever", values: "KYRV_ADAPT_*", default: "KYRV_ADAPT_NORMAL"},
    KYRV_ADAPT_NORMAL: {value: "0", type: "val", label: "paddle keyer unmodified"},
    KYRV_ADAPT_ULTIMATIC: {value: "1", type: "val", label: "paddle keyer modified to produce ultimatic keyer"},
    KYRV_ADAPT_SINGLE: {value: "2", type: "val", label: "paddle keyer modified to simulate single lever paddle"},
    KYRP_AUTO_ILS: {value: "27", type: "par", label: "automatic letter space timing", range: "0 1", default: "1"},
    KYRP_AUTO_IWS: {value: "28", type: "par", label: "automatic word space timing", range: "0 1", default: "0"},
    KYRP_PAD_KEYER: {value: "29", type: "par", label: "paddle keyer implementation", values: "KYRV_KEYER_*", default: "KYRV_KEYER_VK6PH"},
    KYRV_KEYER_AD5DZ: {value: "0", type: "val", label: "paddle keyer algorithm by ad5dz"},
    KYRV_KEYER_K1EL: {value: "1", type: "val", label: "paddle keyer algorithm by k1el"},
    KYRV_KEYER_ND7PA: {value: "2", type: "val", label: "paddle keyer algorithm by nd7pa"},
    KYRV_KEYER_VK6PH: {value: "3", type: "val", label: "paddle keyer algorithm by vk6ph"},
    KYRP_CHAN: {value: "30", type: "rel", label: "base of midi channels"},
    KYRP_CHAN_SEND_CC: {value: "30", type: "par", label: "midi channel for sending controls", range: "0 16"},
    KYRP_CHAN_RECV_CC: {value: "31", type: "par", label: "midi channle for receiving controls", range: "0 16"},
    KYRP_CHAN_SEND_NOTE_IN: {value: "32", type: "par", label: "midi channel for sending input notes", range: "0 16"},
    KYRP_CHAN_SEND_NOTE_OUT: {value: "33", type: "par", label: "midi channel for sending output notes", range: "0 16"},
    KYRP_CHAN_RECV_NOTE_IN: {value: "34", type: "par", label: "midi channel for receiving input notes", range: "0 16"},
    KYRP_CHAN_RECV_NOTE_OUT: {value: "35", type: "par", label: "midi channel for receiving output notes", range: "0 16"},
    KYRV_CHAN_INVALID: {value: "0", type: "val", label: "invalid channel, used to disable midi channel"},
    KYRP_NOTE: {value: "36", type: "rel", label: "base of midi notes"},
    KYRP_NOTE_L_PAD: {value: "36", type: "par", label: "note for left paddle switch input", range: "0 128"},
    KYRP_NOTE_R_PAD: {value: "37", type: "par", label: "note for right paddle switch input", range: "0 128"},
    KYRP_NOTE_S_KEY: {value: "38", type: "par", label: "note for straight key switch input", range: "0 128"},
    KYRP_NOTE_EXT_PTT: {value: "39", type: "par", label: "note for external ptt switch input", range: "0 128"},
    KYRP_NOTE_KEY_OUT: {value: "40", type: "par", label: "note for key/ptt key output", range: "0 128"},
    KYRP_NOTE_PTT_OUT: {value: "41", type: "par", label: "note for key/ptt ptt output", range: "0 128"},
    KYRV_NOTE_INVALID: {value: "128", type: "val", label: "invalid note, used to disable midi events"},
    KYRP_PINS: {value: "42", type: "rel", label: "base of hardware pin assignments"},
    KYRP_VOLUME_POT: {value: "42", type: "par", label: "pin for volume pot"},
    KYRP_ST_VOL_POT: {value: "43", type: "par", label: "pin for sidetone volume pot", range: "0 127"},
    KYRP_ST_FREQ_POT: {value: "44", type: "par", label: "pin for sidetone frequency pot", range: "0 127"},
    KYRP_SPEED_POT: {value: "45", type: "par", label: "pin for keyer speed pot", range: "0 127"},
    KYRV_INVALID_PIN: {value: "127", type: "val", label: "invalid pin to disable potentiometer"},
    KYRP_MORSE: {value: "46", type: "rel", label: "morse code table base"},
    KYRP_MIXER: {value: "110", type: "rel", label: "base of output mixer block"},
    KYRP_MIX_USB_L0: {value: "110", type: "par", label: "i2s_in left to usb_out left", range: "0 127", unit: "1/127th full scale"},
    KYRP_MIX_USB_L1: {value: "111", type: "par", label: "sidetone left to usb_out left", range: "0 127", unit: "1/127th full scale"},
    KYRP_MIX_USB_L2: {value: "112", type: "par", label: "IQ left to usb_out left", range: "0 127", unit: "1/127th full scale"},
    KYRP_MIX_USB_L3: {value: "113", type: "par", label: "usb_in left to usb_out left", range: "0 127", unit: "1/127th full scale"},
    KYRP_MIX_USB_R0: {value: "114", type: "par", label: "i2s_in right to usb_out right", range: "0 127", unit: "1/127th full scale"},
    KYRP_MIX_USB_R1: {value: "115", type: "par", label: "sidetone right to usb_out right", range: "0 127", unit: "1/127th full scale"},
    KYRP_MIX_USB_R2: {value: "116", type: "par", label: "IQ right to usb_out right", range: "0 127", unit: "1/127th full scale"},
    KYRP_MIX_USB_R3: {value: "117", type: "par", label: "usb_in right to usb_out right", range: "0 127", unit: "1/127th full scale"},
    KYRP_MIX_I2S_L0: {value: "118", type: "par", label: "usb_in left to i2s_out left", range: "0 127", unit: "1/127th full scale"},
    KYRP_MIX_I2S_L1: {value: "119", type: "par", label: "sidetone left to i2s_out left", range: "0 127", unit: "1/127th full scale"},
    KYRP_MIX_I2S_L2: {value: "120", type: "par", label: "IQ left to i2s_out left", range: "0 127", unit: "1/127th full scale"},
    KYRP_MIX_I2S_L3: {value: "121", type: "par", label: "i2s_in right to i2s_out right", range: "0 127", unit: "1/127th full scale"},
    KYRP_MIX_I2S_R0: {value: "122", type: "par", label: "usb_in right to i2s_out right", range: "0 127", unit: "1/127th full scale"},
    KYRP_MIX_I2S_R1: {value: "123", type: "par", label: "sidetone right to i2s_out right", range: "0 127", unit: "1/127th full scale"},
    KYRP_MIX_I2S_R2: {value: "124", type: "par", label: "IQ right to i2s_out right", range: "0 127", unit: "1/127th full scale"},
    KYRP_MIX_I2S_R3: {value: "125", type: "par", label: "i2s_in right to i2s_out right", range: "0 127", unit: "1/127th full scale"},
    KYRP_MIX_HDW_L0: {value: "126", type: "par", label: "usb_in left to hdw_out left", range: "0 127", unit: "1/127th full scale"},
    KYRP_MIX_HDW_L1: {value: "127", type: "par", label: "sidetone left to hdw_out left", range: "0 127", unit: "1/127th full scale"},
    KYRP_MIX_HDW_L2: {value: "128", type: "par", label: "IQ left to hdw_out left", range: "0 127", unit: "1/127th full scale"},
    KYRP_MIX_HDW_L3: {value: "129", type: "par", label: "i2s_in left to hdw_out left", range: "0 127", unit: "1/127th full scale"},
    KYRP_MIX_HDW_R0: {value: "130", type: "par", label: "usb_in right to hdw_out right", range: "0 127", unit: "1/127th full scale"},
    KYRP_MIX_HDW_R1: {value: "131", type: "par", label: "sidetone right to hdw_out right", range: "0 127", unit: "1/127th full scale"},
    KYRP_MIX_HDW_R2: {value: "132", type: "par", label: "IQ right to hdw_out right", range: "0 127", unit: "1/127th full scale"},
    KYRP_MIX_HDW_R3: {value: "133", type: "par", label: "i2s_in right to hdw_out right", range: "0 127", unit: "1/127th full scale"},
    KYRP_KEYER: {value: "134", type: "rel", label: "base of vox specialized keyer parameters"},
    KYRP_TONE: {value: "134", type: "par", label: "sidetone and IQ oscillator frequency", range: "0 16383", unit: "Hz"},
    KYRP_LEVEL: {value: "135", type: "par", label: "sidetone level", range: "0 127", default: "64", unit: "1/127th full scale"},
    KYRP_SPEED: {value: "136", type: "par", label: "keyer speed control", range: "0 16384", units: "wpm"},
    KYRP_WEIGHT: {value: "137", type: "par", label: "keyer mark/space weight", range: "25 75", unit: "pct", default: "50"},
    KYRP_RATIO: {value: "138", type: "par", label: "keyer dit/dah ratio", range: "25 75", unit: "pct", default: "50"},
    KYRP_FARNS: {value: "139", type: "par", label: "Farnsworth keying speed", range: "0 127", default: "0", units: "wpm"},
    KYRP_COMP: {value: "140", type: "par", label: "keyer compensation", range: "-8192 8191", default: "0", units: "samples"},
    KYRP_SPEED_FRAC: {value: "141", type: "par", label: "keyer speed fraction", range: "0 127", default: "0", units: "wpm/128"},
    KYRP_KEYER_LAST: {value: "142", type: "rel", label: "end of keyer block"},
    KYRP_VOX_OFFSET: {value: "8", type: "rel", label: "size of keyer parameter block"},
    KYRP_VOX_NONE: {value: "134", type: "rel", label: "base of default keyer parameters"},
    KYRP_VOX_TUNE: {value: "142", type: "rel", label: "base of tune keyer parameters"},
    KYRP_VOX_S_KEY: {value: "150", type: "rel", label: "base of straight key parameters"},
    KYRP_VOX_PAD: {value: "158", type: "rel", label: "base of paddle keyer parameters"},
    KYRP_VOX_WINK: {value: "166", type: "rel", label: "base of text from winkey parameters"},
    KYRP_VOX_KYR: {value: "174", type: "rel", label: "base of text from hasak parameters"},
    KYRP_VOX_BUT: {value: "182", type: "rel", label: "base of headset button keyer parameters"},
    KYRP_LAST: {value: "190", type: "rel", label: "one past end of stored keyer parameters"},
    KYRP_XFIRST: {value: "1000", type: "rel", label: "base of extended nrpn block"},
    KYRP_XKEYER: {value: "1000", type: "rel", label: "base of extended keyer block"},
    KYRP_XKEYER_LAST: {value: "1006", type: "rel", label: "one past end of extended keyer block"},
    KYRP_XVOX_OFFSET: {value: "6", type: "rel", label: "size of extended keyer parameter block"},
    KYRP_XVOX_NONE: {value: "1000", type: "rel", label: "base of default keyer parameters"},
    KYRP_XVOX_TUNE: {value: "1006", type: "rel", label: "base of tune keyer parameters"},
    KYRP_XVOX_S_KEY: {value: "1012", type: "rel", label: "base of straight key parameters"},
    KYRP_XVOX_PAD: {value: "1018", type: "rel", label: "base of paddle keyer parameters"},
    KYRP_XVOX_WINK: {value: "1024", type: "rel", label: "base of text from winkey parameters"},
    KYRP_XVOX_KYR: {value: "1030", type: "rel", label: "base of text from hasak parameters"},
    KYRP_XVOX_BUT: {value: "1036", type: "rel", label: "base of headset button keyer parameters"},
    KYRP_XLAST: {value: "1042", type: "rel", label: "end+1 of extended keyer block"},
    KYRP_EXEC: {value: "2000", type: "rel", label: "base of command nrpns"},
    KYRP_WRITE_EEPROM: {value: "2000", type: "cmd", label: "write nrpn+msgs to eeprom"},
    KYRP_READ_EEPROM: {value: "2001", type: "cmd", label: "read nrpn+msgs from eeprom"},
    KYRP_SET_DEFAULT: {value: "2002", type: "cmd", label: "load nrpn with default values"},
    KYRP_ECHO_ALL: {value: "2003", type: "cmd", label: "echo all set nrpns to midi"},
    KYRP_SEND_WINK: {value: "2004", type: "cmd", label: "send character value to wink vox"},
    KYRP_SEND_KYR: {value: "2005", type: "cmd", label: "send character value to kyr vox"},
    KYRP_MSG_INDEX: {value: "2006", type: "cmd", label: "set index into msgs"},
    KYRP_MSG_WRITE: {value: "2007", type: "cmd", label: "set msgs[index++] to value"},
    KYRP_MSG_READ: {value: "2008", type: "cmd", label: "read msgs[index++] and echo the value"},
    KYRP_PLAY_WINK: {value: "2009", type: "cmd", label: "queue message by number through wink"},
    KYRP_PLAY_KYR: {value: "2010", type: "cmd", label: "queue message by number through kyr"},
    KYRP_INFO: {value: "3000", type: "rel", label: "base of information nrpns"},
    KYRP_VERSION: {value: "3000", type: "inf", label: "version of hasak nrpn set"},
    KYRP_NRPN_SIZE: {value: "3001", type: "inf", label: "size of nrpn array"},
    KYRP_MSG_SIZE: {value: "3002", type: "inf", label: "send the size of msgs array"},
    KYRP_SAMPLE_RATE: {value: "3003", type: "inf", label: "sample rate of audio library", units: "sps/100"},
    KYRP_EEPROM_LENGTH: {value: "3004", type: "inf", label: "result of EEPROM.length()", units: "bytes"},
    KYRP_ID_CPU: {value: "3005", type: "inf", label: "which teensy microprocessor are we running"},
    KYRP_ID_CODEC: {value: "3006", type: "inf", label: "which codec are we running"}
};

/* eslint no-bitwise: ["error", { "allow": ["&","|","<<",'>>',"~"] }] */
export class CWKeyerHasak extends CWKeyerDefault {

  constructor(context, name) {
    super(context, name);
    this._type = 'hasak';
    this._version = 0;
    this._hasak = cwkeyerhasak100;
    this._keyers = ['vk6ph', 'k1el', 'nd7pa', 'ad5dz'];
    this._envelopes = ['hann', 'blackman-harris', 'linear'];
    this._voices = ['default', 'tune', 'straight key', 'paddle', 'winkey', 'kyr', 'button'];
    // trigger exactly one roll call of set parameters on first note or nrpn
    this.tickleOnce = () => {
      this.off('nrpn', this.tickleOnce)
      this.off('note', this.tickleOnce)
      this.tickle();
    }
    this.on('nrpn', this.tickleOnce);
    this.on('note', this.tickleOnce);
  }

  get KYRP_VERSION() { return this.nrpnvalue(this._hasak.KYRP_VERSION); }

  get KYRP_NRPN_SIZE() { return this.nrpnvalue(this._hasak.KYRP_NRPN_SIZE); }

  get KYRP_MSG_SIZE() { return this.nrpnvalue(this._hasak.KYRP_MSG_SIZE); }

  get KYRP_SAMPLE_RATE() { return this.nrpnvalue(this._hasak.KYRP_SAMPLE_RATE); }

  get KYRP_EEPROM_LENGTH() { return this.nrpnvalue(this._hasak.KYRP_EEPROM_LENGTH); }

  get KYRP_ID_CPU() { return this.nrpnvalue(this._hasak.KYRP_ID_CPU); }

  get KYRP_ID_CODEC() { return this.nrpnvalue(this._hasak.KYRP_ID_CODEC); }

  tickle() {
    console.log(`requesting info from ${this.name}`);
    this.sendnrpn(this._hasak.KYRP_VERSION.value, 0);
    this.sendnrpn(this._hasak.KYRP_NRPN_SIZE.value, 0);
    this.sendnrpn(this._hasak.KYRP_MSG_SIZE.value, 0);
    this.sendnrpn(this._hasak.KYRP_SAMPLE_RATE.value, 0);
    this.sendnrpn(this._hasak.KYRP_EEPROM_LENGTH.value, 0);
    this.sendnrpn(this._hasak.KYRP_ID_CPU.value, 0);
    this.sendnrpn(this._hasak.KYRP_ID_CODEC.value, 0);
    this.sendnrpn(this._hasak.KYRP_ECHO_ALL.value, 0);
  }

  sendnrpn(nrpn, val) {
    const c = this.nrpnvalue(this._hasak.KYRP_CHAN_RECV_CC.value) || this._channel;
    const cc = 0xB0|(c-1);
    this.emit('midi:send', this.name, [cc, 99, (nrpn>>7)&127, cc, 98, nrpn&127, cc, 6, (val>>7)&127, cc, 38, val&127]);
  }

  setnrpn(kyrp, v) {
    console.log(`setnrpn ${kyrp} ${v}`);
    this.sendnrpn(kyrp.value, v)
  }

  getnrpn(kyrp) {
    console.log(`getnrpn ${kyrp}`)
    return this.nrpnvalue(kyrp.value)
  }
  
  setvoxnrpn(voice, kyrp, v) {
    this.sendnrpn(voice*this._hasak.KYRP_VOX_OFFSET.value+kyrp.value, v)
  }

  getvoxnrpn(voice, kyrp) {
    const vv = this.nrpnvalue(voice*this._hasak.KYRP_VOX_OFFSET.value+kyrp.value)
    return (vv !== undefined) ? vv : this.getnrpn(kyrp)
  }
  
  // keyer properties

  set pitch(v) { this.setnrpn(this._hasak.KYRP_TONE, v); }

  get pitch() { return this.getnrpn(this._hasak.KYRP_TONE); }

  set gain(v) { this.setnrpn(this._hasak.KYRP_LEVEL, v); }
  
  get level() { return this.getnrpn(this._hasak.KYRP_LEVEL); }

  set speed(v) { this.setnrpn(this._hasak.KYRP_SPEED, v); }

  get speed() { return this.getnrpn(this._hasak.KYRP_SPEED); }

  // keyer properties for keyer timing

  set weight(v) { this.setnrpn(this._hasak.KYRP_WEIGHT, v); }

  get weight() { return this.getnrpn(this._hasak.KYRP_WEIGHT); }

  set ratio(v) { this.setnrpn(this._hasak.KYRP_RATIO, v); }

  get ratio() { return this.getnrpn(this._hasak.KYRP_RATIO); }

  set compensation(v) { this.setnrpn(this._hasak.KYRP_COMP, v); }

  get compensation() { return this.getnrpn(this._hasak.KYRP_COMP); }

  set farnsworth(v) { this.setnrpn(this._hasak.KYRP_FARNS, v); }

  get farnsworth() { return this.getnrpn(this._hasak.KYRP_FARNS); }

  // keyer properties for keying envelope

  set rise(v) { this.setnrpn(this._hasak.KYRP_RISE_TIME, v); }

  get rise() { return this.getnrpn(this._hasak.KYRP_RISE_TIME); }

  set fall(v) { this.setnrpn(this._hasak.KYRP_FALL_TIME, v); }

  get fall() { return this.getnrpn(this._hasak.KYRP_FALL_TIME); }

  set envelope(v) { this.setnrpn(this._hasak.KYRP_RISE_RAMP, v); }

  get envelope() { return this.getnrpn(this._hasak.KYRP_RISE_RAMP); }

  set envelope2(v) { this.setnrpn(this._hasak.KYRP_FALL_RAMP, v); }

  get envelope2() { return this.getnrpn(this._hasak.KYRP_FALL_RAMP); }

  get envelopes() { return this._envelopes; }
  
  // keyer properties for paddle

  set paddleSwapped(v) { this.setnrpn(this._hasak.KYRP_SWAP, v); }

  get paddleSwapped() { return this.getnrpn(this._hasak.KYRP_SWAP); }

  get paddleKeyers() { return this._keyers; }

  set paddleKeyer(v) { this.setnrpn(this._hasak.KYRP_PAD_KEYER, v); }

  get paddleKeyer() { return this.getnrpn(this._hasak.KYRP_PAD_KEYER); }

  set paddleAdapt(v) { this.setnrpn(this._hasak.KYRP_PAD_ADAPT, v); }

  get paddleAdapt() { return this.getnrpn(this._hasak.KYRP_PAD_ADAPT); }

  // vox specific keyer properties

  get voices() { return this._voices; }
  
  set voice(v) { this._voice = v; }

  get voice() { return this._voice; }

  set voicePitch(v) {  this.setvoxnrpn(this._voice, this._hasak.KYRP_TONE, v); }

  get voicePitch() { return this.getvoxnrpn(this._voice, this._hasak.KYRP_TONE); }

  set voiceGain(v) { this.setvoxnrpn(this._voice, this._hasak.KYRP_LEVEL, v); }
  
  get voiceGain() { return this.getvoxnrpn(this._voice, this._hasak.KYRP_LEVEL); }

  set voiceSpeed(v) { this.setvoxnrpn(this._voice, this._hasak.KYRP_SPEED, v); }

  get voiceSpeed() { return this.getvoxnrpn(this._voice, this._hasak.KYRP_SPEED); }

  set voiceWeight(v) { this.setvoxnrpn(this._voice, this._hasak.KYRP_WEIGHT, v); }

  get voiceWeight() { return this.getvoxnrpn(this._voice, this._hasak.KYRP_WEIGHT); }

  set voiceRatio(v) { this.setvoxnrpn(this._voice, this._hasak.KYRP_RATIO, v); }

  get voiceRatio() { return this.getvoxnrpn(this._voice, this._hasak.KYRP_RATIO); }

  set voiceCompensation(v) { this.setvoxnrpn(this._voice, this._hasak.KYRP_COMP, v); }

  get voiceCompensation() { return this.getvoxnrpn(this._voice, this._hasak.KYRP_COMP); }

  set voiceFarnsworth(v) { this.setvoxnrpn(this._voice, this._hasak.KYRP_FARNS, v); }

  get voiceFarnsworth() { return this.getvoxnrpn(this._voice, this._hasak.KYRP_FARNS); }
}
// Local Variables:
// mode: JavaScript
// js-indent-level: 2
// End:

