#!/usr/bin/env node
// script to generate properties for Object.defineProperties
// if argv[1] === 'cwkeyer' then for ../src/CWKeyerJs.js
// if argv[1] === 'default' then for ../src/CWKeyerDefault.js
// if argv[1] === 'hasak' then for ../src/CWKeyerHasak.js
// and so on

import { cwkeyerProperties } from '../src/cwkeyerProperties.js'
import { hasakProperties } from '../src/hasakProperties.js'

const argv = process.argv.slice(1)

function cwkeyerMethods() {
  function get(k) {		// ,v
    return `  get ${k}() { return this.device.${k} }`
  }
  function set(k) {		// ,v
    return `    set ${k}(v) { this.device.${k} = v }`
  }
  function getsetetc(k,v) {
    return v.getOnly ? get(k,v) : [get(k,v), set(k,v)].join('\n\n')
  }
  return Object.entries(cwkeyerProperties)
    .map(([k,v]) => [k, v && cwkeyerProperties[v] ? cwkeyerProperties[v] : v]) // when v is an index into properties, follow it
    .filter(([,v]) => v.delegate) // if not delegated, ignore
    .map(([k,v]) => `  ${getsetetc(k,v)}`) // generate a property descriptor
}

function cwkeyerGenerate() {
  function get(k) {		// ,v
    return `    get() { return this.device.${k} }`
  }
  function set(k) {		// ,v
    return `    set(v) { this.device.${k} = v }`
  }
  function getsetetc(k,v) {
    return v.getOnly ? get(k,v) : [get(k,v), set(k,v)].join(',\n')
  }
  return Object.entries(cwkeyerProperties)
    .map(([k,v]) => [k, v && cwkeyerProperties[v] ? cwkeyerProperties[v] : v]) // when v is an index into properties, follow it
    .filter(([,v]) => v.delegate) // if not delegated, ignore
    .map(([k,v]) => `  ${k}: {\n${getsetetc(k,v)}\n  }`) // generate a property descriptor
}

function defaultGenerate() {
  function get(k) {		// ,v
    return `    get() { return this._${k} }`
  }
  function set(k) {		// ,v
    return `    set(v) { this._${k} = v }`
  }
  function getsetetc(k,v) {
    return v.getOnly ? get(k,v) : [get(k,v), set(k,v)].join(',\n')
  }
  function getinit(v) {
    if (v && v.lit && v.lit.type) {
      if (v.lit.type === String)
	return  `''`
      if (v.lit.type === Number)
	return `0`
      if (v.lit.type === Array)
	return `[0]`
    }
    return `0`
  }
  return Object.entries(cwkeyerProperties)
    .filter(([,v]) => v.delegate) // if not delegated, ignore
    .map(([k,v]) => `  _${k}: { value: ${getinit(v)}, writable: true },\n  ${k}: {\n${getsetetc(k,v)}\n  }`)
}

