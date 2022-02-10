//
// property database for CWKeyerJs.js
// this serves multiple purposes
//
// 1) it generates the static get properties() that lit-element uses
//    to identify reactive properties.  
//    That's the what the lit: { type: * } properties are for, they mark
//    the properties of CWKeyerJs
// 2) it generates the property getters and setters for the properties
//    delegated to this.device, when delegate: true.
// 3) it generates the property getters and setters for the properties
//    stored locally, if local: true
// 4) it provides the default UI element component and parameters
// if the type is  folder, toggle, spinner, options, value.
//
export const cwkeyerProperties = {

  // CWKeyer* properties, delegated to this.device
  masterVolume: { lit: { type: Number, noAccessor: true }, type: 'spinner', value: -26, label: 'Vol', min: -50, max: 10, step: 0.1, unit: 'dB', size: 5, title: 'The master volume.', delegate: true },
  inputSelect: { lit: { type: String, noAccessor: true }, type: 'options', value: 'mic', label: 'Input', options: 'inputSelects', title: 'The codec input source.', delegate: true },
  inputSelects: { lit: { type: Array, noAccessor: true }, delegate: true, getOnly: true },
  inputLevel: { lit: { type: Number, noAccessor: true }, type: 'spinner', value: -26, label: 'In Lvl', min: -50, max: 10, step: 0.1, unit: 'dB', size: 5, title: 'The input level.', delegate: true },
  buttonLevel0: { lit: { type: Number, noAccessor: true }, type: 'spinner', value: 0, label: 'B0 Lvl', min: -8092, max: 8191, step: 1, unit: '', size: 6, title: 'The adc level for headset bias with no button pressed.', delegate: true },
  buttonLevel1: { lit: { type: Number, noAccessor: true }, type: 'spinner', value: 0, label: 'B1 Lvl', min: -8092, max: 8191, step: 1, unit: '', size: 6, title: 'The adc level for headset bias with center or only button pressed.', delegate: true },
  buttonLevel2: { lit: { type: Number, noAccessor: true }, type: 'spinner', value: 0, label: 'B2 Lvl', min: -8092, max: 8191, step: 1, unit: '', size: 6, title: 'The adc level for headset bias with up button pressed.',    delegate: true },
  buttonLevel3: { lit: { type: Number, noAccessor: true }, type: 'spinner', value: 0, label: 'B3 Lvl', min: -8092, max: 8191, step: 1, unit: '', size: 6, title: 'The adc level for headset bias with down button pressed.', delegate: true },
  buttonLevel4: { lit: { type: Number, noAccessor: true }, type: 'spinner', value: 0, label: 'B4 Lvl', min: -8092, max: 8191, step: 1, unit: '', size: 6, title: 'The adc level for headset bias with attention button pressed.', delegate: true },
  externalPTTRequire: { lit: { type: Boolean, noAccessor: true }, type: 'toggle', value: false, label: 'ExtPTT', on: 'true', off: 'false', title: 'Should the external PTT be required for transmit.', delegate: true },
  iqModeSelect: { lit: { type: String, noAccessor: true }, type: 'options', label: 'IQ mode', options: 'iqSelects', title: 'IQ generation mode', delegate: true },
  iqModeSelects: { lit: { type: Array, noAccessor: true }, delegate: true, getOnly: true },
  iqAdjustPhase: { lit: { type: Number, noAccessor: true }, type: 'spinner', label: 'IQ Phase', min: -8092, max: 8191, step: 1, unit: '', size: 5, title: 'The adjustment to the phase of I and Q away from 90 degrees.', delegate: true },
  iqAdjustBalance: { lit: { type: Number, noAccessor: true }, type: 'spinner', label: 'IQ Balance', min: -8092, max: 8191, step: 1, unit: '', size: 5,    title: 'The adjustment to the balance of I and Q away from equality.', delegate: true },
  txEnable: { lit: { type: Boolean, noAccessor: true }, type: 'toggle', value: false, label: 'TX En', on: 'true', off: 'false', title: 'Should transmit be enabled.', delegate: true },
  sidetoneEnable: { lit: { type: Boolean, noAccessor: true }, type: 'toggle', value: false, label: 'ST En', on: 'true', off: 'false', title: 'Should sidetone be generated.', delegate: true },
  sidetonePan: { lit: { type: Number, noAccessor: true }, type: 'spinner', label: 'ST Pan', min: -8092, max: 8191, step: 1, unit: '', size: 5, title: 'The left-right positioning of the sidetone.', delegate: true },
  outputEnable: { lit: { type: Number, noAccessor: true }, type: 'bitmap', value: 0, label: 'Out En', title: 'Should the output channel be mixed to output.', delegate: true },
  remoteKey: { lit: { type: Boolean, noAccessor: true }, type: 'toggle', value: false, label: 'Rem', on: 'true', off: 'false', title: 'Should remote keying Tune be enabled.', delegate: true },
  debouncePeriod: { lit: { type: Number, noAccessor: true }, type: 'spinner', value: 0, label: 'Deb', min: 0, max: 10, step: 0.1, unit: 'ms', size: 6, title: 'The time an input transition is clamped before allowing a new transition.', delegate: true },
  // ptt timing
  pttHeadTime: { lit: { type: Number, noAccessor: true }, type: 'spinner', value: 4, label: 'Head', min: 0, max: 300, step: 0.1, unit: 'ms', size: 5, title: 'The time the PTT signal must lead the KEY signal.', delegate: true },
  pttTailTime: { lit: { type: Number, noAccessor: true }, type: 'spinner', value: 4, label: 'Tail', min: 0, max: 300, step: 0.1, unit: 'ms', size: 5, title: 'The time the PTT signal should linger after KEY signal.', delegate: true },
  pttHangTime: { lit: { type: Number, noAccessor: true }, type: 'spinner', value: 4, label: 'Hang', min: 0, max: 127, step: 1, unit: 'dit', size: 4, title: 'The time the PTT signal should linger after KEY signal.', delegate: true },
  // keying envelope
  keyerRiseTime: { lit: { type: Number, noAccessor: true }, type: 'spinner', value: 5, label: 'Rise', min: 0.1, max: 10, step: 0.1, unit: 'ms', size: 5, title: 'The rise time of keyed elements.', delegate: true },
  keyerFallTime: { lit: { type: Number, noAccessor: true }, type: 'spinner', value: 5, label: 'Fall', min: 0.1, max: 10, step: 0.1, unit: 'ms', size: 5, title: 'The fall time of the keyed signal.', delegate: true },
  keyerRiseRamp: { lit: { type: String, noAccessor: true }, type: 'options', value: 'hann', label: '', options: 'keyerRamps', title: 'The ramp for the key envelope rise.', delegate: true },
  keyerFallRamp: { lit: { type: String, noAccessor: true }, type: 'options', value: 'rectangular', label: '', options: 'envelopes', title: 'The ramp for the key envelope fall.', delegate: true },
  keyerRamps: { lit: { type: Array, noAccessor: true }, type: 'value', delegate: true, getOnly: true },
  // paddle keyer
  paddleMode: { lit: { type: String, noAccessor: true}, type: 'options', value: 'A', label: 'Mode', options: 'paddleModes', title: 'The iambic mode of the paddle keyer.', delegate: true },
  paddleModes: { lit: { type: Array, noAccessor: true }, delegate: true, getOnly: true },
  paddleSwapped: { lit: { type: Boolean, noAccessor: true }, type: 'toggle', value: false, label: 'Swapped', on: 'true', off: 'false', title: 'Should the paddles be swapped.', delegate: true },
  paddleAdapter: { lit: { type: String, noAccessor: true}, type: 'options', value: 'A', label: 'Adapt', options: 'paddleAdapters', title: 'The input adapter of the paddle keyer.', delegate: true },
  paddleAdapters: { lit: { type: Array, noAccessor: true }, delegate: true, getOnly: true },
  autoLetterSpace: { lit: { type: Boolean, noAccessor: true }, type: 'toggle', value: false, label: 'Auto ILS', on: 'true', off: 'false', title: 'Should inter-letter spaces be generated.', delegate: true },
  autoWordSpace: { lit: { type: Boolean, noAccessor: true }, type: 'toggle', value: false, label: 'Auto IWS', on: 'true', off: 'false', title: 'Should inter-word spaces be generated.', delegate: true },
  paddleKeyer: { lit: { type: String, noAccessor: true }, type: 'options', value: 'nd7pa-b', label: 'Keyer', options: 'paddleKeyers', title: 'The keyer that translates paddle events into key events.', delegate: true },
  paddleKeyers: { lit: { type: Array, noAccessor: true }, delegate: true, getOnly: true },
  // MIDI channels
  channelCC: { lit: { type: Number, noAccessor: true }, type: 'spinner', value: 1, label: 'Chan Ctrl', min: 0, max: 16, step: 1, unit: '', size: 2, title: 'The MIDI channel for Control Change messages.', delegate: true },
  channelNote: { lit: { type: Number, noAccessor: true }, type: 'spinner', value: 1, label: 'Chan Note', min: 0, max: 16, step: 1, unit: '', size: 2, title: 'The MIDI channel for Note On/Off messages.', delegate: true },
  channelNrpn: { lit: { type: Number, noAccessor: true }, type: 'spinner', value: 1, label: 'Chan NRPN', min: 0, max: 16, step: 1, unit: '', size: 2, title: 'The MIDI channel for NRPN messages.', delegate: true },
  // MIDI notes
  noteKeyOut: { lit: { type: Number, noAccessor: true }, type: 'spinner', value: 1, min: 0, max: 128, step: 1, unit: '', size: 4, label: 'Key Out', title: 'The MIDI note for the key out signal.', delegate: true },
  notePTTOut: { lit: { type: Number, noAccessor: true }, type: 'spinner', value: 1, min: 0, max: 128, step: 1, unit: '', size: 4, label: 'PTT Out', title: 'The MIDI note for the PTT out signal.', delegate: true },
  noteTune: { lit: { type: Number, noAccessor: true }, type: 'spinner', value: 1, min: 0, max: 128, step: 1, unit: '', size: 4, label: 'PTT Out', title: 'The MIDI note for the TUNE signal.', delegate: true },
  noteLeftPaddle: { lit: { type: Number, noAccessor: true }, type: 'spinner', value: 1, min: 0, max: 128, step: 1, unit: '', size: 4, label: 'L Pad', title: 'The MIDI note for the left paddle.', delegate: true },
  noteRightPaddle: { lit: { type: Number, noAccessor: true }, type: 'spinner', value: 1, min: 0, max: 128, step: 1, unit: '', size: 4, label: 'R Pad', title: 'The MIDI note for the right paddle.', delegate: true },
  noteStraightKey: { lit: { type: Number, noAccessor: true }, type: 'spinner', value: 1, min: 0, max: 128, step: 1, unit: '', size: 4, label: 'S Key', title: 'The MIDI note for the straight key.', delegate: true },
  noteExternalPTT: { lit: { type: Number, noAccessor: true }, type: 'spinner', value: 1, min: 0, max: 128, step: 1, unit: '', size: 4, label: 'X PTT', title: 'The MIDI note for the external PTT switch.', delegate: true },
  noteEnable: { lit: { type: Array, noAccessor: true }, type: 'multiple', value: 7, min: 0, max: 127, step: 1, unit: '', size: 4, label: 'Note Enable', title: 'Bitmap to enable notes.', delegate: true },
  noteEnables: { lit: { type: Array, noAccessor: true }, delegate: true, getOnly: true },
  // ADC pin bindings
  adcEnable: { lit: { type: Boolean, noAccessor: true }, type: 'toggle', value: true, label: 'Pots EN', title: 'Enable potentiometer controls (should be a bitmap).', delegate: true },
  adcControls: { lit: { type: Array, noAccessor: true }, delegate: true, getOnly: true },
  adc0Control: { label: 'adc0', title: 'The property that adc0 controls.', lit: { type: String, noAccessor: true }, unit: '', type: 'options', options: 'adcControls', delegate: true },
  adc1Control: { label: 'adc1', title: 'The property that adc1 controls.', lit: { type: String, noAccessor: true }, unit: '', type: 'options', options: 'adcControls', delegate: true },
  adc2Control: { label: 'adc2', title: 'The property that adc2 controls.', lit: { type: String, noAccessor: true }, unit: '', type: 'options', options: 'adcControls', delegate: true },
  adc3Control: { label: 'adc3', title: 'The property that adc3 controls.', lit: { type: String, noAccessor: true }, unit: '', type: 'options', options: 'adcControls', delegate: true },
  adc4Control: { label: 'adc4', title: 'The property that adc4 controls.', lit: { type: String, noAccessor: true }, unit: '', type: 'options', options: 'adcControls', delegate: true },

  // morse code table goes here
  // figure out an array accessor

  // ouput mixer array goes here
  // figure out an array accessor

  // default keyer
  keyerTone: { lit: { type: Number, noAccessor: true }, type: 'spinner', value: 700, label: '', min: 250, max: 2000, step: 1, unit: 'Hz', size: 5, title: 'The frequency of the keyer sidetone.', delegate: true },
  keyerLevel: { lit: { type: Number, noAccessor: true }, type: 'spinner', value: -26, label: 'ST Vol', min: -50, max: 10, step: 0.1, unit: 'dB', size: 5, title: 'The volume of keyer sidetone.', delegate: true },
  keyerSpeed: { lit: { type: Number, noAccessor: true }, type: 'spinner', value: 20, label: '', min: 0, max: 16383, step: 1, unit: 'WPM', size: 4, title: 'The speed of the keyer in words/minute (WPM).', delegate: true },
  keyerWeight: { lit: { type: Number, noAccessor: true }, type: 'spinner', value: 50, label: 'Weight', min: 25, max: 75, step: 1, unit: '%', size: 4, title: 'The relative weight of marks and spaces in percent deviation from 50.', delegate: true },
  keyerRatio: { lit: { type: Number, noAccessor: true }, type: 'spinner', value: 50, label: 'Ratio', min: 25, max: 75, step: 1, unit: '%', size: 4, title: 'The relative length of dits and dahs in percent deviation from 50.', delegate: true },
  keyerFarnsworth: { lit: { type: Number, noAccessor: true }, type: 'spinner', value: 0, label: 'Farns', min: 0, max: 16383, step: 1, unit: 'WPM', size: 4, title: 'The Farnsworth speed of the keyer in words/minute (WPM).', delegate: true },
  keyerCompensation: { lit: { type: Number, noAccessor: true }, type: 'spinner', value: 0, label: 'Compensation', min: -15, max: 15, step: 0.1, unit: 'ms', size: 5, title: 'An absolute correction to element length.', delegate: true },
  keyerSpeedFraction: { lit: { type: Number, noAccessor: true }, type: 'spinner', value: 0, label: 'Fraction', min: 0, max: 127, step: 1, unit: 'WPM/128', size: 4, title: 'The fractional speed of the characters in words/minute (WPM).', delegate: true },
  // keyer information
  keyerIdentifier: { lit: { type: Number, noAccessor: true }, type: 'value', delegate: true, getOnly: true, },
  keyerVersion: { lit: { type: Number, noAccessor: true }, type: 'value', delegate: true, getOnly: true, },
  nrpnSize: { lit: { type: Number, noAccessor: true }, type: 'value', delegate: true, getOnly: true, },
  messageSize: { lit: { type: Number, noAccessor: true }, type: 'value', delegate: true, getOnly: true, },
  sampleRate: { lit: { type: Number, noAccessor: true }, type: 'value', delegate: true, getOnly: true, },
  eepromSize: { lit: { type: Number, noAccessor: true }, type: 'value', delegate: true, getOnly: true, },
  identifyCPU: { lit: { type: Number, noAccessor: true }, type: 'value', delegate: true, getOnly: true, },
  identifyCodec: { lit: { type: Number, noAccessor: true }, type: 'value', delegate: true, getOnly: true, },
  nothing: { lit: { type: Number, noAccessor: true }, type: 'value', delegate: true, getOnly: true, },
  // keyer command echoes
  echoAll: { lit: { type: Number, noAccessor: true }, type: 'value', delegate: true, getOnly: true, },
  // these aren't right, yet, need an index, a list of valid indices, and a get/set for the value at the specified index
  // voices have a second parameter which specifies the aspect of the voice, think about it some more.
  // voice selection
  voice: { lit: { type: String, noAccessor: true }, type: 'options', value: 'none', label: 'Voice', options: 'voices', title: 'Keyer voice to configure.', delegate: true },
  voices: { lit: { type: Array, noAccessor: true }, delegate: true, getOnly: true },

  // mixer selection
  mixer: { lit: { type: String, noAccessor: true }, type: 'options', value: 'none', label: 'Voice', options: 'voices', title: 'Mixer channel to configure.', delegate: true },
  mixers: { lit: { type: Array, noAccessor: true }, delegate: true, getOnly: true },
  mixerValue: { lit: { type: Number, noAccessor: true }, delegate: true }, 

  // morse code table selection
  code: { lit: { type: String, noAccessor: true }, type: 'options', value: 'none', label: 'Voice', options: 'voices', title: 'Morse code table entry to configure.', delegate: true },
  codes: { lit: { type: Array, noAccessor: true }, delegate: true, getOnly: true },
  codeValue: { lit: { type: String, noAccessor: true }, delegate: true },

  // device selection
  deviceSelect: { lit: {type: String}, type: 'options', value: 'none as default', options: 'deviceSelectOptions', label: 'Select device', title: 'Choose a MIDI keyer device' },
  deviceOptions: { lit: { type: Array}, getOnly: true },

  // toplevel cwkeyer folders
  displayDevice:  { lit: {type: Boolean}, type: 'folder', value: true, label: 'Device', level: 2, title: 'Choose the MIDI device to control.' },
  displayHasak: { lit: {type: Boolean}, type: 'block', value: false, label: 'Keyer controller', level: 2, title: 'Controller panel for Hasak keyer.' },
  displayTwinky: { lit: {type: Boolean}, type: 'block', value: false, label: 'Teensy Winkey Emulator controller', level: 2, title: 'Controller panel for Teensy Winkey Emulator.' },
  displayDefault: { lit: {type: Boolean}, type: 'block', value: false, label: 'Default controller', level: 2, title: 'Controller panel for unrecognized device.' },
  displayAbout: { lit: { type: Boolean}, type: 'folder', value: false, label: 'About', level: 2, title: 'What cwkeyer-js does.' },
  displayLicense: { lit: { type: Boolean}, type: 'folder', value: false, label: 'License', level: 2, title: 'How cwkeyer-js is licensed.' },
  displayColophon: { lit: { type: Boolean}, type: 'folder', value: false, label: 'Colophon', level: 2, title: 'How cwkeyer-js was built.' },
  displayFooter: { lit: { type: Boolean}, type: 'folder', value: false, label: 'Footer', level: 2, title: 'Footer.' },

  // hasak folders
  hasakFlags: { lit: {type: Boolean}, type: 'folder', value: true, label: 'Flags', level: 3, title: 'Keyer flags.' },
  hasakBasic: { lit: {type: Boolean}, type: 'folder', value: true, label: 'Basic', level: 3, title: 'Essential controls.' },
  hasakTiming: { lit: {type: Boolean}, type: 'folder', value: true, label: 'Timing', level: 3, title: 'Keyer timing controls.' },
  hasakPTT: { lit: {type: Boolean}, type: 'folder', value: true, label: 'PTT', level: 3, title: 'PTT signal timing controls.' },
  hasakEnvelope: { lit: {type: Boolean}, type: 'folder', value: true, label: 'Envelope', level: 3, title: 'Key envelope signal timing controls.' },
  hasakPaddle: { lit: {type: Boolean}, type: 'folder', value: true, label: 'Paddle', level: 3, title: 'Paddle keyer controls.' },
  hasakCodec: { lit: {type: Boolean}, type: 'folder', value: true, label: 'Codec', level: 3, title: 'Codec controls.' },
  hasakMisc: { lit: {type: Boolean}, type: 'folder', value: true, label: 'Misc', level: 3, title: 'Miscellaneous controls.' },
  hasakMIDI: { lit: {type: Boolean}, type: 'folder', value: true, label: 'MIDI', level: 3, title: 'MIDI channel and notes.' },
    hasakMIDIChannels: { lit: {type: Boolean}, type: 'folder', value: true, label: 'Channels', level: 4, title: 'MIDI channel configuration.' },
    hasakMIDINotes:  { lit: {type: Boolean}, type: 'folder', value: true, label: 'Notes', level: 4, title: 'MIDI note configuration.' },
  hasakAdc: { lit: {type: Boolean}, type: 'folder', value: true, label: 'Pots', level: 3, title: 'Potentiometer configuration.' },
  hasakInfo: { lit: {type: Boolean}, type: 'folder', value: true, label: 'Info', level: 3, title: 'Hasak firmware info.' },
  hasakTLDR: { lit: {type: Boolean}, type: 'folder', value: true, label: 'TL;DR', level: 3, title: 'Too long; don\'t read.' },
    hasakVoice: { lit: {type: Boolean}, type: 'folder', value: true, label: 'Voices', level: 4, title: 'Voice specific keyer controls.' },
    hasakCommands: { lit: {type: Boolean}, type: 'folder', value: true, label: 'Commands', level: 4, title: 'Keyer command execution.' },
    hasakButton: { lit: {type: Boolean}, type: 'folder', value: true, label: 'Button', level: 4, title: 'Button controls.' },
    hasakIQ: { lit: {type: Boolean}, type: 'folder', value: true, label: 'IQ', level: 4, title: 'IQ controls.' },
    hasakStatus: { lit: {type: Boolean}, type: 'folder', value: true, label: 'Status', level: 4, title: 'Keyer status.' },
    hasakMorse: { lit: {type: Boolean}, type: 'folder', value: true, label: 'Code', level: 4, title: 'Morse code table.' },
    hasakMixers: { lit: {type: Boolean}, type: 'folder', value: true, label: 'Mixers', level: 4, title: 'Output mixer controls.' },
  
  displayMidiDetails: { lit: {type: Boolean}, type: 'folder', value: true, label: 'Midi activity', level: 2, title: 'Active Midi devices, notes, and controls.' },
  displayDeviceDetails: { lit: {type: Boolean}, type: 'folder', value: true, label: 'Device activity', level: 2, title: 'Active device notes, controls, and parameters.' },
  displayNoteDetails: { lit: {type: Boolean}, type: 'folder', value: false, label: 'Notes', level: 3, title: 'MIDI Notes.' },
  displayCtrlDetails: { lit: {type: Boolean}, type: 'folder', value: false, label: 'Ctrls', level: 3, title: 'MIDI Controls.' },
  displayNrpnDetails: { lit: {type: Boolean}, type: 'folder', value: false, label: 'Notes', level: 3, title: 'MIDI NRPNs (Non-registered parameter numbers).' },

  // read only midi flag
  midiAvailable: { lit: { type: Boolean } },
  
  // read only values supplying options lists
  // most are constant, midiNotes changes
  // names changes
  midiNames: { lit: { type: Array } },
  midiInputs: { lit: { type: Array } },
  midiOutputs: { lit: { type: Array } },
  midiNotes: { lit: { type: Array } },
  midiControls: { lit: { type: Array } },

}; 
