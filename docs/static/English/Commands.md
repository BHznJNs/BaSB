# Command List

## CLI Commands

Usage: basb-cli [options] [command]

### Options
- -V, \-\-version   output the version number
- -h, \-\-help      display help for command

### Commands

- create <name>   Create BaSB project
- upgrade         Upgrade BaSB project
- preview         Start preview server
- watch           Start watching static folder
- build           Build
- ssr             Server-side rendering
- indexing        Build index files
- count           Count words and generate statistics page file
- backup          Backup blog metadata
- restore         Restore blog metadata
- help [command]  Display help for command

## Development Commands

### `npm run dev`

Start the rollup development server, watch for source code changes and automatically bundle and build.

### `npm run build`

Build the source code to the ``template`` directory.

### `npm run test`

Run the test cases in the `builder/test` directory.
