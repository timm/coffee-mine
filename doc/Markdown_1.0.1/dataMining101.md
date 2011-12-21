cat<<EOF | ./Markdown.pl | lynx -stdin

_Notes on basic data mining concepts_

The real world is a messy place where everything can interact
with everything else. It can be hard to isolate effects in such
a mixed up, jumbled up place.

Enter data mining. Data miners find patterns in data.  Over the years,
data mining has been called many things including machine learning,
data mining, predictive analytics, business intelligence, etc etc.
There is even a debate about data mining and statistics: are they
seperate things? Is one just reinventing (poorly) techniques used in
another field?  I've had that debate, many times and life is too short
to spend time on that thorny path. In my view statistics and data
mining are really both instances of some higher level process that, so
far, has no fancy name. Moving right along...
 
From an engineering viewpoint, the following simple definition
is quite useful for building data mining toos:

+ Data miners are _tricks to fix the mix_.

That is, they are tools to find _what is different_ and _what is the
same_ inside tables of data.

What is different
-----------------

Given tables of data where all the effects are mixed
in together, data miners find what patterns:

+ Most predict for seperate parts of the mix;
+ Are most effective at moving you from one part of the mix to another.

The first kind of learners are called _classifiers_ and the second
are called _contrast set learners_. Classifiers tell you what
is true about the current situation and constrast set learners
tell you what you can do to change the current situation.

What is the same
----------------

Since can data miners learn what matters inside some
data, they can also learn _what does not matter_. 
Data usually contains diamonds, buried inside a whole
mess of irrelevancies. 

So one way to think of data mining is a recursive process of
dumping  what does not matter, then exploring the rest for patterns. 
What we can do is write simple (and fast) tools for culling   the
crud before looking for the patterns. And there is a lot of crud
to cull.
A repeated
result is that if you have a table of data containing
25 columns and 1000 rows, you can usually throw away 900
rows and 20 of the columns without any real information loss. 
Hence, when searching for patterns, it is 
very useful to run the data through a sieve to get rid
of the irrelevancies. This can dramatically
reduce
the search space for the learning. 

Techncal note: getting rid of the least-informative columns is called
_feature selection_ and getting rid of the least-informative rows is
called _instance selection_.

Terminology
-----------

The data mining field is full of terminology: long words when small
ones will do just as well. In the following, giving synonyms for the
same concept, I choose the one that that is shorter to type and has
less syllables.

Here is my data mining lexicon:

+ _Tables_ of data contain _rows_ and _cols_ (short for columns).
+ _Rows_ contain _cells_ and some cells are _empty_ (contain no values).
+ All non-empty cells in one column are either all _num_s (for numerics) or all _syms_ (for non-numerics).
+ Some columns are _scored_. That is, they come from some judgement of
each rows.  Those _scores_ can be either _nums_ or _syms_;
e.g.  "that is a car" or "that is a dog" are _syms_ and
"I like that, 80\%" or "I like that much less at 10%" are _nums_.
+ Some of the non-scored _cols_ are  _act_ions represent things we can change
in order to adjust the _scores_. 
It is a kindness to users if we restrict our learned models to the _acts_ 
(otherwise, we'll be telling them things about stuff they cannot effect).
+ Learners that ignore the scored cols are known as "unsupervised" while
those that use the scores within their reasoning are called "supervised" learners.

For anyone familiar with the data mining literature, we add the following
notes on synonyms:

+ _Tables_ can be called data and not all data is best represented  in  tabular form; e.g. graphical models.
+ _Scores_ can also be called classes (and that takes more syllables).
+ _Rows_ can also be called cases, examples, or instances.
+ _Cols_ can also be called variables or attributes.
+ _Acts_ can also be called the controllables. 

Range Selection
---------------

The set of unique cell values  in any col is talled the _range_. 
_Num_ cols have an infinite number of values between their min and
max values. _Sym_ cols have only a few values.

Learning is easier when there is less to learn. Hence, a common operation
is to break up the infinite number of _num_ values into just a few values.
This is called _discretization_ and has the effect of changing  a _num_ column
into a _sym_ column.  For example, a simple discretizer is to place some number
into one of  10  ranges using

    int(10*(number - min ) / ((max - min)/10))

Here, min and max are the min and max values seen in that column. Note
that this is an unsupervised discretizater since it does not
use any of the _scores_. Smarter discretizers use those scores
and only break the numers at the point where the scores start changing.
This can result in far fewer than the ten ranges found by the above formula.

Roadmap
-------

NaiveBayes

NaiveBayes + unsupervised discretization
