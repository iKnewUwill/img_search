from app import cbir as cbir
import numpy as np
import matplotlib.pyplot as plt  # 确保导入了matplotlib
import random

# initialise the database
dataset = cbir.Dataset()
orb = cbir.descriptors.Orb()
# orb.load()

# Let's create the vocabulary tree
voc = cbir.encoders.VocabularyTree(n_branches=4, depth=4, descriptor=orb)

voc.load()

voc.draw()
plt.show()

db = cbir.Database(dataset, encoder=voc)

db.load()


query = "jiequ2.jpg"
scores = db.retrieve(query)
db.show_results(query, scores, figsize=(30, 10))


plt.show()

query = random.choice(dataset)
scores = db.retrieve(query)
db.show_results(query, scores, figsize=(20, 10))
plt.show()