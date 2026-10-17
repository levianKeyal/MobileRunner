# MobileRunner

Juego 2D de desplazamiento lateral para móviles, hecho con **HTML, CSS y JavaScript (Canvas 2D)**. No necesita Node.js, npm, frameworks ni compilación.

**Jugar:** https://leviankeyal.github.io/MobileRunner/  
**Versión documentada:** v0.10.71

## Inicio rápido

1. Clona o descarga este repositorio.
2. Abre una terminal en la carpeta raíz (donde está `index.html`).
3. Inicia un servidor web local, por ejemplo: `python -m http.server 8000`.
4. Visita `http://localhost:8000/` desde el navegador.

No abras `index.html` directamente mediante `file://`: los módulos ES pueden quedar bloqueados por el navegador.

## Integrar en otra página web

La opción recomendada es un **iframe**, que mantiene los estilos y controles táctiles aislados de la página anfitriona:

```html
<iframe
  src="https://leviankeyal.github.io/MobileRunner/"
  title="MobileRunner"
  allow="autoplay"
  style="width:100%;height:100dvh;border:0;display:block"
></iframe>
```

Para alojar una copia propia, copia `index.html`, `style.css`, `src/` y `assets/` conservando sus rutas relativas; sirve esa carpeta desde una URL HTTPS o un servidor local. También puedes incrustar esa copia con un iframe apuntando a su `index.html`.

**Importante:** el juego usa un lienzo de pantalla completa y CSS global, por lo que no está diseñado como un componente DOM que se inyecte directamente en una página existente. Utiliza un iframe para evitar conflictos de estilos, identificadores y eventos.

Consulta **[INSTRUCCIONES_INTEGRACION.txt](INSTRUCCIONES_INTEGRACION.txt)** para la guía paso a paso, pruebas y solución de problemas.

## Controles

- **A:** saltar; permite doble salto y stomp según el estado del jugador.
- **B:** disparar en 8 direcciones, seleccionando un sector del botón circular. Arrastrar entre sectores permite cambiar la dirección.
- **PAUSA:** opciones de música, efectos y reanudación.
- **Teclado:** espacio o flecha arriba para saltar; X para disparar a la derecha.

El juego está pensado principalmente para teléfonos en orientación vertical.

## Estructura

```text
MobileRunner/
├── index.html             Entrada, HUD, botones y paneles
├── style.css              Diseño adaptable y controles táctiles
├── src/
│   ├── main.js            Punto de entrada: crea Game
│   ├── Game.js            Bucle principal, reglas, colisiones y renderizado
│   ├── Input.js           Entrada táctil y de teclado
│   ├── Player.js          Movimiento y estado del jugador
│   ├── World.js           Desplazamiento y escenario
│   ├── Enemy.js           Enemigos terrestres
│   ├── FlyingEnemy.js     Enemigos voladores
│   ├── AreaBoss.js        Jefe de área
│   ├── Music.js           Música y opciones
│   ├── SoundEffects.js    Efectos de sonido
│   └── ...                Plataformas, partículas, objetos y efectos
└── assets/                Audio y demás recursos
```

## Notas para quien mantenga el juego

- `Game.js` importa los módulos de jugabilidad; `main.js` inicia la partida.
- Los controles y paneles se identifican mediante IDs de `index.html`; si los renombras, actualiza también las referencias JS/CSS.
- Conserva las rutas relativas de `src/` y `assets/`.
- Al publicar cambios, actualiza los parámetros `?v=` de los módulos en `index.html`, `src/main.js` y `src/Game.js` para evitar versiones mezcladas en caché.
- El progreso, récords y ajustes se guardan localmente en el navegador mediante `localStorage`; no se comparten entre dominios ni dispositivos.
- La vibración del teléfono es opcional y depende del navegador; Firefox Android puede no activarla.
- Verifica en Chrome y Firefox para Android, y comprueba que GitHub Pages haya terminado de desplegar antes de probar la nueva versión.

## Recursos de audio y licencias

La música y los efectos de disparo utilizan archivos de terceros en `assets/`. Antes de redistribuir el juego, **revisa los permisos, condiciones de uso y requisitos de atribución** de cada recurso. Las fuentes de referencia del proyecto incluyen Pixabay y ZapSplat. Este repositorio no declara aquí una licencia general para esos archivos.
