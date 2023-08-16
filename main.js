import { log } from 'node:console';
import { ProductManager, Product } from './ProductManager.js';

const silla = Product.fromObject({
    title: 'Silla hierro',
    description: 'Silla hierro fundido color blanco',
    price: 150,
    thumbnail: 'silla.jpg',
    code: '90493dks90ds',
    stock: 3000
});

const main = async () => {

    // Instanciamos el objeto manager
    const pm = new ProductManager();

    //* OBTENER TODOS LOS PRODUCTOS:
    // log('Lectura inicial: 3 productos o arreglo vacío si el json no está.')
    // log(await pm.getProducts())

    //* OBTENER PRODUCTO POR ID:
    // log('Se obtiene el producto con id=2: Placard')
    // log(await pm.getProductById(2))

    //* AGREGADO DE PRODUCTOS:
    // log('Se agrega un producto: Silla (id=4)')
    // await pm.addProduct(silla);
    // log(await pm.getProducts())

    //* ACTUALIZACIÓN DE PRODUCTO:
    // log('Se actualiza el producto con id=2: Placard')
    // await pm.updateProductById(2, { title: 'Placard con cajones', price: 800 })
    // log(await pm.getProductById(2))

    //* ELIMINAR UN PRODUCTO:
    // log('Se elimina el producto con id=1: Mesa')
    // await pm.deleteProductById(1)
    // log(await pm.getProducts())
}

main();
