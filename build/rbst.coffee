one = -> x R.rand2(1,10000), R.rand2(1,10)
b = null

for n in [1..1000]
  thing = one()
  if not b
    b = new RandomBinaryTree thing.x, thing.y
  else
    b.add thing


