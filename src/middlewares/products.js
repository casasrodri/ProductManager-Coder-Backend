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
        owner,
    } = req.body;

    req.product = {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails,
        owner,
    };

    next();
};

export { getBodyProduct };
