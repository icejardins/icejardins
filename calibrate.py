import re

text = """
La fe verdadera no consiste en fingir que no sentimos miedo ni en intentar adivinar qué pasará mañana. Tener fe es poner nuestra mano en la mano de Dios en la oscuridad y dar el siguiente paso posible, confiando en que Él ya está adelante preparando el camino. Es la certeza suave y reconfortante de que, aun cuando nuestros ojos humanos no ven la salida, el amor de Dios sigue sosteniendo nuestra vida con firmeza y cariño.

### La certeza que nace en la oscuridad

Tome asiento, respire hondo y conversemos con calma, como dos buenos amigos que toman un café caliente en la cocina. ¿Cuántas veces se ha quedado despierto a medianoche, dando vueltas en la cama con el pecho apretado por el día de mañana? Nos desgastamos intentando adivinar si alcanzará el dinero, si la salud de la familia resistirá o cómo resolver ese problema que nos quita la tranquilidad.

A veces pensamos que tener fe significa tener todas las respuestas o no llorar jamás de incertidumbre. Sin embargo, la Biblia enseña en el libro de Hebreos que la fe es la garantía segura de lo que esperamos y la certeza clara de lo que no vemos con los ojos. Es confiar en los planes de Alguien mayor cuando nuestra propia mirada solo encuentra sombras en el camino.

Piense en el campesino que siembra una semilla pequeña en la tierra blanda del huerto. Durante muchos días seguidos, mira el suelo y solo observa tierra seca, sin brotes verdes a la vista. Aun así, sigue regando con paciencia porque sabe que la vida crece en el silencio de la tierra. Así fue también en la creación: Dios hizo todo lo que existe a partir de lo invisible, usando la bondadosa fuerza de Su palabra.

### Un corazón sincero que entrega lo mejor

Hace mucho tiempo, un hombre llamado Abel comprendió esta gran verdad en el inicio de la historia humana. Él y su hermano Caín llevaron una ofrenda de gratitud a Dios con el fruto de su trabajo diario. Caín cumplió por compromiso, sin afecto sincero en el alma, pero Abel escogió con cuidado la mejor parte de su rebaño para ponerla en las manos del Señor.

Dios recibió con agrado el gesto de Abel porque vio la sinceridad de un corazón que confiaba de verdad en Su amor. Aquel sacrificio sencillo de Abel apuntaba ya al sacrificio de Jesús, quien dio Su propia vida para regalarnos paz y perdón. La Biblia cuenta que, aunque Abel murió hace miles de años, su fe nos sigue hablando hoy: para Dios no cuentan los ritos complicados, sino un corazón humilde y agradecido.

### Caminar juntos sin complicar la vida

Otro ejemplo entrañable es el de Enoc, un hombre común que no hizo milagros famosos ni gobernó grandes ciudades. Todo lo que la Biblia dice sobre él cabe en pocas frases muy dulces: Enoc simplemente caminó con Dios durante toda su vida. Trabajó, cuidó de sus hijos, lavó sus manos de la faena diaria y compartió cada momento de su rutina con el Creador.

Enoc agradó al Padre celestial porque creyó con sinceridad que Dios existe y recompensa con bondad a quienes lo buscan. La Escritura deja claro que sin fe es imposible agradar a Dios, pues a Él no le importan las apariencias ni los discursos bonitos. Él busca una amistad real con nosotros. Cuando usted despierta por la mañana, suspira hondo y pide fuerzas a Dios para ir a trabajar, camina con Él de la misma forma sencilla y valiosa de Enoc.

### Construir el barco antes de la lluvia

Mire también la vida de Noé, un hombre bueno que escuchó la advertencia divina sobre algo que nadie había presenciado jamás. Dios le avisó que una gran tormenta caería sobre la tierra para limpiar la injusticia y el dolor del mundo. En aquella región seca, nadie sabía lo que era una inundación, y muchos pensaron que Noé había perdido la cabeza.

Sin ver nubes en el cielo, Noé tomó sus herramientas y construyó una gran arca de madera para proteger a su familia. No esperó a que el agua le llegara a los tobillos para obedecer la voz de Dios. Esa obediencia valiente protegió a su hogar y lo convirtió en heredero de la gracia divina, ese favor generoso e inmerecido que Dios nos da sin exigir pagos a cambio. Dios honró la confianza de Noé y cuidó de todos con infinita compasión en medio del temporal.

### Próximo paso práctico

Hoy, antes de acostarse a descansar, busque cinco minutos en un lugar tranquilo de la casa para conversar a solas con Dios. Tome un trozo pequeño de papel y un lápiz, y escriba allí la mayor duda o temor que le roba la paz sobre el día de mañana.

Luego, doble ese papel, cierre los ojos con serenidad y diga esta sencilla oración: "Dios mío, no sé qué pasará mañana ni puedo controlarlo todo. Pero sé que me amas y ya cuidas de mi futuro; por eso entrego esta angustia en Tus manos y decido descansar". Guarde la nota en un cajón o dentro de un cuaderno como señal clara de que decidió confiar su mañana al Señor.
"""

# Let's count words using standard split and regex
words_split = text.strip().split()
words_re = re.findall(r'\b[\w\'-]+\b', text.strip())
print(f"words_split: {len(words_split)}, words_re: {len(words_re)}")
