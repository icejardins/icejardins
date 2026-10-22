# Let's calibrate to exactly between 850 and 930 words, say 885-895 words.

text = """Se você sente que vive tropeçando sempre nas mesmas pedras e já não aguenta mais prometer que vai mudar sem conseguir, respire fundo e fique em paz. Você não está sozinho nessa luta diária, e o fato de você se incomodar com esses erros mostra que o seu coração ainda deseja o que é bom e justo. O verdadeiro autocontrole não nasce da força do seu próprio braço, mas de entender onde a armadilha começa e aprender a receber a ajuda bondosa de Deus no momento certo.

Puxe uma cadeira, tome um café comigo e vamos conversar com calma sobre o que realmente acontece dentro de nós.

### A armadilha do peixe e a ponta do anzol

Sabe quando um pescador vai para a beira do rio? Ele nunca joga na água um anzol brilhante, vazio e pontiagudo, porque peixe nenhum morderia ferro puro. O que ele faz é cobrir o perigo com uma isca bem apetitosa, algo que o peixe gosta muito.

A tentação funciona desse mesmo jeitinho. A Bíblia ensina, numa carta muito prática escrita por Tiago, que Deus nunca tenta ninguém para o mal. Deus só quer o nosso bem. Na verdade, somos nós mesmos que somos atraídos e enganados pelos nossos próprios desejos escondidos.

A gente costuma colocar a culpa no cansaço do trabalho, no trânsito, na família ou até no diabo. Mas a verdade nua e crua é que a isca só funciona porque encontra dentro do nosso peito uma vontade que já estava ali guardada. Aquele momento de perder a paciência com os filhos, aquela vontade de gastar o dinheiro que não tem, aquela espiada naquilo que não presta no celular ou a mentirinha para se defender não começam do nada. Eles começam com um pensamento que promete um alívio rápido ou um prazer passageiro, mas esconde a ponta de ferro que vai nos ferir profundamente depois.

### O caminho que nos afasta da vida

Tiago mostra que existe um roteiro muito claro que nos faz cair repetidamente. Tudo começa com um engano: a gente começa a duvidar que Deus cuida de nós ou que os conselhos dEle são realmente os melhores. Pensamos baixinho: "Eu mereço isso agora", "Ninguém vai ficar sabendo" ou "Deus não está vendo a minha aflição".

Depois que aceitamos essa mentira, o desejo proibido ganha força e nós mordemos a isca. Vem o erro e, logo em seguida, a colheita amarga: culpa pesada, vergonha, brigas em casa e um vazio danado na alma. É isso que a Bíblia chama de morte: a morte da nossa tranquilidade, da confiança de quem amamos e da nossa paz com Deus.

Se você tentar vencer esse ciclo apenas na força de vontade, rangendo os dentes, vai se frustrar logo. A nossa força humana acaba ligeiro quando a isca certa balança na nossa frente.

### Um Pai que não muda e nos acolhe

A melhor notícia para o seu coração é esta: Deus não é um guarda de trânsito esperando você vacilar para te multar. Ele é um Pai perfeito, que não muda de humor e de quem vem tudo o que é bom e verdadeiro.

Quando a Bíblia fala em graça, significa exatamente isso de um jeito bem simples: é o favor imerecido, o amor e o perdão generoso de Deus entregues de graça para quem só merecia reprovação. Ele não espera você consertar toda a sua vida sozinho para começar a te amar. Ele mesmo toma a iniciativa de trocar o nosso coração duro feito pedra por um coração novo e sensível, que aprende a amar o bem.

Por meio de Jesus, que deu a vida por nós e ressuscitou, temos o perdão total dos nossos tropeços. Você não precisa fugir de Deus com medo ou vergonha. Pelo contrário: é hora de correr para o colo dEle justamente quando se sentir fraco.

### Aprenda a frear antes de acelerar

Para começar a ter domínio próprio no meio da correria do dia a dia, Tiago nos dá três conselhos práticos de ouro: estar sempre pronto para ouvir, ser bem calmo para falar e demorar bastante para ficar com raiva.

Geralmente fazemos o oposto. Ouvimos muito mal, temos resposta pronta na ponta da língua e estouramos por qualquer bobagem. Só que a raiva humana descontrolada nunca ajuda a construir a vida boa e correta que Deus quer para a nossa história.

Autocontrole é como tirar aquela roupa suja e encardida depois de um dia de trabalho pesado e colocar uma roupa limpa e cheirosa. É deixar de lado o orgulho e acolher com humildade os ensinamentos de Deus, deixando que eles sejam plantados no coração como uma semente boa numa terra fértil.

### O espelho que muda as nossas atitudes

Não adianta nada você acordar, olhar no espelho do quarto, ver o rosto todo sujo de graxa, dar as costas e sair na rua fingindo que está tudo limpo. Seria uma tolice sem tamanho.

Tiago ensina que a mensagem de Deus funciona exatamente como esse espelho. Escutar uma palavra bonita no domingo ou ler uma frase inspiradora e não praticar na segunda-feira é enganar a si mesmo. O autocontrole verdadeiro se revela quando a fé sai do papel e entra na rotina: quando você segura a língua, quando estende a mão para quem está passando necessidade — como os órfãos e as viúvas que não têm ninguém por eles — e quando não deixa a maldade do mundo moldar o seu caráter.

### Próximo passo prático

Hoje mesmo, separe cinco minutos do seu dia, pegue um pedaço de papel e anote com sinceridade qual é a sua isca predileta — aquela situação em que você quase sempre escorrega (pode ser o estresse no trânsito, a hora de dormir com o celular na mão ou o aperto nas contas).

Ao enxergar a isca, respire fundo e faça uma oração simples com as suas palavras: "Senhor Deus, eu reconheço que não dou conta sozinho. Perdoe os meus tropeços e me dê forças para não morder esse anzol hoje. Me ensine a calar, ouvir e confiar no Teu cuidado antes de agir por impulso". Dê essa pausa antes de tomar qualquer atitude impensada.
"""

words = text.strip().split()
print("Total words:", len(words))
