# Whisper Speech Recognition Service
# Run this separately: python whisper-service.py

import whisper
import os
import sys
from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)  # Allow Electron app to connect

# Set FFmpeg path to the local copy in public/models/ffmpeg/bin
FFMPEG_PATH = os.path.join(os.path.dirname(__file__), 'public', 'models', 'ffmpeg', 'bin')
if os.path.exists(FFMPEG_PATH):
    os.environ['PATH'] = FFMPEG_PATH + os.pathsep + os.environ.get('PATH', '')
    print(f"✅ Using FFmpeg from: {FFMPEG_PATH}")
else:
    print(f"⚠️ FFmpeg path not found: {FFMPEG_PATH}")

# Load Whisper model (base is fast, medium/large for accuracy)
print("Loading Whisper model...")
model = whisper.load_model("base")  # Options: tiny, base, small, medium, large
print("✅ Whisper model loaded!")

UPLOAD_FOLDER = 'temp_audio'
ALLOWED_EXTENSIONS = {'webm', 'wav', 'mp3', 'ogg'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/transcribe', methods=['POST'])
def transcribe_audio():
    """Transcribe uploaded audio file"""
    if 'audio' not in request.files:
        return jsonify({"error": "No audio file"}), 400
    
    file = request.files['audio']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file:
        # Save uploaded file
        filename = secure_filename('recording.webm')
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)
        
        print(f"🔄 Transcribing {filename}...")
        print(f"📁 File saved at: {os.path.abspath(filepath)}")
        print(f"📊 File size: {os.path.getsize(filepath)} bytes")
        
        try:
            # Transcribe with Whisper (language='en' for faster processing)
            result = model.transcribe(
                filepath, 
                fp16=False,
                language='en',
                task='transcribe'
            )
            transcript = result["text"].strip()
            
            print(f"✅ Transcription: {transcript}")
            
            # Clean up
            try:
                os.remove(filepath)
            except:
                pass
            
            return jsonify({
                "status": "success",
                "transcript": transcript,
                "language": result.get("language", "en")
            })
        except FileNotFoundError as e:
            print(f"❌ FFmpeg not found! Please install FFmpeg:")
            print(f"   Download from: https://ffmpeg.org/download.html")
            print(f"   Or use: choco install ffmpeg (Windows)")
            return jsonify({
                "error": "FFmpeg not installed. Please install FFmpeg for audio processing.",
                "transcript": ""
            }), 500
        except Exception as e:
            print(f"❌ Transcription error: {str(e)}")
            import traceback
            traceback.print_exc()
            return jsonify({
                "error": str(e),
                "transcript": ""
            }), 500
    
    return jsonify({"error": "Invalid file"}), 400

@app.route('/start', methods=['POST'])
def start_listening():
    """Notify that listening started (for compatibility)"""
    return jsonify({"status": "ready", "message": "Ready to transcribe"})

@app.route('/status', methods=['GET'])
def status():
    """Get current status"""
    return jsonify({
        "status": "ready",
        "model": "whisper-base"
    })

if __name__ == '__main__':
    print("🚀 Whisper service starting on http://localhost:5000")
    print("📝 Endpoints:")
    print("  POST /transcribe - Transcribe audio file")
    print("  POST /start      - Ready signal")
    print("  GET  /status     - Check status")
    app.run(host='0.0.0.0', port=5000, debug=False)
