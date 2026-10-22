import re

text = """
Se você sente que vive tropeçando sempre nas mesmas pedras e já não aguenta mais prometer que vai mudar sem conseguir, respire fundo e fique em paz. Você não está sozinho nessa luta, e o fato de você se incomodar com esses erros mostra que o seu coração ainda deseja o que é certo. O verdadeiro autocontrole não nasce da força do seu próprio braço, mas de entender onde a armadilha começa e aprender a receber o socorro bondoso de Deus no momento certo.

Puxe uma cadeira, tome um café comigo e vamos conversar com calma sobre o que realmente acontece dentro de nós.

### A armadilha do peixe e a ponta do anzol

Sabe quando um pescador vai para a beira do rio? Ele nunca joga na água um anzol brilhante, vazio e pontiagudo, porque peixe nenhum morderia ferro puro. O que ele faz é cobrir o perigo com uma isca bem apetitosa, algo que o peixe gosta muito.

A tentação funciona desse mesmo jeitinho no nosso dia a dia. A Bíblia ensina, numa carta muito prática escrita por um pastor chamado Tiago, que Deus não tenta ninguém para o mal. Deus só quer o nosso bem. Na verdade, somos nós que somos atraídos e enganados pelos nossos próprios desejos escondidos.

A gente costuma colocar a culpa no estresse do trabalho, no trânsito, nos parentes ou até no diabo. Mas a verdade nua e crua é que a isca só funciona porque encontra dentro de nós um apetite que já estava ali. Aquele momento de perder a paciência e gritar com a família, aquela vontade de gastar o que não tem, aquela espiada naquilo que não devia na internet ou a mentirinha para se dar bem no serviço não começam do nada. Eles começam com um pensamento que nos promete um alívio rápido ou um prazer gostoso, mas escondem o anzol que vai rasgar a nossa boca e nos trazer muita dor depois.

### O caminho perigoso que nos afasta da vida

Tiago explica que existe um roteiro muito claro que nos faz cair repetidamente. Tudo começa com um engano: a gente começa a duvidar que Deus se importa com a nossa dor ou que os conselhos dEle são realmente os melhores. Pensamos: "Eu mereço isso agora", "Ninguém vai ficar sabendo" ou "Deus não está vendo o meu aperto".

Depois que aceitamos essa mentira, o desejo proibido ganha força no peito e nós mordemos a isca. Vem o ato errado e, logo em seguida, a colheita amarga: culpa pesada, vergonha, relacionamentos destruídos e um vazio enorme na alma. É isso que a Bíblia chama de morte. Não apenas o fim da vida biológica, mas a morte da nossa paz, da confiança das pessoas que amamos e da nossa comunhão com Deus.

Se você tentar vencer esse ciclo apenas na base de ranger os dentes e fazer promessas de ano novo, você vai se frustrar de novo. A nossa força humana acaba bem rápido quando a isca certa passa na nossa frente.

### Um Pai que não muda e nos dá vida nova

A melhor notícia que você pode ouvir hoje é esta: Deus não é um fiscal bravo esperando você errar para te castigar com uma vara. Ele é um Pai cheio de bondade, que nunca muda de humor e de quem vem todo presente bom da nossa vida.

A graça de Deus significa exatamente isso na prática: é o amor e o perdão generoso de Deus entregues de graça para quem só merecia bronca e castigo. Ele não espera você ficar perfeito para começar a te amar. Ele mesmo toma a iniciativa de trocar o nosso coração duro como pedra por um coração novo, sensível, capaz de amar o que é bom e resistir ao que nos destrói.

Quando você compreende que Jesus enfrentou a morte na cruz para nos livrar da condenação e nos perdoar por completo, você não precisa mais fugir de Deus de vergonha. Você pode correr para os braços dEle justamente na hora em que estiver mais fraco.

### Aprenda a frear antes de acelerar

Para desenvolver o autocontrole no meio do corre-corre, Tiago nos dá três conselhos de ouro para a rotina: estar sempre pronto para ouvir, ser lento para falar e demorar para ficar com raiva.

Geralmente a gente faz o contrário, não é verdade? Ouvimos muito mal, estamos sempre prontos para responder na ponta da língua e explodimos por qualquer bobagem. Mas a raiva descontrolada nunca produz a vida justa e boa que Deus sonhou para nós.

Autocontrole é como tirar aquela roupa suja e encardida de um dia puxado de trabalho e vestir uma roupa limpa. É calar a nossa teimosia e acolher com humildade os conselhos da Palavra de Deus, deixando que eles sejam plantados dentro da nossa cabeça e do nosso peito como uma semente boa em terra adubada.

### O espelho que transforma as nossas ações

Não adianta nada você levantar de manhã, olhar no espelho do banheiro, ver que o rosto está todo sujo de carvão ou o cabelo despenteado, e sair para a rua sem lavar a cara. Seria uma tolice sem tamanho.

Tiago diz que a Bíblia é como esse espelho. Ler ou ouvir uma mensagem bonita e não colocar em prática no trabalho, no casamento e no trânsito é enganar a si mesmo. A verdadeira fé não fica só em palavras bonitas nem em emoções passageiras; ela se mostra viva quando a gente cuida dos mais frágeis, como os órfãos e as viúvas que não têm quem olhe por eles, e quando guardamos a nossa integridade sem nos deixar contaminar pela maldade e pelo egoísmo do mundo.

### Próximo passo prático

Hoje mesmo, pare por três minutos num cantinho sossegado com um papel e uma caneta. Identifique com honestidade a sua isca favorita — aquela situação típica em que você sempre perde a cabeça ou cai na mesma tentação (como o cansaço no fim da tarde, o celular na cama de madrugada ou uma conversa tensa). 

Assim que reconhecer a isca, faça uma oração simples e sincera dizendo: "Deus, eu sozinho não consigo resistir a isso, mas confio na Tua bondade. Me ajuda agora a não morder esse anzol e me dá calma para calar e ouvir antes de agir". Faça essa pausa respirando fundo antes de dar qualquer resposta impulsiva.
"""

words = text.strip().split()
print("Total words:", len(words))
