// Check server availability on page load
window.addEventListener('load', async () => {
    try {
        const response = await fetch('/detect', { method: 'HEAD' });
        if (!response.ok) {
            console.log('Server not responding, but continuing...');
        }
    } catch (error) {
        console.log('Server check failed, but continuing...');
    }
});

// Deepfake Detector Script

// Generate QR Code on page load
window.addEventListener('DOMContentLoaded', function() {
    // Use the network IP for mobile access
    const networkIP = '192.168.0.106'; // Your computer's network IP
    const networkUrl = `http://${networkIP}:5000`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(networkUrl)}`;
    const qrImg = document.getElementById('qr-code');
    qrImg.src = qrUrl;
    qrImg.onerror = function() {
        console.log('QR code generation failed, hiding QR section');
        document.getElementById('qr-section').style.display = 'none';
    };
    console.log('QR Code generated for:', networkUrl);

    // Add scroll effect for QR section
    const qrSection = document.getElementById('qr-section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                qrSection.classList.add('qr-visible');
            }
        });
    }, { threshold: 0.3 });

    observer.observe(qrSection);
});

// Download App function
function downloadApp(event) {
    event.preventDefault();

    // Check if PWA is supported
    if ('serviceWorker' in navigator && 'standalone' in window.navigator) {
        alert('🎉 PWA Ready! Tap "Add to Home Screen" in your browser menu to install this app.');
    } else {
        alert('📱 PWA Installation: Open this site in Chrome/Safari and tap "Add to Home Screen" for app-like experience.\n\n🌐 Web Version: Continue using http://127.0.0.1:5000');
    }
}

async function detectDeepfake(file, type) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    try {
        const response = await fetch('/detect', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            console.error('Response not ok:', response.status, response.statusText);
            return { error: 'Unable to process file. Please try again.' };
        }
        
        const result = await response.json();
        console.log('Detection result:', result);
        return result;
    } catch (error) {
        console.error('Fetch error:', error);
        return { error: 'Connection failed. Please check your internet and try again.' };
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Deepfake Detector Script
    let selectedType = null;

    // Detection type selection
    window.selectDetection = function(type) {
        selectedType = type;
        
        // Remove selected class from all cards
        document.querySelectorAll('.detect-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Add selected class to clicked card
        event.currentTarget.classList.add('selected');
        
        const uploadSection = document.getElementById('upload-section');
        const uploadPrompt = document.getElementById('upload-prompt');
        const supportedFormats = document.getElementById('supported-formats');

        uploadSection.style.display = 'block';
        uploadSection.scrollIntoView({ behavior: 'smooth' });

        switch(type) {
            case 'audio':
                uploadPrompt.textContent = 'Drag & drop your audio file here or click to browse';
                supportedFormats.textContent = 'MP3, WAV, M4A, FLAC';
                document.getElementById('file-input').accept = 'audio/*';
                break;
            case 'video':
                uploadPrompt.textContent = 'Drag & drop your video file here or click to browse';
                supportedFormats.textContent = 'MP4, AVI, MOV, MKV';
                document.getElementById('file-input').accept = 'video/*';
                break;
            case 'image':
                uploadPrompt.textContent = 'Drag & drop your image file here or click to browse';
                supportedFormats.textContent = 'JPG, PNG, GIF, BMP';
                document.getElementById('file-input').accept = 'image/*';
                break;
        }
    };

    // File upload handling
    const fileInput = document.getElementById('file-input');
    const uploadArea = document.querySelector('.upload-area');

    // File input change
    fileInput.addEventListener('change', handleFileSelect);

    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });

    // Click to upload
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });

    function handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            handleFile(file);
        }
    }

    function handleFile(file) {
        if (!selectedType) {
            alert('Please select a detection type first.');
            return;
        }

        // Show loading
        const resultDisplay = document.getElementById('result-display');
        const resultContent = document.getElementById('result-content');
        resultDisplay.style.display = 'block';
        resultContent.innerHTML = '<div class="loading"></div><p>Analyzing file...</p>';

        // Detect deepfake
        detectDeepfake(file, selectedType).then(result => {
            displayResult(result);
        }).catch(error => {
            displayResult({ error: 'Analysis failed. Please try again.' });
        });
    }

    function displayResult(result) {
        const resultContent = document.getElementById('result-content');

        if (result.error) {
            resultContent.innerHTML = `
                <div class="result-error">
                    <i class="fas fa-exclamation-triangle result-icon" style="color: var(--error);"></i>
                    <div class="result-title">Analysis Failed</div>
                    <div class="result-message">${result.error}</div>
                </div>
            `;
            return;
        }

        const isAuthentic = !result.is_deepfake;
        const resultClass = isAuthentic ? 'result-authentic' : 'result-deepfake';
        const iconClass = isAuthentic ? 'fa-shield-alt' : 'fa-exclamation-triangle';
        const title = isAuthentic ? 'Authentic Content' : 'Deepfake Detected';

        resultContent.innerHTML = `
            <div class="${resultClass}">
                <i class="fas ${iconClass} result-icon"></i>
                <div class="result-title">${title}</div>
                <div class="result-confidence">${result.confidence}% Confidence</div>
                <div class="result-confidence-bar">
                    <div class="result-confidence-fill" style="width: ${result.confidence}%"></div>
                </div>
                <div class="result-message">${result.message}</div>
            </div>
        `;
    }
});