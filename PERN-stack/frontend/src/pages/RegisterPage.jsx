import React from 'react'; 
import Input from '../components/ui/input';
import {Card} from "../components/ui/Card";
import {Button} from "../components/ui/Button";
import {useForm} from "react-hook-form";
import {Label} from "../components/ui/Label";
import {Link, useNavigate} from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

function RegisterPage() {

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors }, // Renombramos 'errors'
  } = useForm();
  
  const { signup, errors: registerErrors } = useAuth(); // Obtenemos 'signup' y los errores
  const navigate = useNavigate();

  // 🔽 'onSubmit' CORREGIDO CON TRY...CATCH 🔽
  const onSubmit = handleSubmit(async (data) => {
    try {
      await signup(data); // 1. Intentamos registrar
      navigate('/perfil'); // 2. Si tiene éxito, navegamos
      
    } catch (error) {
      // 3. Si 'signup' falla, el 'throw error' nos trae aquí
      const errorMessage = Array.isArray(error.response.data) 
                           ? error.response.data.join(', ') 
                           : error.response.data.message;
                           
      // ¡ESTE ES EL LOG QUE QUERÍAS VER!
      console.error("Error al registrar:", errorMessage);
    }
  });

  return (
    <div className='h-{calc(100vh-64px)} flex items-center justify-center'>
      
      <Card>
        
        {/* Esto mostrará el error en la pantalla */}
        {registerErrors && (
          <div className="bg-red-500 text-white p-2 text-center mb-2 rounded-md">
            {registerErrors}
          </div>
        )}

        <h2 className = 'text-2xl font-bold my-2' >  Registro </h2>
          <form onSubmit={onSubmit}>
        <Label htmlFor='name'>Nombre</Label>
        <Input 
          id="name" // ID por accesibilidad
          placeholder= "Ingrese su nombre" 
          {...register("name", { required: true })}
        />
         {formErrors.name && (
            <p className="text-red-500">Este campo es requerido</p>
          )}
        <Label htmlFor='email'>Email</Label>
        <Input 
          id="email" // ID por accesibilidad
          type='email' 
          placeholder= "Ingrese su email"
          {...register("email", { required: true })}
        />
         {formErrors.email && (
            <p className="text-red-500">Este campo es requerido</p>
          )}
        <Label htmlFor='password'>Contraseña</Label>
        <Input 
          id="password" // ID por accesibilidad
          type='password' 
          placeholder= "Ingrese su contraseña"
          {...register("password", { required: true })}
        />
        {formErrors.password && (
            <p className="text-red-500">Este campo es requerido</p>
          )}

        <Button>Registrase</Button>

      </form>
       <p className="text-gray-400 text-sm mt-4">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Iniciar Sesión
          </Link>
        </p>
      </Card>
    </div>
  );
}

export default RegisterPage;