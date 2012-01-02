class Row
  constructor:(@cells,head) ->
    @klass = null
    @all   = "_"
    h.add value,@all for h in head

  isa: (goals)  -> @klass or= @isa0(goals)
  isa0: (gs)    -> (@cell[g.pos] for g in gs).join("-")

class ArffReader
  constructor: (lines,learner) ->
    @n     = -1    # #attributes    seen so far
    @head  = []    # store data for each column
    @data  = false # are we in the data section?
    @goals = {}
    @ins   = {}
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
        what.push latest
        @head.push @last
    if not @data and @datap cells[0]
      @data = true
      @last.goalp = true if @goals.size is 0
    @data

  readData: (cells) ->
    if cells.length >= @head.length
      prepped = (h.prep cells[h.pos] for h in @head)
      @rows.push new Row prepped,@head

  main: (lines) ->
    for line,row in lines
      if (line = line.replace /(%.*|\'|\")/g, '')
        if @data is true
          cells = (line.replace /\s+/g,'').split /,/
          @readData cells
        else
          cells = line.split /\s+/g
          @data = @readHeader line, cells

class Knife extends Learner
  constructor:(lines) ->
    super lines
    @row = -1
    @rows = {}
    @main lines

getFileAsLines '../data/diabetes.arff',
    (lines) ->
       nb = new Knife lines
