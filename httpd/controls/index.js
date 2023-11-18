const endpoint = {
    article: "/article_node",
    image: "/article_node/image",
    adsImage: "/ads_node/adsImages/",
    ads: "/ads_node",
    adsEvent: "/ads_node/adsEvent"
};

const nextArticleBtn = document.getElementById('nextArticleBtn');
const adsCloseBtn = document.getElementById('adsCloseButton');
const adsContainer = document.getElementById('adsContainer');
const adsImageContainer = document.getElementById("adsImage");
let articleIndex = 0;
let articles;
let adsImagesIndex = 0;
let adsImages;
let shouldIncrementIndex = true;
const user = "anon";

nextArticleBtn.onclick = () => {
    makeStoryPageWithoutLogin();
}
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
        console.log(error.message);
    }
}

function fetchAndListStoryWithoutLogin() {
    const response = fetch(endpoint.article);
    response.then(res =>
        res.json()).then(res => {
        articles = res;
        makeStoryPageWithoutLogin();
    });
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

function makeStoryPageWithoutLogin() {
    const container = document.getElementById('storiesContainer');
    container.innerHTML = '';
    const articlesToShow = Math.min(3, articles.length - articleIndex);

    for (let i = 0; i < articlesToShow; i++) {
        const div = document.createElement('div');
        const headline = document.createElement('div');
        headline.className = 'headline';
        headline.innerHTML = articles[articleIndex + i]['title'];
        const img = document.createElement("img");
        img.src = `${endpoint.image}/${articles[articleIndex + i]['imageName']}`;
        const content = document.createElement('div');
        content.innerHTML = articles[articleIndex + i]['body'];
        content.className = 'body';
        div.appendChild(headline);
        div.appendChild(content);
        div.appendChild(img);
        container.appendChild(div);
    }
    articleIndex += articlesToShow;
    if (articleIndex >= articles.length) {
        articleIndex = 0;
    }
}


