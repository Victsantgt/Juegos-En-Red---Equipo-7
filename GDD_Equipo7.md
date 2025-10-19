
**LABUBU MATCH-UP: Grupo 7**

1. **Miembros** 

**Tinka Armas Martí:** cuenta de github: tinkiita 

**Carla Calvache Amador**: cuenta de github: Scarlex05

**Víctor Santiago Gil Torres**: cuenta de github: Victsantgt

**Daniel Redondo Pascual**: cuenta de github: melmnon

**Enlace al github**: https://github.com/Victsantgt/Juegos-En-Red---Equipo-7

2. **Temática  y especificaciones**

Para esta asignatura se diseñará y programará un **juego de fiestas**. Este género se basa en la comunicación social e interacción de los jugadores. Se les ofrecerá a los participantes mecánicas simples y divertidas, con el objetivo de que todos puedan participar sin importar el nivel o experiencia jugando videojuegos. 

Debido a estas características, el juego sería calificado como un PEGI 3, es decir, apto para todas las edades. En consecuencia, el público objetivo serían familias y grupos de amigos que busquen pasar un rato divertido. Se podrá jugar de manera online, en el buscador de internet. 

3. **Inspiraciones**

Se tomó referencia en uno de los juegos que hicieron conocido el género de juegos de fiesta, el Wii party. Además, se tomará inspiración la saga de Mario Party y juegos más actualizados de este género, como el Overcooked.


<img width="259" height="363" alt="image" src="https://github.com/user-attachments/assets/51897a4f-0fc3-4b46-af8c-e12ee3be87fe" />


***Wii Party (2010)***

<img width="404" height="608" alt="image" src="https://github.com/user-attachments/assets/92ef70b9-778d-4084-b0a2-755a674e2323" />
 
***Mario Party 9 (2012)***

<img width="712" height="399" alt="image" src="https://github.com/user-attachments/assets/e9468616-2851-45a2-9377-bfb8d9c8e8bf" />

***Overcooked (2018)***

5. **Objetivo del juego** 

El objetivo de juego es conseguir disparar la parte trasera de la carroza enemiga a la vez que evitamos que nos disparen a la parte trasera de la nuestra. El primer jugador que consiga disparar un número de tres veces al contrincante, consigue la victoria. 

6. **Mecánicas**  

Cada jugador controla un vagón que avanza de forma automática por raíles en un circuito plano. Para conseguir la victoria, el jugador dispone de las siguientes acciones:

* *Disparo*: disparar proyectiles en trayectoria recta hacia el vagón contrario. Entre cada disparo hay un tiempo de recarga automático. Si el jugador consigue golpear a otro, su personaje lo celebrará y no podrá disparar durante un tiempo.

* *Giro en desvíos*: decidir el momento exacto para cambiar de carril en los cruces de vías, generando oportunidades de ataque o defensa.

* *Protección de diana*: posicionar el vagón estratégicamente en el rail para dificultar la línea de tiro del rival.

* *Power-ups*: habilidades especiales que le darán una ventaja temporal al jugador sobre el oponente. Se activarán automáticamente al recogerlos. Nuestro juego dispondrá de las siguientes:  
  * Turbo: da un pequeño acelerón.  
  * Curación: restaura una vida al jugador.  
  * Item falso: un obstáculo que paraliza al enemigo.  
  * Cambio de sentido: cambia el sentido de la trayectoria del jugador.

La combinación de disparar, elegir giros en el momento adecuado y usar power-ups de forma estratégica define el ritmo de cada partida, fomentando la precisión, la anticipación de movimientos y la toma de decisiones rápidas.

7. **Físicas** 

Los vagones avanzan de manera automática con velocidad constante, salvo casos específicos como el uso de power-ups. El jugador solo controla los cambios de dirección en las intersecciones de raíles. Los participantes siempre avanzan en la misma dirección, salvo si se chocan entre ellos, en cuyo caso sus trayectorias se invierten.

Las balas se disparan en la misma dirección que avanza el jugador, a velocidad constante pero mayor que la velocidad de un jugador.

La velocidad base será menor que la de los jugadores con turbo, y ésta será menor que la velocidad que toman las balas.

8. **Controles**

En versión online, ambos jugadores usarán los controles de jugador 1\. En versión local**:**  
Jugador 1:

* *Elegir dirección en intersecciones: Teclas WASD.* W (arriba), A (izquierda), S (abajo), D (derecha). Las direcciones son las que se ven desde la cámara, no desde la perspectiva del personaje.  
* *Disparo: Espacio*. Aunque el jugador pulse repetidamente la tecla. Las balas solo se dispararán según el tiempo de recarga.

Jugador 2:

* *Elegir dirección en intersecciones: Flechas.* Según su dirección.  
* *Disparo: Enter*. 

9. **Aspectos técnicos** 

La visión del juego se basará en una cámara cenital, es decir, la cámara se ubica directamente por encima del área de juego, proporcionando visión total de este. Debido a estas características, la cámara se encontrará inmóvil para evitar la confusión del jugador.

10. **Descripción del escenario** 

El escenario es un espacio separado con seis arbustos. Estas separaciones se conectan entre ellos y con los bordes mediante un camino de raíles, por el cual el jugador podrá moverse dentro de los límites de este. El espacio de juego está delimitado por unos bordes diegéticos (muros), haciendo que todo el espacio jugable sea visto por el jugador en todo momento. 

<img width="1053" height="591" alt="image" src="https://github.com/user-attachments/assets/946c009f-c978-4257-b31c-9667e100acb3" />

*Diseño del escenario*

11. **Diagrama de flujo** 

<img width="1054" height="619" alt="image" src="https://github.com/user-attachments/assets/1c710e3b-2c6c-42e4-8185-3f3a5c1e945b" />


