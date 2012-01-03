# CoffeeScript fork of Showdown (a JavaScript port of Markdown).
# usage
# html=(require "./showdown").Showdown.makeHtml
#
#
# Copyright (c) 2011 David Chambers.
#
# Original Showdown Copyright (c) 2007 John Fraser.
#
# Original Markdown Copyright (c) 2004-2005 John Gruber
#   <http://daringfireball.net/projects/markdown/>.
#
# Redistributable under a BSD-style open source license.
#
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
#
# Showdown usage:
#
#     var showdown = new Showdown()
#     showdown.convert("Markdown *rocks*.")
#     --> "<p>Markdown <em>rocks</em>.</p>"
#
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

# "Global" variables.
urls = {}
titles = {}
blocks = []
# Used to track when we're inside an ordered or unordered list
# (see `Text::processListItems` for details).
level = 0

extensions = []

Showdown = (@extensions...) ->

window?.Showdown = Showdown # browser
exports?.Showdown = Showdown # CommonJS

Showdown.Text = -> Text

processors = []

# Registers an extension.
Showdown.register = (name, preprocessor, processor) ->
  processors.push [name, preprocessor, processor]

# Converts Markdown to HTML.
Showdown::convert = (text) ->
  # Clear the global hashes. If we don't clear these, you get conflicts from
  # other articles when generating a page which contains more than one article
  # (for example an index page that displays the N most recent articles).
  urls = {}
  titles = {}
  blocks = []

  new Text(text)
    # _attacklab:_ Replace `~` with `~T`. This lets us use tilde as an
    # escape character to avoid md5 hashes. The choice of character is
    # arbitrary; anything that isn't magic in Markdown will work.
    .replace(/~/g, '~T')

    # _attacklab:_ Replace `$` with `~D`. `RegExp` interprets `$` as a
    # special character when it's in a replacement string.
    .replace(/\$/g, '~D')

    # Standardize line endings.
    .replace(/\r\n?/g, '\n')

    .detab()
    .trim(/^ +$/mg)
    .before('\n\n')
    .after('\n\n')
    .hashHtmlBlocks()
    .preprocess()
    .stripLinkDefinitions()
    .runBlockGamut()
    .unescapeSpecialChars()
    .replace(/~D/g, '$$') # attacklab: restore dollar signs
    .replace(/~T/g, '~') # attacklab: restore tildes
    .after('\n')
    .value

