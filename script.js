let currentLevel = 'normal'; // easy, normal, hard
let currentOperation = '';
let currentQuestionIndex = 0;
let score = 0;
let correctAnswer = ''; // Bisa angka atau teks (A, B, C untuk tipe X-Y)
let timerInterval;
let timeLeft = 15;
let maxTime = 15;
let chances = 2; // Fitur 2 Kali Kesempatan Menjawab
const totalQuestions = 20; // Upgrade ke 20 Soal

// Selectors
const levelScreen = document.getElementById('level-screen');
const menuScreen = document.getElementById('menu-screen');
const gameScreen = document.getElementById('game-screen');
const resultScreen = document.getElementById('result-screen');
const questionBox = document.getElementById('question-box');
const optionsGrid = document.getElementById('options-grid');
const feedbackText = document.getElementById('feedback');
const scoreText = document.getElementById('score');
const questionCountText = document.getElementById('question-count');
const chancesCountText = document.getElementById('chances-count');
const timerBar = document.getElementById('timer-bar');

function selectLevel(level) {
    currentLevel = level;
    // Tentukan limit detik berdasarkan level kesulitan
    if (level === 'easy') maxTime = 25;
    else if (level === 'normal') maxTime = 15;
    else if (level === 'hard') maxTime = 10;

    levelScreen.classList.remove('active');
    menuScreen.classList.add('active');
    document.getElementById('menu-title').innerText = `Pilih Mode Soal (Level: ${level.toUpperCase()}):`;
}

function backToLevel() {
    menuScreen.classList.remove('active');
    levelScreen.classList.add('active');
}

function startGame(operation) {
    currentOperation = operation;
    currentQuestionIndex = 0;
    score = 0;
    
    menuScreen.classList.remove('active');
    gameScreen.classList.add('active');
    
    scoreText.innerText = score;
    generateQuestion();
}

function generateQuestion() {
    feedbackText.innerText = '';
    chances = 2;
    chancesCountText.innerText = chances;
    
    currentQuestionIndex++;
    if (currentQuestionIndex > totalQuestions) {
        endGame();
        return;
    }
    
    questionCountText.innerText = currentQuestionIndex;
    
    // Deteksi tipe soal (Operasi Matematika Biasa vs Analisis X & Y)
    if (currentOperation === 'xy') {
        generateXYQuestion();
    } else {
        generateStandardQuestion();
    }
    
    startTimer();
}

function generateStandardQuestion() {
    let num1, num2;
    let opSymbol = '';
    let opType = currentOperation === 'campur' ? ['tambah', 'kurang', 'kali', 'bagi'][Math.floor(Math.random() * 4)] : currentOperation;

    // Skala Angka Berdasarkan Level Kesulitan
    let multiplier = currentLevel === 'easy' ? 0.5 : (currentLevel === 'hard' ? 2 : 1);

    if (opType === 'tambah') {
        num1 = Math.floor((Math.random() * 80 + 15) * multiplier);
        num2 = Math.floor((Math.random() * 80 + 15) * multiplier);
        correctAnswer = num1 + num2;
        opSymbol = '+';
    } else if (opType === 'kurang') {
        num1 = Math.floor((Math.random() * 80 + 30) * multiplier);
        num2 = Math.floor(Math.random() * (num1 - 5)) + 5;
        correctAnswer = num1 - num2;
        opSymbol = '-';
    } else if (opType === 'kali') {
        num1 = Math.floor((Math.random() * 10 + 3) * (currentLevel === 'hard' ? 1.8 : 1));
        num2 = Math.floor((Math.random() * 9 + 2) * (currentLevel === 'hard' ? 1.5 : 1));
        correctAnswer = num1 * num2;
        opSymbol = '×';
    } else if (opType === 'bagi') {
        num2 = Math.floor((Math.random() * 8 + 2) * (currentLevel === 'hard' ? 1.5 : 1));
        let baseAnswer = Math.floor((Math.random() * 9 + 2) * (currentLevel === 'hard' ? 1.5 : 1));
        num1 = num2 * baseAnswer;
        correctAnswer = baseAnswer;
        opSymbol = '÷';
    }

    questionBox.innerHTML = `<div style="text-align:center; font-size: 2.2rem; font-weight:700;">${num1} ${opSymbol} ${num2} = ?</div>`;
    
    // Susun Pilihan Jawaban Angka
    let options = [correctAnswer];
    while(options.length < 4) {
        let deviation = (Math.floor(Math.random() * 5) + 1) * (Math.random() < 0.5 ? 1 : -1);
        let wrongOption = correctAnswer + deviation;
        if(wrongOption >= 0 && !options.includes(wrongOption)) {
            options.push(wrongOption);
        }
    }
    options.sort(() => Math.random() - 0.5);
    renderOptions(options, false);
}

