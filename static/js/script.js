// 智能图像匹配系统 - JavaScript功能模块

// DOM元素缓存
const dom = {
    html: document.documentElement,
    themeToggle: document.getElementById('themeToggle'),
    themeIcon: document.querySelector('#themeToggle i'),
    dropArea: document.getElementById('dropArea'),
    fileInput: document.getElementById('fileInput'),
    uploadForm: document.getElementById('uploadForm'),
    uploadProgress: document.getElementById('uploadProgress'),
    progressBar: document.querySelector('.progress-bar'),
    progressText: document.querySelector('.progress-text'),
    matchButton: document.getElementById('matchButton'),
    loadingMessage: document.getElementById('loadingMessage'),
    originalImage: document.getElementById('originalImage'),
    matchedImage: document.getElementById('matchedImage'),
    matchedImageTitle: document.getElementById('matchedImageTitle'),
    matchedImageContainer: document.querySelector('.matched-image-container'),
    timingInfo: document.getElementById('timingInfo'),
    processingTime: document.getElementById('processingTime'),
    notification: document.getElementById('notification'),
    notificationIcon: document.getElementById('notificationIcon'),
    notificationMessage: document.getElementById('notificationMessage'),
    notificationClose: document.querySelector('.notification-close')
};

// 工具函数
const utils = {
    // 显示通知
    showNotification(message, type = 'success') {
        dom.notificationMessage.textContent = message;
        dom.notification.className = `notification ${type}`;
        dom.notificationIcon.className = `fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`;
        dom.notification.style.display = 'flex';
        
        // 自动关闭
        setTimeout(() => {
            utils.hideNotification();
        }, 5000);
    },
    
    // 隐藏通知
    hideNotification() {
        dom.notification.style.display = 'none';
    },
    
    // 检查是否支持File API
    isFileApiSupported() {
        return window.File && window.FileReader && window.FormData;
    },
    
    // 验证文件类型
    isValidFileType(file) {
        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        return validTypes.includes(file.type);
    },
    
    // 获取文件扩展名
    getFileExtension(filename) {
        return filename.split('.').pop().toLowerCase();
    }
};

// 主题切换功能
function setupThemeToggle() {
    // 从localStorage恢复主题偏好
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        dom.html.classList.remove('theme-light');
        dom.html.classList.add('theme-dark');
        dom.themeIcon.className = 'fas fa-sun';
    }
    
    // 主题切换事件
    dom.themeToggle.addEventListener('click', () => {
        const isDark = dom.html.classList.toggle('theme-dark');
        dom.html.classList.toggle('theme-light', !isDark);
        
        // 更新图标
        dom.themeIcon.className = `fas ${isDark ? 'fa-sun' : 'fa-moon'}`;
        
        // 保存主题偏好
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}

// 拖拽上传功能
function setupDragAndDrop() {
    if (!utils.isFileApiSupported()) {
        utils.showNotification('您的浏览器不支持文件上传功能，请更新浏览器', 'error');
        return;
    }
    
    // 拖拽事件处理
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dom.dropArea.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    // 高亮拖拽区域
    ['dragenter', 'dragover'].forEach(eventName => {
        dom.dropArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dom.dropArea.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
        dom.dropArea.classList.add('active');
    }
    
    function unhighlight() {
        dom.dropArea.classList.remove('active');
    }
    
    // 处理文件拖放
    dom.dropArea.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files.length) {
            handleFiles(files);
        }
    }
    
    // 文件选择处理
    dom.fileInput.addEventListener('change', function() {
        if (this.files.length) {
            handleFiles(this.files);
        }
    });
    
    // 处理文件上传
    function handleFiles(files) {
        const file = files[0];
        
        // 验证文件类型
        if (!utils.isValidFileType(file)) {
            utils.showNotification('请上传有效的图片文件（JPG、PNG、WEBP或GIF）', 'error');
            return;
        }
        
        // 验证文件大小（限制为10MB）
        if (file.size > 10 * 1024 * 1024) {
            utils.showNotification('文件大小不能超过10MB', 'error');
            return;
        }
        
        // 显示上传进度
        dom.uploadProgress.style.display = 'block';
        
        // 模拟上传进度
        let progress = 0;
        const interval = setInterval(() => {
            progress += 5;
            updateProgress(progress);
            
            if (progress >= 100) {
                clearInterval(interval);
                // 实际项目中这里应该有真实的文件上传逻辑
                setTimeout(() => {
                    utils.showNotification('文件上传成功');
                    // 这里可以添加处理上传成功后的逻辑
                    dom.uploadProgress.style.display = 'none';
                }, 500);
            }
        }, 100);
    }
    
    // 更新进度条
    function updateProgress(percent) {
        dom.progressBar.style.width = `${percent}%`;
        dom.progressText.textContent = `${percent}%`;
    }
}

