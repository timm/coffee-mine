show = console.log

class Distribution
  constructor: (l) -> @adds(l)
  adds:(l) -> @add x for x in l if l

class Bins extends Distribution
  constructor:(l) ->
    @n = 0
    @symbols = 0
    @symbolTable = {}
    @all = {}
    super l

  add:(x) ->
    @n = @n + 1
    now = @all[x] = (@all[x] or= 0) + 1
    if now is 1
      @symbols += 1
      @symbolTable[x] = @symbols
    x

  p:(x) -> (@all[x] ? 0)/@n
  prob:(x,m,prior) -> ((@all[x] ? 0) + m*prior)/(@n + m)

class Normal extends Distribution
  constructor:(l) ->
    @max = -1000000000
    @min = 1000000000
    @n   = 0
    @sum = 0
    @sumSq = 0
    super l

  prob:(x,m,prior) -> @p x
  add:(x) ->
    @n     = @n + 1
    @sum   = @sum + x
    @sumSq = @sumSq + x*x
    @min   = x if x < @min
    @max   = x if x > @max
    @_mean = @_stdev = null
    x

  mean:  -> @_mean or= @sum/@n
  stdev: ->
    @_stdev or= sqrt((@sumSq-((@sum*@sum)/@n))/(@n-1))

  p:(x) =>
    s = @stdev()
    1/(sqrt(2*pi)*s) * (pow e, (-1*(pow x-@mean(),2)/(2*s*s)))
