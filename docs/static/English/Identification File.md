# Identification file

There are two identification files with special file name in the ``static`` directory.

## Directory Description

If a file named ``README.md`` or ``readme.md`` is created in the directory of ``static/`` (includes ``static/`` itself), this file will be the description file of the directory. In the front view, you will see the content of this file when you opened this directory and it will not be shown in the file list.

## Files Order Reversing

The files are defaultly ordered by their creating time, that is, the file that is latest created will be the top. However, for some situation, such as tutorial writing, it is required to sort the earliest at the top. That is the time to reverse the file order,

It is easy to reverse the order for a specific directory, just create a file named ``rev`` in the target directory.

- - -

##PS: it is required to run the command ``npm run build`` after the two identification files are created.##
