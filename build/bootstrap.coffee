class Boot
  constructor:(b,m,n,y,z) ->
    @b = b
    @m = m
    @n = n
    @y = y
    @z = z
    @tobs = @tee(y,z)

  tee:(y,z) ->
    ySum  = zSum = tmp1 = tmp2 = 0
    ySum += i for i in y
    zSum += 1 for i in z
    tmp1 += pow i - ySum, 2 for i in y
    tmp2 += pow i - zSum, 2 for i in z
    s1    = tmp1/(@m - 1)
    s2    = tmp2/(@n - 1)
    (zSum/@n - ySum/@m) / sqrt(s1/@m + s2/@n)

  main:() ->
    zsum = ysum = xsum = 0;
    for i in @z
      xsum += i ; zsum += i
    for i in @y
      xsum += i ; ysum += i
    xmu  = xsum/(@m + @n)
    ymu  = ysum/@m
    zmu  = zsum/@n
    yhat = (i - ymu + xmu for i in @y)
    zhat = (i - zmu + xmu for i in @z)
    bigger = 0
    for j in [1..@b]
      ystar = (any yhat for i in [1..@m])
      zstar = (any zhat for i in [1..@n])
      if @tee(ystar,zstar) > @tobs
        bigger += 1
    bigger/@b

bootDemo = ()  ->
  R = new Rand 2
  b  = 10000
  m1 = 10; s1 = 0.1; m = 100
  m2 = 10; s2 = 0.1; n = 100
  x  = new Boot b,m,n,
                (normal m1,s1 for i in [1..m]),
                (normal m2,s2 for i in [1..n])
  show x.main()

bootDemo()