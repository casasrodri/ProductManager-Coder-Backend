import handlebars from 'express-handlebars';

export default (app) => {
    app.engine('handlebars', handlebars.engine());
    app.set('views', process.cwd() + '/src/views');
    app.set('view engine', 'handlebars');
};
