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

  function interpreter(code) {
    let tokens = lex(code);
    alert(tokens.join(":"));
  }

  function lex(code) {
    let tokens = [];

    let multichar = "";

    for(let i = 0; i < code.length; ++i) {
      let tok = code[i];
      multichar += tok;

      if(multichar.match(/[+-]?\d+(\.\d+)?(e[-+]?\d+)?)/i).length === 1) {
        if(multichar.match(/[+-]?\d+(\.\d+)?(e[-+]?\d+)?/i)[0].length ===
            multichar.length-1) {
          tokens.push(["number", multichar.substr(0, multichar.length-1)]);
          multichar = "";
        }
      }
    }

    return tokens;
  }

  return interpreter;
})();
