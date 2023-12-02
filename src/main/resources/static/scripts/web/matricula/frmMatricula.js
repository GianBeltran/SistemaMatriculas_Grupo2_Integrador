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

// Asociar la función al clic del botón de ver detalles (también para elementos futuros)
$(document).on('click', '.btnVerDetalles', function () {
    var idMatricula = $(this).attr('data-idmatricula');
    var idEstudiante = $(this).attr('data-idestudiante');
    var idGrado = $(this).attr('data-idgrado');
    mostrarDetallesMatricula(idMatricula, idEstudiante, idGrado);
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
            var nombreCompletoEstudiante = value.estudiante.nomestudiante + ' ' + value.estudiante.apeestudiante;
            var estadoText;
                  switch (value.estado) {
                       case 0:estadoText = "Pendiente"; break;
                       case 1:estadoText = "Confirmado"; break;
                       case 2:estadoText = "Cancelado"; break;
                  }

                $("#tblmatricula > tbody").append("<tr>"+
                    "<td>"+value.idmatricula+"</td>"+
                    "<td>"+nombreCompletoEstudiante+"</td>"+
                    "<td>"+value.grado.nomgrado+"</td>"+
                    "<td>"+fechaMatriculaFormateada+"</td>"+
                    "<td>"+estadoText+"</td>"+
                    "<td>"+
                        "<button type='button' class='btn btn-success btnVerDetalles'"+
                                      "data-idmatricula='"+value.idmatricula+"'"+
                                      "data-idestudiante='"+value.estudiante.idestudiante+"'"+
                                      "data-idgrado='"+value.grado.idgrado+"'"+
                                      "><i class='fas fa-eye'></i></button> " +
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

$(document).on("click", ".btnCambiarEstado", function() {
    var idMatricula = $(this).attr("data-idmatricula");
    var nomEstudiante = $(this).attr("data-nomestudiante");
    var apeEstudiante = $(this).attr("data-apeestudiante");

    // Mostrar el modal con el mensaje y opciones
    $("#mensajeModal").text("¿A qué estado desea cambiar la matrícula de " + nomEstudiante + " " + apeEstudiante + "?");
    $("#estadoSelect").val("1"); // Por defecto, Confirmar
    $("#observacionesDiv").hide();
    $("#observaciones").prop("disabled", true);
    $("#modalCambiarEstado").modal("show");

    // Capturar el cambio en el combobox para habilitar/deshabilitar la caja de observaciones
    $("#estadoSelect").on("change", function() {
        var seleccionado = $(this).val();
        if (seleccionado === "2") { // 2 = Cancelar
            $("#observacionesDiv").show();
            $("#observaciones").prop("disabled", false);
        } else {
            $("#observacionesDiv").hide();
            $("#observaciones").prop("disabled", true);
        }
    });

    // Capturar el clic en el botón "Sí" del modal
    $("#btnConfirmarCambiarEstado").on("click", function() {
        var nuevoEstado = $("#estadoSelect").val();
        var observaciones = $("#observaciones").val();

        // Realizar la llamada AJAX para cambiar el estado
        $.ajax({
            type: "POST",
            url: "/matricula/cambiarEstado",
            data: {
                idmatricula: idMatricula,
                nuevoEstado: nuevoEstado,
                observaciones: observaciones
            },
            success: function(resultado) {
                if (resultado.respuesta) {
                    listarMatriculas();
                    location.reload();
                }
                alert(resultado.mensaje);
            }
        });

        // Ocultar el modal después de hacer la llamada
        $("#modalCambiarEstado").modal("hide");

        // Limpiar el campo de observaciones y eliminar el evento clic del botón "Sí"
        $("#observaciones").val("");
        $("#btnConfirmarCambiarEstado").off("click");
        // Eliminar el evento de cambio en el combobox
        $("#estadoSelect").off("change");
    });

    // Capturar el clic en el botón "No" del modal
    $("#modalCambiarEstado").on("hide.bs.modal", function() {
        // Limpiar el campo de observaciones y eliminar el evento clic del botón "Sí"
        $("#observaciones").val("");
        $("#btnConfirmarCambiarEstado").off("click");
        // Eliminar el evento de cambio en el combobox
        $("#estadoSelect").off("change");
    });
});

//////////////////////////////////////////////////////////////

function listarCboGradosFiltrado(idgrado){
    $.ajax({
        type: "GET",
        url: "/grado/listar",
        dataType: "json",
        success: function(resultado){
            $.each(resultado, function(index, value){
                $("#cbofiltradogrados").append(
                    `<option value="${value.idgrado}">${value.nomgrado}</option>`
                )
            });
        }
    });
}
function listarCboEstados() {
        var estados = [
            { value: "0", label: "Pendiente" },
            { value: "1", label: "Confirmado" },
            { value: "2", label: "Cancelado" }
        ];

        $.each(estados, function(index, value) {
            $("#cboestado").append(
                `<option value="${value.value}">${value.label}</option>`
            );
        });
    }

// Evento de clic para buscar por grado
    $(document).on("click", "#btnbuscarGrado", function() {
        $("#cbofiltradogrados").empty();
        listarCboGradosFiltrado();
        $("#modalFiltrado").modal("show");
    });
    $(document).on("click", "#btnfiltrargrado", function() {
        var idgrado = $("#cbofiltradogrados").val();
        // Realizar la llamada AJAX para buscar por grado
        realizarFiltro("grado", idgrado);
        $("#modalFiltrado").modal("hide");
    });

    // Evento de clic para buscar por estado
    $(document).on("click", "#btnbuscarEstado", function() {
        $("#cboestado").empty();
        // Llenar el cbo de estados (Pendiente, Confirmado, Cancelado)
        listarCboEstados();
        $("#modalFiltrado2").modal("show");
    });
    $(document).on("click", "#btnfiltrarestado", function() {
        var estado = $("#cboestado").val();
        // Realizar la llamada AJAX para buscar por estado
        realizarFiltro("estado", estado);
        $("#modalFiltrado2").modal("hide");
    });


// Función para realizar el filtro
    function realizarFiltro(tipo, valor) {
        var url;
        var paramName;

        if (tipo.toLowerCase() === "grado") {
            url = "/matricula/buscarPorGrado";
            paramName = "idgrado";
        } else if (tipo.toLowerCase() === "estado") {
            url = "/matricula/buscarPorEstado";
            paramName = "estado";
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
                actualizarTablaMatriculas(resultado);
            } else {
                alert("No se encontraron registros que cumplan con esos requisitos");
                listarMatriculas();
                }
            },
            error: function(xhr, status, error) {
                console.error("Error al realizar el filtro:", error);
                alert("Error al realizar el filtro. Consulta la consola para obtener más detalles.");
            }
        });
    }

    // Función para actualizar la tabla con los resultados del filtro
