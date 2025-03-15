import tensorflow as tf
import numpy as np
from PIL import Image, ImageOps

# Load the model (Without Keras)
model = tf.saved_model.load("model.savedmodel")

# Load class labels
with open("labels.txt", "r") as file:
    class_names = [line.strip() for line in file.readlines()]

# Image preprocessing function (same as Teachable Machine)
def preprocess_image(image_path):
    """Preprocess an image for TensorFlow model prediction."""
    image = Image.open(image_path).convert("RGB")

    # Resize and center-crop the image
    size = (224, 224)
    image = ImageOps.fit(image, size, Image.Resampling.LANCZOS)

    # Convert to NumPy array and normalize to [-1, 1]
    image_array = np.asarray(image, dtype=np.float32) / 127.5 - 1

    # Expand dimensions to match model input shape (batch size = 1)
    return np.expand_dims(image_array, axis=0)

# Load and preprocess an image
image_path = "pcb.jpg"
input_data = preprocess_image(image_path)

# Perform inference (Without Keras)
infer = model.signatures["serving_default"]  # Get the inference function
output = infer(tf.constant(input_data))  # Run inference

# Extract predictions
prediction = list(output.values())[0].numpy()
index = np.argmax(prediction)
class_name = class_names[index]
confidence_score = float(prediction[0][index])

# Display results
print(f"Class: {class_name}")
print(f"Confidence Score: {confidence_score:.4f}")
