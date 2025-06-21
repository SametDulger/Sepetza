import React from 'react';
import { FileText, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export const Terms: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl p-8 mb-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Kullanım Şartları</h1>
          <p className="text-xl text-blue-100">
            Sepetza platformunu kullanırken uymanız gereken kurallar ve koşullar.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Last Updated */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <p className="text-blue-800">
            <strong>Son Güncelleme:</strong> 1 Ocak 2025
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center mb-4">
            <FileText className="h-6 w-6 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Genel Koşullar</h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            Bu kullanım şartları, Sepetza e-ticaret platformunu kullanan tüm kullanıcılar için 
            geçerlidir. Platformumuzu kullanarak bu şartları kabul etmiş sayılırsınız. Lütfen 
            bu şartları dikkatlice okuyunuz.
          </p>
        </div>

        {/* User Responsibilities */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center mb-4">
            <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Kullanıcı Sorumlulukları</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Hesap Güvenliği</h3>
              <ul className="text-gray-600 space-y-1 ml-4">
                <li>• Hesap bilgilerinizi güvenli tutmakla yükümlüsünüz</li>
                <li>• Şifrenizi kimseyle paylaşmamalısınız</li>
                <li>• Hesabınızda gerçekleşen tüm işlemlerden sorumlusunuz</li>
                <li>• Şüpheli aktivite durumunda derhal bildirim yapmalısınız</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Doğru Bilgi Verme</h3>
              <ul className="text-gray-600 space-y-1 ml-4">
                <li>• Kayıt sırasında doğru ve güncel bilgiler vermelisiniz</li>
                <li>• Sahte kimlik veya bilgi kullanmamalısınız</li>
                <li>• Bilgilerinizde değişiklik olduğunda güncellemelisiniz</li>
                <li>• Yasal yaş sınırlarına uymalısınız (18 yaş ve üzeri)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Prohibited Activities */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center mb-4">
            <XCircle className="h-6 w-6 text-red-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Yasak Faaliyetler</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-red-600 mb-3">Teknik Kötüye Kullanım</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Sistemlere yetkisiz erişim</li>
                <li>• Zararlı yazılım yükleme</li>
                <li>• Site işleyişini bozma</li>
                <li>• Otomatik bot kullanımı</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-red-600 mb-3">İçerik Kötüye Kullanımı</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Sahte yorum ve değerlendirme</li>
                <li>• Telif hakkı ihlali</li>
                <li>• Spam ve istenmeyen içerik</li>
                <li>• Hakaret ve tehdit içeren mesajlar</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Order Terms */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sipariş Koşulları</h2>
          
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Sipariş Süreci</h3>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Tüm siparişler onay sürecinden geçer</li>
                <li>• Stok durumuna göre sipariş iptal edilebilir</li>
                <li>• Fiyat hataları durumunda sipariş iptal edilebilir</li>
                <li>• Ödeme onayı alındıktan sonra sipariş kesinleşir</li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">Ödeme ve Fatura</h3>
              <ul className="text-green-700 text-sm space-y-1">
                <li>• Tüm ödemeler güvenli ödeme sistemleri ile yapılır</li>
                <li>• Faturalar elektronik ortamda düzenlenir</li>
                <li>• KDV dahil fiyatlar geçerlidir</li>
                <li>• Ödeme sorunları durumunda sipariş askıya alınabilir</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Liability */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-6 w-6 text-yellow-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Sorumluluk Sınırları</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Platform Sorumluluğu</h3>
              <p className="text-gray-600 text-sm mb-2">
                Sepetza, platformun kesintisiz ve hatasız çalışacağını garanti etmez. 
                Teknik arızalar, bakım çalışmaları veya üçüncü taraf kaynaklı sorunlar 
                nedeniyle oluşabilecek zararlardan sorumlu değildir.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Ürün Sorumluluğu</h3>
              <p className="text-gray-600 text-sm mb-2">
                Ürünlerin kalitesi, güvenliği ve yasal uygunluğu konusunda temel sorumluluk 
                üreticilere aittir. Sepetza, ürün bilgilerinin doğruluğu için çaba gösterir 
                ancak mutlak doğruluk garanti etmez.
              </p>
            </div>
          </div>
        </div>

        {/* Intellectual Property */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Fikri Mülkiyet Hakları</h2>
          
          <div className="space-y-4">
            <p className="text-gray-600">
              Sepetza platformundaki tüm içerik, tasarım, logo, marka ve yazılımlar 
              fikri mülkiyet hakları ile korunmaktadır.
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">Kullanım İzinleri</h3>
              <ul className="text-yellow-700 text-sm space-y-1">
                <li>• Kişisel ve ticari olmayan kullanım için izin verilir</li>
                <li>• İçerikleri kopyalama, dağıtma yasaktır</li>
                <li>• Ters mühendislik ve kod çalma yasaktır</li>
                <li>• Marka ve logoları izinsiz kullanma yasaktır</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Termination */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Hesap Sonlandırma</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Kullanıcı Sonlandırması</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• İstediğiniz zaman hesabınızı kapatabilirsiniz</li>
                <li>• Bekleyen siparişlerinizi tamamlamanız gerekir</li>
                <li>• Verileriniz gizlilik politikası uyarınca işlenir</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Platform Sonlandırması</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Şartları ihlal eden hesaplar kapatılabilir</li>
                <li>• Şüpheli aktivite durumunda hesap askıya alınabilir</li>
                <li>• Yasal süreçler nedeniyle erişim engellenebilir</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Changes to Terms */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Şartlarda Değişiklik</h2>
          <p className="text-gray-600 mb-4">
            Sepetza, kullanım şartlarını önceden haber vermeksizin değiştirme hakkını saklı tutar. 
            Değişiklikler site üzerinde yayınlandığı anda yürürlüğe girer.
          </p>
          <p className="text-gray-600">
            Önemli değişiklikler için kullanıcılar e-posta veya site bildirimi ile bilgilendirilir.
          </p>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">İletişim</h2>
          <p className="text-gray-600 mb-4">
            Kullanım şartları hakkında sorularınız için bizimle iletişime geçebilirsiniz:
          </p>
          
          <div className="space-y-2 text-gray-600">
            <p><strong>E-posta:</strong> legal@sepetza.com</p>
            <p><strong>Telefon:</strong> 0850 123 45 67</p>
            <p><strong>Adres:</strong> Maslak Mahallesi, Büyükdere Caddesi No: 123, Sarıyer/İstanbul</p>
          </div>
        </div>
      </div>
    </div>
  );
}; 