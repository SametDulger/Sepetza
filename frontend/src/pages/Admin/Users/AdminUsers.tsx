import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToastContext } from '../../../contexts/ToastContext';
import api from '../../../services/api';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  createdDate?: string; // Backend compatibility
  isDeleted?: boolean; // Backend field
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const navigate = useNavigate();
  const { showError, showSuccess } = useToastContext();

  const fetchUsers = async (page = 1, search = '', role = '') => {
    try {
      setLoading(true);
      let url = `/admin/users?page=${page}&pageSize=10`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (role) url += `&role=${role}`;
      
      const response = await api.get(url);
      
      // Handle different response structures
      let usersData = [];
      let totalPagesData = 0;
      
      if (response.data) {
        if (response.data.success && response.data.data) {
          if (response.data.data.items) {
            usersData = response.data.data.items;
            totalPagesData = response.data.data.totalPages || 0;
          } else if (response.data.data.data) {
            usersData = response.data.data.data;
            totalPagesData = response.data.data.totalPages || response.data.data.TotalPages || 0;
          } else if (response.data.data.Data) {
            usersData = response.data.data.Data;
            totalPagesData = response.data.data.TotalPages || response.data.data.totalPages || 0;
          } else if (Array.isArray(response.data.data)) {
            usersData = response.data.data;
            totalPagesData = 1;
          } else {
            if (response.data.data.id || response.data.data.email) {
              usersData = [response.data.data];
              totalPagesData = 1;
            }
          }
        } else if (response.data.items) {
          usersData = response.data.items;
          totalPagesData = response.data.totalPages || 0;
        } else if (Array.isArray(response.data)) {
          usersData = response.data;
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
          
          usersData = findArrayInObject(response.data);
          totalPagesData = 1;
        }
      }
      
      // Map backend fields to frontend fields
      const mappedUsers = usersData.map((user: any) => ({
        ...user,
        createdAt: user.createdAt || user.createdDate || new Date().toISOString(),
        isActive: user.isActive !== undefined ? user.isActive : true
      }));
      
      setUsers(mappedUsers);
      setTotalPages(totalPagesData);
    } catch (error: any) {
      showError(error.response?.data?.message || error.message || 'Kullanıcılar yüklenirken hata oluştu');
      setUsers([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage, searchTerm, roleFilter);
  }, [currentPage, searchTerm, roleFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchUsers(1, searchTerm, roleFilter);
  };

  const handleRoleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRoleFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleToggleStatus = async (id: number) => {
    try {
      const response = await api.patch(`/admin/users/${id}/toggle-status`);
      if (response.data.success) {
        showSuccess('Kullanıcı durumu güncellendi');
        fetchUsers(currentPage, searchTerm, roleFilter);
      } else {
        showError(response.data.message || 'Kullanıcı durumu güncellenirken hata oluştu');
      }
    } catch (error: any) {
      console.error('Error toggling user status:', error);
      showError(error.response?.data?.message || 'Kullanıcı durumu güncellenirken hata oluştu');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await api.delete(`/admin/users/${id}`);
      if (response.data.success) {
        showSuccess('Kullanıcı başarıyla silindi');
        fetchUsers(currentPage, searchTerm, roleFilter);
      } else {
        showError(response.data.message || 'Kullanıcı silinirken hata oluştu');
      }
    } catch (error: any) {
      console.error('Error deleting user:', error);
      showError(error.response?.data?.message || 'Kullanıcı silinirken hata oluştu');
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'Yönetici';
      case 'User':
        return 'Kullanıcı';
      default:
        return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'bg-purple-100 text-purple-800';
      case 'User':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
        <h1 className="text-2xl font-bold text-gray-900">Kullanıcı Yönetimi</h1>
      </div>

      {/* Arama ve Filtreler */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <form onSubmit={handleSearch} className="flex gap-4">
          <input
            type="text"
            placeholder="Kullanıcı ara (ad, soyad, email)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={roleFilter}
            onChange={handleRoleFilterChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tüm Roller</option>
            <option value="User">Kullanıcı</option>
            <option value="Admin">Yönetici</option>
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
              setRoleFilter('');
              setCurrentPage(1);
              fetchUsers(1, '', '');
            }}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Temizle
          </button>
        </form>
      </div>

      {/* Kullanıcı Tablosu */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kullanıcı</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kayıt Tarihi</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlemler</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm text-gray-500">ID: {user.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                    {getRoleText(user.role)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleToggleStatus(user.id)}
                    className={`px-2 py-1 text-xs font-semibold rounded-full cursor-pointer hover:opacity-80 transition-opacity ${
                      user.isActive 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}
                  >
                    {user.isActive ? 'Aktif' : 'Pasif'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => navigate(`/admin/users/edit/${user.id}`)}
                    className="text-blue-600 hover:text-blue-900 mr-4 transition-colors"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-red-600 hover:text-red-900 transition-colors"
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {users.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {searchTerm || roleFilter ? 'Arama kriterlerine uygun kullanıcı bulunamadı.' : 'Henüz kullanıcı kaydı yok.'}
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
    </div>
  );
};

export default AdminUsers; 