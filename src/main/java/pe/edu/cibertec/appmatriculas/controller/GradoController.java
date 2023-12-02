package pe.edu.cibertec.appmatriculas.controller;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import pe.edu.cibertec.appmatriculas.model.bd.Grado;
import pe.edu.cibertec.appmatriculas.service.GradoService;

import java.util.List;

@Controller
@RequestMapping("/grado")
@AllArgsConstructor
public class GradoController {

    private GradoService gradoService;

    @GetMapping("")
    public String index(Model model){
        model.addAttribute("listagrados", gradoService.listarGrados());
        return "grado/frmGrado";
    }

    @ResponseBody
    @GetMapping("/listar")
    public List<Grado> listarGrados(){
        return gradoService.listarGrados();
    }
}
