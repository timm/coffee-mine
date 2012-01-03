class Col
  constructor:(s,i) ->
    @name   = s
    @pos    = i
    @f      = []
    @goalp  = (s.search /\!/) >= 0
    @missing = 0
    @all     = @counter()

  at:(n)       -> @f[n] = @f[n] or= @counter()
  add:(x,n)    ->
    if @missingp x
      @missing += 1
    else
      @all.add(x)
      @at(n).add(x)

  missingp:(s) -> s is "?"
  prob:(x,n,m,prior) -> @at(n).prob(x,m,prior)

class Num extends Col
  counter: () -> new Normal
  prep:(x) -> if @missingp x then x else +x

class Sym extends Col
  counter: () -> new Bins
  prep:(x) -> x



