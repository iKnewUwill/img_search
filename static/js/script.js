// 智能图像匹配系统 - 增强版JavaScript

document.addEventListener('DOMContentLoaded', function () {
    // 主题切换功能
    const themeToggle = document.querySelector('.theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // 检查本地存储中的主题设置
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
        document.body.setAttribute('data-theme', 'dark');
    }
    
    themeToggle.addEventListener('click', function() {
        if (document.body.getAttribute('data-theme') === 'dark') {
            document.body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        } else {
            document.body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    });

    // 拖拽上传功能
    const uploadContainer = document.getElementById('uploadContainer');
    const fileInput = document.getElementById('fileInput');
    const uploadForm = document.getElementById('uploadForm');
    const progressContainer = uploadContainer.querySelector('.progress-container');
    const progressBar = document.getElementById('progressBar');
    
    // 拖拽事件处理
    uploadContainer.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadContainer.classList.add('drag-over');
    });
    
    uploadContainer.addEventListener('dragleave', function() {
        uploadContainer.classList.remove('drag-over');
    });
    
    uploadContainer.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadContainer.classList.remove('drag-over');
        
        if (e.dataTransfer.files.length) {
            const file = e.dataTransfer.files[0];
            if (validateFile(file)) {
                handleFileUpload(file);
            }
        }
    });
    
    // 点击上传
    uploadContainer.addEventListener('click', function() {
        fileInput.click();
    });
    
    fileInput.addEventListener('change', function() {
        if (this.files.length) {
            const file = this.files[0];
            if (validateFile(file)) {
                handleFileUpload(file);
            }
        }
    });
    
    // 文件验证
    function validateFile(file) {
        // 检查文件类型
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            showNotification('error', '不支持的文件格式，请上传 JPG、PNG 或 WEBP 图片');
            return false;
        }
        
        // 检查文件大小（10MB）
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            showNotification('error', '文件大小超过限制，请上传小于 10MB 的图片');
            return false;
        }
        
        return true;
    }
    
    // 文件上传处理
    function handleFileUpload(file) {
        // 创建表单数据
        const formData = new FormData();
        formData.append('file', file);
        
        // 创建上传请求
        const xhr = new XMLHttpRequest();
        
        // 显示进度条
        progressContainer.style.display = 'block';
        progressBar.style.width = '0%';
        
        // 上传进度事件
        xhr.upload.addEventListener('progress', function(e) {
            if (e.lengthComputable) {
                const percentComplete = (e.loaded / e.total) * 100;
                progressBar.style.width = percentComplete + '%';
            }
        });
        
        // 上传完成事件
        xhr.addEventListener('load', function() {
            progressContainer.style.display = 'none';
            
            if (xhr.status === 200) {
                showNotification('success', '图片上传成功！');
                // 刷新页面以显示新上传的图片
                window.location.reload();
            } else {
                showNotification('error', '上传失败，请重试');
            }
        });
        
        // 上传错误事件
        xhr.addEventListener('error', function() {
            progressContainer.style.display = 'none';
            showNotification('error', '网络错误，请检查连接后重试');
        });
        
        // 发送请求
        xhr.open('POST', '/', true);
        xhr.send(formData);
    }
    
    // 匹配图片功能
    const matchButton = document.getElementById('matchButton');
    const loadingMessage = document.getElementById('loadingMessage');
    
    matchButton.addEventListener('click', function() {
        // 检查是否有上传的图片
        const originalImage = document.getElementById('originalImage');
        if (!originalImage.src || originalImage.src.includes('data:image/svg+xml')) {
            showNotification('error', '请先上传图片再进行匹配');
            return;
        }
        
        var startTime = performance.now(); // 记录开始时间
        
        loadingMessage.style.display = 'block';
        matchButton.disabled = true;
        
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/match_image', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        
        xhr.onload = function() {
            var endTime = performance.now(); // 记录结束时间
            var duration = (endTime - startTime).toFixed(2); // 计算用时，保留两位小数
            
            matchButton.disabled = false;
            loadingMessage.style.display = 'none';
            
            if (xhr.status === 200) {
                try {
                    var response = JSON.parse(xhr.responseText);
                    if(response.matched_image_url) {
                        const matchedImage = document.getElementById('matchedImage');
                        const matchedImageTitle = document.getElementById('matchedImageTitle');
                        
                        // 设置新的图片源并监听加载完成
                        matchedImage.onload = function() {
                            // 显示匹配结果
                            matchedImage.style.display = 'block';
                            matchedImageTitle.style.display = 'block';
                            
                            // 平滑滚动到结果区域
                            matchedImage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        };
                        
                        matchedImage.src = response.matched_image_url;
                        
                        // 显示处理时间
                        document.getElementById('processingTime').textContent = duration;
                        document.getElementById('timingInfo').style.display = 'block';
                        
                        showNotification('success', '匹配完成！');
                    } else {
                        throw new Error('未找到匹配图片');
                    }
                } catch (error) {
                    console.error('解析响应失败:', error);
                    showNotification('error', '匹配失败，请重试');
                }
            } else {
                console.error('匹配图片时出错:', xhr.statusText);
                showNotification('error', '服务器错误，请稍后重试');
            }
        };
        
        xhr.onerror = function() {
            matchButton.disabled = false;
            loadingMessage.style.display = 'none';
            showNotification('error', '网络请求失败，请检查连接');
        };
        
        xhr.send('fileName=' + encodeURIComponent(originalImage.src.split('/').pop()));
    });
    
    // 通知提示功能
    function showNotification(type, message) {
        const notificationId = type === 'success' ? 'successNotification' : 'errorNotification';
        const notification = document.getElementById(notificationId);
        
        // 如果是错误通知，设置错误消息
        if (type === 'error') {
            document.getElementById('errorMessage').textContent = message;
        }
        
        // 显示通知
        notification.classList.add('visible');
        
        // 3秒后自动隐藏
        setTimeout(function() {
            notification.classList.remove('visible');
        }, 3000);
    }
    
    // 添加页面加载动画
    document.body.classList.add('loaded');
});

// 图片懒加载和优化
window.addEventListener('load', function() {
    // 为所有图片添加淡入效果
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease';
        
        if (img.complete) {
            img.style.opacity = '1';
        } else {
            img.addEventListener('load', function() {
                img.style.opacity = '1';
            });
        }
    });
});