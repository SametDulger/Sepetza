import React, { useState, useEffect } from 'react';
import { Package, Calendar, CreditCard, Truck, Eye, RotateCcw, X, MapPin, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToastContext } from '../contexts/ToastContext';
import { cartService } from '../services/api';

interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  productImage: string;
}

interface Order {
  id: number;
  orderNumber: string;
  orderDate: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  items: OrderItem[];
  shippingAddress: string;
}

interface CargoTrackingStep {
  id: number;
  status: string;
  description: string;
  location: string;
  date: string;
  completed: boolean;
}

export const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [showCargoTracking, setShowCargoTracking] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);
  const { showSuccess, showError, showInfo } = useToastContext();

  useEffect(() => {
    // Simulated data - replace with actual API call
    setTimeout(() => {
      setOrders([
        {
          id: 1,
          orderNumber: 'SP-2025-001',
          orderDate: '2025-01-15',
          status: 'delivered',
          totalAmount: 45799.98,
          shippingAddress: 'İstanbul, Kadıköy',
          items: [
            {
              id: 1,
              productId: 1,
              productName: 'iPhone 15 Pro',
              quantity: 1,
              price: 42999.99,
              productImage: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600'
            },
            {
              id: 2,
              productId: 2,
              productName: 'AirPods Pro 2',
              quantity: 1,
              price: 6999.99,
              productImage: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600'
            }
          ]
        },
        {
          id: 2,
          orderNumber: 'SP-2025-002',
          orderDate: '2025-01-20',
          status: 'shipped',
          totalAmount: 5599.98,
          shippingAddress: 'Ankara, Çankaya',
          items: [
            {
              id: 3,
              productId: 3,
              productName: 'Nike Air Max 270',
              quantity: 2,
              price: 2799.99,
              productImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'
            }
          ]
        },
        {
          id: 3,
          orderNumber: 'SP-2025-003',
          orderDate: '2025-01-25',
          status: 'processing',
          totalAmount: 7999.99,
          shippingAddress: 'İzmir, Konak',
          items: [
            {
              id: 4,
              productId: 4,
              productName: 'Dyson V15 Detect',
              quantity: 1,
              price: 7999.99,
              productImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'
            }
          ]
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'Beklemede';
      case 'processing': return 'Hazırlanıyor';
      case 'shipped': return 'Kargoda';
      case 'delivered': return 'Teslim Edildi';
      case 'cancelled': return 'İptal Edildi';
      default: return status;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <Calendar size={16} />;
      case 'processing': return <Package size={16} />;
      case 'shipped': return <Truck size={16} />;
      case 'delivered': return <Package size={16} />;
      case 'cancelled': return <CreditCard size={16} />;
      default: return <Package size={16} />;
    }
  };

  const handleOrderDetail = (orderId: number) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      setSelectedOrder(order);
      setShowOrderDetail(true);
    }
  };

  const closeOrderDetail = () => {
    setShowOrderDetail(false);
    setSelectedOrder(null);
  };

  const handleReorder = async (orderId: number) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    try {
      let successCount = 0;
      let errorCount = 0;

             // Her ürünü sepete eklemeye çalış
       for (const item of order.items) {
         try {
           await cartService.addItem(item.productId, item.quantity);
           successCount++;
         } catch (error) {
           console.error(`Ürün sepete eklenirken hata (${item.productName}):`, error);
           errorCount++;
         }
       }

      // Sonuçlara göre mesaj göster
      if (successCount > 0 && errorCount === 0) {
        showSuccess('Tekrar Sipariş', `${successCount} ürün başarıyla sepete eklendi!`);
        // Sepet sayısını güncelle
        window.dispatchEvent(new Event('cartUpdated'));
      } else if (successCount > 0 && errorCount > 0) {
        showInfo('Kısmi Başarı', `${successCount} ürün sepete eklendi, ${errorCount} ürün eklenemedi.`);
        window.dispatchEvent(new Event('cartUpdated'));
      } else {
        showError('Hata', 'Ürünler sepete eklenemedi. Lütfen tekrar deneyin.');
      }
    } catch (error) {
      console.error('Tekrar sipariş hatası:', error);
      showError('Hata', 'Ürünler sepete eklenirken bir hata oluştu.');
    }
  };

  const handleCancelOrder = (orderId: number) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      setOrderToCancel(order);
      setShowCancelConfirm(true);
    }
  };

  const confirmCancelOrder = () => {
    if (orderToCancel) {
      setOrders(prevOrders => 
        prevOrders.map(o => 
          o.id === orderToCancel.id ? { ...o, status: 'cancelled' as const } : o
        )
      );
      showSuccess('Sipariş İptal Edildi', `Sipariş #${orderToCancel.orderNumber} başarıyla iptal edildi.`);
      // TODO: Call API to cancel order
    }
    setShowCancelConfirm(false);
    setOrderToCancel(null);
  };

  const closeCancelConfirm = () => {
    setShowCancelConfirm(false);
    setOrderToCancel(null);
  };

  const handleTrackOrder = (orderId: number) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      setSelectedOrder(order);
      setShowCargoTracking(true);
    }
  };

  const closeCargoTracking = () => {
    setShowCargoTracking(false);
    setSelectedOrder(null);
  };

  const getCargoTrackingData = (orderNumber: string): CargoTrackingStep[] => {
    return [
      {
        id: 1,
        status: 'Sipariş Alındı',
        description: 'Siparişiniz başarıyla alındı ve işleme konuldu.',
        location: 'Sepetza Merkez',
        date: '2025-01-20 10:30',
        completed: true
      },
      {
        id: 2,
        status: 'Hazırlanıyor',
        description: 'Siparişiniz kargo için hazırlanıyor.',
        location: 'Sepetza Depo',
        date: '2025-01-20 14:15',
        completed: true
      },
      {
        id: 3,
        status: 'Kargoya Verildi',
        description: 'Siparişiniz kargo firmasına teslim edildi.',
        location: 'Aras Kargo İstanbul',
        date: '2025-01-21 09:45',
        completed: true
      },
      {
        id: 4,
        status: 'Transfer Merkezinde',
        description: 'Paketiniz transfer merkezinde işleme alındı.',
        location: 'Aras Kargo Ankara',
        date: '2025-01-21 16:20',
        completed: true
      },
      {
        id: 5,
        status: 'Dağıtım Merkezinde',
        description: 'Paketiniz son dağıtım merkezine ulaştı.',
        location: 'Aras Kargo Çankaya',
        date: '2025-01-22 08:10',
        completed: true
      },
      {
        id: 6,
        status: 'Teslimat İçin Çıktı',
        description: 'Paketiniz teslimat için kurye aracına yüklendi.',
        location: 'Çankaya Şubesi',
        date: '2025-01-22 11:30',
        completed: false
      },
      {
        id: 7,
        status: 'Teslim Edildi',
        description: 'Paketiniz başarıyla teslim edildi.',
        location: 'Teslimat Adresi',
        date: '',
        completed: false
      }
    ];
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Siparişler yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Siparişlerim</h1>
          <div className="bg-white rounded-lg shadow-md p-12">
            <div className="text-gray-400 mb-4">
              <Package className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Henüz sipariş yok</h3>
            <p className="text-gray-600 mb-6">İlk siparişinizi vermek için alışverişe başlayın.</p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200">
              Alışverişe Başla
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Siparişlerim</h1>
      
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Sipariş Başlığı */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Sipariş #{order.orderNumber}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {new Date(order.orderDate).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="ml-1">{getStatusText(order.status)}</span>
                  </span>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      ₺{order.totalAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sipariş Detayları */}
            <div className="p-6">
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-md font-medium text-gray-900">
                        {item.productName}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Adet: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-md font-semibold text-gray-900">
                        ₺{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Teslimat Adresi:</span>
                  <span>{order.shippingAddress}</span>
                </div>
              </div>

              {/* Sipariş Aksiyonları */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={() => handleOrderDetail(order.id)}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center justify-center gap-2"
                >
                  <Eye size={16} />
                  Sipariş Detayı
                </button>
                {order.status === 'delivered' && (
                  <button 
                    onClick={() => handleReorder(order.id)}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition duration-200 flex items-center justify-center gap-2"
                  >
                    <RotateCcw size={16} />
                    Tekrar Sipariş Ver
                  </button>
                )}
                {order.status === 'shipped' && (
                  <button 
                    onClick={() => handleTrackOrder(order.id)}
                    className="flex-1 bg-green-100 text-green-700 py-2 px-4 rounded-lg hover:bg-green-200 transition duration-200 flex items-center justify-center gap-2"
                  >
                    <Truck size={16} />
                    Kargo Takip
                  </button>
                )}
                {(order.status === 'pending' || order.status === 'processing') && (
                  <button 
                    onClick={() => handleCancelOrder(order.id)}
                    className="flex-1 bg-red-100 text-red-700 py-2 px-4 rounded-lg hover:bg-red-200 transition duration-200 flex items-center justify-center gap-2"
                  >
                    <X size={16} />
                    Siparişi İptal Et
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sipariş İptal Onay Modal */}
      {showCancelConfirm && orderToCancel && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={closeCancelConfirm}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-3">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Siparişi İptal Et
                  </h2>
                </div>
              </div>
              <button
                onClick={closeCancelConfirm}
                className="text-gray-400 hover:text-gray-600 transition duration-200"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="mb-4">
                <p className="text-gray-700 mb-2">
                  <span className="font-semibold">Sipariş #{orderToCancel.orderNumber}</span> iptal edilsin mi?
                </p>
                <p className="text-sm text-gray-500">
                  Bu işlem geri alınamaz. İptal edilen sipariş tekrar aktif hale getirilemez.
                </p>
              </div>

              {/* Sipariş Özeti */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Sipariş Tutarı:</span>
                  <span className="font-semibold text-gray-900">
                    ₺{orderToCancel.totalAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Ürün Sayısı:</span>
                  <span className="text-gray-900">
                    {orderToCancel.items.length} ürün
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Sipariş Tarihi:</span>
                  <span className="text-gray-900">
                    {new Date(orderToCancel.orderDate).toLocaleDateString('tr-TR')}
                  </span>
                </div>
              </div>

              {/* İptal Nedeni Bilgisi */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-yellow-800">
                      İptal Koşulları
                    </h4>
                    <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside space-y-1">
                      <li>İptal edilen siparişler 3-5 iş günü içinde iade edilir</li>
                      <li>Kargo çıkmış siparişler iptal edilemez</li>
                      <li>İptal işlemi sonrası SMS ile bilgilendirileceksiniz</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={closeCancelConfirm}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-200"
              >
                Hayır, İptal Etme
              </button>
              <button
                onClick={confirmCancelOrder}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 flex items-center gap-2"
              >
                <X size={16} />
                Evet, İptal Et
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Kargo Takip Modal */}
      {showCargoTracking && selectedOrder && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={closeCargoTracking}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Truck className="w-6 h-6 mr-2" />
                  Kargo Takip
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Sipariş #{selectedOrder.orderNumber}
                </p>
              </div>
              <button
                onClick={closeCargoTracking}
                className="text-gray-400 hover:text-gray-600 transition duration-200"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Kargo Bilgileri */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Kargo Firması</h3>
                    <p className="text-gray-900 font-medium">Aras Kargo</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Takip Numarası</h3>
                    <p className="text-gray-900 font-mono">ARS{selectedOrder.id}2025001</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Tahmini Teslimat</h3>
                    <p className="text-gray-900">22 Ocak 2025, 18:00'a kadar</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Teslimat Adresi</h3>
                    <p className="text-gray-900">{selectedOrder.shippingAddress}</p>
                  </div>
                </div>
              </div>

              {/* Kargo Takip Adımları */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Kargo Hareketleri</h3>
                <div className="space-y-4">
                  {getCargoTrackingData(selectedOrder.orderNumber).map((step, index) => (
                    <div key={step.id} className="flex items-start space-x-4">
                      {/* Timeline Icon */}
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          step.completed 
                            ? 'bg-green-500 text-white' 
                            : index === getCargoTrackingData(selectedOrder.orderNumber).findIndex(s => !s.completed)
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-200 text-gray-400'
                        }`}>
                          {step.completed ? (
                            <CheckCircle size={16} />
                          ) : index === getCargoTrackingData(selectedOrder.orderNumber).findIndex(s => !s.completed) ? (
                            <Clock size={16} />
                          ) : (
                            <Clock size={16} />
                          )}
                        </div>
                        {index < getCargoTrackingData(selectedOrder.orderNumber).length - 1 && (
                          <div className={`w-0.5 h-12 mt-2 ${
                            step.completed ? 'bg-green-200' : 'bg-gray-200'
                          }`} />
                        )}
                      </div>

                      {/* Step Content */}
                      <div className="flex-grow pb-8">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className={`font-semibold ${
                            step.completed 
                              ? 'text-green-700' 
                              : index === getCargoTrackingData(selectedOrder.orderNumber).findIndex(s => !s.completed)
                                ? 'text-blue-700'
                                : 'text-gray-500'
                          }`}>
                            {step.status}
                          </h4>
                          {step.date && (
                            <span className="text-sm text-gray-500">
                              {step.date}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mb-1">
                          {step.description}
                        </p>
                        <div className="flex items-center text-xs text-gray-500">
                          <MapPin size={12} className="mr-1" />
                          {step.location}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bilgilendirme */}
              <div className="mt-6 bg-yellow-50 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Package className="w-5 h-5 text-yellow-600 mt-0.5" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Kargo Bilgilendirme
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <ul className="list-disc list-inside space-y-1">
                        <li>Kargo takip bilgileri 30 dakika aralıklarla güncellenir.</li>
                        <li>Teslimat saatleri 09:00 - 18:00 arasındadır.</li>
                        <li>Adresinizde bulunmadığınız takdirde kargo komşunuza teslim edilebilir.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sipariş Detayı Modal */}
      {showOrderDetail && selectedOrder && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={closeOrderDetail}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Sipariş Detayı
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Sipariş #{selectedOrder.orderNumber}
                </p>
              </div>
              <button
                onClick={closeOrderDetail}
                className="text-gray-400 hover:text-gray-600 transition duration-200"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Sipariş Bilgileri */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Sipariş Tarihi</h3>
                    <p className="text-gray-900">
                      {new Date(selectedOrder.orderDate).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Sipariş Durumu</h3>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                      {getStatusIcon(selectedOrder.status)}
                      <span className="ml-1">{getStatusText(selectedOrder.status)}</span>
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Teslimat Adresi</h3>
                    <p className="text-gray-900">{selectedOrder.shippingAddress}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Toplam Tutar</h3>
                    <p className="text-xl font-bold text-gray-900">
                      ₺{selectedOrder.totalAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Sipariş Ürünleri */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sipariş Edilen Ürünler</h3>
                <div className="space-y-4">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                      <div className="flex-shrink-0">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-grow">
                        <h4 className="text-lg font-medium text-gray-900">
                          {item.productName}
                        </h4>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">
                              Birim Fiyat: ₺{item.price.toLocaleString()}
                            </span>
                            <span className="text-sm text-gray-600">
                              Adet: {item.quantity}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold text-gray-900">
                              ₺{(item.price * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fiyat Özeti */}
              <div className="mt-6 bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Fiyat Özeti</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Ara Toplam:</span>
                    <span className="text-gray-900">₺{selectedOrder.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Kargo:</span>
                    <span className="text-green-600">Ücretsiz</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-900">Toplam:</span>
                      <span className="text-lg font-bold text-gray-900">₺{selectedOrder.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            {selectedOrder.status === 'delivered' && (
              <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    handleReorder(selectedOrder.id);
                    closeOrderDetail();
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 flex items-center gap-2"
                >
                  <RotateCcw size={16} />
                  Tekrar Sipariş Ver
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}; 