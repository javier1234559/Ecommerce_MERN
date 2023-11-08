# Project Ecommece shop flower

Back-end to test
```shell

const apiSummary = [
  {
    route: '/api/products',
    method: 'GET',
    description: 'Fetch all products',
    access: 'Public',
  },
  {
    route: '/api/products/:id',
    method: 'GET',
    description: 'Fetch single product',
    access: 'Public',
  },
  {
    route: '/api/products',
    method: 'POST',
    description: 'Create a product',
    access: 'Private/Admin',
  },
  {
    route: '/api/products/:id',
    method: 'PUT',
    description: 'Update a product',
    access: 'Private/Admin',
  },
  {
    route: '/api/products/:id',
    method: 'DELETE',
    description: 'Delete a product',
    access: 'Private/Admin',
  },
  {
    route: '/api/products/:id/reviews',
    method: 'POST',
    description: 'Create new review',
    access: 'Private',
  },
  {
    route: '/api/products/top',
    method: 'GET',
    description: 'Get top rated products',
    access: 'Public',
  },
];

const orderApiSummary = [
  {
    route: '/api/orders',
    method: 'POST',
    description: 'Create new order',
    access: 'Private',
  },
  {
    route: '/api/orders/myorders',
    method: 'GET',
    description: 'Get logged in user orders',
    access: 'Private',
  },
  {
    route: '/api/orders/:id',
    method: 'GET',
    description: 'Get order by ID',
    access: 'Private',
  },
  {
    route: '/api/orders/:id/pay',
    method: 'PUT',
    description: 'Update order to paid',
    access: 'Private',
  },
  {
    route: '/api/orders/:id/deliver',
    method: 'GET',
    description: 'Update order to delivered',
    access: 'Private/Admin',
  },
  {
    route: '/api/orders',
    method: 'GET',
    description: 'Get all orders',
    access: 'Private/Admin',
  },
];

const userApiSummary = [
  {
    route: '/api/users/auth',
    method: 'POST',
    description: 'Auth user & get token',
    access: 'Public',
  },
  {
    route: '/api/users',
    method: 'POST',
    description: 'Register a new user',
    access: 'Public',
  },
  {
    route: '/api/users/logout',
    method: 'POST',
    description: 'Logout user / clear cookie',
    access: 'Public',
  },
  {
    route: '/api/users/profile',
    method: 'GET',
    description: 'Get user profile',
    access: 'Private',
  },
  {
    route: '/api/users/profile',
    method: 'PUT',
    description: 'Update user profile',
    access: 'Private',
  },
  {
    route: '/api/users',
    method: 'GET',
    description: 'Get all users',
    access: 'Private/Admin',
  },
  {
    route: '/api/users/:id',
    method: 'DELETE',
    description: 'Delete user',
    access: 'Private/Admin',
  },
  {
    route: '/api/users/:id',
    method: 'GET',
    description: 'Get user by ID',
    access: 'Private/Admin',
  },
  {
    route: '/api/users/:id',
    method: 'PUT',
    description: 'Update user',
    access: 'Private/Admin',
  },
];


```