class Text
  constructor: (@value) ->

  cond: (cond, fn1, fn2) ->
    if cond then fn1.call @ else fn2?.call @
    @

  before: (text) ->
    @set text + @value

  after: (text) ->
    @set @value + text

  replace: (pattern, repl) ->
    @set @value.replace pattern, repl

  trim: (pattern = /^\n+|\n+$/g) ->
    @replace pattern, ''

  quot: ->
    @replace /"/g, '&quot;'

  set: (text) ->
    @value = text
    @

  log: ->
    console.log @value
    @

  toString: ->
    @value

  # Performs preprocessing for each of the active extensions.
  preprocess: ->
    for [name, preprocessor], index in processors
      if name in extensions
        processors[index][3] = preprocessor.call @
    @

  # Performs further processing for each of the active extensions. Data
  # returned earlier by the preprocessor is passed on to the processor.
  process: ->
    for [name, preprocessor, processor, data] in processors
      if name in extensions
        processor.call @, data
    @

  # Strips link definitions from text and stores them in `urls` and `titles`.
  stripLinkDefinitions: ->
    # Link definitions are in the form: `^[id]: url "optional title"`.
    @replace(
      ///
      ^ \x20{0,3}
        \[(.+)\]:
        [\x20\t]*\n?[\x20\t]*
        <?(\S+?)>?
        [\x20\t]*\n?[\x20\t]*
        (?:(\n*)["(](.+?)[")][\x20\t]*)?
        (?:\n+|\Z)
      ///gm,
      (_, m1, m2, m3, m4) ->
        m1 = m1.toLowerCase() # link identifiers are case-insensitive
        urls[m1] = new Text(m2).encodeAmpsAndAngles().value

        # Oops, found blank lines, so it's not a title.
        # Put back the parenthetical statement we stole.
        return m3 + m4 if m3

        titles[m1] = new Text(m4).quot().value if m4

        # Completely remove the definition from the text.
        ''
    )

  # Hashifies HTML blocks.
  #
  # We only want to do this for block-level HTML tags, such as headings,
  # lists, and tables. That's because we still want to wrap `<p>`s around
  # "paragraphs" that are wrapped in non-block-level tags, such as anchors,
  # phrase emphasis, and spans. The list of tags we're looking for is
  # hard-coded.
  #
  # First, look for nested blocks, for example:
  #
  #     <div>
  #       <div>
  #         Tags for inner block must be indented.
  #       </div>
  #     </div>
  #
  # The outermost tags must start at the left margin for this to match, and
  # the inner nested divs must be indented.
  #
  # We need to do this before the next, more liberal match, because the next
  # match will start at the first `<div>` and stop at the first `</div>`.
  hashHtmlBlocks: ->
    # _attacklab:_ Double up blank lines to reduce lookaround.
    @replace(/\n/g, '\n\n')

    # _attacklab:_ This regex can be expensive when it fails.
    .replace(
      ///
      ^ (
          <
          (
            p|div|h[1-6]|blockquote|pre|table|dl|ol|ul
            |script|noscript|form|fieldset|iframe|math
            |ins|del
          )
          \b[^\r]*?\n
          </\2>
          [\x20\t]*(?=\n+)
        )
      ///gm,
      hashElement
    )
    # Now match more liberally, simply from `\n<tag>` to `</tag>\n`.
    .replace(
      ///
      ^ (
          <
          (
            p|div|h[1-6]|blockquote|pre|table|dl|ol|ul
            |script|noscript|form|fieldset|iframe|math
          )
          \b[^\r]*?.*
          </\2>
          [\x20\t]*(?=\n+)
        )
      ///gm,
      hashElement
    )
    # Special case for `<hr />`. It was easier to make a special case than to
    # make the other regex more complicated.
    .replace(
      /(\n[ ]{0,3}(<(hr)\b([^<>])*?\/?>)[ \t]*(?=\n\n))/g,
      hashElement
    )
    # Special case for standalone HTML comments.
    .replace(
      /(\n\n[ ]{0,3}<!(--[^\r]*?--\s*)+>[ \t]*(?=\n\n))/g,
      hashElement
    )
    # _attacklab:_ Undo double lines (see comment at top of this function).
    .replace(/\n\n/g, '\n')

  # Transformations that form block-level tags such as paragraphs, headings,
  # and list items.
  runBlockGamut: ->
    key = new Text('<hr />').hashBlock().value
    @doHeaders()
    # Horizontal rules.
    .replace(/^[ ]{0,3}([*_-])[ ]?(?:\1[ ]?){2,}[ \t]*$/gm, key)

    .doLists()
    .doCodeBlocks()
    .doBlockQuotes()

    # We ran `Text::hashHtmlBlocks` before, in `Showdown::convert`, but that
    # was to escape raw HTML in the original Markdown source. This time we're
    # escaping the markup we've just created, so that we don't wrap `<p>` tags
    # around block-level tags.
    .hashHtmlBlocks()
    .formParagraphs()

  # Transformations _within_ block-level tags such as paragraphs, headings,
  # and list items.
  runSpanGamut: ->
    @doCodeSpans()
    .escapeSpecialCharsWithinTagAttributes()
    .encodeBackslashEscapes()
    .doImages()
    .doAnchors()
    .doAutoLinks()
    .encodeAmpsAndAngles()
    .doItalicsAndBold()
    .replace(/[ ]{2,}\n/g, ' <br />\n') # do hard breaks
    .process()

  # Within tags -- meaning between `<` and `>` -- encode `` \ ``, `` ` ``,
  # `` * ``, and `` _ `` so they don't conflict with their use in Markdown
  # for code, italics and strong.
  escapeSpecialCharsWithinTagAttributes: ->
    @replace(
      ///
        <[a-z/!$]("[^"]*"|'[^']*'|[^'">])*>
        |
        <!(--.*?--\s*)+>
      ///gi,
      (match) ->
        new Text(match)
          .replace(/(.)<\/?code>(?=.)/g, '$1`')
          .escapeCharacters('\\`*_')
    )

  # Turn Markdown link shortcuts into XHTML `<a>` tags.
  doAnchors: ->
    # First, handle reference-style links: `[link text] [id]`.
    @replace(
      ///
        \[
        ((?:\[[^\]]*\]|[^\[\]])*)
        \]
        \x20?(?:\n\x20*)?
        \[
        (.*?)
        \]
        ()()()()
      ///g,
      writeAnchorTag
    )
    # Next, inline-style links: `[link text](url "optional title")`.
    .replace(
      ///
        \[
        ((?:\[[^\]]*\]|[^\[\]])*)
        \]
        \(
        [\x20\t]*()<?(.*?)>?[\x20\t]*
        (([\x27\x22])(.*?)\5[\x20\t]*)? # be nice to Pygments/Docco
        \)
      ///g,
      writeAnchorTag
    )
    # Last, handle reference-style shortcuts: `[link text]`. These must come
    # last in case you've also got `[link test][1]` or `[link test](/foo)`.
    .replace(
      /\[([^\[\]]+)\]()()()()()/g,
      writeAnchorTag
    )

  # Turn Markdown image shortcuts into `<img>` tags.
  doImages: ->
    # First, handle reference-style labeled images: `![alt text][id]`.
    @replace(
      /!\[(.*?)\][ ]?(?:\n[ ]*)?\[(.*?)\]()()()()/g,
      writeImageTag
    )
    # Next, handle inline images: `![alt text](url "optional title")`.
    # Don't forget: encode `*` and `_`.
    .replace(
      ///
        !\[(.*?)\]\s?
        \(
        [\x20\t]*()<?(\S+?)>?[\x20\t]*
        (([\x27\x22])(.*?)\5[\x20\t]*)? # be nice to Pygments/Docco
        \)
      ///g,
      writeImageTag
    )

  doHeaders: ->
    sub = (text, tag) ->
      new Text(text)
        .runSpanGamut()
        .before("<#{tag}>")
        .after("</#{tag}>")
        .hashBlock()

    # Setext-style headings.
    @replace(
      /^(?![ ]{0,3}-[ \t])(.+)[ \t]*\n(?:(=+)|-+)[ \t]*\n+/gm,
      (_, m1, h1) -> sub m1, if h1 then 'h1' else 'h2'
    )
    # atx-style headings.
    .replace(
      /^(#{1,6})[ \t]*(.+?)[ \t]*#*\n+/gm,
      (_, m1, m2) -> sub m2, 'h' + m1.length
    )

  # Form HTML ordered (numbered) and unordered (bulleted) lists.
  doLists: ->
    # _attacklab:_ Add sentinel to hack around
    # [khtml/safari bug](https://bugs.webkit.org/show_bug.cgi?id=11231).
    @after('~0')
    .cond(
      level,
      ->
        @replace(
          ///
          ^ \x20{0,3}
            (?:([*+-])|\d+[.])
            [\x20\t]+[^\r]+?
            (?:~0|\n\n+(?=\S)(?![\x20\t]*(?:[*+-]|\d+[.])[\x20\t]+))
          ///gm,
          (list, unordered) ->
            tag = if unordered then 'ul' else 'ol'
            # Turn double returns into triple returns, so that we can make a
            # paragraph for the last item in a list, if necessary.
            result = processListItems list.replace /\n\n+/g, '\n\n\n'

            # Trim any trailing whitespace, to put the closing `</ol>`/`</ul>`
            # up on the preceding line, to get it past the current stupid HTML
            # block parser. This is a hack to work around the terrible hack
            # that is the HTML block parser.
            "<#{tag}>\n#{result.replace /\s+$/, ''}\n</#{tag}>\n"
        )
      ->
        @replace(
          ///
            (\n\n|^\n?)
            (
              \x20{0,3}
              (?:([*+-])|\d+[.])
              [\x20\t]+[^\r]+?
              (?:~0|\n\n+(?=\S)(?![\x20\t]*(?:[*+-]|\d+[.])[\x20\t]+))
            )
          ///g,
          (_, runup, list, unordered) ->
            tag = if unordered then 'ul' else 'ol'

            # Turn double returns into triple returns, so that we can make a
            # paragraph for the last item in a list, if necessary.
            list = list.replace /\n\n+/g, '\n\n\n'

            "#{runup}<#{tag}>\n#{processListItems list}</#{tag}>\n"
        )
    )
    .trim /~0/ # attacklab: strip sentinel

  # Process Markdown `<pre><code>` blocks.
  doCodeBlocks: ->
    @replace(
      ///
        (?:\n\n|^)
        ((?:(?:\x20{4}|\t).*\n+)+)
        (
          \n*\x20{0,3}[^\x20\t\n]
          |
          $
        )
      ///g,
      (_, codeblock, nextChar) ->
        new Text(codeblock)
          .outdent()
          .encodeCode()
          .detab()
          .trim()
          .before('<pre><code>')
          .after('\n</code></pre>')
          .hashBlock()
          .after(nextChar)
    )

  hashBlock: ->
    @set "\n\n~K#{blocks.push(@trim().value) - 1}K\n\n"

  doCodeSpans: ->
    @replace(
      /(^|[^\\])(`+)([^\r]*?[^`])\2(?!`)/gm,
      (_, m1, m2, c) ->
        new Text(c)
          .trim(/(^[ \t]+|[ \t]+$)/g)
          .encodeCode()
          .before(m1 + '<code>')
          .after('</code>')
    )

  # Encode/escape certain characters inside Markdown code runs. The point
  # is that in code, these characters are literals, and lose their special
  # Markdown meanings.
  encodeCode: ->
    # Encode all ampersands (HTML entities are
    # not entities within a Markdown code span).
    @replace(/&/g, '&amp;')
    # Do the angle bracket song and dance.
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

    .escapeCharacters('*_{}[]\\')

  doItalicsAndBold: ->
    # `<strong>` must go first.
    @replace(
      /(\*\*|__)(?=\S)([^\r]*?\S[*_]*)\1/g,
      '<strong>$2</strong>'
    )
    .replace(
      /(\*|_)(?=\S)([^\r]*?\S)\1/g,
      '<em>$2</em>'
    )

  doBlockQuotes: ->
    @replace(/(^[ \t]*>[ \t]?.+\n(.+\n)*\n*)+/gm, (blockquote) ->
      new Text(blockquote)
        .trim(/^[ \t]*>[ \t]?/gm) # trim one level of quoting
        .trim(/^[ \t]+$/gm)       # trim whitespace-only lines
        .runBlockGamut()
        .before('<blockquote>\n')
        .after('\n</blockquote>')
        .hashBlock()
    )

  formParagraphs: ->
    grafs = []

    # Wrap `<p>` tags.
    for str in @trim().value.split /\n\n+/g
      if /~K\d+K/g.test str # if this is an HTML marker, copy it
        grafs.push str
      else if /\S/.test str
        grafs.push(
          new Text(str)
            .runSpanGamut()
            .replace(/^[ \t]*/, '<p>')
            .after('</p>')
        )

    # Unhashify HTML blocks.
    for value, index in grafs
      # If this is a marker for an html block...
      while /~K(\d+)K/.test grafs[index]
        grafs[index] =
          grafs[index].replace(
            /~K\d+K/,
            blocks[RegExp.$1].replace /\$/g, '$$$$'
          )

    @set grafs.join '\n\n'

  # Smart processing for ampersands and angle brackets that must be encoded.
  encodeAmpsAndAngles: ->
    # Ampersand-encoding based entirely on Nat Irons's
    # [Amputator MT plugin](http://bumppo.net/projects/amputator/).
    @replace(/&(?!#?[xX]?(?:[0-9a-fA-F]+|\w+);)/g, '&amp;')

    # Encode naked `<`s.
    .replace(/<(?![a-z\/?\$!])/gi, '&lt;')

  encodeBackslashEscapes: ->
    @replace(/\\(\\)/g, escapeCharacters_callback)
    .replace(/\\([`*_{}\[\]()>#+-.!])/g, escapeCharacters_callback)

  doAutoLinks: ->
    @replace(
      /<((https?|ftp|dict):[^'">\s]+)>/gi,
      '<a href="$1">$1</a>'
    )
    .replace(
      /<(?:mailto:)?([-.\w]+\@[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+)>/gi,
      (_, m1) -> encodeEmailAddress new Text(m1).unescapeSpecialChars().value
    )

  # Swap back in all the special characters we've hidden.
  unescapeSpecialChars: ->
    @replace /~E(\d+)E/g, (_, m1) -> String.fromCharCode parseInt m1, 10

  # Remove one level of line-leading tabs or spaces.
  outdent: ->
    @replace(/^(\t|[ ]{1,4})/gm, '~0').trim /~0/g # attacklab: clean up hack

  # _attacklab:_ Completely rewritten for speed. In Perl we could fix it by
  # anchoring the regexp with `\G`. In JavaScript we're less fortunate.
  detab: ->
    # Expand first n-1 tabs.
    @replace(/\t(?=\t)/g, '    ')

    # Replace the nth with two sentinels.
    .replace(/\t/g, '~A~B')

    # Use the sentinel to anchor our regex so it doesn't explode.
    .replace(
      /~B(.+?)~A/g,
      (_, leadingText) ->
        numSpaces = 4 - leadingText.length % 4
        leadingText += new Array(numSpaces + 1).join ' ' if numSpaces > 0
        leadingText
    )
    .replace(/~A/g, '    ').trim /~B/g # clean up sentinels

  escapeCharacters: (charsToEscape) ->
    # First we have to escape the escape characters so that we can build a
    # character class out of them.
    @replace(
      new RegExp("([#{charsToEscape.replace /[[\\\]]/g, '\\$&'}])", 'g'),
      escapeCharacters_callback
    )

hashElement = (_, blockText) ->
  blockText = new Text(blockText).trim().replace /\n\n/g, '\n'

  # Replace the element text with a marker (`~KxK` where `x` is its key).
  "\n\n~K#{blocks.push(blockText) - 1}K\n\n"

writeAnchorTag = (match, link_text, link_id, url, m5, m6, title) ->
  link_id = link_id.toLowerCase()

  if not url
    # Lower-case and turn embedded newlines into spaces.
    link_id or= link_text.toLowerCase().trim /[ ]?\n/g
    url = '#' + link_id

    if urls[link_id] is undefined
      if /\(\s*\)$/m.test match
        # Special case for explicit empty url.
        url = ''
      else
        return match
    else
      url = urls[link_id]
      title = titles[link_id] unless titles[link_id] is undefined

  new Text(url)
    .escapeCharacters('*_')
    .before('<a href="')
    .cond(title, ->
      @after('" title="' + new Text(title).quot().escapeCharacters('*_'))
    )
    .after('">' + link_text + '</a>')

writeImageTag = (match, alt_text, link_id, url, m5, m6, title) ->
  link_id = link_id.toLowerCase()

  if url is ''
    if link_id is ''
      # Lower-case and turn embedded newlines into spaces.
      link_id = alt_text.toLowerCase().replace /[ ]?\n/g, ' '

    url = '#' + link_id

    return match if urls[link_id] is undefined

    url = urls[link_id]
    title = titles[link_id]

  new Text(url)
    .escapeCharacters('*_')
    .before('<img src="')
    .after('" alt="' + new Text(alt_text).quot() + '"')
    .cond(title, ->
      @after(' title="' + new Text(title).quot().escapeCharacters('*_') + '"')
    )
    .after(' />')

# Process the contents of a single ordered or unordered list, splitting it
# into individual list items.
processListItems = (list_str) ->
  # `level` keeps track of when we're inside a list. Each time we enter a
  # list, we increment it; when we leave a list, we decrement. If it's zero,
  # we're not in a list anymore.
  #
  # We do this because when we're not inside a list, we want to treat
  # something like this...
  #
  #     I recommend upgrading to version
  #     8. Oops, now this line is treated
  #     as a sub-list.
  #
  # as a single paragraph, despite the fact that the second line starts
  # with a digit-period-space sequence.
  #
  # Whereas when we're inside a list (or sub-list), that line will be
  # treated as the start of a sub-list.

  level++
  list_str = "#{list_str.replace /\n\n+$/, '\n'}~0".replace(
    ///
      (\n)?
      (^[\x20\t]*)
      (?:[*+-]|\d+[.])
      [\x20\t]+
      (
        [^\r]+?
        (\n{1,2})
      )
      (?=\n*(~0|\2([*+-]|\d+[.])[\x20\t]+))
    ///gm,
    (_, leading_line, leading_space, item) ->
      new Text(item)
        .outdent()
        .cond(
          leading_line or /\n\n/.test(item),
          -> @runBlockGamut()
          -> @doLists().trim(/\n$/).runSpanGamut() # recursion for sub-lists
        )
        .before('<li>')
        .after('</li>\n')
  )
  level--
  list_str.replace /~0/g, '' # attacklab: strip sentinel

# _attacklab:_ Why can't JavaScript speak hex?
char2hex = (chr) ->
  dec = chr.charCodeAt 0
  hexDigits = '0123456789ABCDEF'
  hexDigits.charAt(dec >> 4) + hexDigits.charAt(dec & 15)

# Each character of the address is encoded as either a decimal or hex entity,
# in the hopes of foiling most address harvesting spam bots.
#
# For example:
#
#     <a href="&#x6D;&#97;&#105;&#108;&#x74;&#111;:
#       &#102;&#111;&#111;&#64;&#101;x&#x61;&#109;
#       &#x70;&#108;&#x65;&#x2E;&#99;&#111;&#109;">
#         &#102;&#111;&#111;&#64;&#101;x&#x61;&#109;
#         &#x70;&#108;&#x65;&#x2E;&#99;&#111;&#109;
#     </a>
#
# Based on a filter by Matthew Wickline, posted to the BBEdit-Talk
# mailing list.
encodeEmailAddress = (addr) ->
  encode = [
    (chr) -> "&##{chr.charCodeAt 0};"
    (chr) -> "&#x#{char2hex chr};"
  ]
  addr = "mailto:#{addr}".replace(/./g, (chr) ->
    switch chr
      # Leave ":" alone (to spot `mailto:` later).
      when ':' then chr
      # This *must* be encoded. I insist.
      when '@' then encode[+(Math.random() > 0.5)] chr
      # Roughly 10% raw, 45% dec, 45% hex.
      else
        r = Math.random()
        if r > 0.9 then chr else encode[+(r > 0.45)] chr
  )
  "<a href=\"#{addr}\">#{addr.replace /.+:/, ''}</a>"

escapeCharacters_callback = (_, chr) ->
  "~E#{chr.charCodeAt 0}E"
