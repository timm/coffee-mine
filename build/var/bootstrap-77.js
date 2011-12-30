(function() {
  var Bins, BootStrap, Distribution, Normal, R, Rand, any, d2, d3, d4, e, inf, ln, main, ninf, normal, pi, pow, show, shuffle, sqrt;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
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
  BootStrap = (function() {
    function BootStrap(y, z, b) {
      var i, _i, _j, _len, _len2;
      if (b == null) {
        b = 1000;
      }
      this.b = b;
      this.m = y.length;
      this.n = z.length;
      this.y = y;
      this.z = z;
      this.x = [];
      for (_i = 0, _len = y.length; _i < _len; _i++) {
        i = y[_i];
        this.x.push(i);
      }
      for (_j = 0, _len2 = z.length; _j < _len2; _j++) {
        i = z[_j];
        this.x.push(i);
      }
      this.xmean = this.mean(this.x);
      this.zmean = this.mean(this.z);
      this.ymean = this.mean(this.y);
    }
    BootStrap.prototype.mean = function(l) {
      var i, sum, _i, _len;
      sum = 0;
      for (_i = 0, _len = l.length; _i < _len; _i++) {
        i = l[_i];
        sum += i;
      }
      return sum / l.length;
    };
    BootStrap.prototype.testStatistic = function(y, z) {
      var i, m, n, s1, s2, tmp1, tmp2, yMean, zMean, _i, _j, _len, _len2;
      m = y.length;
      n = z.length;
      yMean = this.mean(y);
      zMean = this.mean(z);
      tmp1 = tmp2 = 0;
      for (_i = 0, _len = y.length; _i < _len; _i++) {
        i = y[_i];
        tmp1 += pow(i - yMean, 2);
      }
      for (_j = 0, _len2 = z.length; _j < _len2; _j++) {
        i = z[_j];
        tmp2 += pow(i - zMean, 2);
      }
      s1 = tmp1 / (m - 1);
      s2 = tmp2 / (n - 1);
      return Math.abs(zMean - yMean) / sqrt(s1 / m + s2 / n);
    };
    BootStrap.prototype.main = function() {
      var asl, bigger, i, j, tobs, yhat, ystar, zhat, zstar, _ref;
      tobs = this.testStatistic(this.y, this.z);
      yhat = (function() {
        var _i, _len, _ref, _results;
        _ref = this.y;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          i = _ref[_i];
          _results.push(i - this.ymean + this.xmean);
        }
        return _results;
      }).call(this);
      zhat = (function() {
        var _i, _len, _ref, _results;
        _ref = this.z;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          i = _ref[_i];
          _results.push(i - this.zmean + this.xmean);
        }
        return _results;
      }).call(this);
      bigger = 0;
      for (j = 1, _ref = this.b; 1 <= _ref ? j <= _ref : j >= _ref; 1 <= _ref ? j++ : j--) {
        ystar = (function() {
          var _ref2, _results;
          _results = [];
          for (i = 1, _ref2 = this.m; 1 <= _ref2 ? i <= _ref2 : i >= _ref2; 1 <= _ref2 ? i++ : i--) {
            _results.push(any(yhat));
          }
          return _results;
        }).call(this);
        zstar = (function() {
          var _ref2, _results;
          _results = [];
          for (i = 1, _ref2 = this.n; 1 <= _ref2 ? i <= _ref2 : i >= _ref2; 1 <= _ref2 ? i++ : i--) {
            _results.push(any(zhat));
          }
          return _results;
        }).call(this);
        if (this.testStatistic(ystar, zstar) > tobs) {
          bigger += 1;
        }
      }
      asl = bigger / this.b;
      return {
        b: this.b,
        asl: asl,
        opinion: this.opinion(asl)
      };
    };
    BootStrap.prototype.opinion = function(asl) {
      if (asl < 0.01) {
        return "very strong reject";
      }
      if ((0.01 <= asl && asl < 0.025)) {
        return "strong reject";
      }
      if ((0.025 <= asl && asl < 0.05)) {
        return "reasonably strong reject";
      }
      if ((0.05 <= asl && asl < 0.10)) {
        return "borderline reject";
      }
    };
    return BootStrap;
  })();
  main = function() {
    var b, i, m, m1, m2, n, s1, s2, x;
    R = new Rand;
    b = 1000;
    m1 = 11;
    s1 = 2;
    m = 100;
    m2 = 10;
    s2 = 2;
    n = 100;
    x = new BootStrap((function() {
      var _results;
      _results = [];
      for (i = 1; 1 <= m ? i <= m : i >= m; 1 <= m ? i++ : i--) {
        _results.push(normal(m1, s1));
      }
      return _results;
    })(), (function() {
      var _results;
      _results = [];
      for (i = 1; 1 <= n ? i <= n : i >= n; 1 <= n ? i++ : i--) {
        _results.push(normal(m2, s2));
      }
      return _results;
    })(), b);
    return show(x.main());
  };
  main();
}).call(this);
