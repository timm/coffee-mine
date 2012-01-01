class Percentiles
  constructor:(@l,@prefix="",@w=3,@decimals=2,@right=100\
               ,@width=100,@scale=4,@min=1,@max=100\
               ,@left="[",@right="]",@tick="-") ->

  lo:  (n) -> Math.floor n
  as:  (n) -> nummat n,@decimals

  asString:() -> @worker(@l.sort(),@l.length,@prefix)

  worker: (l ,n,q,prefix) ->
    q1     = @as l[@lo 0.10*n]; q1s  = @pad q1
    q2     = @as l[@lo 0.30*n]; q2s  = @pad q2
    median = @as l[@lo 0.50*n]; meds = @pad median
    q3     = @as l[@lo 0.70*n]; q3s  = @pad q3
    q4     = @as l[@lo 0.90*n]; q4s  = @pad q4
    "#{@prefix}#{q1s}, #{q2s}, #{meds}, #{q3s}, #{q4s}, " + \
     @pretty(q1,q2,median,q3,q4)

  pretty: (q1,q2,med,q3,q4) ->
    @width    /= @scale
    q1        /= @scale
    q2        /= @scale
    q3        /= @scale
    q4        /= @scale
    med       /= @scale
    a          = []
    a[@lo i]   = " " for i in [0..@width]
    a[@lo i]   = @tick for i in [q1..q2]
    a[@lo i]   = @tick for i in [q3..q4]
    a[@lo med] = "|"
    @left + a.join("") + @right

  pad: (n) ->
    tmp = ""
    size = "#{n}".length
    for i in [1..(@w - size)]
      tmp = " " + tmp
    "#{tmp}#{n}"
