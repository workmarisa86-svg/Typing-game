/* D' Keys to Escaping — Stage 2 data: capitals, Spanish, numbers & symbols, shop, Spanish facts */
'use strict';

// ---------- Spanish names for the Stage 1 lessons & worlds ----------
const LESSON_NAMES_ES = ['F y J', 'D y K', 'S y L', 'A y ;', 'G y H', 'E e I', 'R y U', 'T e Y', 'W y O', 'Q y P',
  'C y M', 'V y N', 'X y coma', 'Z y punto', 'B', 'Repaso mixto'];
LESSON_NAMES_ES.forEach((n, i) => { LESSONS[i].nameEs = n; });
const STAGE_NAMES_ES = ['Letras sueltas', 'Combinaciones', 'Palabras reales', 'Frases cortas'];
const WORLD_TEXT_ES = {
  forest: ['Bosque Susurrante', '¡Un lobo gris te sigue!'],
  jungle: ['Selva de Cocos', '¡Llueven cocos!'],
  savanna: ['Sabana Dorada', 'El felino más rápido quiere una carrera.'],
  cliffs: ['Acantilados Temblorosos', 'Agárrate fuerte: los acantilados se desmoronan.'],
  cave: ['Cuevas del Eco', '¡Caen rocas del techo de la cueva!'],
  snow: ['Picos de Avalancha', '¡Una avalancha baja por la montaña!'],
  summit: ['Cumbre de Escape', 'Todo lo que aprendiste, a la vez.']
};

// ---------- Stage 2 lessons (appended after the 16 Stage 1 lessons) ----------
const L2 = LESSONS.length;
LESSONS.push(
  { keys: 'QWERTASDFGZXCVB'.split(''), name: 'Capitals: left hand', nameEs: 'Mayúsculas: mano izquierda', caps: true },
  { keys: 'YUIOPHJKLNM'.split(''), name: 'Capitals: right hand', nameEs: 'Mayúsculas: mano derecha', caps: true },
  { keys: [], name: 'Capitals review', nameEs: 'Repaso de mayúsculas', review: true, caps: true },
  { keys: ['ñ'], name: 'Set up US-International', nameEs: 'Configura EE. UU. Internacional', setup: true, spanish: true },
  { keys: ['ñ'], extra: ['Ñ'], name: 'Ñ with ~ then N', nameEs: 'Ñ con ~ y luego N', spanish: true },
  { keys: ['á', 'é', 'í', 'ó', 'ú'], extra: ['Á', 'É', 'Í', 'Ó', 'Ú'], name: "Accents with ' then a vowel", nameEs: "Acentos con ' y luego la vocal", spanish: true },
  { keys: ['ü', '¿', '¡'], extra: ['Ü'], name: 'Ü, ¿ and ¡', nameEs: 'Ü, ¿ y ¡', spanish: true },
  { keys: [], name: 'Spanish review', nameEs: 'Repaso de español', review: true, spanish: true },
  { keys: ['1', '2', '3', '4', '5'], name: 'Numbers 1 to 5', nameEs: 'Números del 1 al 5', numbers: true },
  { keys: ['6', '7', '8', '9', '0'], name: 'Numbers 6 to 0', nameEs: 'Números del 6 al 0', numbers: true },
  { keys: [], name: 'Numbers review', nameEs: 'Repaso de números', review: true, numbers: true },
  { keys: ['!', '@', '#', '$', '%'], name: '! @ # $ %', nameEs: '! @ # $ %', symbols: true },
  { keys: ['^', '&', '*', '(', ')'], name: '^ & * ( )', nameEs: '^ & * ( )', symbols: true },
  { keys: ['-', '_', '=', '+'], name: '- _ = +', nameEs: '- _ = +', symbols: true },
  { keys: [':', "'", '"'], name: ": ' \"", nameEs: ": ' \"", symbols: true },
  { keys: ['?', '/', '<', '>'], name: '? / < >', nameEs: '? / < >', symbols: true },
  { keys: ['[', ']', '{', '}', '\\', '|', '`', '~'], name: '[ ] { } \\ | ` ~', nameEs: '[ ] { } \\ | ` ~', symbols: true },
  { keys: [], name: 'Symbols review', nameEs: 'Repaso de símbolos', review: true, symbols: true }
);
WORLDS.push(
  { id: 'castle', name: 'Capital Castle', lessons: [L2, L2 + 1, L2 + 2], mix: ['chase', 'falling', 'chase', 'boulder'],
    chaser: 'bear', faller: 'rock', theme: 'castle', blurb: 'A grumpy bear guards the castle road. Shift into high gear!' },
  { id: 'plaza', name: 'Sunny Plaza', lessons: [L2 + 3, L2 + 4, L2 + 5, L2 + 6, L2 + 7], mix: ['chase', 'falling', 'chase', 'vine'],
    chaser: 'bull', faller: 'orange', theme: 'plaza', blurb: 'Learn Spanish letters while a bull charges!', spanishOnly: true },
  { id: 'volcano', name: 'Number Volcano', lessons: [L2 + 8, L2 + 9, L2 + 10], mix: ['chase', 'falling', 'chase', 'boulder'],
    chaser: 'lava', faller: 'lavarock', theme: 'volcano', blurb: 'Lava is flowing! Numbers keep you ahead.', laptopOnly: true },
  { id: 'storm', name: 'Symbol Storm', lessons: [L2 + 11, L2 + 12, L2 + 13, L2 + 14, L2 + 15, L2 + 16, L2 + 17], mix: ['chase', 'falling', 'chase', 'chase'],
    chaser: 'panther', faller: 'hail', theme: 'storm', blurb: 'A shadow panther hunts in the storm. Master every symbol!', laptopOnly: true }
);
Object.assign(WORLD_TEXT_ES, {
  castle: ['Castillo Capital', 'Un oso gruñón vigila el camino. ¡Usa Shift!'],
  plaza: ['Plaza del Sol', '¡Aprende las letras del español mientras corre un toro!'],
  volcano: ['Volcán de Números', '¡Fluye la lava! Los números te mantienen adelante.'],
  storm: ['Tormenta de Símbolos', 'Una pantera de sombra caza en la tormenta.']
});

