package pe.edu.cibertec.appmatriculas.service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import pe.edu.cibertec.appmatriculas.model.bd.Grado;
import pe.edu.cibertec.appmatriculas.repository.GradoRepository;

import java.util.List;

@Service
@AllArgsConstructor
public class GradoService {

    private GradoRepository gradoRepository;

    public List<Grado> listarGrados(){
        return gradoRepository.findAll();
    }

    public List<Grado> listarGradoNombre(String nomgrado){
        return gradoRepository.findByNomgrado(nomgrado);
    }
}
