# 基于图像特征提取的图像检索系统

欢迎来到本项目的README文件，这里提供了关于如何使用和理解本图像检索系统的详细信息。

## 项目简介
本项目引用深度学习技术实现的图像检索系统项目[scalable-recognition-with-a-vocabulary-tree](https://github.com/epignatelli/scalable-recognition-with-a-vocabulary-tree)。系统利用AlexNet等模型作为特征提取器，能够快速准确地检索出与查询图像相似的图像。

## 关键词
- 图像检索
- 深度学习
- AlexNet
- SIFT(Scale-invariant feature transform,尺度不变特征转换)
- ORB（Oriented FAST and Rotated BRIEF）
- Flask
- OpenCV
- NumPy
- Matplotlib

## 环境要求
- Python 3.6 或以上版本
- Flask
- OpenCV
- NumPy
- Matplotlib
- torchvision

## 安装指南
1. 克隆仓库到本地机器
```bash
git clone https://github.com/yourusername/your-alexnet-image-retrieval-system.git
```
2. 进入项目目录
```bash
cd your-image-retrieval-system
```
3. 创建虚拟环境
```bash
conda create -n cv_env python=3.8
```
激活虚拟环境：
- Windows
```bash
conda activate cv_env
```
安装依赖
```bash
pip install -r requirements.txt
```
## 使用方法
1. 启动Flask服务器
```bash
python app.py
```
2. 打开浏览器访问 http://127.0.0.1:5000 来使用图像检索系统。
## 系统架构
- 图像预处理模块：负责读取和预处理图像数据。
- 特征提取模块：利用AlexNet模型提取图像特征。
- 数据库模块：构建并维护图像特征数据库。
- 匹配算法：实现特征向量的匹配逻辑。
- Web界面：提供用户交互的前端界面。
## 数据库构建流程图
```mermaid
graph TD
    A[开始] --> B[数据收集]
    B --> C{图像预处理}
    C -->|标准化| D[调整大小与颜色空间转换]
    C -->|去噪| E[去除图像噪声]
    C -->|增强| F[对比度与亮度调整]
    
    D --> G[特征提取]
    E --> G
    F --> G
    
    G --> H{选择特征提取算法}
    H -->|使用AlexNet| I[提取深度特征]
    H -->|使用SIFT| J[提取SIFT特征]
    H -->|使用其他算法| K[提取其他特征]
    
    I --> L[特征向量化]
    J --> L
    K --> L
    
    L --> M[构建特征数据库]
    M --> N[创建倒排索引]
    N --> O[数据库优化]
    O --> P[索引保存至磁盘]
    
    P --> Q[结束]
```
## 搜索功能流程图
```mermaid
graph TD
    A[开始] --> B[用户上传图像]
    B --> C[图像预处理]
    C --> D{特征提取}
    D -->|使用AlexNet/Orb/SIFT| E[获取特征向量]
    E --> F[特征存储]
    F --> G[构建倒排索引]
    G --> H[用户输入查询]
    H --> I[查询图像预处理]
    I --> J[查询特征提取]
    J --> K[特征匹配]
    K --> L[根据相似度排序]
    L --> M[显示检索结果]
    M --> N[结束]
```
## 性能评估
todo

## 贡献指南
不涉及

## 许可
本项目采用 MIT License。

## 联系方式
邮箱：473124610@qq.com
GitHub：@iKnewUwill