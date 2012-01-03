(function() {
  var Bins, Col, Distribution, Normal, Num, R, Rand, Reader, Row, Sym, any, d2, d3, d4, e, errorWrapper, fs, getFileAsLines, ifFileExists, inf, ln, ninf, normal, nummat, pi, pow, show, shuffle, sqrt;
  var __slice = Array.prototype.slice, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  pow = Math.pow;
  e = Math.E;
  pi = Math.PI;
  sqrt = Math.sqrt;
  ln = Math.log;
  show = console.log;
  inf = 1e+32;
  ninf = -1 * inf;
  d2 = function(n) {
    return Math.round(n * 100) / 100;
  };
  d3 = function(n) {
    return Math.round(n * 1000) / 1000;
  };
  d4 = function(n) {
    return Math.round(n * 10000) / 10000;
  };
  nummat = function(number, decimals, dec, sep) {
    var n, prec, s, toFixedFix;
    if (dec == null) {
      dec = ".";
    }
    if (sep == null) {
      sep = ",";
    }
    number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
    n = isFinite(+number) ? +number : 0;
    prec = isFinite(+decimals) ? Math.abs(decimals) : 0;
    s = '';
    toFixedFix = function(n, prec) {
      var k;
      k = Math.pow(10, prec);
      return '' + Math.round(n * k) / k;
    };
    s = prec ? toFixedFix(n, prec) : '' + Math.round(n);
    s = s.split('.');
    if (s[0].length > 3) {
      s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
      s[1] = s[1] || '';
      s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
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
      j = r.rand2(0, i);
      _ref2 = [l[j], l[i]], l[i] = _ref2[0], l[j] = _ref2[1];
    }
    return l;
  };
  normal = function(m, s, r) {
    var boxMuller;
    if (r == null) {
      r = R;
    }
    boxMuller = function() {
      var w, x1, x2;
      w = 1;
      while (w >= 1) {
        x1 = 2.0 * r.randf() - 1;
        x2 = 2.0 * r.randf() - 1;
        w = x1 * x1 + x2 * x2;
      }
      w = sqrt((-2.0 * ln(w)) / w);
      return x1 * w;
    };
    return m + boxMuller() * s;
  };
  any = function(l, r) {
    if (r == null) {
      r = R;
    }
    return l[r.rand2(0, l.length)];
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
      this.most = -1;
      this.mode = null;
      Bins.__super__.constructor.call(this, l);
    }
    Bins.prototype.add = function(x) {
      var now, _base;
      this.n = this.n + 1;
      now = this.all[x] = ((_base = this.all)[x] || (_base[x] = 0)) + 1;
      if (now > this.most) {
        this.mode = x;
        this.most = now;
      }
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
      this.max = -1000000000;
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
      this.goalp = (s.search(/\!/)) >= 0;
      this.missing = 0;
      this.all = this.counter();
    }
    Col.prototype.at = function(n) {
      var _base;
      return this.f[n] = (_base = this.f)[n] || (_base[n] = this.counter());
    };
    Col.prototype.add = function(x, n) {
      if (this.missingp(x)) {
        return this.missing += 1;
      } else {
        this.all.add(x);
        return this.at(n).add(x);
      }
    };
    Col.prototype.missingp = function(s) {
      return s === "?";
    };
    Col.prototype.prob = function(x, n, m, prior) {
      return this.at(n).prob(x, m, prior);
    };
    return Col;
  })();
  Num = (function() {
    __extends(Num, Col);
    function Num() {
      Num.__super__.constructor.apply(this, arguments);
    }
    Num.prototype.counter = function() {
      return new Normal;
    };
    Num.prototype.prep = function(x) {
      if (this.missingp(x)) {
        return x;
      } else {
        return +x;
      }
    };
    return Num;
  })();
  Sym = (function() {
    __extends(Sym, Col);
    function Sym() {
      Sym.__super__.constructor.apply(this, arguments);
    }
    Sym.prototype.counter = function() {
      return new Bins;
    };
    Sym.prototype.prep = function(x) {
      return x;
    };
    return Sym;
  })();
  Row = (function() {
    function Row(cells, reader) {
      var h, _i, _len, _ref;
      this.cells = cells;
      this.klass = this.isa(reader.goals);
      _ref = reader.head;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        h = _ref[_i];
        h.add(this.cells[h.pos], this.klass);
      }
    }
    Row.prototype.isa = function(goals) {
      return this.klass || (this.klass = this.isa0(goals));
    };
    Row.prototype.isa0 = function(goals) {
      var g;
      return ((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = goals.length; _i < _len; _i++) {
          g = goals[_i];
          _results.push(this.cells[g.pos]);
        }
        return _results;
      }).call(this)).join("-");
    };
    return Row;
  })();
  Reader = (function() {
    function Reader() {
      this.n = -1;
      this.head = [];
      this.data = false;
      this.goals = [];
      this.ins = [];
      this.rows = [];
      this.last = null;
    }
    Reader.prototype.symp = function(s) {
      return (s.search('{')) > 11;
    };
    Reader.prototype.datap = function(s) {
      return (s.search(/@data/i)) >= 0;
    };
    Reader.prototype.attrp = function(s) {
      return (s.search(/@attribute/i)) >= 0;
    };
    Reader.prototype.ignorep = function(s) {
      return (s.search(/\?/i)) >= 0;
    };
    Reader.prototype.relationp = function(s) {
      return (s.search(/@relation/i)) >= 0;
    };
    Reader.prototype.readHeaderString = function(s) {
      return this.readHeader(s, s.split(/\s+/g));
    };
    Reader.prototype.readHeader = function(s, cells) {
      var c, h, relation, what, _i, _len, _ref;
      if (!this.data && this.datap(cells[0])) {
        this.data = true;
        if (this.goals.length === 0) {
          this.last.goalp = true;
        }
        _ref = this.head;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          h = _ref[_i];
          what = h.goalp ? this.goals : this.ins;
          what.push(h);
        }
      } else if (this.relationp(s)) {
        relation = cells[1];
      } else if (this.attrp(s)) {
        this.n += 1;
        c = cells[1];
        if (!this.ignorep(c)) {
          what = this.symp(s) ? Sym : Num;
          this.last = new what(c, this.n);
          this.head.push(this.last);
        }
      } else {
        show("!!!!!????? " + s);
      }
      return this.data;
    };
    Reader.prototype.readDataString = function(s) {
      return this.readData((s.replace(/\s+/g, '')).split(/,/));
    };
    Reader.prototype.readData = function(cells) {
      var h, prepped;
      if (cells.length >= this.head.length) {
        prepped = (function() {
          var _i, _len, _ref, _results;
          _ref = this.head;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            h = _ref[_i];
            _results.push(h.prep(cells[h.pos]));
          }
          return _results;
        }).call(this);
        return this.rows.push(new Row(prepped, this));
      }
    };
    Reader.prototype.readString = function(s) {
      if ((s = s.replace(/(%.*|\'|\")/g, ''))) {
        if (this.data) {
          return this.readDataString(s);
        } else {
          return this.data = this.readHeaderString(s);
        }
      }
    };
    Reader.prototype.main = function(lines) {
      var line, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = lines.length; _i < _len; _i++) {
        line = lines[_i];
        _results.push(this.readString(line));
      }
      return _results;
    };
    return Reader;
  })();
  getFileAsLines('../data/weather.arff', function(lines) {
    var r;
    r = new Reader;
    r.main(lines);
    return show(r.rows);
  });
}).call(this);
