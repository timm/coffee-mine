cat - |
gawk '/^###/ { In = 1 - In; 
               if (In) print "<pre class=\"brush: javascript\">" 
		       if (!In) print "</pre>"
	           next
             }
             { print } '