// ---------- Spanish words & sentences (all lowercase; accents and ñ are correct) ----------
const WORDS_ES = (
  'a al da das la las sal sala salas salsa falda faldas alas lado dad ' +
  'casa cosa caso cara cada cama campo cielo calle carta comer correr cueva cuerda camino ' +
  'perro gato sol luna mar agua fuego tierra nube viento lobo oso toro piedra roca nieve selva bosque ' +
  'saltar subir escapar tecla teclas teclado dedo dedos mano manos fuerte grande mesa silla libro ' +
  'hola adiós amigo amiga feliz rojo azul verde negro blanco gris alto bajo largo corto nuevo viejo ' +
  'uno dos tres cinco seis siete ocho nueve diez cien mil ' +
  'pan leche queso fruta flor hoja hojas rama ramas monte isla playa ola olas puerto barco tren ' +
  'hora hoy ayer noche tarde semana mes casa puerta ventana pared techo suelo escuela ' +
  'juego juegos jugar ganar subir bajar mirar pensar sabe sabes quiere puede tiene tienes hace ' +
  'sin con por para pero como cuando donde que quien todo toda todos nada algo mucho poco ' +
  'gente padre madre hermano hermana hijo hija abuelo abuela primo prima ' +
  'pez peces ave aves tigre zorro mono cebra jirafa ' +
  'año años niño niña niños señor señora mañana montaña montañas baño caña sueño otoño piña uña uñas ' +
  'araña cariño compañero compañera dueño leña pequeño pequeña español española señal ' +
  'también está están café papá mamá sofá jamás después inglés francés árbol árboles lápiz fácil difícil ' +
  'rápido rápida música número página teléfono sílaba último corazón canción camión ratón león jardín ' +
  'lección acción día días río frío tío tía país maíz aquí allí sí así más él tú mí qué quién cómo cuándo dónde cuál ' +
  'pingüino pingüinos cigüeña vergüenza bilingüe agüita'
).split(/\s+/).filter((w, i, a) => w && a.indexOf(w) === i);

