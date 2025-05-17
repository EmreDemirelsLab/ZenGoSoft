from flask import Flask, send_from_directory, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
import os
from dotenv import load_dotenv
import datetime

# .env dosyasını yükle
load_dotenv()

# MongoDB bağlantı bilgileri
MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://ZenGoSoft-admin:peujuNu7zOHPu35a@zengosoftcluster.aylp2x6.mongodb.net/?retryWrites=true&w=majority&appName=ZenGoSoftCluster")
SECRET_KEY = os.getenv("SECRET_KEY", "EmreDemirel1986")

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

# İletişim formu için API endpoint'i
@app.route('/api/contact', methods=['POST'])
def contact():
    try:
        data = request.json
        
        # Verileri MongoDB'ye kaydet
        result = db.contacts.insert_one({
            'name': data.get('name'),
            'email': data.get('email'),
            'subject': data.get('subject'),
            'message': data.get('message'),
            'date': datetime.datetime.now()
        })
        
        return jsonify({
            "success": True,
            "message": "Mesajınız başarıyla kaydedildi."
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Hata oluştu: {str(e)}"
        }), 500
        
        

# Test için API endpoint'i
@app.route('/api/status')
def status():
    if db is not None:
        try:
            # Basit bir test sorgusu çalıştırma
            db.test_collection.find_one({})
            db_status = "Veritabanı bağlantısı başarılı!"
        except Exception as e:
            db_status = f"Veritabanı hatası: {str(e)}"
    else:
        db_status = "Veritabanı bağlantısı kurulamadı."
    
    return jsonify({
        "status": "API çalışıyor!",
        "database": db_status,
        "app_name": "Zengosoft"
    })

if __name__ == "__main__":
    app.run(debug=True)