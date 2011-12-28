learning.coffee()
=================

_CoffeeScript.newbie.diary when @task is "build data miners"_

This repo is about a data mining toolkit that implements _Occum's knife_:
* These learners eagerly and aggressively dump irrelevancies, 
redundacies etcs to learn tiny models. 
* To read more about that, see http://coffee.unbox.org/p/big-picture.html.

This repo is also my attempt at serious CoffeeScript programming. So I've set up
a playpen where I can write tiny prototypes for small chunks of functionality.

The directories are:

* _[./basics](https://github.com/timm/coffee-mine/tree/master/basics)_ 
: the playpen; 
* _[./build](https://github.com/timm/coffee-mine/tree/master/build)_ 
: my private build facility. Really, you don't want to look in here-
just use the 
built stuff (found in _./basics_ and _./latter_);
* _[./data](https://github.com/timm/coffee-mine/tree/master/data)_ 
: example data used by the code in _./basics_ and _./latter_.
* _[./latter](https://github.com/timm/coffee-mine/tree/master/latter)_ 
: more advanced stuff than _./basics_.

Note that each file in _./basics_ and _./latter_ is
a  stand-alone CoffeeScript application with all required files joined together. 
Also in those directories is one .js file for each CoffeeScript file. 
