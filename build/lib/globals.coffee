pow  = Math.pow
e    = Math.E
pi   = Math.PI
sqrt = Math.sqrt
ln   = Math.log
show = console.log

inf  = 1e+32
ninf = -1 * inf

d2 = (n) -> Math.round(n*100)/100

d3 = (n) -> Math.round(n*1000)/1000

d4 = (n) -> Math.round(n*10000)/10000

nummat = (number, decimals, dec=".", sep=",") ->
  # from http://goo.gl/2vcMH
  number = (number + '').replace(/[^0-9+\-Ee.]/g, '')
  n      = if isFinite(+number) then +number else 0
  prec   = if isFinite(+decimals) then Math.abs(decimals) else 0
  s      = ''
  toFixedFix =  (n, prec) ->
    k = Math.pow(10, prec)
    '' + Math.round(n * k) / k
  s = if prec then toFixedFix(n, prec) else '' + Math.round(n)
  s = s.split('.')
  if (s[0].length > 3)
     s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep)
  if (s[1]  || '').length < prec
      s[1] = s[1] || ''
      s[1] += new Array(prec - s[1].length + 1).join('0')
   s.join(dec)
