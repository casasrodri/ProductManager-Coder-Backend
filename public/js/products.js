const cartIdDiv = document.getElementById('cartId');
const cartCountDiv = document.getElementById('cartCount');
const hideNumber = document.getElementById('hideNumber');
const toast = document.getElementById('toast');
let cartId = localStorage.getItem('cartId');

async function getUser() {
    const res = await fetch(`/api/sessions/current`);
    const user = await res.json();

    return user;
}

// Function to hide the actions buttons
async function hideActionsButtons() {
    const cartButtons = document.querySelectorAll('#cart-buttons');

    const user = await getUser();

    if (user.role === 'admin') {
        return;
    }

    cartButtons.forEach((cartButton) => {
        const productOwner = cartButton.dataset.owner;

        if (productOwner !== user.email) {
            cartButton.style.display = 'none';
        }
    })
}

// hideActionsButtons();

async function checkCartIdExists(id) {
    const res = await fetch('/api/carts/' + id, { method: 'HEAD' });
    return res.ok;
}

async function createCart() {
    const res = await fetch('/api/carts', { method: 'POST' });
    const obj = await res.json();

    localStorage.setItem('cartId', obj.data._id);
    cartIdDiv.innerHTML = obj.data._id;
    updateCount();
    updateCartLink();
}

async function getCart() {
    const currentCartId = localStorage.getItem('cartId');

    if (currentCartId) {
        if (await checkCartIdExists(currentCartId)) {
            console.log('existe el carrito especificado en ls');
            cartIdDiv.innerHTML = currentCartId;
            updateCount();
            updateCartLink();
        } else {
            console.log('no existe el carrito especificado en ls');
            localStorage.removeItem('cartId');
            await createCart();
            console.log('carrito creado');
        }
    } else {
        console.log('no existe el carrito dado que no está en localstorage');
        await createCart();
        console.log('carrito creado');
    }
}
getCart();

async function addToCart(productId) {
    const res = await fetch(
        '/api/carts/' + cartIdDiv.innerHTML + '/product/' + productId,
        {
            method: 'POST',
        }
    );

    updateCount();
    showToast();
}

async function updateCount() {
    const res = await fetch('/api/carts/' + cartIdDiv.innerHTML);
    const obj = await res.json();

    if (obj.data.length === 0) {
        hideNumber.style.display = 'none';
        return;
    } else {
        const total = obj.data.reduce(
            (accumulator, currentValue) => accumulator + currentValue.quantity,
            0
        );

        hideNumber.style.display = 'block';
        cartCountDiv.innerHTML = total;
    }
}

function updateCartLink() {
    const cartLink = document.getElementById('cartLink');
    cartLink.href = '/carts/' + cartIdDiv.innerHTML;
}

function showToast() {
    Toastify({
        text: 'Product added to cart!',
        duration: 3000,
        gravity: 'top', // `top` or `bottom`
        position: 'right', // `left`, `center` or `right`
    }).showToast();
}
