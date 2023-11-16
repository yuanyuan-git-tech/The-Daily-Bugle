const endpoint = {
    auth: "http://localhost:3001/author",
    article: "http://localhost:3000/addStory",
    uploadImg: 'http://localhost:3000/upload',
    update: 'http://localhost:3000/updateStory',
    signOut: 'http://localhost:3001/logout'
};

const token = localStorage.getItem('accessToken');
const role = localStorage.getItem('role');
const user = localStorage.getItem('user');

const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
};

const body = document.getElementById('body');
const title = document.getElementById('title');
const teaser = document.getElementById("teaser");
const categories = document.getElementById('categories');
const imageFile = document.getElementById('imageFile');
const statusMessage = document.getElementById("statusMessage");
const signOutBtn = document.getElementById("signOut");

signOutBtn.onclick = signOut;

async function onLoad(requiredRole) {
    if (!await isAuthenticated(requiredRole)) {
        window.location.href = 'signIn.html';
        return;
    }
    const authorPage = document.getElementById('authorPage');
    authorPage.style.display = 'block';
    const userDiv = document.getElementById('userName');
    userDiv.innerHTML = user;
}

async function postArticle(event) {
    event.preventDefault();
    try {
        const file = imageFile.files[0];
        if (!file) {
            statusMessage.innerHTML = "Can't upload image";
            return;
        }
        const formData = new FormData();
        formData.append('image', file);
        await fetch(endpoint.uploadImg, {
            method: 'POST',
            body: formData
        });
        const fileName = file.name;
        const selectCategories = categories.options[categories.selectedIndex];
        const dataToSend = {
            title: title.value,
            body: body.value,
            teaser: teaser.value,
            categories: selectCategories.value,
            imageName: fileName
        };
        const response = await fetch(endpoint.article, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(dataToSend)
        });
        statusMessage.innerHTML = await response.text();
    } catch (error) {
        statusMessage.innerHTML = error.message;
    }
}

async function signOut() {
    try {
        const dataToSend = {
            username: user
        };
        const response = await fetch(endpoint.signOut, {
            method: 'POST',
            body: JSON.stringify(dataToSend)
        })
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        localStorage.removeItem('refreshToken');
        window.location.href = 'index.html';
    } catch (error) {
        statusMessage.innerHTML = error.message;
    }
}

async function isAuthenticated(requiredRole) {
    if (role !== requiredRole) {
        return false;
    }
    try {
        const response = await fetch(endpoint.auth, {
            method: 'GET',
            headers: headers,
        });
        return response.status === 200;
    } catch (error) {
        return false;
    }
}
