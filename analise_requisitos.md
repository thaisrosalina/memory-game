# Análise dos requisitos da planilha

## Requisitos funcionais

| Código | Situação na versão corrigida | Observação |
|---|---|---|
| RF01 | Atendido | Botões 4x4 e 6x6 iniciam nova partida. |
| RF02 | Atendido | Dificuldade altera o tamanho do tabuleiro. |
| RF03 | Atendido | Clique vira carta e bloqueia cartas já abertas/combinadas. |
| RF04 | Atendido | Compara duas cartas, acerta ou erra com feedback. |
| RF05 | Atendido | Cada tentativa com duas cartas soma 1 movimento. |
| RF06 | Atendido | Timer em MM:SS começa no início e para na vitória. |
| RF07 | Atendido | Pontuação final: pares + bônus tempo + bônus movimentos. |
| RF08 | Atendido | Detecta vitória, encerra timer e mostra modal. |
| RF09 | Atendido | Reinicia mantendo o tamanho atual. |
| RF10 | Atendido | Sons criados via Web Audio API, sem arquivos externos. |
| RF11 | Atendido | Animação no acerto e efeito hover. |
| RF12 | Atendido | Preferência de som salva no localStorage. |

## Requisitos não funcionais

| Código | Situação na versão corrigida | Observação |
|---|---|---|
| RNF01 | Atendido | Interface direta e com botões claros. |
| RNF02 | Atendido | Poucos arquivos e renderização leve. |
| RNF03 | Atendido | Responsivo para celular, tablet e desktop. |
| RNF04 | Atendido | `lockBoard` reduz bugs de clique rápido. |
| RNF05 | Atendido parcialmente | Não usa banco de dados, mas Bootstrap e Icons vêm de CDN. |
| RNF06 | Sem descrição na planilha | Mantido como experiência de usuário geral. |
| RNF07 | Sem descrição na planilha | Não havia detalhe para implementar. |

## Principais problemas encontrados no código original

1. Os botões tinham `onclick=""`, então não iniciavam o jogo.
2. O Bootstrap JS não estava importado, então o modal não abriria.
3. O CSS tinha JavaScript misturado dentro dele.
4. A carta não era marcada como virada dentro de `flipCard`.
5. A carta virada não era adicionada em `flippedCards`.
6. O template literal estava escrito com aspas simples em alguns pontos, impedindo `${...}` de funcionar.
7. O HTML da carta estava com aspas quebradas no `class` e no `onclick`.
8. No acerto, havia `card1.flipped = false` repetido; deveria usar `card2` também.
9. No erro, o `lockBoard` não voltava para `false`, travando o jogo.
10. Funções importantes ainda não existiam: `updateUI`, `startTimer`, `gameVictory`, `playSound`, `restartGame`.
