package pe.edu.cibertec.appmatriculas.service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.edu.cibertec.appmatriculas.model.bd.Curso;
import pe.edu.cibertec.appmatriculas.model.bd.Docente;
import pe.edu.cibertec.appmatriculas.model.request.CursoRequest;
import pe.edu.cibertec.appmatriculas.model.response.ResultadoResponse;
import pe.edu.cibertec.appmatriculas.repository.CursoRepository;

import java.util.List;

@Service
@AllArgsConstructor
public class CursoService {

    private CursoRepository cursoRepository;
    private DocenteService docenteService;

    public List<Curso> listarCursos(){
        return cursoRepository.findAll();
    }

    public List<Curso> findByNivel(String nivel) {
        return cursoRepository.findByNivel(nivel);
    }

    public List<Curso> findByNomcurso(String nomcurso) {
        return cursoRepository.findByNomcurso(nomcurso);
    }

    public ResultadoResponse guardarCurso(CursoRequest curso){
        String mensaje = "Curso registrado correctamente";
        Boolean respuesta = true;
        try {
            Curso objCurso = new Curso();
            if (curso.getIdcurso() > 0){
                objCurso.setIdcurso(curso.getIdcurso());
            }
            objCurso.setNomcurso(curso.getNomcurso());
            objCurso.setNivel(curso.getNivel());

            Docente docente = new Docente();
            docente.setIddocente(curso.getIddocente());
            objCurso.setDocente(docente);

            cursoRepository.save(objCurso);

        } catch (Exception e){
            mensaje = "Curso no registrado";
            respuesta = false;
            e.printStackTrace();
        }
        return ResultadoResponse.builder()
                .mensaje(mensaje)
                .respuesta(respuesta)
                .build();
    }
}
