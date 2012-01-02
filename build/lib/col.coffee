class Col
  constructor:(s,i) ->
    @name   = s
    @pos    = i
    @f      = []
    @size   = 0
    @goalp  = (s.search /\!/) >= 0

  at:(n)       -> @f[n] = @f[n] or= @new()
  add:(x,n)    -> @at(n).add(x)
  new:         -> @size += 1
  missingp:(s) -> s is "?"
  prob:(x,n,m,prior) -> @at(n).prob(x,m,prior)

class Num extends Col
  constructor: (s,i) ->
    @min = inf
    @max = ninf
    super s,i

  new: () -> super; new Normal
  prep:(x) -> if @missingp x then x else +x
  add: (x,n) ->
    unless @missing x
      @min = x if x < @min
      @max = x if x > @max
      super  x,n

class Sym extends Col
  new: () -> super; new Bins
  prep:(x) -> x
  add: (x,n) ->
    super x,n unless @missing x



