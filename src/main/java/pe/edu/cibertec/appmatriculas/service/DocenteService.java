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

    public ResultadoResponse cambiarEstadoDocente(Integer iddocente, String estado) {
        String mensaje = "Estado del docente actualizado correctamente";
        Boolean respuesta = true;

        try {
            Optional<Docente> docenteOp = docenteRepository.findById(iddocente);

            if (docenteOp.isPresent()) {
                Docente docente = docenteOp.get();
                docente.setActivo(estado.equals("Activo"));
                docenteRepository.save(docente);
            } else {
                mensaje = "Docente no encontrado con ID: " + iddocente;
                respuesta = false;
            }
        } catch (Exception e) {
            mensaje = "Error al cambiar el estado del docente";
            respuesta = false;
        }

        return ResultadoResponse.builder()
                .mensaje(mensaje)
                .respuesta(respuesta)
                .build();
    }
}
