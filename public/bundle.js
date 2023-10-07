(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (process){(function (){
// 'path' module extracted from Node.js v8.11.1 (only the posix part)
// transplited with Babel

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

function assertPath(path) {
  if (typeof path !== 'string') {
    throw new TypeError('Path must be a string. Received ' + JSON.stringify(path));
  }
}

// Resolves . and .. elements in a path with directory names
function normalizeStringPosix(path, allowAboveRoot) {
  var res = '';
  var lastSegmentLength = 0;
  var lastSlash = -1;
  var dots = 0;
  var code;
  for (var i = 0; i <= path.length; ++i) {
    if (i < path.length)
      code = path.charCodeAt(i);
    else if (code === 47 /*/*/)
      break;
    else
      code = 47 /*/*/;
    if (code === 47 /*/*/) {
      if (lastSlash === i - 1 || dots === 1) {
        // NOOP
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 /*.*/ || res.charCodeAt(res.length - 2) !== 46 /*.*/) {
          if (res.length > 2) {
            var lastSlashIndex = res.lastIndexOf('/');
            if (lastSlashIndex !== res.length - 1) {
              if (lastSlashIndex === -1) {
                res = '';
                lastSegmentLength = 0;
              } else {
                res = res.slice(0, lastSlashIndex);
                lastSegmentLength = res.length - 1 - res.lastIndexOf('/');
              }
              lastSlash = i;
              dots = 0;
              continue;
            }
          } else if (res.length === 2 || res.length === 1) {
            res = '';
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0)
            res += '/..';
          else
            res = '..';
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0)
          res += '/' + path.slice(lastSlash + 1, i);
        else
          res = path.slice(lastSlash + 1, i);
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (code === 46 /*.*/ && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}

function _format(sep, pathObject) {
  var dir = pathObject.dir || pathObject.root;
  var base = pathObject.base || (pathObject.name || '') + (pathObject.ext || '');
  if (!dir) {
    return base;
  }
  if (dir === pathObject.root) {
    return dir + base;
  }
  return dir + sep + base;
}

var posix = {
  // path.resolve([from ...], to)
  resolve: function resolve() {
    var resolvedPath = '';
    var resolvedAbsolute = false;
    var cwd;

    for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      var path;
      if (i >= 0)
        path = arguments[i];
      else {
        if (cwd === undefined)
          cwd = process.cwd();
        path = cwd;
      }

      assertPath(path);

      // Skip empty entries
      if (path.length === 0) {
        continue;
      }

      resolvedPath = path + '/' + resolvedPath;
      resolvedAbsolute = path.charCodeAt(0) === 47 /*/*/;
    }

    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)

    // Normalize the path
    resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);

    if (resolvedAbsolute) {
      if (resolvedPath.length > 0)
        return '/' + resolvedPath;
      else
        return '/';
    } else if (resolvedPath.length > 0) {
      return resolvedPath;
    } else {
      return '.';
    }
  },

  normalize: function normalize(path) {
    assertPath(path);

    if (path.length === 0) return '.';

    var isAbsolute = path.charCodeAt(0) === 47 /*/*/;
    var trailingSeparator = path.charCodeAt(path.length - 1) === 47 /*/*/;

    // Normalize the path
    path = normalizeStringPosix(path, !isAbsolute);

    if (path.length === 0 && !isAbsolute) path = '.';
    if (path.length > 0 && trailingSeparator) path += '/';

    if (isAbsolute) return '/' + path;
    return path;
  },

  isAbsolute: function isAbsolute(path) {
    assertPath(path);
    return path.length > 0 && path.charCodeAt(0) === 47 /*/*/;
  },

  join: function join() {
    if (arguments.length === 0)
      return '.';
    var joined;
    for (var i = 0; i < arguments.length; ++i) {
      var arg = arguments[i];
      assertPath(arg);
      if (arg.length > 0) {
        if (joined === undefined)
          joined = arg;
        else
          joined += '/' + arg;
      }
    }
    if (joined === undefined)
      return '.';
    return posix.normalize(joined);
  },

  relative: function relative(from, to) {
    assertPath(from);
    assertPath(to);

    if (from === to) return '';

    from = posix.resolve(from);
    to = posix.resolve(to);

    if (from === to) return '';

    // Trim any leading backslashes
    var fromStart = 1;
    for (; fromStart < from.length; ++fromStart) {
      if (from.charCodeAt(fromStart) !== 47 /*/*/)
        break;
    }
    var fromEnd = from.length;
    var fromLen = fromEnd - fromStart;

    // Trim any leading backslashes
    var toStart = 1;
    for (; toStart < to.length; ++toStart) {
      if (to.charCodeAt(toStart) !== 47 /*/*/)
        break;
    }
    var toEnd = to.length;
    var toLen = toEnd - toStart;

    // Compare paths to find the longest common path from root
    var length = fromLen < toLen ? fromLen : toLen;
    var lastCommonSep = -1;
    var i = 0;
    for (; i <= length; ++i) {
      if (i === length) {
        if (toLen > length) {
          if (to.charCodeAt(toStart + i) === 47 /*/*/) {
            // We get here if `from` is the exact base path for `to`.
            // For example: from='/foo/bar'; to='/foo/bar/baz'
            return to.slice(toStart + i + 1);
          } else if (i === 0) {
            // We get here if `from` is the root
            // For example: from='/'; to='/foo'
            return to.slice(toStart + i);
          }
        } else if (fromLen > length) {
          if (from.charCodeAt(fromStart + i) === 47 /*/*/) {
            // We get here if `to` is the exact base path for `from`.
            // For example: from='/foo/bar/baz'; to='/foo/bar'
            lastCommonSep = i;
          } else if (i === 0) {
            // We get here if `to` is the root.
            // For example: from='/foo'; to='/'
            lastCommonSep = 0;
          }
        }
        break;
      }
      var fromCode = from.charCodeAt(fromStart + i);
      var toCode = to.charCodeAt(toStart + i);
      if (fromCode !== toCode)
        break;
      else if (fromCode === 47 /*/*/)
        lastCommonSep = i;
    }

    var out = '';
    // Generate the relative path based on the path difference between `to`
    // and `from`
    for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
      if (i === fromEnd || from.charCodeAt(i) === 47 /*/*/) {
        if (out.length === 0)
          out += '..';
        else
          out += '/..';
      }
    }

    // Lastly, append the rest of the destination (`to`) path that comes after
    // the common path parts
    if (out.length > 0)
      return out + to.slice(toStart + lastCommonSep);
    else {
      toStart += lastCommonSep;
      if (to.charCodeAt(toStart) === 47 /*/*/)
        ++toStart;
      return to.slice(toStart);
    }
  },

  _makeLong: function _makeLong(path) {
    return path;
  },

  dirname: function dirname(path) {
    assertPath(path);
    if (path.length === 0) return '.';
    var code = path.charCodeAt(0);
    var hasRoot = code === 47 /*/*/;
    var end = -1;
    var matchedSlash = true;
    for (var i = path.length - 1; i >= 1; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          if (!matchedSlash) {
            end = i;
            break;
          }
        } else {
        // We saw the first non-path separator
        matchedSlash = false;
      }
    }

    if (end === -1) return hasRoot ? '/' : '.';
    if (hasRoot && end === 1) return '//';
    return path.slice(0, end);
  },

  basename: function basename(path, ext) {
    if (ext !== undefined && typeof ext !== 'string') throw new TypeError('"ext" argument must be a string');
    assertPath(path);

    var start = 0;
    var end = -1;
    var matchedSlash = true;
    var i;

    if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
      if (ext.length === path.length && ext === path) return '';
      var extIdx = ext.length - 1;
      var firstNonSlashEnd = -1;
      for (i = path.length - 1; i >= 0; --i) {
        var code = path.charCodeAt(i);
        if (code === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else {
          if (firstNonSlashEnd === -1) {
            // We saw the first non-path separator, remember this index in case
            // we need it if the extension ends up not matching
            matchedSlash = false;
            firstNonSlashEnd = i + 1;
          }
          if (extIdx >= 0) {
            // Try to match the explicit extension
            if (code === ext.charCodeAt(extIdx)) {
              if (--extIdx === -1) {
                // We matched the extension, so mark this as the end of our path
                // component
                end = i;
              }
            } else {
              // Extension does not match, so our result is the entire path
              // component
              extIdx = -1;
              end = firstNonSlashEnd;
            }
          }
        }
      }

      if (start === end) end = firstNonSlashEnd;else if (end === -1) end = path.length;
      return path.slice(start, end);
    } else {
      for (i = path.length - 1; i >= 0; --i) {
        if (path.charCodeAt(i) === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // path component
          matchedSlash = false;
          end = i + 1;
        }
      }

      if (end === -1) return '';
      return path.slice(start, end);
    }
  },

  extname: function extname(path) {
    assertPath(path);
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;
    for (var i = path.length - 1; i >= 0; --i) {
      var code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1)
            startDot = i;
          else if (preDotState !== 1)
            preDotState = 1;
      } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      return '';
    }
    return path.slice(startDot, end);
  },

  format: function format(pathObject) {
    if (pathObject === null || typeof pathObject !== 'object') {
      throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
    }
    return _format('/', pathObject);
  },

  parse: function parse(path) {
    assertPath(path);

    var ret = { root: '', dir: '', base: '', ext: '', name: '' };
    if (path.length === 0) return ret;
    var code = path.charCodeAt(0);
    var isAbsolute = code === 47 /*/*/;
    var start;
    if (isAbsolute) {
      ret.root = '/';
      start = 1;
    } else {
      start = 0;
    }
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    var i = path.length - 1;

    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;

    // Get non-dir info
    for (; i >= start; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1) startDot = i;else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
    // We saw a non-dot character immediately before the dot
    preDotState === 0 ||
    // The (right-most) trimmed path component is exactly '..'
    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      if (end !== -1) {
        if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end);else ret.base = ret.name = path.slice(startPart, end);
      }
    } else {
      if (startPart === 0 && isAbsolute) {
        ret.name = path.slice(1, startDot);
        ret.base = path.slice(1, end);
      } else {
        ret.name = path.slice(startPart, startDot);
        ret.base = path.slice(startPart, end);
      }
      ret.ext = path.slice(startDot, end);
    }

    if (startPart > 0) ret.dir = path.slice(0, startPart - 1);else if (isAbsolute) ret.dir = '/';

    return ret;
  },

  sep: '/',
  delimiter: ':',
  win32: null,
  posix: null
};

posix.posix = posix;

