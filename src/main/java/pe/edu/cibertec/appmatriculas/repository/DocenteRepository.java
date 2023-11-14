package pe.edu.cibertec.appmatriculas.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pe.edu.cibertec.appmatriculas.model.bd.Docente;

import java.util.List;

@Repository
public interface DocenteRepository extends JpaRepository<Docente, Integer> {
    Docente findByNomdocente(String nomdocente);
    List<Docente> findByActivoTrue();
}
