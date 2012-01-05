x = (x,y) -> new Pair x,y

class Pair
  constructor: (@x,@y) ->

class Btree
  @key = @left = @right = @value = null

  asTree:(l) ->
    l = l.sort ((a,b) -> a.x > b.x)
    @asTree1(l,0,l.length - 1)

  asTree1: (l,min,max) ->
    mid    = Math.floor((min + max ) / 2)
    @key   = l[mid].x
    @value = l[mid].y
    if min < max
      @left  = new Btree
      @right = new Btree
      @left.asTree1( l, min,   mid)
      @right.asTree1(l, mid+1, max)

  show: (indent="",prefix="=",add="|   ") ->
    string = if not @left and not @right
               "#{@key} : #{@value}"
             else
               @key
    console.log "#{indent}#{prefix} " + string
    @left.show  indent+add,"<= ",add if @left
    @right.show indent+add,">  ",add if @right

class Rand
  # Knuth and Lewis' improvements to Park and Miller's LCPRNG
  # if created without a seed, uses current time as seed
  constructor: (@seed) ->
    @multiplier = 1664525
    @modulo     = 4294967296 # 2**32-1;
    @offset     = 1013904223
    unless @seed? && 0 <= seed < @modulo
      @seed = (new Date().valueOf() * new Date().getMilliseconds()) % @modulo

  seed: (seed)      -> @seed = seed
  randn:            -> @seed = (@multiplier*@seed + @offset) % @modulo
  randf:            -> @randn() / @modulo
  rand:  (n)        -> Math.floor(@randf() * n)
  rand2: (min, max) -> min + @rand(max-min)

R = new Rand

shuffle = (l,r = R) ->
  n = l.length
  for i in [n-1..1]
    j = r.rand2(0,i)
    [ l[i],  l[j] ] = [ l[j], l[i] ]
  l

normal = (m,s,r = R) ->
  boxMuller = () ->
    w=1
    while w >= 1
      x1 = 2.0 * r.randf() - 1
      x2 = 2.0 * r.randf() - 1
      w  = x1*x1 + x2*x2
    w = sqrt((-2.0 * ln(w))/w)
    x1 * w
  m + boxMuller() * s

any = (l,r=R) ->
  l[r.rand2(0,l.length)]

b1 = new Btree

all = shuffle (x n,n for n in [1..50000] )

b1.asTree all
#b1.show()