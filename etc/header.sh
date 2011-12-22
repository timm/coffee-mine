cat<<EOF
#!/usr/bin/env coffee
# Copyright (c) 2011,2012 Tim Menzies, MIT License
EOF
banner $1 | sed 's/^/# /' 
cat<<EOF
# Version ....... : `basename $2`
# Built ......... : $3
# License ....... : see below.
# Installation .. : see below.
# Report bugs ... : https://github.com/timm/coffee-mine/issues
# For doco ...... : read http://coffee-mine.blogspot.com around $3

EOF

shift 3
echo " "
for i in $*;do
  echo "#--| $i |-------------------------------------------------------------"
  echo " "
  cat $i
  echo " "
done 


cat<<EOF
# CREDITS
# =======
# 
# Tim Menzies tim@menzies.us
# 
# INSTALL
# =======
# 
# 0)  Essential first step: make yourself a cup of coffee.
# 1)  Install coffee on your local machine.
# 
# 2)  Download this file and call it, say,  '$1'.
#     2a) Optional (UNIX systems only)
# 
#        chmod +x $1  # <=== On UNIX systems
# 
# 3)  Look for 'data/' in this file. Usually, its the last few
#     lines of code (above). If you see any reference to such 
#     a data file, then...
#     3a) Download those data files from
#         http://now.unbox.org/all/trunk/doc/coffee-mine/data
#     3b) Edit this file so it points to those data files.
# 
# 4)  See if this file runs:
# 
#         ./$1         # <=== UNIX systems
#         coffee $1    # <=== for other systems
# 
# To check if it is running correctly, see 
# http://coffee-mine.blogspot.com (look for blogs entries 
# around $3).
# 
# COPYRIGHT
# ---------
# 
# Permission is hereby granted, free of charge, to any person obtaining a
# copy of this software and associated documentation files (the "Software"),
# to deal in the Software without restriction, including without limitation
# the rights to use, copy, modify, merge, publish, distribute, sublicense,
# and/or sell copies of the Software, and to permit persons to whom the
# Software is furnished to do so, subject to the following conditions:
# 
# The above copyright notice and this permission notice shall be included
# in all copies or substantial portions of the Software.
# 
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
# THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR
# OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
# ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
# OTHER DEALINGS IN THE SOFTWARE.
# 
EOF
