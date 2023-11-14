package pe.edu.cibertec.appmatriculas.controller;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import pe.edu.cibertec.appmatriculas.model.bd.Docente;
import pe.edu.cibertec.appmatriculas.model.request.DocenteRequest;
import pe.edu.cibertec.appmatriculas.model.response.ResultadoResponse;
import pe.edu.cibertec.appmatriculas.service.DocenteService;

import java.util.List;

@Controller
@RequestMapping("/docente")
@AllArgsConstructor
public class DocenteController {

    private DocenteService docenteService;

    @GetMapping("")
    public String index(Model model){
        model.addAttribute("listadocentes", docenteService.listarDocentes());
        return "docente/frmDocente";
    }

    @ResponseBody
    @GetMapping("/listar")
    public List<Docente> listarDocentes(){
        return docenteService.listarDocentes();
    }

    @ResponseBody
    @PostMapping("/guardar")
    public ResultadoResponse guadarDocente(@RequestBody DocenteRequest docenteRequest){
        return docenteService.guardarDocente(docenteRequest);
    }

    @ResponseBody
    @PostMapping("/cambiarEstado")
    public ResultadoResponse cambiarEstado(@RequestParam Integer iddocente, @RequestParam String estado) {
        return docenteService.cambiarEstadoDocente(iddocente, estado);
    }
}
