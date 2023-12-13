import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';

const swaggerOptions = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'Ecommerce API',
      description: 'This document describes how to interact with the Ecommerce API',
    },
  },
  apis: [`${process.cwd()}/src/utils/docs/**/*.yaml`],
};

const specs = swaggerJsdoc(swaggerOptions);

export default (app) => {
  app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));
}
