import type { CategoryItem } from '@/components/category/CategoryPage';

export const mockFood: CategoryItem[] = [
  { id: 'mum-aroi', name: 'Mum Aroi', description: 'Seafood restaurant with ocean views', rating: 4.6, reviewCount: 1240, location: 'Naklua', distance: '2.1 km', isOpen: true, tags: ['Seafood', 'Thai'], priceRange: '$$' },
  { id: 'glass-house', name: 'Glass House', description: 'Beachfront dining with live music', rating: 4.4, reviewCount: 890, location: 'Na Jomtien', distance: '8.5 km', isOpen: true, tags: ['International', 'Seafood'], priceRange: '$$$' },
  { id: 'f3', name: 'Nong Nooch Garden Restaurant', description: 'Thai cuisine in tropical garden setting', rating: 4.3, reviewCount: 650, location: 'Silverlake', distance: '12 km', isOpen: true, tags: ['Thai', 'Garden'], priceRange: '$$' },
  { id: 'f4', name: 'Café des Amis', description: 'French fine dining on Thappraya Road', rating: 4.7, reviewCount: 420, location: 'Pratumnak', distance: '4.2 km', isOpen: false, tags: ['French', 'Fine Dining'], priceRange: '$$$$' },
  { id: 'f5', name: 'Soi Buakhao Night Market', description: 'Street food stalls with local favorites', rating: 4.2, reviewCount: 2100, location: 'South Pattaya', distance: '1.8 km', isOpen: true, tags: ['Street Food', 'Market'], priceRange: '$' },
  { id: 'f6', name: 'Rimpa Lapin', description: 'Cliffside restaurant with panoramic views', rating: 4.5, reviewCount: 780, location: 'Jomtien', distance: '6.3 km', isOpen: true, tags: ['Thai', 'Scenic'], priceRange: '$$$' },
];

export const mockHotels: CategoryItem[] = [
  { id: 'hilton-pattaya', name: 'Hilton Pattaya', description: 'Luxury hotel in Central Festival complex', rating: 4.6, reviewCount: 3200, location: 'Central Pattaya', distance: '0.5 km', isOpen: true, tags: ['5-Star', 'Pool'], priceRange: '$$$$' },
  { id: 'h2', name: 'Dusit Thani Pattaya', description: 'Beachfront resort with tropical gardens', rating: 4.5, reviewCount: 2800, location: 'North Pattaya', distance: '2.1 km', isOpen: true, tags: ['5-Star', 'Beach'], priceRange: '$$$$' },
  { id: 'h3', name: 'Holiday Inn Pattaya', description: 'Family-friendly hotel near Beach Road', rating: 4.3, reviewCount: 1900, location: 'Central Pattaya', distance: '0.8 km', isOpen: true, tags: ['4-Star', 'Family'], priceRange: '$$$' },
  { id: 'h4', name: 'Ibis Pattaya', description: 'Budget-friendly modern hotel', rating: 4.0, reviewCount: 1200, location: 'South Pattaya', distance: '1.5 km', isOpen: true, tags: ['3-Star', 'Budget'], priceRange: '$$' },
  { id: 'h5', name: 'The Zign Hotel', description: 'Boutique luxury with private beach', rating: 4.7, reviewCount: 950, location: 'Naklua', distance: '3.2 km', isOpen: true, tags: ['5-Star', 'Boutique'], priceRange: '$$$$' },
];

export const mockBeaches: CategoryItem[] = [
  { id: 'b1', name: 'Pattaya Beach', description: 'Main city beach with water sports', rating: 3.8, reviewCount: 5400, location: 'Central Pattaya', distance: '0.3 km', isOpen: true, tags: ['Swimming', 'Water Sports'] },
  { id: 'b2', name: 'Jomtien Beach', description: 'Quieter beach popular with families', rating: 4.2, reviewCount: 3800, location: 'Jomtien', distance: '4.5 km', isOpen: true, tags: ['Family', 'Swimming'] },
  { id: 'koh-larn', name: 'Koh Larn', description: 'Island paradise with crystal clear water', rating: 4.5, reviewCount: 6200, location: 'Offshore', distance: '7.5 km', isOpen: true, tags: ['Island', 'Snorkeling'] },
  { id: 'b4', name: 'Wong Amat Beach', description: 'Secluded beach near luxury resorts', rating: 4.3, reviewCount: 1200, location: 'Naklua', distance: '3.8 km', isOpen: true, tags: ['Quiet', 'Resort'] },
  { id: 'b5', name: 'Dong Tan Beach', description: 'Long stretch of sand south of Jomtien', rating: 4.1, reviewCount: 980, location: 'South Jomtien', distance: '6.2 km', isOpen: true, tags: ['Quiet', 'Scenic'] },
];

