package pe.edu.cibertec.appmatriculas.controller;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import pe.edu.cibertec.appmatriculas.model.bd.Docente;
import pe.edu.cibertec.appmatriculas.model.bd.Estudiante;
import pe.edu.cibertec.appmatriculas.model.request.EstudianteRequest;
import pe.edu.cibertec.appmatriculas.model.response.ResultadoResponse;
import pe.edu.cibertec.appmatriculas.service.EstudianteService;

import java.util.List;

@Controller
@RequestMapping("/estudiante")
@AllArgsConstructor
public class EstudianteController {

    private EstudianteService estudianteService;

    @GetMapping("")
    public String index(Model model){
        model.addAttribute("listaestudiantes", estudianteService.listarEstudiantes());
        return "estudiante/frmEstudiante";
    }

    @ResponseBody
    @GetMapping("/listar")
    public List<Estudiante> listarEstudiantes(){
        return estudianteService.listarEstudiantes();
    }
    @ResponseBody
    @GetMapping("/listarActivos")
    public List<Estudiante> listarEstudiantesActivos(){
        return estudianteService.listarEstudiantesActivos();
    }

    @ResponseBody
    @PostMapping("/guardar")
    public ResultadoResponse guardarEstudiante(@RequestBody EstudianteRequest estudianteRequest){
        return estudianteService.guardarEstudiante(estudianteRequest);
    }

    @ResponseBody
    @PostMapping("/cambiarEstado")
    public ResultadoResponse cambiarEstado(@RequestParam Integer idestudiante, @RequestParam String estado){
        return estudianteService.cambiarEstadoEstudiante(idestudiante, estado);
    }

    ////////////////
    @ResponseBody
    @GetMapping("/buscar")
    public Estudiante buscarEstudiantePorId(@RequestParam Integer idestudiante){
        return estudianteService.buscarEstudiantePorId(idestudiante);
    }

    @ResponseBody
    @GetMapping("/buscarPornombre")
    public List<Estudiante> buscarEstudiantesPorNombre(@RequestParam String nomestudiante){
        return estudianteService.buscarEstudiantesPorNombre(nomestudiante);
    }

    @ResponseBody
    @GetMapping("/buscarPorapellido")
    public List<Estudiante> buscarEstudiantesPorApellido(@RequestParam String apeestudiante){
        return estudianteService.buscarEstudiantePorApellido(apeestudiante);
    }
}
