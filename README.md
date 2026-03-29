# Deepfake Detector Website

A modern web application for detecting deepfakes in audio, video, and image files using AI.

## Features

- 🎵 Audio deepfake detection
- 🎬 Video deepfake detection
- 🖼️ Image deepfake detection
- 📱 Mobile-responsive design
- 🎨 Futuristic UI with animations
- 📱 PWA (Progressive Web App) capabilities
- 🔗 QR code for easy mobile access
- 🤖 TensorFlow-powered AI detection
- 🌐 Network-accessible server

## Technologies

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Python 3.11, Flask
- **AI/ML**: TensorFlow 2.16, Keras
- **Image Processing**: Pillow (PIL)
- **Deployment**: Flask development server

## Quick Start

### Prerequisites
- Python 3.11+
- pip package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/deepfake-detector.git
   cd deepfake-detector
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the application**
   ```bash
   python app.py
   ```

5. **Access the website**
   - Local: http://127.0.0.1:5000
   - Network: http://YOUR_IP:5000 (replace YOUR_IP with your machine's IP)

## Mobile Access

1. Ensure your mobile device is on the same Wi-Fi network
2. Visit `http://YOUR_LOCAL_IP:5000`
3. Or scan the QR code displayed on the website

## Deployment Options

### For Production Deployment

**Option 1: Cloud Platforms**
- **Railway**: Connect GitHub repo, auto-deploys
- **Render**: Free tier available
- **Heroku**: Traditional choice
- **Vercel**: For static frontend (requires backend separation)

**Option 2: Self-hosted**
- Use Gunicorn + Nginx
- Docker containerization
- VPS with domain

### Environment Variables
```bash
export FLASK_ENV=production
export PORT=8000  # For production servers
```

## Project Structure

```
deepfake-detector/
├── app.py              # Flask backend server
├── index.html          # Main webpage
├── styles.css          # Styling and animations
├── script.js           # Frontend JavaScript
├── manifest.json       # PWA manifest
├── sw.js              # Service worker
├── requirements.txt    # Python dependencies
└── README.md          # This file
```

## API Endpoints

- `GET /` - Main webpage
- `POST /detect` - File analysis endpoint
- `GET /get-ip` - Network IP detection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use and modify.

## Disclaimer

This tool provides AI-powered deepfake detection but results may not be 100% accurate. Always verify critical findings through multiple sources.