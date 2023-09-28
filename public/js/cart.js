const cartIdDiv = document.getElementById('cartID');
const tbodyProd = document.getElementById('tbody-products');

document.getElementById('clearCart').addEventListener('click', async () => {
    const confirm = window.confirm('Are you sure to empty your cart?');
    if (!confirm) return;

    const response = await fetch('/api/carts/' + cartIdDiv.innerText, {
        method: 'DELETE',
    });
    const data = await response.json();
    console.log(data);
    location.reload();
});

async function deleteItem(id) {
    const confirm = window.confirm(
        'Are you sure to remove the product from your cart?'
    );
    if (!confirm) return;

    const response = await fetch(
        '/api/carts/' + cartIdDiv.innerText + '/product/' + id,
        {
            method: 'DELETE',
        }
    );
    const data = await response.json();
    console.log(data);
    location.reload();
}

async function getProducts() {
    const res = await fetch('/api/carts/' + cartIdDiv.innerText);
    const data = await res.json();

    let totalQ = 0;
    let totalP = 0;

    data.data.forEach((item) => {
        tbodyProd.innerHTML += addRow(item);
        totalQ += item.quantity;
        totalP += item.product.price * item.quantity;
    });

    document.querySelectorAll('.deleteBtn').forEach((btn) => {
        btn.addEventListener('click', () => {
            deleteItem(btn.id.split('-')[1]);
        });
    });

    document.getElementById('totalQ').innerHTML = totalQ;
    document.getElementById('totalP').innerHTML = `$ ${totalP}`;
}

getProducts();

function addRow(item) {
    return `
    <tr class="bg-white dark:bg-gray-800">
        <th scope="row" class="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            ${item.product.title}
        </th>
        <td class="px-4 py-2">
            ${item.quantity}
        </td>
        <td class="px-4 py-2">
            $ ${item.product.price}
        </td>
        <td class="px-4 py-2">
            $ ${item.quantity * item.product.price}
        </td>
        <td class="px-4 py-2">
            <button id="delete-${item.product._id}" class="deleteBtn">
            <svg
                xmlns='http://www.w3.org/2000/svg'
                width='20'
                height='20'
                fill='red'
                class='h-5 w-5'
                viewBox='0 0 20 20'
            >
                <path fill="red" d="M16.471,5.962c-0.365-0.066-0.709,0.176-0.774,0.538l-1.843,10.217H6.096L4.255,6.5c-0.066-0.362-0.42-0.603-0.775-0.538C3.117,6.027,2.876,6.375,2.942,6.737l1.94,10.765c0.058,0.318,0.334,0.549,0.657,0.549h8.872c0.323,0,0.6-0.23,0.656-0.549l1.941-10.765C17.074,6.375,16.833,6.027,16.471,5.962z"></path>
                <path fill="red" d="M16.594,3.804H3.406c-0.369,0-0.667,0.298-0.667,0.667s0.299,0.667,0.667,0.667h13.188c0.369,0,0.667-0.298,0.667-0.667S16.963,3.804,16.594,3.804z"></path>
                <path fill="red" d="M9.25,3.284h1.501c0.368,0,0.667-0.298,0.667-0.667c0-0.369-0.299-0.667-0.667-0.667H9.25c-0.369,0-0.667,0.298-0.667,0.667C8.583,2.985,8.882,3.284,9.25,3.284z"></path>
            </svg>
            </button>
        </td>
    </tr>
    `;
}
