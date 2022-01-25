//
// cwkeyer-js - a progressive web app for morse code
// Copyright (c) 2022 Roger E Critchlow Jr, Charlestown, MA, USA
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

/* eslint no-bitwise: ["error", { "allow": ["&","|","<<",'>>',"~"] }] */
export class CWKeyerTWE extends CWKeyerDefault {

  // constructor(context, name) { super(context, name); }

  onmidimessage(msg) {
    super.onmidimessage(msg);
  }

}
// Local Variables:
// mode: JavaScript
// js-indent-level: 2
// End:

