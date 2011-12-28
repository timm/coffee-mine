learning.coffee()
=================

A data mining toolkit that implements _Occam's knife_ :

* These learners eagerly and aggressively dump irrelevancies,
redundancies etcs to learn tiny models.
* To read more about that, see http://coffee.unbox.org/p/big-picture.html.

(Yes, I know the more common term is Occam's Razor but I'm not trimming
tiny stubble off the main body- I'm hacking away large chunks. So _knife_
seems more apt that _razor_).

This repo is also my attempt at serious CoffeeScript programming.
So I've given up a playpen where I can take baby steps in CoffeeScript. 

The directories are:

* _[./build](https://github.com/timm/coffee-mine/tree/master/build)_
: my private build environment. Really, you don't want to look in here-
just use the built stuff (found in _./easy_ and _./harder_);
* _[./data](https://github.com/timm/coffee-mine/tree/master/data)_
: example data used by the code in _./easy_ and _./harder_;
* _[./easy](https://github.com/timm/coffee-mine/tree/master/easy)_
: the playpen, for my intro to Coffee experiments and demos
of the simpler data structures;
* _[./harder](https://github.com/timm/coffee-mine/tree/master/harder)_
: more advanced stuff than _./easy_

Note that each file in _./easy_ and _./harder_ is a  stand-alone
CoffeeScript application with all required files joined together.
Also in those directories is one .js file for each CoffeeScript file.
