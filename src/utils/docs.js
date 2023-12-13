import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';

const app = express();
const PORT = process.env.PORT || 8080;
const connection = mongoose.connect(
  'mongodb+srv://gonzalofdez06:coderhouse123@cluster0.gwswo1q.mongodb.net/?retryWrites=true&w=majority'
);

const swaggerOptions = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'Documentazao',
      description: 'Documentación',
    },
  },
  apis: [`${__dirname}/docs/**/*.yaml`],
};
console.log(`${__dirname}/docs/**/*.yaml`);

const specs = swaggerJsdoc(swaggerOptions);
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));
export default (app) => {

}