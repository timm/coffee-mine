
 demo = () ->
   n = 1000
   one = () -> 100*pow normal(0.5,0.3),0.3
   all = () -> (one() for i in [1..n])
   p = new Percentiles all(),"MarriageDivorces,",3,0
   show p.asString()

demo()



