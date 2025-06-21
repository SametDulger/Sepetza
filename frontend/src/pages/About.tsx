import React from 'react';
import { motion } from 'framer-motion';
import { Users, Award, Clock, Shield, Target, Heart, Zap, Globe, TrendingUp, Sparkles } from 'lucide-react';

export const About: React.FC = () => {
  const stats = [
    { number: "100K+", label: "Mutlu Müşteri", icon: Users, gradient: "from-blue-500 to-indigo-600" },
    { number: "10K+", label: "Ürün Çeşidi", icon: Award, gradient: "from-green-500 to-emerald-600" },
    { number: "24/7", label: "Müşteri Desteği", icon: Clock, gradient: "from-yellow-500 to-orange-600" },
    { number: "5", label: "Yıllık Deneyim", icon: Shield, gradient: "from-red-500 to-pink-600" }
  ];

  const values = [
    {
      icon: Heart,
      title: "Müşteri Odaklı",
      description: "Müşteri memnuniyeti bizim için en öncelikli değerdir. Her adımımızda müşterilerimizin ihtiyaçlarını düşünürüz.",
      gradient: "from-pink-500 to-rose-600",
      bgGradient: "from-pink-50 to-rose-50"
    },
    {
      icon: Award,
      title: "Kalite Garantisi",
      description: "Sadece kaliteli ve güvenilir ürünleri müşterilerimizle buluşturuyoruz. Her ürün özenle seçilmiştir.",
      gradient: "from-green-500 to-emerald-600",
      bgGradient: "from-green-50 to-emerald-50"
    },
    {
      icon: Zap,
      title: "Hızlı Teslimat",
      description: "Siparişlerinizi en kısa sürede güvenli bir şekilde teslim ediyoruz. Hız bizim önceliğimizdir.",
      gradient: "from-yellow-500 to-orange-600",
      bgGradient: "from-yellow-50 to-orange-50"
    },
    {
      icon: Shield,
      title: "Güvenlik",
      description: "Kişisel bilgileriniz ve ödemeleriniz SSL ile korunmaktadır. Güvenliğiniz bizim sorumluluğumuzdur.",
      gradient: "from-blue-500 to-indigo-600",
      bgGradient: "from-blue-50 to-indigo-50"
    },
    {
      icon: Target,
      title: "Hedef Odaklı",
      description: "Sürekli gelişim ve yenilik ile sektörde öncü olmayı hedefliyoruz. Geleceği bugünden inşa ediyoruz.",
      gradient: "from-purple-500 to-violet-600",
      bgGradient: "from-purple-50 to-violet-50"
    },
    {
      icon: Globe,
      title: "Sürdürülebilirlik",
      description: "Çevre dostu uygulamalar ve sürdürülebilir ticaret anlayışı ile gelecek nesillere sorumluluk duyuyoruz.",
      gradient: "from-teal-500 to-cyan-600",
      bgGradient: "from-teal-50 to-cyan-50"
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
        {/* Hero Section - Ultra Modern */}
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
              <Sparkles className="w-5 h-5 mr-2 text-blue-600" />
              <span className="text-sm font-semibold text-blue-800">Sepetza Hikayesi</span>
              <TrendingUp className="w-5 h-5 ml-2 text-purple-600" />
            </motion.div>

            <motion.h1 
              className="text-5xl md:text-7xl font-black bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-8 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Hakkımızda
            </motion.h1>
            
            <motion.p 
              className="text-2xl md:text-3xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Türkiye'nin önde gelen e-ticaret platformu olarak, müşterilerimize en iyi alışveriş deneyimini sunuyoruz.
            </motion.p>

            {/* Animated Stats */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.05 }}
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <motion.div 
                    className="text-3xl font-bold text-gray-900 mb-2"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                  >
                    {stat.number}
                  </motion.div>
                  <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Company Story */}
        <section className="mb-20">
          <motion.div
            className="max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-12 relative overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-6 right-6 w-16 h-16 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full"></div>
              <div className="absolute bottom-6 left-6 w-12 h-12 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full"></div>

              <motion.h2 
                className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Hikayemiz
              </motion.h2>
              
              <div className="prose prose-xl max-w-none text-gray-700 leading-relaxed">
                <motion.p 
                  className="mb-6 text-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Sepetza, 2020 yılında Türkiye'de e-ticaret sektöründe yenilikçi bir yaklaşım getirmek amacıyla kuruldu. 
                  Müşteri memnuniyetini ön planda tutarak, kaliteli ürünleri uygun fiyatlarla sunma misyonuyla yola çıktık.
                </motion.p>
                
                <motion.p 
                  className="mb-6 text-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Bugün, elektronikten giyime, ev & yaşamdan spor & outdoor ürünlerine kadar geniş bir yelpazede 
                  binlerce ürünü müşterilerimizle buluşturuyoruz. Güvenilir, hızlı ve kaliteli hizmet anlayışımızla 
                  sektörde öncü konumdayız.
                </motion.p>
                
                <motion.p 
                  className="text-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  Teknolojinin gücünü kullanarak, müşterilerimize kolay, güvenli ve keyifli bir alışveriş deneyimi 
                  sunmaya devam ediyoruz. Hedefimiz, Türkiye'nin en çok tercih edilen e-ticaret platformu olmaktır.
                </motion.p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Values Section */}
        <section className="mb-20">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2 
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Değerlerimiz
            </motion.h2>
            
            <motion.p 
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Bizi biz yapan değerler ve ilkeler
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="group relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8 hover:shadow-2xl transition-all duration-500 overflow-hidden"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${value.bgGradient} opacity-0 group-hover:opacity-50 transition-opacity duration-500`} />
                
                {/* Icon */}
                <motion.div
                  className={`relative w-16 h-16 bg-gradient-to-r ${value.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <value.icon className="h-8 w-8 text-white" />
                  
                  {/* Glow Effect */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${value.gradient} opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500`} />
                </motion.div>
                
                {/* Content */}
                <div className="text-center relative z-10">
                  <motion.h3 
                    className="text-2xl font-bold text-gray-900 mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    {value.title}
                  </motion.h3>
                  
                  <motion.p 
                    className="text-gray-600 leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    {value.description}
                  </motion.p>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-4 left-4 w-1 h-1 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Vision & Mission */}
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
            {/* Vision */}
            <motion.div
              className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-12 text-white relative overflow-hidden"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='m0 40l40-40h-40v40zm40 0v-40h-40l40 40z'/%3E%3C/g%3E%3C/svg%3E")`,
                }} />
              </div>

              <div className="relative z-10">
                <motion.div
                  className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Target className="w-8 h-8 text-white" />
                </motion.div>
                
                <motion.h3 
                  className="text-3xl font-bold mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Vizyonumuz
                </motion.h3>
                
                <motion.p 
                  className="text-lg leading-relaxed text-white/90"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Türkiye'nin en güvenilir ve yenilikçi e-ticaret platformu olarak, müşterilerimizin hayatlarını 
                  kolaylaştıran, teknoloji ile desteklenen mükemmel alışveriş deneyimleri sunmak.
                </motion.p>
              </div>
            </motion.div>

            {/* Mission */}
            <motion.div
              className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 rounded-3xl p-12 text-white relative overflow-hidden"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='m0 40l40-40h-40v40zm40 0v-40h-40l40 40z'/%3E%3C/g%3E%3C/svg%3E")`,
                }} />
              </div>

              <div className="relative z-10">
                <motion.div
                  className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                >
                  <Heart className="w-8 h-8 text-white" />
                </motion.div>
                
                <motion.h3 
                  className="text-3xl font-bold mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Misyonumuz
                </motion.h3>
                
                <motion.p 
                  className="text-lg leading-relaxed text-white/90"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Kaliteli ürünleri uygun fiyatlarla sunarak, müşteri memnuniyetini ön planda tutan, 
                  sürdürülebilir ve sosyal sorumlu bir ticaret anlayışı ile değer yaratmak.
                </motion.p>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}; 