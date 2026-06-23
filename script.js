/*
    JavaScript é a parte que faz o jogo funcionar.
    Ele cria as cartas, controla cliques, tempo, pontuação, vitória e sons.
*/

// ===================== VARIÁVEIS GLOBAIS =====================
// Variável é uma "caixinha" onde guardamos uma informação para usar depois.

// Guarda todas as cartas da partida atual.
let cards = [];

// Guarda temporariamente as cartas que o jogador virou. O máximo é 2.
let flippedCards = [];

// Conta quantos pares já foram encontrados.
let matchedPairs = 0;

// Conta as tentativas. Cada 2 cartas viradas contam como 1 movimento.
let moves = 0;

// Pontuação visível durante o jogo. Ganha 100 pontos por par.
let score = 0;

// Tempo em segundos.
let timer = 0;

// Guarda o intervalo do relógio para conseguir parar depois.
let timerInterval = null;

// Diz se a partida está ativa.
let gameActive = false;

// Tamanho atual do tabuleiro: 4 para 4x4 ou 6 para 6x6.
let currentSize = 4;

// Trava o tabuleiro enquanto duas cartas estão sendo comparadas.
let lockBoard = false;

// Preferência de som. Começa lendo o que foi salvo no navegador.
let soundEnabled = localStorage.getItem('memoryGameSound') === 'true';

// Emojis usados nas cartas. O modo 6x6 precisa de 18 pares, então há emojis sobrando.
const icons = [
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
    '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔',
    '🐧', '🐦', '🐴', '🦄', '🐌', '🐝', '🐙', '🦋'
];

// Quando a página terminar de carregar, configuramos a tela inicial.
document.addEventListener('DOMContentLoaded', () => {
    const soundToggle = document.getElementById('soundToggle');

    soundToggle.checked = soundEnabled;

    soundToggle.addEventListener('change', () => {
        soundEnabled = soundToggle.checked;
        localStorage.setItem('memoryGameSound', String(soundEnabled));

        if (soundEnabled) {
            playSound('flip');
        }
    });

    updateUI();
});

// ===================== FUNÇÕES PRINCIPAIS =====================

// Inicia uma nova partida com o tamanho escolhido.
function startGame(size) {
    stopTimer();

    timer = 0;
    moves = 0;
    score = 0;
    matchedPairs = 0;
    flippedCards = [];
    gameActive = true;
    lockBoard = false;
    currentSize = size;

    const totalCards = size * size;
    const totalPairs = totalCards / 2;

    if (totalPairs > icons.length) {
        alert('Não há ícones suficientes para esse tamanho de tabuleiro.');
        return;
    }

    // Pegamos somente a quantidade de ícones necessária.
    const selectedIcons = icons.slice(0, totalPairs);

    // Duplicamos os ícones para formar pares.
    const cardIcons = [...selectedIcons, ...selectedIcons];

    // Embaralhamos as cartas com o algoritmo Fisher-Yates.
    shuffleArray(cardIcons);

    // Transformamos cada emoji em um objeto de carta.
    cards = cardIcons.map((icon, index) => ({
        id: index,
        icon,
        flipped: false,
        matched: false
    }));

    closeVictoryModal();
    updateActiveButtons();
    updateUI();
    renderBoard();
    startTimer();
    playSound('flip');
}

// Reinicia mantendo o tamanho atual do tabuleiro.
function restartGame() {
    startGame(currentSize);
}

// Cria visualmente o tabuleiro na tela.
function renderBoard() {
    const board = document.getElementById('gameBoard');

    board.className = 'memory-board';
    board.style.gridTemplateColumns = `repeat(${currentSize}, minmax(0, 1fr))`;
    board.innerHTML = '';

    cards.forEach((card) => {
        const button = document.createElement('button');
        const isVisible = card.flipped || card.matched;

        button.type = 'button';
        button.className = `memory-card ${card.flipped ? 'flipped' : ''} ${card.matched ? 'matched' : ''}`;
        button.dataset.cardId = String(card.id);
        button.disabled = card.matched;
        button.setAttribute('aria-label', isVisible ? `Carta aberta: ${card.icon}` : 'Carta fechada');
        button.onclick = () => flipCard(card.id);

        button.innerHTML = isVisible
            ? `<span class="card-content">${card.icon}</span>`
            : '<i class="bi bi-question-lg card-content"></i>';

        board.appendChild(button);
    });
}

// Vira uma carta quando o jogador clica nela.
function flipCard(cardId) {
    if (lockBoard) return;
    if (!gameActive) return;
    if (flippedCards.length >= 2) return;

    const card = cards[cardId];

    if (!card) return;
    if (card.flipped) return;
    if (card.matched) return;

    card.flipped = true;
    flippedCards.push(card);

    renderBoard();
    playSound('flip');

    // Quando existem duas cartas viradas, contamos 1 movimento e verificamos o par.
    if (flippedCards.length === 2) {
        moves++;
        lockBoard = true;
        updateUI();
        checkMatch();
    }
}