export const mockAttractions: CategoryItem[] = [
  { id: 'sanctuary-of-truth', name: 'Sanctuary of Truth', description: 'Magnificent wooden temple by the sea', rating: 4.7, reviewCount: 4500, location: 'Naklua', distance: '4.2 km', isOpen: true, tags: ['Temple', 'Culture'], priceRange: '$$' },
  { id: 'a2', name: 'Nong Nooch Garden', description: 'Tropical botanical garden with shows', rating: 4.5, reviewCount: 3800, location: 'Silverlake', distance: '15 km', isOpen: true, tags: ['Garden', 'Show'], priceRange: '$$' },
  { id: 'a3', name: 'Art in Paradise', description: '3D art museum with interactive exhibits', rating: 4.3, reviewCount: 2100, location: 'Central Pattaya', distance: '1.2 km', isOpen: true, tags: ['Museum', 'Art'], priceRange: '$' },
  { id: 'a4', name: 'Big Buddha Hill', description: 'Iconic golden Buddha with city views', rating: 4.4, reviewCount: 3200, location: 'Pratumnak', distance: '3.5 km', isOpen: true, tags: ['Temple', 'Viewpoint'] },
  { id: 'a5', name: 'Pattaya Floating Market', description: 'Cultural market on waterways', rating: 4.1, reviewCount: 2800, location: 'Sukhumvit', distance: '5.8 km', isOpen: true, tags: ['Market', 'Culture'], priceRange: '$' },
];

export const mockNightlife: CategoryItem[] = [
  { id: 'walking-street', name: 'Walking Street', description: 'Famous entertainment strip with bars and clubs', rating: 4.3, reviewCount: 8200, location: 'South Pattaya', distance: '1.2 km', isOpen: true, tags: ['Bars', 'Clubs'] },
  { id: 'n2', name: 'Tiffany Show', description: 'World-famous cabaret show', rating: 4.6, reviewCount: 4500, location: 'North Pattaya', distance: '2.8 km', isOpen: true, tags: ['Show', 'Cabaret'], priceRange: '$$' },
  { id: 'n3', name: 'Roof 25', description: 'Rooftop bar with panoramic views', rating: 4.4, reviewCount: 1200, location: 'Central Pattaya', distance: '0.5 km', isOpen: true, tags: ['Rooftop', 'Cocktails'], priceRange: '$$$' },
  { id: 'n4', name: 'Differ Club', description: 'Large nightclub with live DJs', rating: 4.1, reviewCount: 2100, location: 'North Pattaya', distance: '3.1 km', isOpen: true, tags: ['Club', 'DJ'], priceRange: '$$' },
];

export const mockTransport: CategoryItem[] = [
  { id: 't1', name: 'Baht Bus (Songthaew)', description: 'Shared public transport along Beach Road', rating: 3.9, reviewCount: 3400, location: 'City-wide', distance: '—', isOpen: true, tags: ['Public', 'Cheap'], priceRange: '$' },
  { id: 't2', name: 'Grab', description: 'Ride-hailing service with fixed prices', rating: 4.2, reviewCount: 5600, location: 'City-wide', distance: '—', isOpen: true, tags: ['Ride-hail', 'App'] },
  { id: 't3', name: 'Pattaya Ferry Terminal', description: 'Boats to Koh Larn and nearby islands', rating: 4.0, reviewCount: 2200, location: 'Bali Hai Pier', distance: '1.5 km', isOpen: true, tags: ['Ferry', 'Island'], priceRange: '$' },
  { id: 't4', name: 'Motorbike Rental', description: 'Scooter and motorbike rentals', rating: 3.8, reviewCount: 1800, location: 'Various', distance: '—', isOpen: true, tags: ['Rental', 'Scooter'], priceRange: '$' },
];

