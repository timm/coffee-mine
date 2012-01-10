one = -> x R.rand2(1,8), R.rand2(1,10)
b = null
R = new Rand 1
all = (one() for n in [1..20])
for thing in all
  if not b
    b = new RandomBinaryTree thing.x, thing.y
  else
    b = b.add thing
b.show()
