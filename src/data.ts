import { Product, Coupon, UserAddress, Review } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Air Buds Pro Max',
    tagline: 'High-Fidelity Audio. Pure Luxury.',
    description: 'Immersive sound in its most premium form. Featuring custom active noise cancellation, personalized spatial audio with dynamic head tracking, and an exquisite aluminum finish that feels as good as it sounds.',
    price: 349,
    originalPrice: 429,
    rating: 4.8,
    reviewCount: 124,
    category: 'Audio & Sound',
    images: [
      'linear-gradient(135deg, #1e40af 0%, #1e1b4b 100%)', // Midnight Blue deep
      'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', // Royal Blue
      'linear-gradient(135deg, #0f172a 0%, #334155 100%)'  // Space Grey
    ],
    variants: [
      { name: 'Color', options: ['Midnight Blue', 'Space Grey', 'Arctic White'] },
      { name: 'Fit', options: ['Standard Cushions', 'Leather Cushions'] }
    ],
    stock: 8,
    featured: true,
    bestSeller: true,
    newArrival: false,
    flashSale: true,
    discountPercentage: 18
  },
  {
    id: 'prod-2',
    name: 'Vision VR Horizon',
    tagline: 'Immersive spatial computing.',
    description: 'Welcome to the era of spatial computing. The Vision VR Horizon blends digital content seamlessly with your physical world, creating a massive, borderless canvas for apps, entertainment, and connection.',
    price: 549,
    originalPrice: 549,
    rating: 4.9,
    reviewCount: 42,
    category: 'Smart Devices',
    images: [
      'linear-gradient(135deg, #7c3aed 0%, #311042 100%)', // Purple Cyber
      'linear-gradient(135deg, #2563eb 0%, #061b47 100%)'  // Blue Horizon
    ],
    variants: [
      { name: 'Band Size', options: ['Small', 'Medium', 'Large'] },
      { name: 'Storage', options: ['128GB', '256GB'] }
    ],
    stock: 3, // Low stock indicator
    featured: true,
    bestSeller: false,
    newArrival: true,
    flashSale: false
  },
  {
    id: 'prod-3',
    name: 'Ultra Watch Apex',
    tagline: 'Adventure awaits. Titanium built.',
    description: 'The ultimate sports and adventure watch. Housed in a lightweight and ultra-durable aerospace-grade titanium case, with dual-frequency GPS, up to 72 hours of battery life, and high-contrast orange accent elements.',
    price: 799,
    originalPrice: 899,
    rating: 4.7,
    reviewCount: 98,
    category: 'Wearables',
    images: [
      'linear-gradient(135deg, #f97316 0%, #431407 100%)', // Orange Titan
      'linear-gradient(135deg, #1f2937 0%, #111827 100%)'  // Dark Graphite
    ],
    variants: [
      { name: 'Color', options: ['Titanium Orange', 'Carbon Black', 'Starlight Gold'] },
      { name: 'Strap', options: ['Ocean Band', 'Trail Loop', 'Alpine Loop'] }
    ],
    stock: 12,
    featured: false,
    bestSeller: true,
    newArrival: false,
    flashSale: true,
    discountPercentage: 11
  },
  {
    id: 'prod-4',
    name: 'Soundcore X1 Studio',
    tagline: 'Room-filling spatial audio.',
    description: 'Engage with premium studio acoustics. Powered by dual subwoofers and four beam-forming tweeters, the Soundcore X1 dynamically adapts to room shape to project lush, clear audio in every direction.',
    price: 199,
    originalPrice: 249,
    rating: 4.6,
    reviewCount: 67,
    category: 'Audio & Sound',
    images: [
      'linear-gradient(135deg, #06b6d4 0%, #083344 100%)', // Cyan Wave
      'linear-gradient(135deg, #ec4899 0%, #50072b 100%)'  // Sunset Pink
    ],
    variants: [
      { name: 'Finish', options: ['Matte Black', 'Stellar White'] }
    ],
    stock: 15,
    featured: false,
    bestSeller: false,
    newArrival: true,
    flashSale: false
  },
  {
    id: 'prod-5',
    name: 'Nike Air Max Aura',
    tagline: 'Walk on absolute air.',
    description: 'A revolutionary fusion of high-fashion and street athletics. Air Max Aura features an updated pressurized cushioning unit, a highly breathable recycled mesh upper, and modern neon architectural accents.',
    price: 180,
    originalPrice: 180,
    rating: 4.8,
    reviewCount: 156,
    category: 'Wearables',
    images: [
      'linear-gradient(135deg, #ef4444 0%, #450a0a 100%)', // Neon Red
      'linear-gradient(135deg, #10b981 0%, #022c22 100%)'  // Poison Green
    ],
    variants: [
      { name: 'Size (US)', options: ['8', '9', '10', '11', '12'] },
      { name: 'Colorway', options: ['Aurora Red', 'Volt Green', 'Classic Slate'] }
    ],
    stock: 5,
    featured: true,
    bestSeller: true,
    newArrival: true,
    flashSale: false
  },
  {
    id: 'prod-6',
    name: 'Lumina Charge Pro',
    tagline: 'Sleek, rapid charging station.',
    description: 'Tidy up your luxury studio desk. This MagSafe-certified 3-in-1 charger provides fast 15W wireless charging for your smart phone, watch, and active earbuds simultaneously inside an exquisite dark steel chassis.',
    price: 59,
    originalPrice: 79,
    rating: 4.5,
    reviewCount: 89,
    category: 'Home Studio',
    images: [
      'linear-gradient(135deg, #64748b 0%, #0f172a 100%)', // Steel Grey
      'linear-gradient(135deg, #f59e0b 0%, #451a03 100%)'  // Warm Amber
    ],
    variants: [
      { name: 'Base', options: ['Dark Walnut', 'Anodized Steel'] }
    ],
    stock: 22,
    featured: false,
    bestSeller: false,
    newArrival: false,
    flashSale: true,
    discountPercentage: 25
  }
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    userName: 'Marcus Sterling',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
    rating: 5,
    comment: 'The craftsmanship on these Air Buds is absolutely unparalleled. Feels like Apple and Nike teamed up to build an audiophile dream.',
    date: '2026-06-25'
  },
  {
    id: 'rev-2',
    userName: 'Elena Rostova',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
    rating: 5,
    comment: 'Stunning design! The battery longevity is perfect, and spatial audio makes watching films on my phone an incredible experience.',
    date: '2026-06-18'
  },
  {
    id: 'rev-3',
    userName: 'Tyler Vance',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces',
    rating: 4,
    comment: 'Excellent integration with my devices. The titanium details match my setup flawlessly. Definitely worth the premium cost.',
    date: '2026-06-12'
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  { code: 'LUMINA20', discountType: 'percentage', value: 20, minSpend: 100, description: '20% off for orders over $100' },
  { code: 'VIPFREE', discountType: 'fixed', value: 30, minSpend: 150, description: '$30 off for orders over $150' },
  { code: 'FLASH5', discountType: 'percentage', value: 5, description: 'Extra 5% off on all tech accessories' }
];

export const DEFAULT_ADDRESSES: UserAddress[] = [
  {
    id: 'addr-1',
    title: 'Penthouse Apartment',
    fullName: 'Alex Rivers',
    phone: '+1 (555) 019-2834',
    street: '742 Cyber Plaza, Suite 90',
    city: 'San Francisco',
    postalCode: '94105',
    isDefault: true
  },
  {
    id: 'addr-2',
    title: 'Design Studio HQ',
    fullName: 'Alex Rivers',
    phone: '+1 (555) 019-8800',
    street: '100 Innovation Parkway, floor 4',
    city: 'Cupertino',
    postalCode: '95014',
    isDefault: false
  }
];

export const CATEGORIES = [
  'All',
  'Smart Devices',
  'Audio & Sound',
  'Wearables',
  'Home Studio'
];
