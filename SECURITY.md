# 🔒 Sepetza Güvenlik Dökümantasyonu

## Uygulanan Güvenlik Önlemleri

### 🛡️ Authentication & Authorization
- ✅ JWT token tabanlı kimlik doğrulama
- ✅ BCrypt ile şifre hash'leme (cost factor: 12)
- ✅ Güçlü şifre politikası (8+ karakter, büyük/küçük harf, rakam, özel karakter)
- ✅ Token expiration kontrolü (72 saat)
- ✅ Otomatik token süresi dolunca çıkış sistemi
- ✅ Account lockout sistemi (5 başarısız deneme = 15 dakika kilit)

### 🚧 Rate Limiting
- ✅ Auth endpoint'leri: 5 istek/dakika
- ✅ Genel API: 100 istek/dakika  
- ✅ Sepet işlemleri: 30 istek/dakika

### 🌐 CORS & Network Security
- ✅ Development: localhost:3000, localhost:3001
- ✅ Production: Sadece belirlenen domain'ler
- ✅ Credential support aktif
- ✅ Sadece gerekli HTTP method'ları

### 🔐 HTTPS & Transport Security
- ✅ Production'da HTTPS zorunlu
- ✅ HSTS header (1 yıl, subdomain dahil)
- ✅ Development'da esnek ayarlar

### 🛡️ Security Headers
- ✅ X-Content-Type-Options: nosniff
- ✅ X-Frame-Options: DENY
- ✅ X-XSS-Protection: 1; mode=block
- ✅ Referrer-Policy: strict-origin-when-cross-origin
- ✅ Content-Security-Policy (CSP)

### 📝 Input Validation
- ✅ Email format doğrulaması
- ✅ Şifre karmaşıklık kontrolü
- ✅ Null/boş değer kontrolleri
- ✅ SQL injection koruması (Entity Framework)
- ✅ XSS koruması (CSP headers)

### 🗄️ Data Protection
- ✅ Şifreler hash'lenmiş halde saklanıyor
- ✅ JWT secret key güçlü ve uzun (256+ bit)
- ✅ Veritabanı soft delete pattern
- ✅ User enumeration koruması

### 📊 Logging & Monitoring
- ✅ Development: Detaylı error logging
- ✅ Production: Generic error messages
- ✅ Failed login attempt tracking
- ✅ Security event logging

## 🚀 Production Deployment Checklist

### Zorunlu Değişiklikler
- [ ] `appsettings.Production.json`'da JWT SecretKey'i değiştirin
- [ ] CORS policy'de production domain'inizi belirleyin
- [ ] Database connection string'ini production'a uyarlayın
- [ ] HTTPS sertifikası yapılandırın

### Önerilen Ek Güvenlik Önlemleri
- [ ] Web Application Firewall (WAF) kurulumu
- [ ] DDoS koruması
- [ ] Database encryption at rest
- [ ] Regular security audits
- [ ] Dependency vulnerability scanning
- [ ] Penetration testing

## 🔧 Güvenlik Ayarları

### JWT Token Ayarları
```json
{
  "ExpirationInMinutes": 4320,  // 72 saat
  "SecretKey": "256+ bit güçlü key"
}
```

### Rate Limiting Ayarları
```csharp
AuthPolicy: 5 istek/dakika
GeneralPolicy: 100 istek/dakika
CartPolicy: 30 istek/dakika
```

### Account Lockout Ayarları
```csharp
MAX_LOGIN_ATTEMPTS = 5
LOCKOUT_DURATION_MINUTES = 15
```

## 🚨 Güvenlik İhlali Durumunda

1. **Hemen Yapılacaklar**
   - Sistemi offline alın
   - Etkilenen kullanıcıları bilgilendirin
   - Log'ları analiz edin

2. **İnceleme Süreci**
   - Güvenlik açığını tespit edin
   - Etki analizi yapın
   - Yasal gereklilikleri kontrol edin

3. **İyileştirme**
   - Açığı kapatın
   - Ek güvenlik önlemleri alın
   - Monitoring'i artırın

## 📞 İletişim

Güvenlik sorunları için: security@sepetza.com

---

**Son Güncelleme**: 2024-12-20
**Güvenlik Seviyesi**: Yüksek
**Compliance**: GDPR Ready 