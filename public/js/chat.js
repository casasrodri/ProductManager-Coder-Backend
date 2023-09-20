const socket = io();

const containerMsg = document.getElementById('container-sms');
const thisUsername = document.getElementById('username');
const thisEmail = document.getElementById('email');

const btnSend = document.getElementById('send-message');
const inputMsg = document.getElementById('input-message');

function getUserInfo() {
    const localUsername = localStorage.getItem('username');
    const localEmail = localStorage.getItem('email');

    if (!localUsername || !localEmail) {
        localStorage.setItem('username', window.prompt('Enter your username:'));
        localStorage.setItem('email', window.prompt('Enter your email:'));
    }

    thisUsername.value = localStorage.getItem('username');
    thisEmail.value = localStorage.getItem('email');
}

getUserInfo();

function sendMessage() {
    if (inputMsg.value === '') return;

    socket.emit(
        'newMessage',
        thisEmail.value,
        thisUsername.value,
        inputMsg.value
    );

    inputMsg.value = '';
}

btnSend.addEventListener('click', () => {
    sendMessage();
});

inputMsg.addEventListener('change', (e) => {
    sendMessage();
});

thisUsername.addEventListener('input', () => {
    localStorage.setItem('username', thisUsername.value);
});

thisEmail.addEventListener('input', () => {
    localStorage.setItem('email', thisEmail.value);
});

const formatMessage = (username, email, text) => {
    const currentUser = email === thisEmail.value;
    return `
        <div title="${email}" class='block max-w-lg p-2 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 justify-self-${
        currentUser ? 'end' : 'start'
    }'>
            <h5 class='mb-1 text-xs font-semibold tracking-tight text-gray-900 dark:text-white text-${
                currentUser ? 'right' : 'left'
            }'>
                ${username}
            </h5>
            <p class='font-normal text-xs text-gray-700 dark:text-gray-400 text-${
                currentUser ? 'right' : 'left'
            }'>
                ${text}
            </p>
        </div>
    `;
};

socket.on('allMessages', (messages) => {
    containerMsg.innerHTML = '';

    messages.forEach((m) => {
        containerMsg.innerHTML += formatMessage(m.name, m.user, m.text);
    });

    window.scrollTo(0, document.body.scrollHeight);
});
