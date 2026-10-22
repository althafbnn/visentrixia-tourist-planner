# VisEntrixia - Frontend Architecture (React.js SPA)

This folder encapsulates the Frontend layer of the MERN architecture for VisEntrixia:

## Directory Structure
- `src/components/`:
  - `Header.tsx`: Navigation bar conforming to the 3-zone Top Bar Contract, with live Day Plan item counter (FR-12).
  - `Hero.tsx`: Warm, editorial travel hero showcasing Akkaraipattu's cultural & natural heritage.
  - `FilterSortBar.tsx`: Real-time search by name/description (FR-03), category filters (Religious, Nature, Heritage, Cultural, Culinary - FR-02), and sorting (A-Z, distance, entry fee - FR-04).
  - `AttractionCard.tsx`: Attraction card with image, distance, category, quick "Add to Plan" button (FR-01, FR-08).
  - `AttractionDetailModal.tsx`: Detailed modal with opening hours, fees, travel tips, cultural dress codes, and OpenStreetMap directions (FR-05, FR-07, NFR-45).
  - `LeafletMap.tsx`: Integrated Leaflet.js interactive map with OpenStreetMap tiles, custom numbered category pins, Akkaraipattu town reference anchor, and dynamic route polylines (FR-06, FR-07).
  - `ItineraryDrawer.tsx`: Session-based one-day itinerary planner with duplicate prevention, reordering, distance/duration/budget calculations, printable export, and save-to-account flow (FR-08 to FR-13).
  - `SavedItinerariesModal.tsx`: Authenticated tourist modal to inspect and reload previously saved day trips.
  - `AdminDashboard.tsx`: Comprehensive CMS dashboard for system administrators to Create, Read, Update, and Delete attractions with form validation, image upload handling, and audit trails (FR-21 to FR-27).
  - `AuthModal.tsx`: Modal for tourist registration, login, and admin authentication with bcrypt and 5-attempt lockout enforcement (FR-14 to FR-18).
  - `EmergencySafetyModal.tsx`: Verified emergency numbers (Base Hospital, Police, 1912 Tourist Hotline, 1990 Ambulance) and community guidelines (NFR-42 to NFR-45).
  - `Footer.tsx`: Information footer with academic project disclaimer (NFR-39).

- `src/context/`:
  - `AuthContext.tsx`: User authentication, session management, and modal orchestration.
  - `ItineraryContext.tsx`: Session-based planner state, duplicate checks, distance calculation, and account persistence.

- `src/services/api.ts`:
  - REST client connecting to backend Express endpoints (`/api/*`).
