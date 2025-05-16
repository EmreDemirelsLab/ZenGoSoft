from flask import Flask, send_from_directory
from flask_cors import CORS
from pymongo import MongoClient
import os
from dotenv import load_dotenv

# .env dosyasını yükle
load_dotenv()

# MongoDB bağlantı bilgileri
MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://username:password@cluster.mongodb.net/zengosoft")
SECRET_KEY = os.getenv("SECRET_KEY", "gizli-anahtar-buraya")

app = Flask(__name__, static_folder='../frontend', static_url_path='/')
CORS(app)  # CORS etkinleştir
app.config["SECRET_KEY"] = SECRET_KEY

# MongoDB bağlantısı
if MONGO_URI:
    client = MongoClient(MONGO_URI)
    db = client.zengosoft
else:
    db = None

# Ana sayfa
@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

# Statik dosyalar
@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(app.static_folder, path)

# Test için API endpoint'i
@app.route('/api/status')
def status():
    if db:
        db_status = "Veritabanı bağlantısı başarılı!"
    else:
        db_status = "Veritabanı bağlantısı kurulamadı."
    return {"status": "API çalışıyor!", "database": db_status}

if __name__ == "__main__":
    app.run(debug=True)