export default () => ({
  port: parseInt(process.env.BFF_PORT ?? '3001', 10),
  backend: {
    url: process.env.BACKEND_URL || 'http://localhost:3000',
    productsEndpoint: process.env.BACKEND_PRODUCTS_ENDPOINT || '/productos',
  },
});
