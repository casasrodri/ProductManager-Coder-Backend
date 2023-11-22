import express from 'express';
import config from './config/config.js';
import MongoSingleton from './dao/mongo/singleton.js';
import configHandlebars from './config/handlebars.js';
import setMiddlewares from './middlewares/index.js';
import setRouters from './routes/index.js';
import setSockets from './sockets/index.js';
import errorHandler from './services/errors/errorHandler.js';
import logger from './utils/logger.js';

// Instantiate the express application:
const app = express();
const PORT = config.port;
const httpServer = app.listen(PORT, () =>
    logger.info(`🚀 Server listening on http://localhost:${PORT}`)
);

// Connect to databases
MongoSingleton.getInstance();

// Handlebars configuration
configHandlebars(app);

// Middlewares
setMiddlewares(app);

// Using routers
setRouters(app);

// Socket server
setSockets(httpServer);

// Error handler
errorHandler(app);
