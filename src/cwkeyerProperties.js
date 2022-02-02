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
  // CWKeyerJs properties
  device: { lit: { type: Object }, type: 'options', values: 'devices' },
  devices: { lit: { type: Array } },

  // CWKeyer* properties, delegated to this.device
  masterVolume: { lit: { type: Number }, type: 'spinner', value: -26, label: 'Vol', min: -50, max: 10, step: 0.25, unit: 'dB', size: 5, title: 'The master volume.', delegate: true },
  inputSelect: { lit: { type: String }, type: 'options', value: 'mic', label: '', options: 'inputSelects', title: 'The codec input source.', delegate: true },
  inputSelects: { lit: { type: Array }, delegate: true, getOnly: true },
  inputLevel: { lit: { type: Number }, type: 'spinner', value: -26, label: 'In Lvl', min: -50, max: 10, step: 0.25, unit: 'dB', size: 5, title: 'The input level.', delegate: true },
  buttonLevel0: { lit: { type: Number }, type: 'spinner', value: 0, label: 'B0 Lvl', min: -8092, max: 8191, step: 1, unit: '', size: 5, title: 'The adc level for headset bias with no button pressed.', delegate: true },
  buttonLevel1: { lit: { type: Number }, type: 'spinner', value: 0, label: 'B1 Lvl', min: -8092, max: 8191, step: 1, unit: '', size: 5, title: 'The adc level for headset bias with center or only button pressed.', delegate: true },
  buttonLevel2: { lit: { type: Number }, type: 'spinner', value: 0, label: 'B2 Lvl', min: -8092, max: 8191, step: 1, unit: '', size: 5, title: 'The adc level for headset bias with up button pressed.',    delegate: true },
  buttonLevel3: { lit: { type: Number }, type: 'spinner', value: 0, label: 'B3 Lvl', min: -8092, max: 8191, step: 1, unit: '', size: 5, title: 'The adc level for headset bias with down button pressed.', delegate: true },
  buttonLevel4: { lit: { type: Number }, type: 'spinner', value: 0, label: 'B4 Lvl', min: -8092, max: 8191, step: 1, unit: '', size: 5, title: 'The adc level for headset bias with attention button pressed.', delegate: true },
  externalPTTRequire: { lit: { type: Boolean }, type: 'toggle', value: false, label: 'ExtPTT', on: 'true', off: 'false', title: 'Should the external PTT be required for transmit.', delegate: true },
  iqModeSelect: { lit: { type: String }, type: 'options', label: 'IQ mode', options: 'iqSelects', title: 'IQ generation mode', delegate: true },
  iqModeSelects: { lit: { type: Array }, delegate: true, getOnly: true },
  iqAdjustPhase: { lit: { type: Number }, type: 'spinner', label: 'IQ Phase', min: -8092, max: 8191, step: 1, unit: '', size: 5, title: 'The adjustment to the phase of I and Q away from 90 degrees.', delegate: true },
  iqAdjustBalance: { lit: { type: Number }, type: 'spinner', label: 'IQ Balance', min: -8092, max: 8191, step: 1, unit: '', size: 5,    title: 'The adjustment to the balance of I and Q away from equality.', delegate: true },
  txEnable: { lit: { type: Boolean }, type: 'toggle', value: false, label: 'TX En', on: 'true', off: 'false', title: 'Should transmit be enabled.', delegate: true },
  sidetoneEnable: { lit: { type: Boolean }, type: 'toggle', value: false, label: 'ST En', on: 'true', off: 'false', title: 'Should sidetone be generated.', delegate: true },
  sidetonePan: { lit: { type: Number }, type: 'spinner', label: 'ST Pan', min: -8092, max: 8191, step: 1, unit: '', size: 5, title: 'The left-right positioning of the sidetone.', delegate: true },
  outputEnable: { lit: { type: Number }, type: 'bitmap', value: 0, label: 'Out En', title: 'Should the output channel be mixed to output.', delegate: true },
  debouncePeriod: { lit: { type: Number }, type: 'spinner', value: 5, label: 'Deb', min: 0, max: 10, step: 0.021, unit: 'ms', size: 6, title: 'The time an input transition is clamped before allowing a new transition.', delegate: true },
  // ptt timing
  pttHeadTime: { lit: { type: Number }, type: 'spinner', value: 4, label: 'Head', min: 0, max: 10, step: 0.021, unit: 'ms', size: 6, title: 'The time the PTT signal must lead the KEY signal.', delegate: true },
  pttTailTime: { lit: { type: Number }, type: 'spinner', value: 4, label: 'Tail', min: 0, max: 10, step: 0.021, unit: 'ms', size: 6, title: 'The time the PTT signal should linger after KEY signal.', delegate: true },
  pttHangTime: { lit: { type: Number }, type: 'spinner', value: 4, label: 'Tail', min: 0, max: 20, step: 1, unit: 'dit', size: 6, title: 'The time the PTT signal should linger after KEY signal.', delegate: true },
  // keying envelope
  keyerRiseTime: { lit: { type: Number }, type: 'spinner', value: 4, label: 'Rise', min: 1, max: 10, step: 0.1, unit: 'ms', size: 3, title: 'The rise time of keyed elements.', delegate: true },
  keyerFallTime: { lit: { type: Number }, type: 'spinner', value: 4, label: 'Fall', min: 1, max: 10, step: 0.1, unit: 'ms', size: 3, title: 'The fall time of the keyed signal.', delegate: true },
  keyerRiseRamp: { lit: { type: String }, type: 'options', value: 'hann', label: '', options: 'keyerRamps', title: 'The ramp for the key envelope rise.', delegate: true },
  keyerFallRamp: { lit: { type: String }, type: 'options', value: 'rectangular', label: '', options: 'envelopes', title: 'The ramp for the key envelope fall.', delegate: true },
  keyerRamps: { lit: { type: Array }, type: 'value', delegate: true, getOnly: true },
  // paddle keyer
  paddleMode: { lit: { type: String}, type: 'options', value: 'A', label: 'Mode', options: 'paddleModes', title: 'The iambic mode of the paddle keyer.', delegate: true },
  paddleModes: { lit: { type: Array }, delegate: true, getOnly: true },
  paddleSwapped: { lit: { type: Boolean }, type: 'toggle', value: false, label: 'Swapped', on: 'true', off: 'false', title: 'Should the paddles be swapped.', delegate: true },
  paddleAdapter: { lit: { type: String}, type: 'options', value: 'A', label: 'Mode', options: 'paddleModes', title: 'The input adapter of the paddle keyer.', delegate: true },
  paddleAdapters: { lit: { type: Array }, delegate: true, getOnly: true },
  autoLetterSpace: { lit: { type: Boolean }, type: 'toggle', value: false, label: 'Auto ILS', on: 'true', off: 'false', title: 'Should inter-letter spaces be generated.', delegate: true },
  autoWordSpace: { lit: { type: Boolean }, type: 'toggle', value: false, label: 'Auto ILS', on: 'true', off: 'false', title: 'Should inter-word spaces be generated.', delegate: true },
  paddleKeyer: { lit: { type: String }, type: 'options', value: 'nd7pa-b', label: 'Keyer', options: 'paddleKeyers', title: 'The keyer that translates paddle events into key events.', delegate: true },
  paddleKeyers: { lit: { type: Array }, delegate: true, getOnly: true },
  // MIDI channels
  channelCC: { lit: { type: Number }, type: 'spinner', value: 1, label: 'Chan Ctrl', min: 0, max: 16, step: 1, unit: '', size: 2, title: 'The MIDI channel for Control Change messages.', delegate: true },
  channelNote: { lit: { type: Number }, type: 'spinner', value: 1, label: 'Chan Note', min: 0, max: 16, step: 1, unit: '', size: 2, title: 'The MIDI channel for Note On/Off messages.', delegate: true },
  // MIDI notes
  noteLeftPaddle: { lit: { type: Number }, type: 'spinner', value: 1, min: 0, max: 128, step: 1, unit: '', size: 3, label: 'L Pad', title: 'The MIDI note for the left paddle.', delegate: true },
  noteRightPaddle: { lit: { type: Number }, type: 'spinner', value: 1, min: 0, max: 128, step: 1, unit: '', size: 3, label: 'R Pad', title: 'The MIDI note for the right paddle.', delegate: true },
  noteStraightKey: { lit: { type: Number }, type: 'spinner', value: 1, min: 0, max: 128, step: 1, unit: '', size: 3, label: 'S Key', title: 'The MIDI note for the straight key.', delegate: true },
  noteExternalPTT: { lit: { type: Number }, type: 'spinner', value: 1, min: 0, max: 128, step: 1, unit: '', size: 3, label: 'X PTT', title: 'The MIDI note for the external PTT switch.', delegate: true },
  noteKeyOut: { lit: { type: Number }, type: 'spinner', value: 1, min: 0, max: 128, step: 1, unit: '', size: 3, label: 'Key Out', title: 'The MIDI note for the key out signal.', delegate: true },
  notePTTOut: { lit: { type: Number }, type: 'spinner', value: 1, min: 0, max: 128, step: 1, unit: '', size: 3, label: 'PTT Out', title: 'The MIDI note for the PTT out signal.', delegate: true },
  // ADC pin bindings
  adcEnable: { lit: { type: Number }, type: 'bitmap', delegate: true },
  adcControls: { lit: { type: Array }, delegate: true, getOnly: true },
  adc0Control: { label: 'adc0', title: 'The property that adc0 controls.', lit: { type: String }, unit: '', type: 'options', options: 'adcControls', delegate: true },
  adc1Control: { label: 'adc1', title: 'The property that adc1 controls.', lit: { type: String }, unit: '', type: 'options', options: 'adcControls', delegate: true },
  adc2Control: { label: 'adc2', title: 'The property that adc2 controls.', lit: { type: String }, unit: '', type: 'options', options: 'adcControls', delegate: true },
  adc3Control: { label: 'adc3', title: 'The property that adc3 controls.', lit: { type: String }, unit: '', type: 'options', options: 'adcControls', delegate: true },
  adc4Control: { label: 'adc4', title: 'The property that adc4 controls.', lit: { type: String }, unit: '', type: 'options', options: 'adcControls', delegate: true },

  // morse code table goes here
  // figure out an array accessor

  // ouput mixer array goes here
  // figure out an array accessor

  // default keyer
  keyerTone: { lit: { type: Number }, type: 'spinner', value: 700, label: '', min: 250, max: 2000, step: 1, unit: 'Hz', size: 4, title: 'The frequency of the keyer sidetone.', delegate: true },
  keyerLevel: { lit: { type: Number }, type: 'spinner', value: -26, label: 'ST Vol', min: -50, max: 10, step: 0.25, unit: 'dB', size: 5, title: 'The volume of keyer sidetone.', delegate: true },
  keyerSpeed: { lit: { type: Number }, type: 'spinner', value: 20, label: '', min: 0, max: 16383, step: 1, unit: 'WPM', size: 5, title: 'The speed of the keyer in words/minute (WPM).', delegate: true },
  keyerWeight: { lit: { type: Number }, type: 'spinner', value: 50, label: 'Weight', min: 25, max: 75, step: 0.1, unit: '%', size: 4, title: 'The relative weight of marks and spaces in percent deviation from 50.', delegate: true },
  keyerRatio: { lit: { type: Number }, type: 'spinner', value: 50, label: 'Ratio', min: 25, max: 75, step: 0.1, unit: '%', size: 4, title: 'The relative length of dits and dahs in percent deviation from 50.', delegate: true },
  keyerFarnsworth: { lit: { type: Number }, type: 'spinner', value: 0, label: 'Farns', min: 0, max: 16383, step: 1, unit: 'WPM', size: 5, title: 'The Farnsworth speed of the keyer in words/minute (WPM).', delegate: true },
  keyerCompensation: { lit: { type: Number }, type: 'spinner', value: 0, label: 'Compensation', min: -15, max: 15, step: 0.1, unit: 'ms', size: 5, title: 'A final correction to element length.', delegate: true },
  keyerSpeedFraction: { lit: { type: Number }, type: 'spinner', value: 0, label: '', min: 1/128, max: 127/128, step: 1/128, unit: 'WPM', size: 5, title: 'The fractional speed of the characters in words/minute (WPM).', delegate: true },

  // voice selection
  voice: { lit: { type: String }, type: 'options', value: 'none', label: 'Voice', options: 'voices', title: 'Keyer voice to configure.', delegate: true },
  voices: { lit: { type: Array }, delegate: true, getOnly: true },

  // these voice properties reuse the property definitions of earlier properties
  voiceTone: 'keyerTone',
  voiceLevel: 'keyerLevel',
  voiceSpeed: 'keyerSpeed',
  voiceWeight: 'keyerWeight',
  voiceRatio: 'keyerRatio',
  voiceFarnsworth: 'keyerFarnsworth',
  voiceCompensation: 'keyerCompensation',
  voiceSpeedFraction: 'keyerSpeedFraction',

  // cwkeyer folders
  displayTest: { lit: {type: Boolean}, type: 'folder', value: true, label: 'Test uh-folder', level: 2, title: 'This is a test uh folder.' },
  displayTest2: { lit: {type: Boolean}, type: 'folder', value: true, label: 'Test uh-folder', level: 3, title: 'This is a test uh folder.' },
  deviceSelect: { lit: {type: String}, type: 'options', value: 'none as default', label: 'Select device', title: 'Choose a MIDI keyer device' },
  displayMidi: { lit: {type: Boolean}, type: 'folder', value: true, label: 'Midi activity', level: 2, title: 'Active Midi devices, notes, and controls.' },
  displayHasak: { lit: {type: Boolean}, type: 'block', value: false, label: 'Keyer controller', level: 2, title: 'Controller panel for Hasak keyer.' },
  displayTWE: { lit: {type: Boolean}, type: 'block', value: false, label: 'Teensy Winkey Emulator controller', level: 2, title: 'Controller panel for Teensy Winkey Emulator.' },
  displayDefault: { lit: {type: Boolean}, type: 'block', value: false, label: 'Default controller', level: 2, title: 'Controller panel for unrecognized device.' },
  displayNotes: { lit: {type: Boolean}, type: 'folder', value: false, label: 'Notes', level: 3, title: 'MIDI Notes for Hasak keyer.' },
  displayNrpns: { lit: {type: Boolean}, type: 'folder', value: false, label: 'Notes', level: 3, title: 'MIDI Controls for Hasak keyer.' },
  displayAbout: { lit: { type: Boolean}, type: 'folder', value: false, label: 'About', level: 2, title: 'What cwkeyer-js does.' },
  displayLicense: { lit: { type: Boolean}, type: 'folder', value: false, label: 'License', level: 2, title: 'How cwkeyer-js is licensed.' },
  displayColophon: { lit: { type: Boolean}, type: 'folder', value: false, label: 'Colophon', level: 2, title: 'How cwkeyer-js was built.' },

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
  return cwkeyerProperties[p] && cwkeyerProperties[cwkeyerProperties[p]] ? cwkeyerProperties[cwkeyerProperties[p]] : cwkeyerProperties[p]
}

