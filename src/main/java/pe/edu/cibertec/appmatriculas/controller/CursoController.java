package pe.edu.cibertec.appmatriculas.controller;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import pe.edu.cibertec.appmatriculas.model.bd.Curso;
import pe.edu.cibertec.appmatriculas.model.request.CursoRequest;
import pe.edu.cibertec.appmatriculas.model.response.ResultadoResponse;
import pe.edu.cibertec.appmatriculas.service.CursoService;

import java.util.List;

@Controller
@RequestMapping("/curso")
@AllArgsConstructor
public class CursoController {

    private CursoService cursoService;

    @GetMapping("")
    public String index(Model model){
        model.addAttribute("listacursos", cursoService.listarCursos());
        return "curso/frmCurso";
    }

    @ResponseBody
    @GetMapping("/listar")
    public List<Curso> listarCursos(){
        return cursoService.listarCursos();
    }

    @ResponseBody
    @PostMapping("/guardar")
    public ResultadoResponse guardarCurso(@RequestBody CursoRequest cursoRequest){
        return cursoService.guardarCurso(cursoRequest);
    }
}
