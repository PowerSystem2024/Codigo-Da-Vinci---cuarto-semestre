package UTN.datos;

import UTN.dominio.Estudiante;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

public class EstudianteDao {
    // metodo listar
    public List<Estudiante> listar(){
        List<Estudiante> estudiantes = new ArrayList<>();
        //creamos algunos objetos que son necesarios para comunicarnos con la base de datos
        PreparedStatement ps; //envia la sentencia a la base de datos
        ResultSet rs; // obtenemos el resultado de la base de datos
    }
}
