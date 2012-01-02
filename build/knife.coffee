class Row
  constructor:(cells,reader) ->
    @cells = cells
    @klass = @isa(reader.goals)
    h.add @cells[h.pos],@klass for h in reader.head

  isa:  (goals) -> @klass or= @isa0 goals
  isa0: (goals) -> (@cells[g.pos] for g in goals).join("-")

class Reader
  constructor: () ->
    @n     = -1    # #attributes    seen so far
    @head  = []    # store data for each column
    @data  = false # are we in the data section?
    @goals = []
    @ins   = []
    @rows  = []
    @last  = null

  symp: (s)      -> (s.search '{'          ) > 11
  datap: (s)     -> (s.search /@data/i     ) >= 0
  attrp: (s)     -> (s.search /@attribute/i) >= 0
  ignorep: (s)   -> (s.search /\?/i        ) >= 0
  relationp: (s) -> (s.search /@relation/i ) >= 0

  readHeaderString: (s) ->
    @readHeader s, s.split /\s+/g
  readHeader: (s, cells) ->
    if not @data and @datap cells[0]
      @data = true
      if @goals.length is 0
        @last.goalp = true
      for h in @head
        what = if h.goalp then @goals else @ins
        what.push h
    else if @relationp s
      relation = cells[1]
    else if @attrp s
      @n += 1
      c = cells[1]
      unless @ignorep c
        what  = if @symp s then Sym else Num
        @last = new what  c,@n
        @head.push @last
    else
       show "!!!!!????? #{s}"
    @data

  readDataString: (s) ->
    @readData (s.replace /\s+/g,'').split /,/
  readData: (cells) ->
    if cells.length >= @head.length
      prepped = (h.prep cells[h.pos] for h in @head)
      @rows.push new Row prepped,@

  readString : (s) ->
    if (s = s.replace /(%.*|\'|\")/g, '')
      if @data
        @readDataString s
      else
        @data = @readHeaderString s

  main: (lines) ->
    @readString line for line in lines

getFileAsLines '../data/weather.arff',
    (lines) ->
       r = new Reader
       r.main lines
       show r.rows
