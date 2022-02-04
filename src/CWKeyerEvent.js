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
export class CWKeyerEvent {

  constructor(audioContext) {
    this.context = audioContext;
    this.events = [];
  }

  updateAudioContext(audioContext) { this.context = audioContext; }
  
  // delegate to context
  
  get currentTime() { return this.context.currentTime; }

  get sampleRate() { return this.context.sampleRate; }

  get baseLatency() { return this.context.baseLatency; }
  
  /**
   *  on: listen to events
   */
  on(type, func) {
    // console.log(`on ${type} ${func}`);
    (this.events[type] = this.events[type] || []).push(func);
  }

  /**
   *  Off: stop listening to event / specific callback
   */
  off(type, func) {
    // console.log('off', type, func);
    if (!type) this.events = [];
    const list = this.events[type] || [];
    let i = func ? list.length : 0;
    while (i > 0) {
      i -= 1;
      if (func === list[i]) list.splice(i, 1);
    }
  }

  /**
   * Emit: send event, callbacks will be triggered
   */
  emit(type, ...args) {
    const list = this.events[type] || [];
    // console.log(`emit '${type}' (${args}) listeners ${list.length}`);
    list.forEach(f => f.apply(window, args));
  }

  /**
   * After: fire an event at some seconds into the future.
   * using the web audio sample timer.
   */
  after(dtime, func) { this.when(this.currentTime+dtime, func); }
    
  /**
   * When: fire an event at a specified time.
   * using the web audio sample timer.
   */
  when(time, func) {
    const timer = this.context.createConstantSource();
    timer.onended = func;
    timer.start();
    timer.stop(Math.max(time,this.currentTime+1/this.sampleRate));
  }

}
// Local Variables: 
// mode: JavaScript
// js-indent-level: 2
// End:
