'use strict';
/* Variables Globales y del DOM */
var jugadorSecreto = null;
var intentosRestantes = 8;
var partidaIniciada = false;
var formInicio = document.getElementById('formulario-inicio');
var inputNombre = document.getElementById('nombre-jugador');
var divError = document.getElementById('mensaje-error');
var pantallaInicio = document.getElementById('pantalla-inicio');
var tableroJuego = document.getElementById('tablero-juego');
var inputBusqueda = document.getElementById('input-busqueda');
var listaAutocompletado = document.getElementById('lista-autocompletado');
/* Funciones de Interfaz */
function mostrarError(mensaje) {
    divError.textContent = mensaje;
    divError.classList.remove('oculto');
}
function ocultarError() {
    divError.textContent = '';
    divError.classList.add('oculto');
}
/* Funciones del Autocompletado */
function seleccionarJugador(evento) {
    if (evento.target.tagName === 'LI') {
        inputBusqueda.value = evento.target.textContent;
        listaAutocompletado.innerHTML = '';
        listaAutocompletado.classList.add('oculto');
    }
}
function renderizarListaAutocompletado(jugadores) {
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
    if (!respuesta.ok) {
        throw new Error('Error al buscar jugadores');
    }
    return respuesta.json();
}
function manejarErrorBusqueda(error) {
    console.log('Error en la búsqueda: ' + error.message);
}
function buscarJugadores(evento) {
    var texto = evento.target.value;
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
    if (!respuesta.ok) {
        throw new Error('Error de red al obtener jugador');
    }
    return respuesta.json();
}
function guardarJugadorSecreto(datos) {
    jugadorSecreto = datos;
    pantallaInicio.classList.add('oculto');
    tableroJuego.classList.remove('oculto');
    console.log('Jugador secreto obtenido: ' + jugadorSecreto.name);
}
function manejarErrorFetch(error) {
    mostrarError('Error de red. No se pudo conectar con el servidor.');
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