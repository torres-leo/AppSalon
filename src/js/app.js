let pagina = 1; //Este es el numero de seccion que muestra al inicio la pagina, en este caso serian los servicios

const cita = {
    nombre: "",
    fecha: "",
    hora: "",
    servicios: [],
};

document.addEventListener("DOMContentLoaded", function () {
    iniciarApp();
});
// Diferencia entre arrow-function y una funcion normal es el this y que una da por implícito el return y la otra no

function iniciarApp() {
    mostrarServicios();

    //resalta el DIV actual segun el tab al que se presiona
    mostrarSeccion();

    //Oculta o muestra una seccion segun el tab al que se presiona
    cambiarSeccion();

    //Paginacion: siguiente - anterior
    paginaSiguiente();
    paginaAnterior();

    //Comprobando la pagina actual para ocultar o mostrar la paginacion
    botonesPaginador();

    //Mostrando resumen de cita o mensaje de error en caso de no pasar la validacion
    mostrarResumen();

    //Almacenando el nombre de la cita en el objeto
    nombreCita();

    //Almacenando la fecha de la cita
    fechaCita();

    //Deshabilitar fecha anterior
    deshabilitarFechaAnterior();

    //Almacenando la hora de la cita en el objeto
    horaCita();
}

function mostrarSeccion() {
    //Eliminar mostrar-seccion de la seccion anterior
    const seccionAnterior = document.querySelector(".mostrar-seccion");
    if (seccionAnterior) {
        seccionAnterior.classList.remove("mostrar-seccion");
    }

    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add("mostrar-seccion");

    //Eliminar la clase de actual en el TAB anterior
    const tabAnterior = document.querySelector(".tabs button.actual");
    if (tabAnterior) {
        tabAnterior.classList.remove("actual");
    }

    //Resaltar el tab actual
    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add("actual");
}

//Cambiando seccion desde los tabs
function cambiarSeccion() {
    const enlaces = document.querySelectorAll(".tabs button");
    enlaces.forEach((enlace) => {
        enlace.addEventListener("click", (e) => {
            e.preventDefault();

            // console.log(e.target.dataset.paso);
            //El valor aparece de tipo string, por lo tanto lo pasaremos a un entero
            //para así no tener problemas en pasar de seccion
            pagina = parseInt(e.target.dataset.paso);

            //Quitamos toda la siguiente seccion porque ya no es necesaria
            //Ya que estamos duplicando una accion que se hace en "mostrarSeccion();"

            // //Agrengando mostrar-seccion donde dimos click
            // const seccion = document.querySelector(`#paso-${pagina}`);
            // seccion.classList.add("mostrar-seccion");

            // //Agregar la clase de actual en el nuevo TAB
            // const tab = document.querySelector(`[data-paso="${pagina}"]`);
            // tab.classList.add("actual");

            mostrarSeccion();
            botonesPaginador();
        });
    });
}

async function mostrarServicios() {
    try {
        const url = "http://localhost:3000/servicios.php";
        const resultado = await fetch(url);
        const db = await resultado.json();

        //console.log(db);
        // console.log(db.servicios);
        //Mandando a imprimir solamente los servicios
        //const { servicios } = db;
        // console.log(servicios);

        //Generando el html
        db.forEach((servicio) => {
            // console.log(servicio);
            const { id, nombre, precio } = servicio;
            //DOM scripting

            //Generar nombre servicio
            const nombreServicio = document.createElement("P");
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add("nombre-servicio");
            // console.log(nombreServicio);

            //Generar el precio del servicio
            const precioServicio = document.createElement("P");
            precioServicio.textContent = `$ ${precio}`;
            precioServicio.classList.add("precio-servicio");
            // console.log(precioServicio);

            //Generar div contenedor de servicio
            const servicioDiv = document.createElement("DIV");
            servicioDiv.classList.add("servicio");
            servicioDiv.dataset.idservicio = id;

            // Seleccionando un servicio
            servicioDiv.onclick = seleccionarServicio;

            //Inyectar precio y nombre al DIV de servicio
            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);

            //Inyectarlo en el HTML
            document.querySelector("#servicios").appendChild(servicioDiv);
        });
    } catch (error) {
        console.log(error);
    }
}

