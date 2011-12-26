cat<<EOF | ./Markdown.pl 

Simplify, simplify
==================

Ever think that everyone is talking cr*p? I always kind of suspected
it. But it wasn't till I started data mining that I realized just how
_much_ nonsense everyone is talking:

97%

That's right: 97%. Take any set of experiences, any set of examples
anyone gives you, any log of justifications anyone offers you. Write it
down as a table with one row per example and one column for every term in
that table.  A repeated result in data mining is that you can throw away
around 90% of the rows and around three-quarters of the columns. Which
leaves around 0.1*0.25 = 3% (ish) of the original data really matters.

So here's my tip for reasoning about the world:

* _Timm's rule:_ Prune away what doesn't matter and focus on what's left.

Actually, Timm's rule has been said much earlier, and much better, than that:

> "Our life is frittered away by detail. Simplify, simplify."
-- Henry David Thoreau (1817-1862)

It turns out that this rule is a core principle of cognitive psychology.
Larkin (1980) explains human expertise in terms of a _long term memory_ of
possibilities and a _short term memory_ for the things we are currently
considering. Novices confuse themselves by overloading  their short
term memory. They run so many "what if" queries that their short term
memory chokes and dies. Experts, on the other hand, only reason about
the _things that matter_ so  their short term memories have space for
conclusions. The exact details of how this is done is quite technical,
but the main lesson is clear:

* Experts are experts since they know what to ignore (which is another
way of stating Timm's rule).

This has obvious business implications.  For one thing, we can build
better decision support systems:

* In 1916, Henri Fayol said that managers plan, organise, co-ordinate
and control.  In that view, managers systematically assessing all relevant
factors to generate some optimum plan.

* Them in the sixties, computers were used to  automatically and routinely
generate the information needed for the Fayol model.  This was the era
of the management information system (MIS), where thick wads of paper
were routninely filed in the trash can.

The lesson of MIS is that management decision making is not inhibited
by a lack of information. Rather,  according to Ackoff (1967), it is
confused by an _excess of irrelevant information_.  This was
true in the sixties and now, in the age of the Internet, it is doubly true. As
Mitch Kapor said in his famous quote:

> "Getting information off the Internet is like taking a drink from a
fire hydrant.”

Too much data can overload a decision maker with too many
irrelevancies. Data must be condensed, before it is useful for supporting
decisions.  Modern decision-support systems evolved to filter useless
information to deliver relevant information (a subset of all information)
to the manager.

Enter data mining. Decades of research has resulted in five methods for
pruning irrelevant data.  Given a table of rows and columns, they they
can be pruned as follows:

* _Cohen_ pruning:  ignore trivial differences between the numbers;

* _Cluster_ pruning: group related rows together and then use one
representative from each group.

* _Cut_ pruning: find which parts of each column are found in each
cluster; ignore those parts.

* _Context_ pruning:  To improve your current situation: (1)find your
home cluster (your current situation); (2)look for a neighboring cluster
where things are better; then (3)just search that neighbor for ways to
improve your current situation.

* _Contrast_ pruning: To find ways to improve things, (1)divide the
data into the parts you like and the parts you hate; (2) build rules
that list the delta between them.

To be accurate, there are more ways than the above. But these five can
be built quickly, can run very quickly, and scale to very large data sets.
Let me show you how!

References
----------

*Ackoff, 1967:* Ackoff, R.L., Management Misinformation Systems Management
Science, 1967.

*Larkin, 1980:* Larkin, J., J. McDermott, D.P. Simon, and H.A. Simon,
Expert and Novice Performance in Solving Physics Problems Science,
1980. 208(20 June): p. 1335-1342.  (December): p. 319-331
