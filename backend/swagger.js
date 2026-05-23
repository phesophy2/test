const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const options = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'KhmerGhost API', version: '3.2.1.0', description: 'Complete API documentation' },
    servers: [{ url: 'http://localhost:5001/api', description: 'Development' }],
    components: { securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } } },
    security: [{ bearerAuth: [] }]
  },
  apis: ['./routes/*.js']
};
const specs = swaggerJsdoc(options);
const setupSwagger = (app) => { app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs)); };
module.exports = setupSwagger;
