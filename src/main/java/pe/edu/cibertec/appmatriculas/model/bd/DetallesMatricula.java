package pe.edu.cibertec.appmatriculas.model.bd;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor @AllArgsConstructor
public class DetallesMatricula {
    private Matricula matricula;
    private Estudiante estudiante;
    private Grado grado;
    private List<Curso> cursos;
}

