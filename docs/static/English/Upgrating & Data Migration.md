# Upgrating & Data Migration

## Upgrate

In the root directory, run the ``npm run backup`` command to generate the backup configuration file ``backup.json``, backup your ``static`` directory, the ``backup.json`` backup configuration file and ``build.config.js`` configuration file.

Delete the all directories and files except the ``.git`` directory in the root folder, reinstall this project with the [Installation](English/Installation.md).

After installation, delete the ``static`` directory and ``build.config.js`` file in the root folder, just paste your backup files.

- - -

## Data Migration

In the root directory, run the ``npm run backup`` command to generate the backup configuration file ``backup.json``, backup your ``static`` directory, the ``backup.json`` backup configuration file and ``build.config.js`` configuration file.

In the migration target, install this project with the [Installation](English/Installation.md).

After installation, delete the ``static`` directory and ``build.config.js`` file in the root folder, paste (or copy) your backup files.

Run the ``npm run restore`` command to restore.