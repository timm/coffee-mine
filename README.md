learning.coffee()
=================

A data mining toolkit that implements _Occam's knife_ :

* These learners eagerly and aggressively dump irrelevancies,
redundancies etcs to learn tiny models.
* To read more about that, see http://coffee.unbox.org/p/big-picture.html.

(Yes, I know the more common term is Occam's _Razor_ but I prefer _razor_ to _knife_- see below.)

This repo is also my attempt at serious CoffeeScript programming.
So I've given up a playpen where I can take baby steps in CoffeeScript. 

The directories are:

* _[build/](https://github.com/timm/coffee-mine/tree/master/build)_
: my private build environment. Really, you don't want to look in here-
just use the built stuff (found in _easy/_ and _harder/_);
* _[data/](https://github.com/timm/coffee-mine/tree/master/data)_
: example data used by the code in _easy/_ and _harder/_;
* _[easy/](https://github.com/timm/coffee-mine/tree/master/easy)_
: the playpen, for my intro to Coffee experiments and demos
of the simpler data structures;
* _[harder/](https://github.com/timm/coffee-mine/tree/master/harder)_
: more advanced stuff than _easy/_

Note that each file in _easy/_ and _harder/_ is a  stand-alone
CoffeeScript application with all required files joined together.
Also in those directories is one .js file for each CoffeeScript file.

(+) but I'm not trimming
tiny stubble off the main body- I'm hacking away large chunks. So _knife_
seems more apt that _razor_).

Why "Knife"?
------------

William of Occam was a 14th-century English logician who is quoted saying

> _Entia non sunt multiplicanda praeter necessitatem._

Or, in English, "entities must not be multiplied beyond necessity".  It is also a core principle of data mining,
were it got tweaked a little. The best theory, according to data miners, is the one that minimizes _both_ theory size _and_
its number of errors: see [http://en.wikipedia.org/wiki/Minimum_message_length].

But that is all geek land. Here, I just say I prefer _knife_ to _razor_ since the latter just sounds like I'm just trimming
tiny stubble off a large body. That's not what I do. I hack away and discard most of the data. So my data mining tool is
definitely a _knife_.


