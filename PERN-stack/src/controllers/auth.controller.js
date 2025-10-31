import {pool} from "../db.js"
import bcrypt from "bcrypt"; 
import {createAccessToken} from "../libs/jwt.js"
import md5 from "md5";

export const signin = async(req, res) => {
    // Nota: tu frontend envía 'email' y 'password'. 'name' no es necesario aquí.
    const { email, password } = req.body;

    try {
      const result = await pool.query("SELECT * FROM usuarios WHERE email = $1",[email])

      if(result.rowCount == 0){
          return res.status(400).json({message: "El correo no esta registrado"});
      }

      const validPassword = await bcrypt.compare(password, result.rows[0].password);

      if(!validPassword){
          return res.status(400).json({message: "La contraseña es incorrecta"});
      }
      const token = await createAccessToken({id: result.rows[0].id});
          
      res.cookie("token",token ,{
          // httpOnly: false, // Por defecto es false, está bien para js-cookie
          secure: false, // Falso para http
          sameSite: "lax", // 'lax' es necesario para http
          maxAge: 60 * 60 * 24 * 1000,
      })
      return res.json(result.rows[0]);

    } catch (error) {
      return res.status(500).json({ message: "Error interno del servidor" });
    }
}

export const signup = async(req, res, next) => {
   
    const {name , email, password} = req.body;

    try{
        const hashedPassword = await bcrypt.hash(password,10);
        md5(email);
        const gravatar = "https://gravatar.com/avatar/" + md5(email);
    
        const result = await pool.query("INSERT INTO usuarios (name, email, password, gravatar) VALUES ($1, $2 ,$3, $4) RETURNING * ", [name, email, hashedPassword, gravatar])

        const token = await createAccessToken({id: result.rows[0].id});
        
        // 🔽 CONFIGURACIÓN DE COOKIE CORREGIDA 🔽
        res.cookie("token",token ,{
            // httpOnly: false,
            secure: false, // Falso para http
            sameSite: "lax", // 'lax' es necesario para http
            maxAge: 60 * 60 * 24 * 1000,
        })
        return res.json(result.rows[0]);

    } catch(error){
        if(error.code === "23505"){
            return res.status(400).json({message: "El correo ya existe"});
        }
        console.error("Error en signup:", error.message); 
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};
 
export  const logout = (req, res) => {
    // 🔽 CONFIGURACIÓN DE COOKIE CORREGIDA 🔽
    res.cookie("token", "", {
        secure: false,
        sameSite: "lax",
        expires: new Date(0), // Expira inmediatamente
    });
    return res.json({message: "Sesion cerrada"});
};

export const profile = async (req, res) => {
    const result = await pool.query("SELECT * FROM usuarios WHERE id = $1", [req.usuarioId]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    
    return res.json(result.rows[0]);
};