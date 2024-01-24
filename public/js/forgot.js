const email = document.getElementById('email');
const btnSend = document.getElementById('btnSend');
const msgSent = document.getElementById('msgSent');
const errorMsg = document.getElementById('errorMsg');


const sendForm = async () => {
    if (email.value === '') {
        showError('Email is required!')
        return;
    }

    const res = await fetch('/api/sessions/forgotPassword', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.value }),
    });

    const data = await res.json();

    if (data.status === 'error') {
        showError(data.message)
        return;
    }

    if (data.status === 'ok') {
        email.value = '';
        msgSent.classList.remove('hidden');
    }
}

const showError = msg => {
    Toastify({
        text: msg,
        duration: 2000,
        gravity: 'top', // `top` or `bottom`
        position: 'center', // `left`, `center` or `right`
        style: {
            background: "linear-gradient(to right, #B52828, #E84722)",
        }
    }).showToast();
}

email.addEventListener('input', () => {
    msgSent.classList.add('hidden');
    errorMsg.classList.add('hidden');
})

email.addEventListener('change', sendForm)
