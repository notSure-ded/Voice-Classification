import os
import librosa
import numpy as np
# import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from sklearn.svm import SVC
from sklearn.linear_model import LogisticRegression
# from sklearn.decomposition import PCA
import joblib

def extract_features(audio_file):
    y, sr = librosa.load(audio_file, sr=None)
    mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
    return np.mean(mfccs, axis=1)

human_data_dir = "RealHuman"
ai_data_dir = "AI Voice"

human_files = [os.path.join(human_data_dir, f) for f in os.listdir(human_data_dir) if f.endswith(".wav")]
ai_files = [os.path.join(ai_data_dir, f) for f in os.listdir(ai_data_dir) if f.endswith(".wav")]

human = np.zeros(len(human_files))
ai = np.ones(len(ai_files))

data = []
data_labels = []

for file in human_files:
    data.append(extract_features(file))
    data_labels.append(0)

for file in ai_files:
    data.append(extract_features(file))
    data_labels.append(1)

X_train, X_test, y_train, y_test = train_test_split(data, data_labels, test_size=0.3, random_state=42)

clf = RandomForestClassifier(n_estimators=100)
clf.fit(X_train, y_train)

svm_clf=SVC()
svm_clf.fit(X_train,y_train)

lr = LogisticRegression(max_iter=1500)
lr.fit(X_train,y_train)

# joblib.dump(clf,"Saved Model/Random_forest.pkl")
# joblib.dump(svm_clf,"Saved Model/SVM.pkl")
# joblib.dump(clf,"Saved Model/LogisticREg.pkl")

# pca=PCA(n_components=2)
# X_pca=pca.fit_transform(X_test)

y_pred = clf.predict(X_test)
y_pred_svm=svm_clf.predict(X_test)
y_pred_lr=lr.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)
accuracy_svm=accuracy_score(y_test,y_pred_svm)
accuracy_lr=accuracy_score(y_test,y_pred_lr)

print(f" Random Forest Accuracy: {accuracy}")
print(f" SVM Accuracy: {accuracy_svm}")
print(f"Logistic Regression Accuracy: {accuracy_lr}")

# X_class_0=X_pca[y_pred==0]
# X_class_1=X_pca[y_pred==1]

# plt.figure(figsize=(10,6))
# plt.scatter(X_class_0[:,0],X_class_0[:,1],c='blue',label='Class 0',marker='o')
# plt.scatter(X_class_1[:,0],X_class_1[:,1],c='red',label='Class 1',marker='x')
# plt.xlabel("xxx")
# plt.ylabel("yyy")
# plt.legend(loc='best')
# models=['RandomForest','SVM','Logistic Regression']
# accuracies=[accuracy,accuracy_svm,accuracy_lr]
# plt.bar(models,accuracies)
# plt.ylabel('Accuracy')
# plt.title('Model Comparison')
# # plt.ylim(0,1);
# plt.show()

