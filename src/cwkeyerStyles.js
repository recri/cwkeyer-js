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

/*
According to: https://developers.google.com/web/fundamentals/web-components/shadowdom
"Inheritable styles (background, color, font, line-height, etc.)
continue to inherit in shadow DOM. That is, they pierce the shadow DOM
boundary by default. If you want to start with a fresh slate, use all:
initial; to reset inheritable styles to their initial value when they
cross the shadow boundary."
*/
import { css } from 'lit';

// application color scheme, from material design color tool
// const colorPrimary = css`#1d62a7`;
// const colorPLight = css`#5b8fd9`;
// const colorPDark  = css`#003977`;
// const colorSecondary = css`#9e9e9e`;
// const colorSLight = css`#cfcfcf`;
// const colorSDark =  css`#707070`;

export const cwkeyerRootStyles = css`
:host {
  min-height: 1vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  /* these three are inherited from ../index.html */
  /* font-size: calc(10px + 2vmin); */
  /* color: black; */
  /* background-color: #ededed; */
  margin: 0;
  text-align: center;
}
main {
  flex-grow: 1;
}
.logo > svg {
  margin-left: 5%;
  max-width: 90%;
  margin-top: 16px;
}
.app-footer {
  font-size: calc(12px + 0.5vmin);
  align-items: center;
}
.app-footer a {
  margin-left: 5px;
}
`

export const cwkeyerFolderStyles = css`
:host {
  min-height: 1vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  margin: 0;
  text-align: center;
}
`
export const cwkeyerComponentStyles = css`
:host {
  min-height: 1vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  margin: 0;
  text-align: center;
}
`

export const cwkeyerCommonStyles = css`
.h1 { font-size: 200%; margin: .33em 0; }
.h2 { font-size: 150%; margin: .38em 0; }
.h3 { font-size: 117%; margin: .42em 0; }
.h5 { font-size: 83%; margin: .75em 0; }
.h6 { font-size: 75%; margin: .84em 0; }
.h1, .h2, .h3, .h4, .h5, .h6 { 
  font-weight: bolder;
  width: 60%;
  text-align: left;
}

div.column1 { width: 100%; }
div.column2 { width: 50%; }
div.column3 { width: 33%; }
div.column4 {  width: 25%; }
div.column5 { width: 20%; }
div.column6 { width: 16.6%; }
div.column7 { width: 14.2%; }
div.column8 { width: 12.5%; }
div.column9 { width: 11.1%; }
div.column10 { width: 10%; }

div.chunk {
  display: inline-flex;
  flex-direction: rows;
  flex-wrap: nowrap;
}
div.group {
  display: inline-flex;
  flex-direction: rows;
  flex-wrap: wrap;
}
div.columns {
  display: inline-flex;
  flex-direction: columns;
  flex-wrap: wrap;
}
div.hidden {
  display: none;
}
button, select, input {
  /* this inherits from someplace else by default
  /* font-size: calc(10px + 2vmin); */
  font-size: 95%;
}
input[type="number"][size="5"] {
  width: 3.25em;
}
input[type="number"][size="4"] {
  width: 2.5em;
}
input[type="number"][size="3"] {
  width: 2em;
}
div.panel {
  margin: auto;
  width: 90%;
}
div.subpanel {
  margin: auto;
  width: 100%;
}
`
