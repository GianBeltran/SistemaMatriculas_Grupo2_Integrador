package pe.edu.cibertec.appmatriculas.model.request;

import lombok.Data;

@Data
public class CursoRequest {
    private Integer idcurso;
    private String nomcurso;
    private String nivel;
    private Integer iddocente;
}
