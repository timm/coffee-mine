class Row
  constructor:(@cells,head) ->
    @klass = null
    @all   = "_"
    h.add value,@all for h in head

  isa: (gs) -> @klass or= @isa0 gs
  isa0: (gs)   -> (@cell[pos] for g,pos in gs).join("-")

class ArffReader
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

  readHeader: (line,cells) ->
    relation = cells[1] if @relationp line
    if @attrp line
      @n += 1
      c = cells[1]
      unless @ignorep c
        @last = \
          new (if @symp line then Sym else Num) c,@n
        what = if @last.goalp then @goals else @ins
        what.push @last
        @head.push @last
    if not @data and @datap cells[0]
      @data = true
      @last.goalp = true if @goals.size is 0
    @data

  readData: (cells) ->
    if cells.length >= @head.length
      prepped = (h.prep cells[h.pos] for h in @head)
      show @head
      @rows.push new Row prepped,@head

  main: (lines) ->
    for line in lines
      if (line = line.replace /(%.*|\'|\")/g, '')
        if @data is true
          @readData ((line.replace /\s+/g,'').split /,/)
        #else
         # @data = @readHeader line, (line.split /\s+/g)


getFileAsLines '../data/weather.arff',
    (lines) ->
       show lines
       r = new ArffReader
       r.main lines
       show r
