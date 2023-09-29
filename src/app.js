import express from 'express';
import handlebars from 'express-handlebars';
import setRouters from './routes/index.js';
import setSockets from './sockets/index.js';
import { DaoConnector, daoManagersMiddleware } from './dao/connector.js';

// Instantiate the express application:
const app = express();
const PORT = 8080;
const httpServer = app.listen(PORT, () =>
    console.log(`🚀 Server listening on http://localhost:${PORT}`)
);

// Connect to databases
DaoConnector.setConnectionType('mongo');
app.use(daoManagersMiddleware);

// Handlebars configuration
app.engine('handlebars', handlebars.engine());
app.set('views', process.cwd() + '/src/views');
app.set('view engine', 'handlebars');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(process.cwd() + '/public'));

// Using routers
setRouters(app);

// Socket server
setSockets(httpServer);
