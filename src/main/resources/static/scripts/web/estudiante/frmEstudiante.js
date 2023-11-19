$(document).on("click", "#btnagregar", function(){
    $("#txtNombreEstudiante").val("");
    $("#txtApellidoEstudiante").val("");
    $("#txtEmailEstudiante").val("");
    $("#txtTelefonoEstudiante").val("");
    $("#txtFechaNacEstudiante").val("");
    $("#txtDireccionEstudiante").val("");

    $("#hddcodestudiante").val("0");

    $("#modalNuevo").modal("show");
});

$(document).on("click", ".btnactualizar", function(){
    var fechaNac = $(this).attr("data-fechanac");
    var fechaFormateada = moment(fechaNac).format("DD-MM-YYYY");

    $("#txtNombreEstudiante").val($(this).attr("data-nomestudiante"));
    $("#txtApellidoEstudiante").val($(this).attr("data-apeestudiante"));
    $("#txtEmailEstudiante").val($(this).attr("data-email"));
    $("#txtTelefonoEstudiante").val($(this).attr("data-telefono"));
    $("#txtFechaNacEstudiante").val(fechaFormateada);
    //$("#txtFechaNacEstudiante").val($(this).attr("data-fechanac"));
    $("#txtDireccionEstudiante").val($(this).attr("data-direccion"));

    $("#hddcodestudiante").val($(this).attr("data-idestudiante"));

    $("#modalNuevo").modal("show");
});

$(document).on("click", "#btnguardar", function(){
var fechaNacimiento = moment($("#txtFechaNacEstudiante").val(), "DD-MM-YYYY").toDate();

    $.ajax({
        type: "POST",
        url: "/estudiante/guardar",
        contentType: "application/json",
        data: JSON.stringify({
            idestudiante: $("#hddcodestudiante").val(),
            nomestudiante: $("#txtNombreEstudiante").val(),
            apeestudiante: $("#txtApellidoEstudiante").val(),
            email: $("#txtEmailEstudiante").val(),
            telefono: $("#txtTelefonoEstudiante").val(),
            fechanac: fechaNacimiento,
            //fechanac: $("#txtFechaNacEstudiante").val(),
            direccion: $("#txtDireccionEstudiante").val()
        }),
        success: function(resultado){
            if(resultado.respuesta){
                listarEstudiantes();
            }
            alert(resultado.mensaje);
        }
    });
    $("#modalNuevo").modal("hide");
});

$(document).on("click", ".btnCambiarEstado", function() {
    var idEstudiante = $(this).attr("data-idestudiante");
    var nomEstudiante = $(this).attr("data-nomestudiante");
    var apeEstudiante = $(this).attr("data-apeestudiante");

    // Mostrar el modal con el mensaje y opciones
    $("#mensajeModal").text("¿Quieres cambiar el estado de " + nomEstudiante + " " + apeEstudiante + " a Inactivo?");
    $("#modalCambiarEstado").modal("show");

    // Capturar el clic en el botón "Sí" del modal
    $("#btnConfirmarCambiarEstado").on("click", function() {
        // Realizar la llamada AJAX para cambiar el estado
        $.ajax({
            type: "POST",
            url: "/estudiante/cambiarEstado",
            data: {
                idestudiante: idEstudiante,
                estado: "Inactivo"
            },
            success: function(resultado) {
                if (resultado.respuesta) {
                    // Actualizar la lista de docentes después de cambiar el estado
                    listarEstudiantes();
                }
                alert(resultado.mensaje);
            }
        });

        // Ocultar el modal después de hacer la llamada
        $("#modalCambiarEstado").modal("hide");

        // Eliminar el evento clic del botón "Sí" para evitar duplicados
        $("#btnConfirmarCambiarEstado").off("click");
    });

    // Capturar el clic en el botón "No" del modal
    $("#modalCambiarEstado").on("hide.bs.modal", function() {
        // Eliminar el evento clic del botón "Sí" para evitar duplicados
        $("#btnConfirmarCambiarEstado").off("click");
    });
});


function listarEstudiantes(){
    $.ajax({
        type: "GET",
        url: "/estudiante/listar",
        dataType: "json",
        success: function(resultado){
            $("#tblestudiante > tbody").html("");
            $.each(resultado, function(index, value){
            var fechaNacimientoFormateada = moment(value.fechanac).format("DD-MM-YYYY");
            var fechaCreacionFormateada = moment(value.fechacrea).format("DD-MM-YYYY");

                $("#tblestudiante > tbody").append("<tr>"+
                    "<td>"+value.idestudiante+"</td>"+
                    "<td>"+value.nomestudiante+"</td>"+
                    "<td>"+value.apeestudiante+"</td>"+
                    "<td>"+value.email+"</td>"+
                    "<td>"+value.telefono+"</td>"+
                    "<td>"+fechaNacimientoFormateada+"</td>"+
                    "<td>"+value.direccion+"</td>"+
                    "<td>"+value.activo+"</td>"+
                    "<td>"+fechaCreacionFormateada+"</td>"+
                    "<td>"+
                        "<button type='button' class='btn btn-info btnactualizar'"+
                                     "data-idestudiante='"+value.idestudiante+"'"+
                                     "data-nomestudiante='"+value.nomestudiante+"'"+
                                     "data-apeestudiante='"+value.apeestudiante+"'"+
                                     "data-email='"+value.email+"'"+
                                     "data-telefono='"+value.telefono+"'"+
                                     "data-fechanac='"+value.fechanac+"'"+
                                     "data-direccion='"+value.direccion+"'"+
                                     "><i class='fas fa-edit'></i></button>"+
                         "<button type='button' class='btn btn-danger btnCambiarEstado'"+
                                                     "data-idestudiante='"+value.idestudiante+"'"+
                                                     "data-nomestudiante='"+value.nomestudiante+"'"+
                                                     "data-apeestudiante='"+value.apeestudiante+"'"+
                                                 "><i class='fas fa-edit'></i></button>"+

                    "</td></tr>");
            })
        }
    })
}