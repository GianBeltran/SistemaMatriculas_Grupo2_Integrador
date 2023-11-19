package pe.edu.cibertec.appmatriculas.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pe.edu.cibertec.appmatriculas.model.bd.Estudiante;

import java.util.List;

@Repository
public interface EstudianteRepository extends JpaRepository<Estudiante, Integer> {
    List<Estudiante> findByNomestudiante(String nomestudiante);
    List<Estudiante> findByApeestudiante(String apeestudiante);
    List<Estudiante> findByActivoTrue();
}