export const mockWellness: CategoryItem[] = [
  { id: 'w1', name: 'Oasis Spa Pattaya', description: 'Premium Thai spa in colonial villa', rating: 4.7, reviewCount: 1800, location: 'North Pattaya', distance: '2.5 km', isOpen: true, tags: ['Spa', 'Thai Massage'], priceRange: '$$$' },
  { id: 'w2', name: 'Let\'s Relax Spa', description: 'Popular chain spa with multiple treatments', rating: 4.4, reviewCount: 2400, location: 'Central Festival', distance: '0.5 km', isOpen: true, tags: ['Spa', 'Massage'], priceRange: '$$' },
  { id: 'w3', name: 'Bangkok Hospital Pattaya', description: 'International standard hospital', rating: 4.5, reviewCount: 1600, location: 'North Pattaya', distance: '3.1 km', isOpen: true, tags: ['Hospital', '24h'] },
  { id: 'w4', name: 'Tung Klom Fitness', description: 'Outdoor fitness park open 24/7', rating: 4.1, reviewCount: 890, location: 'Thappraya', distance: '2.8 km', isOpen: true, tags: ['Gym', 'Free'] },
];

export const mockEvents: CategoryItem[] = [
  { id: 'e1', name: 'Pattaya International Music Festival', description: 'Annual beach music festival', rating: 4.6, reviewCount: 3200, location: 'Pattaya Beach', distance: '0.5 km', isOpen: false, tags: ['Music', 'Free'] },
  { id: 'e2', name: 'Pattaya Fireworks Festival', description: 'International fireworks competition', rating: 4.7, reviewCount: 2800, location: 'Pattaya Beach', distance: '0.5 km', isOpen: false, tags: ['Festival', 'Free'] },
  { id: 'e3', name: 'Loy Krathong Pattaya', description: 'Traditional floating lantern festival', rating: 4.8, reviewCount: 1900, location: 'Pattaya Beach', distance: '0.5 km', isOpen: false, tags: ['Culture', 'Traditional'] },
];

export const mockShopping: CategoryItem[] = [
  { id: 'terminal-21', name: 'Terminal 21 Pattaya', description: 'Airport-themed mega mall', rating: 4.6, reviewCount: 5800, location: 'North Pattaya', distance: '2.5 km', isOpen: true, tags: ['Mall', 'Food Court'], priceRange: '$$' },
  { id: 's2', name: 'Central Festival Pattaya', description: 'Beachfront shopping and entertainment', rating: 4.5, reviewCount: 4200, location: 'Central Pattaya', distance: '0.5 km', isOpen: true, tags: ['Mall', 'Beach'], priceRange: '$$$' },
  { id: 's3', name: 'Thepprasit Night Market', description: 'Weekend night market with bargains', rating: 4.2, reviewCount: 3100, location: 'South Pattaya', distance: '3.8 km', isOpen: true, tags: ['Market', 'Night'], priceRange: '$' },
  { id: 's4', name: 'Outlet Mall Pattaya', description: 'Discounted brand shopping', rating: 4.0, reviewCount: 1500, location: 'South Pattaya', distance: '5.2 km', isOpen: true, tags: ['Outlet', 'Brands'], priceRange: '$$' },
];

