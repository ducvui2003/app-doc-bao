const apiKEY = "ddacf4bf26bd4584849ec4bd87d45335"
const URL = `https://newsapi.org/v2/everything?q=Technology&apiKey=${apiKEY}`
fetch(URL)
    .then(function (response) {
        return response.json();
    })
    .then(function (newsArray) {
        const newsData = newsArray.articles.slice(0, 10);
        newsData.forEach((news, index) => {
            const data = {
                author: news.author,
                title: news.title,
                shortDescription: news.description,
                source: news.url,
                thumbnail: news.urlToImage,
                createAt: news.publishedAt,
                content: news.content,
                category: ["technology"]
            }
            addNews(data)
            console.log("Done"+ index);
        });
    })

const URLLocal = "http://localhost:3000/news"
function addNews(news) {
  console.log(news);
    fetch(`${URLLocal}`, {
        method: "POST",
          headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(news)
    }).then((response) => {
        console.log(response.ok);
    })
}