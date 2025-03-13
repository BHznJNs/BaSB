# Create Your First Blog

After you installed this project successfully, you need to delete the all files in the ``static`` directory (which are markdown source files of this documentation).

It is easy to create a blog:

1. Create a markdown file named ``FirstBlog.md`` (it can be any file with ``.md`` at the end), write something in it
2. Run the command ``npm run build`` to build
3. Run the command ``npm run preview`` to start the preview server

After the preview server is started, there will be something in your terminal like this:
```
Listening: http://localhost:3000/preview/
Listening: http://192.168.2.104:3000/preview/
```
Open one of them in your browser, and you can see the front view of the project.

## Categorizing

You can directly create directory in the ``static`` folder (the ``+`` symbol is not recommended to be in the name of directory) to categorize the blogs. After you created a directory, please run the command ``npm run build``.

