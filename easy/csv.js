(function() {
  var asCells, asNum, d2, d3, d4, e, errorWrapper, fs, getFileAsLines, ifFileExists, inf, ln, ninf, numHeader, nump, pi, pow, readcsv, readdata, readheader, show, sqrt, symHeader;
  var __slice = Array.prototype.slice;
  pow = Math.pow;
  e = Math.E;
  pi = Math.PI;
  sqrt = Math.sqrt;
  ln = Math.log;
  show = console.log;
  inf = 1e+32;
  ninf = -1 * inf;
  d2 = function(n) {
    return Math.floor(n * 100) / 100;
  };
  d3 = function(n) {
    return Math.floor(n * 1000) / 1000;
  };
  d4 = function(n) {
    return Math.floor(n * 10000) / 10000;
  };
  fs = require("fs");
  errorWrapper = function(action) {
    return function() {
      var args, err;
      err = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (err) {
        throw err;
      }
      return action.apply(null, args);
    };
  };
  ifFileExists = function(filename, action) {
    return fs.stat(filename, errorWrapper(function(stat) {
      if (stat.isFile()) {
        return action();
      }
    }));
  };
  getFileAsLines = function(filename, action) {
    return ifFileExists(filename, function() {
      return fs.readFile(filename, "utf8", errorWrapper(function(content) {
        return action(content.split("\n"));
      }));
    });
  };
  nump = function(string) {
    return 0 === (string.charAt(0)).search(/[ABCDEFGHIJKLMNOPQRSTUVWXYZ]/);
  };
  asNum = function(x, h) {
    var y;
    y = +x;
    if (y < h.min) {
      h.min = y;
    }
    if (y > h.max) {
      h.max = y;
    }
    return y;
  };
  numHeader = function(word) {
    return {
      name: word,
      min: inf,
      max: ninf,
      prep: function(x, h) {
        return asNum(x, h);
      }
    };
  };
  symHeader = function(word) {
    return {
      name: word,
      prep: function(x, h) {
        return x;
      }
    };
  };
  asCells = function(string) {
    return (string.replace(/\s/g, '')).split(',');
  };
  readcsv = function(lines) {
    var head, line, n, _len;
    head = [];
    for (n = 0, _len = lines.length; n < _len; n++) {
      line = lines[n];
      if (line) {
        if (n === 0) {
          readheader(head, asCells(line));
        } else {
          readdata(head, asCells(line));
        }
      }
    }
    return show(head);
  };
  readheader = function(head, cells) {
    var cell, n, _len, _results;
    _results = [];
    for (n = 0, _len = cells.length; n < _len; n++) {
      cell = cells[n];
      _results.push(head[n] = nump(cell) ? numHeader(cell) : symHeader(cell));
    }
    return _results;
  };
  readdata = function(head, cells) {
    var cell, n, _len, _results;
    _results = [];
    for (n = 0, _len = cells.length; n < _len; n++) {
      cell = cells[n];
      _results.push(head[n].prep(cell, head[n]));
    }
    return _results;
  };
  getFileAsLines('../data/weather.csv', readcsv);
}).call(this);
