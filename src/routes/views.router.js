import { Router } from 'express';
const router = Router();

router.get('/', async (req, res) => {
    const products = await req.productManager.getProducts();
    res.render('home', { products: products });
});

router.get('/products', async (req, res) => {
    // FIXME Mejorar en el endpoint de productos?
    function createLink(result, url, type) {
        const currentPage = 'page=' + result.page || 'page=1';
        const url_ = url.includes('?') ? url : url + '?';

        if (type === 'prev') {
            if (result.hasPrevPage) {
                if (url.includes('page=')) {
                    return url_.replace(currentPage, 'page=' + result.prevPage);
                } else {
                    return url_ + '&page=' + result.prevPage;
                }
            }
        } else {
            if (result.hasNextPage) {
                if (url.includes('page=')) {
                    return url_.replace(currentPage, 'page=' + result.nextPage);
                } else {
                    return url_ + '&page=' + result.nextPage;
                }
            }
        }

        return null;
    }
    // FIXME Creo que no está bueno duplicar este código (create link y el de abajo)
    const result = await req.productManager.getProductsPaginate(req.query);

    result['status'] = 'success';
    result['prevLink'] = createLink(result, req.url, 'prev');
    result['nextLink'] = createLink(result, req.url, 'next');

    res.render('products', result);
});

router.get('/realtimeproducts', async (req, res) => {
    let products = await req.productManager.getProducts();

    products.forEach((product) => {
        if (!product.id) {
            product.id = product._id;
        }
    });

    res.render('realTimeProducts', { products: products });
});

router.get('/carts/:cid', async (req, res) => {
    res.render('cart', { cid: req.params.cid });
});

router.get('/chat', (req, res) => {
    res.render('chat');
});

export default router;
