# Basics

## Titles

It is the same to the title of HTML, it has 6 levels of titles.
The title starts with ``#`` symbol, and the count of ``#`` symbol means the level of title.

```markdown
# First Level
## Second Level
### Third Level
#### Fourth Level
##### Fifth Level
###### Sixth Level
```
# First Level
## Second Level
### Third Level
#### Fourth Level
##### Fifth Level
###### Sixth Level

- - -

## Inline Styles

```markdown
##Bold##
``Code``
__Underlined__
//Italic//
--Deleted--
::Dimmed::
,,Subscript,,
''Superscript''
$$e = mc^2$$
```
##Bold##
``Code``
__Underlined__
//Italic//
--Deleted--
::Dimmed::
,,Subscript,,
''Superscript''
$$e = mc^2$$

- - -

## Divider

```markdown
- - -
* * *
```

- - -
* * *

- - -

## Quote

```markdown
> Quoted content
```
> Quoted content

### 强调

Create a emphasis block with ``[Emphasis Type]+Emphasis Title`` for the first line.

> [tip]
> The emphasis will use the default title if the emphasis title is left blank.

The emphasis type is as follows (case insensitive):
- note | 笔记
- important | 重要
- tip | 提示
- warning | 注意
- caution | 警告

```markdown
> [note] Note
> Note content...

> [important] important
> Important content...

> [tip]
> Tips content...

> [warning]
> Warning content...

> [Caution] Caution
> Caution content...
```

> [note] Note
> Note content...

> [important] important
> Important content...

> [tip]
> Tips content...

> [warning]
> Warning content...

> [Caution] Caution
> Caution content...

- - -

## Links

```markdown
<!-- External Links -->
[GitHub](https://github.com)
[https:\/\/github.com](https://github.com)
<!-- Internal Links -->
[English Documentation Directory](English/)
[English Syntax Tutorials Directory](English/Syntax Tutorials/)
```
[GitHub](https://github.com)
[https:\/\/github.com](https://github.com)
[English Documentation Directory](English/)
[English Syntax Tutorials Directory](English/Syntax Tutorials/)

- - -

## Images

```markdown
<!-- External Image -->
![Test Image](https://fastly.picsum.photos/id/251/200/200.jpg?hmac=_yKttpPQLBisFkKPMRolKUyfZ89QQpENncPdrg8a1J0)
<!-- Internal Image -->
![Test Image](.resources/test-image.jpg)
```
![Test Image](https://fastly.picsum.photos/id/251/200/200.jpg?hmac=_yKttpPQLBisFkKPMRolKUyfZ89QQpENncPdrg8a1J0)
![Test Image](.resources/test-image.jpg)

##PS: To use internal images, it is required to create a directory with any name starting with the ``.`` symbol in the same directory as the blog file, and store the image files in it.##

- - -

## Lists

Unordered Lists:
```markdown
+ Apple
+ Orange
+ Banana
- Apple
- Orange
- Banana
```
+ Apple
+ Orange
+ Banana
- Apple
- Orange
- Banana

Ordered Lists:
```markdown
1. Apple
2. Orange
3. Banana
```
1. Apple
2. Orange
3. Banana

Nested Lists:
```markdown
1. Fruits
    - Apple
    - Orange
2. Vegetables
    - Potato
    - Carrots
```
1. Fruits  
    - Apple
    - Orange
2. Vegetables
    - Potato
    - Carrots

Task List:
```markdown
- [ ] Unfinished task
- [x] Finished task
- [*] Finished task
    - [ ] Unfinished task
    - [x] Finished task
    - [*] Finished task
```
- [ ] Unfinished task
- [x] Finished task
- [*] Finished task
    - [ ] Unfinished task
    - [x] Finished task
    - [*] Finished task


- - -

## East Asian Phonetic Transcription

```markdown
{汉字}(han zi) {漢字}(kanji)
```
{汉字}(han zi) {漢字}(kanji)

