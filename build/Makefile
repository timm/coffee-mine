x=csv
uses=misc getline
d=../basics
  
Dirs=var
Date=$(shell   date)
File=$(shell git log --pretty=format:'' | wc -l)
Pub=$d/$x
Var=var/$x-$(File)

MAKEFLAGS = -s

run :  all
	@time -p node ./$(Pub).js

edit :
	emacs -q -l etc/dotemacs `ls -t *.coffee | head -1` &

all : $(patsubst %,lib/%.coffee,$(uses)) $x.coffee
	bash etc/header.sh  "$x" "$(Var)" "$(Date)" $^ > $(Var)
	cp $(Var) $(Pub)
	coffee -c $(Pub)    ; coffee -c $(Var) 
	chmod  +x $(Pub) $(Pub).js $(Var) $(Var).js
	git   add $(Pub)    ; git   add $(Var) 
	git   add $(Pub).js ; git   add $(Var).js
	echo      $(Pub)

commit :
	cd .. ; \
    git commit -a ; \
	git push origin  master

update :
	cd .. ; git pull origin master 

ready :
	mkdir -p $(Dirs)
	git config --global merge.tool vimdiff

csv   :; $(MAKE) d="../easy" x=$@ uses="globals getline" 
csv2  :; $(MAKE) d="../easy" x=$@ uses="globals getline" 
arffs :; $(MAKE) d="../easy" x=$@ uses="globals getline"  
arffs2:; $(MAKE) d="../easy" x=$@ uses="globals getline"  
stats :; $(MAKE) d="../easy" x=$@ uses="globals getline stats" 
col   :; $(MAKE) d="../easy" x=$@ uses="globals getline stats col" 
nb    :; $(MAKE) d="../harder" x=$@ uses="globals rand getline stats col"  
shuffle:;$(MAKE) d="../easy" x=$@ uses="globals rand"  
bootstrap:;$(MAKE) d="../easy" x=$@ uses="globals rand stats bootstrap"  
abcd  :; $(MAKE) d="../easy" x=$@ uses="globals abcd"  