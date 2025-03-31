export default () => ({
  port: process.env.PORT || 3001,
  backend: {
    url: process.env.BACKEND_URL || 'http://localhost:3000',
    productsEndpoint: '/products',
  },
});
