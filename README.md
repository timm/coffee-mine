learning.coffee()
=================

CoffeeScript.newbie.diary when @task is "build data miners"

This repo is about a data mining toolkit that implements _Occum's knife_. The
models learned by this learner eagerly and aggressively dump
irrelevancies, redundacies etcs to learn tiny models. To read more about that,
see http://coffee.unbox.org/p/big-picture.html.

This repo is also my attempt at serious CoffeeScript programming. So I've set up
a playpen where I can write tiny prototypes for small chunks of functionality.

The directories are:

* _./basics_ : the playpen; 
* _./build_ : my private build facility. You should ignore it and just look at the 
built dstuff (in _./basics_ and _./latter_);
* _./data_ : example data used by the code in _./basics_ and _./latter_.
* _./latter_ : more advanced stuff than _./basics_.

Note that each file in _./basics_ and _./latter_ is
a  stand-alone CoffeeScript application with all required files joined together. 
Also in those directories is one .js file for each CoffeeScript file. 
