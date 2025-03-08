# DSL Syntax

Comments begin with a `#` and end at the next newline:

```
# This is a comment
```

Meta data can be provided with particular keywords:

```
title "My title here"
```

Quoting strings is usually optional, for example these are the same:

```
title "My title here"
title My title here
title "My title" here
title "My" "title" "here"
```

Each non-metadata line represents a step in the sequence, in order.

```
# Draw an arrow from agent "Foo Bar" to agent "Zig Zag" with a label:
# (implicitly creates the agents if they do not already exist)

Foo Bar -> Zig Zag: Do a thing

# With quotes, this is the same as:

"Foo Bar" -> "Zig Zag": "Do a thing"
```

Blocks surround steps, and can nest:

```
if something
  Foo -> Bar
else if something else
  Foo -> Baz
  if more stuff
    Baz -> Zig
  end
end
```

(indentation is ignored)
