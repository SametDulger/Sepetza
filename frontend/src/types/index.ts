export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth?: string;
  role: UserRole;
  createdDate: string;
}

export enum UserRole {
  Customer = 0,
  Admin = 1
}

export interface Category {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  displayOrder: number;
  parentCategoryId?: number;
  subCategories?: Category[];
}

export interface Product {
  id: number;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  discountPrice?: number;
  sku: string;
  stockQuantity: number;
  isActive: boolean;
  isFeatured: boolean;
  rating: number;
  reviewCount: number;
  brand: string;
  weight: number;
  dimensions: string;
  categoryId: number;
  category: Category;
  productImages: ProductImage[];
  reviews: Review[];
}

export interface ProductImage {
  id: number;
  imageUrl: string;
  altText: string;
  isMain: boolean;
  displayOrder: number;
  productId: number;
}

export interface CartItem {
  id: number;
  quantity: number;
  unitPrice: number;
  userId: number;
  productId: number;
  product: Product;
}

export interface Order {
  id: number;
  orderNumber: string;
  orderDate: string;
  status: OrderStatus;
  subTotal: number;
  shippingCost: number;
  taxAmount: number;
  totalAmount: number;
  notes: string;
  shippingFirstName: string;
  shippingLastName: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingZipCode: string;
  shippingCountry: string;
  shippingPhone: string;
  userId: number;
  orderItems: OrderItem[];
}

export interface OrderItem {
  id: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  orderId: number;
  productId: number;
  product: Product;
}

export enum OrderStatus {
  Pending = 0,
  Processing = 1,
  Shipped = 2,
  Delivered = 3,
  Cancelled = 4,
  Returned = 5
}

export interface Address {
  id: number;
  title: string;
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phoneNumber: string;
  isDefault: boolean;
  userId: number;
}

export interface Review {
  id: number;
  rating: number;
  title: string;
  comment: string;
  isApproved: boolean;
  userId: number;
  productId: number;
  user: User;
  createdDate: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  expiresAt: string;
  success?: boolean;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message: string;
  errors?: string[];
} 