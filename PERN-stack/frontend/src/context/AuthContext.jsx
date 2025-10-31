import React, {createContext, useContext, useState, useEffect} from 'react'
import Cookie from "js-cookie"; // Tu profesor lo usa para leer la cookie
import axios from "axios"; 

export const AuthContext= createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context){
        throw new Error("useAuth must be used within AuthProvider")
    }
    return context;
}

export function AuthProvider({children}){
    const[user, setUser] = useState(null);
    const[isAuth , setIsAuth] = useState(false);
    const[errors , setErrors] = useState(null);
    const [loading, setLoading] = useState(true); // Estado de carga

    
    const signup = async (data) =>{
      try {
        const res = await axios.post("http://localhost:3000/api/signup", data, {
          withCredentials: true,
        });
        console.log("Respuesta de signup:", res.data);
        setUser(res.data);
        setIsAuth(true); 
      } catch (error) {
        const errorMessage = Array.isArray(error.response.data) 
                           ? error.response.data.join(', ') 
                           : error.response.data.message;  
        console.error("Error en signup (desde AuthContext):", errorMessage);
        setErrors(errorMessage);
        throw error; 
      }
    }

    const signin = async (data) => {
      try {
        const res = await axios.post("http://localhost:3000/api/login", data, {
          withCredentials: true,
        });
        setUser(res.data);
        setIsAuth(true);
        setErrors(null);
      } catch (error) {
        const errorMessage = Array.isArray(error.response.data) 
                           ? error.response.data.join(', ') 
                           : error.response.data.message;  
        console.error("Error en signin (desde AuthContext):", errorMessage);
        setErrors(errorMessage);
        throw error; 
      }
    }

    // 🔽 ESTE ES EL 'useEffect' QUE USA TU PROFESOR 🔽
    useEffect(() => {
      async function checkLogin() {
        const token = Cookie.get('token'); // 1. Leemos la cookie
        
        if (!token) {
          // 2. Si no hay token, no está autenticado
          setIsAuth(false);
          setUser(null);
          setLoading(false); // Terminamos de cargar
          return;
        }

        // 3. Si hay token, lo verificamos con el backend
        try {
          const res = await axios.get("http://localhost:3000/api/profile", {
            withCredentials: true, // Esto envía la cookie 'token' automáticamente
          });

          // 4. Si el token es válido, el backend devuelve al usuario
          setUser(res.data);
          setIsAuth(true);
          setLoading(false);
        } catch (error) {
          // 5. Si el token es inválido (error 401)
          console.error("Error al verificar token:", error);
          setIsAuth(false);
          setUser(null);
          setLoading(false);
        }
      }
      checkLogin();
    }, []); // El array vacío [] lo ejecuta 1 sola vez

    return <AuthContext.Provider value={{
        user,
        isAuth,
        errors,
        loading, // <-- Exportamos 'loading'
        signup,
        signin, 
        setUser,
    }}>
        {children}
    </AuthContext.Provider>
}