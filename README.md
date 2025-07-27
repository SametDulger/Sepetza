# Sepetza - E-Ticaret Platformu

Modern ve kullanıcı dostu bir e-ticaret platformu. React ve .NET Core kullanılarak geliştirilmiştir.

## 🚀 Özellikler

### Kullanıcı Özellikleri
- ✅ Kullanıcı kaydı ve girişi
- ✅ Ürün arama ve filtreleme
- ✅ Kategori bazlı ürün listeleme
- ✅ Sepet yönetimi
- ✅ Favori ürünler
- ✅ Sipariş takibi
- ✅ Profil yönetimi
- ✅ Adres yönetimi

### Admin Özellikleri
- ✅ Dashboard
- ✅ Ürün yönetimi
- ✅ Kategori yönetimi
- ✅ Kullanıcı yönetimi
- ✅ Sipariş yönetimi
- ✅ İstatistikler

### Teknik Özellikler
- ✅ JWT tabanlı kimlik doğrulama
- ✅ Rate limiting
- ✅ CORS yapılandırması
- ✅ Error handling
- ✅ Type safety
- ✅ Responsive design
- ✅ Modern UI/UX

## 🛠️ Teknolojiler

### Backend
- **.NET 8** - Ana framework
- **Entity Framework Core** - ORM
- **SQLite** - Veritabanı
- **JWT** - Kimlik doğrulama
- **BCrypt** - Şifre hashleme
- **AutoMapper** - Object mapping

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **Axios** - HTTP client
- **Framer Motion** - Animations
- **React Hook Form** - Form handling

## 📦 Kurulum

### Gereksinimler
- .NET 8 SDK
- Node.js 18+
- npm veya yarn

### Backend Kurulumu

```bash
cd backend
dotnet restore
dotnet build
dotnet run --project Sepetza.API
```

Backend varsayılan olarak `http://localhost:5205` adresinde çalışacaktır.

### Frontend Kurulumu

```bash
cd frontend
npm install
npm start
```

Frontend varsayılan olarak `http://localhost:3000` adresinde çalışacaktır.

## 🔧 Yapılandırma

### Environment Variables

#### Backend (.env veya appsettings.json)
```json
{
  "JwtSettings": {
    "SecretKey": "YourSecretKeyHere",
    "Issuer": "Sepetza",
    "Audience": "SepetzaUsers",
    "ExpirationInMinutes": 1440
  },
  "AllowedOrigins": [
    "https://sepetza.com",
    "https://www.sepetza.com"
  ]
}
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5205/api
REACT_APP_ENV=development
```

## 🔐 Güvenlik

### Uygulanan Güvenlik Önlemleri
- ✅ JWT token expiration
- ✅ Rate limiting
- ✅ CORS policy
- ✅ Input validation
- ✅ SQL injection koruması
- ✅ XSS koruması
- ✅ CSRF koruması
- ✅ Password hashing (BCrypt)

### Admin Girişi
- **Email:** admin@sepetza.com
- **Şifre:** Admin123!

## 📁 Proje Yapısı

```
Sepetza/
├── backend/
│   ├── Sepetza.API/          # Web API
│   ├── Sepetza.Business/     # Business logic
│   ├── Sepetza.Core/         # Entities & DTOs
│   └── Sepetza.Data/         # Data access
└── frontend/
    ├── src/
    │   ├── components/       # React components
    │   ├── pages/           # Page components
    │   ├── services/        # API services
    │   ├── contexts/        # React contexts
    │   ├── types/           # TypeScript types
    │   └── utils/           # Utility functions
    └── public/              # Static files
```

## 🐛 Son Düzeltmeler

### Kritik Düzeltmeler
- ✅ Using statement eksiklikleri giderildi
- ✅ JWT role mapping sorunu çözüldü
- ✅ API response tutarsızlığı düzeltildi
- ✅ Environment variables kullanımı eklendi
- ✅ Type safety iyileştirildi

### Güvenlik İyileştirmeleri
- ✅ JWT secret key güvenliği artırıldı
- ✅ CORS policy production için yapılandırıldı
- ✅ Rate limiting sabitleri optimize edildi
- ✅ Error handling geliştirildi

### Kod Kalitesi
- ✅ ErrorBoundary component eklendi
- ✅ Centralized config sistemi oluşturuldu
- ✅ Type definitions iyileştirildi
- ✅ Import/export tutarlılığı sağlandı

## 🚀 Deployment

### Production Build

#### Backend
```bash
cd backend
dotnet publish -c Release -o ./publish
```

#### Frontend
```bash
cd frontend
npm run build
```

### Docker (Opsiyonel)
```bash
docker-compose up -d
```

## 📝 API Dokümantasyonu

API dokümantasyonu Swagger UI ile sağlanmaktadır:
- Development: `http://localhost:5205/swagger`
- Production: `https://yourdomain.com/swagger`

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.

## 📞 İletişim

- **Proje Sahibi:** [Your Name]
- **Email:** [your.email@example.com]
- **GitHub:** [https://github.com/yourusername]

## 🙏 Teşekkürler

Bu projeyi geliştirirken kullanılan tüm açık kaynak kütüphanelere teşekkürler. 
