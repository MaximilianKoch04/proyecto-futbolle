'use strict';
/* Variables Globales y del DOM */
var jugadorSecreto = null;
var jugadorSeleccionado = null;
var listaJugadoresBusqueda = [];
var intentosRestantes = 8;
var partidaIniciada = false;
var formInicio = document.getElementById('formulario-inicio');
var inputNombre = document.getElementById('nombre-jugador');
var divError = document.getElementById('mensaje-error');
var pantallaInicio = document.getElementById('pantalla-inicio');
var tableroJuego = document.getElementById('tablero-juego');
var inputBusqueda = document.getElementById('input-busqueda');
var listaAutocompletado = document.getElementById('lista-autocompletado');
var botonAdivinar = document.getElementById('boton-adivinar');
var historialIntentos = document.getElementById('historial-intentos');
var cabeceraAtributos = document.getElementById('cabecera-atributos');
var contadorIntentos = document.getElementById('contador-intentos');
/* Funciones de Interfaz */
function mostrarError(mensaje) {
    divError.textContent = mensaje;
    divError.classList.remove('oculto');
}
function ocultarError() {
    divError.textContent = '';
    divError.classList.add('oculto');
}
/* Funciones de Creación de Elementos */
function crearCajaAtributo(valor, esCorrecto) {
    var div = document.createElement('div');
    div.textContent = valor;
    if (esCorrecto) {
        div.className = 'caja-atributo caja-acierto';
    } else {
        div.className = 'caja-atributo caja-fallo';
    }
    return div;
}
/* Lógica de Intento (Adivinar) */
function finalizarJuego(mensaje) {
    mostrarError(mensaje);
    botonAdivinar.disabled = true;
    inputBusqueda.disabled = true;
}
function procesarIntento() {
    if (!jugadorSeleccionado) {
        mostrarError('Por favor, selecciona un jugador de la lista.');
        return;
    }
    ocultarError();
    cabeceraAtributos.classList.remove('oculto');
    var fila = document.createElement('div');
    fila.className = 'fila-intento';
    fila.appendChild(crearCajaAtributo(jugadorSeleccionado.name, jugadorSeleccionado.name === jugadorSecreto.name));
    fila.appendChild(crearCajaAtributo(jugadorSeleccionado.nation, jugadorSeleccionado.nation === jugadorSecreto.nation));
    fila.appendChild(crearCajaAtributo(jugadorSeleccionado.league, jugadorSeleccionado.league === jugadorSecreto.league));
    fila.appendChild(crearCajaAtributo(jugadorSeleccionado.team, jugadorSeleccionado.team === jugadorSecreto.team));
    fila.appendChild(crearCajaAtributo(jugadorSeleccionado.position, jugadorSeleccionado.position === jugadorSecreto.position));
    fila.appendChild(crearCajaAtributo(jugadorSeleccionado.age, jugadorSeleccionado.age === jugadorSecreto.age));
    fila.appendChild(crearCajaAtributo(jugadorSeleccionado.number, jugadorSeleccionado.number === jugadorSecreto.number));
    historialIntentos.appendChild(fila);
    intentosRestantes--;
    contadorIntentos.textContent = intentosRestantes;
    if (jugadorSeleccionado.name === jugadorSecreto.name) {
        finalizarJuego('¡GANASTE! Has adivinado al jugador secreto.');
    } else if (intentosRestantes === 0) {
        finalizarJuego('GAME OVER. El jugador secreto era: ' + jugadorSecreto.name);
    }
    jugadorSeleccionado = null;
    inputBusqueda.value = '';
}
/* Funciones del Autocompletado */
function seleccionarJugador(evento) {
    if (evento.target.tagName === 'LI') {
        inputBusqueda.value = evento.target.textContent;
        for (var i = 0; i < listaJugadoresBusqueda.length; i++) {
            if (listaJugadoresBusqueda[i].name === evento.target.textContent) {
                jugadorSeleccionado = listaJugadoresBusqueda[i];
                break;
            }
        }
        listaAutocompletado.innerHTML = '';
        listaAutocompletado.classList.add('oculto');
    }
}
function renderizarListaAutocompletado(jugadores) {
    listaJugadoresBusqueda = jugadores;
    listaAutocompletado.innerHTML = '';
    if (jugadores.length === 0) {
        listaAutocompletado.classList.add('oculto');
        return;
    }
    for (var i = 0; i < jugadores.length; i++) {
        var li = document.createElement('li');
        li.textContent = jugadores[i].name;
        listaAutocompletado.appendChild(li);
    }
    listaAutocompletado.classList.remove('oculto');
}
function procesarRespuestaBusqueda(respuesta) {
    if (!respuesta.ok) throw new Error('Error al buscar jugadores');
    return respuesta.json();
}
function manejarErrorBusqueda(error) {
    console.log('Error en la búsqueda: ' + error.message);
}
function buscarJugadores(evento) {
    var texto = evento.target.value;
    jugadorSeleccionado = null;
    if (texto.length < 3) {
        listaAutocompletado.innerHTML = '';
        listaAutocompletado.classList.add('oculto');
        return;
    }
    fetch('https://futbolle-daw-uai-2026.onrender.com/api/players?search=' + texto)
        .then(procesarRespuestaBusqueda)
        .then(renderizarListaAutocompletado)
        .catch(manejarErrorBusqueda);
}
/* Funciones de Servidor (Jugador Secreto) */
function procesarRespuestaFetch(respuesta) {
    if (!respuesta.ok) throw new Error('Error de red al obtener jugador');
    return respuesta.json();
}
function guardarJugadorSecreto(datos) {
    jugadorSecreto = datos;
    pantallaInicio.classList.add('oculto');
    tableroJuego.classList.remove('oculto');
    console.log('Jugador secreto: ' + jugadorSecreto.name);
}
function manejarErrorFetch(error) {
    mostrarError('Error de red. No se pudo conectar.');
}
function obtenerJugadorSecreto() {
    fetch('https://futbolle-daw-uai-2026.onrender.com/api/players/random')
        .then(procesarRespuestaFetch)
        .then(guardarJugadorSecreto)
        .catch(manejarErrorFetch);
}
/* Lógica de Validación y Arranque */
function iniciarPartida(evento) {
    evento.preventDefault();
    var nombreIngresado = inputNombre.value;
    ocultarError();
    if (nombreIngresado.length < 3) {
        mostrarError('El nombre debe tener al menos 3 letras.');
        return;
    }
    partidaIniciada = true;
    obtenerJugadorSecreto();
}
/* Event Listeners */
formInicio.addEventListener('submit', iniciarPartida);
inputBusqueda.addEventListener('input', buscarJugadores);
listaAutocompletado.addEventListener('click', seleccionarJugador);
botonAdivinar.addEventListener('click', procesarIntento);