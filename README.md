# E-commerce Backend

This repository contains the code associated with the first pre deliverable of the course of back-end development at CoderHouse.

## GUI - Available endpoints

### Products

-   http://localhost:8080/ : visualization of all the products.
-   http://localhost:8080/realtimeproducts : visualization of the products using web sockets for real-time updates. You can add, edit or delete products in this view.

## API - Available endpoints

### Products

-   `GET` http://localhost:8080/api/products : Returns all the products.
-   `GET` http://localhost:8080/api/products?limit=# : Returns the first # products.
-   `GET` http://localhost:8080/api/products/:pid : Returns the product with the associated productId (pid).
-   `POST` http://localhost:8080/api/products : Creates a new product.
-   `POST` http://localhost:8080/api/products/:pid/thumbnails : Uploads one or more images as thumbnails of the associated productId (pid).
-   `PUT` http://localhost:8080/api/products/:pid : Modifies the product with the associated productId (pid).
-   `DELETE` http://localhost:8080/api/products/:pid : Deletes the product with the associated productId (pid).

### Carts

-   `POST` http://localhost:8080/api/carts : Creates a new cart and returns the id associated.
-   `GET` http://localhost:8080/api/carts/:cid : Get all the products in the cart with the id passed as argument (cid).
-   `POST` http://localhost:8080/api/carts/:cid/product/:pid : Add the productId (:pid) to the cartId (:cid).

## Install and run

In order to execute the API, you just need Node.js.

1. Clone this repository or download the code.
2. Install the dependencies:

```
npm i
```

3. Start the server:

```
npm run dev
```

4. The server will be available on the url: http://localhost:8080
