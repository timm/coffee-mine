
head = []
last = null 

for col,id in 'fname !suburb'.split /\s+/
   head.push (last = new Sym col,id)

for col,id in 'age mpg'.split /\s+/
  head.push (last = new Num col,id)

show head
show last
last.add(20,1)
last.add(21,1)
last.add(22,1)
last.add(23,1)
last.add(24,1)
show last.f[1].mean()
show last.f[1].stdev()
show last

