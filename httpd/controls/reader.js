const endpoint = {
    auth: "http://localhost:3001/reader",
    article: "http://localhost:3000",
    addComment: "http://localhost:3000/addComment",
    signOut: 'http://localhost:3001/logout'
};

const token = localStorage.getItem('accessToken');
const role = localStorage.getItem('role');
const user = localStorage.getItem('user');

const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
};

let articleId;
let articles;
let articleIndex = 0;
const comment = document.getElementById('comment');
const nextArticleBtn = document.getElementById("nextArticleBtn");
const statusMessage = document.getElementById("statusMessage");
const signOutBtn = document.getElementById("signOut");

signOutBtn.onclick = signOut;
nextArticleBtn.onclick = getNextArticle;

async function onLoad(requiredRole) {
    if (!await isAuthenticated(requiredRole)) {
        window.location.href = 'signIn.html';
        return;
    }
    const readerPage = document.getElementById('readerPage');
    const userDiv = document.getElementById('userName');
    readerPage.style.display = 'block';
    userDiv.innerHTML = user;
    await updateAllArticles();
    await makePage();
}

function makePage() {
    if (articles === null) {
        return;
    }
    statusMessage.innerHTML = '';
    const headline = document.getElementById('headline');
    const body = document.getElementById('body');
    const commentsDiv = document.getElementById('otherComments');
    articleId = articles[articleIndex]._id;
    const commentsArray = articles[articleIndex].comments;
    headline.innerHTML = articles[articleIndex].title;
    body.innerHTML = articles[articleIndex].body;
    commentsDiv.innerHTML = '';
    if (!commentsArray || !commentsArray.length > 0) {
        return;
    }
    commentsArray.forEach(comment => {
        const li = document.createElement('li');
        li.className = "commentItem"
        li.textContent = `${comment.user}: ${comment.comment}`;
        commentsDiv.appendChild(li);
    });
}

async function postComment() {
    try {
        const dataToSend = {commentData: {"comment": comment.value, "user": user}, articleId: articleId};
        const response = await fetch(endpoint.addComment, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(dataToSend)
        });
        statusMessage.innerHTML = await response.text();
    } catch (error) {
        statusMessage.innerHTML = error.message;
    }
}

async function updateAllArticles() {
    try {
        const response = await fetch(endpoint.article, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        if (response.status === 200) {
            articles = await response.json();
        }
    } catch (error) {
        statusMessage.innerHTML = error;
    }
}

async function getNextArticle() {
    articleIndex++;
    if (articleIndex >= articles.length) {
        articleIndex = 0;
    }
    makePage();
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
        statusMessage.innerHTML = error;
        return false;
    }
}