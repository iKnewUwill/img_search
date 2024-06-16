import os
from flask import Flask, request, redirect, url_for, render_template, send_from_directory, jsonify
from werkzeug.utils import secure_filename
import cv2
# from static.img_match import ImageProcessor

from app import cbir as cbir
import numpy as np
import matplotlib.pyplot as plt  # 确保导入了matplotlib
import random


app = Flask(__name__)
app.config['DATASET_FOLDER'] = 'data/imgset'
app.config['UPLOAD_FOLDER'] = 'static/uploads'
# app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif'}
app.config['ALLOWED_EXTENSIONS'] = {'jpg'}
app.config['FILE_NAME'] = ''

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

def process_image(image_path):
    # 这里可以添加你需要调用的图像处理函数
    image = cv2.imread(image_path)
    
    #实例化的sift函数
    sift = cv2.SIFT_create()

    kp1, des1 = sift.detectAndCompute(image,None)   #des是描述子

    # 简单的图像处理示例：将图像转换
    gray2 = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)#灰度处理图像
    processed_image = cv2.drawKeypoints(gray2,kp1,gray2,color=(255,0,255)) #画出特征点，并显示为红色圆圈
    
    # cv2.imshow("point", processed_image) #拼接显示为gray
    # cv2.waitKey(0)

    processed_image_path = os.path.join(app.config['UPLOAD_FOLDER'], 'processed_' + os.path.basename(image_path))
    cv2.imwrite(processed_image_path, processed_image)
    return processed_image_path

@app.route('/', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        # 检查是否有文件部分
        if 'file' not in request.files:
            return redirect(request.url)
        file = request.files['file']
        # 如果用户没有选择文件，浏览器提交了一个没有文件名的空文件
        if file.filename == '':
            return redirect(request.url)
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)

            filepath = os.path.join(app.config['DATASET_FOLDER'], filename)
            file.save(filepath)
            
            file.seek(0)
            
            filepath = os.path.join(app.config['UPLOAD_FOLDER'] , filename)
            file.save(filepath)

            app.config['FILE_NAME'] = filename
            processed_image_path = process_image(filepath)
            return render_template('index.html', image_url=processed_image_path ,filename=filename)
    return render_template('index.html')

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# 创建一个路由来处理匹配按钮点击事件：
@app.route('/match_image', methods=['POST'])
def match_image():
    # 从请求中获取图片名称
    img_name = request.form.get('fileName')
    if not img_name:
        return jsonify({'error': 'No image name provided'}), 400
    
    query = img_name
    scores = db.retrieve(query)
    db.show_results(query, scores, figsize=(30, 10))

    # 指定保存图片的文件夹路径
    save_folder = 'static/result'

    # 确保文件夹存在，如果不存在则创建
    if not os.path.exists(save_folder):
        os.makedirs(save_folder)
    # 指定图片保存的文件名和格式

    file_name = 'result.jpg' 
    save_path = os.path.join(save_folder, file_name)

    # 使用 savefig() 函数保存图片
    plt.savefig(save_path)
    
    # 构造静态文件URL
    result_img_url = save_path
    
    print(result_img_url)
    # 返回匹配图片的URL
    return jsonify({'matched_image_url': result_img_url})

if __name__ == '__main__':


    orb = cbir.descriptors.AlexNet()
    # orb = cbir.descriptors.Orb()

    # 创建并加载词表
    voc = cbir.encoders.VocabularyTree(n_branches=4, depth=4, descriptor=orb)
    voc.load()

    # 初始化数据库
    # dataset = cbir.Dataset()
    # dataset = cbir.Dataset("data/imgset")
    dataset = cbir.Dataset("data/archive")
    db = cbir.Database(dataset, encoder=voc)
    db.load()


    app.run(debug=True)
