export const validateSchema = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        // 1. AHORA BUSCA 'error.issues' (el correcto)
        if (Array.isArray(error.issues)) { 
            // 2. Devuelve un 400 (como tu profesor)
            return res.status(400).json(error.issues.map((error) => error.message));
        }

        // 3. Un 'catch' para cualquier otro error
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};