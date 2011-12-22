readcsv = (lines) -> 
  numHeader = (s) -> {
    name : s
    min  : inf
    max  : ninf
    prep : (x,h) -> asNum x,h}

  symHeader = (s) -> {
    name : s
    prep : (x,h) -> x}
 
  nump = (s) -> 
    0 is s.search /[A-Z]/

  asNum = (x,h) -> 
    y = +x  # coerce string to num
    h.min = y if y < h.min
    h.max = y if y > h.max
    y

  head=[]
  for line,row in lines when line
    cells = (line.replace /\s/g , '').split ','
    if row is 0   
      for cell,col in cells
        head[col] = 
          if nump cell 
          then numHeader cell 
          else symHeader cell
    else 
      for cell,col in cells
        head[col].prep cell, head[col]
  show head

getFileAsLines 'data/weather.csv', readcsv
