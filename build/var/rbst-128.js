(function() {
  var Pair, R, Rand, RandomBinaryTree, all, any, b, d2, d3, d4, e, inf, ln, n, ninf, normal, nummat, one, pi, pow, show, shuffle, sqrt, thing, x, _i, _len;
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
       b.show()
  
  The last line does a pretty print of the generated tree.
  
  Description
  ===========
  
  A [random binary search
  tree](http://en.wikipedia.org/wiki/Randomized_binary_search_tree)
  (RBST) is a way to build an (approximately) balanced binary search
  tree.
  
  RBSTs are very simple to code and incrementally maintain their balance.
  That is, when using them, you never need to pause to rebalance the tree.
  
  RBSTs are based on binary search trees (BST):
  
  + A BST  contains nodes with a `key,value` and
  `left` and `right` pointers to sub-trees. In such trees, all the
  `left` keys are less than or equal to the local `key` and all the
  `right` jeys are greater than the local `key`.
  + Ideally, a BST is _balanced_; i.e. it has the same number of nodes
  in the `left` and `right` sub-trees. In such a tree, _N_ items can be
  found in _O(log N)_ time.
  
  The RBST stores at each node a small integer, the number of
  its descendants (counting itself as one). When a key _x_ is to be inserted
  into a tree that already has _n_ nodes:
  
  + The insertion algorithm chooses
  with probability _1/(n + 1)_ to place _x_ as the new root of the tree.
  + Otherwise, it calls the insertion procedure recursively to insert _x_
  within the `left` or `right` subtree (depending on whether its key is less
  than or greater than the root).
  
  The numbers of descendants `n` are used by the algorithm to calculate the
  necessary probabilities for the random choices at each step.
  
  Files
  =====
  
  + This file : [rbst.coffee](https://raw.github.com/timm/coffee-mine/master/build/lib/rbst.coffee).
  + Uses the random number generator  :
  [rand.coffee](https://raw.github.com/timm/coffee-mine/master/build/lib/rand.coffee).
  + And the standard global definitions of
    [globals.coffee](https://raw.github.com/timm/coffee-mine/master/build/lib/globals.coffee).
  + All code in
    [one file](https://github.com/timm/coffee-mine/blob/master/build/var/rbst-103).
  
  Annotated Source Code
  =====================
  
  Creation
  --------
  
  A new tree contains one node and has nil for the `left` and `right` pointers.
  
  Tree Manipulation
  ------------------
  
  Rotating left and right is way to move a sub-node up a tree,
  while preserving the BST invariant that the left/right keys
  in the new sub-trees are in the right order.
  
  ![left, right rotate](http://upload.wikimedia.org/wikipedia/commons/2/23/Tree_rotation.png)
  */
  RandomBinaryTree = (function() {
    function RandomBinaryTree(key, value) {
      this.key = key;
      this.value = value;
      this.n = null;
      this.local = 1;
      this.left = this.right = null;
    }
    RandomBinaryTree.prototype.rotateL = function(h) {
      var x;
      x = h.right;
      h.right = x.left;
      x.left = h;
      h.reset();
      x.reset();
      h.size();
      x.size();
      return x;
    };
    RandomBinaryTree.prototype.rotateR = function(h) {
      var x;
      x = h.left;
      h.left = x.right;
      x.right = h;
      h.reset();
      x.reset();
      h.size();
      x.size();
      return x;
    };
    RandomBinaryTree.prototype.reset = function() {
      return this.n = null;
    };
    RandomBinaryTree.prototype.update = function() {
      this.n = this.local;
      if (this.left) {
        this.n += this.left.size();
      }
      if (this.right) {
        return this.n += this.right.size();
      }
    };
    RandomBinaryTree.prototype.size = function() {
      if (this.n === null) {
        this.update();
      }
      return this.n;
    };
    RandomBinaryTree.prototype.insert = function(h, key, val, lt) {
      if (h === null) {
        return new RandomBinaryTree(key, val);
      }
      if (R.randf() < (1 / (h.size()))) {
        return this.rootInsert(h, key, val, lt);
      }
      if (lt(key, h.key)) {
        h.left = this.insert(h.left, key, val, lt);
      } else if (key === h.key) {
        h.local += 1;
      } else {
        h.right = this.insert(h.right, key, val, lt);
      }
      h.reset();
      return h;
    };
    RandomBinaryTree.prototype.rootInsert = function(h, key, val, lt) {
      if (h === null) {
        return new RandomBinaryTree(key, val);
      }
      if (lt(key, h.key)) {
        h.left = this.rootInsert(h.left, key, val, lt);
        h = this.rotateR(h);
      } else if (key === h.key) {
        h.local += 1;
      } else {
        h.right = this.rootInsert(h.right, key, val, lt);
        h = this.rotateL(h);
      }
      h.reset();
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
      s = "" + indent + prefix + this.key + " has " + this.local + " so " + (this.size()) + " :  " + this.value;
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
  /*
  
  Helper Functions
  ----------------
  
  `x` is a convenient way to generate a value pair.
  
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
  /*
  Bugs
  ====
  
  None known (yet) but if you find any, please [report them here](https://github.com/timm/coffee-mine/issues?sort=comments&direction=desc&state=open).
  
  AUTHOR
  ======
  
  [Tim Menzies](https://github.com/timm)
  
  COPYRIGHT
  =========
  
  Share and enjoy.
  Makedown by [Tim Menzies](https://github.com/timm) is licensed under a
  [Creative Commons Attribution-ShareAlike 3.0 Unported License](http://creativecommons.org/licenses/by-sa/3.0/)
  */
  one = function() {
    return x(R.rand2(1, 8), R.rand2(1, 10));
  };
  b = null;
  R = new Rand(1);
  all = (function() {
    var _results;
    _results = [];
    for (n = 1; n <= 20; n++) {
      _results.push(one());
    }
    return _results;
  })();
  for (_i = 0, _len = all.length; _i < _len; _i++) {
    thing = all[_i];
    if (!b) {
      b = new RandomBinaryTree(thing.x, thing.y);
    } else {
      b = b.add(thing);
    }
  }
  b.show();
}).call(this);