// Verifica se as duas cartas viradas formam um par.
function checkMatch() {
    const [card1, card2] = flippedCards;

    if (!card1 || !card2) {
        lockBoard = false;
        return;
    }

    if (card1.icon === card2.icon) {
        card1.matched = true;
        card2.matched = true;
        card1.flipped = false;
        card2.flipped = false;

        matchedPairs++;
        score += 100;
        flippedCards = [];

        renderBoard();
        highlightMatch(card1.id, card2.id);
        updateUI();
        playSound('match');

        lockBoard = false;

        if (matchedPairs === cards.length / 2) {
            // Pequeno tempo para o jogador ver a última animação antes do modal aparecer.
            setTimeout(gameVictory, 450);
        }
    } else {
        playSound('wrong');

        // Espera 800ms para o jogador conseguir ver as cartas erradas antes de desvirar.
        setTimeout(() => {
            card1.flipped = false;
            card2.flipped = false;
            flippedCards = [];
            lockBoard = false;
            renderBoard();
        }, 800);
    }
}

// Aplica animação apenas nas duas cartas que formaram par.
function highlightMatch(cardId1, cardId2) {
    [cardId1, cardId2].forEach((id) => {
        const element = document.querySelector(`[data-card-id="${id}"]`);

        if (element) {
            element.classList.add('match-animation');

            setTimeout(() => {
                element.classList.remove('match-animation');
            }, 350);
        }
    });
}

// Executa quando o jogador encontra todos os pares.
function gameVictory() {
    gameActive = false;
    stopTimer();

    const finalScore = calculateFinalScore();
    score = finalScore;

    document.getElementById('victoryStats').innerHTML = `
        Tempo: <strong>${formatTime(timer)}</strong><br>
        Movimentos: <strong>${moves}</strong><br>
        Pares encontrados: <strong>${matchedPairs}</strong>
    `;

    document.getElementById('finalScore').textContent = String(finalScore);

    updateUI();
    playSound('victory');
    showVictoryModal();
}

// ===================== TEMPO E PONTUAÇÃO =====================

function startTimer() {
    timerInterval = setInterval(() => {
        timer++;
        updateUI();
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

function calculateFinalScore() {
    const baseScore = matchedPairs * 100;

    // Math.max evita bônus negativo caso o jogador demore muito ou faça muitos movimentos.
    const timeBonus = Math.max(0, 300 - timer) * 10;
    const moveBonus = Math.max(0, 50 - moves) * 5;

    return baseScore + timeBonus + moveBonus;
}

function updateUI() {
    document.getElementById('timer').textContent = formatTime(timer);
    document.getElementById('moves').textContent = String(moves);
    document.getElementById('score').textContent = String(score);
    document.getElementById('level').textContent = currentSize === 4 ? 'Fácil' : 'Difícil';
}

// ===================== MODAL =====================

function showVictoryModal() {
    const modalElement = document.getElementById('victoryModal');

    // Se o Bootstrap carregou, usamos o modal bonito. Se não carregou, usamos alert como plano B.
    if (window.bootstrap) {
        const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
        modal.show();
    } else {
        alert(`Você venceu! Pontuação total: ${score}`);
    }
}

function closeVictoryModal() {
    const modalElement = document.getElementById('victoryModal');

    if (window.bootstrap) {
        const modal = bootstrap.Modal.getInstance(modalElement);

        if (modal) {
            modal.hide();
        }
    }
}

// ===================== SONS =====================

function playSound(type = 'flip') {
    if (!soundEnabled) return;

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) return;

    const soundMap = {
        flip: { frequency: 520, duration: 0.08 },
        match: { frequency: 760, duration: 0.13 },
        wrong: { frequency: 180, duration: 0.18 },
        victory: { frequency: 920, duration: 0.28 }
    };

    const config = soundMap[type] || soundMap.flip;
    const audioContext = new AudioContextClass();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(config.frequency, audioContext.currentTime);

    gain.gain.setValueAtTime(0.08, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + config.duration);

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + config.duration);

    oscillator.onended = () => {
        audioContext.close();
    };
}

// ===================== FUNÇÕES AUXILIARES =====================

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function updateActiveButtons() {
    const easyButton = document.getElementById('easyButton');
    const hardButton = document.getElementById('hardButton');

    easyButton.classList.toggle('active', currentSize === 4);
    hardButton.classList.toggle('active', currentSize === 6);
}
