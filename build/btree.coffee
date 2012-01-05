class X
  constructor: (@key,@value) ->

class Btree
  @key = @left = @right = @extra = null

  asTree:(l) ->
    l = l.sort ((x,y) -> x.key > y.key)
    @asTree1(l,0,l.length - 1)

  asTree1: (l,min,max) ->
    mid    = Math.floor((min + max ) / 2)
    @key   = l[mid]
    if min < max
      @left  = new Btree
      @right = new Btree
      @left.asTree1( l, min,   mid)
      @right.asTree1(l, mid+1, max)

  show: (indent="",prefix="= ",add="|   ") ->
    console.log \
      "#{indent}#{prefix} [#{@key.key}: #{@key.value}]"
    @left.show  indent+add,"<= ",add if @left
    @right.show indent+add,">  ",add if @right

b1 = new Btree
new X 10,1
b1.asTree [
  new X 10,1
  new X 11,2
  new X 12,1.5
  new X 13,2
  new X 14,10
  new X 15,10.1
  new X 16,9.9
  ]
b1.show()