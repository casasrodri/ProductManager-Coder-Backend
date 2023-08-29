const parseProductId = (req, res, next) => {
    const original = req.params.pid;
    req.params.pid = parseInt(original, 10);

    if (isNaN(req.params.pid) || original != req.params.pid) {
        return res.status(400).send({
            status: 'error',
            description: 'The product id must be a number.',
        });
    }

    next();
};

const getBodyProduct = (req, res, next) => {
    const {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails,
    } = req.body;

    req.body.product = {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails,
    };

    next();
};

export { parseProductId, getBodyProduct };
