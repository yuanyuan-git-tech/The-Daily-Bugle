const endpoint = {
    login: "http://localhost:3001/login",
    register: "http://localhost:3001/register"
};

const username = document.getElementById('username');
const password = document.getElementById('password');
const selectRoles = document.getElementById("Role");
const statusMessage = document.getElementById("statusMessage");

async function signIn(event) {
    event.preventDefault();
    try {
        if (!username.value|| !password.value) {
            statusMessage.innerHTML = "Username and password are required";
            return;
        }
        const dataToSend = {"username": username.value, "password": password.value};
        const response = await fetch(endpoint.login, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend)
        });
        if (response.status === 200) {
            const {accessToken, refreshToken, role, user} = await response.json();
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('role', role);
            localStorage.setItem('user', user);
            statusMessage.innerHTML = "Login Successfully";
            window.location.href = `${role}.html`;
        } else {
            statusMessage.innerHTML = await response.text();
        }
    } catch (error) {
        statusMessage.innerHTML = error.message;
    }
}

async function register(event) {
    event.preventDefault();
    if (!username.value|| !password.value) {
        statusMessage.innerHTML = "Username and password are required";
        return;
    }
    const selectRole = selectRoles.options[selectRoles.selectedIndex];
    try {
        const dataToSend = {"username": username.value, "password": password.value, "role": selectRole.value};
        const response = await fetch(endpoint.register, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend)
        });
        if (response.status === 200) {
            statusMessage.innerHTML = await response.text();
            window.location.href = 'signIn.html';
        }
    } catch (error) {
        statusMessage.innerHTML = error.message;
    }
}