package pe.edu.cibertec.appmatriculas.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pe.edu.cibertec.appmatriculas.model.bd.Grado;

import java.util.List;

@Repository
public interface GradoRepository extends JpaRepository<Grado, Integer> {
    List<Grado> findByNomgrado(String nomgrado);
}
