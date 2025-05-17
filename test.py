from pymongo import MongoClient

# Bağlantı string'inizi buraya ekleyin
MONGO_URI = "mongodb+srv://ZenGoSoft-admin:peujuNu7zOHPu35a@zengosoftcluster.aylp2x6.mongodb.net/?retryWrites=true&w=majority&appName=ZenGoSoftCluster"

try:
    # MongoDB'ye bağlanmayı deneyin
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)  # 5 saniye timeout
    
    # Bağlantıyı test edin
    client.server_info()  # Bu komut sunucuya bir ping gönderir
    
    print("MongoDB Atlas'a başarıyla bağlandı!")
    
    # Test koleksiyonu oluşturun
    db = client.zengosoft
    result = db.test_collection.insert_one({"test": "Bağlantı testi"})
    print(f"Test verisi eklendi, ID: {result.inserted_id}")
    
except Exception as e:
    print(f"MongoDB bağlantı hatası: {e}")
finally:
    # Bağlantıyı kapatın
    if 'client' in locals():
        client.close()