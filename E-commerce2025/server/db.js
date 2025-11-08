import pg from "pg";
import 'dotenv/config'; // Importa dotenv

// Revisa si estamos en "producción" (en Render)
const isProduction = process.env.NODE_ENV === "production";

const connectionConfig = {
    connectionString: isProduction 
        ? process.env.DATABASE_URL 
        : "postgresql://postgres:admin@localhost:5432/ecommerce_db", // <-- Usa  localhost (VERIFICÁ TU CONTRASEÑA "admin")
    ssl: isProduction ? { rejectUnauthorized: false } : false
};

export const pool = new pg.Pool(connectionConfig);

pool.on("connect", () => {
    console.log("Conectado a la base de datos PostgreSQL");
});