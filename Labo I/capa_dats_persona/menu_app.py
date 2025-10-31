from Usuario import Usuario
from UsuarioDao import UsuarioDAO
from logger_base import log

opcion = 0
while opcion != 5:
    print("Menu de opciones")
    print("1. Listar usuarios")
    print("2. Agregar usuario")
    print("3. Actualizar usuario")
    print("4. Eliminar usuario")
    print("5. Salir")
    print("")

    try:
        opcion = int(input("Ingrese una opcion: "))
        print("")
        if opcion == 1:
            log.debug("Listando usuarios...")
            usuarios = UsuarioDAO.seleccionar()
            for usuario in usuarios:
                log.debug(usuario)
                print("")
        elif opcion == 2:
            username = input("Ingrese el username del usuario: ")
            if username == "":
                raise ValueError("El username no puede estar vacio.")
            password = input("Ingrese el password del usuario: ")
            if password == "":
                raise ValueError("El password no puede estar vacio.")
            usuario = Usuario(username=username, password=password)
            UsuarioDAO.insertar(usuario)
            print("")
            log.debug(f"Usuario {usuario} agregado.")
            print("")
        elif opcion == 3:
            id_usuario = int(input("Ingrese el ID del usuario a actualizar: "))
            usuario_existente = UsuarioDAO.consultar(id_usuario)
            if not usuario_existente:
                log.error(f"No existe un usuario con ID {id_usuario}.")
                print("")
                continue
            else:
                username = input("Ingrese el nuevo username del usuario: ")
                password = input("Ingrese el nuevo password del usuario: ")
                usuario = Usuario(id_usuario=id_usuario, username=username, password=password)
                UsuarioDAO.actualizar(usuario)
                log.debug(f"Usuario {usuario} actualizado.")
                print("")
        elif opcion == 4:
            id_usuario = int(input("Ingrese el ID del usuario a eliminar: "))
            usuario = Usuario(id_usuario=id_usuario)
            UsuarioDAO.eliminar(usuario)
            log.debug(f"Usuario con ID {id_usuario} eliminado.")
            print("")
        elif opcion == 5:
            log.debug("Saliendo del programa...")
            print("")
        else:
            log.error("Opcion no valida.")
            print("")
    except Exception as e:
        log.error(f"Ocurrio un error: {e} - Por favor ingrese una opcion valida.")
        print("")
