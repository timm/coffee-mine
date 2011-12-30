
main = () ->
  R = new Rand 1
  b  = 1000
  m1 = 11;  s1 = 1; m = 100
  m2 = 10;  s2 = 1; n = 100
  x  = new BootStrap (normal m1,s1 for i in [1..m]),
                     (normal m2,s2 for i in [1..n])
  show x.main()

main()