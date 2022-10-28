
# Consent API
## Tech Stack Used
- NodeJS
- Typescript
- PostgreSQL (with Knex query builder)
- Express

The app also uses joi as a validation layer

Original doc found [here](https://boosted-technology.notion.site/boosted-technology/Design-a-consent-API-8fd89edea3b5432a8ff084ee99efc5a7)

## Setup
### Setup using (docker & docker-compose) (recommended)
- create `.envrc` file in the root directory & add the following env variables to it
```
export POSTGRES_USER=
export POSTGRES_PASSWORD=
export DB_HOST=db
export DB_PORT=5432
export POSTGRES_DB=
export POSTGRES_DB_TEST=
```
P.S. you might need to create the database in both `POSTGRES_DB` & `POSTGRES_DB_TEST` manually

- run `docker-compose up api`, this will pull the latest postgresSQL docker image, if you already have a local postgreSQL docker image you can replace the tag in the docker-compose file with the tag of your local postgres image
- Run migrations `docker-compose exec api npm run migrate:latest`
- To run test cases, run `docker-compose exec api npm run test`


### Setup (without docker)
- Install NodeJS LTS
- Make sure the above env variables are set
- run `npm i`
- run `npm run migrate:latest`
- run `npm start`
- To run test cases, run `npm run test`

## Architecture & Design

### Database
For database design I went with a slightly different schema than what's mentioned in the requirements. Here's what the schema looks like
```
uinque_id: <id unique to every single record>
target_id: <id common for all versions for a specific entity>
created_at: <full timestamp of when the record was created not just DD/MM/YYYY>
name: <same value>
consent_url: <same value>
version: <samevalue>
```
I used `unique_id` & `target_id` to distinguish between the 2 ids because the name `id` is too generic in this case.

However the api still responds with the following
```
"id": <target id>, 
"name": <some value>, 
"consent_url": <some value>,
"version": <some number>, 
"created_at":  <full time stamp>
 ```
 so the api maps the `target_id` to `id` to maintain the same interface

### General Architecture
- The app follows a simple architecture of controllers / services / repositories, in addition to schemas, types & middlewares for better separation
- In a real world scenario we might divide our code in a different way depending on the use case
- The db generates all uuid by using extension `uuid-ossp` , alternatively we can generate it manually in the api & pass it down to the db
- In a real world scenario we should also have stricter validation as well as more definite migration schema (instead of just using `.string`)
- The get endpoints does not have pagination, but in a real world scenario there should be pagination as well
- The validation middleware only validates `body` & `params` as this is the requirement. Generally the middleware should also be able to validate the query as well.
- Test cases are found in the `__tests__` folder. The cover the usual cases for each endpoint.

### Sending Requests
The api interface is the same as mentioned in requirements

To create a new consent record. Send `POST` to `/consent/target` with body
```
{ "name": "pharmacy.allow_marketing_emails", "consent_url": "http://example.com/marketing_terms" }
```
To add a new version to an existing consent, send `PATCH` to `/consent/target/:targetId`
```
{ "name": "pharmacy.allow_marketing_emails", "consent_url": "http://example.com/marketing_terms" }
```
To get all versions of a specific target, send `GET` to `/consent/target/:targetId`

To get all targets in the database, send `GET` to `/consent/target`
