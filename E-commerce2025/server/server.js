// server/server.js
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "./db.js"; // tu conexión a la BD
import authRoutes from "./router/auth.routes.js";
import { MercadoPagoConfig, Preference } from "mercadopago";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

// CORS: permitir frontend local y remoto
app.use(cors({
  origin: [
    'https://codigodavinci-ecomerce.netlify.app',
    'http://127.0.0.1:5500',
    'http://localhost:5500'
  ],
  credentials: true
}));

// --- RUTAS DE AUTENTICACIÓN ---
app.use("/api", authRoutes);

// --- RUTA PARA OBTENER PRODUCTOS DESDE BD ---
app.get("/api/productos", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM productos");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener productos" });
  }
});

const client = new MercadoPagoConfig({ accessToken: "APP_USR-3825418461362106-092914-b4fe48964859f71c445033b3a5b7dcc5-2721133404" });
// --- MERCADO PAGO ---
const client = new MercadoPagoConfig({ accessToken: "TU_ACCESS_TOKEN_AQUI" });

app.post("/create_preference", async (req, res) => {
  try {
    const items = req.body.map(product => ({
      title: product.title,
      unit_price: Number(product.price),
      quantity: Number(product.quantity),
      currency_id: "ARS",
    }));

    const body = {
      items: items,
      back_urls: {
        success: "https://www.youtube.com/watch?v=vEXwN9-tKcs",
        failure: "https://www.youtube.com/watch?v=vEXwN9-tKcs",
        pending: "https://www.youtube.com/watch?v=vEXwN9-tKcs",
      },
      auto_return: "approved",
    };

    const preference = new Preference(client);
    const result = await preference.create({ body });
    res.json({ id: result.id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error creando preferencia" });
  }
});

// --- RUTAS PARA SERVIR LOS HTML ---
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "../client/index.html")));
app.get("/login", (req, res) => res.sendFile(path.join(__dirname, "../client/login.html")));
app.get("/register", (req, res) => res.sendFile(path.join(__dirname, "../client/register.html")));

// --- SERVIR ARCHIVOS ESTÁTICOS (JS, CSS, imágenes) ---
app.use("/js", express.static(path.join(__dirname, "../client/js")));
app.use("/media", express.static(path.join(__dirname, "../client/media")));

// --- INICIAR SERVIDOR ---
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en el puerto ${PORT}`);
});