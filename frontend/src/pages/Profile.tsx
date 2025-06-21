import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Edit3, Save, Camera, Shield, Bell, Palette } from 'lucide-react';
import { useToastContext } from '../contexts/ToastContext';
import { authService } from '../services/api';

export const Profile: React.FC = () => {
  const { showSuccess, showError } = useToastContext();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face'
  });

  useEffect(() => {
    // Kullanıcı bilgilerini authService'den al
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setProfileData({
        name: `${currentUser.firstName} ${currentUser.lastName}`,
        email: currentUser.email,
        phone: currentUser.phoneNumber || '',
        address: '', // Adres bilgisi ayrı bir endpoint'den alınacak
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face'
      });
    }
  }, []);

  const handleSave = () => {
    // Simulate API call
    setTimeout(() => {
      setIsEditing(false);
      showSuccess('Başarılı!', 'Profil bilgileriniz güncellendi.');
    }, 1000);
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 py-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233b82f6' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <User className="w-4 h-4 mr-2 text-blue-600" />
              <span className="text-sm font-semibold text-blue-800">Hesap Yönetimi</span>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Profil Bilgileri
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Hesap bilgilerinizi görüntüleyin ve güncelleyin
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8 text-center">
                {/* Avatar */}
                <div className="relative inline-block mb-6">
                  <motion.div
                    className="relative w-32 h-32 mx-auto"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <img
                      src={profileData.avatar}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
                    />
                    <motion.button
                      className="absolute bottom-2 right-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-full shadow-lg hover:shadow-xl transition-shadow"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Camera className="w-4 h-4" />
                    </motion.button>
                  </motion.div>
                </div>

                {/* Name */}
                <motion.h2 
                  className="text-2xl font-bold text-gray-900 mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {profileData.name}
                </motion.h2>
                
                <motion.p 
                  className="text-gray-600 mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  Premium Üye
                </motion.p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <motion.div
                    className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <div className="text-2xl font-bold text-blue-600">12</div>
                    <div className="text-sm text-blue-800">Toplam Sipariş</div>
                  </motion.div>
                  <motion.div
                    className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <div className="text-2xl font-bold text-purple-600">₺2.5K</div>
                    <div className="text-sm text-purple-800">Toplam Harcama</div>
                  </motion.div>
                </div>

                {/* Edit Button */}
                <motion.button
                  onClick={() => setIsEditing(!isEditing)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Edit3 className="w-4 h-4 inline mr-2" />
                  {isEditing ? 'İptal Et' : 'Düzenle'}
                </motion.button>
              </div>
            </motion.div>

            {/* Profile Form */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-gray-900">Kişisel Bilgiler</h3>
                  {isEditing && (
                    <motion.button
                      onClick={handleSave}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-2 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <Save className="w-4 h-4 inline mr-2" />
                      Kaydet
                    </motion.button>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Name Field */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      <User className="w-4 h-4 inline mr-2 text-blue-600" />
                      Ad Soyad
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                        placeholder="Ad Soyad"
                      />
                    ) : (
                      <div className="w-full px-4 py-3 bg-gray-50 rounded-2xl text-gray-900 font-medium">
                        {profileData.name}
                      </div>
                    )}
                  </motion.div>
                  
                  {/* Email Field */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      <Mail className="w-4 h-4 inline mr-2 text-blue-600" />
                      E-posta
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                        placeholder="E-posta adresi"
                      />
                    ) : (
                      <div className="w-full px-4 py-3 bg-gray-50 rounded-2xl text-gray-900 font-medium">
                        {profileData.email}
                      </div>
                    )}
                  </motion.div>
                  
                  {/* Phone Field */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      <Phone className="w-4 h-4 inline mr-2 text-blue-600" />
                      Telefon
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                        placeholder="Telefon numarası"
                      />
                    ) : (
                      <div className="w-full px-4 py-3 bg-gray-50 rounded-2xl text-gray-900 font-medium">
                        {profileData.phone}
                      </div>
                    )}
                  </motion.div>

                  {/* Address Field */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      <MapPin className="w-4 h-4 inline mr-2 text-blue-600" />
                      Adres
                    </label>
                    {isEditing ? (
                      <textarea
                        value={profileData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm resize-none"
                        placeholder="Adres bilgisi"
                      />
                    ) : (
                      <div className="w-full px-4 py-3 bg-gray-50 rounded-2xl text-gray-900 font-medium">
                        {profileData.address}
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Additional Settings */}
          <motion.div
            className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {/* Security Settings */}
            <motion.div
              className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/50 p-6 hover:shadow-xl transition-all duration-300"
              whileHover={{ y: -4 }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 ml-3">Güvenlik</h4>
              </div>
              <p className="text-gray-600 text-sm mb-4">Şifre ve güvenlik ayarlarınızı yönetin</p>
              <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                Ayarları Yönet →
              </button>
            </motion.div>

            {/* Notification Settings */}
            <motion.div
              className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/50 p-6 hover:shadow-xl transition-all duration-300"
              whileHover={{ y: -4 }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 ml-3">Bildirimler</h4>
              </div>
              <p className="text-gray-600 text-sm mb-4">E-posta ve SMS bildirim tercihleriniz</p>
              <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                Ayarları Yönet →
              </button>
            </motion.div>

            {/* Theme Settings */}
            <motion.div
              className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/50 p-6 hover:shadow-xl transition-all duration-300"
              whileHover={{ y: -4 }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center">
                  <Palette className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 ml-3">Tema</h4>
              </div>
              <p className="text-gray-600 text-sm mb-4">Görünüm ve tema tercihleriniz</p>
              <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                Ayarları Yönet →
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}; 