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
    j = R.rand2(0,i)
    [ l[i],  l[j] ] = [ l[j], l[i] ]
  l

