# VisEntrixia - Backend Architecture (Node.js, Express.js & MongoDB/Mongoose)

This folder encapsulates the Backend layer of the MERN architecture for VisEntrixia:

## Directory Structure
- `models/`:
  - `Place.ts`: Data schema for attractions (name, category, description, coordinates, distance, opening hours, entrance fee, travel tips, safety notes, facilities, child-friendly flag, images).
  - `User.ts`: Data schema for tourist and admin accounts (name, email, passwordHash with bcrypt salt factor 10, role, login attempt counter, lockout expiry timestamp).
  - `Itinerary.ts`: Data schema for saved itineraries (userId, title, places, calculated distance, travel time, estimated entrance fees, notes).
  - `AuditLog.ts`: Audit log schema for administrative actions (FR-27).

- `controllers/`:
  - `placeController.ts`: Attraction browsing, filtering, search, sorting, pagination (NFR-06), and administrative CRUD operations with input validation (FR-26).
  - `authController.ts`: User registration, authentication, bcrypt comparison, rate limiting (FR-18), and JWT issuance in HttpOnly cookies (NFR-14).
  - `itineraryController.ts`: Retrieval, creation, and deletion of saved tourist itineraries.

- `middleware/`:
  - `authMiddleware.ts`: JWT verification, session expiration check (FR-17: 60 mins), and admin authorization check.

- `db/`:
  - `connection.ts`: MongoDB connection adapter with resilient in-memory storage fallback ensuring zero crashes in test environments (NFR-21).

- `data/`:
  - `seedData.ts`: Initial dataset of 10 authentic attractions situated within a 25 km radius of Akkaraipattu.
