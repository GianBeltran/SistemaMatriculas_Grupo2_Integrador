package pe.edu.cibertec.appmatriculas.service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import pe.edu.cibertec.appmatriculas.model.bd.*;
import pe.edu.cibertec.appmatriculas.model.request.MatriculaRequest;
import pe.edu.cibertec.appmatriculas.model.response.ResultadoResponse;
import pe.edu.cibertec.appmatriculas.repository.CursoRepository;
import pe.edu.cibertec.appmatriculas.repository.MatriculaRepository;

import java.sql.Date;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class MatriculaService {

    private MatriculaRepository matriculaRepository;
    private CursoRepository cursoRepository;
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("dd-MM-yyyy");

    public List<Matricula> listarMatriculas(){
        return matriculaRepository.findAll();
    }
    public List<Matricula> listarMatriculasPorGrado(Integer idgrado){
        return matriculaRepository.findByGrado_Idgrado(idgrado);
    }
    public List<Matricula> listarMatriculasPorEstado(Integer estado){
        return matriculaRepository.findByEstado(estado);
    }

    public ResultadoResponse guardarMatricula(MatriculaRequest matricula){
        String mensaje = "SISTEMA: Matricula pendiente registrada correctamente";
        Boolean respuesta = true;
        try {
            Matricula objMatricula = new Matricula();
            if(matricula.getIdmatricula() > 0){
                objMatricula.setIdmatricula(matricula.getIdmatricula());
            }
            Estudiante estudiante = new Estudiante();
            estudiante.setIdestudiante(matricula.getIdestudiante());
            objMatricula.setEstudiante(estudiante);

            Grado grado = new Grado();
            grado.setIdgrado(matricula.getIdgrado());
            objMatricula.setGrado(grado);

            objMatricula.setFechamat(Date.valueOf(LocalDate.now()));
            objMatricula.setEstado(0); //0 = Pendiente, 1 = Confirmado, 2 = Cancelado
            objMatricula.setObservaciones("Sin observaciones");

            matriculaRepository.save(objMatricula);
        } catch (Exception e){
            mensaje = "ERROR: Matrícula no registrada correctamente";
            respuesta = false;
        }
        return ResultadoResponse.builder()
                .mensaje(mensaje)
                .respuesta(respuesta)
                .build();
    }

    public ResultadoResponse cambiarEstadoMatricula(Integer idMatricula, Integer nuevoEstado, String observaciones) {
        String mensaje = "SISTEMA: Estado de matrícula actualizado correctamente";
        Boolean respuesta = true;
        try {
            Optional<Matricula> matriculaOp = matriculaRepository.findById(idMatricula);

            if (matriculaOp.isPresent()) {
                Matricula matricula = matriculaOp.get();
                matricula.setEstado(nuevoEstado);

                if (nuevoEstado == 2) { // 2 = Cancelado
                    matricula.setObservaciones(observaciones);
                } else {
                    matricula.setObservaciones("Proceso completado"); // Si no es Cancelado, limpiamos las observaciones
                }

                matriculaRepository.save(matricula);
            } else {
                mensaje = "Matrícula no encontrada con ID: " + idMatricula;
                respuesta = false;
            }
        } catch (Exception e) {
            mensaje = "Error al cambiar el estado de la matrícula";
            respuesta = false;
        }
        return ResultadoResponse.builder()
                .mensaje(mensaje)
                .respuesta(respuesta)
                .build();
    }

    public DetallesMatricula obtenerDetallesMatricula(Integer idMatricula) {
        Matricula matricula = matriculaRepository.findById(idMatricula).orElse(null);

        if (matricula != null) {
            Estudiante estudiante = matricula.getEstudiante();
            Grado grado = matricula.getGrado();
            List<Curso> cursos = (grado != null) ? cursoRepository.findByGradoIdgrado(grado.getIdgrado()) : new ArrayList<>();
            return new DetallesMatricula(matricula, estudiante, grado, cursos);
        }
        return null;
    }
}
