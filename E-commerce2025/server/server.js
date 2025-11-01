import express from "express";
import cors from "cors";
import { MercadoPagoConfig, Preference } from "mercadopago";

const app = express();
const client = new MercadoPagoConfig({ accessToken: "APP_USR-3825418461362106-092914-b4fe48964859f71c445033b3a5b7dcc5-2721133404" });

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Soy el server :)");
});

// --- INICIO DEL CÓDIGO CORREGIDO ---
app.post("/create_preference", async (req, res) => {
  try {
    // El cuerpo de la solicitud ahora contiene un array de items
    const items = req.body.items.map(item => ({
      title: item.title,
      unit_price: Number(item.price),
      quantity: Number(item.quantity),
      currency_id: "ARS",
    }));

    const body = {
      items: items, // Usamos el array de items que creamos
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
// --- FIN DEL CÓDIGO CORREGIDO ---

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});