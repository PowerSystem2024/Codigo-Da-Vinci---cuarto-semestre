from cursor_del_pool import CursorDelPool
from Usuario import Usuario
from logger_base import log

class UsuarioDAO:
    '''
    DAO significa : DATA ACCESS OBJECT
    CRUD:
        create -> insertar
        read -> seleccionar
        update -> actualizar
        delete -> eliminar
    '''

    _SELECCIONAR = 'SELECT * FROM usuarios order by id_usuario'
    _INSERTAR = 'INSERT INTO usuarios(username, password) VALUES (%s, %s)'
    _ACTUALIZAR = 'UPDATE usuarios SET username=%s, password=%s WHERE id_usuario=%s'
    _ELIMINAR = 'DELETE FROM usuarios WHERE id_usuario=%s'
    _CONSULTA = 'SELECT * FROM usuarios WHERE id_usuario=%s'

    @classmethod
    def seleccionar(cls):
        with CursorDelPool() as cursor:
            cursor.execute(cls._SELECCIONAR)
            registros = cursor.fetchall()
            usuarios = []
            for registro in registros:
                usuario = Usuario(registro[0], registro[1], registro[2])
                usuarios.append(usuario)
            return usuarios

    @classmethod
    def insertar(cls, usuario):
        with CursorDelPool() as cursor:
            valores = (usuario.username, usuario.password)
            cursor.execute(cls._INSERTAR, valores)
            log.debug(f'Persona Insertada: {usuario}')
            return cursor.rowcount

    @classmethod
    def actualizar(cls, usuario):
        with CursorDelPool() as cursor:
            valores = (usuario.username, usuario.password, usuario.id_usuario)
            cursor.execute(cls._ACTUALIZAR, valores)
            log.debug(f'Persona actualizada: {usuario}')
            return cursor.rowcount

    @classmethod
    def eliminar(cls, usuario):
        with CursorDelPool() as cursor:
            valores = (usuario.id_usuario,)
            cursor.execute(cls._ELIMINAR, valores)
            log.debug(f'Persona eliminada: {usuario}')
            return cursor.rowcount
    @classmethod
    def consultar(cls, id_usuario):
        with CursorDelPool() as cursor:
            valores = (id_usuario,)
            cursor.execute(cls._CONSULTA, valores)
            registro = cursor.fetchone()
            if registro:
                usuario = Usuario(registro[0], registro[1], registro[2])
                return usuario
            else:
                return None


if __name__ == '__main__':
    #Eliminar registro
    usuario1 = Usuario(id_usuario=1)
    usuario_eliminado = UsuarioDAO.eliminar(usuario1)
    log.debug(f'Usuario eliminado: {usuario_eliminado}')

    #Actualizar registro
    usuario1 = Usuario(1, 'manolob', '1234')
    usuario_actualizado = UsuarioDAO.actualizar(usuario1)
    log.debug(f'Usuario actualizado: {usuario_actualizado}')

    #Insertar registro
    usuario1 = Usuario(username='franco', password='abcd')
    usuario_insertado = UsuarioDAO.insertar(usuario1)
    log.debug(f'Usuario insertado: {usuario_insertado}')

    #Seleccionar objetos
    usuarios = UsuarioDAO.seleccionar()
    for usuario in usuarios:
        log.debug(usuario)