function seleccionarServicio(e) {
    let elemento;
    // console.log(e.target.tagName);

    // const id = e.target.dataset.idservicio;
    // console.log(id);

    //Forzar que el elemento al cual le demos click, sea el DIV
    if (e.target.tagName === "P") {
        elemento = e.target.parentElement;
        // console.log("Click en el parrafo");
        // console.log(e.target.parentElement); // Seleccionando el div que contiene los dos parrafos
    } else {
        // console.log("Click en el DIV");
        elemento = e.target;
    }
    // console.log(elemento.dataset.idservicio); //Esto muestra en consola el numero de id que se selecciona

    if (elemento.classList.contains("seleccionado")) {
        elemento.classList.remove("seleccionado");

        const id = parseInt(elemento.dataset.idservicio);
        eliminarServicio(id);
    } else {
        elemento.classList.add("seleccionado");

        // console.log(elemento.firstElementChild) //Seleccionando el primer hijo del div = primer parrafor
        // console.log(elemento.firstElementChild.textContent) //Accediendo al primer texto que contenga el div
        // console.log(elemento.firstElementChild.nextElementSibling.textContent) //Accediendo al segundo elemento

        const servicioObj = {
            id: parseInt(elemento.dataset.idservicio),
            nombre: elemento.firstElementChild.textContent,
            precio: elemento.firstElementChild.nextElementSibling.textContent,
        };

        // console.log(servicioObj);

        agregarServicio(servicioObj);
    }
}

function eliminarServicio(id) {
    // console.log("Eliminando...", id);
    const { servicios } = cita;
    cita.servicios = servicios.filter((servicio) => servicio.id != id);
    console.log(cita);
}

function agregarServicio(servicioObj) {
    const { servicios } = cita;

    cita.servicios = [...servicios, servicioObj];

    console.log(cita);
}

function paginaSiguiente() {
    const paginaSiguiente = document.querySelector("#siguiente");
    paginaSiguiente.addEventListener("click", () => {
        pagina++;
        console.log(pagina);
        botonesPaginador();
    });
}

function paginaAnterior() {
    const paginaAnterior = document.querySelector("#anterior");
    paginaAnterior.addEventListener("click", () => {
        pagina--;
        console.log(pagina);
        botonesPaginador();
    });
}

//Comprobando la pagina actual para ocultar o mostrar la paginacion

function botonesPaginador() {
    const paginaAnterior = document.querySelector("#anterior");
    const paginaSiguiente = document.querySelector("#siguiente");

    if (pagina === 1) {
        // console.log("El boton anterior no se debe mostrar");
        paginaAnterior.classList.add("ocultar");
    } else if (pagina === 3) {
        paginaSiguiente.classList.add("ocultar");
        paginaAnterior.classList.remove("ocultar");

        //Estamos en la página 3, carga el resumen de la cita
        mostrarResumen();
    } else {
        paginaAnterior.classList.remove("ocultar");
        paginaSiguiente.classList.remove("ocultar");
    }

    mostrarSeccion();
}

function mostrarResumen() {
    //Destructuring
    const { nombre, fecha, hora, servicios } = cita;

    //Seleccionando el div de Resumen = id: paso-3
    const resumenDiv = document.querySelector(".contenido-resumen");

    //Limpiando el HTML previo
    while (resumenDiv.firstChild) {
        resumenDiv.removeChild(resumenDiv.firstChild);
    }

    //Validacion de objetos
    if (Object.values(cita).includes("")) {
        const noServicios = document.createElement("P");
        noServicios.textContent = "Faltan datos de servicios, hora, fecha o nombre";
        noServicios.classList.add("invalidar-cita");

        //Agregar a resumenDiv
        resumenDiv.appendChild(noServicios);

        return;
    }

    const headingCita = document.createElement("H3");
    headingCita.textContent = "Resumen de Cita";

    //Mostrando el resumen
    const nombreCita = document.createElement("P");
    nombreCita.innerHTML = `<span>Nombre:</span> ${nombre}`;

    const fechaCita = document.createElement("P");
    fechaCita.innerHTML = `<span>Fecha:</span> ${fecha}`;

    const horaCita = document.createElement("P");
    horaCita.innerHTML = `<span>Hora:</span> ${hora}`;

    const servicioCita = document.createElement("DIV");
    servicioCita.classList.add("resumen-servicios");

    const headingServicios = document.createElement("H3");
    headingServicios.textContent = "Resumen de servicios";

    servicioCita.appendChild(headingServicios);

    let cantidad = 0; //Para sumar el costo de los servicios
    //Iterando sobre el arreglo de servicio
    servicios.forEach((servicio) => {
        //Asignandole los valores a servicio
        const { nombre, precio } = servicio;
        const contenedorServicio = document.createElement("DIV");
        contenedorServicio.classList.add("contenedor-servicio");

        const textoServicio = document.createElement("P");
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement("P");
        precioServicio.textContent = precio;
        precioServicio.classList.add("precio");

        const totalServicio = precio.split("$"); //Quitandole el simbolo $ al parrafo
        // console.log(parseInt(totalServicio[1].trim())); //Quitando los espacios si es que hay
        // console.log(textoServicio);
        //Colocando texto y precio en el div

        cantidad += parseInt(totalServicio[1].trim());

        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        servicioCita.appendChild(contenedorServicio);
    });
    // console.log(cantidad); //Mostrando el total a pagar

    resumenDiv.appendChild(headingCita);
    resumenDiv.appendChild(nombreCita);
    resumenDiv.appendChild(fechaCita);
    resumenDiv.appendChild(horaCita);

    resumenDiv.appendChild(servicioCita);

    //Mandando a mostrar la suma de todos sus servicios
    const cantidadPagar = document.createElement("P");
    cantidadPagar.classList.add("total");
    cantidadPagar.innerHTML = `<span>Total a pagar:</span> $ ${cantidad}`;
    resumenDiv.appendChild(cantidadPagar);
}

