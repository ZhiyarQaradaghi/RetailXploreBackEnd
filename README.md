# RetailXplore Backend

backend for the RetailXplore e-commerce application.

## Steps to run the project:

1. Clone the repository
2. Run `npm install` to install the dependencies

install these dependencies:

```
npm install node-cache compression express-rate-limit
```

3. Create a `.env` file with the following variables:
   ```
   PORT=3003
   MONGODB_URI=mongodb://localhost:27017
   CORS_ORIGIN=http://localhost:5173
   NODE_ENV=development
   ```
4. Run `npm run init-db` to initialize the database
5. Run `npm run dev` to start the server in development mode
6. For production, use `npm start`

## Performance Optimizations

- In memory caching with node-cache
- Database indexing for faster queries
- Pagination to limit the number of products returned
- HTTP compression to reduce the size of the response
- Rate limiting to prevent abuse
- Connection pooling for MongoDB to limit the number of connections
- Error handling middleware

## Product Endpoints

- GET `/productlist` - Get all products
- GET `/featured` - Get featured products
- GET `/search?q=query` - Search products

### Cart Endpoints

- GET `/cart?cartId=123` - Get cart contents
- POST `/cart/create` - Create a new cart
- POST `/cart/add` - Add product to cart
- POST `/cart/remove` - Remove product from cart
- POST `/cart/clear` - Clear cart contents

### Review Endpoints

- POST `/reviews` - Create a new review
- GET `/reviews/:id` - Get reviews for a product
- PUT `/reviews/:id` - Update a review
- DELETE `/reviews/:id` - Delete a review

### Auth Endpoints

- POST `/auth/login` - Login a user
- POST `/auth/register` - Register a new user
- POST `/auth/logout` - Logout a user

### Admin Endpoints (Protected)

- GET `/admin/statistics` - Get admin statistics
- POST `/admin/products` - Create a new product
- PUT `/admin/products/:id` - Update a product
- DELETE `/admin/products/:id` - Delete a product
- POST `/admin/featured/:id` - Add product to featured items
- DELETE `/admin/featured/:id` - Remove product from featured items
- POST `/admin/discounts/:id` - Add discount to product
- DELETE `/admin/discounts/:id` - Remove discount from product
- POST `/admin/barcode/:id` - Assign barcode to product
- PUT `/admin/barcode/:id` - Update product barcode
- DELETE `/admin/barcode/:id` - Remove product barcode
