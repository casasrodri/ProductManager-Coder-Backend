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

export { getBodyProduct };
