# iBILLBOARD API - nodejs

## Local development

### Docker

build your docker containers in root folder of the project

```
docker-compose up -d --build
```

application is waiting fo requests on url (port may differ, check `/docker-compose.yml` in case of problems)

```
http://localhost:3000/
```

#### node shell + @nestjs/cli

you can run commands inside node container.

```
docker-compose exec app sh
```

@nestjs/cli is installed inside container so generator command can be run within. Example:

```
nest g mo whatever-module
```

### Configuration

common configuration is in 

    .env.global

environmentally dependent configuration is set in .env.local. You can start by copying .env.local.dist template. 

```
cp .env.local.dist .env.local
```

## Deployment to production

- redis must not be set up in docker container on server. Failed container would cause data loss. Configure connection
  to redis in `.env.local` file accordingly.

## API

in local development, the application is receiving request on url `http://localhost:3000/`.

- the API documentation can be managed using OpenAPI, when the application grows
- use i.e. Postman application to send requests

### GET "/count"

returns value of "count" key in redis

curl command to run from terminal: 

```
curl -X GET http://localhost:3000/count
```

### POST "/track"

receives "application/json" requests and stores content in `/storage/tracking-file`.
If "count" parameter is present, it increments value of "count" key in redis.

The route simulates strictly typed/organized json.

- extra unexpected parameters will cause Err 400
- missing required parameters will cause Err 400

#### Example json string - all supported parameters

```
{
    "id": 2,
    "count": 33,
    "content": "some content",
    "whatever": "whatever"
}
```

curl command for running from terminal:

```
curl -X POST http://localhost:3000/track -H "Content-Type: application/json" -d '{
  "id": 2,
  "count": 99,
  "content": "some content",
  "whatever": "whatever"
}'
```

#### Example json string - required parameters only

```
{
    "id": 2,
    "whatever": "whatever"
}
```

curl command for running from terminal:

```
curl -X POST http://localhost:3000/track -H "Content-Type: application/json" -d '{
  "id": 2,
  "whatever": "whatever"
}'
```