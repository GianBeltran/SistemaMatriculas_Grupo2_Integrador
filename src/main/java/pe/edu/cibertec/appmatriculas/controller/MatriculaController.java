package pe.edu.cibertec.appmatriculas.controller;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import pe.edu.cibertec.appmatriculas.model.bd.Curso;
import pe.edu.cibertec.appmatriculas.model.bd.Estudiante;
import pe.edu.cibertec.appmatriculas.model.bd.Matricula;
import pe.edu.cibertec.appmatriculas.model.request.CursoRequest;
import pe.edu.cibertec.appmatriculas.model.request.MatriculaRequest;
import pe.edu.cibertec.appmatriculas.model.response.ResultadoResponse;
import pe.edu.cibertec.appmatriculas.service.MatriculaService;

import java.util.List;

@Controller
@RequestMapping("/matricula")
@AllArgsConstructor
public class MatriculaController {

    private MatriculaService matriculaService;

    @GetMapping("")
    public String index(Model model) {
        model.addAttribute("listamatriculas", matriculaService.listarMatriculas());
        return "matricula/frmMatricula";
    }

    @ResponseBody
    @GetMapping("/listar")
    public List<Matricula> listarMatriculas() {
        return matriculaService.listarMatriculas();
    }

    @ResponseBody
    @PostMapping("/guardar")
    public ResultadoResponse guardarMatricula(@RequestBody MatriculaRequest matriculaRequest) {
        return matriculaService.guardarMatricula(matriculaRequest);
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    @ResponseBody
    @PostMapping("/cambiarEstado")
    public ResultadoResponse cambiarEstado(@RequestParam Integer idmatricula, @RequestParam Integer nuevoEstado, @RequestParam String observaciones) {
        return matriculaService.cambiarEstadoMatricula(idmatricula, nuevoEstado, observaciones);
    }

    ////////////////
    @ResponseBody
    @GetMapping("/buscarPorGrado")
    public List<Matricula> buscarMatriculaPorGrado(@RequestParam Integer idgrado) {
        return matriculaService.listarMatriculasPorGrado(idgrado);
    }

    @ResponseBody
    @GetMapping("/buscarPorEstado")
    public List<Matricula> buscarMatriculaPorEstado(@RequestParam Integer estado) {
        return matriculaService.listarMatriculasPorEstado(estado);
    }
}
