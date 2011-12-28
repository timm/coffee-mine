(function() {
  var Bins, Col, Distribution, Learner, Nb, Normal, Num, R, Rand, Sym, d2, d3, d4, e, errorWrapper, fs, getFileAsLines, ifFileExists, inf, ln, ninf, pi, pow, show, shuffle, sqrt;
  var __slice = Array.prototype.slice, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
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
  Rand = (function() {
    function Rand(seed) {
      this.seed = seed;
      this.multiplier = 1664525;
      this.modulo = 4294967296;
      this.offset = 1013904223;
      if (!((this.seed != null) && (0 <= seed && seed < this.modulo))) {
        this.seed = (new Date().valueOf() * new Date().getMilliseconds()) % this.modulo;
      }
    }
    Rand.prototype.seed = function(seed) {
      return this.seed = seed;
    };
    Rand.prototype.randn = function() {
      return this.seed = (this.multiplier * this.seed + this.offset) % this.modulo;
    };
    Rand.prototype.randf = function() {
      return this.randn() / this.modulo;
    };
    Rand.prototype.rand = function(n) {
      return Math.floor(this.randf() * n);
    };
    Rand.prototype.rand2 = function(min, max) {
      return min + this.rand(max - min);
    };
    return Rand;
  })();
  R = new Rand;
  shuffle = function(l, r) {
    var i, j, n, _ref, _ref2;
    if (r == null) {
      r = R;
    }
    n = l.length;
    for (i = _ref = n - 1; _ref <= 1 ? i <= 1 : i >= 1; _ref <= 1 ? i++ : i--) {
      j = R.rand2(0, i);
      _ref2 = [l[j], l[i]], l[i] = _ref2[0], l[j] = _ref2[1];
    }
    return l;
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
    Bins.prototype.prob = function(x, m, prior) {
      var _ref;
      return (((_ref = this.all[x]) != null ? _ref : 0) + m * prior) / (this.n + m);
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
    Normal.prototype.prob = function(x, m, prior) {
      return this.p(x);
    };
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
      return 1 / (sqrt(2 * pi) * s) * (pow(e, -1 * (pow(x - this.mean(), 2)) / (2 * s * s)));
    };
    return Normal;
  })();
  Col = (function() {
    function Col(s, i) {
      this.name = s;
      this.pos = i;
      this.f = [];
      this.size = 0;
      this.goalp = (s.search(/\!/)) >= 0;
    }
    Col.prototype.at = function(n) {
      var _base;
      return this.f[n] = (_base = this.f)[n] || (_base[n] = this["new"]());
    };
    Col.prototype.add = function(x, n) {
      return this.at(n).add(x);
    };
    Col.prototype["new"] = function() {
      return this.size += 1;
    };
    Col.prototype.prob = function(x, n, m, prior) {
      return this.at(n).prob(x, m, prior);
    };
    return Col;
  })();
  Num = (function() {
    __extends(Num, Col);
    function Num(s, i) {
      this.min = inf;
      this.max = ninf;
      Num.__super__.constructor.call(this, s, i);
    }
    Num.prototype["new"] = function() {
      Num.__super__["new"].apply(this, arguments);
      return new Normal;
    };
    Num.prototype.prep = function(x) {
      return +x;
    };
    Num.prototype.add = function(x, n) {
      if (x < this.min) {
        this.min = x;
      }
      if (x > this.max) {
        this.max = x;
      }
      return Num.__super__.add.call(this, x, n);
    };
    return Num;
  })();
  Sym = (function() {
    __extends(Sym, Col);
    function Sym() {
      Sym.__super__.constructor.apply(this, arguments);
    }
    Sym.prototype["new"] = function() {
      Sym.__super__["new"].apply(this, arguments);
      return new Bins;
    };
    Sym.prototype.prep = function(x) {
      return x;
    };
    return Sym;
  })();
  Learner = (function() {
    function Learner(lines) {
      this.n = -1;
      this.klasses = 0;
      this.latest = null;
      this.head = [];
      this.data = false;
      this.theKlass = null;
    }
    Learner.prototype.symp = function(s) {
      return (s.search('{')) > 11;
    };
    Learner.prototype.datap = function(s) {
      return (s.search(/@data/i)) >= 0;
    };
    Learner.prototype.attrp = function(s) {
      return (s.search(/@attribute/i)) >= 0;
    };
    Learner.prototype.klassp = function(s) {
      return (s.search(/\!/i)) >= 0;
    };
    Learner.prototype.ignorep = function(s) {
      return (s.search(/\?/i)) >= 0;
    };
    Learner.prototype.missingp = function(s) {
      return s === "?";
    };
    Learner.prototype.relationp = function(s) {
      return (s.search(/@relation/i)) >= 0;
    };
    Learner.prototype.readHeader = function(row, line, cells) {
      var c, relation;
      if (this.relationp(line)) {
        relation = cells[1];
      }
      if (this.attrp(line)) {
        this.n += 1;
        c = cells[1];
        if (!this.ignorep(c)) {
          this.latest = this.symp(line) ? new Sym(c, this.n) : new Num(c, this.n);
          this.latest.klassp = this.klassp(c);
          if (this.latest.klassp) {
            this.klasses += 1;
          }
          this.head.push(this.latest);
        }
      }
      if (!this.data && this.datap(cells[0])) {
        this.data = true;
        if (this.klasses === 0) {
          this.latest.klassp = true;
        }
      }
      if (this.latest && this.latest.klassp) {
        this.theKlass = this.latest;
      }
      return this.data;
    };
    Learner.prototype.readData = function(row, cells) {
      var got, h, want, _i, _len, _ref;
      if (cells.length >= this.head.length) {
        _ref = this.head;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          h = _ref[_i];
          cells[h.pos] = h.prep(cells[h.pos]);
        }
        if (this.rows > 3) {
          got = this.test(cells);
          want = cells[this.theKlass.pos];
          if (got === want) {
            this.acc += 1;
          }
        }
        this.rows += 1;
        return this.train(cells, this.about(cells));
      }
    };
    Learner.prototype.main = function(lines) {
      var cells, line, row, _len, _results;
      _results = [];
      for (row = 0, _len = lines.length; row < _len; row++) {
        line = lines[row];
        _results.push((line = line.replace(/(%.*|\'|\")/g, '')) ? this.data === true ? (cells = (line.replace(/\s+/g, '')).split(/,/), this.readData(row, cells)) : (cells = line.split(/\s+/g), this.data = this.readHeader(row, line, cells)) : void 0);
      }
      return _results;
    };
    Learner.prototype.about = function(cells) {
      return cells[this.theKlass.pos];
    };
    return Learner;
  })();
  Nb = (function() {
    __extends(Nb, Learner);
    function Nb(lines) {
      Nb.__super__.constructor.call(this, lines);
      this.rows = 0;
      this.m = 0;
      this.k = 0;
      this.acc = 0;
      this.main(lines);
      show(Math.floor(100 * this.acc / this.rows));
    }
    Nb.prototype.test = function(cells) {
      var best, counts, h, inc, klass, like, nKlasses, prior, value, what, _i, _len, _ref, _ref2;
      what = null;
      best = ninf;
      nKlasses = this.theKlass.size;
      _ref = this.theKlass.f;
      for (klass in _ref) {
        counts = _ref[klass];
        prior = (counts.n + this.k) / (this.rows + this.k * nKlasses);
        like = ln(prior);
        _ref2 = this.head;
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          h = _ref2[_i];
          if (!h.klassp) {
            if (!this.missingp((value = cells[h.pos]))) {
              inc = h.prob(value, klass, this.m, prior);
              like += ln(inc);
            }
          }
        }
        if (like > best) {
          best = like;
          what = klass;
        }
      }
      return what;
    };
    Nb.prototype.train = function(cells, klass) {
      var h, value, _i, _len, _ref, _results;
      _ref = this.head;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        h = _ref[_i];
        _results.push(!this.missingp((value = cells[h.pos])) ? h.add(value, klass) : void 0);
      }
      return _results;
    };
    return Nb;
  })();
  getFileAsLines('../data/diabetes.arff', function(lines) {
    var nb;
    return nb = new Nb(lines);
  });
}).call(this);
