

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

The numbers of descendants are used by the algorithm to calculate the
necessary probabilities for the random choices at each step.

Files
=====



```coffeescript

x = (x,y) -> new Pair x,y

class Pair
  constructor: (@x,@y) ->

class RandomBinaryTree
  constructor: (@key,@value) ->
    @n = 1
    @left = @right = null


  rotateR: (h) ->
    x = h.right
    h.right = x.left
    x.left = h
    x

  rotateL: (h) ->
    x = h.left
    h.left = x.right
    x.right = h
    x


  rootInsert: (h,key,val,lt) ->
    unless h
      return new RandomBinaryTree key,val
    if lt key,h.key
      h.left = @rootInsert h.left,  key,val,lt
      h      = @rotateR h
    else
      h.right = @rootInsert h.right,key,val,lt
      h       = @rotateL h
    h

  insert: (h,key,val,lt) ->
    unless h
      return new RandomBinaryTree key,val
    if R.rand() < 1/(h.n + 1)
      return @rootInsert h,     key,val,lt
    if lt key,h.key
      h.left   = @insert h.left,key,val,lt
    else
      h.right  = @insert h.right,key,val,lt
    @n += 1
    h

  adds: (many, lt = ((x,y) -> x < y)) ->
    out = @
    for one in many
      out = @insert out, one.x,one.y, lt
    out

  add: (one, lt = ((x,y) -> x < y)) ->
     @insert @ , one.x,one.y, lt

  show: (indent="",prefix="=",add="|   ") ->
    s = "#{indent}#{prefix}#{@key}*#{@n} :  #{@value}"
    show s
    @left.show  indent+add,"<= ",add if @left
    @right.show indent+add,">  ",add if @right


```
