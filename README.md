# Currency Exchange Public API

## How to run
#### Without docker
```
npm start
```
#### With docker
```
docker compose build
docker compose up
```
## Swagger
The api is up at `http://localhost:3000`
and you will find swagger at `http://localhost:3000/api-docs/` where you can find the endpoints with expected inputs/outputs

##### Note
You need to have .env having this API=https://api.apyhub.com/data/convert/currency/multiple, and generate a token from apyhub then pass it as TOKEN=<API_TOKEN> in .env
After doing that even on set up with docker these secrets will be passed automatically as I am not hardcoding any credentials
and If you are running it without docker, add PORT to .env too

## Functional Requirements
#### Currency Exchange:
- [x] 1. Integrate with a public currency conversion API to read the latest currency exchange rates
or any other API that you see fit.
- [x] 2. Provide a public API that allows users to get exchange rates given from currency and to
currency parameters.
## Non-functional Requirements
- [x] 1. Programming: The task shall be implemented using Node.js.
- [x] 2. API: Implement a RESTful API to support the currency exchange operation.
- [x] 3. Error Handling: The system should gracefully handle errors and provide meaningful
feedback.
## Bonus (Optional)
- [x] 1. Caching: Implement caching to reduce the number of requests to the external API.
- [x] 2. Rate Limiting: Implement rate limiting for the API to prevent abuse.
- [x] 3. Dockerizing: Dockerize the application using docker-compose.
- [x] 4. Unit Tests: Add unit tests for the currency exchange module.