function generateXYQuestion() {
    // Kumpulan pola Soal Cerita CPNS (Perbandingan Nilai X dan Y)
    const templates = [
        { text: "Jika X adalah hasil dari 15% dari 200, dan Y adalah akar dari 900. Manakah hubungan yang benar?", x: 15/100*200, y: Math.sqrt(900) },
        { text: "Sebuah toko baju mendiskon harga baju dari Rp100.000 menjadi Rp80.000. Jika X = persentase diskon tersebut, dan Y = 25. Maka hubungan X dan Y...", x: 20, y: 25 },
        { text: "Jika X = 30% dari 60 dan Y = 60% dari 30, hubungan yang paling tepat adalah...", x: 18, y: 18 },
        { text: "Bila sebuah mobil menempuh jarak 120 km dalam waktu 2 jam, X = kecepatan mobil dalam km/jam. Sedangkan Y = bilangan prima antara 50 dan 55. Maka...", x: 60, y: 53 },
        { text: "Jika X adalah volume kubus dengan rusuk 4 cm, dan Y adalah luas permukaan kubus tersebut. Hubungan yang tepat adalah...", x: 64, y: 96 },
        { text: "Jika X = 1/3 + 1/4 dan Y = 1/2. Manakah kesimpulan yang sah?", x: 7/12, y: 0.5 },
        { text: "Suatu proyek selesai dalam 12 hari oleh 5 pekerja. Jika pekerja ditambah menjadi 6 orang, waktu pengerjaan menjadi X hari. Diketahui Y = 10 hari. Maka...", x: 10, y: 10 }
    ];

    // Ambil acak template soal cerita
    let selected = templates[Math.floor(Math.random() * templates.length)];
    
    // Variasi angka sedikit berdasarkan Level kesulitan agar tidak monoton
    let modifier = currentLevel === 'easy' ? 2 : (currentLevel === 'hard' ? -2 : 0);
    let finalX = selected.x + modifier;
    let finalY = selected.y;

    let questionText = selected.text;
    // ganti teks jika terkena pengaruh level secara dinamis (opsional, untuk kesederhanaan kita pakai template inti)
    questionBox.innerHTML = `<div style="font-size:1.1rem; font-weight:normal; margin-bottom:10px;"><b>Soal Cerita Perbandingan:</b></div>${questionText}`;

    if (finalX > finalY) correctAnswer = 'A';
    else if (finalX < finalY) correctAnswer = 'B';
    else correctAnswer = 'C';

    const xyOptions = [
        { id: 'A', text: 'A. X > Y (Nilai X lebih besar dari Y)' },
        { id: 'B', text: 'B. X < Y (Nilai X lebih kecil dari Y)' },
        { id: 'C', text: 'C. X = Y (Nilai X sama dengan nilai Y)' },
        { id: 'D', text: 'D. Hubungan antara X dan Y tidak dapat ditentukan' }
    ];

    renderOptions(xyOptions, true);
}

function renderOptions(optionsArray, isXY) {
    optionsGrid.innerHTML = '';
    
    optionsArray.forEach(opt => {
        const button = document.createElement('button');
        button.classList.add('btn-option');
        
        if (isXY) {
            button.innerText = opt.text;
            button.onclick = () => checkAnswer(button, opt.id);
        } else {
            button.innerText = opt;
            button.onclick = () => checkAnswer(button, opt);
        }
        optionsGrid.appendChild(button);
    });
}

