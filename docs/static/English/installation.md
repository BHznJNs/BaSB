# Installation

## Requirements

- [Node.js](https://nodejs.org) (the latest LTS version is recommended)
- [Git](https://git-scm.com/download)

## Download this Template

Run the command bellow:
```bash
git clone https://github.com/BHznJNs/markdown-blog-template
```

Or directly [click this](https://github.com/BHznJNs/markdown-blog-template/archive/refs/heads/main.zip) to download.

## Dependencies installation

```bash
npm install
```

>>>Install dependencies as required
Since RSS feed subscription requires the pre-rendered static HTML files, and some of the chart rendering libraries used in this project do not support server-side rendering, it is necessary to import Electron for implementing server-side rendering.

If you don't have a requirement for RSS publishing and subscription, or if you do but don't utilize the functionalities of equations, charts, or QR codes in your writing, to reduce the disk space usage of dependency libraries, please use the command below to install:
```bash
npm install express utimes crypto-js
```

If you have a requirement for RSS publishing and subscription, and need to utilize the functionalities of equations, charts, and QR codes in your writing, please use the command below to install:
```bash
npm install --production
```

If you wish to modify this project's frontend source code and apply the changes, please use the following command to install development dependencies individually:
```bash
npm install --only=dev
```
>>>

## Edit the Configuration File

Locale the file named ``build.config.js`` in the root directory of project, and it is the configuration for this project.
- Modify the ``language`` to your preferred language (``en`` for English and ``zh`` for Simplfied Chinese).
- Modify the ``homepage`` to the URL where you deploy this project. E.g., [https:\/\/bhznjns.github.io/markdown-blog-template/](https://bhznjns.github.io/markdown-blog-template/).
- Modify the ``title`` to the name of your site.
