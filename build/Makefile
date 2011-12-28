x=csv
uses=misc getline
 
Dirs=var
Date=$(shell date)
File=$(shell git log --pretty=format:'' | wc -l)
All=var/$x-$(File)
Cake=$(MAKE) -B ready $(All)

MAKEFLAGS = -s

run :  all
	@time node ./$(All).js

edit :
	emacs -q -l etc/dotemacs `ls -t *.coffee | head -1` &

all : $(patsubst %,lib/%.coffee,$(uses)) $x.coffee
	bash etc/header.sh  "$x" "$(All)" "$(Date)" $^ > $(All)
	coffee -c $(All)
	chmod +x $(All) $(All).js
	git  add $(All) 
	git add $(All).js
	echo $(All)

commit :
	cd .. ; \
    git commit -a -m stuff; \
	git push origin  master

update :
	cd .. ; git pull origin master 

ready :
	mkdir -p $(Dirs)

csv   :; $(MAKE) d=basics x=$@ uses="globals getline" 
csv2  :; $(MAKE) d=basics x=$@ uses="globals getline" 
arffs :; $(MAKE) d=basics x=$@ uses="globals getline"  
arffs2:; $(MAKE) d=basics x=$@ uses="globals getline"  
stats :; $(MAKE) d=basics x=$@ uses="globals getline stats" 
col   :; $(MAKE) d=basics x=$@ uses="globals getline stats col" 
nb    :; $(MAKE) d=basics x=$@ uses="globals rand getline stats col"  
shuffle:;$(MAKE) d=basics x=$@ uses="globals rand"  
