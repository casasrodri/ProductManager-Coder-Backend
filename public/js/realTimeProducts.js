// Socket.io
const socket = io();

// Variables for the buttons
let deleteBtn;
let editBtn;

const svgEdit = `
<svg class="w-5 h-5 hover:text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none"
    viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
    <path stroke-linecap="round" stroke-linejoin="round"
        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
</svg>
`;

const svgDelete = `
<svg class="w-5 h-5 hover:text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none"
    viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
    <path stroke-linecap="round" stroke-linejoin="round"
        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
</svg>
`;

// Functions to delete, edit and add products
function deleteProduct(id) {
    const confirmation = window.confirm(
        `Are you sure to delete the product with id ${id}?`
    );

    if (confirmation) {
        fetch(`/api/products/${id}`, {
            method: 'DELETE',
        })
            .then(function (response) {
                if (response.ok) {
                    socket.emit('deleteProduct', id);
                } else {
                    console.error('Error on DELETE: ' + response.statusText);
                }
            })
            .catch(function (error) {
                console.error('Error on DELETE:', error);
            });
    }
}

socket.addEventListener('deletedProduct', (id) => {
    const card = document.getElementById(`card-${id}`);
    card.remove();
});

function editProduct(id) {
    // Getting info about the product
    fetch(`/api/products/${id}`)
        .then((response) => response.json())
        .then((infoProduct) => {
            document.getElementById('updating-id').innerHTML =
                infoProduct.id || infoProduct._id;
            document.getElementById('title').value = infoProduct.title;
            document.getElementById('description').value =
                infoProduct.description;
            document.getElementById('code').value = infoProduct.code;
            document.getElementById('price').value = infoProduct.price;
            document.getElementById('stock').value = infoProduct.stock;
            document.getElementById('category').value = infoProduct.category;
        });

    // Open the modal
    document.getElementById('openModal').click();

    // Setting the title and button of the modal
    document.getElementById('titleModal').innerHTML = 'Edit product';
    document.getElementById('btnModal').innerHTML = 'Edit';
}

function saveEditProduct() {
    const id = document.getElementById('updating-id').innerHTML;
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const code = document.getElementById('code').value;
    const price = document.getElementById('price').value;
    const stock = document.getElementById('stock').value;
    const category = document.getElementById('category').value;

    const product = {
        id,
        title,
        description,
        code,
        price,
        stock,
        category,
    };

    fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
    })
        .then(function (response) {
            if (response.ok) {
                socket.emit('editProduct', product);
                document.getElementById('updating-id').innerHTML = '';
            } else {
                console.error('Error on PUT ' + response.statusText);
            }
        })
        .catch(function (error) {
            console.error('Error on PUT:', error);
        });

    // Close the modal
    document.getElementById('btnCancel').click();
}

socket.addEventListener('editedProduct', (product) => {
    const { id, title, description, price } = product;

    // Updating product info
    document.getElementById(`title-${id}`).innerHTML = title;
    document.getElementById(`description-${id}`).innerHTML = description;
    document.getElementById(`price-${id}`).innerHTML = `$ ${price}`;
});

function newProduct() {
    // Open the modal
    document.getElementById('openModal').click();

    // Setting the title and button of the modal
    document.getElementById('titleModal').innerHTML = 'Add product';
    document.getElementById('btnModal').innerHTML = 'Save';
}

function saveNewProduct() {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const code = document.getElementById('code').value;
    const price = document.getElementById('price').value;
    const stock = document.getElementById('stock').value;
    const category = document.getElementById('category').value;

    const product = {
        title,
        description,
        code,
        price,
        stock,
        category,
    };

    fetch(`/api/products/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
    })
        .then(function (response) {
            if (response.ok) {
                response.json().then((data) => {
                    product.id = data.data.id || data.data._id;
                    socket.emit('newProduct', product);
                });
            } else {
                console.error('Error on POST ' + response.statusText);
            }
        })
        .catch(function (error) {
            console.error('Error on POST:', error);
        });

    // Close the modal
    document.getElementById('btnCancel').click();
}

socket.addEventListener('addedProduct', (product) => {
    const cardContainer = document.getElementById('card-container');
    const { id, title, description, price } = product;

    // Creating a new card
    const card = document.createElement('div');
    card.setAttribute('id', `card-${id}`);
    card.setAttribute(
        'class',
        'block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700'
    );

    card.innerHTML = `
            <div class="flex justify-end gap-2">
                <div class="edit cursor-pointer" id="edit-${id}">${svgEdit}</div>
                <div class="delete cursor-pointer" id="delete-${id}">${svgDelete}</div>
            </div>
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white" id="title-${id}">
                ${title}
            </h5>
            <p class="font-normal text-gray-700 dark:text-gray-400" id="description-${id}">
                ${description}
            </p>
            <div class="flex justify-end gap-2 font-medium text-xl" id="price-${id}">
                $ ${price}
            </div>
        `;
    cardContainer.appendChild(card);

    editBtn = document.getElementById(`edit-${id}`);
    deleteBtn = document.getElementById(`delete-${id}`);

    editBtn.addEventListener('click', () => {
        editProduct(id);
    });

    deleteBtn.addEventListener('click', () => {
        deleteProduct(id);
    });
});

// Prevent default action of the form
document.getElementById('formModal').addEventListener('submit', (e) => {
    e.preventDefault();
});

document.getElementById('cardNewProduct').addEventListener('click', () => {
    newProduct();
});

// Set the action of the button
document.getElementById('btnModal').addEventListener('click', () => {
    if (document.getElementById('updating-id').innerHTML) {
        saveEditProduct();
    } else {
        saveNewProduct();
    }
});
