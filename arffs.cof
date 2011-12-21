readarff = (lines) -> 
  numHeader = (s) -> 
    name : s
    min  : inf
    max  : ninf
    prep : (x,h) -> asNum x,h

  symHeader = (s) -> 
    name : s
    prep : (x,h) -> x
 
  symp      = (s) -> (s.search '{'          ) >  0
  datap     = (s) -> (s.search /@data/i     ) >= 0 
  relationp = (s) -> (s.search /@relation/i ) >= 0 
  attrp     = (s) -> (s.search /@attribute/i) >= 0 

  asNum = (x,h) -> 
    y = +x  
    h.min = y if y < h.min
    h.max = y if y > h.max
    y

  head     = []
  data     = false
  relation = ''
  for line in lines 
    line = line.replace /(%.*|\'|\")/g, '' 
    if line
      if data 
         line  = line.replace /\s+/g,''
         cells = line.split /,/
         if cells.length >= head.length
           for cell,col in cells
              head[col].prep cell, head[col]
      else
         cells = line.split /\s+/g
         if relationp line
            relation = cells[1]
         if attrp line
           head.push if symp line \
             then symHeader cells[1] else numHeader cells[1]
         if datap cells[0]
            data = true 
  show {
        what : relation
        has  : head}

getFileAsLines 'data/weather.arff', readarff
