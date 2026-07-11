import "dotenv/config";
import express    from "express";
import http       from "node:http";
import cors       from "cors";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import path       from "node:path";
import { fileURLToPath } from "node:url";

import config              from "../config.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import connectDB           from "./db/mongo.js";
import router              from "./router/index.js";
import viewsRouter         from "./router/views.router.js";
import { startScheduledReseed } from "./services/scheduler.service.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// ── App & HTTP server ─────────────────────────────────────────────────────────
const app    = express();
const server = http.createServer(app);

// ── Socket.io ─────────────────────────────────────────────────────────────────
const io = new Server(server, {
  cors: { origin: "*", credentials: true },
  transports: ['websocket'],
});

io.on("connection", (socket) => {
  console.log(`🔌 Cliente WS conectado: ${socket.id}`);
  socket.on("disconnect", () =>
    console.log(`❌ Cliente WS desconectado: ${socket.id}`)
  );
});

app.set("io", io);

// ── Handlebars ────────────────────────────────────────────────────────────────
app.engine(
  "handlebars",
  engine({
    layoutsDir:    path.join(__dirname, "views/layouts"),
    defaultLayout: "main",
    helpers: {
      eq: (a, b) => a === b,
    },
  })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// ── CORS ──────────────────────────────────────────────────────────────────────
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const allowed = [
      config.client.url,
      'http://localhost:5174',
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174',
    ];

    if (allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS bloqueado para: ${origin}`));
    }
  },
  credentials:    true,
  methods:        ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// ── Middlewares globales ──────────────────────────────────────────────────────
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // preflight
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Rutas de vistas ───────────────────────────────────────────────────────────
app.use("/", viewsRouter);

// ── Health check — usado por el ping externo para evitar el cold start ────────
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

// ── API REST ──────────────────────────────────────────────────────────────────
app.use("/api", router);

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((req, res, next) => {
  if (req.path.startsWith("/socket.io")) return next();
  res.status(404).json({ status: "error", message: "Ruta no encontrada" });
});

// ── Error handler ─────────────────────────────────────────────────────────────
app.use(errorMiddleware);

// ── Conectar DB y levantar servidor ──────────────────────────────────────────
if (config.mode !== "fs") {
  await connectDB();
}

// Solo se activa si vos explícitamente lo prendés en el host de producción
if (process.env.ENABLE_DEMO_RESEED === "true") {
  startScheduledReseed();
}

const PORT = config.server.port;
server.listen(PORT, () => {
  console.log(`\n🛒 E-commerce API corriendo en http://localhost:${PORT}`);
  console.log(`⚙️  Modo: ${config.mode.toUpperCase()}`);
  console.log(`🖥️  Vistas: http://localhost:${PORT}/products\n`);
});

export default app;