function nombreCita() {
    const nombreInput = document.querySelector("#nombre");

    nombreInput.addEventListener("input", (evt) => {
        const nombreTexto = evt.target.value.trim(); //trim() no toma los espacios en blanco que se digiten al inicio o al final
        // console.log(nombreTexto);

        //Validando que el nombre tenga algo
        if (nombreTexto === "" || nombreTexto.length < 3) {
            mostrarAlerte("Nombre no valido", "error");
        } else {
            const alerta = document.querySelector(".alerta");
            if (alerta) {
                alerta.remove();
            }
            cita.nombre = nombreTexto;

            console.log(cita);
        }
    });
}

function mostrarAlerte(mensaje, tipo) {
    console.log("El mensaje es: ", mensaje);

    //Si hay una alerta, que no se cree otra
    const alertaPrevia = document.querySelector(".alerta");

    if (alertaPrevia) {
        // alertaPrevia.remove();
        return;
    }

    //Eliminar alerta después de 3 segundos
    setTimeout(() => {
        alerta.remove();
    }, 3000);

    const alerta = document.createElement("DIV");
    alerta.textContent = mensaje;
    alerta.classList.add("alerta");

    if (tipo === "error") {
        alerta.classList.add("error");
    }

    //Insertar en el HTML
    const formulario = document.querySelector(".formulario");
    formulario.appendChild(alerta);
}

function fechaCita() {
    const fechaInput = document.querySelector("#fecha");
    fechaInput.addEventListener("input", (evt) => {
        // console.log(evt.target.value);

        const dia = new Date(evt.target.value).getUTCDay();

        // const detalleFecha = {
        //     weekday: "long",
        //     month: "long",
        //     year: "numeric",
        // };
        // console.log(dia.toLocaleDateString("es-ES", detalleFecha));
        if ([0].includes(dia)) {
            evt.preventDefault();
            fechaInput.value = "";
            mostrarAlerte("Seleccionaste domingo, lo cual no es valido", "error");
        } else {
            cita.fecha = fechaInput.value;

            console.log(cita);
        }
    });
}

function deshabilitarFechaAnterior() {
    const inputFecha = document.querySelector("#fecha");
    const fechaActual = new Date();
    const year = fechaActual.getFullYear();
    const mes = fechaActual.getMonth() + 1; //+1 por que empiezan en 0, colocando el +1 empezarán enero en el mes 1
    const dia = fechaActual.getDate() + 1; //+1, por si se quiere evitar que se reserve para el mismo día, sino, se quita el +1

    // Dandole el formato: DD--MM--AAAA
    const fechaDeshabilitar = `${year}-${mes < 10 ? `0${mes}` : mes}-${
        dia < 10 ? `0${dia}` : dia
    }`;

    inputFecha.min = fechaDeshabilitar;
}

function horaCita() {
    const inputHora = document.querySelector("#hora");
    inputHora.addEventListener("input", (evt) => {
        // console.log(evt.target.value);

        const horaCita = evt.target.value;
        const hora = horaCita.split(":");
        // console.log(hora);
        if (hora[0] < 10 || hora[0] > 18) {
            // console.log("Horas no validas");
            mostrarAlerte("Hora no valida", "error");
            setTimeout(() => {
                inputHora.value = "";
            }, 2000);
        } else {
            // console.log("Hora valida");
            cita.hora = horaCita;
            console.log(cita);
        }
    });
}
