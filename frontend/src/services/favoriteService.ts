import api from './api';

export interface FavoriteItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  discountPrice?: number;
  image: string;
  stockQuantity: number;
  brand?: string;
  category?: string;
}

class FavoriteService {
  // Get user favorites
  async getFavorites(): Promise<FavoriteItem[]> {
    const response = await api.get('/favorites');
    return response.data;
  }

  // Add product to favorites
  async addToFavorites(productId: number): Promise<void> {
    await api.post(`/favorites/${productId}`);
  }

  // Remove product from favorites
  async removeFromFavorites(productId: number): Promise<void> {
    await api.delete(`/favorites/${productId}`);
  }

  // Check if product is in favorites
  async checkIfFavorite(productId: number): Promise<boolean> {
    const response = await api.get(`/favorites/check/${productId}`);
    return response.data.isFavorite;
  }
}

export const favoriteService = new FavoriteService(); 