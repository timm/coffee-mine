(function() {
  var Pair, R, Rand, RandomBinaryTree, any, b, d2, d3, d4, e, inf, ln, n, ninf, normal, nummat, one, pi, pow, show, shuffle, sqrt, thing, x;
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
  /*
  
  NAME
  ====
  
  Rbst
  
  Synopsis
  ========
  
  Add 1,000 randomly
  generated key value pairs to a RandomBinaryTree:
  
      one = -> x R.rand2(1,10000), R.rand2(1,10)
      b = null
      for n in [1..1000]
        thing = one()
        if not b
          b = new RandomBinaryTree thing.x, thing.y
        else
          b.add thing
  
  Description
  ===========
  
  A binary search tree (BST)
  contains nodes with a _key,value_ and _left_ and _right_
  pointers to sub-trees. In such trees:
  
  + all the _left_ keys are less than or equal to the local _key_
  + all the _right_ jeys are greater than the local _key_.
  
  Ideally, a BST is A balanced BST has the same number of nodes in the _left_ and
  _right_ sub-trees. There are many schemes for building such
  
  */
  x = function(x, y) {
    return new Pair(x, y);
  };
  Pair = (function() {
    function Pair(x, y) {
      this.x = x;
      this.y = y;
    }
    return Pair;
  })();
  RandomBinaryTree = (function() {
    function RandomBinaryTree(key, value) {
      this.key = key;
      this.value = value;
      this.n = 1;
      this.left = this.right = null;
    }
    RandomBinaryTree.prototype.rotateR = function(h) {
      x = h.right;
      h.right = x.left;
      x.left = h;
      return x;
    };
    RandomBinaryTree.prototype.rotateL = function(h) {
      x = h.left;
      h.left = x.right;
      x.right = h;
      return x;
    };
    RandomBinaryTree.prototype.rootInsert = function(h, key, val, lt) {
      if (!h) {
        return new RandomBinaryTree(key, val);
      }
      if (lt(key, h.key)) {
        h.left = this.rootInsert(h.left, key, val, lt);
        h = this.rotateR(h);
      } else {
        h.right = this.rootInsert(h.right, key, val, lt);
        h = this.rotateL(h);
      }
      return h;
    };
    RandomBinaryTree.prototype.insert = function(h, key, val, lt) {
      if (!h) {
        return new RandomBinaryTree(key, val);
      }
      if (R.rand() < 1 / (h.n + 1)) {
        return this.rootInsert(h, key, val, lt);
      }
      if (lt(key, h.key)) {
        h.left = this.insert(h.left, key, val, lt);
      } else {
        h.right = this.insert(h.right, key, val, lt);
      }
      this.n += 1;
      return h;
    };
    RandomBinaryTree.prototype.adds = function(many, lt) {
      var one, out, _i, _len;
      if (lt == null) {
        lt = (function(x, y) {
          return x < y;
        });
      }
      out = this;
      for (_i = 0, _len = many.length; _i < _len; _i++) {
        one = many[_i];
        out = this.insert(out, one.x, one.y, lt);
      }
      return out;
    };
    RandomBinaryTree.prototype.add = function(one, lt) {
      if (lt == null) {
        lt = (function(x, y) {
          return x < y;
        });
      }
      return this.insert(this, one.x, one.y, lt);
    };
    RandomBinaryTree.prototype.show = function(indent, prefix, add) {
      var s;
      if (indent == null) {
        indent = "";
      }
      if (prefix == null) {
        prefix = "=";
      }
      if (add == null) {
        add = "|   ";
      }
      s = "" + indent + prefix + this.key + "*" + this.n + " :  " + this.value;
      show(s);
      if (this.left) {
        this.left.show(indent + add, "<= ", add);
      }
      if (this.right) {
        return this.right.show(indent + add, ">  ", add);
      }
    };
    return RandomBinaryTree;
  })();
  one = function() {
    return x(R.rand2(1, 10000), R.rand2(1, 10));
  };
  b = null;
  for (n = 1; n <= 1000; n++) {
    thing = one();
    if (!b) {
      b = new RandomBinaryTree(thing.x, thing.y);
    } else {
      b.add(thing);
    }
  }
}).call(this);
