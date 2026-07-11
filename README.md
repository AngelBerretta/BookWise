***REMOVED*** 📚 BookWise

A full-stack e-commerce and blog platform for books — built with a Node.js/Express/MongoDB backend and a React/Vite frontend, deployed with a live demo you can log into without signing up.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=flat&logo=socket.io&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=flat&logo=cloudinary&logoColor=white)

**[🔗 Live App](https://bookwise-store.vercel.app)** · **[⚙️ API](https://bookwise-h7ib.onrender.com/api/products)**

---

***REMOVED******REMOVED*** 🚀 Try it live

No signup needed — jump in with a one-click demo account:

| Role | Email | Password |
|---|---|---|
| Reader | `demo@bookwise.com` | `Demo1234!` |
| Admin | `admin-demo@bookwise.com` | `Demo1234!` |

Both buttons are on the [login page](https://bookwise-store.vercel.app/login). The admin demo account can create and edit products/posts and try the image upload flow in real time — destructive actions and abusive content are sandboxed (see [Demo Mode Safeguards](***REMOVED***-demo-mode-safeguards) below).

> **Note:** the backend runs on Render's free tier, which spins down after inactivity. The first request after a while may take 20–30s to wake up.

---

***REMOVED******REMOVED*** ✨ Features

**Storefront**
- Product catalog with category filters, price range, search, sorting and pagination
- Product detail pages with stock-aware add-to-cart
- Persistent cart per user (create, update quantity, remove, clear)
- Blog with Markdown-rendered posts, search and pagination

**Admin panel**
- Dashboard with live catalog/blog stats
- Full CRUD for products and blog posts, with bulk select/delete/publish
- Custom Markdown editor (formatting toolbar + live preview) — no raw HTML required
- Drag-and-drop image uploader with instant preview

**Platform**
- JWT authentication with role-based access (`user` / `admin`) and email verification
- Real-time catalog updates via Socket.io (broadcast on create/update/delete)
- Optimized image pipeline: Multer → Cloudinary, with automatic format/quality optimization and orphaned-image cleanup
- Dual persistence layer: swap between MongoDB and flat-file JSON storage via a single env var (DAO pattern)

---

***REMOVED******REMOVED*** 🛠️ Engineering highlights

A few things worth a closer look if you're reviewing the code:

- **DAO abstraction** (`BaseDAO` → `MongoDAO` / `FileSystemDAO`) — the same controllers run against MongoDB or local JSON files depending on the `MODE` env var, with zero changes to route/controller code.
- **Image lifecycle management** — every upload is tracked by its Cloudinary `public_id`. Replacing or deleting a product/post image automatically deletes the old asset from Cloudinary, preventing orphaned storage.
- **Layered demo-mode security** — a public write-enabled admin demo needed more than a login wall. See below.
- **Consistent error handling** — a single `ApiError` class + `catchAsync` wrapper across every controller, with a centralized error middleware that never leaks stack traces to the client.

---

***REMOVED******REMOVED*** 🔒 Demo Mode Safeguards

Letting anonymous visitors use a real admin account is inherently risky, so the demo admin is wrapped in several independent layers of protection:

| Layer | What it does |
|---|---|
| `demoGuard` middleware | Blocks all delete operations for the demo account (products, posts, bulk actions) |
| `demoContentFilter` middleware | Runs text fields through a profanity filter (ES/EN) before saving |
| Scoped rate limiting | Stricter request limits on demo writes and image uploads specifically |
| Short-lived JWTs | Demo sessions expire in 1 hour instead of the default 24 |
| Scheduled auto-reseed | A `node-cron` job resets the catalog/blog/demo accounts daily, bounding the exposure window of any content that slips through |
| Optional AI image moderation | Cloudinary's AWS Rekognition add-on can be toggled on to auto-reject flagged uploads |

None of these are individually bulletproof — combined, they keep a public write-enabled demo reasonably safe without blocking the features that make the demo worth trying.

---

***REMOVED******REMOVED*** 🧰 Tech Stack

| | |
|---|---|
| **Backend** | Node.js, Express, MongoDB + Mongoose, Socket.io, JWT, bcrypt, Joi, Multer, Cloudinary SDK, node-cron, express-rate-limit |
| **Frontend** | React 19, Vite, Tailwind CSS 4, React Router 7, Axios, react-markdown |
| **Infra** | MongoDB Atlas, Cloudinary, Render (backend), Vercel (frontend) |

---

***REMOVED******REMOVED*** 🏗️ Architecture

```
BookWise/
├── backend/                 Express API (REST + Socket.io)
│   ├── src/
│   │   ├── controllers/     Business logic per resource
│   │   ├── middlewares/     Auth, roles, rate limiting, demo guards, validation
│   │   ├── models/
│   │   │   ├── DAOs/        MongoDAO / FileSystemDAO (swappable persistence)
│   │   │   ├── model/       Mongoose schemas
│   │   │   └── schemas/     Joi validation schemas
│   │   ├── router/          Route definitions per resource
│   │   ├── services/        Cloudinary, email, scheduler
│   │   └── scripts/         DB seed scripts (products, blog, demo accounts)
│   └── config.js
│
└── frontend/                React SPA
    └── src/
        ├── components/      Feature-organized UI (auth, blog, cart, product, ui)
        ├── context/         Auth + Cart global state
        ├── hooks/           Data-fetching hooks (products, blog, cart, forms)
        ├── pages/           Route-level views (+ admin/ subtree)
        └── services/        Axios API clients per resource
```

---

***REMOVED******REMOVED*** 💻 Getting Started

***REMOVED******REMOVED******REMOVED*** Prerequisites
- Node.js ≥ 18
- A MongoDB instance (local or [Atlas](https://www.mongodb.com/cloud/atlas) free tier)
- A [Cloudinary](https://cloudinary.com) account (free tier is enough)

***REMOVED******REMOVED******REMOVED*** Setup

```bash
git clone https://github.com/AngelBerretta/BookWise.git
cd BookWise

***REMOVED*** Backend
cd backend
npm install
cp .env.example .env   ***REMOVED*** fill in your values — see table below
npm run dev

***REMOVED*** Frontend (new terminal)
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`, talking to the API at `http://localhost:8080`.

***REMOVED******REMOVED******REMOVED*** Environment Variables — backend (`backend/.env`)

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `MODE` | `mongo` or `fs` (flat-file persistence) |
| `JWT_SECRET` / `JWT_EXPIRES_IN` | Auth token signing |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Image uploads |
| `CLOUDINARY_MODERATION_ENABLED` | Opt-in AI image moderation (requires a paid Cloudinary add-on) |
| `SENDGRID_API_KEY` / `SENDGRID_FROM` | Optional — account verification emails |
| `CLIENT_URL` | Frontend origin, for CORS |
| `ENABLE_DEMO_RESEED` | Enables the scheduled demo data reset (production only) |

***REMOVED******REMOVED******REMOVED*** Environment Variables — frontend (`frontend/.env`)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL, e.g. `http://localhost:8080/api` |

***REMOVED******REMOVED******REMOVED*** Useful scripts (`backend/`)

```bash
npm run dev          ***REMOVED*** start with nodemon (MongoDB mode)
npm run dev:fs        ***REMOVED*** start with nodemon (flat-file mode)
npm run seed          ***REMOVED*** seed the product catalog
npm run seed:blog     ***REMOVED*** seed blog posts
npm run seed:demo     ***REMOVED*** create/refresh the demo accounts
npm run seed:all       ***REMOVED*** run all of the above
```

---

***REMOVED******REMOVED*** ☁️ Deployment

- **Backend** → [Render](https://render.com) (persistent Node process — required for Socket.io)
- **Frontend** → [Vercel](https://vercel.com) (static Vite build with SPA rewrites)
- **Database** → MongoDB Atlas
- **Media** → Cloudinary

Both deployments redeploy automatically on push to `main`.

---

***REMOVED******REMOVED*** 📄 License

ISC

---

***REMOVED******REMOVED*** 👤 Author

**Angel Berretta**
Full-stack developer · Buenos Aires, Argentina
Portfolio: [portfolio-fullstack-angel.vercel.app](https://portfolio-fullstack-angel.vercel.app)