export const mockActivities: CategoryItem[] = [
  { id: 'ramayana-water-park', name: 'Ramayana Water Park', description: 'Thailand\'s largest water park', rating: 4.6, reviewCount: 4200, location: 'Na Jomtien', distance: '12 km', isOpen: true, tags: ['Water Park', 'Family'], priceRange: '$$' },
  { id: 'ac2', name: 'Flight of the Gibbon', description: 'Zipline adventure through rainforest', rating: 4.7, reviewCount: 2800, location: 'Chonburi', distance: '25 km', isOpen: true, tags: ['Adventure', 'Nature'], priceRange: '$$$' },
  { id: 'ac3', name: 'Cartoon Network Amazone', description: 'Themed water park for kids and families', rating: 4.3, reviewCount: 1900, location: 'Jomtien', distance: '8 km', isOpen: true, tags: ['Water Park', 'Kids'], priceRange: '$$' },
  { id: 'ac4', name: 'Pattaya Bungy Jump', description: 'Bungee jumping with ocean views', rating: 4.2, reviewCount: 1200, location: 'Jomtien', distance: '6.5 km', isOpen: true, tags: ['Extreme', 'Thrill'], priceRange: '$$' },
];

export const mockLiving: CategoryItem[] = [
  { id: 'l1', name: 'Pattaya City Hall', description: 'Municipal services and permits', rating: 3.5, reviewCount: 450, location: 'North Pattaya', distance: '2.8 km', isOpen: true, tags: ['Government', 'Services'] },
  { id: 'l2', name: 'Immigration Office', description: 'Visa extensions and work permits', rating: 3.2, reviewCount: 890, location: 'Soi 5 Jomtien', distance: '5.5 km', isOpen: true, tags: ['Government', 'Visa'] },
  { id: 'l3', name: 'Makro Pattaya', description: 'Wholesale grocery and supplies', rating: 4.1, reviewCount: 1600, location: 'South Pattaya', distance: '3.2 km', isOpen: true, tags: ['Wholesale', 'Grocery'], priceRange: '$' },
  { id: 'l4', name: 'International School of Chonburi', description: 'K-12 international education', rating: 4.3, reviewCount: 320, location: 'East Pattaya', distance: '8 km', isOpen: true, tags: ['School', 'Education'] },
];

export const mockEmergency: CategoryItem[] = [
  { id: 'em1', name: 'Tourist Police', description: 'Assistance for tourists — call 1155', rating: 4.0, reviewCount: 680, location: 'Central Pattaya', distance: '0.8 km', isOpen: true, tags: ['Police', '24h'] },
  { id: 'em2', name: 'Bangkok Hospital Pattaya', description: 'Emergency room with English-speaking staff', rating: 4.5, reviewCount: 1600, location: 'North Pattaya', distance: '3.1 km', isOpen: true, tags: ['Hospital', '24h'] },
  { id: 'em3', name: 'Pattaya City Hospital', description: 'Public hospital with ER', rating: 3.8, reviewCount: 920, location: 'Central Pattaya', distance: '1.5 km', isOpen: true, tags: ['Hospital', 'Public'] },
  { id: 'em4', name: 'Fire Department', description: 'Emergency fire services — call 199', rating: 3.9, reviewCount: 120, location: 'Various', distance: '—', isOpen: true, tags: ['Fire', '24h'] },
];

export const categoryFilters: Record<string, string[]> = {
  food: ['Thai', 'Seafood', 'International', 'Street Food', 'Fine Dining', 'Cafe'],
  hotels: ['5-Star', '4-Star', 'Budget', 'Resort', 'Boutique', 'Hostel'],
  beaches: ['Swimming', 'Snorkeling', 'Water Sports', 'Quiet', 'Family'],
  attractions: ['Temple', 'Museum', 'Nature', 'Culture', 'Viewpoint'],
  nightlife: ['Bars', 'Clubs', 'Shows', 'Rooftop', 'Live Music'],
  transport: ['Public', 'Rental', 'Ferry', 'Taxi', 'Bus'],
  wellness: ['Spa', 'Massage', 'Hospital', 'Gym', 'Yoga'],
  events: ['Music', 'Festival', 'Sports', 'Culture', 'Food'],
  shopping: ['Mall', 'Market', 'Night Market', 'Outlet', 'Souvenir'],
  activities: ['Water Park', 'Adventure', 'Diving', 'Golf', 'Kids'],
  living: ['Government', 'Education', 'Grocery', 'Coworking', 'Gym'],
  emergency: ['Police', 'Hospital', 'Fire', 'Pharmacy', 'Embassy'],
};
