#!/usr/bin/env coffee
# Copyright (c) 2011,2012 Tim Menzies, MIT License
# 
#  #    #  #####
#  ##   #  #    #
#  # #  #  #####
#  #  # #  #    #
#  #   ##  #    #
#  #    #  #####
# 
# Version ....... : nb-41.coffee
# Built ......... : Tue Dec 27 21:21:15 EST 2011
# License ....... : see below.
# Installation .. : see below.
# Report bugs ... : https://github.com/timm/coffee-mine/issues
# For doco ...... : read http://coffee-mine.blogspot.com around Tue Dec 27 21:21:15 EST 2011

 
#--| lib/globals.coffee |-------------------------------------------------------------
 
pow  = Math.pow
e    = Math.E
pi   = Math.PI
sqrt = Math.sqrt
ln   = Math.log
show = console.log

inf  = 1e+32
ninf = -1 * inf

d2 = (n) -> Math.floor(n*100)/100
d3 = (n) -> Math.floor(n*1000)/1000
d4 = (n) -> Math.floor(n*10000)/10000 
#--| lib/rand.coffee |-------------------------------------------------------------
 
class Rand
  # Knuth and Lewis' improvements to Park and Miller's LCPRNG
  # if created without a seed, uses current time as seed
  constructor: (@seed) ->
    @multiplier = 1664525
    @modulo     = 4294967296 # 2**32-1;
    @offset     = 1013904223
    unless @seed? && 0 <= seed < @modulo
      @seed = (new Date().valueOf() * new Date().getMilliseconds()) % @modulo

  seed: (seed)      -> @seed = seed
  randn:            -> @seed = (@multiplier*@seed + @offset) % @modulo
  randf:            -> @randn() / @modulo
  rand:  (n)        -> Math.floor(@randf() * n)
  rand2: (min, max) -> min + @rand(max-min)

R = new Rand

shuffle = (l,r = R) ->
  n = l.length
  for i in [n-1..1]
    j = R.rand2(0,i)
    [ l[i],  l[j] ] = [ l[j], l[i] ]
  l

 
#--| lib/getline.coffee |-------------------------------------------------------------
 
fs = require "fs"

errorWrapper = (action) ->
  (err, args...) ->
    if err then throw err
    action args...

ifFileExists = (filename, action) ->
   fs.stat filename, errorWrapper (stat) ->
     if stat.isFile() then action()

getFileAsLines = (filename, action) ->
   ifFileExists filename, ->
     fs.readFile filename, "utf8",
       errorWrapper (content) ->
         action content.split "\n"
 
#--| lib/stats.coffee |-------------------------------------------------------------
 
show = console.log

class Distribution
  constructor: (l) -> @adds(l)
  adds:(l) -> @add x for x in l if l

class Bins extends Distribution
  constructor:(l) ->
    @n = 0
    @symbols = 0
    @symbolTable = {}
    @all = {}
    super l

  add:(x) ->
    @n = @n + 1
    now = @all[x] = (@all[x] or= 0) + 1
    if now is 1
      @symbols += 1
      @symbolTable[x] = @symbols
    x

  p:(x) -> (@all[x] ? 0)/@n
  prob:(x,m,prior) -> ((@all[x] ? 0) + m*prior)/(@n + m)

class Normal extends Distribution
  constructor:(l) ->
    @max = -1000000000
    @min = 1000000000
    @n   = 0
    @sum = 0
    @sumSq = 0
    super l

  prob:(x,m,prior) -> @p x
  add:(x) ->
    @n     = @n + 1
    @sum   = @sum + x
    @sumSq = @sumSq + x*x
    @min   = x if x < @min
    @max   = x if x > @max
    @_mean = @_stdev = null
    x

  mean:  -> @_mean or= @sum/@n
  stdev: ->
    @_stdev or= sqrt((@sumSq-((@sum*@sum)/@n))/(@n-1))

  p:(x) =>
    s = @stdev()
    1/(sqrt(2*pi)*s) * (pow e, (-1*(pow x-@mean(),2)/(2*s*s)))
 
#--| lib/col.coffee |-------------------------------------------------------------
 
class Col
  constructor:(s,i) ->
    @name   = s
    @pos    = i
    @f      = []
    @size   = 0
    @goalp  = (s.search /\!/) >= 0

  at:(n)    -> @f[n] = @f[n] or= @new()
  add:(x,n) -> @at(n).add(x)
  new:      -> @size += 1
  prob:(x,n,m,prior) -> @at(n).prob(x,m,prior)

class Num extends Col
  constructor: (s,i) ->
    @min = inf
    @max = ninf
    super s,i

  new: () -> super; new Normal
  prep:(x) -> +x
  add: (x,n) ->
    @min = x if x < @min
    @max = x if x > @max
    super  x,n

