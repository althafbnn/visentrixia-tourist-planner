export const INITIAL_PLACES = [
  {
    id: 'place-1',
    name: 'Akkaraipattu Grand Jummah Mosque',
    category: 'Religious',
    description: 'A majestic architectural symbol of Eastern Sri Lanka featuring classical Moorish-Saracenic columns, expansive shaded prayer halls, and immaculate whitewashed domes that have stood as a cultural cornerstone for generations.',
    location: {
      lat: 7.2198,
      lng: 81.8512
    },
    distance: 0.8,
    openingHours: '05:00 AM - 09:30 PM (Daily)',
    entranceFee: 0,
    travelTips: 'Plan your visit between regular prayer intervals for peaceful exploration and photography of the courtyard. Remove footwear at the marble threshold.',
    safetyInfo: 'Strict modest dress code required for all visitors (shoulders and knees covered). Avoid loud voices inside the main sanctuary.',
    childFriendly: true,
    facilities: ['Parking Area', 'Restrooms', 'Ablution Stations', 'Shoe Deposit'],
    images: ['/assets/images/hero_akkaraipattu_1792478448218.jpg'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'place-2',
    name: 'Thirukkovil Sri Sithira Velayudha Swami Kovil',
    category: 'Heritage',
    description: 'An ancient, revered coastal Murugan temple located south of Akkaraipattu. Renowned for its multi-tiered carved Dravidian stone gopuram overlooking the roaring Indian Ocean breakers and palm groves.',
    location: {
      lat: 7.1189,
      lng: 81.8542
    },
    distance: 14.5,
    openingHours: '06:00 AM - 12:30 PM, 04:30 PM - 08:30 PM',
    entranceFee: 0,
    travelTips: 'Sunrise pooja is extraordinary with temple trumpets echoing against coastal sea breezes. Photography inside inner shrine is prohibited.',
    safetyInfo: 'Caution: Slippery sea rocks on the coastline behind the temple grounds. Traditional temple attire recommended.',
    childFriendly: true,
    facilities: ['Vehicle Parking', 'Restrooms', 'Sacred Well', 'Prasadam Stalls'],
    images: ['/assets/images/historic_temple_kovil_1792478449341.jpg'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'place-3',
    name: 'Sagamam Freshwater Lake & Wetland Sanctuary',
    category: 'Nature',
    description: 'A tranquil ecological haven nestled west of Akkaraipattu. Pink water lilies blanket calm reflective waters that shelter spot-billed pelicans, painted storks, white egrets, and migrating Asian waterfowl.',
    location: {
      lat: 7.1895,
      lng: 81.7120
    },
    distance: 18.2,
    openingHours: '06:00 AM - 06:00 PM (Dawn to dusk)',
    entranceFee: 200,
    travelTips: 'Bring telephoto lenses or binoculars. The morning golden hour between 6:30 AM and 8:30 AM offers prime bird activity and gentle temperatures.',
    safetyInfo: 'Warning: Deep marsh banks and proximity to wild elephant corridors around sunset; depart before 06:00 PM. Apply insect repellent.',
    childFriendly: true,
    facilities: ['Nature Footpaths', 'Observation Mounds', 'Rustic Parking'],
    images: ['/assets/images/sagamam_nature_lake_1792478449468.jpg'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'place-4',
    name: 'Akkaraipattu Traditional Night Food Bazaar',
    category: 'Culinary',
    description: 'The energetic nighttime culinary hub of Akkaraipattu. Live iron-griddle performances serving sizzling spicy kottu roti, flaky egg parottas, lagoon crab curries, mutton samosas, and chilled rosewater falooda.',
    location: {
      lat: 7.2215,
      lng: 81.8505
    },
    distance: 0.5,
    openingHours: '05:00 PM - 11:30 PM (Daily)',
    entranceFee: 0,
    travelTips: 'Try the authentic seafood kottu paired with warm sweet Muscat halwa. Cash is accepted and appreciated by street artisans.',
    safetyInfo: 'Caution: High pedestrian and motorbike activity along town street market; keep children close. Hot oil cooking stations.',
    childFriendly: true,
    facilities: ['Street Dining Stalls', 'Takeaway Counters', 'Hand Wash Stations'],
    images: ['/assets/images/eastern_culinary_bazaar_1792478449487.jpg'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'place-5',
    name: 'Oluvil Lighthouse & Ocean Breeze Esplanade',
    category: 'Heritage',
    description: 'A picturesque 24-meter octagonal cylindrical lighthouse standing prominently on the Eastern coast north of Akkaraipattu, surrounded by maritime parkland and breezy coastal panoramas.',
    location: {
      lat: 7.2912,
      lng: 81.8681
    },
    distance: 11.2,
    openingHours: '08:00 AM - 06:00 PM',
    entranceFee: 100,
    travelTips: 'Ideal mid-day or late afternoon family stop. Ample sea breeze makes it pleasant even under tropical sunshine.',
    safetyInfo: 'Strong wind gusts near coastal wall. Children must be supervised around high seawalls.',
    childFriendly: true,
    facilities: ['Car Parking', 'Restrooms', 'Shaded Benches', 'Information Board'],
    images: ['/assets/images/hero_akkaraipattu_1792478448218.jpg'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'place-6',
    name: 'Akkaraipattu Fisherman Harbor & Sunset Beach',
    category: 'Cultural',
    description: 'Golden sandy coastal stretch where local fishermen launch colorful traditional outrigger catamarans and haul in morning seine nets. In late afternoon, villagers gather for shore breeze and sea views.',
    location: {
      lat: 7.2170,
      lng: 81.8650
    },
    distance: 1.5,
    openingHours: 'Open 24 Hours (Best during daylight)',
    entranceFee: 0,
    travelTips: 'Visit at 6:15 AM to witness the vibrant traditional beach haul net landing and auctioning of fresh tuna, mullet, and tiger prawns.',
    safetyInfo: 'Warning: Dangerous ocean rip currents; recreational swimming is strictly prohibited. No permanent beach lifeguards on duty.',
    childFriendly: true,
    facilities: ['Open Shoreline', 'Fresh Fish Stalls', 'Bike Parking'],
    images: ['/assets/images/hero_akkaraipattu_1792478448218.jpg'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'place-7',
    name: 'Deegavapi Sacred Stupa Archaeological Complex',
    category: 'Heritage',
    description: 'An immense 3rd-century BC Buddhist monument of colossal historical prestige located northwest of Akkaraipattu. Surrounded by ancient brick ruins, monastic ruins, stone pillars, and an archaeological museum.',
    location: {
      lat: 7.2980,
      lng: 81.7450
    },
    distance: 24.1,
    openingHours: '06:00 AM - 06:30 PM',
    entranceFee: 0,
    travelTips: 'Hire an accredited on-site local guide to understand ancient Brahmi stone scripts. Morning is cooler for barefoot walking on sand compound.',
    safetyInfo: 'Modest white or light clothing required. Footwear and hats must be removed before entering the sacred perimeter.',
    childFriendly: true,
    facilities: ['Museum Gallery', 'Pilgrim Rest Halls', 'Vehicle Parking', 'Restrooms'],
    images: ['/assets/images/historic_temple_kovil_1792478449341.jpg'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'place-8',
    name: 'Pannalgama Forest Foothills & Reservoir',
    category: 'Nature',
    description: 'A pristine scenic reservoir flanked by undulating rock formations and dry monsoon evergreen woodland. Spot wild peacock displays, herds of spotted deer, and butterflies along unpaved woodland paths.',
    location: {
      lat: 7.1510,
      lng: 81.6845
    },
    distance: 22.8,
    openingHours: '06:30 AM - 05:30 PM',
    entranceFee: 300,
    travelTips: 'A high-clearance three-wheeler (tuk-tuk) or 4WD vehicle is recommended for the final approach road. Carry drinking water and light snacks.',
    safetyInfo: 'Do not venture off established tracks into thick brush. Wildlife awareness required (wild boars, occasional elephants).',
    childFriendly: false,
    facilities: ['Forest Perimeter Parking', 'Wilderness Trails', 'Wildlife Watchpoint'],
    images: ['/assets/images/sagamam_nature_lake_1792478449468.jpg'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'place-9',
    name: 'Sri Mamangapillaiyar Kovil & Sacred Spring',
    category: 'Religious',
    description: 'A serene centuries-old sanctuary dedicated to Lord Ganesha, framed by majestic shade-giving tamarind trees, brass oil lamps, and a traditional freshwater temple tank frequented by pilgrims.',
    location: {
      lat: 7.1950,
      lng: 81.8380
    },
    distance: 4.2,
    openingHours: '06:00 AM - 12:00 PM, 05:00 PM - 08:00 PM',
    entranceFee: 0,
    travelTips: 'Participate respectfully in the evening camphor flame aarti. Fresh jasmine garlands are available at the entrance gate.',
    safetyInfo: 'Remove shoes at outer boundary pavilion. Wash hands and feet before entering sacred courtyard.',
    childFriendly: true,
    facilities: ['Parking Area', 'Restrooms', 'Sacred Water Pool', 'Garland Stalls'],
    images: ['/assets/images/historic_temple_kovil_1792478449341.jpg'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'place-10',
    name: 'Akkaraipattu Palmyra Handloom & Craft Centre',
    category: 'Cultural',
    description: 'A renowned community empowerment workshop where artisan women practice heritage weaving with seasoned palmyra leaves and wooden looms, crafting baskets, mats, and vibrantly colored Eastern textiles.',
    location: {
      lat: 7.2390,
      lng: 81.8470
    },
    distance: 3.1,
    openingHours: '09:00 AM - 05:30 PM (Monday - Saturday)',
    entranceFee: 0,
    travelTips: 'Watch live handloom pedal operation and buy authentic handmade souvenirs directly from artisan makers without middleman markup.',
    safetyInfo: 'Watch footsteps around moving timber loom frames and yarn spools. Keep hands away from working shuttles.',
    childFriendly: true,
    facilities: ['Craft Shop', 'Live Demonstration Hall', 'Visitor Restrooms', 'Parking'],
    images: ['/assets/images/eastern_culinary_bazaar_1792478449487.jpg'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
