# Jogo da Memória — versão corrigida

Este projeto foi separado em 3 arquivos principais:

1. `index.html` — estrutura da página. É onde ficam os textos, botões, painel de estatísticas, tabuleiro e modal de vitória.
2. `style.css` — aparência visual. É onde ficam cores, tamanhos, sombras, animações e estilo das cartas.
3. `script.js` — lógica do jogo. É onde ficam as regras: embaralhar cartas, virar cartas, verificar pares, contar movimentos, timer, pontuação, sons e vitória.

## Como abrir

Coloque os três arquivos na mesma pasta e abra o `index.html` no navegador.

A página usa Bootstrap por CDN. Isso significa que, para o visual completo com ícones e modal, é melhor abrir com internet ativa.

## O que foi corrigido

- Botões 4x4, 6x6, Reiniciar e Jogar novamente agora chamam funções reais.
- Foi adicionado o Bootstrap JS, necessário para o modal funcionar.
- O CSS que estava misturado com JavaScript foi separado corretamente.
- As cartas agora são criadas dinamicamente pelo JavaScript.
- O clique na carta agora realmente vira a carta.
- A carta virada é guardada no array `flippedCards`.
- A verificação de pares agora funciona.
- Quando erra, as cartas desviram depois de 800ms.
- Quando acerta, as cartas ficam verdes, somam 100 pontos e recebem animação.
- O `lockBoard` agora trava e destrava corretamente para evitar cliques bugados.
- O cronômetro inicia, atualiza e para na vitória.
- A pontuação final usa a regra da planilha: pares + bônus de tempo + bônus de movimentos.
- A preferência de som é salva no `localStorage`.
- O jogo ficou responsivo para desktop e celular.

## Requisitos atendidos

- RF01: iniciar o jogo.
- RF02: escolher dificuldade 4x4 ou 6x6.
- RF03: virar carta com validações.
- RF04: verificar pares com feedback visual e sonoro.
- RF05: contar movimentos.
- RF06: cronômetro em MM:SS.
- RF07: pontuação com bônus.
- RF08: vitória com estatísticas.
- RF09: reiniciar jogo.
- RF10: sons com botão liga/desliga.
- RF11: animações visuais.
- RF12: lembrar preferência de som.
- RNF01 a RNF05: interface simples, responsiva, leve e sem banco de dados.

## Explicação simples

Pense no jogo assim:

- `cards` é a lista de todas as cartas.
- Cada carta tem `id`, `icon`, `flipped` e `matched`.
- `flipped` significa: a carta está virada agora.
- `matched` significa: a carta já encontrou seu par.
- `flippedCards` guarda as duas cartas que o jogador está tentando comparar.
- `moves` conta cada tentativa.
- `matchedPairs` conta quantos pares já foram encontrados.
- `timer` guarda o tempo em segundos.
- `lockBoard` impede que o jogador clique em várias cartas enquanto o jogo está comparando duas cartas.

