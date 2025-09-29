#loads and preprosseses the Dataset

    
    
import os
import tensorflow as tf

def load_dataset(dataset_path, img_size(128,128), batch_size = 16):
    from tensorflow.keras.preprocessing.image import ImageDataGenerator

    # Data augmentation para entrenamiento
    train_datagen = ImageDataGenerator(
        rescale=1./255, 
        validation_split=0.2  # will separate 20% of the data to use in validation
    )