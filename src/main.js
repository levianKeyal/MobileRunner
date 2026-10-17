// Punto de entrada del juego. index.html proporciona el canvas y los controles.
// Game.js coordina el bucle principal y el resto de los módulos de src/.
import { Game } from './Game.js?v=0.10.71';
new Game(document.getElementById('game'));
