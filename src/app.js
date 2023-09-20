import express from 'express';
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import setRouters from './routes/router.js';
import setSockets from './sockets/sockets.js';

// Connect to MongoDB
const database = 'ecommerce';
mongoose.connect(
    `mongodb+srv://rodri:rodri@cluster0.fhf3wmo.mongodb.net/${database}?retryWrites=true&w=majority`
);

// Instantiate the express application:
const app = express();
const PORT = 8080;
const httpServer = app.listen(PORT, () =>
    console.log(`🚀 Server listening on http://localhost:${PORT}`)
);

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
