(function() {
  var Percentiles, R, Rand, any, d2, d3, d4, demo, e, inf, ln, ninf, normal, nummat, pi, pow, show, shuffle, sqrt;
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
  Percentiles = (function() {
    function Percentiles(l, prefix, w, decimals, right, width, scale, min, max, left, right, tick) {
      this.l = l;
      this.prefix = prefix != null ? prefix : "";
      this.w = w != null ? w : 3;
      this.decimals = decimals != null ? decimals : 2;
      this.right = right != null ? right : 100;
      this.width = width != null ? width : 100;
      this.scale = scale != null ? scale : 4;
      this.min = min != null ? min : 1;
      this.max = max != null ? max : 100;
      this.left = left != null ? left : "[";
      this.right = right != null ? right : "]";
      this.tick = tick != null ? tick : "-";
    }
    Percentiles.prototype.lo = function(n) {
      return Math.floor(n);
    };
    Percentiles.prototype.as = function(n) {
      return nummat(n, this.decimals);
    };
    Percentiles.prototype.asString = function() {
      return this.worker(this.l.sort(), this.l.length, this.prefix);
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
      return ("" + this.prefix + q1s + ", " + q2s + ", " + meds + ", " + q3s + ", " + q4s + ", ") + this.pretty(q1, q2, median, q3, q4);
    };
    Percentiles.prototype.pretty = function(q1, q2, med, q3, q4) {
      var a, i, _ref;
      this.width /= this.scale;
      q1 /= this.scale;
      q2 /= this.scale;
      q3 /= this.scale;
      q4 /= this.scale;
      med /= this.scale;
      a = [];
      for (i = 0, _ref = this.width; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
        a[this.lo(i)] = " ";
      }
      for (i = q1; q1 <= q2 ? i <= q2 : i >= q2; q1 <= q2 ? i++ : i--) {
        a[this.lo(i)] = this.tick;
      }
      for (i = q3; q3 <= q4 ? i <= q4 : i >= q4; q3 <= q4 ? i++ : i--) {
        a[this.lo(i)] = this.tick;
      }
      a[this.lo(med)] = "|";
      return this.left + a.join("") + this.right;
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
  demo = function() {
    var all, n, one, p;
    n = 1000;
    one = function() {
      return 100 * pow(normal(0.5, 0.3), 0.3);
    };
    all = function() {
      var i, _results;
      _results = [];
      for (i = 1; 1 <= n ? i <= n : i >= n; 1 <= n ? i++ : i--) {
        _results.push(one());
      }
      return _results;
    };
    p = new Percentiles(all(), "MarriageDivorces,", 3, 0);
    return show(p.asString());
  };
  demo();
}).call(this);
