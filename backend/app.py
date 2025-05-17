from flask import Flask, send_from_directory, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
import os
from dotenv import load_dotenv
import datetime
import logging
import certifi # certifi'yi import edin

# Loglama ayarları
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# .env dosyasını yükle
load_dotenv()

# MongoDB bağlantı bilgileri - Güvenlik için .env dosyasından alın
MONGO_URI = os.getenv("MONGO_URI")
SECRET_KEY = os.getenv("SECRET_KEY")

app = Flask(__name__, static_folder='../frontend', static_url_path='/')
CORS(app)  # CORS etkinleştir
app.config["SECRET_KEY"] = SECRET_KEY

# MongoDB bağlantısı
try:
    if MONGO_URI:
        # certifi.where() ile CA sertifikalarının yolunu belirtin
        client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())
        db = client.zengosoft
        db.test_collection.find_one({}) # Bağlantıyı test et
        logger.info("MongoDB bağlantısı başarılı!")
    else:
        logger.error("MONGO_URI çevre değişkeni bulunamadı!")
        db = None
except Exception as e:
    logger.error(f"MongoDB bağlantı hatası: {str(e)}")
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
        # İstek verilerini al
        data = request.json
        
        # Gerekli alanların kontrolü
        required_fields = ['name', 'email', 'subject', 'message']
        for field in required_fields:
            if not data.get(field):
                return jsonify({
                    "success": False,
                    "message": f"Lütfen '{field}' alanını doldurun."
                }), 400
        
        # Veritabanı bağlantısını kontrol et
        if db is None:
            return jsonify({
                "success": False,
                "message": "Veritabanı bağlantısı kurulamadı. Lütfen daha sonra tekrar deneyin."
            }), 500
        
        # Verileri MongoDB'ye kaydet
        result = db.contacts.insert_one({
            'name': data.get('name'),
            'email': data.get('email'),
            'subject': data.get('subject'),
            'message': data.get('message'),
            'date': datetime.datetime.now()
        })
        
        logger.info(f"İletişim formu kaydedildi: {data.get('email')}")
        
        return jsonify({
            "success": True,
            "message": "Mesajınız başarıyla kaydedildi."
        })
    except Exception as e:
        logger.error(f"İletişim formu hatası: {str(e)}")
        return jsonify({
            "success": False,
            "message": f"Hata oluştu: {str(e)}"
        }), 500
        
# Test için API endpoint'i
@app.route('/api/status')
def status():
    try:
        if db is not None:
            try:
                # Basit bir test sorgusu çalıştırma
                db.test_collection.find_one({})
                db_status = "Veritabanı bağlantısı başarılı!"
            except Exception as e:
                logger.error(f"Veritabanı sorgu hatası: {str(e)}")
                db_status = f"Veritabanı hatası: {str(e)}"
        else:
            db_status = "Veritabanı bağlantısı kurulamadı."
        
        return jsonify({
            "status": "API çalışıyor!",
            "database": db_status,
            "app_name": "Zengosoft"
        })
    except Exception as e:
        logger.error(f"API durum hatası: {str(e)}")
        return jsonify({
            "status": "Hata!",
            "error": str(e)
        }), 500

if __name__ == "__main__":
    app.run(debug=True)