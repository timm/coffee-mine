class BootStrap
  constructor:(@y,@z,@b=1000) ->
    @m = @y.length
    @n = @z.length
    @x = []
    @x.push i for i in @y
    @x.push i for i in @z
    @xmean = @mean @x
    @zmean = @mean @z
    @ymean = @mean @y

  mean:(l) ->
    sum = 0
    sum += i for i in l
    sum/l.length

  testStatistic:(y,z) ->
    m = y.length
    n = z.length
    yMean = @mean y
    zMean = @mean z
    tmp1 = tmp2 = 0
    tmp1 += pow i - yMean, 2 for i in y
    tmp2 += pow i - zMean, 2 for i in z
    s1    = tmp1/(m - 1)
    s2    = tmp2/(n - 1)
    Math.abs(zMean - yMean) / sqrt(s1/m + s2/n)

  main:() ->
    tobs = @testStatistic(@y,@z)
    yhat = (i - @ymean + @xmean for i in @y)
    zhat = (i - @zmean + @xmean for i in @z)
    bigger = 0
    for j in [1..@b]
      ystar = (any yhat for i in [1..@m])
      zstar = (any zhat for i in [1..@n])
      if @testStatistic(ystar,zstar) > tobs
        bigger += 1
    asl = bigger/@b
    {b: @b, asl: asl, opinion: @opinion asl}

  opinion: (asl) ->
    if asl < 0.010
       return "very strong reject"
    if asl < 0.025
       return "strong reject"
    if asl < 0.05
       return "reasonably strong reject"
    if asl < 0.10
      return "borderline reject"
    "accept"