const SENTENCES_ES = [
  'la sala es azul.', 'el perro corre.', 'mi gato duerme en la cama.', 'la luna sale de noche.',
  'el lobo tiene hambre.', 'sube por la cuerda.', 'corre por el camino.', 'la nieve cae del cielo.',
  'el sol brilla hoy.', 'salta sobre el agua.', 'toma la piedra y sigue.', 'el oso busca miel.',
  'una roca cae de la cueva.', 'las aves vuelan alto.', 'el fuego es rojo.', 'mira la pantalla, no las teclas.',
  'pon los dedos en la fila central.', 'el toro corre detrás de ti.', 'la casa tiene una puerta verde.',
  'el viento mueve las hojas.', 'la playa tiene olas grandes.', 'el tren sale de noche.',
  'el niño tiene un año más.', 'mañana vamos al río.', '¿dónde está mi teclado?', '¡corre más rápido!',
  'el pingüino nada en el agua fría.', 'la araña sube por la pared.', '¿qué hora es?', '¡qué día tan bonito!',
  'el señor come una piña.', 'la canción es muy fácil.', 'mi compañero escribe en español.',
  'el león corre detrás de ti.', '¿cuándo llega el tren?', 'la montaña tiene mucha nieve.',
  '¡no te rindas nunca!', 'el árbol está junto al camino.', 'la cigüeña vuela sobre la casa.',
  'el ratón está en el jardín.', 'escribe sin mirar el teclado.', 'cada lección te hace más rápido.'
];

const NAMES = {
  en: ['Ana', 'Ben', 'Carl', 'Dora', 'Emma', 'Finn', 'Grace', 'Hugo', 'Iris', 'Jack', 'Kate', 'Leo', 'Mia', 'Nora', 'Owen',
    'Paul', 'Quinn', 'Rosa', 'Sam', 'Tess', 'Vera', 'Will', 'Zoe', 'Texas', 'Paris', 'Rome', 'Ohio', 'Lima', 'Oslo'],
  es: ['Ana', 'Beto', 'Carla', 'Diego', 'Elena', 'Felipe', 'Gloria', 'Hugo', 'Inés', 'Jorge', 'Karla', 'Luis', 'María',
    'Nicolás', 'Óscar', 'Pablo', 'Quique', 'Rosa', 'Sofía', 'Tomás', 'Úrsula', 'Valeria', 'Ximena', 'Yolanda', 'Zoe',
    'México', 'Perú', 'Chile', 'España', 'Bogotá', 'Lima']
};