12. **Descripción visual(uso de colores)/Estilo visual(pixel art,cartoon..)** 

El juego tendrá un estilo visual de pixel art moderno (sin limitación de colores a X bits, manteniendo el tamaño limitado a sprites 8x8, 16x16, 32x32 o 64x64…)

Se deberán hacer varios sprites para cada personaje, al menos uno para cada dirección, junto con una animación de disparo, de celebración, un sprite para la bala/bola de cañón y sprites para menús y escenario.

Se tomaron como inspiración para el estilo gráfico juegos como Stardew Valley o Moonlighter

13. **Bocetos** 

Los labubus han sido rediseñados para hacerlos mas distintivos y fáciles de pasar a pixel art.

Este rediseño se debe principalmente a las proporciones extrañas de los labubu oficiales, las cuales serían difíciles de trabajar en un entorno de altas limitaciones como es el pixel art. Al hacer las extremidades más grandes y al otorgarles más expresividad, se facilita muchísimo el paso a cualquier medio fuera de los peluches originales.  
<img width="780" height="612" alt="image" src="https://github.com/user-attachments/assets/2e2938d1-04f5-4576-b4d7-cb0816c88aac" />
  
*Rediseño de labubus*

Boceto del menú

<img width="1477" height="884" alt="image" src="https://github.com/user-attachments/assets/967a7c71-3b33-49b6-8c6d-27a271c3cd08" />


14. **Logotipo** 

Nuestra empresa se llama “Todo al 7”. El logotipo se creó a aprtir de esa frase, siendo el 7 la parte naranja

<img width="857" height="530" alt="image" src="https://github.com/user-attachments/assets/9724db12-fa20-4a2b-85ac-1bc9436cbd92" />


También, se creó el boceto del logotipo del juego  
<img width="891" height="633" alt="image" src="https://github.com/user-attachments/assets/a359ecaa-8739-4688-8c61-2cc086e0b46c" />


*Boceto del logo de juego*

15. **Música/Efectos sonoros**   
    

El juego contaría con música muy animada que recuerda a la música de concursos de televisión o dibujos animados. Además, el tema sería bastante simple y solo estaría para acompañar al gameplay. Para los menús, el tema tendrá un estilo más de jazz y tranquilo, para contrastar con el resto del juego, mientras que mantiene una personalidad propia. Algunas inspiraciones detrás de la música serían Wii Party o Mario Party, y otros juegos familiares como Mario Kart.

Los efectos de sonido no serían realistas, sino que se buscaría que sean divertidos y estén acorde a la estética del juego y tengan su carácter. La mayoría de efectos se crearían con sintetizadores y chiptune, y al igual que la música, recordará bastante a los efectos de sonido en dibujos animados. Los efectos de sonido tendrían un estilo similar a los de Stardew Valley, Celeste o Undertale.

16.  **Historia y desarrollo de personajes** 

Desde su creación, todo Labubu solo persigue una cosa. Convertirse en el próximo Labubu de 24 quilates. Sin embargo, no es tarea fácil conseguirlo.

Una vez cada 23, casi 24 años, en Dubai se celebran los Sony-C Games, una competición que somete a todos los Labubu del mundo en una fiera competición. Los “Labubuparticipantes” se tendrán que enfrentar a pares en una prueba de honor: montarse en vagonetas tematizadas de té matcha, la bebida nacional de la provincia de Labubulandia, Dubai. La competición consistirá en disparar las preciadas bolas de tapioca al otro Labubu, hasta conseguir echarle de la competición.

Solo el más intrépido, único e inigualable de entre todos los Labubu, se alzará con la victoria y se hará con el oro, es decir, ser bañado en 24 quilates de él.

La historia está inspirada en los memes virales del Labubu de 24 quilates en redes sociales como TikTok o Instagram.

17. **Estrategia de Marketing** 

Hoy en día la mejor estrategia para darse a conocer es el uso de redes sociales. Se crearán cuentas en las plataformas mejor habilitadas para promocionar videojuegos:  X, Instagram, Bluesky, Tik Tok y Gamejolt. Un par de meses antes de la salida del juego, se comenzará a publicar teasers, tráilers y artes oficiales con el fin de establecer una base de fans estable. 

Una vez se saque al público el juego, se enviará claves a streamers los cuales su contenido se alinee con el género de nuestro juego para ampliar la visibilidad.

18. **Referencias**

[Wii Party | Wii | Juegos | Nintendo ES](https://www.nintendo.com/es-es/Juegos/Wii/Wii-Party-283938.html?srsltid=AfmBOooU_-cgLeeGv4ogTXwVT9d2OxXn_FeaTaGkl1MPt5KJbCa3poBD)  
[Tema Principal de Wii Party](https://www.youtube.com/watch?v=fzepGtfHL9A&list=RDfzepGtfHL9A&start_radio=1&pp=ygUUd2lpIHBhcnR5IG1haW4gdGhlbWWgBwE%3D)  
[Estilo artistico de Stardew Valley](https://80.lv/articles/mastering-the-charm-of-low-poly-and-pixel-art-styles)  
[Tema Menú Principal Mario Kart 8 Deluxe](https://www.youtube.com/watch?v=bCOuXEbBfS8&list=PLTY-fHX-ZIGwdsXnDUPhGYLkhvH9TmtXD&index=2)  
[Efectos de sonido de Undertale](https://www.youtube.com/watch?v=dkk6t9iywKA&pp=ygUXdW5kZXJ0YWxlIHNvdW5kIGVmZmVjdHM%3D)  
[TikTok del Labubu de 24 quilates](https://www.tiktok.com/@lilzbullzmarbella2/video/7516255426451623190?lang=es)


