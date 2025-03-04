# farmghana-ecommerce
This is the backend for the Farm Ghana E-commerce website. It was built using Nodejs and Expressjs.

# API ENDPOINTS

## Users

- `POST /users/register`: Register a new user
- `POST /users/login`: Log in a user
- `GET /users/me`: Get the current user
- `GET /users/all`: Get all users

## Products

- `GET /products`: Get all products
- `GET /products/:id`: Get a single product
- `POST /products`: Create a new product
- `PUT /products/:id`: Update a product
- `DELETE /products/:id`: Delete a product

## Orders

- `GET /orders`: Get all orders
- `GET /orders/:id`: Get a single order
- `POST /orders`: Create a new order
- `PUT /orders/:id`: Update an order
- `DELETE /orders/:id`: Delete an order

## Reviews

- `GET /reviews`: Get all reviews
- `GET /reviews/:id`: Get a single review
- `POST /reviews`: Create a new review
- `PUT /reviews/:id`: Update a review
- `DELETE /reviews/:id`: Delete a review
