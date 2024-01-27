# E-commerce Backend

This repository contains the code associated with the deliverable of the course of back-end development at CoderHouse.

## Install and run

In order to execute the API, you just need Node.js.

1. Clone this repository or download the code.
2. Complete the `.env` file, based on the `.env.example`.
3. Install the dependencies:

```bash
npm i
```

4. Start the server:

```bash
npm start
```

5. The server will be available on the url: <http://localhost:8080>, or on the port you have specified in the `.env` file.

## Available endpoints

See the Swagger Documentation on `/apidocs`, i.e.: <http://localhost:8080/apidocs>

## Databases

The project can be configured to use different databases. The default database is MongoDB (using the URI declared on the `.env` file), but you can change it to Node.js FileSystem implementation (using local JSONs).
