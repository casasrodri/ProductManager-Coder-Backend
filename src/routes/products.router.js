import { getBodyProduct } from '../middlewares/products.js';
import { thumbnailsUploader } from '../middlewares/multer.js';
import { Router } from 'express';
const router = Router();

router.get('/', async (req, res) => {
    try {
        const result = await req.productManager.getProductsPaginate(req.query);
        result['status'] = 'success';
        result['prevLink'] = createLink(result, req.url, 'prev');
        result['nextLink'] = createLink(result, req.url, 'next');
        res.send(result);

        // FIXME Se debe enviar un error si consulto la página 9 de 3... es decir, páginas que no existen.
        // FIXME Ver si el link debe ser /?page=2 o  /products?page=2 (que está en otro router).
    } catch (err) {
        return res
            .status(404)
            .send({ status: 'error', description: err.message, payload: [] });
    }
});

router.get('/:pid', async (req, res) => {
    const pid = req.productManager.getId(req.params.pid);

    try {
        const product = await req.productManager.getProductById(pid);
        res.send(product);
    } catch (err) {
        res.status(404).send({
            status: 'error',
            description: err.message,
            data: { productId: pid },
        });
    }
});

router.post('/', getBodyProduct, async (req, res) => {
    try {
        return res.status(201).send({
            status: 'ok',
            description: 'Created.',
            data: await req.productManager.addProduct(req.body.product),
        });
    } catch (err) {
        return res.status(400).send({
            status: 'error',
            description: 'Can not add a new product. ' + err.message,
            data: null,
        });
    }
});

router.post(
    '/:pid/thumbnails',
    thumbnailsUploader.array('thumbnails'),
    async (req, res) => {
        const pid = req.productManager.getId(req.params.pid);

        try {
            for (const f of req.files) {
                await req.productManager.addThumbnail(pid, f.path);
            }

            const product = await req.productManager.getProductById(pid);

            return res.status(201).send({
                status: 'ok',
                description: 'Thumbnails added.',
                data: product,
            });
        } catch (err) {
            return res.status(404).send({
                productId: pid,
                status: err.message,
                data: { productId: pid },
            });
        }
    }
);

router.put('/:pid', getBodyProduct, async (req, res) => {
    const pid = req.productManager.getId(req.params.pid);
    const updatedProduct = req.body.product;
    let updated;

    try {
        return res.status(200).send({
            status: 'ok',
            description: 'Updated.',
            data: await req.productManager.updateProductById(
                pid,
                updatedProduct
            ),
        });
    } catch (err) {
        return res.status(404).send({
            status: 'error',
            description: err.message,
            data: { productId: pid },
        });
    }
});

router.delete('/:pid', async (req, res) => {
    const pid = req.productManager.getId(req.params.pid);

    try {
        return res.status(204).send({
            status: 'ok',
            description: 'Deleted.',
            data: await req.productManager.deleteProductById(pid),
        });
    } catch (err) {
        return res.status(404).send({
            status: 'error',
            description: err.message,
            data: { productId: pid },
        });
    }
});

function createLink(result, url, type) {
    const currentPage = 'page=' + result.page;

    if (type === 'prev') {
        if (result.hasPrevPage) {
            return url.replace(currentPage, 'page=' + result.prevPage);
        }
    } else {
        if (result.hasNextPage) {
            return url.replace(currentPage, 'page=' + result.nextPage);
        }
    }

    return null;
}

export default router;
