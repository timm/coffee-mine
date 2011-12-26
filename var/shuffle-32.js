(function() {
  var R, Rand, e, i, inf, l, ninf, pi, pow, show, shuffle, sqrt;
  pow = Math.pow;
  e = Math.E;
  pi = Math.PI;
  sqrt = Math.sqrt;
  show = console.log;
  inf = 1e+32;
  ninf = -1 * inf;
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
  l = [1, 2, 3, 4, 5];
  for (i = 1; i <= 1000000; i++) {
    l = shuffle(l);
  }
  show(l);
}).call(this);
