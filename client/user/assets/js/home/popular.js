import callAjax from "../database/load.js";
// Popular news: views and research higher
// New news: createAt = now
// Trending news:  views and research higher
(async function () {
    try {
        const URLLocal = "http://localhost:3000/news"
        const arrayNews = await callAjax(URLLocal, {
            "_limit": 4
        });

        $('.weekly2-single').each((index, element) => {
            $(element).find('.weekly2-img img').attr('src', arrayNews[index].thumbnail);
            $(element).find('.weekly2-caption a').attr('href', arrayNews[index].source).text(arrayNews[index].title);
            $(element).find('.weekly2-caption p').text(`${arrayNews[index].author} | ${arrayNews[index].createdAt}`);
        });
        // Weekly-2 Active Effect
        $('.weekly2-news-active').slick({
            dots: false,
            infinite: true,
            speed: 500,
            arrows: true,
            autoplay: true,
            loop: true,
            slidesToShow: 3,
            prevArrow: '<button type="button" class="slick-prev"><i class="ti-angle-left"></i></button>',
            nextArrow: '<button type="button" class="slick-next"><i class="ti-angle-right"></i></button>',
            slidesToScroll: 1,
            responsive: [
                {
                    breakpoint: 1200,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1,
                        infinite: true,
                        dots: false,
                    }
                },
                {
                    breakpoint: 992,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 700,
                    settings: {
                        arrows: false,
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        arrows: false,
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]
        });
    } catch (error) {
        console.error('Error rendering popular news:', error);
    }
})();

