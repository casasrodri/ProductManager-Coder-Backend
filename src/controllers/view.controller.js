import { productRepository } from '../repositories/index.js';
import { generateMockProducts } from '../utils/faker.js';

export default class ViewController {
    redirectLogIn(req, res) {
        res.redirect('/login');
    }

    logIn(req, res) {
        res.render('login');
    }

    signUp(req, res) {
        res.render('signup');
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

        if (req.user) options.user = req.user.first_name;

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
        res.cookie('jwt', '', { maxAge: 1 });

        req.session.destroy((err) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Logout error',
                    data: { err },
                });
            } else {
                res.clearCookie('connect.sid');
                res.clearCookie('jwt');
                res.render('login');
            }
        });
    }

    async mockingProducts(req, res) {
        const products = generateMockProducts(100);
        res.json(products);
    }
}
