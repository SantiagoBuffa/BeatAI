#loads and preprosseses the Dataset

    
    
import os
import tensorflow as tf

def load_dataset(dataset_path, img_size(128,128), batch_size = 16):
    from tensorflow.keras.preprocessing.image import ImageDataGenerator

    # Data augmentation 
    train_datagen = ImageDataGenerator(
        rescale=1./255,  #rescale
        rotation_range=5,  # slight rotation
        width_shift_range=0.05, # 5% horizontal shift
        height_shift_range=0.05, # 5% vertical shift
        zoom_range=0.05,   #slight zoom
        shear_range=0.05,  #slight deformation
        validation_split=0.15 # will use 15% data for validation
    )
    
    img_height, img_width = 256, 192  # keeping the proportions of the original images
    batch_size = 16 
    
    # loads up the drive folder and gets them ready to train with
    train_generator = train_datagen.flow_from_directory(
        os.path.join(dataset_path, 'train'), # path
        target_size=(img_height, img_width), 
        color_mode = 'grayscale', 
        batch_size=batch_size,
        class_mode='categorical', # each image has a category (from its folder)
        subset='training',
        shuffle=True # mixes the images every epoch
    )
    
    # repeat with the validation part of the dataset
    validation_generator = train_datagen.flow_from_directory(
        os.path.join(dataset_path, 'train'),
        target_size=(img_height, img_width),
        color_mode = 'grayscale', 
        batch_size=batch_size,
        class_mode='categorical',
        subset='validation',
        shuffle=True
    )
    