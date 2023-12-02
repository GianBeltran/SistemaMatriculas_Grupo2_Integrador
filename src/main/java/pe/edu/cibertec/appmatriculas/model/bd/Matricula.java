package pe.edu.cibertec.appmatriculas.model.bd;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(name = "matricula")
@Data @NoArgsConstructor @AllArgsConstructor
public class Matricula {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idmatricula;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "idestudiante")
    private Estudiante estudiante;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "idgrado")
    private Grado grado;

    @Column(name = "fechamat")
    private Date fechamat;

    @Column(name = "estado")
    private Integer estado;

    @Column(name = "observaciones")
    private String observaciones;
}
