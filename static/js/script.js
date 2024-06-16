// script.js
// document.addEventListener('DOMContentLoaded', function () {
//     document.getElementById('matchButton').addEventListener('click', function () {
//         document.getElementById('loadingMessage').style.display = 'block';
//         var xhr = new XMLHttpRequest();
//         xhr.open('POST', '/match_image', true);
//         xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
//         xhr.onload = function () {
//             if (xhr.status === 200) {
//                 var response = JSON.parse(xhr.responseText);
//                 if(response.matched_image_url) {
//                     document.getElementById('matchedImage').src = response.matched_image_url;
//                     document.getElementById('matchedImage').style.display = 'block';
//                     document.getElementById('matchedImageTitle').style.display = 'block';
//                 } else {
//                     console.error('No matched_image_url found in response');
//                 }
//             } else {
//                 console.error('Error matching image:', xhr.statusText);
//             }
//             document.getElementById('loadingMessage').style.display = 'none';
//         };
//         xhr.send('fileName=' + encodeURIComponent(document.getElementById('originalImage').src.split('/').pop()));
//     });
// });


document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('matchButton').addEventListener('click', function () {
        var startTime = performance.now(); // 记录开始时间

        document.getElementById('loadingMessage').style.display = 'block';

        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/match_image', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        xhr.onload = function () {
            var endTime = performance.now(); // 记录结束时间
            var duration = (endTime - startTime).toFixed(2); // 计算用时，保留两位小数

            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                if(response.matched_image_url) {
                    document.getElementById('matchedImage').src = response.matched_image_url;
                    document.getElementById('matchedImage').style.display = 'block';
                    document.getElementById('matchedImageTitle').style.display = 'block';
                } else {
                    console.error('No matched_image_url found in response');
                }
            } else {
                console.error('Error matching image:', xhr.statusText);
            }

            console.log('查找花费： ' + duration + ' milliseconds.'); // 打印用时
            // 设置用时元素的文本内容，并显示它
            document.getElementById('processingTime').textContent = duration;
            document.getElementById('timingInfo').style.display = 'block';

            document.getElementById('loadingMessage').style.display = 'none';
        };

        xhr.onerror = function () {
            console.error('Request error...');
            document.getElementById('loadingMessage').style.display = 'none';
        };

        xhr.send('fileName=' + encodeURIComponent(document.getElementById('originalImage').src.split('/').pop()));
    });
});