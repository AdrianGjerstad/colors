//
// https://github.com/AdrianGjerstad/colors/blob/master/src/colors.js
//
// Copyright (c) 2019 Adrian Gjerstad and others.
// This repository is distributed under the MIT License.
//
// You can find a copy of the license here:
//
//   https://github.com/AdrianGjerstad/colors/blob/master/LICENSE
//
// If you wish to redistribute this file or others, please copy the below
// information for others to read. As an alternative, you may copy the LICENSE
// file found at the root of this repository into your redistributed copy along
// with this notice:
//
//   "The Colors project was started and is run by Adrian Gjerstad as
//   @AdrianGjerstad on github. I do not own the original copy. This is my
//   altered version."
//
// NOTE THAT THIS IS AS A QUOTE, AS THIS IS THE OFFICIAL REPOSITORY.
//
// MIT License
//
// Copyright (c) 2019 Adrian Gjerstad
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

window.ColorsExecuter = (function() {
  window.error = function(msg, url, line, col) {
    alert(msg + " @" + url + ":" + line + ":" + col);
  };

  let commands = [
    "println",
    "print",
    "warnln",
    "warn",
    "errorln",
    "error",
    "debugln",
    "debug",
    "incahr",
    "inchars",
    "inline",
    "concat",
    "substr",
    "return"
  ];

  commands.findMatch = function(key) {
    for(let i = 0; i < this.length; ++i) {
      if(this[i] === key) {
        return true;
      }
    }

    return false;
  }

  let events = [
    /preload\s*\n*\s*\(\s*\n*\s*\)\s*\n*\s*:/,
    /start\s*\n*\s*\(\s*\n*\s*\)\s*\n*\s*:/,
    /finish\s*\n*\s*\(\s*\n*\s*\)\s*\n*\s*:/,
    /keydown\s*\n*\s*\(\s*\n*\s*[_$]?[a-zA-Z0-9$_]+\s*\n*\s*,\s*\n*\s*[_$]?[a-zA-Z0-9$_]+\s*\n*\s*\)\s*\n*\s*:/,
    /keyup\s*\n*\s*\(\s*\n*\s*[_$]?[a-zA-Z0-9$_]+\s*\n*\s*,\s*\n*\s*[_$]?[a-zA-Z0-9$_]+\s*\n*\s*\)\s*\n*\s*:/,
    /keytyped\s*\n*\s*\(\s*\n*\s*[_$]?[a-zA-Z0-9$_]+\s*\n*\s*\)\s*\n*\s*:/,
  ];

  events.findMatch = function(key) {
    for(let i = 0; i < this.length; ++i) {
      if(key.match(this[i]) !== null) {
        return true;
      }
    }

    return false;
  }

  function interpreter(code) {
    let tokens = lex(code);
    console.log(tokens);
  }

  function lex(code) {
    console.debug("lexer: lex code:\n" + code);
    code += " ";
    let tokens = [];

    let multichar = "";
    let string = false;
    let comment = false;

    for(let i = 0; i < code.length; ++i) {
      let tok = code[i];
      multichar += tok;

      if(multichar.match(/[\s\n]/) !== null && multichar.length === 1) {
        multichar = "";

        if(tok === "\n") comment = false;
        continue;
      }

      if(comment) multichar = "";

      if(!string && !comment) {
        if(tok === "#") {
          comment = true;
          multichar = "";
        } else if(multichar.match(/[+-]?\d+(\.\d+)?(e[-+]?\d+)?/i) !== null) {
          if(multichar.match(/[+-]?\d+(\.\d+)?(e[-+]?\d+)?/i)[0].length ===
              multichar.length-1) {
            tokens.push(["number", multichar.substr(0, multichar.length-1)]);
            multichar = "";
          }
        } else if(multichar.substr(0, multichar.length-1) === "true") {
          tokens.push(["boolean", "true"]);
          multichar = "";
        } else if(multichar.substr(0, multichar.length-1) === "false") {
          tokens.push(["boolean", "false"]);
          multichar = "";
        } else if(multichar.substr(0, multichar.length-1) === '"' ||
                  multichar.substr(0, multichar.length-1) === "'") {
          string = true;
          multichar = multichar[1];
        } else if(events.findMatch(multichar)) {
          tokens.push(["event", multichar.substr(0, multichar.length-1)]);
          multichar = "";
        } else if(commands.findMatch(multichar.substr(0, multichar.length-1))&&
            multichar[multichar.length-1]===" ") {
          tokens.push(["command", multichar.substr(0, multichar.length-1)]);
          multichar = "";
        } else if(multichar.match(/[_$]?[a-z0-9$_]+[\s\n]/i) !== null) {
          tokens.push(["variable", multichar.substr(0, multichar.length-1)]);
          multichar = "";
        }
      } else if(string && (tok === '"' || tok === "'")) {
        string = false;
        tokens.push(["string", multichar.substr(0, multichar.length-1)]);
        multichar = "";
      }
    }

    return tokens;
  }

  return interpreter;
})();
