$(document).ready(function() {

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
                                                 "><i class='fas fa-trash'></i></button>"+

                    "</td></tr>");
            })
        }
    })
}

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

function llenarModalDetalles(detalles, noEditable) {
    // Limpiar el contenido anterior del modal
    $("#modalDetalles .modal-body").empty();

    var fechaNacimientoFormateada = moment(detalles.fechanac).format("DD-MM-YYYY");
    var fechaCreacionFormateada = moment(detalles.fechacrea).format("DD-MM-YYYY");

    // Crear y agregar elementos HTML al modal para mostrar los detalles
    var detallesHTML = "<ul>";
    detallesHTML += "<li><strong>ID ESTUDIANTE:</strong> " + detalles.idestudiante + "</li>";
    detallesHTML += "<br />"
    detallesHTML += "<li><strong>NOMBRE:</strong> " + detalles.nomestudiante + "</li>";
    detallesHTML += "<li><strong>APELLIDO:</strong> " + detalles.apeestudiante + "</li>";
    detallesHTML += "<li><strong>EMAIL:</strong> " + detalles.email + "</li>";
    detallesHTML += "<li><strong>TELÉFONO:</strong> " + detalles.telefono + "</li>";
    detallesHTML += "<li><strong>FECHA DE NACIMIENTO:</strong> " + fechaNacimientoFormateada + "</li>";
    detallesHTML += "<li><strong>DIRECCIÓN:</strong> " + detalles.direccion + "</li>";
    detallesHTML += "<br />"
    detallesHTML += "<li><strong>ACTIVO:</strong> " + detalles.activo + "</li>";
    detallesHTML += "<li><strong>CREACIÓN DE REGISTRO:</strong> " + fechaCreacionFormateada + "</li>";
    detallesHTML += "</ul>";

    // Agregar detalles al cuerpo del modal
    $("#modalDetalles .modal-body").html(detallesHTML);

    // Mostrar el modal
    $("#modalDetalles").modal("show");
}


$(document).on("click", ".btnDetalles", function () {
    var detalles = {
        idestudiante: $(this).attr("data-idestudiante"),
        nomestudiante: $(this).attr("data-nomestudiante"),
        apeestudiante: $(this).attr("data-apeestudiante"),
        email: $(this).attr("data-email"),
        telefono: $(this).attr("data-telefono"),
        fechanac: $(this).attr("data-fechanac"),
        direccion: $(this).attr("data-direccion"),
        activo: $(this).attr("data-activo"),
        fechacrea: $(this).attr("data-fechacrea"),
    };

    llenarModalDetalles(detalles, true); // true indica que los campos son no editables
});

});

