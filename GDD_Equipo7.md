<details>
<summary><strong>Haz clic aquí para ver el Índice</strong></summary>

<br>

- [1. Miembros del Equipo](#1-miembros-del-equipo)
- [2. Temática y Especificaciones](#2-temática-y-especificaciones)
- [3. Inspiraciones](#3-inspiraciones)
- [4. Objetivo del Juego](#4-objetivo-del-juego)
- [5. Mecánicas](#5-mecánicas)
- [6. Físicas del Juego](#6-físicas-del-juego)
- [7. Controles](#7-controles)
- [8. Aspectos Técnicos](#8-aspectos-técnicos)
- [9. Descripción del Escenario](#9-descripción-del-escenario)
- [10. Diagrama de Flujo](#10-diagrama-de-flujo)
- [11. Estilo Visual y Assets](#11-estilo-visual-y-assets)
- [12. Bocetos](#12-bocetos)
- [13. Logotipo](#13-logotipo)
- [14. Música y Efectos Sonoros](#14-música-y-efectos-sonoros)
- [15. Historia y Desarrollo de Personajes](#15-historia-y-desarrollo-de-personajes)
- [16. Estrategia de Marketing](#16-estrategia-de-marketing)
- [17. Referencias](#17-referencias)

</details>

---

# LABUBU MATCH-UP: Documento de Diseño de Juego (GDD)

## 1\. Miembros del Equipo

| Nombre | GitHub |
| :--- | :--- |
| Tinka Armas Martí | tinkiita |
| Carla Calvache Amador | Scarlex05 |
| Víctor Santiago Gil Torres | Victsantgt |
| Daniel Redondo Pascual | melmnon |

**Enlace al Repositorio:** [https://github.com/Victsantgt/Juegos-En-Red---Equipo-7](https://github.com/Victsantgt/Juegos-En-Red---Equipo-7)

-----

## 2\. Temática y Especificaciones

**Género:** Juego de Fiestas (Party Game).

Este género se centra en la comunicación social y la interacción de los jugadores, ofreciendo mecánicas simples y divertidas para que todos puedan participar, sin importar el nivel o experiencia en videojuegos.

**Clasificación y Público Objetivo:**

  * **PEGI 3:** Apto para todas las edades.
  * **Público:** Familias y grupos de amigos que busquen pasar un rato divertido.
  * **Plataforma:** Online, en el navegador de internet.

-----

## 3\. Inspiraciones

El juego toma referencias de títulos clave en el género:

  * **Juegos de Fiesta Clásicos:** *Wii Party* (2010) y la saga *Mario Party*.
  * **Juegos Modernos de Cooperación/Competición:** *Overcooked*.


<img width="259" height="363" alt="image" src="https://github.com/user-attachments/assets/51897a4f-0fc3-4b46-af8c-e12ee3be87fe" />

Wii Party (2010)

<img width="404" height="608" alt="image" src="https://github.com/user-attachments/assets/92ef70b9-778d-4084-b0a2-755a674e2323" />

Mario Party 9 (2012)

<img width="712" height="399" alt="image" src="https://github.com/user-attachments/assets/e9468616-2851-45a2-9377-bfb8d9c8e8bf" />

Overcooked (2018)

-----

## 4\. Objetivo del Juego

El objetivo es conseguir **disparar a la parte trasera de la carroza enemiga** a la vez que se evita ser disparado en la parte trasera del propio vagón.

El primer jugador que consiga golpear al contrincante un total de **tres veces** se alza con la victoria.

-----

## 5\. Mecánicas

Cada jugador controla un vagón que avanza de forma automática por raíles en un circuito plano.

### Acciones del Jugador

  * **Disparo:**
      * Disparar proyectiles en trayectoria recta hacia el vagón contrario.
      * Existe un tiempo de recarga automático entre disparos.
      * Si el jugador golpea a un oponente, el personaje celebra y no puede disparar durante un breve tiempo.
  * **Parón en desvíos:**
      * El jugador se queda parado en las intersecciones antes de cambiar la dirección.
  * **Giro en desvíos:**
      * El jugador debe de decidir a qué dirección cambiar lo suficientemente rápido para que no le pille el jugador contrincante.
      * Esta acción genera oportunidades de ataque o defensa.
  * **Protección de diana:**
      * Posicionar el vagón estratégicamente en el raíl para dificultar la línea de tiro del rival.

### Power-ups

Habilidades especiales que se activarán automáticamente al recogerlas y darán una ventaja temporal:

  * **Turbo:** Un pequeño acelerón.
  * **Curación:** Restaura una vida al jugador.
  * **Ítem Falso:** Un obstáculo que paraliza al enemigo temporalmente.
  * **Chocolate malévolo** El jugador contrincante pierde una vida.

La combinación de todas estas mecánicas fomenta la precisión, la anticipación de movimientos y la toma de decisiones.

-----

## 6\. Físicas del Juego

| Componente | Movimiento | Reglas de Velocidad |
| :--- | :--- | :--- |
| **Vagones (Jugadores)** | Avanzan de manera automática con velocidad constante, controlando solo los cambios de dirección en las intersecciones | Velocidad base es la más baja. |
| **Colisiones** | Si los vagones se chocan entre ellos, sus trayectorias se invierten. | N/A |
| **Balas** | Se disparan en la misma dirección de avance del jugador. | Velocidad constante y **mayor** que la velocidad máxima de un jugador. |
| **Power-up Turbo** | Aumenta la velocidad del vagón temporalmente. | Velocidad intermedia entre la base y las balas. |

-----

## 7\. Controles

### Versión Online

Ambos jugadores utilizarán los controles del Jugador 1.

### Versión Local

| Acción | Jugador 1 | Jugador 2 | Nota |
| :--- | :--- | :--- | :--- |
| **Elegir Dirección (Intersecciones)** | Teclas **WASD** | **Flechas** | Las direcciones son relativas a la cámara. |
| **Disparo** | Tecla **Shift** | Tecla **Enter** | El disparo se limita al tiempo de recarga, aunque se pulse repetidamente. |

-----

## 8\. Aspectos Técnicos

La visión del juego se basa en una **cámara cenital**, ubicada directamente por encima del área de juego. La cámara se mantendrá **inmóvil** para proporcionar una visión total y evitar la confusión del jugador.

-----

## 9\. Descripción del Escenario

El escenario de juego es un espacio delimitado por bordes diegéticos (muros). El área jugable se compone de un camino de raíles que conecta seis arbustos, permitiendo el movimiento dentro de estos límites. El jugador siempre tendrá una visión completa del espacio de juego.

-imagen escenario-
Diseño del escenario

<img width="742" height="624" alt="image" src="https://github.com/user-attachments/assets/333899b9-bf66-499a-b335-00641c94e695" />
Escenario final

-----

## 10\. Diagrama de Flujo

<img width="1054" height="619" alt="image" src="https://github.com/user-attachments/assets/1c710e3b-2c6c-42e4-8185-3f3a5c1e945b" />

-----

## 11\. Estilo Visual y Assets

### Estilo Visual

El juego utilizará un estilo visual de **Pixel Art Moderno**.

  * **Restricción:** Se mantiene el tamaño limitado a sprites (8x8, 16x16, 32x32 o 64x64).
  * **Colores:** Sin limitación de colores a X bits.
  * **Inspiración:** Se tomaron como inspiración juegos como *Stardew Valley* o *Moonlighter*.

### Assets Finales

Los assets han sido todos finalizados, con un total de cuatro diferentes labubus con animaciones en las cuatro direcciones. El jugador podrá elegir el labubu que más le guste para su elección en el online.
<img width="680" height="220" alt="image" src="https://github.com/user-attachments/assets/a96ea6e5-8868-453e-8706-b4e9891ce2e9" />
Labubus del juego
-----

## 12\. Bocetos

### Rediseño de Personajes (Labubus)

Los Labubus han sido rediseñados para facilitar su adaptación al pixel art, haciéndolos más distintivos y expresivos.

<img width="780" height="612" alt="image" src="https://github.com/user-attachments/assets/2e2938d1-04f5-4576-b4d7-cb0816c88aac" />

Rediseño de labubus

### Boceto de Menú

<img width="1477" height="884" alt="image" src="https://github.com/user-attachments/assets/967a7c71-3b33-49b6-8c6d-27a271c3cd08" />

Boceto del menú principal

-----

## 13\. Logotipo

### Logo de la Empresa: “Todo al 7”

El logotipo se creó a partir de esta frase, siendo el número 7 la parte naranja destacada.

<img width="857" height="530" alt="image" src="https://github.com/user-attachments/assets/9724db12-fa20-4a2b-85ac-1bc9436cbd92" />

Logotipo de la empresa “Todo al 7”

### Boceto del Logo del Juego

<img width="891" height="633" alt="image" src="https://github.com/user-attachments/assets/a359ecaa-8739-4688-8c61-2cc086e0b46c" />

Boceto del logo del juego

Arte de menú final

<img width="713" height="595" alt="image" src="https://github.com/user-attachments/assets/0fe95720-aa43-496f-8a3d-3ce07aeec64c" />


-----

## 14\. Música y Efectos Sonoros

### Música

  * **Gameplay:** Música muy animada, que evoca temas de concursos de televisión o dibujos animados. El tema será simple y estará para acompañar el *gameplay*.
  * **Menús:** Un tema más tranquilo y estilo *jazz* para contrastar y mantener una personalidad propia.
  * **Inspiración:** *Wii Party*, *Mario Party* y *Mario Kart*.

### Efectos de Sonido

  * **Estilo:** No realistas, sino divertidos y acorde a la estética *cartoon*.
  * **Creación:** La mayoría se crearán con sintetizadores y *chiptune*, recordando a los efectos de sonido de dibujos animados.
  * **Inspiración:** Estilo similar a los de *Stardew Valley*, *Celeste* o *Undertale*.

-----

## 15\. Historia y Desarrollo de Personajes

Desde su creación, todo Labubu solo persigue un objetivo: convertirse en el próximo **Labubu de 24 quilates**.

La búsqueda se materializa en los **Sony-C Games**, una competición celebrada en Dubái una vez cada 23-24 años. Los "Labubuparticipantes" se enfrentan en duelos montados en vagonetas tematizadas de té matcha (la bebida nacional de Labubulandia, Dubái). La prueba de honor consiste en disparar bolas de tapioca al oponente hasta echarle de la competición.

Solo el más intrépido, único e inigualable de entre todos los Labubu se alzará con la victoria y será bañado en oro de 24 quilates.

*La historia está inspirada en los memes virales del Labubu de 24 quilates en redes sociales como TikTok o Instagram.*

-----

## 16\. Estrategia de Marketing

La estrategia principal se centrará en el uso de redes sociales:

  * **Plataformas:** X, Instagram, Bluesky, TikTok y Gamejolt.
  * **Pre-lanzamiento (Meses antes):** Publicación de *teasers*, *tráilers* y artes oficiales para establecer una base de fans estable.
  * **Lanzamiento:** Envío de claves a *streamers* cuyo contenido se alinee con el género del juego para ampliar la visibilidad.

-----

## 17\. Implementación API REST

*VILTOL

-----

## 18\. Implementación WebSockets

*VILTOL

-----

## 19\. Referencias

  * **Wii Party | Wii | Juegos | Nintendo ES:** [https://www.nintendo.com/es-es/Juegos/Wii/Wii-Party-283938.html?srsltid=AfmBOooU\_-cgLeeGv4ogTXwVT9d2OxXn\_FeaTaGkl1MPt5KJbCa3poBD](https://www.nintendo.com/es-es/Juegos/Wii/Wii-Party-283938.html?srsltid=AfmBOooU_-cgLeeGv4ogTXwVT9d2OxXn_FeaTaGkl1MPt5KJbCa3poBD)
  * **Tema Principal de Wii Party:** [https://www.youtube.com/watch?v=fzepGtfHL9A\&list=RDfzepGtfHL9A\&start\_radio=1\&pp=ygUUd2lpIHBhcnR5IG1haW4gdGhlbWWgBwE%3D](https://www.youtube.com/watch?v=fzepGtfHL9A&list=RDfzepGtfHL9A&start_radio=1&pp=ygUUd2lpIHBhcnR5IG1haW4gdGhlbWWgBwE%3D)
  * **Estilo artístico de Stardew Valley:** [https://80.lv/articles/mastering-the-charm-of-low-poly-and-pixel-art-styles](https://80.lv/articles/mastering-the-charm-of-low-poly-and-pixel-art-styles)
  * **Tema Menú Principal Mario Kart 8 Deluxe:** [https://www.youtube.com/watch?v=bCOuXEbBfS8\&list=PLTY-fHX-ZIGwdsXnDUPhGYLkhvH9TmtXD\&index=2](https://www.youtube.com/watch?v=bCOuXEbBfS8&list=PLTY-fHX-ZIGwdsXnDUPhGYLkhvH9TmtXD&index=2)
  * **Efectos de sonido de Undertale:** [https://www.youtube.com/watch?v=dkk6t9iywKA\&pp=ygUXdW5kZXJ0YWxlIHNvdW5kIGVmZmVjdHM%3D](https://www.youtube.com/watch?v=dkk6t9iywKA&pp=ygUXdW5kZXJ0YWxlIHNvdW5kIGVmZmVjdHM%3D)
  * **TikTok del Labubu de 24 quilates:** [https://www.tiktok.com/@lilzbullzmarbella2/video/7516255426451623190?lang=es](https://www.tiktok.com/@lilzbullzmarbella2/video/7516255426451623190?lang=es)
