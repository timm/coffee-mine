class Learner
  constructor: (lines) ->
    @n        = -1    # #attributes    seen so far
    @klasses  =  0    # @klass columns seen so far
    @latest   = null  # the latest col we've made
    @head     = []    # store data for each column
    @data     = false # are we in the data section?
    @theKlass = null

  symp: (s)      -> (s.search '{'          ) > 11
  datap: (s)     -> (s.search /@data/i     ) >= 0
  attrp: (s)     -> (s.search /@attribute/i) >= 0
  klassp: (s)    -> (s.search /\!/i        ) >= 0
  ignorep: (s)   -> (s.search /\?/i        ) >= 0
  missingp: (s)  -> s is "?"
  relationp: (s) -> (s.search /@relation/i ) >= 0

  readHeader: (row,line,cells) ->
    if @relationp line then relation = cells[1]
    if @attrp line
      @n += 1
      c = cells[1]
      unless @ignorep c
        @latest = \
          if @symp line \
            then new Sym c,@n else new Num c,@n
        @latest.klassp = @klassp c
        @klasses += 1 if @latest.klassp
        @head.push @latest
    if not @data and @datap cells[0]
      @data = true
      if @klasses is 0
        @latest.klassp = true
    if @latest and @latest.klassp
      @theKlass = @latest
    @data

  readData: (row,cells) ->
    if cells.length >= @head.length
      for h in @head
        cells[h.pos] = h.prep cells[h.pos]
      if @rows > 3
         got = @test cells
         want = cells[@theKlass.pos]
         if got is want
           @acc += 1
      @rows += 1
      @train cells, @about cells

  main: (lines) ->
    for line,row in lines
      if (line = line.replace /(%.*|\'|\")/g, '')
        if @data is true
           cells = (line.replace /\s+/g,'').split /,/
           @readData row,cells
        else
           cells = line.split /\s+/g
           @data = @readHeader row,line, cells

class Nb extends Learner
  constructor: (lines) ->
    super lines
    @rows = 0
    @m = 0
    @k = 0
    @acc = 0
    @main lines
    show Math.floor(100 * @acc/@rows)

  about:(cells) ->
    cells[@theKlass.pos]

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


getFileAsLines 'data/diabetes.arff',
    (lines) ->
       nb = new Nb lines


