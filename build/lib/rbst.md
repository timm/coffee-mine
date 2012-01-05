

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
+ And the standard global definitions of [globals.coffee](https://raw.github.com/timm/coffee-mine/master/build/lib/globals.coffee).
+ All code in
[one file](https://github.com/timm/coffee-mine/blob/master/build/var/rbst-103).

Annotated Source Code
=====================

Creation
--------

A new tree contains one node and has nil for the `left` and `right` pointers.

```coffeescript
class RandomBinaryTree
  constructor: (@key,@value) ->
    @n = 1
    @left = @right = null

```

Tree Manipulation
------------------

Rotating left and right is way to move a sub-node up a tree,
while preserving the BST invariant that the left/right keys
in the new sub-trees are in the right order.

![left, right rotate](http://upload.wikimedia.org/wikipedia/commons/2/23/Tree_rotation.png)


```coffeescript
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

```

`RotateR` and `rotateL` is used
by the `rootInsert` function. This
function pushes a new node up a tree to the root
of that tree.


```coffeescript
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

```

Inserting an Item
-----------------

`insert` adds a new node to a sub-tree.
For a sub-tree of size `n`, at probability
  _1/(n+1)_, the new node is inserted to the root.
Otherwise, it is inserted somewhere into the leaves.

Note that `rootInsert` and `insert`
support `lt`- a customisable
comparison operator for two keys.


```coffeescript
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

```

`Adds` and `add` are convenience functions
for adding pairs of key values.

`Adds` inserts multiple pairs.

```coffeescript
  adds: (many, lt = ((x,y) -> x < y)) ->
    out = @
    for one in many
      out = @insert out, one.x,one.y, lt
    out

```

`Add` inserts one pair

```coffeescript
  add: (one, lt = ((x,y) -> x < y)) ->
    @insert @ , one.x,one.y, lt

```

Printing the tree
-----------------

Simple recursive function to print
nodes, with an indentation equal
to the depth of the node in the tree


```coffeescript
  show: (indent="",prefix="=",add="|   ") ->
    s = "#{indent}#{prefix}#{@key}*#{@n} :  #{@value}"
    show s
    @left.show  indent+add,"<= ",add if @left
    @right.show indent+add,">  ",add if @right

```


Helper Functions
----------------

`x` is a convenient way to generate a value pair.


```coffeescript
x = (x,y) -> new Pair x,y

class Pair
  constructor: (@x,@y) ->

```

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
