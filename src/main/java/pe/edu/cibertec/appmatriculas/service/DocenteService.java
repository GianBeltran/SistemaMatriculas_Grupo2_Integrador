package pe.edu.cibertec.appmatriculas.service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import pe.edu.cibertec.appmatriculas.model.bd.Curso;
import pe.edu.cibertec.appmatriculas.model.bd.Docente;
import pe.edu.cibertec.appmatriculas.model.request.DocenteRequest;
import pe.edu.cibertec.appmatriculas.model.response.ResultadoResponse;
import pe.edu.cibertec.appmatriculas.repository.DocenteRepository;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class DocenteService {

    private DocenteRepository docenteRepository;

    public List<Docente> listarDocentes(){
        return docenteRepository.findAll();
    }
    public List<Docente> listarDocentesActivos(){
        return docenteRepository.findByActivoTrue();
    }
    public Docente buscarDocenteNombre(String nomdocente){
        return docenteRepository.findByNomdocente(nomdocente);
    }

    public ResultadoResponse guardarDocente(DocenteRequest docente){
        String mensaje = "Docente registrado correctamente";
        Boolean respuesta = true;
        try {

            Docente objDocente = new Docente();
            if (docente.getIddocente() > 0){
                objDocente.setIddocente(docente.getIddocente());
            }
            objDocente.setNomdocente(docente.getNomdocente());
            objDocente.setEmail(docente.getEmail());
            objDocente.setActivo(true);

            docenteRepository.save(objDocente);

        } catch (Exception e){
            mensaje = "Docente no registrado";
            respuesta = false;
        }
        return ResultadoResponse.builder()
                .mensaje(mensaje)
                .respuesta(respuesta)
                .build();
    }

    public List<Curso> obtenerCursosDeDocente(Integer iddocente){
        Optional<Docente> docenteOp = docenteRepository.findById(iddocente);
        if (docenteOp.isPresent()){
            Docente docente = docenteOp.get();
            return docente.getCursos();
        }
        throw new RuntimeException("Docente no encontrado con ID: " + iddocente);
    }
}
