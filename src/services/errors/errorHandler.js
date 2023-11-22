export default (app) => {
    app.use((error, req, res, next) => {
        console.error('❗', error);

        if (error.custom) {
            res.status(error.statusCode).send(error.message);
            return;
        }

        res.status(500).send('Internal error 🤖');
    });
};
