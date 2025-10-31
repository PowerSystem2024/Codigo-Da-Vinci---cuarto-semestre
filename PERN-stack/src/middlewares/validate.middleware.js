export const validateSchema = (schema) => (req, res, next) => {
    
    // (Ya podés borrar los console.log de debug si querés)
    
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        
        // CORREGIDO AQUÍ: Es 'error.issues', no 'error.errors'
        if (Array.isArray(error.issues)) { 
            // Devolvemos el 400 que SÍ ves en el video
            return res.status(400).json(error.issues.map((error) => error.message));
        }

        // Para cualquier otro error
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};