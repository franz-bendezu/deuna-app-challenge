export default () => ({
  port: process.env.BFF_PORT || 3001,
  backend: {
    url: process.env.BACKEND_URL || 'http://localhost:3000',
    productsEndpoint: '/products',
  },
});
