process = (l) -> 
  n = 0
  for x in l when x
    n += (x.split ' ').length
  show n

getFileAsLines "data/all80000.txt", process