// 图片匹配功能
function setupImageMatching() {
    dom.matchButton.addEventListener('click', function() {
        // 禁用按钮防止重复点击
        this.disabled = true;
        
        // 记录开始时间
        const startTime = performance.now();
        
        // 显示加载指示器
        dom.loadingMessage.style.display = 'flex';
        
        // 创建XHR请求
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/match_image', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        
        // 监听进度（如果服务器支持）
        xhr.upload.addEventListener('progress', function(e) {
            if (e.lengthComputable) {
                const percentComplete = (e.loaded / e.total) * 100;
                // 这里可以更新UI显示上传进度
            }
        });
        
        // 响应处理
        xhr.onload = function() {
            // 计算处理时间
            const endTime = performance.now();
            const duration = (endTime - startTime).toFixed(2);
            
            // 启用按钮
            dom.matchButton.disabled = false;
            
            // 隐藏加载指示器
            dom.loadingMessage.style.display = 'none';
            
            if (xhr.status === 200) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    if (response.matched_image_url) {
                        // 更新匹配图片
                        dom.matchedImage.src = response.matched_image_url;
                        dom.matchedImage.style.display = 'block';
                        dom.matchedImageTitle.style.display = 'block';
                        dom.matchedImageContainer.style.display = 'block';
                        
                        // 滚动到匹配结果
                        dom.matchedImageContainer.scrollIntoView({ 
                            behavior: 'smooth',
                            block: 'start'
                        });
                        
                        // 显示处理时间
                        dom.processingTime.textContent = duration;
                        dom.timingInfo.style.display = 'flex';
                        
                        // 显示成功通知
                        utils.showNotification('图片匹配成功');
                    } else {
                        utils.showNotification('未找到匹配图片', 'error');
                        console.error('No matched_image_url found in response');
                    }
                } catch (error) {
                    utils.showNotification('解析响应失败', 'error');
                    console.error('Error parsing response:', error);
                }
            } else {
                utils.showNotification('图片匹配失败', 'error');
                console.error('Error matching image:', xhr.statusText);
            }
        };
        
        // 错误处理
        xhr.onerror = function() {
            dom.matchButton.disabled = false;
            dom.loadingMessage.style.display = 'none';
            utils.showNotification('网络请求失败', 'error');
            console.error('Request error...');
        };
        
        // 获取文件名并发送请求
        const fileName = dom.originalImage.src.split('/').pop();
        xhr.send('fileName=' + encodeURIComponent(fileName));
    });
}

// 通知系统设置
function setupNotificationSystem() {
    dom.notificationClose.addEventListener('click', utils.hideNotification);
}

// 图片加载错误处理
function setupImageErrorHandling() {
    dom.originalImage.addEventListener('error', function() {
        utils.showNotification('原始图片加载失败', 'error');
    });
    
    dom.matchedImage.addEventListener('error', function() {
        utils.showNotification('匹配图片加载失败', 'error');
    });
}

// 主初始化函数
document.addEventListener('DOMContentLoaded', function() {
    // 设置主题切换
    setupThemeToggle();
    
    // 设置拖拽上传
    setupDragAndDrop();
    
    // 设置图片匹配
    setupImageMatching();
    
    // 设置通知系统
    setupNotificationSystem();
    
    // 设置图片错误处理
    setupImageErrorHandling();
    
    // 页面加载完成后显示欢迎信息
    utils.showNotification('欢迎使用智能图像匹配系统');
});