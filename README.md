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

3. Start the server:

```bash
npm start
```

4. The server will be available on the url: http://localhost:8080, or on the port you have specified in the `.env` file.

## GUI - Available endpoints

### Products

-   http://localhost:8080/ : visualization of all the products.
-   http://localhost:8080/realtimeproducts : visualization of the products using web sockets for real-time updates. You can add, edit or delete products in this view.
-   http://localhost:8080/chat : online chat using web sockets for real-time updates.
-   http://localhost:8080/products : visualization of all the products (in pages) with the possibility to add them to the cart.
-   http://localhost:8080/carts/:cid : visualization of all the products included in a cart. You can remove products from the cart in this view or clear the cart.

## API - Available endpoints

See the Swagger Documentation on `/apidocs`, i.e.: http://localhost:8080/apidocs

<!--
### Products

-   `GET` http://localhost:8080/api/products : Returns all the products, with pagination (defaults: limit=10, page=1, sort=none, query=none).
-   `GET` http://localhost:8080/api/products/:pid : Returns the product with the associated productId (pid).
-   `POST` http://localhost:8080/api/products : Creates a new product.
-   `POST` http://localhost:8080/api/products/:pid/thumbnails : Uploads one or more images as thumbnails of the associated productId (pid).
-   `PUT` http://localhost:8080/api/products/:pid : Modifies the product with the associated productId (pid).
-   `DELETE` http://localhost:8080/api/products/:pid : Deletes the product with the associated productId (pid).

### Carts

-   `POST` http://localhost:8080/api/carts/:cid/product/:pid : Adds the productId (:pid) to the cartId (:cid).
-   `PUT` http://localhost:8080/api/carts/:cid/product/:pid : Updates the quantity of the product in the cart.
-   `DELETE` http://localhost:8080/api/carts/:cid/product/:pid : Removes a certain product of the cart. -->

## Databases

The project can be configured to use different databases. The default database is MongoDB (using the URI declared on the `.env` file), but you can change it to Node.js FileSystem implementation (using local JSONs).
