class ABCD
  constructor: (klasses) ->
    @a   = {} ; @b  = {} ; @c   = {} ; @d = {}
    @yes = 0  ; @no = 0  ; @all = {}

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
    @a[x]     or= 0
    @b[x]     or= 0
    @c[x]     or= 0
    @d[x]     or= 0
    @klass[x] or= 0
    if (@klass[x] += 1) is 1
      @a[x]= @yes + @no

  report: () ->
    out = {}
    for k,val in @all
      out[k] = report1 k,@a[k],@b[k],@c[k],@d[k]
    out

  report1: (k,a,b,c,d) ->
	  acc = 0
    # @pd = 0
    # pf = 0
    # prec = 0
    # f = 0
    # g = 0
    # pn = 0
    # acc = 3
#if b + d is 0
     # acc = 1
#    pd = d / b + d unless b + d is 0
  #   if (a+c) > 0 then pf   = c     / (a+c)
  #   if (a+c) > 0 then pn   = (b+d) / (a+c)
  #   if (c+d) > 0 then prec = d     / (c+d)
  #   if (1-pf+pd)    > 0 then g   = 2*(1-pf)*pd / (1-pf+pd)
  #   if (prec+pd)    > 0 then f   = 2*prec*pd   / (prec+pd)
  #   if (@yes + @no) > 0 then acc = @yes        / (@yes+@no)
  #   {a:a,b:b,c:c,d:d,acc:d2 acc,pd:d2 pd,pf:d2 pf,pn:pn,prec:d2 prec,f:d2 f,g:d2 g}