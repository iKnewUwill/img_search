from app import cbir as cbir
import numpy as np
import matplotlib.pyplot as plt  # 确保导入了matplotlib
import random

# initialise the database
# 选择数据集
# dataset = cbir.Dataset()
# dataset = cbir.Dataset("data/imgset")
dataset = cbir.Dataset("data/archive")

# 选择算法
orb = cbir.descriptors.AlexNet()
# orb = cbir.descriptors.Orb()
# ezsift = cbir.descriptors.EzSIFT()


# Let's create the vocabulary tree
voc = cbir.encoders.VocabularyTree(n_branches=4, depth=4, descriptor=orb)
# voc = cbir.encoders.VocabularyTree(n_branches=4, depth=4, descriptor=ezsift)

# Extract the features
features = voc.extract_features(dataset)

# Construct the tree using the extracted features
voc.fit(features)
voc.save()

# Create our database for retrieval
db = cbir.Database(dataset, encoder=voc)

# Index all the images
db.index()

# Save the database on disk for later
db.save()