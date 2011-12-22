
nump = (string) -> 
  0 is (string.charAt 0).search \
       /[ABCDEFGHIJKLMNOPQRSTUVWXYZ]/

asNum = (x,h) -> 
  y = +x  # coerce string to num
  h.min = y if y < h.min
  h.max = y if y > h.max
  y

numHeader = (word) -> {
  name : word
  min  : inf
  max  : ninf
  prep : (x,h) -> asNum x,h}

symHeader = (word) -> {
  name : word
  prep : (x,h) -> x} # to prep, do nothing

asCells = (string) -> (string.replace /\s/g , '').split ','

readcsv = (lines) -> 
  head=[]
  for line,n in lines when line
    if   n is 0  
         readheader head, asCells line
    else readdata   head, asCells line 
  show head

readheader = (head,cells) -> 
  for cell,n in cells
    head[n] = 
      if nump cell then numHeader cell else symHeader cell

readdata  = (head,cells) -> 
  for cell,n in cells
    head[n].prep cell, head[n]

getFileAsLines 'data/weather.csv', readcsv
