readarff = (lines) -> 
  head = []
  relation = ''

  num = (s) -> 
    name : s
    min  : inf
    max  : ninf
    prep : (x,h) -> string2Num x,h
  sym = (s) -> 
    name : s
    prep : (x,h) -> x

  symp      = (s) -> (s.search '{'          ) > 12
  datap     = (s) -> (s.search /@data/i     ) >= 0 
  relationp = (s) -> (s.search /@relation/i ) >= 0 
  attrp     = (s) -> (s.search /@attribute/i) >= 0 

  string2Num = (x,h) -> 
    y = +x  
    h.min = y if y < h.min
    h.max = y if y > h.max
    y

  readHeader = (head,cells,data) -> 
    if relationp line
      relation = cells[1]
    if attrp line
      head.push if symp line then sym cells[1] else num cells[1]
    not data and datap cells[0]

  readData = (head,cells) ->
    if cells.length >= head.length
      for cell,col in cells
        head[col].prep cell, head[col]

  data = false
  for line in lines 
    line = line.replace /(%.*|\'|\")/g, '' 
    if line
      if   data 
      then readData head, (line.replace /\s+/g,'').split /,/
      else data = readHeader head,(line.split /\s+/g), data
  show {
        what : relation
        has  : head}

getFileAsLines 'data/weather.arff', readarff
