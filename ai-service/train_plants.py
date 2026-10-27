"""
MedLeaf AI - CNN Model Training Script for Medicinal Plants & Leaves
Framework: TensorFlow / Keras
"""
import os
import argparse
import json
import tensorflow as tf
from tensorflow.keras import layers, models

def train_model(data_dir, output_model="models/plant_model.h5", epochs=15, batch_size=32, img_size=(224, 224)):
    if not os.path.exists(data_dir):
        print(f"Error: Dataset directory '{data_dir}' does not exist.")
        return

    print(f"Loading dataset from: {data_dir}")
    train_ds = tf.keras.preprocessing.image_dataset_from_directory(
        data_dir,
        validation_split=0.2,
        subset="training",
        seed=123,
        image_size=img_size,
        batch_size=batch_size
    )

    val_ds = tf.keras.preprocessing.image_dataset_from_directory(
        data_dir,
        validation_split=0.2,
        subset="validation",
        seed=123,
        image_size=img_size,
        batch_size=batch_size
    )

    class_names = train_ds.class_names
    os.makedirs(os.path.dirname(output_model) or ".", exist_ok=True)
    with open("models/plant_classes.json", "w") as f:
        json.dump(class_names, f, indent=2)
    print(f"Detected classes ({len(class_names)}): {class_names}")

    num_classes = len(class_names)
    base_model = tf.keras.applications.MobileNetV2(input_shape=(*img_size, 3), include_top=False, weights='imagenet')
    base_model.trainable = False

    model = models.Sequential([
        layers.Rescaling(1./127.5, offset=-1),
        base_model,
        layers.GlobalAveragePooling2D(),
        layers.Dropout(0.2),
        layers.Dense(num_classes, activation='softmax')
    ])

    model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])
    model.fit(train_ds, validation_data=val_ds, epochs=epochs)

    model.save(output_model)
    print(f"Model saved successfully to {output_model}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train MedLeaf Plant Classifier")
    parser.add_argument("--data", type=str, default="dataset/plants", help="Path to plant image dataset")
    parser.add_argument("--output", type=str, default="models/plant_model.h5", help="Output path for trained weights")
    args = parser.parse_args()
    train_model(args.data, args.output)
