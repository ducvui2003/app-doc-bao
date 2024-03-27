import { getNews } from "../database/load.js";
function getLabelClass(category) {
    let className;
    switch (category.toUppercase) {
        case "BUSINESS": {
            className = "bgr";
            break;
        }
        case "TECH": {
             className = "bgg";
            break;
        }
        case "BITCOIN": {
            className = "bgy";
            break;
        }
        case "FASHION": {
            className = "bgb";
            break;
        }
        default: className = "bgr"
    }
    return className;
}
const listTrendingBusiness = $('[data-trend]');
// Get trending
async function getTrending() {
    const newsData = await getNews({
        "category_like": "business",
        "_limit": 4
    })
    return newsData;
}
function render() {
    getTrending().then((news) => {
        listTrendingBusiness.each((index, element) => {
            const category = news[index].category[0];
            const html = `<div class="trend-top-img">
                <img src="${news[index].thumbnail}"
                    alt="">
                <div class="trend-top-cap trend-top-cap2">
                    <span class="${getLabelClass(category)}" style = "text-transform: uppercase;">${category}</span>
                    <h2><a href="latest_news.html">${news[index].title}</a></h2>
                    <p>by ${news[index].author} - Jun 19, 2020</p>
                </div>
            </div>`
            $(element).html(html);
        })
    })

}

render();