// sentence templates for the number world: {n} 2-3 digits, {d} one digit, {y} a year
const NUMBER_TEMPLATES = {
  en: ['{n} wolves ran {n} miles.', 'room {n} is on floor {d}.', 'i have {d} keys and {n} coins.',
    'the code {y} opens the door.', 'level {d} has {n} rocks.', 'we need {n} more steps.', 'add {n} and {n} to get more.',
    'the bus leaves at {d} and {d}.', 'my code is {n}{n}.', 'there are {n} trees and {d} lakes.'],
  es: ['{n} lobos corren {n} metros.', 'la sala {n} está en el piso {d}.', 'tengo {d} llaves y {n} monedas.',
    'el código {y} abre la puerta.', 'el nivel {d} tiene {n} rocas.', 'faltan {n} pasos más.', 'suma {n} y {n}.',
    'el bus sale a las {d}.', 'mi código es {n}{n}.', 'hay {n} árboles y {d} lagos.']
};
// real-life snippets for each symbol
const SYMBOL_SNIPS = {
  en: {
    '!': ['wow!', 'run!', 'yes!', 'go!'], '@': ['me@home.com', '@team', 'tom@mail.org'], '#': ['#1', '#tag', 'room #7'],
    '$': ['$5', '$20', '$99'], '%': ['50%', '99%', '10%'], '^': ['2^3', 'x^2'], '&': ['you & me', 'salt & pepper', 'R&D'],
    '*': ['*star*', '5*5', 'a*b'], '(': ['(yes)', '(run)', '(ok)'], ')': ['(yes)', '(go)', 'f(x)'],
    '-': ['well-known', 'up-to-date', 'x-ray'], '_': ['my_file', 'snake_case', 'top_score'], '=': ['x = 5', 'a=b', '2+2=4'],
    '+': ['2 + 2', 'A+', 'c++'], ':': ['note:', 'time: 9', 'ratio 1:2'], "'": ["don't", "it's", "we're", "can't"],
    '"': ['"hi"', '"run!"', '"yes"'], '?': ['why?', 'ready?', 'who?'], '/': ['and/or', '1/2', 'yes/no'],
    '<': ['3 < 5', 'a<b'], '>': ['9 > 2', '->'], '[': ['[ok]', '[1]'], ']': ['[ok]', 'a[2]'], '{': ['{x}', '{ }'], '}': ['{y}', '{a}'],
    '\\': ['C:\\games', 'a\\b'], '|': ['a|b', 'yes | no'], '`': ['`code`', '`x`'], '~': ['~5 min', '~/home']
  },
  es: {
    '!': ['¡vamos!', '¡sí!', '¡ya!'], '@': ['yo@casa.com', '@equipo', 'ana@correo.org'], '#': ['#1', '#tema', 'sala #7'],
    '$': ['$5', '$20', '$99'], '%': ['50%', '99%', '10%'], '^': ['2^3', 'x^2'], '&': ['tú & yo', 'sal & pimienta'],
    '*': ['*estrella*', '5*5'], '(': ['(sí)', '(corre)', '(ok)'], ')': ['(sí)', '(ya)', 'f(x)'],
    '-': ['bien-hecho', 'rayos-x'], '_': ['mi_archivo', 'top_puntos'], '=': ['x = 5', 'a=b', '2+2=4'],
    '+': ['2 + 2', 'A+'], ':': ['nota:', 'hora: 9', 'razón 1:2'], "'": ["'hola'", "'sí'"],
    '"': ['"hola"', '"¡corre!"', '"sí"'], '?': ['¿por qué?', '¿listo?', '¿quién?'], '/': ['y/o', '1/2', 'sí/no'],
    '<': ['3 < 5', 'a<b'], '>': ['9 > 2', '->'], '[': ['[ok]', '[1]'], ']': ['[ok]', 'a[2]'], '{': ['{x}', '{ }'], '}': ['{y}', '{a}'],
    '\\': ['C:\\juegos', 'a\\b'], '|': ['a|b', 'sí | no'], '`': ['`código`', '`x`'], '~': ['~5 min', '~/casa']
  }
};

