# simmer-api
Server with a postgres database that stores steam info for a user about recently played games, and exposes an API to access it.

## Installation
- Install postgres on your machine.
- Update the config file with steam API key, user profile id, and postgres credentials.
- `yarn resetdb`
- `yarn install`

## Running
- `yarn run compile`
- `yarn start`