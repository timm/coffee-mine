class ABCD
  constructor: (klasses) ->
    @a   = {}
    @b   = {}
    @c   = {}
    @d   = {}
    @yes = 0
    @no  = 0
    @all = {}

  add:(actual,predicted) ->
    @known(actual)
    @known(predicted)
    if actual is predicted then @yes +=1 else @no += 1
    for target,ignore of @all
      if (actual is target)
         if predicted is actual then @d[target] += 1 else @b[target] += 1
      else
         if predicted is target then @c[target] += 1 else @a[target] += 1

  known: (x) ->
    @a[x] or= 0
    @b[x] or= 0
    @c[x] or= 0
    @d[x] or= 0
    @klass[x] or= 0
    if (@klass[x] += 1) is 1 then @a[x]= @yes + @no

 report :
 report1: (k,a,b,c,d,) ->