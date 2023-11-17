const endpoint = {
    auth: "http://localhost:3001/reader",
    article: "http://localhost:3000",
    addComment: "http://localhost:3000/addComment",
    signOut: 'http://localhost:3001/logout',
    adsImage: "http://localhost:3002/adsImages/",
    ads: "http://localhost:3002",
    adsEvent: "http://localhost:3002/adsEvent"
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
const adsCloseBtn = document.getElementById('adsCloseButton');
const adsContainer = document.getElementById('adsContainer');
const adsImageContainer = document.getElementById("adsImage");
let adsImagesIndex = 0;
let adsImages;
let shouldIncrementIndex = true;


signOutBtn.onclick = signOut;
nextArticleBtn.onclick = getNextArticle;
adsCloseBtn.onclick = () => {
    adsContainer.style.display = 'none';
    shouldIncrementIndex = false;
    setTimeout(() => {
        adsContainer.style.display = 'block';
        shouldIncrementIndex = true;
    }, 5000); // Reappear after 5 seconds
};
adsImageContainer.onclick = async () => {
    await postAdsEvent("interaction");
}

setInterval(changeImage, 5000);

async function changeImage() {
    if (!shouldIncrementIndex) {
        return;
    }
    adsImagesIndex++;
    if (adsImagesIndex >= adsImages.length) {
        adsImagesIndex = 0;
    }
    adsImageContainer.src = endpoint.adsImage + adsImages[adsImagesIndex].image;
    await postAdsEvent("impression");
}

async function postAdsEvent(event) {
    try {
        const dataToSend = {event: event, ads_id: adsImages[adsImagesIndex]._id, user: user};
        console.log(dataToSend);
        const res = await fetch(endpoint.adsEvent, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend)
        })
    } catch (error) {

    }
}



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
    const adsImageResponse = fetch(endpoint.ads);
    adsImageResponse.then(res => res.json())
        .then(res => {
            adsImages = res;
            if (!adsImages || adsImages.length === 0) {
                return;
            }
            adsImageContainer.src = endpoint.adsImage + adsImages[adsImagesIndex].image;
        });
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