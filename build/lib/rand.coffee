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
