$(document).on("click", "#btnagregar", function(){
    $("#txtNombreDocente").val("");
    $("#txtEmailDocente").val("");
    $("#hddcoddocente").val("0");

    $("#modalNuevo").modal("show");
});

$(document).on("click", ".btnactualizar", function(){
    $("#txtNombreDocente").val($(this).attr("data-nomdocente"));
    $("#txtEmailDocente").val($(this).attr("data-email"));

    $("#hddcoddocente").val($(this).attr("data-iddocente"));

    $("#modalNuevo").modal("show");
});

$(document).on("click", "#btnguardar", function(){
    $.ajax({
        type: "POST",
        url: "/docente/guardar",
        contentType: "application/json",
        data: JSON.stringify({
            iddocente: $("#hddcoddocente").val(),
            nomdocente: $("#txtNombreDocente").val(),
            email: $("#txtEmailDocente").val()
        }),
        success: function(resultado){
            if(resultado.respuesta){
                listarDocentes();
            }
            alert(resultado.mensaje);
        }
    });
    $("#modalNuevo").modal("hide");
});

function listarDocentes(){
    $.ajax({
        type: "GET",
        url: "/docente/listar",
        dataType: "json",
        success: function(resultado){
            $("#tbldocente > tbody").html("");
            $.each(resultado, function(index, value){
                $("#tbldocente > tbody").append("<tr>"+
                    "<td>"+value.iddocente+"</td>"+
                    "<td>"+value.nomdocente+"</td>"+
                    "<td>"+value.email+"</td>"+
                    "<td>"+
                        "<button type='button' class='btn btn-info btnactualizar'"+
                                     "data-iddocente='"+value.iddocente+"'"+
                                     "data-nomdocente='"+value.nomdocente+"'"+
                                     "data-email='"+value.email+"'"+

                                     "><i class='fas fa-edit'></i></button>"+
                    "</td></tr>");
            })
        }
    })
}