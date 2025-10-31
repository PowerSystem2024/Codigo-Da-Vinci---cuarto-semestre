import React from 'react'; 
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import Input from '../components/ui/input';
import {Card} from "../components/ui/Card";
import {Button} from "../components/ui/Button";
import {Label} from '../components/ui/Label';
import { useAuth } from '../context/AuthContext'; 

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors }, 
  } = useForm();
  
  const navigate = useNavigate();
  const { signin, errors: signinErrors } = useAuth(); 

  // 🔽 'onSubmit' CORREGIDO CON MEJOR MANEJO DE ERRORES 🔽
  const onSubmit = handleSubmit(async (data) => {
    try {
      await signin(data);
      navigate("/perfil"); 
      
    } catch (error) {
      // 1. Verificamos qué tipo de error es
      const errorMessage = Array.isArray(error.response.data) 
                           ? error.response.data.join(', ') 
                           : error.response.data.message;
                           
      // ¡ESTE ES EL LOG DE TU PROFESOR!
      console.error("Error al iniciar sesión:", errorMessage);
    }
  });

  return (
    <div className="h-[calc(100vh-64px)] flex items-center justify-center">
      <Card>
        
        {signinErrors && (
          <div className="bg-red-500 text-white p-2 text-center mb-2 rounded-md">
            {signinErrors}
          </div>
        )}

        <h1 className="text-2xl font-bold text-white mb-4">Iniciar Sesión</h1>
        <form onSubmit={onSubmit}>
          <Label htmlFor= 'email'>Email</Label> 
          <Input
            id="email" 
            type="email"
            placeholder="Ingrese su email"
            {...register("email", { required: true })}
          />
          {formErrors.email && (
            <p className="text-red-500 text-sm">Este campo es requerido</p>
          )}
          <Label htmlFor= 'password'>Contraseña</Label> 
          <Input
            id="password" 
            type="password"
            placeholder="Ingrese su contraseña"
            {...register("password", { required: true })}
          />
          {formErrors.password && (
            <p className="text-red-500 text-sm">Este campo es requerido</p>
          )}

          <Button type="submit">Ingresar</Button>
        </form>

        <p className="text-gray-400 text-sm mt-4">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </Card>
    </div>
  );
}

export default LoginPage;