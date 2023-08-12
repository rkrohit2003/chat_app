const socket = io('http://localhost:8000');

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageIn')
const messageContainer = document.querySelector(".container")

const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.classList.add(position);

    const messageContent = document.createElement('span');
    const messageParts = message.split(':');
    if (messageParts.length > 1) {
        messageContent.innerHTML = `<b>${messageParts[0]}:</b> ${messageParts.slice(1).join(':')}`;
    } else {
        messageContent.textContent = message;
    }

    messageElement.appendChild(messageContent);
    messageContainer.appendChild(messageElement);
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
})

const userName = prompt("Enter your name to join");
if (userName) {
    socket.emit('new-user-joined', userName);

    socket.on('user-joined', userName => {
        append(`${userName} joined the chat`, 'middle');
    });

    socket.on('receive', data => {
        append(`${data.userName}: ${data.message}`, 'left');
    });

    socket.on('left', userName => {
        append(`${userName} left the chat`, 'middle');
    });
}