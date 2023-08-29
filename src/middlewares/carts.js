const parseCartId = (req, res, next) => {
    const original = req.params.cid;
    req.params.cid = parseInt(original, 10);

    if (isNaN(req.params.cid) || original != req.params.cid) {
        return res.status(400).send({
            status: 'error',
            description: 'The cart id must be a number.',
        });
    }

    next();
};

export { parseCartId };
