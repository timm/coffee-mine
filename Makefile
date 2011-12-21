x=csv
uses=misc getline
 
Dirs=var
Date=$(shell date)
File=$(shell git log --pretty=format:'' | wc -l)
All=var/$x-$(File)
Cake=$(MAKE) -B ready $(All)

MAKEFLAGS = -s

run : $(patsubst %,lib/%.cof,$(uses)) $x.cof
	echo ">> $^ $(File)"
	bash etc/header.sh  "$x" "$(All)" "$(Date)" $^ > $(All)
	chmod +x $(All)
	git  add $(All)
	echo $(All)
	./$(All)

commit :
	git commit -a -m stuff
	git push origin master

ready :
	mkdir -p $(Dirs)

csv : ; $(MAKE) x=$@ uses="globals getline" 
arffs:; $(MAKE) x=$@ uses="globals getline"  
arffs2:;$(MAKE) x=$@ uses="globals getline"  
stats:; $(MAKE) x=$@ uses="globals getline stats" 
