// Load data
const URLLocal = "http://localhost:3000/news"
export async function getNews(object) {
    let queryString = "";
    for (const key in object) {
        if (Object.hasOwnProperty.call(object, key)) {
            const value = object[key];
            queryString+=`${key}=${value}&`;
        }
    }
    const response = await fetch(`${URLLocal}?${queryString}`);
    if (!response.ok) {
        throw new Error('Failed to fetch news');
    }
    const newsData = await response.json();
    return newsData;
}