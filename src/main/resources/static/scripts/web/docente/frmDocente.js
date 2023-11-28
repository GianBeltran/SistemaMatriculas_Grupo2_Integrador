$(document).ready(function() {

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
    if (!validarCampos()) {
        return; // Detener el proceso si hay errores de validación
    }
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

function validarCampos() {
    // Validar campos aquí y mostrar mensajes de error si es necesario
    var nombre = $("#txtNombreDocente").val();
    var email = $("#txtEmailDocente").val();

    // Verificar campos vacíos
    if (nombre.trim() === '' || email.trim() === '' ) {
        alert("Por favor, complete todos los campos.");
        return false;
    }
    // Validar email
    if (!validarEmail(email)) {
        alert("Por favor, ingrese un email válido con dominio @cibertec.edu.pe");
        return false;
    }
    return true;
}

function validarEmail(email) {
    // Validar el formato del correo electrónico con el dominio específico
    var emailRegex = /^[a-zA-Z0-9._-]+@cibertec\.edu\.pe$/;
    return emailRegex.test(email);
}

$(document).on("click", ".btnCambiarEstado", function() {
    var idDocente = $(this).attr("data-iddocente");
    var nomDocente = $(this).attr("data-nomdocente");

    // Mostrar el modal con el mensaje y opciones
    $("#mensajeModal").text("¿Quieres cambiar el estado de " + nomDocente + " a Inactivo?");
    $("#modalCambiarEstado").modal("show");

    // Capturar el clic en el botón "Sí" del modal
    $("#btnConfirmarCambiarEstado").on("click", function() {
        // Realizar la llamada AJAX para cambiar el estado
        $.ajax({
            type: "POST",
            url: "/docente/cambiarEstado",
            data: {
                iddocente: idDocente,
                estado: "Inactivo"
            },
            success: function(resultado) {
                if (resultado.respuesta) {
                    // Actualizar la lista de docentes después de cambiar el estado
                    listarDocentes();
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


function listarDocentes(){
    $.ajax({
        type: "GET",
        url: "/docente/listar",
        dataType: "json",
        success: function(resultado){
            $("#tbldocente > tbody").html("");
            $.each(resultado, function(index, value){
            var fechaCreacionFormateada = moment(value.fechacrea).format("DD-MM-YYYY");

                $("#tbldocente > tbody").append("<tr>"+
                    "<td>"+value.iddocente+"</td>"+
                    "<td>"+value.nomdocente+"</td>"+
                    "<td>"+value.email+"</td>"+
                    "<td>"+value.activo+"</td>"+
                    "<td>"+fechaCreacionFormateada+"</td>"+
                    "<td>"+
                        "<button type='button' class='btn btn-info btnactualizar'"+
                                     "data-iddocente='"+value.iddocente+"'"+
                                     "data-nomdocente='"+value.nomdocente+"'"+
                                     "data-email='"+value.email+"'"+
                                     "><i class='fas fa-edit'></i></button>"+
                         "<button type='button' class='btn btn-danger btnCambiarEstado'"+
                                                     "data-iddocente='"+value.iddocente+"'"+
                                                     "data-nomdocente='"+value.nomdocente+"'"+
                                                 "><i class='fas fa-trash'></i></button>"+

                    "</td></tr>");
            })
        }
    })
}

});