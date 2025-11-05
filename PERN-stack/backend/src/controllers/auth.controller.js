import { pool } from '../db.js';
import bcrypt from 'bcrypt';
import { createAccessToken } from '../libs/jwt.js';
import md5 from 'md5';

export const signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

        if (result.rowCount === 0) {
            return res.status(400).json({ message: 'El correo no esta registrado' });
        }

        const validPassword = await bcrypt.compare(password, result.rows[0].password);

        if (!validPassword) {
            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }

        const token = await createAccessToken({ id: result.rows[0].id });

        res.cookie('token', token, {
            // httpOnly: true, // Lo comentamos para que 'js-cookie' pueda leerlo
            secure: false, // ¡CORREGIDO! 'false' para http
            sameSite: 'lax', // ¡CORREGIDO! 'lax' para http
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });
        return res.json(result.rows[0]);

    } catch (error) {
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const signup = async (req, res, next) => {
    const { name, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const gravatar = "https://www.gravatar.com/avatar/" + md5(email);

        const result = await pool.query('INSERT INTO usuarios (name, email, password, gravatar) VALUES ($1, $2, $3, $4) RETURNING *', [name, email, hashedPassword, gravatar]);

        const token = await createAccessToken({ id: result.rows[0].id });

        res.cookie('token', token, {
            // httpOnly: true,
            secure: false, // ¡CORREGIDO! 'false' para http
            sameSite: 'lax', // ¡CORREGIDO! 'lax' para http
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        return res.json(result.rows[0]);
    } catch (error) {
        if (error.code === '23505') {
            return res.status(400).json({ message: 'El correo ya esta registrado' });
        }
        // Devolvemos un JSON en lugar de 'next(error)'
        console.error("ERROR REAL EN SIGNUP:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    };
};


export const signout = (req, res) => {
    // Usamos las mismas opciones para borrar la cookie
    res.cookie('token', '', {
        secure: false,
        sameSite: 'lax',
        expires: new Date(0) // Expira ahora
    });
    return res.json({ message: 'Sesión cerrada' });
};

export const profile = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [req.usuarioId]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        return res.json(result.rows[0]);
    } catch (error) {
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};