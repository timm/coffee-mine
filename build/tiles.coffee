class Percentiles
  constructor:(l,@prefix="",@q=5,@w=5) ->
    @main(l.sort(),sorted.length,q)

  pad: (n) ->
    tmp = ""
    for i in [1..(w - tmp.length)]
      tmp = " " + tmp
    "#{tmp}#{n}"

  main: (l,n,q,prefix) ->
    low    = (n) -> Math.floor n
    q      = (q,n) -> low @w q
    min    = l[1]
    q1     = l[q 0.10 n]
    q2     = l[q 0.30 n]
    median = l[q 0.50 n]
    q3     = l[q 0.70 n]
    q4     = l[q 0.90 n]
    c      = ","
    "#{@prefix} #{q


