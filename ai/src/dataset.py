#loads and preprosseses the Dataset


#PEGAR EN EL COLAB ANTES DE CORRER
#drive.mount('/content/drive')
#dataset_path = '/content/drive/MyDrive/IA-Proyecto/dataset'  # cambialo por tu ruta real

#if os.path.exists(dataset_path):
    #print(f"✅ La carpeta existe: {dataset_path}")
#else:
    #print(f"❌ La carpeta no se encuentra. Revisá la ruta: {dataset_path}")
    
    
import os
import tensorflow as tf

def load_dataset(dataset_path, img_size(128,128), batch_size = 16):
    from tensorflow.keras.preprocessing.image import ImageDataGenerator

    # Data augmentation para entrenamiento
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        validation_split=0.2  # will separate 20% of the data to use in validation
    )