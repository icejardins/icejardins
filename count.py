import re

text = """
La fe verdadera no consiste en fingir que no tenemos miedo ni en adivinar qué pasará mañana. Tener fe es poner nuestra mano en la mano de Dios en la oscuridad y dar el siguiente paso posible, confiando en que Él ya está adelante preparando el camino. Es la certeza suave y reconfortante de que, aun cuando nuestros ojos humanos no ven la salida, el amor de Dios sigue sosteniendo nuestra vida con firmeza y cariño.

### La certeza que nace en la oscuridad

Acérquese a la mesa, respire hondo y conversemos con calma, como dos buenos amigos que toman un café caliente en la cocina. ¿Cuántas veces se ha encontrado despierto a mitad de la noche, dando vueltas en la cama con el pecho apretado por la preocupación del día de mañana? Muchas veces nos desgastamos intentando adivinar si alcanzará el dinero del mes, si la salud de la familia responderá bien o cómo solucionar ese problema tan pesado que nos quita la tranquilidad.

Solemos pensar equivocadamente que tener fe significa tener todas las respuestas claras o no derramar jamás una lágrima de incertidumbre frente a las dificultades. Sin embargo, la Biblia nos enseña en la carta a los Hebreos que la fe es la garantía firme de lo que esperamos y la prueba evidente de lo que aún no vemos con los ojos del cuerpo. Significa confiar plenamente en los sabios planes de Alguien mucho más grande cuando nuestra propia mirada solo encuentra sombras y dudas en el camino.

Piense por un momento en el campesino que siembra una semilla pequeña en la tierra blanda del huerto. Durante varios días seguidos, mira el suelo y solo observa tierra seca, sin un solo brote verde asomando en la superficie. Aun así, sigue regando el surco con paciencia cada mañana porque sabe que la vida está naciendo en el silencio de la tierra. De esa misma manera sucedió en la creación del universo: Dios hizo todo lo que existe a partir de lo invisible, usando únicamente el bondadoso poder de Su palabra.

### Un corazón sincero que entrega lo mejor

Hace mucho tiempo, un hombre humilde llamado Abel entendió esta gran verdad en los comienzos de la historia humana. Él y su hermano Caín decidieron llevar una ofrenda de sincera gratitud al Creador con el fruto de su trabajo diario en el campo. Caín presentó su ofrenda de cualquier manera, por simple obligación y sin ningún cariño en el corazón, pero Abel escogió con cuidado la mejor parte de su rebaño para entregarla en las manos del Señor.

Dios recibió con agrado el gesto de Abel porque vio la nobleza de un corazón sincero que confiaba de verdad en Su amor y providencia. Aquel sacrificio sencillo de Abel anunciaba ya el sacrificio de Jesús, quien dio Su propia vida en la cruz para regalarnos paz, salvación y perdón completo de nuestros errores. La Biblia nos dice que, aunque Abel murió hace miles de años, su fe nos sigue hablando hoy: para Dios no importan los rituales complejos ni las apariencias, sino un corazón humilde y agradecido.

### Caminar juntos sin complicar la vida

Otro ejemplo entrañable que encontramos en la Escritura es la vida de Enoc, un hombre común y corriente que no realizó milagros famosos ni gobernó grandes ciudades. Todo lo que la Biblia cuenta acerca de él cabe en pocas frases muy dulces: Enoc simplemente caminó con Dios a lo largo de toda su vida. Trabajó todos los días, cuidó de sus hijos pequeños, lavó sus manos cansadas de la jornada y compartió cada momento cotidiano con el Creador.

Enoc agradó al Padre celestial porque creyó con sinceridad de alma que Dios existe realmente y que recompensa con infinita bondad a quienes lo buscan. La Biblia nos recuerda con total claridad que sin fe es imposible agradar a Dios, porque a Él no le importan las poses fingidas ni las palabras rebuscadas. Él busca una amistad honesta y cercana con nosotros. Cuando usted despierta por la mañana, suspira profundo y pide fuerzas al Señor para salir a trabajar, camina con Dios de la misma forma sencilla y valiosa de Enoc.

### Construir el barco antes de la lluvia

Piense también en Noé, un hombre piadoso que escuchó la advertencia divina sobre un suceso que nadie jamás había presenciado en el mundo. Dios le avisó con tiempo que caería una gran tempestad sobre la tierra para limpiar la injusticia y el dolor de la sociedad. En aquella región seca y calurosa, nadie sabía lo que era una lluvia torrencial, y la gente del pueblo pensó que Noé se había vuelto loco.

A pesar de no ver ni una sola nube gris en el cielo, Noé tomó sus herramientas de trabajo y construyó una enorme arca de madera para proteger a su familia. No esperó a que el agua le llegara a los tobillos para obedecer la voz de Dios. Esa obediencia valiente cuidó a sus seres queridos y lo convirtió en heredero de la gracia divina, que es ese favor generoso e inmerecido que Dios nos entrega sin pedirnos nada a cambio. Dios honró la lealtad de Noé y protegió a todos con inmenso amor en medio de la tormenta.

### Próximo paso práctico

Hoy, antes de acostarse a descansar, busque cinco minutos en un rincón tranquilo de su hogar para tener un momento honesto con Dios. Tome un pedazo pequeño de papel y un lápiz, y escriba allí la mayor preocupación o el miedo que le roba la paz respecto a lo que sucederá el día de mañana.

Luego, doble ese papel por la mitad, cierre sus ojos con serenidad y diga con el corazón esta breve oración: "Querido Dios, no sé qué va a pasar mañana y reconozco que no puedo controlar el futuro. Pero sé que me amas y que ya estás cuidando de mi vida; por eso hoy suelto esta angustia en Tus manos y decido descansar en Ti". Guarde ese papelito dentro de un cajón o en medio de un libro como una señal clara de que decidió confiar su mañana al Señor.
"""

words = re.findall(r'\b[\w\'-]+\b', text.strip())
print("Total words in body:", len(words))
