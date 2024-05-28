// Get the query parameter from the URL
//       const queryString = window.location.search;
//       const urlParams = new URLSearchParams(queryString);
//       const data = urlParams.get('data');

// Use the data as needed
// console.log('Received data:', data);

var url = 'http://localhost:3000/news';

// 2.1.2 lấy ra id của bài báo tren thanh url
console.log("Window location: ", window.location);
const queryString = window.location.search;
console.log("Keys & Value: ", queryString);
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get('id');
console.log("ID: ", id);




//
fetch(url)
    .then(response => response.json())
    .then(function (posts){
        var foundPost = posts.find(post => post.id === id);
        if (foundPost) {
            // Bài viết được tìm thấy
            // 2.1.7 Lay ra thong tin chi tiet baoi bao
            console.log('Found post:', foundPost);
            var title = foundPost.title; // Lấy tiêu đề
            var thumbnail = foundPost.thumbnail; // Lấy đường dẫn hình ảnh
            var content = foundPost.content; // Lấy nội dung
            var category = foundPost.category; // Lấy nội dung

            // Đưa thông tin vào các phần tử HTML\
            // 2.1.9 hien thi chi tiet bai bao
            document.getElementById('news__title').innerHTML = title;
            document.getElementById('news__thumbnail').src = thumbnail;
            document.getElementById('content').innerHTML = content;
            document.getElementById('category').innerHTML = category;





        } else {
            // Khong tim thay bai bao
            window.location.assign('notfound.html');
            console.log('Post not found');
        }

    })
    .catch(error => {
        // Xử lý lỗi nếu có
        console.error('Error:', error);
    });



