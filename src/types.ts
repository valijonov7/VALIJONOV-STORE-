export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  category: string;
  images: string[]; // Gradient or abstract mock design representations
  variants: {
    name: string; // e.g., "Color" or "Size"
    options: string[];
  }[];
  stock: number;
  featured?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  flashSale?: boolean;
  discountPercentage?: number;
}

export interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface UserAddress {
  id: string;
  title: string; // "Home", "Office", etc.
  fullName: string;
  phone: string;
  street: string;
  city: string;
  postalCode: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  date: string;
  items: {
    productId: string;
    productName: string;
    productImage: string;
    price: number;
    quantity: number;
    selectedColor?: string;
    selectedSize?: string;
  }[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  address: UserAddress;
  paymentMethod: string;
  deliveryMethod: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  minSpend?: number;
  description: string;
}

export interface BroadcastMessage {
  id: string;
  title: string;
  body: string;
  date: string;
  read: boolean;
}
