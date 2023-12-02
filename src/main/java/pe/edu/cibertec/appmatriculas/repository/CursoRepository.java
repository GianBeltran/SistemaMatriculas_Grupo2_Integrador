package pe.edu.cibertec.appmatriculas.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pe.edu.cibertec.appmatriculas.model.bd.Curso;

import java.util.List;

@Repository
public interface CursoRepository extends JpaRepository<Curso, Integer> {
    List<Curso> findByNomcurso(String nomcurso);
    List<Curso> findByGradoIdgrado(Integer idgrado);
}
