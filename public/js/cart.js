const cartIdDiv = document.getElementById('cartID');
const containerProducts = document.getElementById('container-products');
const totalCart = document.getElementById('totalCart');
const tbodyProd = document.getElementById('tbody-products');

fetch('/api/carts/' + cartIdDiv.innerText)
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        let totalQ = 0;
        let totalP = 0;

        data.data.forEach((item) => {
            tbodyProd.innerHTML += addRow(item);
            totalQ += item.quantity;
            totalP += item.product.price * item.quantity;
        });

        document.getElementById('totalQ').innerHTML = totalQ;
        document.getElementById('totalP').innerHTML = `$ ${totalP}`;
    })
    .catch((err) => {
        console.log(err);
    });

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
    </tr>
    `;
}
