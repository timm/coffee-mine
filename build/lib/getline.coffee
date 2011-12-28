fs = require "fs"

errorWrapper = (action) ->
  (err, args...) ->
    if err then throw err
    action args...

ifFileExists = (filename, action) ->
   fs.stat filename, errorWrapper (stat) ->
     if stat.isFile() then action()

getFileAsLines = (filename, action) ->
   ifFileExists filename, ->
     fs.readFile filename, "utf8",
       errorWrapper (content) ->
         action content.split "\n"
