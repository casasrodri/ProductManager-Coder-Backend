import { productRepository } from '../repositories/index.js';

export default class ViewController {
    logIn(req, res) {
        res.redirect('/login');
    }

    signUp(req, res) {
        res.redirect('/signup');
    }

    async viewProducts(req, res) {
        const products = await productRepository.getProducts();
        res.render('home', { products: products });
    }

    async products(req, res) {
        const options = {};

        options['products'] = await productRepository.getProductsPaginate(req);
        options['user'] = req.session.name;
        options['session'] = JSON.stringify(req.session);

        try {
            res.render('products', options);
        } catch (err) {
            return res.status(404).send({
                status: 'error',
                description: err.message,
                payload: [],
            });
        }
    }

    async realTimeProducts(req, res) {
        let products = await productRepository.getProducts();

        products.forEach((product) => {
            if (!product.id) {
                product.id = product._id;
            }
        });

        res.render('realTimeProducts', { products: products });
    }

    async showCart(req, res) {
        res.render('cart', { cid: req.params.cid });
    }

    async chat(req, res) {
        res.render('chat');
    }

    logOut(req, res) {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Logout error',
                    data: { err },
                });
            } else {
                res.clearCookie('connect.sid');
                res.redirect('/products');
            }
        });
    }
}
