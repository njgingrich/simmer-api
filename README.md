# simmer-api
Server with a postgres database that stores steam info for a user about recently played games, and exposes an API to access it.

## Installation
- Install postgres on your machine.
- Update the config file with steam API key, user profile id, and postgres credentials.
- `sudo -u postgres psql postgres`
- `\password postgres`
- `sudo -u postgres createuser pi`
- `sudo -u postgres createdb -O pi simmer`
- `yarn init`
- `yarn resetdb`
- `yarn install`

## Running
- `yarn run compile`
- `yarn start`
