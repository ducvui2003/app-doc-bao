import {getNews} from "../database/load.js";
// Popular news: views and research higher
// New news: createAt = now
// Trending news:  views and research higher

function formPopular(newsArray) {
    return newsArray.map((news) => {
        return ` <div class="weekly2-single">
                    <div class="weekly2-img">
                        <img src="${news.thumbnail}"
                            alt="">
                    </div>
                    <div class="weekly2-caption">
                        <h4><a href="${news.source}" class = "line-clamp line-1">${news.title}</a></h4>
                        <p>${news.author} | 2 hours ago</p>
                    </div>
                </div>`
    })
}

// Update your code to handle the asynchronous nature of getNews
async function renderPopular() {
    try {
        const newsData = await getNews({
            "_limit": 3
        });
        const popular = $('.weekly2-news-active');
        popular.html(formPopular(newsData));
    } catch (error) {
        console.error('Error rendering popular news:', error);
    }
}

// Call renderPopular to fetch and render the popular news
renderPopular();


