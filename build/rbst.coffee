one = -> x R.rand2(1,10000), R.rand2(1,10)
b = null
for n in [1..10000]
  thing = one()
  if not b
    b = new RandomBinaryTree thing.x, thing.y
  else
    b = b.add thing
#b.show()
