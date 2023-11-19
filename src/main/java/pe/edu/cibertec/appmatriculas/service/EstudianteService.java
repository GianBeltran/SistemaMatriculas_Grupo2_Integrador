package pe.edu.cibertec.appmatriculas.service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import pe.edu.cibertec.appmatriculas.model.bd.Estudiante;
import pe.edu.cibertec.appmatriculas.model.request.EstudianteRequest;
import pe.edu.cibertec.appmatriculas.model.response.ResultadoResponse;
import pe.edu.cibertec.appmatriculas.repository.EstudianteRepository;

import java.sql.Date;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class EstudianteService {

    private EstudianteRepository estudianteRepository;
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("dd-MM-yyyy");

    ////////
    public List<Estudiante> listarEstudiantes(){
        return estudianteRepository.findAll();
    }
    public List<Estudiante> listarEstudiantesActivos(){
        return estudianteRepository.findByActivoTrue();
    }
    public List<Estudiante> buscarEstudiantesPorNombre(String nomestudiante){
        return estudianteRepository.findByNomestudiante(nomestudiante);
    }
    public List<Estudiante> buscarEstudiantePorApellido(String apeestudiante){
        return estudianteRepository.findByApeestudiante(apeestudiante);
    }
    ////////
    public ResultadoResponse guardarEstudiante(EstudianteRequest estudiante){
        String mensaje = "SISTEMA: Estudiante registrado correctamente";
        Boolean respuesta = true;
        try {
            Estudiante objEstudiante = new Estudiante();
            if(estudiante.getIdestudiante() > 0){
                objEstudiante.setIdestudiante(estudiante.getIdestudiante());
            }
            objEstudiante.setNomestudiante(estudiante.getNomestudiante());
            objEstudiante.setApeestudiante(estudiante.getApeestudiante());
            objEstudiante.setEmail(estudiante.getEmail());
            objEstudiante.setTelefono(estudiante.getTelefono());
            objEstudiante.setFechanac(estudiante.getFechanac());
            objEstudiante.setDireccion(estudiante.getDireccion());
            objEstudiante.setActivo(true);
            objEstudiante.setFechacrea(Date.valueOf(LocalDate.now()));

            estudianteRepository.save(objEstudiante);
        } catch (Exception e){
            mensaje = "ERROR: Estudiante no registrado";
            respuesta = false;
        }
        return ResultadoResponse.builder()
                .mensaje(mensaje)
                .respuesta(respuesta)
                .build();
    }

    public ResultadoResponse cambiarEstadoEstudiante(Integer idestudiante, String estado){
        String mensaje = "SISTEMA: Estado del estudiante actualizado correctamente";
        Boolean respuesta = true;
        try {
            Optional<Estudiante> estudianteOp = estudianteRepository.findById(idestudiante);

            if (estudianteOp.isPresent()){
                Estudiante estudiante = estudianteOp.get();
                estudiante.setActivo(estado.equals("Activo"));
                estudianteRepository.save(estudiante);
            } else {
                mensaje = "Estudiante no encontrado con ID: " + idestudiante;
                respuesta = false;
            }
        } catch (Exception e){
            mensaje = "Error al cambiar el estado del estudiante";
            respuesta = false;
        }
        return ResultadoResponse.builder()
                .mensaje(mensaje)
                .respuesta(respuesta)
                .build();
    }
}
