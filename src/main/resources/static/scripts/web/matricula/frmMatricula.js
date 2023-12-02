$(document).ready(function() {

$(document).on("click", "#btnagregar", function(){
    $("#cboestudiantes").empty();
    $("#cbogrados").empty();
    $("#hddcodmatricula").val("0");

    listarCboEstudiantes();
    listarCboGrados();

    $("#modalNuevo").modal("show");
});

$(document).on("click", ".btnactualizar", function(){
    $("#cboestudiantes").empty();
    listarCboEstudiantes($(this).attr("data-idestudiante"));

    $("#cbogrados").empty();
    listarCboGrados($(this).attr("data-idgrado"));

    $("#hddcodmatricula").val($(this).attr("data-idmatricula"));

    $("#modalNuevo").modal("show");
});

$(document).on("click", "#btnguardar", function(){
    $.ajax({
        type: "POST",
        url: "/matricula/guardar",
        contentType: "application/json",
        data: JSON.stringify({
            idmatricula: $("#hddcodmatricula").val(),
            idestudiante: $("#cboestudiantes").val(),
            idgrado: $("#cbogrados").val()
        }),
        success: function(resultado){
            if(resultado.respuesta){
                listarMatriculas();
                location.reload();
            }
            alert(resultado.mensaje);
        }
    });
    $("#modalNuevo").modal("hide");
});

function listarMatriculas(){
    $.ajax({
        type: "GET",
        url: "/matricula/listar",
        dataType: "json",
        success: function(resultado){
            $("#tblmatricula > tbody").html("");
            $.each(resultado, function(index, value){
            var fechaMatriculaFormateada = moment(value.fechamat).format("DD-MM-YYYY");

                $("#tblmatricula > tbody").append("<tr>"+
                    "<td>"+value.idmatricula+"</td>"+
                    "<td>"+value.estudiante.nomestudiante+"</td>"+
                    "<td>"+value.grado.nomgrado+"</td>"+
                    "<td>"+fechaMatriculaFormateada+"</td>"+
                    "<td>"+value.estado+"</td>"+
                    "<td>"+
                        "<button type='button' class='btn btn-info btnactualizar'"+
                                     "data-idmatricula='"+value.idmatricula+"'"+
                                     "data-idestudiante='"+value.estudiante.idestudiante+"'"+
                                     "data-idgrado='"+value.grado.idgrado+"'"+
                                     "><i class='fas fa-edit'></i></button> " +
                         "<button type='button' class='btn btn-danger btnCambiarEstado'"+
                                                     "data-idmatricula='"+value.idmatricula+"'"+
                                                     "data-nomestudiante='"+value.estudiante.nomestudiante+"'"+
                                                     "data-apeestudiante='"+value.estudiante.apeestudiante+"'"+
                                                     "data-nomgrado='"+value.grado.nomgrado+"'"+
                                                 "><i class='fas fa-trash'></i></button>"+

                    "</td></tr>");
            })
        }
    })
}

function listarCboGrados(idgrado){
    $.ajax({
        type: "GET",
        url: "/grado/listar",
        dataType: "json",
        success: function(resultado){
            $.each(resultado, function(index, value){
                $("#cbogrados").append(
                    `<option value="${value.idgrado}">${value.nomgrado}</option>`
                )
            });
            if(idgrado > 0){
                $("#cbogrados").val(idgrado);
            }
        }
    });
}
function listarCboEstudiantes(idestudiante){
    $.ajax({
        type: "GET",
        url: "/estudiante/listar",
        dataType: "json",
        success: function(resultado){
            $.each(resultado, function(index, value){
                $("#cboestudiantes").append(
                    `<option value="${value.idestudiante}">${value.nomestudiante} ${value.apeestudiante}</option>`
                )
            });
            if(idestudiante > 0){
                $("#cboestudiantes").val(idestudiante);
            }
        }
    });
}

$(document).on("click", ".btnCambiarEstado", function () {
    var idMatricula = $(this).attr("data-idmatricula");
    var nomEstudiante = $(this).attr("data-nomestudiante");
    var apeEstudiante = $(this).attr("data-apeestudiante");

    // Mostrar el modal con el mensaje y opciones
    $("#mensajeModal").text("¿A qué estado desea cambiar la matrícula de " + nomEstudiante + " " + apeEstudiante + "?");
    $("#estadoSelect").val("Completa");
    $("#observacionesDiv").hide();
    $("#observaciones").prop("disabled", true);
    $("#modalCambiarEstado").modal("show");

    // Capturar el clic en el botón "Sí" del modal
    $("#btnConfirmarCambiarEstado").on("click", function () {
        var nuevoEstado = $("#estadoSelect").val();
        var observaciones = $("#observaciones").val();

        // Realizar la llamada AJAX para cambiar el estado
        $.ajax({
            type: "POST",
            url: "/matricula/cambiarEstado",
            data: {
                idmatricula: idMatricula,
                estado: nuevoEstado,
                observaciones: observaciones
            },
            success: function (resultado) {
                if (resultado.respuesta) {
                    listarMatriculas();
                }
                alert(resultado.mensaje);
            }
        });

        // Ocultar el modal después de hacer la llamada
        $("#modalCambiarEstado").modal("hide");

        // Limpiar el campo de observaciones y eliminar el evento clic del botón "Sí"
        $("#observaciones").val("");
        $("#btnConfirmarCambiarEstado").off("click");
    });

    // Capturar el cambio en el combobox para habilitar/deshabilitar la caja de observaciones
    $("#estadoSelect").on("change", function () {
        var seleccionado = $(this).val();
        if (seleccionado === "Cancelada") {
            $("#observacionesDiv").show();
            $("#observaciones").prop("disabled", false);
        } else {
            $("#observacionesDiv").hide();
            $("#observaciones").prop("disabled", true);
        }
    });

    // Capturar el clic en el botón "No" del modal
    $("#modalCambiarEstado").on("hide.bs.modal", function () {
        // Limpiar el campo de observaciones y eliminar el evento clic del botón "Sí"
        $("#observaciones").val("");
        $("#btnConfirmarCambiarEstado").off("click");
        // Eliminar el evento de cambio en el combobox
        $("#estadoSelect").off("change");
    });

});



///////////////////////////////
// Evento de clic para buscar por nombre
$(document).on("click", "#btnbuscarNombre", function() {
    $("#txtBuscarNombre").val("");
    $("#modalFiltrado").modal("show");
});
$(document).on("click", "#btnfiltrarnombre", function() {
    var nombre = $("#txtBuscarNombre").val();
    // Realizar la llamada AJAX para buscar por nombre
    realizarFiltro("nombre", nombre);
    $("#modalFiltrado").modal("hide");
});

// Evento de clic para buscar por apellido
$(document).on("click", "#btnbuscarApellido", function() {
    $("#txtBuscarApellido").val("");
    $("#modalFiltrado2").modal("show");
});
$(document).on("click", "#btnfiltrarapellido", function() {
    var apellido = $("#txtBuscarApellido").val();
    // Realizar la llamada AJAX para buscar por apellido
    realizarFiltro("apellido", apellido);
    $("#modalFiltrado2").modal("hide");
});

// Función para realizar el filtro
function realizarFiltro(tipo, valor) {
    // Determina la URL y el nombre del parámetro en función del tipo de búsqueda
    var url;
    var paramName;
    if (tipo.toLowerCase() === "nombre") {
        url = "/estudiante/buscarPornombre";
        paramName = "nomestudiante";
    } else if (tipo.toLowerCase() === "apellido") {
        url = "/estudiante/buscarPorapellido";
        paramName = "apeestudiante";
    }

    $.ajax({
        type: "GET",
        url: url,
        data: {
            [paramName]: valor
        },
        dataType: "json",
        success: function(resultado) {
            if(resultado.length > 0) {
                $("#tblestudiante > tbody").html("");
                $.each(resultado, function(index, value) {
                    var fechaNacimientoFormateada = moment(value.fechanac).format("DD-MM-YYYY");
                    var fechaCreacionFormateada = moment(value.fechacrea).format("DD-MM-YYYY");

                    $("#tblestudiante > tbody").append("<tr>"+
                        "<td>"+value.nomestudiante+"</td>"+
                        "<td>"+value.apeestudiante+"</td>"+
                        "<td>"+value.email+"</td>"+
                        "<td>"+fechaNacimientoFormateada+"</td>"+
                        "<td>"+
                        "<button type='button' class='btn btn-success btnDetalles'"+
                                   "data-idestudiante='"+value.idestudiante+"'"+
                                   "data-nomestudiante='"+value.nomestudiante+"'"+
                                   "data-apeestudiante='"+value.apeestudiante+"'"+
                                   "data-email='"+value.email+"'"+
                                   "data-telefono='"+value.telefono+"'"+
                                   "data-fechanac='"+value.fechanac+"'"+
                                   "data-direccion='"+value.direccion+"'"+
                                   "data-activo='"+value.activo+"'"+
                                   "><i class='fas fa-info-circle'></i></button> "+
                            "<button type='button' class='btn btn-info btnactualizar'"+
                                "data-idestudiante='"+value.idestudiante+"'"+
                                "data-nomestudiante='"+value.nomestudiante+"'"+
                                "data-apeestudiante='"+value.apeestudiante+"'"+
                                "data-email='"+value.email+"'"+
                                "data-telefono='"+value.telefono+"'"+
                                "data-fechanac='"+value.fechanac+"'"+
                                "data-direccion='"+value.direccion+"'"+
                                "><i class='fas fa-edit'></i></button> "+
                            "<button type='button' class='btn btn-danger btnCambiarEstado'"+
                                "data-idestudiante='"+value.idestudiante+"'"+
                                "data-nomestudiante='"+value.nomestudiante+"'"+
                                "data-apeestudiante='"+value.apeestudiante+"'"+
                                "><i class='fas fa-trash'></i></button>"+
                        "</td></tr>");
                });
            } else {
                alert("No se encontraron estudiantes que contengan '" + valor + "'");
                listarEstudiantes();
            }
        },
        error: function(xhr, status, error) {
            console.error("Error al realizar el filtro:", error);

            // Verifica si el servidor proporcionó un mensaje de error
            var errorMessage = "Mensaje de error no disponible.";
            if (xhr.responseJSON && xhr.responseJSON.message) {
                errorMessage = xhr.responseJSON.message;
            }

            console.error("Detalles del error:", {
                status: status,
                errorMessage: errorMessage,
                xhr: xhr
            });
        }
    });
}




});

