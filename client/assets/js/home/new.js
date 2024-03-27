import { getNews } from "../database/load.js";

(async function() {
    const navElements = $('.nav-item.nav-link');

    async function search(keyword) {
        return await getNews({
            "category_like": keyword,
            "_limit": "5"
        });
    }

    async function render() {
        const keyword = $(".nav-item.nav-link.active").text();
        const newsData = await search(keyword);
        const firstNews = newsData.shift(); // Remove the first news item from the array
        await loadFirst(firstNews);
        await loadRemain(newsData);
    }

    async function loadFirst(firstNews) {
        const frameNewsFirst = $("#new-first");
        const html = `<div class="whates-img">
                            <img src="${firstNews.thumbnail}" alt="">
                      </div>
                      <div class="whates-caption">
                          <h4><a href="${firstNews.source}">${firstNews.title}</a></h4>
                          <span>by ${firstNews.author} - Jun 19, 2020</span>
                          <p class="line-clamp line-2">${firstNews.shortDescription}</p>
                      </div>`;
        frameNewsFirst.html(html);
    }

    async function loadRemain(newsData) {
        const frameNews = $(".news-data");
        for (let index = 0; index < frameNews.length; index++) {
            const { thumbnail, title } = newsData[index]; // Destructure properties
            const html = `<div class="whats-right-img">
                              <img src="${thumbnail}" alt="">
                          </div>
                          <div class="whats-right-cap">
                              <span class="colorb">FASHION</span>
                              <h4><a class="line-clamp line-1" href="latest_news.html">${title}</a></h4>
                              <p>Jun 19, 2020</p>
                          </div>`;
            $(frameNews[index]).html(html);
        }
    }

    function addEvent() {
        render();
        navElements.on('click', render);
    }

    addEvent();
})();
