let currentOperation = '';
let currentQuestionIndex = 0;
let score = 0;
let correctAnswer = 0;
let timerInterval;
let timeLeft = 15; // Waktu pengerjaan per soal (detik)
const totalQuestions = 10;

// Element Selectors
const menuScreen = document.getElementById('menu-screen');
const gameScreen = document.getElementById('game-screen');
const resultScreen = document.getElementById('result-screen');
const questionText = document.getElementById('question-text');
const optionsGrid = document.getElementById('options-grid');
const feedbackText = document.getElementById('feedback');
const scoreText = document.getElementById('score');
const questionCountText = document.getElementById('question-count');
const timerBar = document.getElementById('timer-bar');

function startGame(operation) {
    currentOperation = operation;
    currentQuestionIndex = 0;
    score = 0;
    
    menuScreen.classList.remove('active');
    resultScreen.classList.remove('active');
    gameScreen.classList.add('active');
    
    scoreText.innerText = score;
    generateQuestion();
}

function generateQuestion() {
    feedbackText.innerText = '';
    currentQuestionIndex++;
    if (currentQuestionIndex > totalQuestions) {
        endGame();
        return;
    }
    
    questionCountText.innerText = currentQuestionIndex;
    
    let num1, num2;
    let opSymbol = '';
    let opType = currentOperation === 'campur' ? ['tambah', 'kurang', 'kali', 'bagi'][Math.floor(Math.random() * 4)] : currentOperation;

    // Set tingkat kesulitan angka khas tes CPNS (tidak terlalu besar tapi butuh ketelitian)
    if (opType === 'tambah') {
        num1 = Math.floor(Math.random() * 80) + 15; // 15 - 95
        num2 = Math.floor(Math.random() * 80) + 15;
        correctAnswer = num1 + num2;
        opSymbol = '+';
    } else if (opType === 'kurang') {
        num1 = Math.floor(Math.random() * 80) + 20;
        num2 = Math.floor(Math.random() * (num1 - 5)) + 5; // Memastikan hasil positif
        correctAnswer = num1 - num2;
        opSymbol = '-';
    } else if (opType === 'kali') {
        num1 = Math.floor(Math.random() * 13) + 3; // 3 - 15
        num2 = Math.floor(Math.random() * 12) + 2; // 2 - 13
        correctAnswer = num1 * num2;
        opSymbol = '×';
    } else if (opType === 'bagi') {
        num2 = Math.floor(Math.random() * 11) + 2; // Pembagi 2 - 12
        correctAnswer = Math.floor(Math.random() * 12) + 2; // Hasil bagi 2 - 13
        num1 = num2 * correctAnswer; // Angka utama dipastikan habis dibagi
        opSymbol = '÷';
    }

    questionText.innerText = `${num1} ${opSymbol} ${num2}`;
    generateOptions(correctAnswer);
    startTimer();
}

function generateOptions(correct) {
    optionsGrid.innerHTML = '';
    let options = [correct];
    
    // Membuat 3 jawaban salah pengecoh yang mirip
    while(options.length < 4) {
        let deviation = (Math.floor(Math.random() * 7) + 1) * (Math.random() < 0.5 ? 1 : -1);
        let wrongOption = correct + deviation;
        if(wrongOption >= 0 && !options.includes(wrongOption)) {
            options.push(wrongOption);
        }
    }
    
    // Acak posisi tombol jawaban
    options.sort(() => Math.random() - 0.5);
    
    options.forEach(opt => {
        const button = document.createElement('button');
        button.classList.add('btn-option');
        button.innerText = opt;
        button.onclick = () => checkAnswer(button, opt);
        optionsGrid.appendChild(button);
    });
}

function startTimer() {
    clearInterval(timerInterval);
    timeLeft = 15;
    timerBar.style.width = '100%';
    timerBar.style.backgroundColor = '#22c55e';

    timerInterval = setInterval(() => {
        timeLeft -= 0.1;
        let percentage = (timeLeft / 15) * 100;
        timerBar.style.width = percentage + '%';

        if(timeLeft <= 5) {
            timerBar.style.backgroundColor = '#ef4444'; // Berubah merah saat mepet
        }

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            lockOptionsAndNext(false); // Dianggap salah jika waktu habis
        }
    }, 100);
}

function checkAnswer(selectedButton, selectedValue) {
    clearInterval(timerInterval);
    const isCorrect = selectedValue === correctAnswer;
    
    if (isCorrect) {
        selectedButton.classList.add('correct');
        score += 10;
        scoreText.innerText = score;
        feedbackText.innerHTML = "<span style='color: var(--success);'>Benar! 🎯</span>";
    } else {
        selectedButton.classList.add('wrong');
        feedbackText.innerHTML = `<span style='color: var(--danger);'>Salah! Jawaban: ${correctAnswer}</span>`;
        
        // Tunjukkan mana jawaban yang benar
        Array.from(optionsGrid.children).forEach(btn => {
            if(parseInt(btn.innerText) === correctAnswer) {
                btn.classList.add('correct');
            }
        });
    }
    
    lockOptionsAndNext(true);
}

function lockOptionsAndNext(userClicked) {
    // Kunci semua tombol agar tidak bisa diklik dua kali
    Array.from(optionsGrid.children).forEach(btn => btn.disabled = true);
    
    if(!userClicked) {
        feedbackText.innerHTML = `<span style='color: var(--danger);'>Waktu Habis! Jawaban: ${correctAnswer}</span>`;
        Array.from(optionsGrid.children).forEach(btn => {
            if(parseInt(btn.innerText) === correctAnswer) btn.classList.add('correct');
        });
    }

    // Beri jeda 1.5 detik untuk melihat jawaban sebelum lanjut ke soal berikutnya
    setTimeout(() => {
        generateQuestion();
    }, 1500);
}

function endGame() {
    gameScreen.classList.remove('active');
    resultScreen.classList.add('active');
    
    document.getElementById('final-score').innerText = score;
    
    let evaluation = '';
    if(score === 100) evaluation = "Luar biasa! Kamu sudah siap tempur di Tes TIU! 🚀";
    else if(score >= 70) evaluation = "Sudah bagus, tingkatkan lagi akurasi dan kecepatanmu! 💪";
    else evaluation = "Masih lambat? Yuk latihan terus sampai lancar otomatis! 📚";
    
    document.getElementById('evaluation-text').innerText = evaluation;
}

function backToMenu() {
    resultScreen.classList.remove('active');
    menuScreen.classList.add('active');
}
