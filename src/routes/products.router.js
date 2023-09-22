import { getBodyProduct } from '../middlewares/products.js';
import { thumbnailsUploader } from '../middlewares/multer.js';
import { Router } from 'express';
const router = Router();

router.get('/', async (req, res) => {
    // TODO Recibir por query.params:
    // - limit: número de productos a devolver (default: 10)
    // - page: página de productos a devolver (default: 1)
    // - sort: criterio de ordenación de productos ('asc', 'desc' del precio)
    // - query: criterio de búsqueda de productos (default: busqueda general)
    // FIXME: Consultar como se envían los parámetros por query... ejemplo: categoria=jardin ... el video habla de disponibilidad basado en stock, pero hay un campo de status.
    // query='{category:'jardin'}'
    // query='{available:true}'
    // https://www.npmjs.com/package/mongoose-paginate-v2
    // ejemplo: /products?limit=5&page=2&sort=asc&query=camiseta

    let products = await req.productManager.getProducts();
    const limit = parseInt(req.query.limit);

    if (limit) {
        products = await req.productManager.getProductsLimit(limit);
    }

    if (products.length === 0) {
        return res.status(204).send(products);
    }

    res.send(products);

    // Debe devolver el siguiente objeto JSON:
    return {
        status: 'success/error',
        payload: ['productos'],
        totalPages: 10,
        prevPage: 1,
        nextPage: 3,
        page: 2,
        hasPrevPage: true,
        hasNextPage: true,
        prevLink: 'http://localhost:3000/products?page=1' || null,
        nextLink: 'http://localhost:3000/products?page=3' || null,
    };

    // Se deberá poder buscar prodcutos por:
    // - categoría (category=jardin)
    // - disponibilidad (available=true)

    // Se deberá poder ordenar ascendentemente o descendentemente por precio
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

export default router;