module.exports = posix;

}).call(this)}).call(this,require('_process'))
},{"_process":4}],2:[function(require,module,exports){
module.exports=[
{"atomicNumber":1,"symbol":"H","name":"Hydrogen","atomicMass":"1.00794(4)","cpkHexColor":"FFFFFF","electronicConfiguration":"1s1","electronegativity":2.2,"atomicRadius":37,"ionRadius":"","vanDelWaalsRadius":120,"ionizationEnergy":1312,"electronAffinity":-73,"oxidationStates":"-1, 1","standardState":"gas","bondingType":"diatomic","meltingPoint":14,"boilingPoint":20,"density":0.0000899,"groupBlock":"nonmetal","yearDiscovered":1766},
{"atomicNumber":2,"symbol":"He","name":"Helium","atomicMass":"4.002602(2)","cpkHexColor":"D9FFFF","electronicConfiguration":"1s2","electronegativity":"","atomicRadius":32,"ionRadius":"","vanDelWaalsRadius":140,"ionizationEnergy":2372,"electronAffinity":0,"oxidationStates":"","standardState":"gas","bondingType":"atomic","meltingPoint":"","boilingPoint":4,"density":0.0001785,"groupBlock":"noble gas","yearDiscovered":1868},
{"atomicNumber":3,"symbol":"Li","name":"Lithium","atomicMass":"6.941(2)","cpkHexColor":"CC80FF","electronicConfiguration":"[He] 2s1","electronegativity":0.98,"atomicRadius":134,"ionRadius":"76 (+1)","vanDelWaalsRadius":182,"ionizationEnergy":520,"electronAffinity":-60,"oxidationStates":1,"standardState":"solid","bondingType":"metallic","meltingPoint":454,"boilingPoint":1615,"density":0.535,"groupBlock":"alkali metal","yearDiscovered":1817},
{"atomicNumber":4,"symbol":"Be","name":"Beryllium","atomicMass":"9.012182(3)","cpkHexColor":"C2FF00","electronicConfiguration":"[He] 2s2","electronegativity":1.57,"atomicRadius":90,"ionRadius":"45 (+2)","vanDelWaalsRadius":"","ionizationEnergy":900,"electronAffinity":0,"oxidationStates":2,"standardState":"solid","bondingType":"metallic","meltingPoint":1560,"boilingPoint":2743,"density":1.848,"groupBlock":"alkaline earth metal","yearDiscovered":1798},
{"atomicNumber":5,"symbol":"B","name":"Boron","atomicMass":"10.811(7)","cpkHexColor":"FFB5B5","electronicConfiguration":"[He] 2s2 2p1","electronegativity":2.04,"atomicRadius":82,"ionRadius":"27 (+3)","vanDelWaalsRadius":"","ionizationEnergy":801,"electronAffinity":-27,"oxidationStates":"1, 2, 3","standardState":"solid","bondingType":"covalent network","meltingPoint":2348,"boilingPoint":4273,"density":2.46,"groupBlock":"metalloid","yearDiscovered":1807},
{"atomicNumber":6,"symbol":"C","name":"Carbon","atomicMass":"12.0107(8)","cpkHexColor":909090,"electronicConfiguration":"[He] 2s2 2p2","electronegativity":2.55,"atomicRadius":77,"ionRadius":"16 (+4)","vanDelWaalsRadius":170,"ionizationEnergy":1087,"electronAffinity":-154,"oxidationStates":"-4, -3, -2, -1, 1, 2, 3, 4","standardState":"solid","bondingType":"covalent network","meltingPoint":3823,"boilingPoint":4300,"density":2.26,"groupBlock":"nonmetal","yearDiscovered":"Ancient"},
{"atomicNumber":7,"symbol":"N","name":"Nitrogen","atomicMass":"14.0067(2)","cpkHexColor":"3050F8","electronicConfiguration":"[He] 2s2 2p3","electronegativity":3.04,"atomicRadius":75,"ionRadius":"146 (-3)","vanDelWaalsRadius":155,"ionizationEnergy":1402,"electronAffinity":-7,"oxidationStates":"-3, -2, -1, 1, 2, 3, 4, 5","standardState":"gas","bondingType":"diatomic","meltingPoint":63,"boilingPoint":77,"density":0.001251,"groupBlock":"nonmetal","yearDiscovered":1772},
{"atomicNumber":8,"symbol":"O","name":"Oxygen","atomicMass":"15.9994(3)","cpkHexColor":"FF0D0D","electronicConfiguration":"[He] 2s2 2p4","electronegativity":3.44,"atomicRadius":73,"ionRadius":"140 (-2)","vanDelWaalsRadius":152,"ionizationEnergy":1314,"electronAffinity":-141,"oxidationStates":"-2, -1, 1, 2","standardState":"gas","bondingType":"diatomic","meltingPoint":55,"boilingPoint":90,"density":0.001429,"groupBlock":"nonmetal","yearDiscovered":1774},
{"atomicNumber":9,"symbol":"F","name":"Fluorine","atomicMass":"18.9984032(5)","cpkHexColor":9e+51,"electronicConfiguration":"[He] 2s2 2p5","electronegativity":3.98,"atomicRadius":71,"ionRadius":"133 (-1)","vanDelWaalsRadius":147,"ionizationEnergy":1681,"electronAffinity":-328,"oxidationStates":-1,"standardState":"gas","bondingType":"atomic","meltingPoint":54,"boilingPoint":85,"density":0.001696,"groupBlock":"halogen","yearDiscovered":1670},
{"atomicNumber":10,"symbol":"Ne","name":"Neon","atomicMass":"20.1797(6)","cpkHexColor":"B3E3F5","electronicConfiguration":"[He] 2s2 2p6","electronegativity":"","atomicRadius":69,"ionRadius":"","vanDelWaalsRadius":154,"ionizationEnergy":2081,"electronAffinity":0,"oxidationStates":"","standardState":"gas","bondingType":"atomic","meltingPoint":25,"boilingPoint":27,"density":0.0009,"groupBlock":"noble gas","yearDiscovered":1898},
{"atomicNumber":11,"symbol":"Na","name":"Sodium","atomicMass":"22.98976928(2)","cpkHexColor":"AB5CF2","electronicConfiguration":"[Ne] 3s1","electronegativity":0.93,"atomicRadius":154,"ionRadius":"102 (+1)","vanDelWaalsRadius":227,"ionizationEnergy":496,"electronAffinity":-53,"oxidationStates":"-1, 1","standardState":"solid","bondingType":"metallic","meltingPoint":371,"boilingPoint":1156,"density":0.968,"groupBlock":"alkali metal","yearDiscovered":1807},
{"atomicNumber":12,"symbol":"Mg","name":"Magnesium","atomicMass":"24.3050(6)","cpkHexColor":"8AFF00","electronicConfiguration":"[Ne] 3s2","electronegativity":1.31,"atomicRadius":130,"ionRadius":"72 (+2)","vanDelWaalsRadius":173,"ionizationEnergy":738,"electronAffinity":0,"oxidationStates":"1, 2","standardState":"solid","bondingType":"metallic","meltingPoint":923,"boilingPoint":1363,"density":1.738,"groupBlock":"alkaline earth metal","yearDiscovered":1808},
{"atomicNumber":13,"symbol":"Al","name":"Aluminum","atomicMass":"26.9815386(8)","cpkHexColor":"BFA6A6","electronicConfiguration":"[Ne] 3s2 3p1","electronegativity":1.61,"atomicRadius":118,"ionRadius":"53.5 (+3)","vanDelWaalsRadius":"","ionizationEnergy":578,"electronAffinity":-43,"oxidationStates":"1, 3","standardState":"solid","bondingType":"metallic","meltingPoint":933,"boilingPoint":2792,"density":2.7,"groupBlock":"metal","yearDiscovered":"Ancient"},
{"atomicNumber":14,"symbol":"Si","name":"Silicon","atomicMass":"28.0855(3)","cpkHexColor":"F0C8A0","electronicConfiguration":"[Ne] 3s2 3p2","electronegativity":1.9,"atomicRadius":111,"ionRadius":"40 (+4)","vanDelWaalsRadius":210,"ionizationEnergy":787,"electronAffinity":-134,"oxidationStates":"-4, -3, -2, -1, 1, 2, 3, 4","standardState":"solid","bondingType":"metallic","meltingPoint":1687,"boilingPoint":3173,"density":2.33,"groupBlock":"metalloid","yearDiscovered":1854},
{"atomicNumber":15,"symbol":"P","name":"Phosphorus","atomicMass":"30.973762(2)","cpkHexColor":"FF8000","electronicConfiguration":"[Ne] 3s2 3p3","electronegativity":2.19,"atomicRadius":106,"ionRadius":"44 (+3)","vanDelWaalsRadius":180,"ionizationEnergy":1012,"electronAffinity":-72,"oxidationStates":"-3, -2, -1, 1, 2, 3, 4, 5","standardState":"solid","bondingType":"covalent network","meltingPoint":317,"boilingPoint":554,"density":1.823,"groupBlock":"nonmetal","yearDiscovered":1669},
{"atomicNumber":16,"symbol":"S","name":"Sulfur","atomicMass":"32.065(5)","cpkHexColor":"FFFF30","electronicConfiguration":"[Ne] 3s2 3p4","electronegativity":2.58,"atomicRadius":102,"ionRadius":"184 (-2)","vanDelWaalsRadius":180,"ionizationEnergy":1000,"electronAffinity":-200,"oxidationStates":"-2, -1, 1, 2, 3, 4, 5, 6","standardState":"solid","bondingType":"covalent network","meltingPoint":388,"boilingPoint":718,"density":1.96,"groupBlock":"nonmetal","yearDiscovered":"Ancient"},
{"atomicNumber":17,"symbol":"Cl","name":"Chlorine","atomicMass":"35.453(2)","cpkHexColor":"1FF01F","electronicConfiguration":"[Ne] 3s2 3p5","electronegativity":3.16,"atomicRadius":99,"ionRadius":"181 (-1)","vanDelWaalsRadius":175,"ionizationEnergy":1251,"electronAffinity":-349,"oxidationStates":"-1, 1, 2, 3, 4, 5, 6, 7","standardState":"gas","bondingType":"covalent network","meltingPoint":172,"boilingPoint":239,"density":0.003214,"groupBlock":"halogen","yearDiscovered":1774},
{"atomicNumber":18,"symbol":"Ar","name":"Argon","atomicMass":"39.948(1)","cpkHexColor":"80D1E3","electronicConfiguration":"[Ne] 3s2 3p6","electronegativity":"","atomicRadius":97,"ionRadius":"","vanDelWaalsRadius":188,"ionizationEnergy":1521,"electronAffinity":0,"oxidationStates":"","standardState":"gas","bondingType":"atomic","meltingPoint":84,"boilingPoint":87,"density":0.001784,"groupBlock":"noble gas","yearDiscovered":1894},
{"atomicNumber":19,"symbol":"K","name":"Potassium","atomicMass":"39.0983(1)","cpkHexColor":"8F40D4","electronicConfiguration":"[Ar] 4s1","electronegativity":0.82,"atomicRadius":196,"ionRadius":"138 (+1)","vanDelWaalsRadius":275,"ionizationEnergy":419,"electronAffinity":-48,"oxidationStates":1,"standardState":"solid","bondingType":"metallic","meltingPoint":337,"boilingPoint":1032,"density":0.856,"groupBlock":"alkali metal","yearDiscovered":1807},
{"atomicNumber":20,"symbol":"Ca","name":"Calcium","atomicMass":"40.078(4)","cpkHexColor":"3DFF00","electronicConfiguration":"[Ar] 4s2","electronegativity":1,"atomicRadius":174,"ionRadius":"100 (+2)","vanDelWaalsRadius":"","ionizationEnergy":590,"electronAffinity":-2,"oxidationStates":2,"standardState":"solid","bondingType":"metallic","meltingPoint":1115,"boilingPoint":1757,"density":1.55,"groupBlock":"alkaline earth metal","yearDiscovered":"Ancient"},
{"atomicNumber":21,"symbol":"Sc","name":"Scandium","atomicMass":"44.955912(6)","cpkHexColor":"E6E6E6","electronicConfiguration":"[Ar] 3d1 4s2","electronegativity":1.36,"atomicRadius":144,"ionRadius":"74.5 (+3)","vanDelWaalsRadius":"","ionizationEnergy":633,"electronAffinity":-18,"oxidationStates":"1, 2, 3","standardState":"solid","bondingType":"metallic","meltingPoint":1814,"boilingPoint":3103,"density":2.985,"groupBlock":"transition metal","yearDiscovered":1876},
{"atomicNumber":22,"symbol":"Ti","name":"Titanium","atomicMass":"47.867(1)","cpkHexColor":"BFC2C7","electronicConfiguration":"[Ar] 3d2 4s2","electronegativity":1.54,"atomicRadius":136,"ionRadius":"86 (+2)","vanDelWaalsRadius":"","ionizationEnergy":659,"electronAffinity":-8,"oxidationStates":"-1, 2, 3, 4","standardState":"solid","bondingType":"metallic","meltingPoint":1941,"boilingPoint":3560,"density":4.507,"groupBlock":"transition metal","yearDiscovered":1791},
{"atomicNumber":23,"symbol":"V","name":"Vanadium","atomicMass":"50.9415(1)","cpkHexColor":"A6A6AB","electronicConfiguration":"[Ar] 3d3 4s2","electronegativity":1.63,"atomicRadius":125,"ionRadius":"79 (+2)","vanDelWaalsRadius":"","ionizationEnergy":651,"electronAffinity":-51,"oxidationStates":"-1, 2, 3, 4","standardState":"solid","bondingType":"metallic","meltingPoint":2183,"boilingPoint":3680,"density":6.11,"groupBlock":"transition metal","yearDiscovered":1803},
{"atomicNumber":24,"symbol":"Cr","name":"Chromium","atomicMass":"51.9961(6)","cpkHexColor":"8A99C7","electronicConfiguration":"[Ar] 3d5 4s1","electronegativity":1.66,"atomicRadius":127,"ionRadius":"80 (+2*)","vanDelWaalsRadius":"","ionizationEnergy":653,"electronAffinity":-64,"oxidationStates":"-2, -1, 1, 2, 3, 4, 5, 6","standardState":"solid","bondingType":"metallic","meltingPoint":2180,"boilingPoint":2944,"density":7.14,"groupBlock":"transition metal","yearDiscovered":"Ancient"},
{"atomicNumber":25,"symbol":"Mn","name":"Manganese","atomicMass":"54.938045(5)","cpkHexColor":"9C7AC7","electronicConfiguration":"[Ar] 3d5 4s2","electronegativity":1.55,"atomicRadius":139,"ionRadius":"67 (+2)","vanDelWaalsRadius":"","ionizationEnergy":717,"electronAffinity":0,"oxidationStates":"-3, -2, -1, 1, 2, 3, 4, 5, 6, 7","standardState":"solid","bondingType":"metallic","meltingPoint":1519,"boilingPoint":2334,"density":7.47,"groupBlock":"transition metal","yearDiscovered":1774},
{"atomicNumber":26,"symbol":"Fe","name":"Iron","atomicMass":"55.845(2)","cpkHexColor":"E06633","electronicConfiguration":"[Ar] 3d6 4s2","electronegativity":1.83,"atomicRadius":125,"ionRadius":"78 (+2*)","vanDelWaalsRadius":"","ionizationEnergy":763,"electronAffinity":-16,"oxidationStates":"-2, -1, 1, 2, 3, 4, 5, 6","standardState":"solid","bondingType":"metallic","meltingPoint":1811,"boilingPoint":3134,"density":7.874,"groupBlock":"transition metal","yearDiscovered":"Ancient"},
{"atomicNumber":27,"symbol":"Co","name":"Cobalt","atomicMass":"58.933195(5)","cpkHexColor":"F090A0","electronicConfiguration":"[Ar] 3d7 4s2","electronegativity":1.88,"atomicRadius":126,"ionRadius":"74.5 (+2*)","vanDelWaalsRadius":"","ionizationEnergy":760,"electronAffinity":-64,"oxidationStates":"-1, 1, 2, 3, 4, 5","standardState":"solid","bondingType":"metallic","meltingPoint":1768,"boilingPoint":3200,"density":8.9,"groupBlock":"transition metal","yearDiscovered":"Ancient"},
{"atomicNumber":28,"symbol":"Ni","name":"Nickel","atomicMass":"58.6934(4)","cpkHexColor":"50D050","electronicConfiguration":"[Ar] 3d8 4s2","electronegativity":1.91,"atomicRadius":121,"ionRadius":"69 (+2)","vanDelWaalsRadius":163,"ionizationEnergy":737,"electronAffinity":-112,"oxidationStates":"-1, 1, 2, 3, 4","standardState":"solid","bondingType":"metallic","meltingPoint":1728,"boilingPoint":3186,"density":8.908,"groupBlock":"transition metal","yearDiscovered":1751},
{"atomicNumber":29,"symbol":"Cu","name":"Copper","atomicMass":"63.546(3)","cpkHexColor":"C88033","electronicConfiguration":"[Ar] 3d10 4s1","electronegativity":1.9,"atomicRadius":138,"ionRadius":"77 (+1)","vanDelWaalsRadius":140,"ionizationEnergy":746,"electronAffinity":-118,"oxidationStates":"1, 2, 3, 4","standardState":"solid","bondingType":"metallic","meltingPoint":1358,"boilingPoint":3200,"density":8.92,"groupBlock":"transition metal","yearDiscovered":"Ancient"},
{"atomicNumber":30,"symbol":"Zn","name":"Zinc","atomicMass":"65.38(2)","cpkHexColor":"7D80B0","electronicConfiguration":"[Ar] 3d10 4s2","electronegativity":1.65,"atomicRadius":131,"ionRadius":"74 (+2)","vanDelWaalsRadius":139,"ionizationEnergy":906,"electronAffinity":0,"oxidationStates":2,"standardState":"solid","bondingType":"metallic","meltingPoint":693,"boilingPoint":1180,"density":7.14,"groupBlock":"transition metal","yearDiscovered":1746},
{"atomicNumber":31,"symbol":"Ga","name":"Gallium","atomicMass":"69.723(1)","cpkHexColor":"C28F8F","electronicConfiguration":"[Ar] 3d10 4s2 4p1","electronegativity":1.81,"atomicRadius":126,"ionRadius":"62 (+3)","vanDelWaalsRadius":187,"ionizationEnergy":579,"electronAffinity":-29,"oxidationStates":"1, 2, 3","standardState":"solid","bondingType":"metallic","meltingPoint":303,"boilingPoint":2477,"density":5.904,"groupBlock":"metal","yearDiscovered":1875},
{"atomicNumber":32,"symbol":"Ge","name":"Germanium","atomicMass":"72.64(1)","cpkHexColor":"668F8F","electronicConfiguration":"[Ar] 3d10 4s2 4p2","electronegativity":2.01,"atomicRadius":122,"ionRadius":"73 (+2)","vanDelWaalsRadius":"","ionizationEnergy":762,"electronAffinity":-119,"oxidationStates":"-4, 1, 2, 3, 4","standardState":"solid","bondingType":"metallic","meltingPoint":1211,"boilingPoint":3093,"density":5.323,"groupBlock":"metalloid","yearDiscovered":1886},
{"atomicNumber":33,"symbol":"As","name":"Arsenic","atomicMass":"74.92160(2)","cpkHexColor":"BD80E3","electronicConfiguration":"[Ar] 3d10 4s2 4p3","electronegativity":2.18,"atomicRadius":119,"ionRadius":"58 (+3)","vanDelWaalsRadius":185,"ionizationEnergy":947,"electronAffinity":-78,"oxidationStates":"-3, 2, 3, 5","standardState":"solid","bondingType":"metallic","meltingPoint":1090,"boilingPoint":887,"density":5.727,"groupBlock":"metalloid","yearDiscovered":"Ancient"},
{"atomicNumber":34,"symbol":"Se","name":"Selenium","atomicMass":"78.96(3)","cpkHexColor":"FFA100","electronicConfiguration":"[Ar] 3d10 4s2 4p4","electronegativity":2.55,"atomicRadius":116,"ionRadius":"198 (-2)","vanDelWaalsRadius":190,"ionizationEnergy":941,"electronAffinity":-195,"oxidationStates":"-2, 2, 4, 6","standardState":"solid","bondingType":"metallic","meltingPoint":494,"boilingPoint":958,"density":4.819,"groupBlock":"nonmetal","yearDiscovered":1817},
{"atomicNumber":35,"symbol":"Br","name":"Bromine","atomicMass":"79.904(1)","cpkHexColor":"A62929","electronicConfiguration":"[Ar] 3d10 4s2 4p5","electronegativity":2.96,"atomicRadius":114,"ionRadius":"196 (-1)","vanDelWaalsRadius":185,"ionizationEnergy":1140,"electronAffinity":-325,"oxidationStates":"-1, 1, 3, 4, 5, 7","standardState":"liquid","bondingType":"covalent network","meltingPoint":266,"boilingPoint":332,"density":3.12,"groupBlock":"halogen","yearDiscovered":1826},
{"atomicNumber":36,"symbol":"Kr","name":"Krypton","atomicMass":"83.798(2)","cpkHexColor":"5CB8D1","electronicConfiguration":"[Ar] 3d10 4s2 4p6","electronegativity":"","atomicRadius":110,"ionRadius":"","vanDelWaalsRadius":202,"ionizationEnergy":1351,"electronAffinity":0,"oxidationStates":2,"standardState":"gas","bondingType":"atomic","meltingPoint":116,"boilingPoint":120,"density":0.00375,"groupBlock":"noble gas","yearDiscovered":1898},
{"atomicNumber":37,"symbol":"Rb","name":"Rubidium","atomicMass":"85.4678(3)","cpkHexColor":"702EB0","electronicConfiguration":"[Kr] 5s1","electronegativity":0.82,"atomicRadius":211,"ionRadius":"152 (+1)","vanDelWaalsRadius":"","ionizationEnergy":403,"electronAffinity":-47,"oxidationStates":1,"standardState":"solid","bondingType":"metallic","meltingPoint":312,"boilingPoint":961,"density":1.532,"groupBlock":"alkali metal","yearDiscovered":1861},
{"atomicNumber":38,"symbol":"Sr","name":"Strontium","atomicMass":"87.62(1)","cpkHexColor":"00FF00","electronicConfiguration":"[Kr] 5s2","electronegativity":0.95,"atomicRadius":192,"ionRadius":"118 (+2)","vanDelWaalsRadius":"","ionizationEnergy":550,"electronAffinity":-5,"oxidationStates":2,"standardState":"solid","bondingType":"metallic","meltingPoint":1050,"boilingPoint":1655,"density":2.63,"groupBlock":"alkaline earth metal","yearDiscovered":1790},
{"atomicNumber":39,"symbol":"Y","name":"Yttrium","atomicMass":"88.90585(2)","cpkHexColor":"94FFFF","electronicConfiguration":"[Kr] 4d1 5s2","electronegativity":1.22,"atomicRadius":162,"ionRadius":"90 (+3)","vanDelWaalsRadius":"","ionizationEnergy":600,"electronAffinity":-30,"oxidationStates":"1, 2, 3","standardState":"solid","bondingType":"metallic","meltingPoint":1799,"boilingPoint":3618,"density":4.472,"groupBlock":"transition metal","yearDiscovered":1794},
{"atomicNumber":40,"symbol":"Zr","name":"Zirconium","atomicMass":"91.224(2)","cpkHexColor":"94E0E0","electronicConfiguration":"[Kr] 4d2 5s2","electronegativity":1.33,"atomicRadius":148,"ionRadius":"72 (+4)","vanDelWaalsRadius":"","ionizationEnergy":640,"electronAffinity":-41,"oxidationStates":"1, 2, 3, 4","standardState":"solid","bondingType":"metallic","meltingPoint":2128,"boilingPoint":4682,"density":6.511,"groupBlock":"transition metal","yearDiscovered":1789},
{"atomicNumber":41,"symbol":"Nb","name":"Niobium","atomicMass":"92.90638(2)","cpkHexColor":"73C2C9","electronicConfiguration":"[Kr] 4d4 5s1","electronegativity":1.6,"atomicRadius":137,"ionRadius":"72 (+3)","vanDelWaalsRadius":"","ionizationEnergy":652,"electronAffinity":-86,"oxidationStates":"-1, 2, 3, 4, 5","standardState":"solid","bondingType":"metallic","meltingPoint":2750,"boilingPoint":5017,"density":8.57,"groupBlock":"transition metal","yearDiscovered":1801},
{"atomicNumber":42,"symbol":"Mo","name":"Molybdenum","atomicMass":"95.96(2)","cpkHexColor":"54B5B5","electronicConfiguration":"[Kr] 4d5 5s1","electronegativity":2.16,"atomicRadius":145,"ionRadius":"69 (+3)","vanDelWaalsRadius":"","ionizationEnergy":684,"electronAffinity":-72,"oxidationStates":"-2, -1, 1, 2, 3, 4, 5, 6","standardState":"solid","bondingType":"metallic","meltingPoint":2896,"boilingPoint":4912,"density":10.28,"groupBlock":"transition metal","yearDiscovered":1778},
{"atomicNumber":43,"symbol":"Tc","name":"Technetium","atomicMass":[98],"cpkHexColor":"3B9E9E","electronicConfiguration":"[Kr] 4d5 5s2","electronegativity":1.9,"atomicRadius":156,"ionRadius":"64.5 (+4)","vanDelWaalsRadius":"","ionizationEnergy":702,"electronAffinity":-53,"oxidationStates":"-3, -1, 1, 2, 3, 4, 5, 6, 7","standardState":"solid","bondingType":"metallic","meltingPoint":2430,"boilingPoint":4538,"density":11.5,"groupBlock":"transition metal","yearDiscovered":1937},
{"atomicNumber":44,"symbol":"Ru","name":"Ruthenium","atomicMass":"101.07(2)","cpkHexColor":"248F8F","electronicConfiguration":"[Kr] 4d7 5s1","electronegativity":2.2,"atomicRadius":126,"ionRadius":"68 (+3)","vanDelWaalsRadius":"","ionizationEnergy":710,"electronAffinity":-101,"oxidationStates":"-2, 1, 2, 3, 4, 5, 6, 7, 8","standardState":"solid","bondingType":"metallic","meltingPoint":2607,"boilingPoint":4423,"density":12.37,"groupBlock":"transition metal","yearDiscovered":1827},
{"atomicNumber":45,"symbol":"Rh","name":"Rhodium","atomicMass":"102.90550(2)","cpkHexColor":"0A7D8C","electronicConfiguration":"[Kr] 4d8 5s1","electronegativity":2.28,"atomicRadius":135,"ionRadius":"66.5 (+3)","vanDelWaalsRadius":"","ionizationEnergy":720,"electronAffinity":-110,"oxidationStates":"-1, 1, 2, 3, 4, 5, 6","standardState":"solid","bondingType":"metallic","meltingPoint":2237,"boilingPoint":3968,"density":12.45,"groupBlock":"transition metal","yearDiscovered":1803},
{"atomicNumber":46,"symbol":"Pd","name":"Palladium","atomicMass":"106.42(1)","cpkHexColor":6985,"electronicConfiguration":"[Kr] 4d10","electronegativity":2.2,"atomicRadius":131,"ionRadius":"59 (+1)","vanDelWaalsRadius":163,"ionizationEnergy":804,"electronAffinity":-54,"oxidationStates":"2, 4","standardState":"solid","bondingType":"metallic","meltingPoint":1828,"boilingPoint":3236,"density":12.023,"groupBlock":"transition metal","yearDiscovered":1803},
{"atomicNumber":47,"symbol":"Ag","name":"Silver","atomicMass":"107.8682(2)","cpkHexColor":"C0C0C0","electronicConfiguration":"[Kr] 4d10 5s1","electronegativity":1.93,"atomicRadius":153,"ionRadius":"115 (+1)","vanDelWaalsRadius":172,"ionizationEnergy":731,"electronAffinity":-126,"oxidationStates":"1, 2, 3","standardState":"solid","bondingType":"metallic","meltingPoint":1235,"boilingPoint":2435,"density":10.49,"groupBlock":"transition metal","yearDiscovered":"Ancient"},
{"atomicNumber":48,"symbol":"Cd","name":"Cadmium","atomicMass":"112.411(8)","cpkHexColor":"FFD98F","electronicConfiguration":"[Kr] 4d10 5s2","electronegativity":1.69,"atomicRadius":148,"ionRadius":"95 (+2)","vanDelWaalsRadius":158,"ionizationEnergy":868,"electronAffinity":0,"oxidationStates":2,"standardState":"solid","bondingType":"metallic","meltingPoint":594,"boilingPoint":1040,"density":8.65,"groupBlock":"transition metal","yearDiscovered":1817},
{"atomicNumber":49,"symbol":"In","name":"Indium","atomicMass":"114.818(3)","cpkHexColor":"A67573","electronicConfiguration":"[Kr] 4d10 5s2 5p1","electronegativity":1.78,"atomicRadius":144,"ionRadius":"80 (+3)","vanDelWaalsRadius":193,"ionizationEnergy":558,"electronAffinity":-29,"oxidationStates":"1, 2, 3","standardState":"solid","bondingType":"metallic","meltingPoint":430,"boilingPoint":2345,"density":7.31,"groupBlock":"metal","yearDiscovered":1863},
{"atomicNumber":50,"symbol":"Sn","name":"Tin","atomicMass":"118.710(7)","cpkHexColor":668080,"electronicConfiguration":"[Kr] 4d10 5s2 5p2","electronegativity":1.96,"atomicRadius":141,"ionRadius":"112 (+2)","vanDelWaalsRadius":217,"ionizationEnergy":709,"electronAffinity":-107,"oxidationStates":"-4, 2, 4","standardState":"solid","bondingType":"metallic","meltingPoint":505,"boilingPoint":2875,"density":7.31,"groupBlock":"metal","yearDiscovered":"Ancient"},
{"atomicNumber":51,"symbol":"Sb","name":"Antimony","atomicMass":"121.760(1)","cpkHexColor":"9E63B5","electronicConfiguration":"[Kr] 4d10 5s2 5p3","electronegativity":2.05,"atomicRadius":138,"ionRadius":"76 (+3)","vanDelWaalsRadius":"","ionizationEnergy":834,"electronAffinity":-103,"oxidationStates":"-3, 3, 5","standardState":"solid","bondingType":"metallic","meltingPoint":904,"boilingPoint":1860,"density":6.697,"groupBlock":"metalloid","yearDiscovered":"Ancient"},
{"atomicNumber":52,"symbol":"Te","name":"Tellurium","atomicMass":"127.60(3)","cpkHexColor":"D47A00","electronicConfiguration":"[Kr] 4d10 5s2 5p4","electronegativity":2.1,"atomicRadius":135,"ionRadius":"221 (-2)","vanDelWaalsRadius":206,"ionizationEnergy":869,"electronAffinity":-190,"oxidationStates":"-2, 2, 4, 5, 6","standardState":"solid","bondingType":"metallic","meltingPoint":723,"boilingPoint":1261,"density":6.24,"groupBlock":"metalloid","yearDiscovered":1782},
{"atomicNumber":53,"symbol":"I","name":"Iodine","atomicMass":"126.90447(3)","cpkHexColor":940094,"electronicConfiguration":"[Kr] 4d10 5s2 5p5","electronegativity":2.66,"atomicRadius":133,"ionRadius":"220 (-1)","vanDelWaalsRadius":198,"ionizationEnergy":1008,"electronAffinity":-295,"oxidationStates":"-1, 1, 3, 5, 7","standardState":"solid","bondingType":"covalent network","meltingPoint":387,"boilingPoint":457,"density":4.94,"groupBlock":"halogen","yearDiscovered":1811},
{"atomicNumber":54,"symbol":"Xe","name":"Xenon","atomicMass":"131.293(6)","cpkHexColor":"429EB0","electronicConfiguration":"[Kr] 4d10 5s2 5p6","electronegativity":"","atomicRadius":130,"ionRadius":"48 (+8)","vanDelWaalsRadius":216,"ionizationEnergy":1170,"electronAffinity":0,"oxidationStates":"2, 4, 6, 8","standardState":"gas","bondingType":"atomic","meltingPoint":161,"boilingPoint":165,"density":0.0059,"groupBlock":"noble gas","yearDiscovered":1898},
{"atomicNumber":55,"symbol":"Cs","name":"Cesium","atomicMass":"132.9054519(2)","cpkHexColor":"57178F","electronicConfiguration":"[Xe] 6s1","electronegativity":0.79,"atomicRadius":225,"ionRadius":"167 (+1)","vanDelWaalsRadius":"","ionizationEnergy":376,"electronAffinity":-46,"oxidationStates":1,"standardState":"solid","bondingType":"metallic","meltingPoint":302,"boilingPoint":944,"density":1.879,"groupBlock":"alkali metal","yearDiscovered":1860},
{"atomicNumber":56,"symbol":"Ba","name":"Barium","atomicMass":"137.327(7)","cpkHexColor":"00C900","electronicConfiguration":"[Xe] 6s2","electronegativity":0.89,"atomicRadius":198,"ionRadius":"135 (+2)","vanDelWaalsRadius":"","ionizationEnergy":503,"electronAffinity":-14,"oxidationStates":2,"standardState":"solid","bondingType":"metallic","meltingPoint":1000,"boilingPoint":2143,"density":3.51,"groupBlock":"alkaline earth metal","yearDiscovered":1808},
{"atomicNumber":57,"symbol":"La","name":"Lanthanum","atomicMass":"138.90547(7)","cpkHexColor":"70D4FF","electronicConfiguration":"[Xe] 5d1 6s2","electronegativity":1.1,"atomicRadius":169,"ionRadius":"103.2 (+3)","vanDelWaalsRadius":"","ionizationEnergy":538,"electronAffinity":-48,"oxidationStates":"2, 3","standardState":"solid","bondingType":"metallic","meltingPoint":1193,"boilingPoint":3737,"density":6.146,"groupBlock":"lanthanoid","yearDiscovered":1839},
{"atomicNumber":58,"symbol":"Ce","name":"Cerium","atomicMass":"140.116(1)","cpkHexColor":"FFFFC7","electronicConfiguration":"[Xe] 4f1 5d1 6s2","electronegativity":1.12,"atomicRadius":"","ionRadius":"102 (+3)","vanDelWaalsRadius":"","ionizationEnergy":534,"electronAffinity":-50,"oxidationStates":"2, 3, 4","standardState":"solid","bondingType":"metallic","meltingPoint":1071,"boilingPoint":3633,"density":6.689,"groupBlock":"lanthanoid","yearDiscovered":1803},
{"atomicNumber":59,"symbol":"Pr","name":"Praseodymium","atomicMass":"140.90765(2)","cpkHexColor":"D9FFC7","electronicConfiguration":"[Xe] 4f3 6s2","electronegativity":1.13,"atomicRadius":"","ionRadius":"99 (+3)","vanDelWaalsRadius":"","ionizationEnergy":527,"electronAffinity":-50,"oxidationStates":"2, 3, 4","standardState":"solid","bondingType":"metallic","meltingPoint":1204,"boilingPoint":3563,"density":6.64,"groupBlock":"lanthanoid","yearDiscovered":1885},
{"atomicNumber":60,"symbol":"Nd","name":"Neodymium","atomicMass":"144.242(3)","cpkHexColor":"C7FFC7","electronicConfiguration":"[Xe] 4f4 6s2","electronegativity":1.14,"atomicRadius":"","ionRadius":"129 (+2)","vanDelWaalsRadius":"","ionizationEnergy":533,"electronAffinity":-50,"oxidationStates":"2, 3","standardState":"solid","bondingType":"metallic","meltingPoint":1294,"boilingPoint":3373,"density":7.01,"groupBlock":"lanthanoid","yearDiscovered":1885},
{"atomicNumber":61,"symbol":"Pm","name":"Promethium","atomicMass":[145],"cpkHexColor":"A3FFC7","electronicConfiguration":"[Xe] 4f5 6s2","electronegativity":1.13,"atomicRadius":"","ionRadius":"97 (+3)","vanDelWaalsRadius":"","ionizationEnergy":540,"electronAffinity":-50,"oxidationStates":3,"standardState":"solid","bondingType":"metallic","meltingPoint":1373,"boilingPoint":3273,"density":7.264,"groupBlock":"lanthanoid","yearDiscovered":1947},
{"atomicNumber":62,"symbol":"Sm","name":"Samarium","atomicMass":"150.36(2)","cpkHexColor":"8FFFC7","electronicConfiguration":"[Xe] 4f6 6s2","electronegativity":1.17,"atomicRadius":"","ionRadius":"122 (+2)","vanDelWaalsRadius":"","ionizationEnergy":545,"electronAffinity":-50,"oxidationStates":"2, 3","standardState":"solid","bondingType":"metallic","meltingPoint":1345,"boilingPoint":2076,"density":7.353,"groupBlock":"lanthanoid","yearDiscovered":1853},
{"atomicNumber":63,"symbol":"Eu","name":"Europium","atomicMass":"151.964(1)","cpkHexColor":"61FFC7","electronicConfiguration":"[Xe] 4f7 6s2","electronegativity":1.2,"atomicRadius":"","ionRadius":"117 (+2)","vanDelWaalsRadius":"","ionizationEnergy":547,"electronAffinity":-50,"oxidationStates":"2, 3","standardState":"solid","bondingType":"metallic","meltingPoint":1095,"boilingPoint":1800,"density":5.244,"groupBlock":"lanthanoid","yearDiscovered":1901},
{"atomicNumber":64,"symbol":"Gd","name":"Gadolinium","atomicMass":"157.25(3)","cpkHexColor":"45FFC7","electronicConfiguration":"[Xe] 4f7 5d1 6s2","electronegativity":1.2,"atomicRadius":"","ionRadius":"93.8 (+3)","vanDelWaalsRadius":"","ionizationEnergy":593,"electronAffinity":-50,"oxidationStates":"1, 2, 3","standardState":"solid","bondingType":"metallic","meltingPoint":1586,"boilingPoint":3523,"density":7.901,"groupBlock":"lanthanoid","yearDiscovered":1880},
{"atomicNumber":65,"symbol":"Tb","name":"Terbium","atomicMass":"158.92535(2)","cpkHexColor":"30FFC7","electronicConfiguration":"[Xe] 4f9 6s2","electronegativity":1.2,"atomicRadius":"","ionRadius":"92.3 (+3)","vanDelWaalsRadius":"","ionizationEnergy":566,"electronAffinity":-50,"oxidationStates":"1, 3, 4","standardState":"solid","bondingType":"metallic","meltingPoint":1629,"boilingPoint":3503,"density":8.219,"groupBlock":"lanthanoid","yearDiscovered":1843},
{"atomicNumber":66,"symbol":"Dy","name":"Dysprosium","atomicMass":"162.500(1)","cpkHexColor":"1FFFC7","electronicConfiguration":"[Xe] 4f10 6s2","electronegativity":1.22,"atomicRadius":"","ionRadius":"107 (+2)","vanDelWaalsRadius":"","ionizationEnergy":573,"electronAffinity":-50,"oxidationStates":"2, 3","standardState":"solid","bondingType":"metallic","meltingPoint":1685,"boilingPoint":2840,"density":8.551,"groupBlock":"lanthanoid","yearDiscovered":1886},
{"atomicNumber":67,"symbol":"Ho","name":"Holmium","atomicMass":"164.93032(2)","cpkHexColor":"00FF9C","electronicConfiguration":"[Xe] 4f11 6s2","electronegativity":1.23,"atomicRadius":"","ionRadius":"90.1 (+3)","vanDelWaalsRadius":"","ionizationEnergy":581,"electronAffinity":-50,"oxidationStates":3,"standardState":"solid","bondingType":"metallic","meltingPoint":1747,"boilingPoint":2973,"density":8.795,"groupBlock":"lanthanoid","yearDiscovered":1878},
{"atomicNumber":68,"symbol":"Er","name":"Erbium","atomicMass":"167.259(3)","cpkHexColor":0,"electronicConfiguration":"[Xe] 4f12 6s2","electronegativity":1.24,"atomicRadius":"","ionRadius":"89 (+3)","vanDelWaalsRadius":"","ionizationEnergy":589,"electronAffinity":-50,"oxidationStates":3,"standardState":"solid","bondingType":"metallic","meltingPoint":1770,"boilingPoint":3141,"density":9.066,"groupBlock":"lanthanoid","yearDiscovered":1842},
{"atomicNumber":69,"symbol":"Tm","name":"Thulium","atomicMass":"168.93421(2)","cpkHexColor":"00D452","electronicConfiguration":"[Xe] 4f13 6s2","electronegativity":1.25,"atomicRadius":"","ionRadius":"103 (+2)","vanDelWaalsRadius":"","ionizationEnergy":597,"electronAffinity":-50,"oxidationStates":"2, 3","standardState":"solid","bondingType":"metallic","meltingPoint":1818,"boilingPoint":2223,"density":9.321,"groupBlock":"lanthanoid","yearDiscovered":1879},
{"atomicNumber":70,"symbol":"Yb","name":"Ytterbium","atomicMass":"173.054(5)","cpkHexColor":"00BF38","electronicConfiguration":"[Xe] 4f14 6s2","electronegativity":1.1,"atomicRadius":"","ionRadius":"102 (+2)","vanDelWaalsRadius":"","ionizationEnergy":603,"electronAffinity":-50,"oxidationStates":"2, 3","standardState":"solid","bondingType":"metallic","meltingPoint":1092,"boilingPoint":1469,"density":6.57,"groupBlock":"lanthanoid","yearDiscovered":1878},
{"atomicNumber":71,"symbol":"Lu","name":"Lutetium","atomicMass":"174.9668(1)","cpkHexColor":"00AB24","electronicConfiguration":"[Xe] 4f14 5d1 6s2","electronegativity":1.27,"atomicRadius":160,"ionRadius":"86.1 (+3)","vanDelWaalsRadius":"","ionizationEnergy":524,"electronAffinity":-50,"oxidationStates":3,"standardState":"solid","bondingType":"metallic","meltingPoint":1936,"boilingPoint":3675,"density":9.841,"groupBlock":"lanthanoid","yearDiscovered":1907},
{"atomicNumber":72,"symbol":"Hf","name":"Hafnium","atomicMass":"178.49(2)","cpkHexColor":"4DC2FF","electronicConfiguration":"[Xe] 4f14 5d2 6s2","electronegativity":1.3,"atomicRadius":150,"ionRadius":"71 (+4)","vanDelWaalsRadius":"","ionizationEnergy":659,"electronAffinity":0,"oxidationStates":"2, 3, 4","standardState":"solid","bondingType":"metallic","meltingPoint":2506,"boilingPoint":4876,"density":13.31,"groupBlock":"transition metal","yearDiscovered":1923},
{"atomicNumber":73,"symbol":"Ta","name":"Tantalum","atomicMass":"180.94788(2)","cpkHexColor":"4DA6FF","electronicConfiguration":"[Xe] 4f14 5d3 6s2","electronegativity":1.5,"atomicRadius":138,"ionRadius":"72 (+3)","vanDelWaalsRadius":"","ionizationEnergy":761,"electronAffinity":-31,"oxidationStates":"-1, 2, 3, 4, 5","standardState":"solid","bondingType":"metallic","meltingPoint":3290,"boilingPoint":5731,"density":16.65,"groupBlock":"transition metal","yearDiscovered":1802},
{"atomicNumber":74,"symbol":"W","name":"Tungsten","atomicMass":"183.84(1)","cpkHexColor":"2194D6","electronicConfiguration":"[Xe] 4f14 5d4 6s2","electronegativity":2.36,"atomicRadius":146,"ionRadius":"66 (+4)","vanDelWaalsRadius":"","ionizationEnergy":770,"electronAffinity":-79,"oxidationStates":"-2, -1, 1, 2, 3, 4, 5, 6","standardState":"solid","bondingType":"metallic","meltingPoint":3695,"boilingPoint":5828,"density":19.25,"groupBlock":"transition metal","yearDiscovered":1783},
{"atomicNumber":75,"symbol":"Re","name":"Rhenium","atomicMass":"186.207(1)","cpkHexColor":"267DAB","electronicConfiguration":"[Xe] 4f14 5d5 6s2","electronegativity":1.9,"atomicRadius":159,"ionRadius":"63 (+4)","vanDelWaalsRadius":"","ionizationEnergy":760,"electronAffinity":-15,"oxidationStates":"-3, -1, 1, 2, 3, 4, 5, 6, 7","standardState":"solid","bondingType":"metallic","meltingPoint":3459,"boilingPoint":5869,"density":21.02,"groupBlock":"transition metal","yearDiscovered":1925},
{"atomicNumber":76,"symbol":"Os","name":"Osmium","atomicMass":"190.23(3)","cpkHexColor":266696,"electronicConfiguration":"[Xe] 4f14 5d6 6s2","electronegativity":2.2,"atomicRadius":128,"ionRadius":"63 (+4)","vanDelWaalsRadius":"","ionizationEnergy":840,"electronAffinity":-106,"oxidationStates":"-2, -1, 1, 2, 3, 4, 5, 6, 7, 8","standardState":"solid","bondingType":"metallic","meltingPoint":3306,"boilingPoint":5285,"density":22.61,"groupBlock":"transition metal","yearDiscovered":1803},
{"atomicNumber":77,"symbol":"Ir","name":"Iridium","atomicMass":"192.217(3)","cpkHexColor":175487,"electronicConfiguration":"[Xe] 4f14 5d7 6s2","electronegativity":2.2,"atomicRadius":137,"ionRadius":"68 (+3)","vanDelWaalsRadius":"","ionizationEnergy":880,"electronAffinity":-151,"oxidationStates":"-3, -1, 1, 2, 3, 4, 5, 6","standardState":"solid","bondingType":"metallic","meltingPoint":2739,"boilingPoint":4701,"density":22.65,"groupBlock":"transition metal","yearDiscovered":1803},
{"atomicNumber":78,"symbol":"Pt","name":"Platinum","atomicMass":"195.084(9)","cpkHexColor":"D0D0E0","electronicConfiguration":"[Xe] 4f14 5d9 6s1","electronegativity":2.28,"atomicRadius":128,"ionRadius":"86 (+2)","vanDelWaalsRadius":175,"ionizationEnergy":870,"electronAffinity":-205,"oxidationStates":"2, 4, 5, 6","standardState":"solid","bondingType":"metallic","meltingPoint":2041,"boilingPoint":4098,"density":21.09,"groupBlock":"transition metal","yearDiscovered":"Ancient"},
{"atomicNumber":79,"symbol":"Au","name":"Gold","atomicMass":"196.966569(4)","cpkHexColor":"FFD123","electronicConfiguration":"[Xe] 4f14 5d10 6s1","electronegativity":2.54,"atomicRadius":144,"ionRadius":"137 (+1)","vanDelWaalsRadius":166,"ionizationEnergy":890,"electronAffinity":-223,"oxidationStates":"-1, 1, 2, 3, 5","standardState":"solid","bondingType":"metallic","meltingPoint":1337,"boilingPoint":3129,"density":19.3,"groupBlock":"transition metal","yearDiscovered":"Ancient"},
{"atomicNumber":80,"symbol":"Hg","name":"Mercury","atomicMass":"200.59(2)","cpkHexColor":"B8B8D0","electronicConfiguration":"[Xe] 4f14 5d10 6s2","electronegativity":2,"atomicRadius":149,"ionRadius":"119 (+1)","vanDelWaalsRadius":155,"ionizationEnergy":1007,"electronAffinity":0,"oxidationStates":"1, 2, 4","standardState":"liquid","bondingType":"metallic","meltingPoint":234,"boilingPoint":630,"density":13.534,"groupBlock":"transition metal","yearDiscovered":"Ancient"},
{"atomicNumber":81,"symbol":"Tl","name":"Thallium","atomicMass":"204.3833(2)","cpkHexColor":"A6544D","electronicConfiguration":"[Xe] 4f14 5d10 6s2 6p1","electronegativity":2.04,"atomicRadius":148,"ionRadius":"150 (+1)","vanDelWaalsRadius":196,"ionizationEnergy":589,"electronAffinity":-19,"oxidationStates":"1, 3","standardState":"solid","bondingType":"metallic","meltingPoint":577,"boilingPoint":1746,"density":11.85,"groupBlock":"metal","yearDiscovered":1861},
{"atomicNumber":82,"symbol":"Pb","name":"Lead","atomicMass":"207.2(1)","cpkHexColor":575961,"electronicConfiguration":"[Xe] 4f14 5d10 6s2 6p2","electronegativity":2.33,"atomicRadius":147,"ionRadius":"119 (+2)","vanDelWaalsRadius":202,"ionizationEnergy":716,"electronAffinity":-35,"oxidationStates":"-4, 2, 4","standardState":"solid","bondingType":"metallic","meltingPoint":601,"boilingPoint":2022,"density":11.34,"groupBlock":"metal","yearDiscovered":"Ancient"},
{"atomicNumber":83,"symbol":"Bi","name":"Bismuth","atomicMass":"208.98040(1)","cpkHexColor":"9E4FB5","electronicConfiguration":"[Xe] 4f14 5d10 6s2 6p3","electronegativity":2.02,"atomicRadius":146,"ionRadius":"103 (+3)","vanDelWaalsRadius":"","ionizationEnergy":703,"electronAffinity":-91,"oxidationStates":"-3, 3, 5","standardState":"solid","bondingType":"metallic","meltingPoint":544,"boilingPoint":1837,"density":9.78,"groupBlock":"metal","yearDiscovered":"Ancient"},
{"atomicNumber":84,"symbol":"Po","name":"Polonium","atomicMass":[209],"cpkHexColor":"AB5C00","electronicConfiguration":"[Xe] 4f14 5d10 6s2 6p4","electronegativity":2,"atomicRadius":"","ionRadius":"94 (+4)","vanDelWaalsRadius":"","ionizationEnergy":812,"electronAffinity":-183,"oxidationStates":"-2, 2, 4, 6","standardState":"solid","bondingType":"metallic","meltingPoint":527,"boilingPoint":1235,"density":9.196,"groupBlock":"metalloid","yearDiscovered":1898},
{"atomicNumber":85,"symbol":"At","name":"Astatine","atomicMass":[210],"cpkHexColor":"754F45","electronicConfiguration":"[Xe] 4f14 5d10 6s2 6p5","electronegativity":2.2,"atomicRadius":"","ionRadius":"62 (+7)","vanDelWaalsRadius":"","ionizationEnergy":920,"electronAffinity":-270,"oxidationStates":"-1, 1, 3, 5","standardState":"solid","bondingType":"covalent network","meltingPoint":575,"boilingPoint":"","density":"","groupBlock":"halogen","yearDiscovered":1940},
{"atomicNumber":86,"symbol":"Rn","name":"Radon","atomicMass":[222],"cpkHexColor":428296,"electronicConfiguration":"[Xe] 4f14 5d10 6s2 6p6","electronegativity":"","atomicRadius":145,"ionRadius":"","vanDelWaalsRadius":"","ionizationEnergy":1037,"electronAffinity":"","oxidationStates":2,"standardState":"gas","bondingType":"atomic","meltingPoint":202,"boilingPoint":211,"density":0.00973,"groupBlock":"noble gas","yearDiscovered":1900},
{"atomicNumber":87,"symbol":"Fr","name":"Francium","atomicMass":[223],"cpkHexColor":420066,"electronicConfiguration":"[Rn] 7s1","electronegativity":0.7,"atomicRadius":"","ionRadius":"180 (+1)","vanDelWaalsRadius":"","ionizationEnergy":380,"electronAffinity":"","oxidationStates":1,"standardState":"solid","bondingType":"metallic","meltingPoint":"","boilingPoint":"","density":"","groupBlock":"alkali metal","yearDiscovered":1939},
{"atomicNumber":88,"symbol":"Ra","name":"Radium","atomicMass":[226],"cpkHexColor":"007D00","electronicConfiguration":"[Rn] 7s2","electronegativity":0.9,"atomicRadius":"","ionRadius":"148 (+2)","vanDelWaalsRadius":"","ionizationEnergy":509,"electronAffinity":"","oxidationStates":2,"standardState":"solid","bondingType":"metallic","meltingPoint":973,"boilingPoint":2010,"density":5,"groupBlock":"alkaline earth metal","yearDiscovered":1898},
{"atomicNumber":89,"symbol":"Ac","name":"Actinium","atomicMass":[227],"cpkHexColor":"70ABFA","electronicConfiguration":"[Rn] 6d1 7s2","electronegativity":1.1,"atomicRadius":"","ionRadius":"112 (+3)","vanDelWaalsRadius":"","ionizationEnergy":499,"electronAffinity":"","oxidationStates":3,"standardState":"solid","bondingType":"metallic","meltingPoint":1323,"boilingPoint":3473,"density":10.07,"groupBlock":"actinoid","yearDiscovered":1899},
{"atomicNumber":90,"symbol":"Th","name":"Thorium","atomicMass":"232.03806(2)","cpkHexColor":"00BAFF","electronicConfiguration":"[Rn] 6d2 7s2","electronegativity":1.3,"atomicRadius":"","ionRadius":"94 (+4)","vanDelWaalsRadius":"","ionizationEnergy":587,"electronAffinity":"","oxidationStates":"2, 3, 4","standardState":"solid","bondingType":"metallic","meltingPoint":2023,"boilingPoint":5093,"density":11.724,"groupBlock":"actinoid","yearDiscovered":1828},
{"atomicNumber":91,"symbol":"Pa","name":"Protactinium","atomicMass":"231.03588(2)","cpkHexColor":"00A1FF","electronicConfiguration":"[Rn] 5f2 6d1 7s2","electronegativity":1.5,"atomicRadius":"","ionRadius":"104 (+3)","vanDelWaalsRadius":"","ionizationEnergy":568,"electronAffinity":"","oxidationStates":"3, 4, 5","standardState":"solid","bondingType":"metallic","meltingPoint":1845,"boilingPoint":4273,"density":15.37,"groupBlock":"actinoid","yearDiscovered":1913},
{"atomicNumber":92,"symbol":"U","name":"Uranium","atomicMass":"238.02891(3)","cpkHexColor":"008FFF","electronicConfiguration":"[Rn] 5f3 6d1 7s2","electronegativity":1.38,"atomicRadius":"","ionRadius":"102.5 (+3)","vanDelWaalsRadius":186,"ionizationEnergy":598,"electronAffinity":"","oxidationStates":"3, 4, 5, 6","standardState":"solid","bondingType":"metallic","meltingPoint":1408,"boilingPoint":4200,"density":19.05,"groupBlock":"actinoid","yearDiscovered":1789},
{"atomicNumber":93,"symbol":"Np","name":"Neptunium","atomicMass":[237],"cpkHexColor":"0080FF","electronicConfiguration":"[Rn] 5f4 6d1 7s2","electronegativity":1.36,"atomicRadius":"","ionRadius":"110 (+2)","vanDelWaalsRadius":"","ionizationEnergy":605,"electronAffinity":"","oxidationStates":"3, 4, 5, 6, 7","standardState":"solid","bondingType":"metallic","meltingPoint":917,"boilingPoint":4273,"density":20.45,"groupBlock":"actinoid","yearDiscovered":1940},
{"atomicNumber":94,"symbol":"Pu","name":"Plutonium","atomicMass":[244],"cpkHexColor":"006BFF","electronicConfiguration":"[Rn] 5f6 7s2","electronegativity":1.28,"atomicRadius":"","ionRadius":"100 (+3)","vanDelWaalsRadius":"","ionizationEnergy":585,"electronAffinity":"","oxidationStates":"3, 4, 5, 6, 7","standardState":"solid","bondingType":"metallic","meltingPoint":913,"boilingPoint":3503,"density":19.816,"groupBlock":"actinoid","yearDiscovered":1940},
{"atomicNumber":95,"symbol":"Am","name":"Americium","atomicMass":[243],"cpkHexColor":"545CF2","electronicConfiguration":"[Rn] 5f7 7s2","electronegativity":1.3,"atomicRadius":"","ionRadius":"126 (+2)","vanDelWaalsRadius":"","ionizationEnergy":578,"electronAffinity":"","oxidationStates":"2, 3, 4, 5, 6","standardState":"solid","bondingType":"metallic","meltingPoint":1449,"boilingPoint":2284,"density":"","groupBlock":"actinoid","yearDiscovered":1944},
{"atomicNumber":96,"symbol":"Cm","name":"Curium","atomicMass":[247],"cpkHexColor":"785CE3","electronicConfiguration":"[Rn] 5f7 6d1 7s2","electronegativity":1.3,"atomicRadius":"","ionRadius":"97 (+3)","vanDelWaalsRadius":"","ionizationEnergy":581,"electronAffinity":"","oxidationStates":"3, 4","standardState":"solid","bondingType":"metallic","meltingPoint":1618,"boilingPoint":3383,"density":13.51,"groupBlock":"actinoid","yearDiscovered":1944},
{"atomicNumber":97,"symbol":"Bk","name":"Berkelium","atomicMass":[247],"cpkHexColor":"8A4FE3","electronicConfiguration":"[Rn] 5f9 7s2","electronegativity":1.3,"atomicRadius":"","ionRadius":"96 (+3)","vanDelWaalsRadius":"","ionizationEnergy":601,"electronAffinity":"","oxidationStates":"3, 4","standardState":"solid","bondingType":"metallic","meltingPoint":1323,"boilingPoint":"","density":14.78,"groupBlock":"actinoid","yearDiscovered":1949},
{"atomicNumber":98,"symbol":"Cf","name":"Californium","atomicMass":[251],"cpkHexColor":"A136D4","electronicConfiguration":"[Rn] 5f10 7s2","electronegativity":1.3,"atomicRadius":"","ionRadius":"95 (+3)","vanDelWaalsRadius":"","ionizationEnergy":608,"electronAffinity":"","oxidationStates":"2, 3, 4","standardState":"solid","bondingType":"metallic","meltingPoint":1173,"boilingPoint":"","density":15.1,"groupBlock":"actinoid","yearDiscovered":1950},
{"atomicNumber":99,"symbol":"Es","name":"Einsteinium","atomicMass":[252],"cpkHexColor":"B31FD4","electronicConfiguration":"[Rn] 5f11 7s2","electronegativity":1.3,"atomicRadius":"","ionRadius":"","vanDelWaalsRadius":"","ionizationEnergy":619,"electronAffinity":"","oxidationStates":"2, 3","standardState":"solid","bondingType":"","meltingPoint":1133,"boilingPoint":"","density":"","groupBlock":"actinoid","yearDiscovered":1952},
{"atomicNumber":100,"symbol":"Fm","name":"Fermium","atomicMass":[257],"cpkHexColor":"B31FBA","electronicConfiguration":"[Rn] 5f12 7s2","electronegativity":1.3,"atomicRadius":"","ionRadius":"","vanDelWaalsRadius":"","ionizationEnergy":627,"electronAffinity":"","oxidationStates":"2, 3","standardState":"","bondingType":"","meltingPoint":1800,"boilingPoint":"","density":"","groupBlock":"actinoid","yearDiscovered":1952},
{"atomicNumber":101,"symbol":"Md","name":"Mendelevium","atomicMass":[258],"cpkHexColor":"B30DA6","electronicConfiguration":"[Rn] 5f13 7s2","electronegativity":1.3,"atomicRadius":"","ionRadius":"","vanDelWaalsRadius":"","ionizationEnergy":635,"electronAffinity":"","oxidationStates":"2, 3","standardState":"","bondingType":"","meltingPoint":1100,"boilingPoint":"","density":"","groupBlock":"actinoid","yearDiscovered":1955},
{"atomicNumber":102,"symbol":"No","name":"Nobelium","atomicMass":[259],"cpkHexColor":"BD0D87","electronicConfiguration":"[Rn] 5f14 7s2","electronegativity":1.3,"atomicRadius":"","ionRadius":"","vanDelWaalsRadius":"","ionizationEnergy":642,"electronAffinity":"","oxidationStates":"2, 3","standardState":"","bondingType":"","meltingPoint":1100,"boilingPoint":"","density":"","groupBlock":"actinoid","yearDiscovered":1957},
{"atomicNumber":103,"symbol":"Lr","name":"Lawrencium","atomicMass":[262],"cpkHexColor":"C70066","electronicConfiguration":"[Rn] 5f14 7s2 7p1","electronegativity":1.3,"atomicRadius":"","ionRadius":"","vanDelWaalsRadius":"","ionizationEnergy":"","electronAffinity":"","oxidationStates":3,"standardState":"","bondingType":"","meltingPoint":1900,"boilingPoint":"","density":"","groupBlock":"transition metal","yearDiscovered":1961},
{"atomicNumber":104,"symbol":"Rf","name":"Rutherfordium","atomicMass":[267],"cpkHexColor":"CC0059","electronicConfiguration":"[Rn] 5f14 6d2 7s2","electronegativity":"","atomicRadius":"","ionRadius":"","vanDelWaalsRadius":"","ionizationEnergy":"","electronAffinity":"","oxidationStates":4,"standardState":"","bondingType":"","meltingPoint":"","boilingPoint":"","density":"","groupBlock":"transition metal","yearDiscovered":1969},
{"atomicNumber":105,"symbol":"Db","name":"Dubnium","atomicMass":[268],"cpkHexColor":"D1004F","electronicConfiguration":"[Rn] 5f14 6d3 7s2","electronegativity":"","atomicRadius":"","ionRadius":"","vanDelWaalsRadius":"","ionizationEnergy":"","electronAffinity":"","oxidationStates":"","standardState":"","bondingType":"","meltingPoint":"","boilingPoint":"","density":"","groupBlock":"transition metal","yearDiscovered":1967},
{"atomicNumber":106,"symbol":"Sg","name":"Seaborgium","atomicMass":[271],"cpkHexColor":"D90045","electronicConfiguration":"[Rn] 5f14 6d4 7s2","electronegativity":"","atomicRadius":"","ionRadius":"","vanDelWaalsRadius":"","ionizationEnergy":"","electronAffinity":"","oxidationStates":"","standardState":"","bondingType":"","meltingPoint":"","boilingPoint":"","density":"","groupBlock":"transition metal","yearDiscovered":1974},
{"atomicNumber":107,"symbol":"Bh","name":"Bohrium","atomicMass":[272],"cpkHexColor":"E00038","electronicConfiguration":"[Rn] 5f14 6d5 7s2","electronegativity":"","atomicRadius":"","ionRadius":"","vanDelWaalsRadius":"","ionizationEnergy":"","electronAffinity":"","oxidationStates":"","standardState":"","bondingType":"","meltingPoint":"","boilingPoint":"","density":"","groupBlock":"transition metal","yearDiscovered":1976},
{"atomicNumber":108,"symbol":"Hs","name":"Hassium","atomicMass":[270],"cpkHexColor":"E6002E","electronicConfiguration":"[Rn] 5f14 6d6 7s2","electronegativity":"","atomicRadius":"","ionRadius":"","vanDelWaalsRadius":"","ionizationEnergy":"","electronAffinity":"","oxidationStates":"","standardState":"","bondingType":"","meltingPoint":"","boilingPoint":"","density":"","groupBlock":"transition metal","yearDiscovered":1984},
{"atomicNumber":109,"symbol":"Mt","name":"Meitnerium","atomicMass":[276],"cpkHexColor":"EB0026","electronicConfiguration":"[Rn] 5f14 6d7 7s2","electronegativity":"","atomicRadius":"","ionRadius":"","vanDelWaalsRadius":"","ionizationEnergy":"","electronAffinity":"","oxidationStates":"","standardState":"","bondingType":"","meltingPoint":"","boilingPoint":"","density":"","groupBlock":"transition metal","yearDiscovered":1982},
{"atomicNumber":110,"symbol":"Ds","name":"Darmstadtium","atomicMass":[281],"cpkHexColor":"","electronicConfiguration":"[Rn] 5f14 6d9 7s1","electronegativity":"","atomicRadius":"","ionRadius":"","vanDelWaalsRadius":"","ionizationEnergy":"","electronAffinity":"","oxidationStates":"","standardState":"","bondingType":"","meltingPoint":"","boilingPoint":"","density":"","groupBlock":"transition metal","yearDiscovered":1994},
{"atomicNumber":111,"symbol":"Rg","name":"Roentgenium","atomicMass":[280],"cpkHexColor":"","electronicConfiguration":"[Rn] 5f14 6d10 7s1","electronegativity":"","atomicRadius":"","ionRadius":"","vanDelWaalsRadius":"","ionizationEnergy":"","electronAffinity":"","oxidationStates":"","standardState":"","bondingType":"","meltingPoint":"","boilingPoint":"","density":"","groupBlock":"transition metal","yearDiscovered":1994},
{"atomicNumber":112,"symbol":"Cn","name":"Copernicium","atomicMass":[285],"cpkHexColor":"","electronicConfiguration":"[Rn] 5f14 6d10 7s2","electronegativity":"","atomicRadius":"","ionRadius":"","vanDelWaalsRadius":"","ionizationEnergy":"","electronAffinity":"","oxidationStates":"","standardState":"","bondingType":"","meltingPoint":"","boilingPoint":"","density":"","groupBlock":"transition metal","yearDiscovered":1996},
{"atomicNumber":113,"symbol":"Nh","name":"Nihonium","atomicMass":[284],"cpkHexColor":"","electronicConfiguration":"[Rn] 5f14 6d10 7s2 7p1","electronegativity":"","atomicRadius":"","ionRadius":"","vanDelWaalsRadius":"","ionizationEnergy":"","electronAffinity":"","oxidationStates":"","standardState":"","bondingType":"","meltingPoint":"","boilingPoint":"","density":"","groupBlock":"post-transition metal","yearDiscovered":2003},
{"atomicNumber":114,"symbol":"Fl","name":"Flerovium","atomicMass":[289],"cpkHexColor":"","electronicConfiguration":"[Rn] 5f14 6d10 7s2 7p2","electronegativity":"","atomicRadius":"","ionRadius":"","vanDelWaalsRadius":"","ionizationEnergy":"","electronAffinity":"","oxidationStates":"","standardState":"","bondingType":"","meltingPoint":"","boilingPoint":"","density":"","groupBlock":"post-transition metal","yearDiscovered":1998},
{"atomicNumber":115,"symbol":"Mc","name":"Moscovium","atomicMass":[288],"cpkHexColor":"","electronicConfiguration":"[Rn] 5f14 6d10 7s2 7p3","electronegativity":"","atomicRadius":"","ionRadius":"","vanDelWaalsRadius":"","ionizationEnergy":"","electronAffinity":"","oxidationStates":"","standardState":"","bondingType":"","meltingPoint":"","boilingPoint":"","density":"","groupBlock":"post-transition metal","yearDiscovered":2003},
{"atomicNumber":116,"symbol":"Lv","name":"Livermorium","atomicMass":[293],"cpkHexColor":"","electronicConfiguration":"[Rn] 5f14 6d10 7s2 7p4","electronegativity":"","atomicRadius":"","ionRadius":"","vanDelWaalsRadius":"","ionizationEnergy":"","electronAffinity":"","oxidationStates":"","standardState":"","bondingType":"","meltingPoint":"","boilingPoint":"","density":"","groupBlock":"post-transition metal","yearDiscovered":2000},
{"atomicNumber":117,"symbol":"Ts","name":"Tennessine","atomicMass":[294],"cpkHexColor":"","electronicConfiguration":"[Rn] 5f14 6d10 7s2 7p5","electronegativity":"","atomicRadius":"","ionRadius":"","vanDelWaalsRadius":"","ionizationEnergy":"","electronAffinity":"","oxidationStates":"","standardState":"","bondingType":"","meltingPoint":"","boilingPoint":"","density":"","groupBlock":"post-transition metal","yearDiscovered":2010},
{"atomicNumber":118,"symbol":"Og","name":"Oganesson","atomicMass":[294],"cpkHexColor":"","electronicConfiguration":"[Rn] 5f14 6d10 7s2 7p6","electronegativity":"","atomicRadius":"","ionRadius":"","vanDelWaalsRadius":"","ionizationEnergy":"","electronAffinity":"","oxidationStates":"","standardState":"","bondingType":"","meltingPoint":"","boilingPoint":"","density":"","groupBlock":"noble gas","yearDiscovered":2002}
]
},{}],3:[function(require,module,exports){
(function (__dirname){(function (){

var path = require('path');
var data = require('./data');

module.exports.jsonFile = path.join(__dirname, 'data.json');
module.exports.csvFile = path.join(__dirname, 'data.csv');

module.exports.all = function() {
	return data;
}

module.exports.elements = data.reduce(function(obj, element) {
	obj[element.name] = element;
	return obj;
}, {});

module.exports.symbols = data.reduce(function(obj, element) {
	obj[element.symbol] = element;
	return obj;
}, {});

module.exports.numbers = data.reduce(function(obj, element) {
  obj[element.atomicNumber] = element;
  return obj;
}, {});


}).call(this)}).call(this,"/node_modules/periodic-table")
},{"./data":2,"path":1}],4:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//! Imports
var pt = require('periodic-table');
let { elements, symbols, numbers } = pt;
//! Set up
const SIMULATOR = document.getElementById('simulator');
let objects = [];
//! Classes
class DOMElemento {
    static id = 0;
    hold;
    html;
    element;
    //*for bonds
    level;
    letter;
    electronInlevel;
    max;
    bonded = [];
    //* electrons
    electrons = {
        1: undefined,
        2: undefined,
        4: undefined,
        5: undefined,
        6: undefined,
        7: undefined,
        8: undefined,
    };
    constructor(element) {
        this.element = window.structuredClone(element);
        //* create html
        this.html = document.createElement('div');
        this.html.innerHTML = `${element.name}`;
        //* set attributes
        this.html.setAttribute('id', DOMElemento.id.toString());
        DOMElemento.id++;
        this.html.setAttribute('class', 'element');
        //* Event listeners
        this.html.onpointerdown = () => {
            this.hold = true;
            this.html.style.left = '0%';
            this.html.style.top = '0%;';
        };
        this.html.onmousemove = (e) => {
            e.preventDefault();
            if (this.hold) {
                this.move(e);
                this.collisionCheck();
            }
        };
        this.html.onpointerup = () => {
            this.hold = false;
        };
        this.html.onmouseout = (e) => {
            if (this.hold) {
                this.move(e);
                this.collisionCheck();
            }
        };
        //* append to simulator and array
        this.initialStability();
        SIMULATOR.append(this.html);
        objects.push(this);
        //*add electrons
        this.lewisInit();
    }
    //! Lewis structure
    lewisInit() {
        console.log(this.electronInlevel);
        for (let i = 0; i < this.electronInlevel; i++) {
            //* create html element and atributes    
            let dot = document.createElement('div');
            dot.setAttribute('class', 'electron');
            dot.setAttribute('id', 'e' + (i + 1));
            // dot.innerHTML = 'e-';
            dot.style.fontSize = '12px';
            dot.classList.add();
            //* append to its element and organize them in electrons[]
            this.html.append(dot);
            this.electrons[i] = dot;
        }
    }
    //! class functions
    move(e) {
        //*this peace of code gives the coordenates of the click relative to the SIMULATOR
        let rect = SIMULATOR.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        //*make move
        this.html.style.left = x - 50 + 'px';
        this.html.style.top = y - 50 + 'px';
        //* keep inside box
        if (x <= 62)
            this.html.style.left = '12px';
        if (y <= 62)
            this.html.style.top = '13px';
        if (x >= rect.right - 74)
            this.html.style.left = (rect.right - 126) + 'px';
        if (y >= rect.bottom - 135)
            this.html.style.top = (rect.bottom - 185) + 'px';
    }
    collisionCheck() {
        //*get circle coordenates
        let current = this.html.getBoundingClientRect();
        //*check each element avoiding current
        objects.forEach((other, index) => {
            if (other.html !== this.html) {
                //* check other circle coordenates
                let otherx = other.html.getBoundingClientRect().x;
                let othery = other.html.getBoundingClientRect().y;
                //* distance formula => collision
                let distance = Math.sqrt(Math.pow(otherx - current.x, 2) + Math.pow(othery - current.y, 2));
                // console.log(distance);
                //* crash
                if (distance < 100) {
                    // console.log(`crashed with ${other.element.name}`);
                    this.Bond(other);
                }
            }
        });
    }
    //! CHIMESTRY MATH
    initialStability() {
        let { electronicConfiguration } = this.element;
        //*getters
        this.level = electronicConfiguration[electronicConfiguration.length - 3];
        this.letter = electronicConfiguration[electronicConfiguration.length - 2];
        this.electronInlevel = +electronicConfiguration[electronicConfiguration.length - 1];
        //*fix elenctronInlevels
        if (this.letter === 'p') {
            this.electronInlevel += 2;
        }
        if (this.letter === 'd') {
            this.electronInlevel += 8;
        }
        if (this.letter === 'f') {
            this.electronInlevel += 19;
        }
        // console.log(electronicConfiguration);
        // console.log(`level = ${this.level}`);
        // console.log(`letter = ${this.letter}`);
        // console.log(`electron in level = ${this.electronInlevel}`);
        this.isStable();
    }
    isStable() {
        //* get max num in last ring
        //? Change this for something better?
        if (this.level == 1) {
            this.max = 2;
        }
        if (this.level == 2) {
            if (this.letter == 's') {
                this.max = 2;
            }
            else if (this.letter == 'p') {
                this.max = 8;
            }
        }
        if (this.level == 3) {
            if (this.letter == 's') {
                this.max = 2;
            }
            else if (this.letter == 'p') {
                this.max = 8;
            }
            else if (this.letter == 'd') {
                this.max = 18;
            }
        }
        if (this.level == 4) {
            if (this.letter == 's') {
                this.max = 2;
            }
            else if (this.letter == 'p') {
                this.max = 8;
            }
            else if (this.letter == 'd') {
                this.max = 18;
            }
            else if (this.letter == 'f') {
                this.max = 32;
            }
        }
        if (this.level == 5) {
            if (this.letter == 's') {
                this.max = 2;
            }
            else if (this.letter == 'p') {
                this.max = 8;
            }
            else if (this.letter == 'd') {
                this.max = 18;
            }
            else if (this.letter == 'f') {
                this.max = 32;
            }
        }
        if (this.level == 6) {
            if (this.letter == 's') {
                this.max = 2;
            }
            else if (this.letter == 'p') {
                this.max = 8;
            }
            else if (this.letter == 'd') {
                this.max = 18;
            }
            else if (this.letter == 'f') {
                this.max = 32;
            }
        }
        if (this.level == 7) {
            if (this.letter == 's') {
                this.max = 2;
            }
            else if (this.letter == 'p') {
                this.max = 8;
            }
            else if (this.letter == 'd') {
                this.max = 18;
            }
        }
        //*turn green if stable
        if (this.electronInlevel === 0 ||
            this.electronInlevel === this.max) {
            this.html.style.backgroundColor = 'green';
        }
        //*turn red if inestable
        else {
            this.html.style.backgroundColor = 'red';
        }
        // console.log(`level:${this.level}---max:${this.max}---current:${this.electronInlevel}`);
    }
    Bond(other) {
        //! Ion bond
        //* check electronegativity
        if (Math.abs(this.element.electronegativity - other.element.electronegativity) > 1.7) {
            let moreNegative = (this.element.electronegativity > other.element.electronegativity) ? this : other;
            let lessNegative = (this.element.electronegativity < other.element.electronegativity) ? this : other;
            console.log('Ionic bond!');
            moreNegative.electronInlevel += 1;
            lessNegative.electronInlevel -= 1;
        }
        //! covalent bond
        else if (Math.abs(this.element.electronegativity - other.element.electronegativity) < 1.7) {
            console.log('covalent bond!');
            console.log(other);
            this.bonded.push(other);
        }
        this.isStable();
    }
}
class DOMCompound {
    constructor(...element) {
        elements;
    }
}
//! Testing
// let circle = new DOMElemento(elements.Helium);
// let circle3 = new DOMElemento(numbers[2]);
// let circle4 = new DOMElemento(numbers[3]);
let circle5 = new DOMElemento(symbols.O);
let circle2 = new DOMElemento(symbols.N);
circle2.html.style.left = '200px';

},{"periodic-table":3}]},{},[5]);
