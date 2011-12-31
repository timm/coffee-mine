class ABCD
  constructor: () ->
    @a   = {} ; @b  = {} ; @c   = {} ; @d = {}
    @yes = 0  ; @no = 0  ; @all = {}

  add:(actual,predicted) ->
    @known(actual)
    @known(predicted)
    if actual is predicted then @yes +=1 else @no += 1
    for target,ignore of @all
      @known(target)
      if (actual is target)
        if predicted is actual then @d[target] += 1 else @b[target] += 1
      else
        if predicted is target then @c[target] += 1 else @a[target] += 1

  known: (x) ->
    @a[x]   or= 0
    @b[x]   or= 0
    @c[x]   or= 0
    @d[x]   or= 0
    @all[x] or= 0
    @a[x]= @yes + @no if (@all[x] += 1) is 1

  report1: (k,a,b,c,d) ->
    o    = (n) -> (d3 n) * 100
    acc  = pd = pf = prec = f = g = pn = 0
    pd   = d     / (b+d) if (b+d) > 0
    pf   = c     / (a+c) if (a+c) > 0
    pn   = (b+d) / (a+c) if (a+c) > 0
    prec = d     / (c+d) if (c+d) > 0
    g    = 2*(1-pf)*pd / (1-pf+pd)  if (1-pf+pd)    > 0
    f    = 2*prec*pd   / (prec+pd)  if (prec+pd)    > 0
    acc  = @yes        / (@yes+@no)  if (@yes+@no) > 0
    out  = {a: a, b: b, c: c, d: d, pn: o(pn), acc: o(acc)}
    out.pd   = o(pd)
    out.pf   = o(pf)
    out.prec = o(prec)
    out.f    = o(f)
    out.g    = o(g)
    out

  report: () ->
    out = {}
    for k,val of @all
      out[k] = @report1 k,@a[k],@b[k],@c[k],@d[k]
    out
