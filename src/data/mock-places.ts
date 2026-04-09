import type { PlaceData } from '@/components/detail/PlaceDetail';

const defaultReviews = [
  { id: 'r1', author: 'Sarah M.', avatar: 'SM', rating: 5, date: '2 days ago', text: 'Amazing experience! The food was incredible and the service was top-notch. Highly recommend visiting.', helpful: 12 },
  { id: 'r2', author: 'John K.', avatar: 'JK', rating: 4, date: '1 week ago', text: 'Great place, beautiful views. A bit crowded on weekends but worth the visit. Will come again!', helpful: 8 },
  { id: 'r3', author: 'Lisa T.', avatar: 'LT', rating: 5, date: '2 weeks ago', text: 'One of the best spots in Pattaya. The atmosphere is wonderful and prices are reasonable.', helpful: 15 },
];

export const mockPlaces: Record<string, PlaceData> = {
  'mum-aroi': {
    id: 'mum-aroi', name: 'Mum Aroi', nameLocal: 'มุมอร่อย',
    description: 'Seafood restaurant with ocean views',
    longDescription: 'Mum Aroi is one of Pattaya\'s most beloved seafood restaurants, perched on the rocky coastline of Naklua with breathtaking panoramic ocean views. Known for its incredibly fresh seafood caught daily by local fishermen, the restaurant offers a dining experience that combines authentic Thai flavors with a stunning seaside atmosphere. From succulent grilled prawns to their famous steamed fish with lime, every dish showcases the bounty of the Gulf of Thailand.',
    rating: 4.6, reviewCount: 1240, location: 'Naklua', address: '87/1 Naklua Soi 33, Bang Lamung, Chonburi 20150',
    distance: '2.1 km', isOpen: true, openHours: '10:00 - 22:00', phone: '+66 38 223 252', website: 'mumaroi.com',
    priceRange: '$$', tags: ['Seafood', 'Thai', 'Ocean View', 'Family'],
    photos: ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg'],
    highlights: ['Fresh daily catch', 'Ocean view seating', 'Private dining rooms', 'Parking available', 'Kids menu', 'Wheelchair accessible'],
    reviews: defaultReviews,
  },
  'glass-house': {
    id: 'glass-house', name: 'Glass House', nameLocal: 'กลาสเฮ้าส์',
    description: 'Beachfront dining with live music',
    longDescription: 'Glass House is a stunning beachfront restaurant in Na Jomtien that combines exceptional dining with live music entertainment. Set in a beautifully designed glass-walled structure right on the sand, guests enjoy international and Thai cuisine while listening to talented musicians perform nightly. The restaurant is particularly magical at sunset when the golden light floods through the glass walls.',
    rating: 4.4, reviewCount: 890, location: 'Na Jomtien', address: '55/3 Moo 2, Na Jomtien, Sattahip, Chonburi 20250',
    distance: '8.5 km', isOpen: true, openHours: '11:00 - 23:00', phone: '+66 38 237 810',
    priceRange: '$$$', tags: ['International', 'Seafood', 'Live Music', 'Romantic'],
    photos: ['1.jpg', '2.jpg', '3.jpg'], highlights: ['Beachfront location', 'Live music nightly', 'Sunset views', 'Wine selection'],
    reviews: defaultReviews,
  },
  'hilton-pattaya': {
    id: 'hilton-pattaya', name: 'Hilton Pattaya', nameLocal: 'ฮิลตัน พัทยา',
    description: 'Luxury hotel in Central Festival complex',
    longDescription: 'Hilton Pattaya occupies the top floors of CentralFestival Pattaya Beach mall, offering guests a unique combination of world-class shopping, dining, and luxury accommodation. With panoramic views of the Gulf of Thailand from every room, an award-winning rooftop bar, infinity pool, and direct access to Pattaya Beach, this 5-star hotel represents the pinnacle of urban resort living in Thailand\'s most vibrant beach city.',
    rating: 4.6, reviewCount: 3200, location: 'Central Pattaya', address: '333/101 Moo 9, Nong Prue, Bang Lamung, Chonburi 20150',
    distance: '0.5 km', isOpen: true, openHours: '24 hours', phone: '+66 38 253 000', website: 'hilton.com',
    priceRange: '$$$$', tags: ['5-Star', 'Pool', 'Spa', 'Beach Access', 'Rooftop Bar'],
    photos: ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg'],
    highlights: ['Infinity pool', 'Rooftop bar', 'Direct mall access', 'Beach access', 'Full-service spa', 'Fitness center', 'Multiple restaurants'],
    reviews: defaultReviews,
  },
  'sanctuary-of-truth': {
    id: 'sanctuary-of-truth', name: 'Sanctuary of Truth', nameLocal: 'ปราสาทสัจธรรม',
    description: 'Magnificent wooden temple by the sea',
    longDescription: 'The Sanctuary of Truth is Pattaya\'s most iconic landmark — a stunning all-wood temple standing 105 meters tall on the coastline of Naklua. Entirely hand-carved from teak wood without a single nail, this architectural masterpiece blends Thai, Khmer, Chinese, and Indian artistic styles to represent ancient philosophical truths. The temple has been under continuous construction since 1981 and serves as both an art gallery and a meditation center.',
    rating: 4.7, reviewCount: 4500, location: 'Naklua', address: '206/2 Moo 5, Naklua Soi 12, Bang Lamung, Chonburi 20150',
    distance: '4.2 km', isOpen: true, openHours: '08:00 - 17:00', phone: '+66 38 367 229', website: 'sanctuaryoftruth.com',
    priceRange: '$$', tags: ['Temple', 'Culture', 'Architecture', 'Photography'],
    photos: ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg'],
    highlights: ['All-wood construction', 'Ocean views', 'Cultural shows', 'Horse riding', 'Dolphin show', 'Speed boat rides'],
    reviews: defaultReviews,
  },
  'walking-street': {
    id: 'walking-street', name: 'Walking Street', nameLocal: 'วอล์คกิ้งสตรีท',
    description: 'Famous entertainment strip with bars and clubs',
    longDescription: 'Walking Street is Pattaya\'s most famous entertainment district, a pedestrian-only road that comes alive after dark with neon lights, live music, and an electrifying atmosphere. Stretching from the intersection of Beach Road to Bali Hai Pier, this legendary strip features hundreds of bars, clubs, restaurants, and entertainment venues that cater to visitors from around the world.',
    rating: 4.3, reviewCount: 8200, location: 'South Pattaya', address: 'Walking Street, South Pattaya, Bang Lamung, Chonburi 20150',
    distance: '1.2 km', isOpen: true, openHours: '18:00 - 03:00', tags: ['Nightlife', 'Bars', 'Clubs', 'Entertainment'],
    photos: ['1.jpg', '2.jpg', '3.jpg', '4.jpg'],
    highlights: ['Pedestrian only after 6pm', 'Hundreds of venues', 'Live music', 'Street performers', 'Fireworks shows'],
    reviews: defaultReviews,
  },
  'koh-larn': {
    id: 'koh-larn', name: 'Koh Larn', nameLocal: 'เกาะล้าน',
    description: 'Island paradise with crystal clear water',
    longDescription: 'Koh Larn (Coral Island) is a tropical paradise just 7.5 kilometers off the coast of Pattaya. With crystal-clear turquoise waters, powdery white sand beaches, and vibrant coral reefs, it offers a dramatic contrast to the bustling mainland. The island features seven beautiful beaches, each with its own character, along with snorkeling, diving, parasailing, and other water activities.',
    rating: 4.5, reviewCount: 6200, location: 'Offshore', address: 'Koh Larn, Bang Lamung, Chonburi 20150',
    distance: '7.5 km', isOpen: true, openHours: 'Ferry: 07:00 - 18:30',
    tags: ['Island', 'Beach', 'Snorkeling', 'Water Sports'],
    photos: ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg'],
    highlights: ['Crystal clear water', '7 beaches', 'Coral reefs', 'Water sports', 'Scenic viewpoints', 'Local seafood'],
    reviews: defaultReviews,
  },
  'terminal-21': {
    id: 'terminal-21', name: 'Terminal 21 Pattaya', nameLocal: 'เทอร์มินัล 21 พัทยา',
    description: 'Airport-themed mega mall',
    longDescription: 'Terminal 21 Pattaya is a unique airport-themed shopping mall where each floor represents a different world city. From the streets of Tokyo to the boulevards of Paris, shoppers enjoy a global experience under one roof. The mall is famous for its affordable food court on the top floor, offering incredible Thai street food at unbeatable prices alongside stunning city views.',
    rating: 4.6, reviewCount: 5800, location: 'North Pattaya', address: '456/789 Moo 9, North Pattaya Road, Bang Lamung, Chonburi 20150',
    distance: '2.5 km', isOpen: true, openHours: '10:00 - 22:00', phone: '+66 33 040 900', website: 'terminal21.co.th',
    priceRange: '$$', tags: ['Mall', 'Shopping', 'Food Court', 'Entertainment'],
    photos: ['1.jpg', '2.jpg', '3.jpg', '4.jpg'],
    highlights: ['Airport theme', 'Affordable food court', 'Cinema', 'International brands', 'City views', 'Free Wi-Fi'],
    reviews: defaultReviews,
  },
  'ramayana-water-park': {
    id: 'ramayana-water-park', name: 'Ramayana Water Park', nameLocal: 'รามายณะ วอเตอร์ พาร์ค',
    description: 'Thailand\'s largest water park',
    longDescription: 'Ramayana Water Park is the largest water park in Thailand, spanning over 184,000 square meters of aquatic fun. Themed around the ancient Ramayana epic, the park features over 50 rides and slides, a massive wave pool, lazy river, and dedicated kids areas. Set against a backdrop of lush tropical landscaping and dramatic rock formations, it offers a full day of excitement for families and thrill-seekers alike.',
    rating: 4.6, reviewCount: 4200, location: 'Na Jomtien', address: '9 Moo 7, Na Jomtien, Sattahip, Chonburi 20250',
    distance: '12 km', isOpen: true, openHours: '10:00 - 18:00', phone: '+66 33 005 929', website: 'ramayanawaterpark.com',
    priceRange: '$$', tags: ['Water Park', 'Family', 'Slides', 'Adventure'],
    photos: ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg'],
    highlights: ['50+ rides', 'Wave pool', 'Lazy river', 'Kids area', 'Food outlets', 'Locker rooms'],
    reviews: defaultReviews,
  },
};

export function getPlaceBySlug(slug: string): PlaceData | undefined {
  return mockPlaces[slug];
}

export function getAllPlaceSlugs(): string[] {
  return Object.keys(mockPlaces);
}
