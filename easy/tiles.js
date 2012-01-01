(function() {
  var ABCD, Percentiles, R, Rand, any, d2, d3, d4, demo, e, inf, ln, ninf, normal, nummat, pi, pow, show, shuffle, sqrt;
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
  show(11);
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
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
      s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
      s[1] = s[1] || '';
      s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
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
  Percentiles = (function() {
    function Percentiles(l, prefix, q, w, decimals) {
      this.l = l;
      this.prefix = prefix != null ? prefix : "";
      this.q = q != null ? q : 5;
      this.w = w != null ? w : 5;
      this.decimals = decimals != null ? decimals : 2;
    }
    Percentiles.prototype.lo = function(n) {
      return Math.round(n);
    };
    Percentiles.prototype.as = function(n) {
      return nummat(n, this.decimals);
    };
    Percentiles.prototype.asString = function() {
      return this.worker(this.l.sort(), this.l.length, this.q);
    };
    Percentiles.prototype.worker = function(l, n, q, prefix) {
      var median, meds, q1, q1s, q2, q2s, q3, q3s, q4, q4s;
      q1 = this.as(l[this.lo(0.10 * n)]);
      q1s = this.pad(q1);
      q2 = this.as(l[this.lo(0.30 * n)]);
      q2s = this.pad(q2);
      median = this.as(l[this.lo(0.50 * n)]);
      meds = this.pad(median);
      q3 = this.as(l[this.lo(0.70 * n)]);
      q3s = this.pad(q3);
      q4 = this.as(l[this.lo(0.90 * n)]);
      q4s = this.pad(q4);
      return "" + this.prefix + q1s + ", " + q2s + ", " + meds + ", " + q3s + ", " + q4s;
    };
    Percentiles.prototype.pad = function(n) {
      var i, size, tmp, _ref;
      tmp = "";
      size = ("" + n).length;
      for (i = 1, _ref = this.w - size; 1 <= _ref ? i <= _ref : i >= _ref; 1 <= _ref ? i++ : i--) {
        tmp = " " + tmp;
      }
      return "" + tmp + n;
    };
    return Percentiles;
  })();
  demo = function() {
    var all, n, one, p;
    n = 1000;
    one = function() {
      return pow(normal(0.5, 0.1), 0.8);
    };
    all = function() {
      var i, _results;
      _results = [];
      for (i = 1; 1 <= n ? i <= n : i >= n; 1 <= n ? i++ : i--) {
        _results.push(one());
      }
      return _results;
    };
    p = new Percentiles(all());
    return show(p.asString());
  };
  demo();
}).call(this);
