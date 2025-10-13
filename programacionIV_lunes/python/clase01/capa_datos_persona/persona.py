# 3ª paso hacer el loger base import
from logger_base import log


class Persona:
    def __init__(self, id_persona,nombre, apellido, email):
        self._id_persona = id_persona #el guin bajo indica que el atribto es privado
        self._nombre = nombre
        self._apellido = apellido
        self._email = email

    def __str__(self): #metodo str
        return f'''
            Id Persona.{self._id_persona},
            Nombre: {self._nombre},
            Apellido: {self._apellido},
            Email: {self._email}
        '''
    #ahora creamos los metodos getters y setters (en realidad en python se usa @property
    # para cada uno de lops atributos que quiera
    #metodo getters : es un metodo que nos permite leer los valores de un atributo
    #se definen con la convencion get + el nombre del atrbuto y nos devuelve el atributs ¿?
    #return self y el atributos


    # metodo setters: modifican los valores de un atributo
    #convencion def set_tipo(self,tipo): >> aqui lo que esta el argumento que
    #queremos que reemplaze el valor del atributo
    #luego tomamos el atributo y lo igualamos al argumento

    #para id_persona
    @property
    def id_persona(self):
        return self._id_persona

    @id_persona.setter
    def id_persona(self, id_persona):
        self._id_persona = id_persona

    #para _nombre
    @property
    def nombre(self):
        return self._nombre

    @nombre.setter
    def nombre(self, nombre):
        self._nombre = nombre

    #para apellido
    @property
    def apellido(self):
        return self._apellido

    @apellido.setter
    def apellido(self,apellido):
        self._apellido = apellido

    #para el mail
    @property
    def email(self):
        return self._email

    @email.setter
    def email(self, email):
        self._email =email

    #Getter: devuelve su valor
    # Setter: permite asignar un nuevo valor (si corresponde)

    # 2ª paso,
if __name__ == '__main__':
    persona1 = Persona(1,"juan","perez","perez@gmail.com")
    # 4ª paso poner el log con el debug (en este caso)
    log.debug(persona1)