class Sym extends Col
  new: () -> super; new Bins
  prep:(x) -> x


 
#--| nb.coffee |-------------------------------------------------------------
 
class Learner
  constructor: (lines) ->
    @n        = -1    # #attributes    seen so far
    @klasses  =  0    # @klass columns seen so far
    @latest   = null  # the latest col we've made
    @head     = []    # store data for each column
    @data     = false # are we in the data section?
    @theKlass = null

  symp: (s)      -> (s.search '{'          ) > 11
  datap: (s)     -> (s.search /@data/i     ) >= 0
  attrp: (s)     -> (s.search /@attribute/i) >= 0
  klassp: (s)    -> (s.search /\!/i        ) >= 0
  ignorep: (s)   -> (s.search /\?/i        ) >= 0
  missingp: (s)  -> s is "?"
  relationp: (s) -> (s.search /@relation/i ) >= 0

  readHeader: (row,line,cells) ->
    if @relationp line then relation = cells[1]
    if @attrp line
      @n += 1
      c = cells[1]
      unless @ignorep c
        @latest = \
          if @symp line \
            then new Sym c,@n else new Num c,@n
        @latest.klassp = @klassp c
        @klasses += 1 if @latest.klassp
        @head.push @latest
    if not @data and @datap cells[0]
      @data = true
      if @klasses is 0
        @latest.klassp = true
    if @latest and @latest.klassp
      @theKlass = @latest
    @data

  readData: (row,cells) ->
    if cells.length >= @head.length
      for h in @head
        cells[h.pos] = h.prep cells[h.pos]
      if @rows > 3
         got = @test cells
         want = cells[@theKlass.pos]
         if got is want
           @acc += 1
      @rows += 1
      @train cells, @about cells

  main: (lines) ->
    for line,row in lines
      if (line = line.replace /(%.*|\'|\")/g, '')
        if @data is true
           cells = (line.replace /\s+/g,'').split /,/
           @readData row,cells
        else
           cells = line.split /\s+/g
           @data = @readHeader row,line, cells

class Nb extends Learner
  constructor: (lines) ->
    super lines
    @rows = 0
    @m = 0
    @k = 0
    @acc = 0
    @main lines
    show Math.floor(100 * @acc/@rows)

  about:(cells) ->
    cells[@theKlass.pos]

  test: (cells) ->
    what = null
    best = ninf
    nKlasses = @theKlass.size
    for klass,counts of @theKlass.f
      prior = (counts.n+@k)/(@rows + @k*nKlasses)
      like  = ln(prior)
      for h in @head
        unless h.klassp
          unless @missingp (value = cells[h.pos])
            inc   = h.prob value, klass, @m, prior
            like += ln(inc)
      if like > best
        best = like
        what = klass
    what

  train: (cells,klass) ->
    for h in @head
      unless @missingp (value = cells[h.pos])
        h.add value,klass


getFileAsLines '../data/diabetes.arff',
    (lines) ->
       nb = new Nb lines


 
# CREDITS
# =======
# 
# Tim Menzies tim@menzies.us
# 
# INSTALL
# =======
# 
# 0)  Essential first step: make yourself a cup of coffee.
# 1)  Install coffee on your local machine.
# 
# 2)  Download this file and call it, say,  'lib/globals.coffee'.
#     2a) Optional (UNIX systems only)
# 
#        chmod +x lib/globals.coffee  # <=== On UNIX systems
# 
# 3)  Look for 'data/' in this file. Usually, its the last few
#     lines of code (above). If you see any reference to such 
#     a data file, then...
#     3a) Download those data files from
#         http://now.unbox.org/all/trunk/doc/coffee-mine/data
#     3b) Edit this file so it points to those data files.
# 
# 4)  See if this file runs:
# 
#         ./lib/globals.coffee         # <=== UNIX systems
#         coffee lib/globals.coffee    # <=== for other systems
# 
# To check if it is running correctly, see 
# http://coffee-mine.blogspot.com (look for blogs entries 
# around lib/getline.coffee).
# 
# COPYRIGHT
# ---------
# 
# Permission is hereby granted, free of charge, to any person obtaining a
# copy of this software and associated documentation files (the "Software"),
# to deal in the Software without restriction, including without limitation
# the rights to use, copy, modify, merge, publish, distribute, sublicense,
# and/or sell copies of the Software, and to permit persons to whom the
# Software is furnished to do so, subject to the following conditions:
# 
# The above copyright notice and this permission notice shall be included
# in all copies or substantial portions of the Software.
# 
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
# THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR
# OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
# ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
# OTHER DEALINGS IN THE SOFTWARE.
# 