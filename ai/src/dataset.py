# loads and preprocesses the dataset
from google.colab import drive
import os


drive.mount('/content/drive')
dataset_path = '/content/drive/MyDrive/IA-Proyecto/dataset'  # cambialo por tu ruta real

if os.path.exists(dataset_path):
    print(f"✅ La carpeta existe: {dataset_path}")
else:
    print(f"❌ La carpeta no se encuentra. Revisá la ruta: {dataset_path}")
    