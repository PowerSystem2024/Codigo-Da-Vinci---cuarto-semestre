import { pool } from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; // Usamos jwt para crear el token

// Función para crear el token (podés ponerla en 'libs' como antes, o dejarla aquí)
const createAccessToken = (payload) => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, "miclavesecreta123", { expiresIn: "1d" }, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });
};

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO usuarios (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, hashedPassword]
    );
    return res.json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") { // Error de 'unique' (email duplicado)
      return res.status(400).json({ message: "El correo ya existe" });
    }
    return res.status(500).json({ message: "Error interno" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);
    if (result.rowCount === 0) {
      return res.status(400).json({ message: "El correo no existe" });
    }

    const validPassword = await bcrypt.compare(password, result.rows[0].password);
    if (!validPassword) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    // Creamos el Token
    const token = await createAccessToken({ id: result.rows[0].id });

    // ¡LA DIFERENCIA! Devolvemos el token en el JSON, no en una cookie
    return res.json({
      message: "Login exitoso",
      token: token,
      user: {
         id: result.rows[0].id,
         name: result.rows[0].name,
         email: result.rows[0].email
      }
    });

  } catch (error) {
    return res.status(500).json({ message: "Error interno" });
  }
};