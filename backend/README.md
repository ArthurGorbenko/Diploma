# Shop Slideshow backend

## Requirements

- php version `7.3+`

- symfony [binary](https://symfony.com/download)

- `symfony check:requirements`

## Setup Instructions

- clone the repo

- create db, execute the latest minimal dump (from `misc/dump/`)

- `cp .env .env.local`

- edit `.env.local` file with db details

- `composer install`

- `bin/console doctrine:migrations:migrate`

- `bin/console app:contrib`

- `symfony server:start`

## Root user credentials (dev)

- uuid: `root_uuid`

- license: `root_license`

## Updating Instructions

- `git pull`

- `bin/console doctrine:migrations:migrate`

- `bin/console app:contrib`

## The Slideshow

The html is served at `/`. Bundled js and css are sourced from `public/dist`.
