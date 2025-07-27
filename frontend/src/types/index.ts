export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'Customer' | 'Admin';
  phoneNumber?: string;
  isActive?: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
  expiresAt: Date;
  success: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  discountPrice?: number;
  discountPercentage?: number;
  stockQuantity: number;
  categoryId: number;
  categoryName: string;
  brand?: string;
  dimensions?: string;
  weight?: string;
  images: string[];
  productImages?: string[];
  rating: number;
  reviewCount: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  parentId?: number;
  parentCategoryId?: number;
  isActive: boolean;
  productCount: number;
  subCategories?: Category[];
}

export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  orderDate: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned';
  totalAmount: number;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

export interface Address {
  id: number;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export interface Review {
  id: number;
  productId: number;
  userId: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Favorite {
  id: number;
  productId: number;
  product: Product;
  addedAt: string;
} 