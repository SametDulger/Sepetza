import React, { useState } from 'react';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubscribing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubscribing(false);
    setEmail('');
    // You can add toast notification here
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.footer 
      className="bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 text-gray-800 relative overflow-hidden mt-auto border-t border-gray-300"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233b82f6' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
        >
          {/* Şirket Bilgileri */}
          <motion.div variants={itemVariants}>
            <motion.h3 
              className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
            >
              Sepetza
            </motion.h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Türkiye'nin önde gelen e-ticaret platformu. Kaliteli ürünler, uygun fiyatlar ve hızlı teslimat.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: Facebook, color: 'hover:text-blue-400' },
                { icon: Twitter, color: 'hover:text-sky-400' },
                { icon: Instagram, color: 'hover:text-pink-400' }
              ].map((social, index) => (
                <motion.button
                  key={index}
                  className={cn("text-gray-500 transition-all duration-300 p-2 rounded-full hover:bg-blue-100 hover:bg-opacity-50", social.color)}
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <social.icon size={20} />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Hızlı Linkler */}
          <motion.div variants={itemVariants}>
            <h4 className="text-lg font-semibold mb-6 text-gray-800">Hızlı Linkler</h4>
            <ul className="space-y-3">
              {[
                { href: '/about', text: 'Hakkımızda' },
                { href: '/contact', text: 'İletişim' },
                { href: '/faq', text: 'Sık Sorulan Sorular' },
                { href: '/shipping', text: 'Kargo Bilgileri' },
                { href: '/returns', text: 'İade & Değişim' }
              ].map((link, index) => (
                <motion.li key={index} whileHover={{ x: 5 }}>
                  <a 
                    href={link.href} 
                    className="text-gray-600 hover:text-blue-600 transition-all duration-300 inline-block relative group"
                  >
                    {link.text}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" />
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Kategoriler */}
          <motion.div variants={itemVariants}>
            <h4 className="text-lg font-semibold mb-6 text-gray-800">Kategoriler</h4>
            <ul className="space-y-3">
              {[
                { href: '/products?category=1', text: 'Elektronik' },
                { href: '/products?category=2', text: 'Giyim' },
                { href: '/products?category=3', text: 'Ev & Yaşam' },
                { href: '/products?category=4', text: 'Spor & Outdoor' }
              ].map((category, index) => (
                <motion.li key={index} whileHover={{ x: 5 }}>
                  <a 
                    href={category.href} 
                    className="text-gray-600 hover:text-blue-600 transition-all duration-300 inline-block relative group"
                  >
                    {category.text}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" />
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* İletişim Bilgileri */}
          <motion.div variants={itemVariants}>
            <h4 className="text-lg font-semibold mb-6 text-gray-800">İletişim</h4>
            <div className="space-y-4">
              {[
                { icon: MapPin, text: 'İstanbul, Türkiye' },
                { icon: Phone, text: '+90 555 123 45 67' },
                { icon: Mail, text: 'info@sepetza.com' }
              ].map((contact, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center group cursor-pointer"
                  whileHover={{ x: 5 }}
                >
                  <contact.icon size={16} className="mr-3 text-blue-600 group-hover:text-blue-700 transition-colors" />
                  <span className="text-gray-600 text-sm group-hover:text-gray-800 transition-colors">
                    {contact.text}
                  </span>
                </motion.div>
              ))}
            </div>
            
            {/* Newsletter */}
            <motion.div 
              className="mt-8"
              variants={itemVariants}
            >
              <h5 className="text-md font-semibold mb-4 text-gray-800">Bülten</h5>
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="E-posta adresiniz"
                    className="w-full px-4 py-3 bg-white/70 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-500 backdrop-blur-sm transition-all duration-300"
                    required
                  />
                </div>
                <motion.button
                  type="submit"
                  disabled={isSubscribing}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubscribing ? (
                    <motion.div
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Abone Ol</span>
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Alt Kısım */}
        <motion.div 
          className="border-t border-gray-300 mt-12 pt-8"
          variants={itemVariants}
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <motion.div 
              className="text-gray-600 text-sm"
              whileHover={{ color: '#374151' }}
            >
              © 2025 Sepetza. Tüm hakları saklıdır.
            </motion.div>
            <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
              {[
                { href: '/privacy', text: 'Gizlilik Politikası' },
                { href: '/terms', text: 'Kullanım Şartları' },
                { href: '/cookies', text: 'Çerez Politikası' }
              ].map((link, index) => (
                <motion.a
                  key={index}
                  href={link.href}
                  className="text-gray-600 hover:text-blue-600 transition-all duration-300 relative group"
                  whileHover={{ y: -2 }}
                >
                  {link.text}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" />
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}; 