// ---------- Wardrobe shop ----------
const EXTRA_COLORS = ['#f2c14e', '#9ccc65', '#80cbc4', '#5c6bc0', '#ad1457', '#6d8b3a', '#b39ddb', '#ff8a65', '#455a64', '#a1887f', '#ffffff', '#212121'];
const COLOR_PRICE = 40;
// price = coins to buy; unlock = levels won before it can be worn (hats & accessories)
const SHOP = {
  male: {
    top: [
      { id: 'sweater', en: 'Knit sweater', es: 'Suéter de punto', price: 100 },
      { id: 'vest', en: 'Sweater vest', es: 'Chaleco de punto', price: 120 },
      { id: 'flannel', en: 'Flannel shirt', es: 'Camisa de franela', price: 150 },
      { id: 'coat', en: 'Long coat', es: 'Abrigo largo', price: 220 }
    ],
    bottom: [
      { id: 'chinos', en: 'Chinos', es: 'Pantalón chino', price: 80 },
      { id: 'work', en: 'Work pants', es: 'Pantalón de trabajo', price: 120 }
    ],
    hat: [
      { id: 'cap', en: 'Baseball cap', es: 'Gorra', unlock: 3 },
      { id: 'beanie', en: 'Beanie', es: 'Gorro de lana', unlock: 8 },
      { id: 'explorer', en: 'Explorer hat', es: 'Sombrero explorador', unlock: 15 },
      { id: 'flatcap', en: 'Flat cap', es: 'Boina plana', unlock: 25 },
      { id: 'winter', en: 'Winter hat', es: 'Gorro de invierno', unlock: 40 }
    ],
    acc: [
      { id: 'backpack', en: 'Backpack', es: 'Mochila', unlock: 5 },
      { id: 'scarf', en: 'Striped scarf', es: 'Bufanda a rayas', unlock: 12 },
      { id: 'watch', en: 'Wristwatch', es: 'Reloj', unlock: 20 },
      { id: 'glasses', en: 'Square glasses', es: 'Gafas cuadradas', unlock: 30 }
    ]
  },
  female: {
    top: [
      { id: 'fsweater', en: 'Long knit sweater', es: 'Suéter largo', price: 100 },
      { id: 'fvest', en: 'Knit vest & blouse', es: 'Chaleco y blusa', price: 120 },
      { id: 'peacoat', en: 'Peacoat', es: 'Chaquetón', price: 180 },
      { id: 'longcoat', en: 'Long coat', es: 'Abrigo largo', price: 220 }
    ],
    bottom: [
      { id: 'tiered', en: 'Tiered long skirt', es: 'Falda larga de volantes', price: 120 },
      { id: 'denim', en: 'Long denim skirt', es: 'Falda larga vaquera', price: 120 }
    ],
    hat: [
      { id: 'headband', en: 'Headband', es: 'Diadema', unlock: 3 },
      { id: 'sunhat', en: 'Sun hat', es: 'Sombrero de sol', unlock: 8 },
      { id: 'pompom', en: 'Pom-pom beanie', es: 'Gorro con pompón', unlock: 15 },
      { id: 'headscarf', en: 'Headscarf', es: 'Pañuelo', unlock: 25 },
      { id: 'beret', en: 'Beret', es: 'Boina', unlock: 40 }
    ],
    acc: [
      { id: 'hairclip', en: 'Flower clip', es: 'Pinza de flor', unlock: 5 },
      { id: 'fscarf', en: 'Soft scarf', es: 'Bufanda suave', unlock: 12 },
      { id: 'bracelet', en: 'Bracelet', es: 'Pulsera', unlock: 20 },
      { id: 'roundglasses', en: 'Round glasses', es: 'Gafas redondas', unlock: 30 }
    ]
  }
};
const REVIVE_COST = 30;

