import { pool } from "../db.js";

export const listarTareas = async (req, res) => {
    console.log(req.usuarioId);
    const result = await pool.query('SELECT * FROM tareas WHERE usuario_id = $1' , [req.usuarioId]);
    return res.json(result.rows);
};

export const listarTarea = async (req, res) => {
    console.log(req.params.id);
    const result = await pool.query('SELECT * FROM tareas WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({
        message: 'La tarea no existe'
    });
    res.json(result.rows);
};

export const crearTarea = async (req, res, next) => {
    console.log(req.body);
    const { titulo, descripcion } = req.body;
    try {
        const result = await pool.query('INSERT INTO tareas (titulo, descripcion, usuario_id) VALUES ($1, $2, $3) RETURNING *', [titulo, descripcion, req.usuarioId]);
        res.json(result.rows[0]);
    } catch (error) {
        if (error.code === '23505') {
            console.log('La tarea ya existe');
            return res.status(400).send('La tarea ya existe');
        }
        console.log('Algo salió mal');
        next(error);
    }
}

export const actualizarTarea = (req, res) => {
    const { id } = req.params;
    const { titulo, descripcion } = req.body;
    pool.query('UPDATE tareas SET titulo = $1, descripcion = $2 WHERE id = $3 RETURNING *', [titulo, descripcion, id], (error, result) => {
        if (error) {
            console.log('Algo salió mal');
            return res.status(500).json({
                message: 'Algo salió mal'
            });
        }
        if (result.rowCount === 0) return res.status(404).json({
            message: 'La tarea no existe'
        });
        res.json(result.rows[0]);
    });
}

export const eliminarTarea = async (req, res) => {
    const result = await pool.query('DELETE FROM tareas WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({
        message: 'La tarea no existe'
    });
    return res.sendStatus(204);
}
