import React, { useState, useEffect } from 'react';
import { useToastContext } from '../../../contexts/ToastContext';
import api from '../../../services/api';

interface Order {
  id: number;
  userEmail: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

interface OrderItem {
  id: number;
  productName: string;
  quantity: number;
  price: number;
}

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);
  const { showError, showSuccess } = useToastContext();

  const fetchOrders = async (page = 1, search = '', status = '') => {
    try {
      setLoading(true);
      let url = `/admin/orders?page=${page}&pageSize=10`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (status) url += `&status=${status}`;
      
      const response = await api.get(url);
      
      // Handle different response structures
      let ordersData = [];
      let totalPagesData = 0;
      
      if (response.data) {
        if (response.data.success && response.data.data) {
          if (response.data.data.items) {
            ordersData = response.data.data.items;
            totalPagesData = response.data.data.totalPages || 0;
          } else if (response.data.data.data) {
            ordersData = response.data.data.data;
            totalPagesData = response.data.data.totalPages || response.data.data.TotalPages || 0;
          } else if (response.data.data.Data) {
            ordersData = response.data.data.Data;
            totalPagesData = response.data.data.TotalPages || response.data.data.totalPages || 0;
          } else if (Array.isArray(response.data.data)) {
            ordersData = response.data.data;
            totalPagesData = 1;
          } else {
            if (response.data.data.id || response.data.data.orderNumber) {
              ordersData = [response.data.data];
              totalPagesData = 1;
            }
          }
        } else if (response.data.items) {
          ordersData = response.data.items;
          totalPagesData = response.data.totalPages || 0;
        } else if (Array.isArray(response.data)) {
          ordersData = response.data;
          totalPagesData = 1;
        } else {
          // Try to find any array in the response
          const findArrayInObject = (obj: any): any[] => {
            if (Array.isArray(obj)) return obj;
            for (const key in obj) {
              if (Array.isArray(obj[key])) return obj[key];
              if (typeof obj[key] === 'object' && obj[key] !== null) {
                const result = findArrayInObject(obj[key]);
                if (result.length > 0) return result;
              }
            }
            return [];
          };
          
          ordersData = findArrayInObject(response.data);
          totalPagesData = 1;
        }
      }
      
      // Map backend fields to frontend fields
      const mappedOrders = ordersData.map((order: any) => ({
        ...order,
        createdAt: order.createdAt || order.orderDate || new Date().toISOString()
      }));
      
      setOrders(mappedOrders);
      setTotalPages(totalPagesData);
    } catch (error: any) {
      showError(error.response?.data?.message || error.message || 'Siparişler yüklenirken hata oluştu');
      setOrders([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage, searchTerm, statusFilter);
  }, [currentPage, searchTerm, statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchOrders(1, searchTerm, statusFilter);
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleShowDetails = async (order: Order) => {
    try {
      // Fetch full order details if needed
      const response = await api.get(`/admin/orders/${order.id}`);
      if (response.data.success && response.data.data) {
        setSelectedOrder(response.data.data);
      } else {
        setSelectedOrder(order);
      }
      setShowModal(true);
    } catch (error: any) {
      console.error('Error fetching order details:', error);
      setSelectedOrder(order);
      setShowModal(true);
    }
  };

  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    try {
      const response = await api.patch(`/admin/orders/${orderId}/status`, { status: newStatus });
      if (response.data.success) {
        showSuccess('Sipariş durumu güncellendi');
        fetchOrders(currentPage, searchTerm, statusFilter);
        setShowModal(false);
      } else {
        showError(response.data.message || 'Sipariş durumu güncellenirken hata oluştu');
      }
    } catch (error: any) {
      console.error('Error updating order status:', error);
      showError(error.response?.data?.message || 'Sipariş durumu güncellenirken hata oluştu');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Processing':
        return 'bg-blue-100 text-blue-800';
      case 'Shipped':
        return 'bg-purple-100 text-purple-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'Beklemede';
      case 'Processing':
        return 'İşleniyor';
      case 'Shipped':
        return 'Kargoya Verildi';
      case 'Delivered':
        return 'Teslim Edildi';
      case 'Cancelled':
        return 'İptal Edildi';
      default:
        return status;
    }
  };

  const getNextStatuses = (currentStatus: string) => {
    switch (currentStatus) {
      case 'Pending':
        return ['Processing', 'Cancelled'];
      case 'Processing':
        return ['Shipped', 'Cancelled'];
      case 'Shipped':
        return ['Delivered'];
      case 'Delivered':
        return [];
      case 'Cancelled':
        return [];
      default:
        return [];
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Sipariş Yönetimi</h1>
      </div>

      {/* Arama ve Filtreler */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <form onSubmit={handleSearch} className="flex gap-4">
          <input
            type="text"
            placeholder="Sipariş ara (sipariş no, müşteri email)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tüm Durumlar</option>
            <option value="Pending">Beklemede</option>
            <option value="Processing">İşleniyor</option>
            <option value="Shipped">Kargoya Verildi</option>
            <option value="Delivered">Teslim Edildi</option>
            <option value="Cancelled">İptal Edildi</option>
          </select>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Ara
          </button>
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('');
              setCurrentPage(1);
              fetchOrders(1, '', '');
            }}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Temizle
          </button>
        </form>
      </div>

      {/* Sipariş Tablosu */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sipariş No</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Müşteri</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tutar</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarih</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlemler</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{order.userEmail}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">₺{order.totalAmount.toFixed(2)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleShowDetails(order)}
                    className="text-blue-600 hover:text-blue-900 transition-colors"
                  >
                    Detaylar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {orders.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {searchTerm || statusFilter ? 'Arama kriterlerine uygun sipariş bulunamadı.' : 'Henüz sipariş yok.'}
          </div>
        )}
      </div>

      {/* Sayfalama */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Önceki
            </button>
            <span className="px-3 py-2 bg-blue-600 text-white rounded-md">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Sonraki
            </button>
          </div>
        </div>
      )}

      {/* Sipariş Detayları Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Sipariş Detayları - #{selectedOrder.id}</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Müşteri Email</label>
                  <p className="text-sm text-gray-900">{selectedOrder.userEmail}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Toplam Tutar</label>
                  <p className="text-sm text-gray-900">₺{selectedOrder.totalAmount.toFixed(2)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Sipariş Tarihi</label>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedOrder.createdAt).toLocaleString('tr-TR')}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mevcut Durum</label>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusText(selectedOrder.status)}
                  </span>
                </div>
              </div>

              {/* Sipariş Öğeleri */}
              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sipariş Öğeleri</label>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="min-w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ürün</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Adet</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Fiyat</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Toplam</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedOrder.items.map((item) => (
                          <tr key={item.id}>
                            <td className="px-4 py-2 text-sm text-gray-900">{item.productName}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">{item.quantity}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">₺{item.price.toFixed(2)}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">₺{(item.quantity * item.price).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Durum Güncelleme */}
              {getNextStatuses(selectedOrder.status).length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Durum Güncelle</label>
                  <div className="flex gap-2">
                    {getNextStatuses(selectedOrder.status).map((status) => (
                      <button
                        key={status}
                        onClick={() => handleUpdateStatus(selectedOrder.id, status)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        {getStatusText(status)} Yap
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders; 