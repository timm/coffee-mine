(function() {
  var Bins, Col, Distribution, Normal, Num, Sym, col, e, errorWrapper, fs, getFileAsLines, head, id, ifFileExists, inf, last, ninf, pi, pow, show, sqrt, _len, _len2, _ref, _ref2;
  var __slice = Array.prototype.slice, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  pow = Math.pow;
  e = Math.e;
  pi = Math.PI;
  sqrt = Math.sqrt;
  show = console.log;
  inf = 1e+32;
  ninf = -1 * inf;
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
  show = console.log;
  Distribution = (function() {
    function Distribution(l) {
      this.adds(l);
    }
    Distribution.prototype.adds = function(l) {
      var x, _i, _len, _results;
      if (l) {
        _results = [];
        for (_i = 0, _len = l.length; _i < _len; _i++) {
          x = l[_i];
          _results.push(this.add(x));
        }
        return _results;
      }
    };
    return Distribution;
  })();
  Bins = (function() {
    __extends(Bins, Distribution);
    function Bins(l) {
      this.n = 0;
      this.symbols = 0;
      this.symbolTable = {};
      this.all = {};
      Bins.__super__.constructor.call(this, l);
    }
    Bins.prototype.add = function(x) {
      var now, _base;
      this.n = this.n + 1;
      now = this.all[x] = ((_base = this.all)[x] || (_base[x] = 0)) + 1;
      if (now === 1) {
        this.symbols += 1;
        this.symbolTable[x] = this.symbols;
      }
      return x;
    };
    Bins.prototype.p = function(x) {
      var _ref;
      return ((_ref = this.all[x]) != null ? _ref : 0) / this.n;
    };
    return Bins;
  })();
  Normal = (function() {
    __extends(Normal, Distribution);
    function Normal(l) {
      this.p = __bind(this.p, this);      this.max = -1000000000;
      this.min = 1000000000;
      this.n = 0;
      this.sum = 0;
      this.sumSq = 0;
      Normal.__super__.constructor.call(this, l);
    }
    Normal.prototype.add = function(x) {
      this.n = this.n + 1;
      this.sum = this.sum + x;
      this.sumSq = this.sumSq + x * x;
      if (x < this.min) {
        this.min = x;
      }
      if (x > this.max) {
        this.max = x;
      }
      this._mean = this._stdev = null;
      return x;
    };
    Normal.prototype.mean = function() {
      return this._mean || (this._mean = this.sum / this.n);
    };
    Normal.prototype.stdev = function() {
      return this._stdev || (this._stdev = sqrt((this.sumSq - ((this.sum * this.sum) / this.n)) / (this.n - 1)));
    };
    Normal.prototype.p = function(x) {
      var s;
      s = this.stdev();
      return 1 / sqrt(2 * pi * s * s) * (pow(e, -1 * ((x - this.mean()) ^ 2 / (2 * s * s))));
    };
    return Normal;
  })();
  Col = (function() {
    function Col(s, i) {
      this.name = s;
      this.pos = i;
      this.f = [];
      this.goalp = (s.search(/\!/)) >= 0;
    }
    Col.prototype.at = function(n) {
      var _base;
      return (_base = this.f)[n] || (_base[n] = this["new"]());
    };
    Col.prototype.add = function(x, n) {
      return this.at(n).add(this.prep(x));
    };
    return Col;
  })();
  Num = (function() {
    __extends(Num, Col);
    function Num() {
      Num.__super__.constructor.apply(this, arguments);
    }
    Num.prototype["new"] = function() {
      return new Normal;
    };
    Num.prototype.prep = function(x) {
      return +x;
    };
    return Num;
  })();
  Sym = (function() {
    __extends(Sym, Col);
    function Sym() {
      Sym.__super__.constructor.apply(this, arguments);
    }
    Sym.prototype["new"] = function() {
      return new Bins;
    };
    Sym.prototype.prep = function(x) {
      return x;
    };
    return Sym;
  })();
  head = [];
  last = null;
  _ref = 'fname !suburb'.split(/\s+/);
  for (id = 0, _len = _ref.length; id < _len; id++) {
    col = _ref[id];
    head.push((last = new Sym(col, id)));
  }
  _ref2 = 'age mpg'.split(/\s+/);
  for (id = 0, _len2 = _ref2.length; id < _len2; id++) {
    col = _ref2[id];
    head.push((last = new Num(col, id)));
  }
  show(head);
  show(last);
  last.add(20, 1);
  last.add(21, 1);
  last.add(22, 1);
  last.add(23, 1);
  last.add(24, 1);
  show(last.f[1].mean());
  show(last.f[1].stdev());
  show(last);
}).call(this);
