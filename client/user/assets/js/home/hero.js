import callAjax from "../database/load.js";
(async function () {
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
    const URLLocal = "http://localhost:3000/news"
    const listTrendingBusiness = $('.news-trend');
    const data = await callAjax(URLLocal, {
        "category_like": "business",
        "_limit": listTrendingBusiness.length
    })
    listTrendingBusiness.each((index, element) => {
        $(element).find(".news-trend-title").text(data[index].title);
        $(element).find(".news-trend-para").text(data[index].shortDescription);
        $(element).find(".news-trend-thumb").attr("src", data[index].thumbnail).attr("alt", data[index].title)
    })
})();