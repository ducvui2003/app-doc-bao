import callAjax from "../database/load.js";
(async function () {
    const URLLocal = "http://localhost:3000/news"
    const navElements = $('.nav-item.nav-link');
    const newsElement = $('.news__section')

    function placeholder(element) {
        function addClassToChildren(element) {
            $(element).find('*').addClass('placeholder');
        }
        addClassToChildren(element)
    }

    function complete(element) {
        function removeClassToChildren(element) {
            $(element).find('*').removeClass('placeholder');
        }
        removeClassToChildren(element)
    }
    async function search(keyword) {
        return await callAjax(URLLocal, {
            "category_like": keyword,
            "_limit": "5"
        }, function () {
            newsElement.each((index, element) => {
                placeholder(element);
            });
        }, function () {
            newsElement.each((index, element) => {
                complete(element);
            });
        });
    }

    function load(arrayNews) {
        if (arrayNews.length >= newsElement.length) {
            newsElement.each((index, element) => {
                const { thumbnail, title, source, author, shortDescription } = arrayNews[index];
                $(element).find('.news__thumbnail').attr('src', thumbnail);
                $(element).find('.news__link').attr('href', source);
                $(element).find('.news__title').text(title);
                $(element).find('.news__author').text(author);
                $(element).find('.news__desc').text(shortDescription);
            });
        }
    }

    function addEventNav() {
        navElements.each((index, element) => {
            $(element).on('click', (e) => {
                render();
            });
        })
    }
    async function render() {
        const keyword = $(".nav-item.nav-link.active.show").text();
        const newsData = await search(keyword);
        load(newsData);
    }
    await render()
    addEventNav();
})();
