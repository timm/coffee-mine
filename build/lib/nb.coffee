
class Nb extends Learner
  constructor: (lines) ->
    super lines
    @rows = 0
    @m = 0
    @k = 0
    @acc = 0
    @main lines
    show Math.floor(100 * @acc/@rows)

  test: (cells) ->
    what = null
    best = ninf
    nKlasses = @theKlass.size
    for klass,counts of @theKlass.f
      prior = (counts.n+@k)/(@rows + @k*nKlasses)
      like  = ln(prior)
      for h in @head
        unless h.klassp
          unless @missingp (value = cells[h.pos])
            inc   = h.prob value, klass, @m, prior
            like += ln(inc)
      if like > best
        best = like
        what = klass
    what

  train: (cells,klass) ->
    for h in @head
      unless @missingp (value = cells[h.pos])
        h.add value,klass
