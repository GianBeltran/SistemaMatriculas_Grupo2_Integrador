package pe.edu.cibertec.appmatriculas.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pe.edu.cibertec.appmatriculas.model.bd.Matricula;

import java.util.List;

@Repository
public interface MatriculaRepository extends JpaRepository<Matricula, Integer> {
    List<Matricula> findByGrado_Idgrado(Integer idgrado);
    List<Matricula> findByEstado(Integer estado);
}
