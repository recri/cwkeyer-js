//
// property database
// this serves multiple purposes
// 1) it generates the static get properties() that lit-element uses
// to identify reactive properties.
// 2) it generates the property getters and setters for the properties
// delegated to this.device, if property: 'delegate'.
// 3) it generates the property getters and setters for the properties
// stored locally, if property: 'local'
// 4) it provides the default UI element component and parameters
// if the type is  folder, toggle, spinner, options, value.
//
export const properties = {
  // cwkeyer properties
  device: {
    type: 'object', lit: {type: Object}
  },

  // keyer properties
  masterVolume: { 
    type: 'spinner', lit: { type: Number }, value: -26,
    label: 'Vol', min: -50, max: 10, step: 0.25, unit: 'dB', size: 5,
    title: 'The master volume relative to full scale.',
    property: 'delegate'
  },
  inputSelect: { },
  inputLevel: { },
  buttonLevel0: { },
  buttonLevel1: { },
  buttonLevel2: { },
  buttonLevel3: { },
  buttonLevel4: { },
  extPTTRequire: { },
  iqSelect: { },
  iqSelects: { },
  iqAdjustPhase: {},
  iqAdjustBalance: {},
  txEnable: { },
  sidetoneEnable: {},
  sidetonePan: {},
  outputEnable: {},
  outputEnableLeft: {},
  outputEnableRight: {},
  debouncePeriod: { },
  // ptt timing
  pttHeadTime: {
    type: 'spinner', lit: { type: Number }, value: 4,
    label: 'Head', min: 0, max: 10, step: 0.021, unit: 'ms', size: 6,
    title: 'The time the PTT signal must lead the KEY signal.',
    property: 'delegate'
  },
  pttTailTime: {
    type: 'spinner', lit: { type: Number }, value: 4,
    label: 'Tail', min: 0, max: 10, step: 0.021, unit: 'ms', size: 6,
    title: 'The time the PTT signal should linger after KEY signal.',
    property: 'delegate'
  },
  pttHangTime: {
    type: 'spinner', lit: { type: Number }, value: 4,
    label: 'Tail', min: 0, max: 20, step: 1, unit: 'dits', size: 6,
    title: 'The time the PTT signal should linger after KEY signal.',
    property: 'delegate'
  },
  // keying envelope
  keyerRiseTime: { 
    type: 'spinner', lit: { type: Number }, value: 4,
    label: 'Rise', min: 1, max: 10, step: 0.1, unit: 'ms', size: 3,
    title: 'The rise time of keyed elements.',
    property: 'delegate'
  },
  keyerFallTime: { 
    type: 'spinner', lit: { type: Number }, value: 4,
    label: 'Fall', min: 1, max: 10, step: 0.1, unit: 'ms', size: 3,
    title: 'The fall time of the keyed signal.',
    property: 'delegate'
  },
  keyerRiseRamp: {
    type: 'options', lit: { type: String }, value: 'hann',
    label: '', options: 'keyerRamps',
    title: 'The ramp for the key envelope rise.',
    property: 'delegate'
  },
  keyerFallRamp: {
    type: 'options', lit: { type: String }, value: 'rectangular',
    label: '', options: 'envelopes',
    title: 'The ramp for the key envelope fall.',
    property: 'delegate'
  },
  keyerRamps: {
    type: 'value', lit: { type: Array },
    property: 'delegate'
  },
  // paddle keyer
  paddleMode: {
    type: 'options', lit: { type: String}, value: 'A',
    label: 'Mode', options: 'paddleModes',
    title: 'The iambic mode of the paddle keyer.',
    property: 'delegate'
  },
  paddleModes: { lit: { type: Array }, property: 'delegate' },
  paddleSwapped: {
    type: 'toggle', lit: { type: Boolean }, value: false,
    label: 'Swapped', on: 'true', off: 'false',
    title: 'Should the paddles be swapped.',
    property: 'delegate'
  },
  paddleAdapter: {
    type: 'options', lit: { type: String}, value: 'A',
    label: 'Mode', options: 'paddleModes',
    title: 'The input adapter of the paddle keyer.',
    property: 'delegate'
  },
  paddleAdapters: { lit: { type: Array }, property: 'delegate' },
  autoLetterSpace: {},
  autoWordSpace: {},
  paddleKeyer: {
    type: 'options', lit: { type: String }, value: 'nd7pa-b',
    label: 'Keyer', options: 'paddleKeyers',
    title: 'The keyer that translates paddle events into key events.',
    property: 'delegate'
  },
  paddleKeyers: { lit: { type: Array }, property: 'delegate' },
  // MIDI channels
  channelCC: { },
  channelNote: { },
  // MIDI notes
  noteLeftPaddle: { },
  noteRightPaddle: { },
  noteStraightKey: { },
  noteExternalPTT: { },
  noteKeyOut: { },
  notePTTOut: { },
  // ADC pin bindings
  adc0Control: { },
  adc1Control: { },
  adc2Control: { },
  adc3Control: { },
  adc4Control: { },
  // morse code table
  // ouput mixers
  outUSB0Left: {},
  outUSB1Left: {},
  outUSB2Left: {},
  outUSB3Left: {},
  outUSB0Right: {},
  outUSB1Right: {},
  outUSB2Right: {},
  outUSB3Right: {},
  outI2S0Left: {},
  outI2S1Left: {},
  outI2S2Left: {},
  outI2S3Left: {},
  outI2S0Right: {},
  outI2S1Right: {},
  outI2S2Right: {},
  outI2S3Right: {},
  outHDW0Left: {},
  outHDW1Left: {},
  outHDW2Left: {},
  outHDW3Left: {},
  outHDW0Right: {},
  outHDW1Right: {},
  outHDW2Right: {},
  outHDW3Right: {},
  // default keyer
  keyerTone: { 
    type: 'spinner', lit: { type: Number }, value: 700,
    label: '', min: 250, max: 2000, step: 1, unit: 'Hz', size: 4,
    title: 'The frequency of the keyer sidetone.',
    property: 'delegate'
  },
  keyerLevel: { 
    type: 'spinner', lit: { type: Number }, value: -26,
    label: 'ST Vol', min: -50, max: 10, step: 0.25, unit: 'dB', size: 5,
    title: 'The volume of keyer sidetone relative to full scale.',
    property: 'delegate'
  },
  keyerSpeed: {
    type: 'spinner', lit: { type: Number }, value: 20,
    label: '', min: 0, max: 16383, step: 1, unit: 'WPM', size: 5,
    title: 'The speed of the characters in words/minute (WPM).',
    property: 'delegate'
  },
  keyerWeight: { 
    type: 'spinner', lit: { type: Number }, value: 50,
    label: 'Weight', min: 25, max: 75, step: 0.1, unit: '%', size: 4,
    title: 'The relative weight of marks and spaces.',
    property: 'delegate'
  },
  keyerRatio: { 
    type: 'spinner', lit: { type: Number }, value: 50,
    label: 'Ratio', min: 25, max: 75, step: 0.1, unit: '%', size: 4,
    title: 'The relative length of dits and dahs.',
    property: 'delegate'
  },
  keyerFarnsworth: {
  },
  keyerCompensation: { 
    type: 'spinner', lit: { type: Number }, value: 0,
    label: 'Compensation', min: -15, max: 15, step: 0.1, unit: 'ms', size: 5,
    title: 'A final correction to element length.',
    property: 'delegate'
  },
  keyerSpeedFraction: {
    type: 'spinner', lit: { type: Number }, value: 0,
    label: '', min: 1/128, max: 127/128, step: 1/128, unit: 'WPM', size: 5,
    title: 'The fractional speed of the characters in words/minute (WPM).',
    property: 'delegate'
  },
  // voice specific keyers, inherit the default definitions
  voice: { },
  voices: { },
  voiceTone: 'keyerTone',
  voiceLevel: 'keyerLevel',
  voiceSpeed: 'keyerSpeed',
  voiceWeight: 'keyerWeight',
  voiceRatio: 'keyerRatio',
  voiceFarnsworth: 'keyerFarnsworth',
  voiceCompensation: 'keyerCompensation',

  // cwkeyer folders
  displayTest: {
    type: 'folder', lit: {type: Boolean}, value: true,
    label: 'Test uh-folder', level: 2, 
    title: 'This is a test uh folder.'
  },
  displayTest2: {
    type: 'folder', lit: {type: Boolean}, value: true,
    label: 'Test uh-folder', level: 3, 
    title: 'This is a test uh folder.'
  },
  deviceSelect: {
    type: 'options', lit: {type: String}, value: 'none as default',
    label: 'Select device',
    title: 'Choose a MIDI keyer device'
  },
  displayMidi: {
    type: 'folder', lit: {type: Boolean}, value: true,
    label: 'Midi activity', level: 2, 
    title: 'Active Midi devices, notes, and controls.'
  },
  displayHasak: {
    type: 'block', lit: {type: Boolean}, value: false,
    label: 'Keyer controller', level: 2, 
    title: 'Controller panel for Hasak keyer.'
  },
  displayTWE: {
    type: 'block', lit: {type: Boolean}, value: false,
    label: 'Teensy Winkey Emulator controller', level: 2, 
    title: 'Controller panel for Teensy Winkey Emulator.'
  },
  displayDefault: {
    type: 'block', lit: {type: Boolean}, value: false,
    label: 'Default controller', level: 2, 
    title: 'Controller panel for unrecognized device.'
  },
  displayNotes: {
    type: 'folder', lit: {type: Boolean}, value: false,
    label: 'Notes', level: 3, 
    title: 'MIDI Notes for Hasak keyer.'
  },
  displayNrpns: {
    type: 'folder', lit: {type: Boolean}, value: false,
    label: 'Notes', level: 3, 
    title: 'MIDI Controls for Hasak keyer.'
  },
  displayAbout: {
    type: 'folder', lit: { type: Boolean}, value: false,
    label: 'About', level: 2, 
    title: 'What cwkeyer-js does.'
  },
  displayLicense: { 
    type: 'folder', lit: { type: Boolean}, value: false,
    label: 'License', level: 2, 
    title: 'How cwkeyer-js is licensed.'
  },
  displayColophon: {
    type: 'folder', lit: { type: Boolean}, value: false,
    label: 'Colophon', level: 2, 
    title: 'How cwkeyer-js was built.'
  },

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

//
// get a property by name
// with one level of indirection, where properties[p] is another property name
//
export function getProperty(p) {
  return properties[p] && properties[properties[p]] ? properties[properties[p]] : properties[p]
}

