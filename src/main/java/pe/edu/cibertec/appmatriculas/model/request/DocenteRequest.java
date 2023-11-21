package pe.edu.cibertec.appmatriculas.model.request;

import lombok.Data;
import pe.edu.cibertec.appmatriculas.model.bd.Curso;

import java.util.Date;
import java.util.List;

@Data
public class DocenteRequest {
    private Integer iddocente;
    private String nomdocente;
    private String email;
    private Boolean activo;
    private Date fechacrea;
}