function startTimer() {
    clearInterval(timerInterval);
    timeLeft = maxTime;
    timerBar.style.width = '100%';
    timerBar.style.backgroundColor = '#22c55e';

    timerInterval = setInterval(() => {
        timeLeft -= 0.1;
        let percentage = (timeLeft / maxTime) * 100;
        timerBar.style.width = percentage + '%';

        if(timeLeft <= maxTime * 0.35) {
            timerBar.style.backgroundColor = '#ef4444';
        }

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            revealCorrectAnswer(false); // Waktu habis langsung dianggap salah total
        }
    }, 100);
}

function checkAnswer(selectedButton, selectedValue) {
    const isCorrect = selectedValue === correctAnswer;
    
    if (isCorrect) {
        clearInterval(timerInterval);
        selectedButton.classList.add('correct');
        
        // Beri skor penuh jika tebakan ke-1 benar, beri setengah skor jika tebakan ke-2 benar
        score += (chances === 2) ? 5 : 2; 
        scoreText.innerText = score;
        feedbackText.innerHTML = "<span style='color: var(--success);'>Benar! 🎯 Nilai ditambahkan.</span>";
        lockOptionsAndNext();
    } else {
        // JIKA SALAH
        chances--;
        chancesCountText.innerText = chances;
        selectedButton.classList.add('wrong');
        selectedButton.disabled = true; // Matikan tombol yang sudah salah dipilih

        if (chances > 0) {
            feedbackText.innerHTML = `<span style='color: var(--warning);'>Salah! Sisa 1 kesempatan lagi. Coba hitung ulang!</span>`;
        } else {
            // Kesempatan habis total
            clearInterval(timerInterval);
            feedbackText.innerHTML = `<span style='color: var(--danger);'>Kesempatan habis!</span>`;
            revealCorrectAnswer(true);
        }
    }
}

function revealCorrectAnswer(wasActiveClick) {
    // Kunci seluruh tombol tersisa
    Array.from(optionsGrid.children).forEach(btn => btn.disabled = true);
    
    // Cari dan tandai jawaban yang benar dengan warna hijau
    Array.from(optionsGrid.children).forEach(btn => {
        if (currentOperation === 'xy') {
            // Untuk jenis X-Y, cek huruf depannya (A., B., C.)
            if(btn.innerText.startsWith(correctAnswer)) btn.classList.add('correct');
        } else {
            if(parseInt(btn.innerText) === correctAnswer) btn.classList.add('correct');
        }
    });

    if(!wasActiveClick) {
        feedbackText.innerHTML = `<span style='color: var(--danger);'>Waktu Habis!</span>`;
    }

    setTimeout(() => {
        generateQuestion();
    }, 2000);
}

function lockOptionsAndNext() {
    Array.from(optionsGrid.children).forEach(btn => btn.disabled = true);
    setTimeout(() => {
        generateQuestion();
    }, 1500);
}

function endGame() {
    gameScreen.classList.remove('active');
    resultScreen.classList.add('active');
    
    document.getElementById('final-score').innerText = score;
    
    // Kalkulasi pesan evaluasi (Maksimal poin: 100)
    let evaluation = '';
    if(score >= 85) evaluation = "Kategori A: Luar biasa! Kecepatan dan ketepatanmu setara peserta CPNS ranking atas! 🚀";
    else if(score >= 60) evaluation = "Kategori B: Sudah cukup aman passing grade, pertahankan dan terus asah kestabilan fokusmu! 🔥";
    else evaluation = "Kategori C: Masih sering terjebak/kehabisan waktu. Yuk sering-sering latihan di level Mudah dulu! 📚";
    
    document.getElementById('evaluation-text').innerText = evaluation;
}

function restartToMain() {
    resultScreen.classList.remove('active');
    levelScreen.classList.add('active');
}
