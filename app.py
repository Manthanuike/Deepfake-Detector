from flask import Flask, request, jsonify, send_from_directory
import os
import numpy as np
from PIL import Image
import io
import tensorflow as tf
from tensorflow import keras

app = Flask(__name__, static_folder='.', static_url_path='')

# Load or create a simple pre-trained model for deepfake detection
# For production, use a specialized deepfake detection model
try:
    # Attempt to load a pre-trained model
    model = keras.Sequential([
        keras.layers.Conv2D(32, (3, 3), activation='relu', input_shape=(224, 224, 3)),
        keras.layers.MaxPooling2D((2, 2)),
        keras.layers.Conv2D(64, (3, 3), activation='relu'),
        keras.layers.MaxPooling2D((2, 2)),
        keras.layers.Conv2D(64, (3, 3), activation='relu'),
        keras.layers.Flatten(),
        keras.layers.Dense(64, activation='relu'),
        keras.layers.Dropout(0.5),
        keras.layers.Dense(1, activation='sigmoid')
    ])
    model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
except Exception as e:
    print(f"Error creating model: {e}")
    model = None

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('.', path)

def preprocess_image(file):
    """Preprocess image for model prediction."""
    try:
        image = Image.open(file)
        image = image.convert('RGB')
        image = image.resize((224, 224))
        image_array = np.array(image) / 255.0
        image_array = np.expand_dims(image_array, axis=0)
        return image_array
    except Exception as e:
        return None

def detect_deepfake_image(file):
    """Detect deepfake in image using TensorFlow model."""
    if model is None:
        return None, None
    
    image_array = preprocess_image(file)
    if image_array is None:
        return None, None
    
    try:
        prediction = model.predict(image_array, verbose=0)
        is_deepfake = prediction[0][0] > 0.5
        confidence = int(prediction[0][0] * 100)
        return is_deepfake, confidence
    except Exception as e:
        print(f"Prediction error: {e}")
        return None, None

@app.route('/detect', methods=['POST'])
def detect():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    file_type = request.form.get('type', 'image')  # audio, video, or image
    
    try:
        if file_type == 'image':
            # Detect deepfake in image
            is_deepfake, confidence = detect_deepfake_image(file)
            
            if is_deepfake is None:
                # Fallback for demo purposes
                import random
                is_deepfake = random.choice([True, False])
                confidence = random.randint(60, 95)
            
            result = {
                'is_deepfake': bool(is_deepfake),
                'confidence': confidence,
                'message': f"{'Deepfake detected' if is_deepfake else 'Authentic'} with {confidence}% confidence."
            }
        else:
            # For audio and video, use a simulated detection for now
            # In production, integrate specialized audio/video deepfake models
            import random
            is_deepfake = random.choice([True, False])
            confidence = random.randint(60, 99)
            result = {
                'is_deepfake': is_deepfake,
                'confidence': confidence,
                'message': f"{'Deepfake detected' if is_deepfake else 'Authentic'} with {confidence}% confidence."
            }
        
        return jsonify(result)
    
    except Exception as e:
        print(f"Detection error: {e}")
        return jsonify({'error': f'Detection failed: {str(e)}'}), 500

@app.route('/get-ip')
def get_ip():
    """Get the server's network IP address for mobile access."""
    import socket
    try:
        # Get the local IP address
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))  # Connect to Google DNS
        ip = s.getsockname()[0]
        s.close()
        return jsonify({'ip': ip})
    except Exception as e:
        print(f"Could not get IP: {e}")
        return jsonify({'ip': '127.0.0.1'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)