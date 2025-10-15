import express from "express";
const app = express();
import cors from "cors";
import { MercadoPagoConfig, Preference } from "mercadopago";

app.use(express.json());
app.use(cors());

// Servir index.html
app.get("/", (req,res)=> {
  res.send("Soy el server :)");
});

const client = new MercadoPagoConfig({ accessToken: "APP_USR-3825418461362106-092914-b4fe48964859f71c445033b3a5b7dcc5-2721133404" });

app.post("/create_preference", async (req, res) => {
  try {
      const body = {
        items: [
          {
            title: req.body.title,
            unit_price: Number(req.body.price),
            quantity: Number(req.body.quantity),
            currency_id: "ARS",
          },                                
        ],
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
