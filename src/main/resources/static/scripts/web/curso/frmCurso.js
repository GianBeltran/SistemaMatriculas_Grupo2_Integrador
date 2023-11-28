$(document).on("click", "#btnagregar", function(){
    $("#txtNombreCurso").val("");
    $("#txtNivelCurso").val("");
    $("#hddcodcurso").val("0");
    $("#cbodocentes").empty();

    listarCboDocentes();
    $("#modalNuevo").modal("show");
});

$(document).on("click", ".btnactualizar", function(){
    $("#txtNombreCurso").val($(this).attr("data-nomcurso"));
    $("#txtNivelCurso").val($(this).attr("data-nivel"));
    $("#hddcodcurso").val($(this).attr("data-idcurso"));
    $("#cbodocentes").empty();
    listarCboDocentes($(this).attr("data-iddocente"));
    $("#modalNuevo").modal("show");
});

$(document).on("click", "#btnguardar", function(){
    $.ajax({
        type: "POST",
        url: "/curso/guardar",
        contentType: "application/json",
        data: JSON.stringify({
            idcurso: $("#hddcodcurso").val(),
            nomcurso: $("#txtNombreCurso").val(),
            nivel: $("#txtNivelCurso").val(),
            iddocente: $("#cbodocentes").val()
        }),
        success: function(resultado){
            if(resultado.respuesta){
                listarCursos();
                location.reload();
            }
            alert(resultado.mensaje);
        }
    });
    $("#modalNuevo").modal("hide");
});

function listarCboDocentes(iddocente){
    $.ajax({
        type: "GET",
        url: "/docente/listarActivos",
        dataType: "json",
        success: function(resultado){
            $.each(resultado, function(index, value){
                $("#cbodocentes").append(
                    `<option value="${value.iddocente}">${value.nomdocente}</option>`
                )
            });
            if(iddocente > 0){
                $("#cbodocentes").val(iddocente);
            }
        }
    });
}

function listarCursos(){
    $.ajax({
        type: "GET",
        url: "/curso/listar",
        dataType: "json",
        success: function(resultado){
            $("#tblcurso > tbody").html("");
            $.each(resultado, function(index, value){
                $("#tblcurso > tbody").append("<tr>"+
                    "<td>"+value.idcurso+"</td>"+
                    "<td>"+value.nomcurso+"</td>"+
                    "<td>"+value.nivel+"</td>"+
                    "<td>"+value.docente.nomdocente+"</td>"+
                    "<td>"+
                        "<button type='button' class='btn btn-info btnactualizar'"+
                                     "data-idcurso='"+value.idcurso+"'"+
                                     "data-nomcurso='"+value.nomcurso+"'"+
                                     "data-nivel='"+value.nivel+"'"+
                                     "data-iddocente='"+value.docente.iddocente+"'"+
                                     "><i class='fas fa-edit'></i></button>"+
                    "</td></tr>");
            })
        }
    })
}



