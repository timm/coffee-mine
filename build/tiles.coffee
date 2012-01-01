class Percentiles
  constructor:(@l,@prefix="",@q=5,@w=5,@decimals=2) ->
  lo:  (n) -> Math.round n
  as:  (n) -> nummat n,@decimals
  asString:() -> @worker(@l.sort(),@l.length,@q)
  worker: (l ,n,q,prefix) ->
    q1     = @as l[@lo 0.10*n]; q1s  = @pad q1
    q2     = @as l[@lo 0.30*n]; q2s  = @pad q2
    median = @as l[@lo 0.50*n]; meds = @pad median
    q3     = @as l[@lo 0.70*n]; q3s  = @pad q3
    q4     = @as l[@lo 0.90*n]; q4s  = @pad q4
    "#{@prefix}#{q1s}, #{q2s}, #{meds}, #{q3s}, #{q4s}"
  pad: (n) ->
    tmp = ""
    size = "#{n}".length
    for i in [1..(@w - size)]
      tmp = " " + tmp
    "#{tmp}#{n}"



 demo = () ->
   n = 1000
   one = () -> pow normal(0.5,0.1),0.8
   all = () -> (one() for i in [1..n])
   p = new Percentiles  all()
   show p.asString()

demo()