function actualizarTablaMatriculas(matriculas) {
        // Limpiar la tabla
        $("#tblmatricula > tbody").html("");

        // Llenar la tabla con los resultados del filtro
        $.each(matriculas, function(index, value) {
            // Construir las filas de la tabla con los datos de las matrículas filtradas
            var fechaMatriculaFormateada = moment(value.fechamat).format("DD-MM-YYYY");
            var nombreCompletoEstudiante = value.estudiante.nomestudiante + ' ' + value.estudiante.apeestudiante;
            var estadoText;
                    switch (value.estado) {
                        case 0:estadoText = "Pendiente"; break;
                        case 1:estadoText = "Confirmado"; break;
                        case 2:estadoText = "Cancelado"; break;
                    }

            $("#tblmatricula > tbody").append("<tr>"+
                "<td>"+value.idmatricula+"</td>"+
                "<td>"+nombreCompletoEstudiante+"</td>"+
                "<td>"+value.grado.nomgrado+"</td>"+
                "<td>"+fechaMatriculaFormateada+"</td>"+
                "<td>"+estadoText+"</td>"+
                "<td>"+
                    "<button type='button' class='btn btn-success btnVerDetalles'"+
                        "data-idmatricula='"+value.idmatricula+"'"+
                        "data-idestudiante='"+value.estudiante.idestudiante+"'"+
                        "data-idgrado='"+value.grado.idgrado+"'"+
                        "><i class='fas fa-eye'></i></button> " +
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
        });
    }

// Función para cargar y mostrar los detalles de la matrícula, estudiante y cursos por grado
    function mostrarDetallesMatricula(idMatricula, idEstudiante, idGrado) {
        // Realizar la solicitud AJAX al servidor para obtener los detalles
        $.ajax({
            url: '/matricula/detalles',
            method: 'GET',
            data: {
                idMatricula: idMatricula
            },
            success: function (detalles) {
                // Construir el HTML con los detalles de la matrícula
                var detallesMatriculaHTML =
                    '<strong>DATOS DE LA MATRÍCULA:</strong><br>' +
                    '<span> ‎ ‎ ‎ ‎ ‎ ‎ </span><br>' +
                    '<strong>Grado:</strong> ' + detalles.grado.nomgrado +
                    '<span> ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎  </span>' +
                    '<strong>Fecha de matrícula:</strong> ' + moment(detalles.matricula.fechamat).format("DD-MM-YYYY") +
                    '<span> ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎  </span>' +
                    '<strong>Estado:</strong> ' + obtenerEstadoTexto(detalles.matricula.estado) +
                    '<span> ‎ ‎ ‎ ‎ ‎ ‎ </span><br>' +
                    '<hr>';

                // Construir el HTML con los detalles del estudiante
                var detallesEstudianteHTML =
                    '<strong>DATOS DEL ESTUDIANTE:</strong><br>' +
                    '<span> ‎ ‎ ‎ ‎ ‎ ‎ </span><br>' +
                    '<strong>Estudiante:</strong> ' + detalles.estudiante.nomestudiante + ' ' + detalles.estudiante.apeestudiante +
                    '<span> ‎ ‎ ‎ ‎ ‎ ‎ </span>' +
                    '<strong>Fecha de nacimiento:</strong> ' + moment(detalles.matricula.fechanac).format("DD-MM-YYYY") +
                    '<span> ‎ ‎ ‎ ‎ ‎ </span>' +
                    '<strong>Dirección:</strong> ' + detalles.estudiante.direccion +

                    '<br><strong>Teléfono:</strong> ' + detalles.estudiante.telefono +
                    '<span> ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎  </span>' +
                    '<strong>Email:</strong> ' + detalles.estudiante.email +
                    '<span> ‎ ‎ ‎ ‎ ‎ ‎ </span><br>' +
                    '<hr>';

                // Construir el HTML con la lista de cursos
                var cursosHTML = '<strong>CURSOS:</strong>';
                detalles.cursos.forEach(function (curso) {
                    cursosHTML += '<div> - ‎ ‎' + curso.nomcurso + '</div>';
                });

                // Mostrar los detalles en el modal
                $('#detallesMatricula').html(detallesMatriculaHTML);
                $('#detallesEstudiante').html(detallesEstudianteHTML);
                $('#cursosGrado').html(cursosHTML);

                // Mostrar el modal
                $('#modalDetalle').modal('show');
            },
            error: function () {
                // Manejar errores si es necesario
                alert('Error al obtener detalles de la matrícula.');
            }
        });
    }

    // Función para obtener el texto del estado según el código
    function obtenerEstadoTexto(codigoEstado) {
        switch (codigoEstado) {
            case 0: return 'Pendiente';
            case 1: return 'Confirmado';
            case 2: return 'Cancelado';
            default: return 'Desconocido';
        }
    }

    // Asociar la función al clic del botón de ver detalles
    $('.btnVerDetalles').click(function () {
        var idMatricula = $(this).attr('data-idmatricula');
        var idEstudiante = $(this).attr('data-idestudiante');
        var idGrado = $(this).attr('data-idgrado');
        mostrarDetallesMatricula(idMatricula, idEstudiante, idGrado);
    });


});

