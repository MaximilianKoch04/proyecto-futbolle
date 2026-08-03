'use strict';
/* Variables Globales y del DOM */
var jugadorSecreto = null;
var intentosRestantes = 8;
var partidaIniciada = false;
var formInicio = document.getElementById('formulario-inicio');
var inputNombre = document.getElementById('nombre-jugador');
var divError = document.getElementById('mensaje-error');
var pantallaInicio = document.getElementById('pantalla-inicio');
/* Funciones de Interfaz */
function mostrarError(mensaje) {
    divError.textContent = mensaje;
    divError.classList.remove('oculto');
}
function ocultarError() {
    divError.textContent = '';
    divError.classList.add('oculto');
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
    pantallaInicio.classList.add('oculto');
    /* AQUI HAREMOS LA LLAMADA FETCH AL ENDPOINT MAS ADELANTE */
    console.log('Partida iniciada por: ' + nombreIngresado);
}
/* Event Listeners */
formInicio.addEventListener('submit', iniciarPartida);