function hasakGenerate() {
  const pprops = cwkeyerProperties
  const hprops = hasakProperties

  function findHname(pname) {	// , pvalue
    if (hprops[pname]) {
      // console.error(`findHname maps ${pname} into ${hprops[pname]}`)
      return hprops[pname]
    }
    return null;
  }

  function findUnitConverters(pname, hname, punit, hunit, plittype, hrange) {
    if (plittype === Boolean && hrange === '0 1') {
      console.error(`findUnitConverter making Boolean<->Number`)
      return [(x) => `Boolean(${x})`, (x) => `Number(${x})`]
    }
    if (punit === hunit) {
      return [(x) => `${x}`, (x) => `${x}`]
    }
    if (punit === '' && hunit === 'pp8191') {
      return [(x) => `signextend14(${x})`, (x) => `mask14(${x})`]
    }
    if (punit === 'dB' && hunit === 'dB/4') {
      console.error('found a db/4 unit');
      return [(x) => `signextend14(${x})/4`, (x) => `mask14(Math.round(4*${x}))`]
    }
    if (punit === 'dB' && hunit === 'dB/10') {
      return [(x) => `signextend14(${x})/10`, (x) => `mask14(Math.round(10*${x}))`]
    }
    if (punit === 'ms' && hunit === 'sample') {
      return [(x) => `(1000*${x}/48000).toFixed(2)`, (x) => `mask14(Math.round(48000*${x}/1000))`]
    }
    if (punit === 'Hz' && hunit === 'Hz/10') {
      return [(x) => `${x}/10`, (x) => `Math.floor(10*${x})`]
    }
    if (punit === 'WPM' && hunit === 'WPM/128') {
      return [(x) => `${x}/128`, (x) => `Math.floor(128*${x})`]
    }
    console.error(`no unit handler for ${pname} as ${punit} and ${hname} as ${hunit}`)
    return [(x) => `${x}`, (x) => `${x}`]
  }
  
  function getsetetc(pname, pvalue) {
    // map the property name into a hasak property name
    const hname = findHname(pname, pvalue)
    if ( ! hname ) {
      switch (pname) {
      case 'voice':
      case 'mixer':
      case 'code':
	return `    get() { return this._${pname} },\n    set(v) { this._${pname} = v }`
      case 'voices':
      case 'mixers':
      case 'codes':
	return `    get() { return this._${pname} }`
      default:
	console.error(`${pname} has no hasakProperty map`)
	return `    // no hasakProperty map\n`
      }
    }
    const hvalue = hasakProperties[hname]; // Hasak property descriptor
    if ( ! hvalue ) {
      console.error(`${hname} has no hasakProperty at all`);
      return `    // no hasakProperty\n`
    }
    const {nrpn} = hvalue
    if ( ! nrpn) {
      if (hvalue.opts) {
	const vopts = []
	for (const vname of hvalue.opts.split(' ')) {
	  const vvalue = hprops[vname]
	  if ( ! vvalue) {
	    console.error(`vname ${vname} has no value, in pname ${pname} hname ${hname}`);
	    return `    // value property undefined\n`
	  }
	  const vlabel = vvalue.label
	  if ( ! vlabel) {
	    console.error(`vname ${vname} has no label, in pname ${pname} hname ${hname}`);
	    return `    // value property has no label\n`
	  }
	  vopts.push(`"${vlabel}"`)
	}
	if ( ! pvalue.getOnly) {
	  console.error(`value getter ${pname} is not marked getOnly`)
	  return `    // values getter not getOnly\n`
	}
	return `    get() { return [${vopts.join(',')}] }`
      }
      console.error(`${hname} in pname ${pname} has nrpn ${nrpn}`)
      return `    // ${hname} has no nrpn\n`
    }
    
    const punit = pvalue.unit		// units in CWKeyerJs
    const hunit = hvalue.unit		// units in nrpn
    const plittype = pvalue.lit.type
    const hrange = hvalue.range		// range of values
    const [getunit, setunit] = findUnitConverters(pname, hname, punit, hunit, plittype, hrange) 
    const etc = []
    etc.push(`    get() { return ${getunit(`this.getnrpn(${nrpn})`)} }`)
    if ( ! pname.getOnly) {
      etc.push(`    set(v) { return this.setnrpn(${nrpn}, ${setunit(`v`)}) }`)
    }
    return `${etc.join(',\n')}`
  }
  return Object.entries(pprops)
    .map(([k,v]) => [k, v && pprops[v] ? pprops[v] : v]) // when v is an index into properties, follow it
    .filter(([,v]) => v.delegate)				 // if not delegated, ignore
    .map(([k,v]) => `  ${k}: { // ${findHname(k,v)}\n${getsetetc(k,v)}\n  }`)	 // generate a property descriptor
}


console.log(`// do not edit, generated by ../scripts/make-descriptors.js ${argv[1]}`)
switch (argv[1]) {

case 'methods':
  console.log(`
export const cwkeyerMethods = {
${cwkeyerMethods().join('\n\n')}
};`); break;
  
case 'cwkeyer':
  console.log(`
export const cwkeyerDescriptors = {
  ${cwkeyerGenerate().join(',\n')}
};`); break;

case 'default':
  console.log(`
export const defaultDescriptors = {
  ${defaultGenerate().join(',\n')}
};`); break;

case 'hasak':
  console.log(`
/* eslint no-bitwise: ["error", { "allow": ["&","|","<<",'>>',"~"] }] */
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
  
export const hasakDescriptors = {
  ${hasakGenerate().join(',\n')}
};`); break;

default:
  console.error(`unknown target ${argv[1]}`);
  process.exit(1)

}
console.log(`// do not edit, generated by ../scripts/make-descriptors.js ${argv[1]}`)
