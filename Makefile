x=csv
uses=misc getline
 
Dirs=var
Date=$(shell date)
File=$(shell git log --pretty=format:'' | wc -l)
All=var/$x-$(File)
Cake=$(MAKE) -B ready $(All)

MAKEFLAGS = -s

run :  all
	./$(All)

all : $(patsubst %,lib/%.cof,$(uses)) $x.cof
	bash etc/header.sh  "$x" "$(All)" "$(Date)" $^ > $(All)
	chmod +x $(All)
	coffee -c $(All)
	git  add $(All)
	git add $(All).js
	echo $(All)

commit :
	git commit -a -m stuff
	git push origin master

update :
	git pull origin master 

ready :
	mkdir -p $(Dirs)

csv   :; $(MAKE) x=$@ uses="globals getline" 
csv2  :; $(MAKE) x=$@ uses="globals getline" 
arffs :; $(MAKE) x=$@ uses="globals getline"  
arffs2:; $(MAKE) x=$@ uses="globals getline"  
stats :; $(MAKE) x=$@ uses="globals getline stats" 
col   :; $(MAKE) x=$@ uses="globals getline stats col" 
nb    :; $(MAKE) x=$@ uses="globals getline stats col"  