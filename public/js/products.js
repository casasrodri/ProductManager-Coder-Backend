const cartIdDiv = document.getElementById('cartId');
const cartCountDiv = document.getElementById('cartCount');
const cartId = localStorage.getItem('cartId');
const hideNumber = document.getElementById('hideNumber');
const toast = document.getElementById('toast');

if (cartId) {
    cartIdDiv.innerHTML = cartId;
    updateCount();
    updateCartLink();
} else {
    fetch('/api/carts', {
        method: 'POST',
    })
        .then((res) => res.json())
        .then((obj) => {
            localStorage.setItem('cartId', obj.data._id);
            cartIdDiv.innerHTML = obj.data._id;
            updateCount();
            updateCartLink();
        });
}

function addToCart(productId) {
    cartIdDiv.innerHTML = cartId;
    fetch('/api/carts/' + cartId + '/product/' + productId, {
        method: 'POST',
    })
        .then((res) => res.json())
        .then((obj) => {
            updateCount();
            showToast();
        });
}

function updateCount() {
    fetch('/api/carts/' + cartIdDiv.innerHTML, {
        method: 'GET',
    })
        .then((res) => res.json())
        .then((obj) => {
            const total = obj.data.reduce(
                (accumulator, currentValue) =>
                    accumulator + currentValue.quantity,
                0
            );

            if (total > 0) {
                hideNumber.style.display = 'block';
                cartCountDiv.innerHTML = total;
            } else {
                hideNumber.style.display = 'none';
            }
        });
}

function updateCartLink() {
    const cartLink = document.getElementById('cartLink');
    cartLink.href = '/carts/' + cartIdDiv.innerHTML;
}

function showToast() {
    toast.style.display = 'block';
    setTimeout(function () {
        toast.style.display = 'none';
    }, 3000);
}
