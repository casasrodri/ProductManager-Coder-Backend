import { Router } from 'express';
import CartManager from '../controllers/cartManager.js';

// Instantiate the manager
const pm = new CartManager();

const router = Router();

// TODO: Crea un nuevo carrito, y devuelve el ID generado.
router.post('/', (req, res) => {
    res.status(501).send();
});

// TODO: Obtiene un carrito.
router.get('/:cid', (req, res) => {
    res.status(501).send();
});

// TODO: Agrega un producto al carrito.
router.post('/:cid/product/:pid', (req, res) => {
    res.status(501).send();
});

export default router;
