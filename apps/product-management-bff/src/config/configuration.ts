export default () => ({
  port: process.env.PORT || 3001,
  backend: {
    url: process.env.BACKEND_URL || 'http://product-management-backend:3000',
    productsEndpoint: '/api/products',
  },
});
