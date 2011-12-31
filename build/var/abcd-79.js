(function() {
  var ABCD, d2, d3, d4, e, inf, ln, ninf, pi, pow, show, sqrt;
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
  ABCD = (function() {
    function ABCD(klasses) {
      this.a = {};
      this.b = {};
      this.c = {};
      this.d = {};
      this.yes = 0;
      this.no = 0;
      this.all = {};
    }
    ABCD.prototype.add = function(actual, predicted) {
      var ignore, target, _ref, _results;
      this.known(actual);
      this.known(predicted);
      if (actual === predicted) {
        this.yes += 1;
      } else {
        this.no += 1;
      }
      _ref = this.all;
      _results = [];
      for (target in _ref) {
        ignore = _ref[target];
        _results.push(actual === target ? predicted === actual ? this.d[target] += 1 : this.b[target] += 1 : predicted === target ? this.c[target] += 1 : this.a[target] += 1);
      }
      return _results;
    };
    ABCD.prototype.known = function(x) {
      var _base, _base2, _base3, _base4, _base5;
      (_base = this.a)[x] || (_base[x] = 0);
      (_base2 = this.b)[x] || (_base2[x] = 0);
      (_base3 = this.c)[x] || (_base3[x] = 0);
      (_base4 = this.d)[x] || (_base4[x] = 0);
      (_base5 = this.klass)[x] || (_base5[x] = 0);
      if ((this.klass[x] += 1) === 1) {
        return this.a[x] = this.yes + this.no;
      }
    };
    ABCD.prototype.report = function() {
      var k, out, val, _len, _ref;
      out = {};
      _ref = this.all;
      for (val = 0, _len = _ref.length; val < _len; val++) {
        k = _ref[val];
        out[k] = report1(k, this.a[k], this.b[k], this.c[k], this.d[k]);
      }
      return out;
    };
    ABCD.prototype.report1 = function(k, a, b, c, d) {
      var acc;
      return acc = 0;
    };
    return ABCD;
  })();
}).call(this);
