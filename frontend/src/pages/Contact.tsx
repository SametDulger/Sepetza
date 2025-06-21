import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, Headphones, Shield, Zap, Sparkles, Users } from 'lucide-react';
import { useToastContext } from '../contexts/ToastContext';

export const Contact: React.FC = () => {
  const { showSuccess, showError } = useToastContext();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showSuccess('Mesaj Gönderildi', 'Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      showError('Hata', 'Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyiniz.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactMethods = [
    {
      icon: Phone,
      title: "Telefon",
      description: "Doğrudan bize ulaşın",
      info: ["+90 555 123 45 67", "+90 212 123 45 67"],
      gradient: "from-blue-500 to-indigo-600",
      bgGradient: "from-blue-50 to-indigo-50"
    },
    {
      icon: Mail,
      title: "E-posta",
      description: "E-posta ile iletişim",
      info: ["info@sepetza.com", "destek@sepetza.com"],
      gradient: "from-green-500 to-emerald-600",
      bgGradient: "from-green-50 to-emerald-50"
    },
    {
      icon: MapPin,
      title: "Adres",
      description: "Ofis adresimiz",
      info: ["Maslak Mahallesi", "Büyükdere Caddesi No: 123", "Sarıyer/İstanbul"],
      gradient: "from-purple-500 to-violet-600",
      bgGradient: "from-purple-50 to-violet-50"
    }
  ];

  const quickContacts = [
    {
      icon: Headphones,
      title: "Sipariş Takibi",
      number: "0850 123 45 67",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      icon: Shield,
      title: "Teknik Destek",
      number: "0850 123 45 68",
      gradient: "from-green-500 to-green-600"
    },
    {
      icon: Zap,
      title: "İade & Değişim",
      number: "0850 123 45 69",
      gradient: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233b82f6' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 py-16 relative">
        {/* Hero Section */}
        <section className="relative overflow-hidden mb-20">
          {/* Floating Elements */}
          <motion.div
            className="absolute top-10 right-10 w-20 h-20 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-10 left-10 w-32 h-32 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-xl"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{ duration: 6, repeat: Infinity, delay: 2 }}
          />

          <div className="max-w-6xl mx-auto text-center relative z-10">
            <motion.div
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-8 shadow-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <MessageCircle className="w-5 h-5 mr-2 text-blue-600" />
              <span className="text-sm font-semibold text-blue-800">Size Nasıl Yardımcı Olabiliriz?</span>
              <Users className="w-5 h-5 ml-2 text-purple-600" />
            </motion.div>

            <motion.h1 
              className="text-5xl md:text-7xl font-black bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-8 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              İletişim
            </motion.h1>
            
            <motion.p 
              className="text-2xl md:text-3xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Bizimle iletişime geçin. Sorularınızı yanıtlamak ve size yardımcı olmak için buradayız.
            </motion.p>

            {/* Quick Contact Cards */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {quickContacts.map((contact, index) => (
                <motion.div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${contact.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <contact.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{contact.title}</h3>
                  <p className="text-xl font-semibold text-blue-600">{contact.number}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Contact Methods */}
              <div className="space-y-6">
                {contactMethods.map((method, index) => (
                  <motion.div
                    key={index}
                    className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8 hover:shadow-2xl transition-all duration-500 overflow-hidden"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                  >
                    {/* Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${method.bgGradient} opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
                    
                    <div className="relative z-10 flex items-start">
                      <motion.div
                        className={`w-16 h-16 bg-gradient-to-r ${method.gradient} rounded-2xl flex items-center justify-center mr-6 shadow-lg flex-shrink-0`}
                        whileHover={{ rotate: 5, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <method.icon className="h-8 w-8 text-white" />
                      </motion.div>
                      
                      <div className="flex-grow">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{method.title}</h3>
                        <p className="text-gray-600 mb-4">{method.description}</p>
                        <div className="space-y-1">
                          {method.info.map((item, idx) => (
                            <p key={idx} className="text-gray-700 font-medium">{item}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Working Hours */}
              <motion.div
                className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-8 text-white relative overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='m0 40l40-40h-40v40zm40 0v-40h-40l40 40z'/%3E%3C/g%3E%3C/svg%3E")`,
                  }} />
                </div>

                <div className="relative z-10">
                  <div className="flex items-center mb-6">
                    <motion.div
                      className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mr-4"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Clock className="w-6 h-6 text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-bold">Çalışma Saatleri</h3>
                  </div>
                  
                  <div className="space-y-2 text-white/90">
                    <p className="flex justify-between">
                      <span>Pazartesi - Cuma:</span>
                      <span className="font-semibold">09:00 - 18:00</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Cumartesi:</span>
                      <span className="font-semibold">10:00 - 16:00</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Pazar:</span>
                      <span className="font-semibold text-red-200">Kapalı</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="flex items-center mb-8">
                <motion.div
                  className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mr-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Send className="w-6 h-6 text-white" />
                </motion.div>
                <h2 className="text-3xl font-bold text-gray-900">Bize Yazın</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-3">
                    Ad Soyad *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                    placeholder="Adınızı ve soyadınızı girin"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                    E-posta *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                    placeholder="E-posta adresinizi girin"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-3">
                    Konu *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                  >
                    <option value="">Konu seçin</option>
                    <option value="siparis">Sipariş ile ilgili</option>
                    <option value="urun">Ürün ile ilgili</option>
                    <option value="iade">İade & Değişim</option>
                    <option value="teknik">Teknik Destek</option>
                    <option value="oneri">Öneri & Şikayet</option>
                    <option value="diger">Diğer</option>
                  </select>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-3">
                    Mesaj *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm resize-none"
                    placeholder="Mesajınızı buraya yazın..."
                  />
                </motion.div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  {isSubmitting ? (
                    <motion.div 
                      className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  ) : (
                    <Send className="h-5 w-5 mr-3" />
                  )}
                  {isSubmitting ? 'Gönderiliyor...' : 'Mesaj Gönder'}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}; 