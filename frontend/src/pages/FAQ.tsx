import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    id: 1,
    question: "Sipariş nasıl verebilirim?",
    answer: "Sepetza'da sipariş vermek çok kolay! İstediğiniz ürünü seçin, sepete ekleyin ve ödeme sayfasında gerekli bilgileri doldurun. Kredi kartı, banka kartı veya havale ile ödeme yapabilirsiniz.",
    category: "Sipariş"
  },
  {
    id: 2,
    question: "Kargo ücreti ne kadar?",
    answer: "150 TL ve üzeri alışverişlerde kargo ücretsizdir. 150 TL altındaki siparişlerde kargo ücreti 29,90 TL'dir.",
    category: "Kargo"
  },
  {
    id: 3,
    question: "Siparişim ne zaman teslim edilir?",
    answer: "Siparişiniz onaylandıktan sonra 1-3 iş günü içinde kargoya verilir. Kargo süresi bulunduğunuz ile göre 1-5 iş günü arasında değişmektedir.",
    category: "Kargo"
  },
  {
    id: 4,
    question: "Ürün iadesi nasıl yapılır?",
    answer: "Ürününüzü teslim aldıktan sonra 14 gün içinde iade edebilirsiniz. Hesabınıza giriş yaparak 'Siparişlerim' bölümünden iade talebinde bulunabilirsiniz.",
    category: "İade"
  },
  {
    id: 5,
    question: "Hangi ödeme yöntemlerini kabul ediyorsunuz?",
    answer: "Visa, MasterCard, American Express kredi kartları, banka kartları ve havale/EFT ile ödeme yapabilirsiniz. Tüm ödemeler SSL sertifikası ile güvence altındadır.",
    category: "Ödeme"
  },
  {
    id: 6,
    question: "Siparişimi iptal edebilir miyim?",
    answer: "Siparişiniz henüz kargoya verilmemişse iptal edebilirsiniz. Hesabınıza giriş yaparak 'Siparişlerim' bölümünden iptal işlemini gerçekleştirebilirsiniz.",
    category: "Sipariş"
  },
  {
    id: 7,
    question: "Ürün değişimi yapabilir miyim?",
    answer: "Evet, ürününüzü teslim aldıktan sonra 14 gün içinde değişim yapabilirsiniz. Ürün kullanılmamış ve orijinal ambalajında olmalıdır.",
    category: "İade"
  },
  {
    id: 8,
    question: "Fatura nasıl alırım?",
    answer: "Bireysel müşterilerimiz için otomatik olarak e-fatura kesilir. Kurumsal fatura için sipariş sırasında fatura bilgilerini eksiksiz doldurmanız gerekmektedir.",
    category: "Fatura"
  },
  {
    id: 9,
    question: "Üyelik ücretsiz mi?",
    answer: "Evet, Sepetza üyeliği tamamen ücretsizdir. Üye olmak için sadece e-posta adresiniz ve bir şifre belirlemeniz yeterlidir.",
    category: "Üyelik"
  },
  {
    id: 10,
    question: "Şifremi unuttum, ne yapmalıyım?",
    answer: "Giriş sayfasında 'Şifremi Unuttum' linkine tıklayarak e-posta adresinizi girin. Size şifre sıfırlama linki gönderilecektir.",
    category: "Üyelik"
  },
  {
    id: 11,
    question: "Ürün garantisi var mı?",
    answer: "Tüm ürünlerimiz üretici garantisi ile satılmaktadır. Garanti süresi ürüne göre değişmektedir ve ürün sayfasında belirtilmiştir.",
    category: "Garanti"
  },
  {
    id: 12,
    question: "Müşteri hizmetleri ile nasıl iletişime geçebilirim?",
    answer: "0850 123 45 67 numaralı telefondan, info@sepetza.com e-posta adresinden veya canlı destek hattından bizimle iletişime geçebilirsiniz.",
    category: "Destek"
  }
];

const categories = ["Tümü", "Sipariş", "Kargo", "İade", "Ödeme", "Fatura", "Üyelik", "Garanti", "Destek"];

export const FAQ: React.FC = () => {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [searchTerm, setSearchTerm] = useState("");

  const toggleExpand = (id: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const filteredFAQs = faqData.filter(item => {
    const matchesCategory = selectedCategory === "Tümü" || item.category === selectedCategory;
    const matchesSearch = searchTerm === "" || 
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl p-8 mb-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Sık Sorulan Sorular</h1>
          <p className="text-xl text-blue-100">
            Merak ettiğiniz soruların cevaplarını burada bulabilirsiniz.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Soru ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Kategoriler</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQs.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500">Aradığınız kriterlere uygun soru bulunamadı.</p>
            </div>
          ) : (
            filteredFAQs.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <button
                  onClick={() => toggleExpand(item.id)}
                  className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full mr-3">
                      {item.category}
                    </span>
                    <h3 className="text-lg font-medium text-gray-900">{item.question}</h3>
                  </div>
                  {expandedItems.has(item.id) ? (
                    <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>
                
                {expandedItems.has(item.id) && (
                  <div className="px-6 pb-4">
                    <div className="border-t border-gray-200 pt-4">
                      <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Contact Support */}
        <div className="bg-blue-50 rounded-lg p-6 mt-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Aradığınız cevabı bulamadınız mı?
          </h3>
          <p className="text-gray-600 mb-4">
            Müşteri hizmetlerimiz size yardımcı olmaktan mutluluk duyar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              İletişime Geç
            </a>
            <a
              href="tel:+908501234567"
              className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium"
            >
              0850 123 45 67
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}; 