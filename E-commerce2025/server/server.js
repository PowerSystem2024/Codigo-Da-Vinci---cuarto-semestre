import express from "express";
const app = express();
import cors from "cors";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { pool } from "./db.js"; // 1. Importar la conexión a la BD
import authRoutes from "./router/auth.routes.js"; // 2. Importar las rutas de auth

app.use(express.json());
app.use(cors());

// --- NUEVAS RUTAS DE AUTENTICACIÓN ---
app.use("/api", authRoutes); 

// --- RUTA PARA OBTENER PRODUCTOS (Desde la BD) ---
app.get("/api/productos", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM productos");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener productos" });
  }
});


// --- RUTA DE MERCADO PAGO (CON EL TOKEN CORREGIDO) ---
// 🔽 ¡AQUÍ ESTÁ EL ARREGLO! 🔽
const client = new MercadoPagoConfig({ accessToken: "APP_USR-3825418461362106-092914-b4fe48964859f71c445033b3a5b7dcc5-2721133404" });

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
    console.log(error)
    res.status(500).json({ error: "Error creando preferencia" });
  }
});

// Iniciar servidor
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});