// ---------- "¿Sabías que...?" — Spanish versions of the typing facts (same order as FACTS) ----------
const FACTS_ES = [
  'La palabra inglesa TYPEWRITER («máquina de escribir») se puede escribir usando solo la fila superior de letras de un teclado QWERTY.',
  'Las palabras inglesas PROPRIETOR, PERPETUITY y REPERTOIRE también se pueden escribir solo con la fila superior.',
  'Las palabras ALFALFA y FLASKS se pueden escribir usando solo las teclas de la fila central.',
  'STEWARDESSES es una de las palabras inglesas comunes más largas que se pueden escribir solo con la mano izquierda en QWERTY.',
  'La palabra inglesa LOLLIPOP se puede escribir usando solo la mano derecha en un teclado QWERTY.',
  'El teclado QWERTY recibe su nombre de las seis primeras letras de la fila superior: Q, W, E, R, T, Y.',
  'QWERTY fue desarrollado por Christopher Latham Sholes en la década de 1870 para su máquina de escribir.',
  'Sholes trabajó en su máquina de escribir junto con Carlos Glidden y Samuel Soule.',
  'La máquina Sholes and Glidden, vendida desde 1874, es conocida como la primera máquina de escribir con éxito comercial.',
  'La máquina Sholes and Glidden solo podía escribir letras mayúsculas.',
  'La máquina Sholes and Glidden la fabricó E. Remington and Sons, una empresa conocida también por fabricar armas y máquinas de coser.',
  'La máquina Remington No. 2 de 1878 añadió una tecla Shift para escribir mayúsculas y minúsculas con una sola máquina.',
  'La tecla Shift («cambiar») se llama así porque en las máquinas de escribir desplazaba físicamente el mecanismo para imprimir otro carácter.',
  'Mark Twain tuvo una de las primeras máquinas de escribir y se le atribuye ser uno de los primeros autores en entregar un manuscrito mecanografiado.',
  'La mayoría de los teclados tienen pequeños relieves en las teclas F y J para encontrar la fila central sin mirar.',
  'La fila central de un teclado QWERTY es A S D F G H J K L y el punto y coma.',
  'En la mecanografía al tacto, cada dedo se encarga de su propio grupo de teclas.',
  'Los dedos índices son los que más letras cubren: seis letras cada uno en un teclado QWERTY.',
  'El índice izquierdo cubre R, T, F, G, V y B en la mecanografía al tacto.',
  'El índice derecho cubre Y, U, H, J, N y M en la mecanografía al tacto.',
  'El meñique izquierdo se encarga de Q, A y Z en la mecanografía al tacto.',
  'En la mecanografía al tacto, los pulgares pulsan la barra espaciadora.',
  'Mecanografiar al tacto significa escribir sin mirar las teclas, usando la memoria muscular.',
  'Buscar cada tecla una por una se suele llamar escribir «con dos dedos» (en inglés, «hunt and peck»).',
  'A Frank Edward McGurrin se le atribuye popularizar la mecanografía al tacto tras ganar un famoso concurso en Cincinnati en 1888.',
  'La velocidad de escritura se suele medir en palabras por minuto (PPM, o WPM en inglés).',
  'En las pruebas de mecanografía, una «palabra» cuenta como cinco caracteres, incluidos los espacios.',
  'Las PPM netas restan los errores de tu velocidad, así que la precisión importa mucho.',
  'Un estudio de 2018 de la Universidad Aalto con unos 168 000 voluntarios encontró una velocidad media de unas 52 palabras por minuto.',
  'Barbara Blackburn apareció en el Libro Guinness de los Récords como la mecanógrafa más rápida en inglés, y usaba un teclado Dvorak.',
  'El teclado Dvorak simplificado fue patentado por August Dvorak y William Dealey en 1936.',
  'En el teclado Dvorak, las cinco vocales A, O, E, U e I están en el lado izquierdo de la fila central.',
  'La distribución de teclado Colemak fue publicada en 2006 por Shai Coleman.',
  'Colemak deja atajos comunes como Z, X, C y V en el mismo lugar que QWERTY.',
  'La distribución AZERTY se usa en Francia y Bélgica.',
  'La distribución QWERTZ, que intercambia la Y y la Z, se usa en Alemania, Austria y Suiza.',
  'Un pangrama es una frase que usa todas las letras del alfabeto al menos una vez.',
  '«The quick brown fox jumps over the lazy dog» es un famoso pangrama inglés usado para probar máquinas de escribir y teclados.',
  'La E es la letra más común en los textos en inglés.',
  'En QWERTY, las letras tan comunes E y T están en la fila superior, no en la central.',
  'Al escribir en inglés, la barra espaciadora suele ser la tecla más pulsada.',
  'La barra espaciadora es la tecla más grande de un teclado estándar.',
  'En un teclado QWERTY, al escribir en inglés se usa un poco más la mano izquierda que la derecha.',
  'Una historia popular dice que QWERTY se ordenó para evitar atascos de las barras de la máquina; los historiadores aún debaten las razones exactas.',
  'La tecla Enter aún se llama Return en muchos teclados, por el «retorno de carro» de las máquinas de escribir.',
  'El carro de la máquina de escribir sujetaba el papel y se movía al escribir; había que empujarlo de vuelta para empezar una línea nueva.',
  'Muchas máquinas de escribir hacían sonar una campanita para avisar que se acercaba el final de la línea.',
  'Muchas máquinas antiguas no tenían tecla para el número 1; se usaba una L minúscula.',
  'Algunas máquinas antiguas tampoco tenían tecla para el cero, así que se usaba una O mayúscula.',
  'En muchas máquinas antiguas, el signo de exclamación se hacía con un apóstrofo, retroceso y un punto.',
  'En una máquina de escribir, la tecla de retroceso solo movía el carro un espacio atrás; no borraba nada.',
  'La tecla Tab viene del «tabulador» de las máquinas de escribir, que ayudaba a alinear columnas en tablas.',
  'Las máquinas de escribir tenían un «bloqueo de mayúsculas», el antepasado de la tecla Bloq Mayús.',
  'A Bob Bemer, científico de la computación, se le atribuye la creación del carácter Escape en 1960.',
  'Ctrl+Alt+Supr fue creado por el ingeniero de IBM David Bradley.',
  'A Larry Tesler se le atribuye popularizar la idea de cortar, copiar y pegar en la edición por computadora.',
  'Ctrl+Z (o Comando+Z en una Mac) es el atajo común para deshacer.',
  'La tecla Fn de muchas portátiles activa funciones extra impresas en otras teclas.',
  'Bloq Despl (Scroll Lock) se creó para que las flechas desplazaran la pantalla en vez de mover el cursor.',
  'La tecla Insert alterna entre insertar texto y escribir encima del texto en muchos programas.',
  'Un teclado estadounidense de tamaño completo tiene 104 teclas.',
  'Un teclado «tenkeyless» es un teclado sin el teclado numérico de la derecha.',
  'La tecla 5 del teclado numérico suele tener un pequeño relieve, igual que la F y la J.',
  'Los teclados de teléfono ponen 1, 2, 3 arriba, pero las calculadoras ponen 7, 8, 9 arriba.',
  'En los teclados de los teléfonos antiguos, la tecla 7 tenía P, Q, R y S, y la tecla 9 tenía W, X, Y y Z.',
  'El texto predictivo T9 permitía a los móviles antiguos adivinar palabras pulsando cada tecla una sola vez por letra.',
  'Los teléfonos BlackBerry eran famosos por sus pequeños teclados QWERTY físicos.',
  'Los teléfonos táctiles conservaron la distribución QWERTY de las máquinas de escribir y los teclados.',
  'La escritura por deslizamiento permite escribir una palabra deslizando un dedo por sus letras.',
  'La tecla Windows llegó a los teclados en los años noventa; el Microsoft Natural Keyboard de 1994 fue de los primeros en tenerla.',
  'El Microsoft Natural Keyboard de 1994 era un teclado ergonómico dividido.',
  'Los teclados ergonómicos divididos están pensados para que las muñecas se mantengan más rectas al escribir.',
  'Los teclados mecánicos tienen un interruptor separado debajo de cada tecla.',
  'Los interruptores Cherry MX fueron popularizados por la empresa alemana Cherry a partir de los años ochenta.',
  'Un interruptor mecánico Cherry MX típico se puede presionar unos 4 milímetros.',
  'El teclado IBM Model M de los años ochenta usaba interruptores de «resorte que se dobla» que hacen un fuerte clic.',
  'Muchos teclados más baratos usan cúpulas de goma bajo una membrana en vez de interruptores mecánicos.',
  'Muchas portátiles usan mecanismos en forma de tijera bajo las teclas para ser delgadas.',
  'El «N-key rollover» significa que un teclado registra todas las teclas, aunque se pulsen muchas a la vez.',
  'Algunos teclados sencillos solo detectan unas pocas teclas pulsadas a la vez; las demás se pierden.',
  'Las letras impresas en las teclas se llaman leyendas.',
  'Las teclas «double-shot» se moldean con dos piezas de plástico, así que sus letras nunca se borran.',
  'La primera patente de máquina de escribir en EE. UU. se concedió a William Austin Burt en 1829 por su «Typographer».',
  'En 1714, Henry Mill recibió una patente inglesa por una máquina para escribir letras una tras otra, como una máquina de escribir.',
  'La bola de escribir Malling-Hansen era una máquina con forma de bola y teclas que sobresalían.',
  'El filósofo Friedrich Nietzsche compró una bola de escribir Malling-Hansen en 1882.',
  'Las máquinas «de índice» no tenían teclado; se señalaba una letra en una tabla y luego se pulsaba una palanca.',
  'La máquina IBM Selectric de 1961 usaba una pieza con forma de pelota de golf en lugar de barras de tipos.',
  'Quienes usaban la Selectric podían cambiar la «pelota de golf» para cambiar de letra en segundos.',
  'La IBM Correcting Selectric de 1973 podía levantar los errores del papel con una cinta especial.',
  'El líquido corrector fue inventado en los años cincuenta por Bette Nesmith Graham, que era mecanógrafa.',
  'Las máquinas de margarita imprimían con una rueda giratoria que tenía una letra al final de cada radio.',
  'Las cintas de las máquinas de escribir solían ser mitad negras y mitad rojas, para cambiar de color.',
  'La letra «pica» de máquina de escribir cabe 10 caracteres por pulgada; la letra «elite», 12.',
  'En una máquina con letra monoespaciada, cada letra ocupa el mismo ancho, incluso la i y la m.',
  'El tipo de letra Courier fue diseñado por Howard Kettler para las máquinas de escribir de IBM en los años cincuenta.',
  'Las máquinas de escribir chinas usaban una gran bandeja con miles de caracteres de metal.',
  'Los teletipos eran máquinas parecidas a las de escribir que enviaban mensajes escritos por cables.',
  'El Teletype Model 33, usado con las primeras computadoras, solo podía imprimir letras mayúsculas.',
  'Los estenotipistas de los tribunales pulsan varias teclas a la vez para escribir sílabas o palabras enteras.',
  'Los estenotipistas expertos pueden registrar el habla a más de 200 palabras por minuto.',
  'Pulsar varias teclas a la vez para formar un símbolo se llama hacer un acorde.',
  'La máquina Braille Perkins tiene seis teclas principales, una para cada punto de una celda braille.',
  'ASCII, una forma estándar de que las computadoras guarden letras como números, se publicó por primera vez en 1963.',
  'UNCOPYRIGHTABLE se cita a menudo como una de las palabras inglesas más largas sin letras repetidas.',
  'En los teclados estadounidenses, la @ se escribe con Shift y la tecla 2.',
  'Primero la precisión: corregir un error suele costar más tiempo que escribir un poco más despacio.',
  'La velocidad crece con la práctica; la mayoría escribe más rápido cuando deja de mirar las teclas.',
  'Quienes enseñan mecanografía recomiendan mantener las muñecas levantadas en lugar de apoyarlas al escribir.'
];
// extra facts about Spanish typing (true for Windows US-International and Spanish keyboards)
FACTS.push(
  'On the Windows United States-International keyboard, typing an apostrophe then a vowel makes an accented vowel such as á.',
  'On the United States-International keyboard, Right Alt plus N also types ñ.',
  'Spanish keyboards have their own Ñ key, just to the right of the L key.',
  'Spanish uses upside-down marks, ¿ and ¡, at the start of questions and exclamations.'
);
FACTS_ES.push(
  'En el teclado «Estados Unidos-Internacional» de Windows, al escribir un apóstrofo y luego una vocal se obtiene una vocal con tilde, como á.',
  'En el teclado «Estados Unidos-Internacional», Alt derecha más N también escribe la ñ.',
  'Los teclados españoles tienen su propia tecla Ñ, justo a la derecha de la tecla L.',
  'El español usa signos invertidos, ¿ y ¡, al comienzo de las preguntas y exclamaciones.'
);
