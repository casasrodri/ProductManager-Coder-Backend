const msgTokenExp = document.getElementById('msgTokenExp');
const msgNewToken = document.getElementById('msgNewToken');
const pageTimer = document.getElementById('pageTimer');
const tokenReset = document.getElementById('tokenReset');
const email = document.getElementById('email');
const password = document.getElementById('password');

const setCountDown = (exp) => {

    let countDownDate = new Date(exp * 1000).getTime();

    // Update the count down every 1 second
    let x = setInterval(function () {

        // Get today's date and time
        let now = new Date().getTime();

        // Find the distance between now and the count down date
        let distance = countDownDate - now;

        // Time calculations for days, hours, minutes and seconds
        let days = Math.floor(distance / (1000 * 60 * 60 * 24));
        let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Display the result in the element with id="demo"
        pageTimer.innerHTML = ''

        if (minutes > 0) {
            if (minutes === 1) {
                pageTimer.innerHTML += `1 minute `
            } else {
                pageTimer.innerHTML += `${minutes} minutes `
            }
        }

        if (seconds === 1) {
            pageTimer.innerHTML += `1 second`
        } else {
            pageTimer.innerHTML += `${seconds} seconds`
        }

        // If the count down is finished, write some text
        if (distance < 0) {
            clearInterval(x);
            msgTokenExp.innerHTML = 'Your token has expired!';
            msgNewToken.classList.remove('hidden');
            tokenReset.innerText = ''
        }
    }, 1000);
}

const sendReset = async () => {

    if (password.value === '') {
        return showError('Please enter a new password.')
    }

    if (tokenReset.innerText === '') {
        return showError('Token expired.')
    }

    const newPassword = {
        token: tokenReset.innerText,
        email: email.value,
        password: password.value
    }

    const res = await fetch('/api/sessions/resetPassword', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPassword)
    })

    const data = await res.json()

    console.log(data)

    if (data.status === 'ok') {
        window.location.href = '/login'
    } else {
        showError(data.message)
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
