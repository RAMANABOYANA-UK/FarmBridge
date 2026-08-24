# FarmBridge Backend — Phase 1 (Person 3)

Core API + AI foundation for the FarmBridge hyperlocal farmer-to-consumer platform.

## Scope (Phase 1)
- Core models (User, Product, Order, Tenant)
- Geospatial support (`2dsphere` indexes)
- Order lifecycle management
- Basic multi-tenancy (tenant middleware + `Tenant` model)
- Analytics foundation (farmer dashboard)
- Socket.io real-time channels (order tracking)
- Placeholder structure for Demand Forecasting + Export Intelligence

## Folder Structure
```
backend/
├── src/
│   ├── config/db.js              # MongoDB connection
│   ├── models/                   # Tenant, User, Product, Order
│   ├── middleware/               # auth.js, tenant.js
│   ├── routes/                   # auth, products, orders, analytics, ai
│   ├── services/                 # orderService, analyticsService, exportStatusService
│   ├── utils/generateOrderId.js  # human-readable order IDs
│   ├── socket/index.js           # Socket.io event wiring
│   └── server.js                 # Express + Socket.io entry point
├── .env.example
└── package.json
```

## How to Run
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI
npm run dev
```

## API Endpoints (Phase 1)
| Method | Path | Auth |
|--------|------|------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET  | `/api/products` | Bearer |
| POST | `/api/orders` | buyer |
| PATCH| `/api/orders/:id/status` | farmer/admin |
| GET  | `/api/orders/my` | Bearer |
| GET  | `/api/analytics/farmer/dashboard` | farmer |
| GET  | `/api/ai/export-readiness/:productId` | Bearer |
| GET  | `/api/ai/demand-forecast` | Bearer |
| GET  | `/api/health` | Public |

## Phase 2 / 3 Placeholders
- Real Demand Forecasting (currently a stub in `routes/ai.js`)
- Real DGFT / APEDA export data (`exportStatusService.js` uses mock data)
- Review ratings and richer analytics