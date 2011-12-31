(function() {
  var ABCD, abcd, d2, d3, d4, e, i, inf, ln, ninf, pi, pow, show, sqrt;
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
    function ABCD() {
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
        this.known(target);
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
      (_base5 = this.all)[x] || (_base5[x] = 0);
      if ((this.all[x] += 1) === 1) {
        return this.a[x] = this.yes + this.no;
      }
    };
    ABCD.prototype.report1 = function(k, a, b, c, d) {
      var acc, f, g, o, out, pd, pf, pn, prec;
      o = function(n) {
        return (d3(n)) * 100;
      };
      acc = pd = pf = prec = f = g = pn = 0;
      if ((b + d) > 0) {
        pd = d / (b + d);
      }
      if ((a + c) > 0) {
        pf = c / (a + c);
      }
      if ((a + c) > 0) {
        pn = (b + d) / (a + c);
      }
      if ((c + d) > 0) {
        prec = d / (c + d);
      }
      if ((1 - pf + pd) > 0) {
        g = 2 * (1 - pf) * pd / (1 - pf + pd);
      }
      if ((prec + pd) > 0) {
        f = 2 * prec * pd / (prec + pd);
      }
      if ((this.yes + this.no) > 0) {
        acc = this.yes / (this.yes + this.no);
      }
      out = {
        a: a,
        b: b,
        c: c,
        d: d,
        pn: o(pn),
        acc: o(acc)
      };
      out.pd = o(pd);
      out.pf = o(pf);
      out.prec = o(prec);
      out.f = o(f);
      out.g = o(g);
      return out;
    };
    ABCD.prototype.report = function() {
      var k, out, val, _ref;
      out = {};
      _ref = this.all;
      for (k in _ref) {
        val = _ref[k];
        out[k] = this.report1(k, this.a[k], this.b[k], this.c[k], this.d[k]);
      }
      return out;
    };
    return ABCD;
  })();
  abcd = new ABCD;
  for (i = 1; i <= 6; i++) {
    abcd.add("yes", "yes");
  }
  for (i = 1; i <= 2; i++) {
    abcd.add("no", "no");
  }
  for (i = 1; i <= 5; i++) {
    abcd.add("maybe", "maybe");
  }
  abcd.add("maybe", "no");
  show(abcd.report());
}).call(this);
