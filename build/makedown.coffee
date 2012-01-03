###

NAME
====

Makedown

Synposis
========

    coffee makedown.coffee -- -i file.coffee > file.md

Description
===========

Code must be commented. One fast way of doing that is Markdown
which is supported by many tools including GitHub.

A common literate programming trick is to write comments in Markdown
format in and around the source code, then autogenerate documentation
by running Markdown on those comments.

I have coded that trick a dozen times and I was starting to code it
for CoffeeScript when I remembered that GitHub renders all ".md" files
as Markdown. The local variant of Markdown supported at Github also
supports syntax highlighting- just wrap the code in four back ticks.

So, I had an idea for a really cheap way of doing literate programming
in Github:

1 Divide all source according to the multi-line comment characters.
2 Wrap every even division in four back ticks.
3 Save the result as *.md and commit to Github
4 Voila! Instant doco.

Options
=======

By default, this code will format the file _makedown.coffee_. However,
if you supply an argument _-i file_ it will read from that file.

Files
=====

Download:  [http://goo.gl/PMUKT](makedown.coffee).

Annotated Source Code
=====================

Setup
-----

The usual suspects:
###
fs   = require "fs"
show = console.log
###
We also need to define the back ticks characters.
###
tick="`"
tick3 = tick+tick+tick
###
The default input files is _makedown.coffee_. However, if there
exists a _-i_ flag, we overwrite that default.
###
file = "makedown.coffee"
for flag,n in process.argv
  if flag.match /-i/
    file = process.argv[n+1]
###
Reading the file
----------------

That _file_ is read and split on the multi-line comment character.
Note that this generates a bogus _parts[0]_ entry which is a blank
string before the first comment (which, in the following, we take care
to ignore)
####
parts = fs.readFileSync(file).toString().split /\#\#\#/
###
Generating Markdown
-------------------

From here, we just toggle down _parts_ and every other entry
gets wrapped in the back ticks.
###
comment = true
for part,n in parts
  if n > 0
    comment = not comment
    if comment
      show "#{tick3}coffeescript#{part}#{tick3}"
    else
      show part
###
BUGS
====
The file needs at least one multi-line comment.

SEE ALSO
========

For a more standard approach to Markdown (with syntax highlighting) that does not require Github,
see

+ http://davidchambers.bitbucket.org/showdown/
+ or, if you dont want syntax highlighting, [showdown.coffee](https://bitbucket.org/davidchambers/showdown/src/f23b97925ca8/src/showdown.coffee)

AUTHOR
======

[Tim Menzies](https://github.com/timm)

COPYRIGHT
=========

Share and enjoy.
Makedown by [Tim Menzies](https://github.com/timm) is licensed under a
[Creative Commons Attribution-ShareAlike 3.0 Unported License](http://creativecommons.org/licenses/by-sa/3.0/)