let currentLevel = 'normal'; 
let currentOperation = '';
let currentPracticeIndex = 1; // Latihan 1, 2, atau 3
let currentQuestionIndex = 0;
let score = 0;
let correctAnswer = ''; 
let timerInterval;
let timeLeft = 15;
let maxTime = 15;
let chances = 2; 
let totalQuestions = 20; 

// Penyimpanan soal aktif yang sedang diujikan
let activeTextQuestions = [];

// DATA BANK SOAL CERITA (XY & ANALITIS) BERDASARKAN PAKET LATIHAN
const BANK_SOAL = {
    xy: {
        1: [
            { text: "Jika X adalah hasil dari 15% dari 200, dan Y adalah akar dari 900. Manakah hubungan yang benar?", x: 30, y: 30 },
            { text: "Sebuah toko baju mendiskon harga baju dari Rp100.000 menjadi Rp80.000. Jika X = persentase diskon tersebut, dan Y = 25. Maka hubungan X dan Y...", x: 20, y: 25 },
            { text: "Jika X = 30% dari 60 dan Y = 60% dari 30, hubungan yang paling tepat adalah...", x: 18, y: 18 },
            { text: "Bila sebuah mobil menempuh jarak 120 km dalam waktu 2 jam, X = kecepatan mobil dalam km/jam. Sedangkan Y = bilangan prima antara 50 dan 55. Maka...", x: 60, y: 53 },
            { text: "Jika X adalah volume kubus dengan rusuk 4 cm, dan Y adalah luas permukaan kubus tersebut. Hubungan yang tepat adalah...", x: 64, y: 96 }
        ],
        2: [
            { text: "Jika X = 1/3 + 1/4 dan Y = 1/2. Manakah kesimpulan yang sah?", x: 0.58, y: 0.5 },
            { text: "Suatu proyek selesai dalam 12 hari oleh 5 pekerja. Jika pekerja ditambah menjadi 6 orang, waktu pengerjaan menjadi X hari. Diketahui Y = 10 hari. Maka...", x: 10, y: 10 },
            { text: "Jika X = harga 3 buku tulis seharga Rp12.000 per buku, dan Y = harga 2 buah pulpen seharga Rp19.000 per pulpen. Maka...", x: 36000, y: 38000 },
            { text: "Jika X = bilangan bulat antara 12 dan 15, sedangkan Y = bilangan genap antara 11 dan 15. Maka hubungan X dan Y adalah...", x: 13.5, y: 13 }, // representasi acak rata-rata nilai
            { text: "Sebuah persegi panjang memiliki panjang 8 cm dan lebar 6 cm. X = keliling persegi panjang tersebut, Y = Luas persegi panjang tersebut.", x: 28, y: 48 }
        ],
        3: [
            { text: "Jika X = 0,333 dari 90 dan Y = 5² + 5. Maka hubungan yang benar adalah...", x: 30, y: 30 },
            { text: "Suatu adonan kue membutuhkan 3 kg tepung untuk membuat 15 kue. Jika X = tepung yang dibutuhkan untuk membuat 20 kue, dan Y = 4.5 kg. Maka...", x: 4, y: 4.5 },
            { text: "Jika X = jumlah menit dalam 2,5 jam, dan Y = jumlah detik dalam 2,5 menit. Maka hubungan yang paling tepat...", x: 150, y: 150 },
            { text: "Jika X = 77% dari 100, dan Y = akar pangkat dua dari 6400 dikurangi 3. Maka...", x: 77, y: 77 },
            { text: "Andi mengendarai sepeda dengan kecepatan 15 km/jam selama 4 jam (X = jarak ditempuh). Budi berjalan kaki dengan kecepatan 5 km/jam selama 11 jam (Y = jarak ditempuh).", x: 60, y: 55 }
        ]
    },
    analitis: {
        1: [
            { text: "Ali, Budi, Citra, dan Dedi sedang mengantre di bank. Budi berdiri di depan Citra. Ali berdiri di belakang Citra. Dedi berdiri di paling depan. Siapakah yang berdiri di urutan ketiga?", options: ["Ali", "Budi", "Citra", "Dedi"], ans: "C" },
            { text: "Dalam ujian matematika, nilai Ani lebih tinggi dari Boni. Nilai Candra sama dengan nilai Dodi. Nilai Boni lebih tinggi dari Candra. Siapakah yang memiliki nilai paling rendah?", options: ["Ani", "Boni", "Candra dan Dodi", "Tidak bisa ditentukan"], ans: "C" },
            { text: "Lima orang siswa (P, Q, R, S, T) mengikuti tes. Skor P lebih tinggi dari Q. Skor R lebih rendah dari S. Skor Q lebih tinggi dari S. Siapa yang mendapatkan skor tertinggi?", options: ["P", "Q", "S", "R"], ans: "A" },
            { text: "Di sebuah meja bundar, terdapat 4 orang: Eko, Fani, Gita, dan Hari. Eko berhadapan dengan Gita. Fani duduk di sebelah kanan Eko. Siapakah yang duduk di hadapan Fani?", options: ["Eko", "Gita", "Hari", "Tidak ada"], ans: "C" },
            { text: "Kota K lebih panas dari Kota L, tetapi lebih dingin dari Kota M. Kota N lebih dingin dari Kota L. Kota manakah yang suhunya paling dingin?", options: ["Kota K", "Kota L", "Kota M", "Kota N"], ans: "D" }
        ],
        2: [
            { text: "Geri mengantre tepat di belakang Hani. Jono mengantre di depan Kemal. Hani berada di depan Jono. Siapakah yang berada di antrean paling belakang?", options: ["Geri", "Hani", "Jono", "Kemal"], ans: "D" },
            { text: "Harga emas lebih mahal daripada perak. Harga perak lebih mahal daripada tembaga. Harga platina lebih mahal daripada emas. Logam mana yang paling murah?", options: ["Emas", "Perak", "Tembaga", "Platina"], ans: "C" },
            { text: "Rumah Soni lebih dekat ke sekolah daripada rumah Toni. Rumah Ulfa lebih jauh daripada rumah Toni. Rumah Vera adalah yang paling dekat ke sekolah. Rumah siapa yang paling jauh dari sekolah?", options: ["Soni", "Toni", "Ulfa", "Vera"], ans: "C" },
            { text: "Toni, Rudi, dan Jaka memakai baju dengan warna berbeda: merah, kuning, hijau. Toni tidak suka warna merah. Rudi memakai baju warna kuning. Warna baju apa yang dipakai Jaka?", options: ["Merah", "Kuning", "Hijau", "Biru"], ans: "A" },
            { text: "Dalam perlombaan lari, Hendra selesai sebelum Iwan. Iwan selesai setelah Jaka, tetapi Jaka selesai setelah Hendra. Siapakah pemenang perlombaan tersebut?", options: ["Hendra", "Iwan", "Jaka", "Tidak ada"], ans: "A" }
        ],
        3: [
            { text: "Dalam struktur organisasi perusahaan, Pak Adi adalah atasan Pak Budi. Pak Budi adalah atasan Siska dan Doni. Siska senior dari Doni. Siapakah pemegang jabatan tertinggi di antara mereka?", options: ["Pak Adi", "Pak Budi", "Siska", "Doni"], ans: "A" },
            { text: "Hari ini ada jadwal piket kelas. Desi harus piket sebelum Elisa. Fitri piket setelah Elisa. Gita piket paling pertama. Siapakah yang piket di urutan terakhir?", options: ["Desi", "Elisa", "Fitri", "Gita"], ans: "C" },
            { text: "Berat badan Mita lebih besar daripada Nina. Berat badan Oki lebih kecil daripada Nina tetapi lebih besar dari Prita. Siapa yang memiliki berat badan paling ringan?", options: ["Mita", "Nina", "Oki", "Prita"], ans: "D" },
            { text: "Rak buku di perpustakaan menyusun buku dari kiri ke kanan. Buku Sejarah di kiri buku Geografi. Buku Matematika di kanan Geografi. Buku Bahasa di paling kanan. Buku apa yang berada di posisi kedua dari kiri?", options: ["Sejarah", "Geografi", "Matematika", "Bahasa"], ans: "B" },
            { text: "Sebuah gedung memiliki 4 lantai. Ruang Akuntansi di atas ruang HRD. Ruang Pemasaran di bawah ruang HRD. Ruang Direksi di lantai paling atas. Ruang apa yang berada di lantai 2?", options: ["Direksi", "Akuntansi", "HRD", "Pemasaran"], ans: "C" }
        ]
    }
};

// Selectors
const levelScreen = document.getElementById('level-screen');
const menuScreen = document.getElementById('menu-screen');
const practiceScreen = document.getElementById('practice-screen');
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
    levelScreen.classList.remove('active');
    menuScreen.classList.add('active');
    document.getElementById('menu-title').innerText = `Pilih Mode Soal (Level: ${level.toUpperCase()}):`;
}

function backToLevel() {
    menuScreen.classList.remove('active');
    levelScreen.classList.add('active');
}

function selectMode(operation) {
    currentOperation = operation;
    
    if (operation === 'xy' || operation === 'analitis') {
        // Jika mode cerita, arahkan ke halaman pilih latihan dulu
        menuScreen.classList.remove('active');
        practiceScreen.classList.add('active');
        document.getElementById('practice-title').innerText = `Mode ${operation.toUpperCase()} - Pilih Paket Latihan:`;
    } else {
        // Jika matematika biasa, langsung mulai game
        practiceScreen.classList.remove('active');
        menuScreen.classList.remove('active');
        startGame();
    }
}

function backToMenu() {
    practiceScreen.classList.remove('active');
    menuScreen.classList.add('active');
}

function startWithPractice(practiceNum) {
    currentPracticeIndex = practiceNum;
    practiceScreen.classList.remove('active');
    startGame();
}

function startGame() {
    currentQuestionIndex = 0;
    score = 0;
    scoreText.innerText = score;

    // Menentukan total soal berdasarkan tipe
    if (currentOperation === 'xy' || currentOperation === 'analitis') {
        // Ambil list soal berdasarkan operasi & latihan terpilih
        activeTextQuestions = [...BANK_SOAL[currentOperation][currentPracticeIndex]];
        // Acak urutan soalnya supaya bervariasi
        activeTextQuestions.sort(() => Math.random() - 0.5);
        totalQuestions = activeTextQuestions.length; // Otomatis 5 soal sesuai paket bank soal cerita
    } else {
        totalQuestions = 20; // Matematika biasa tetap 20 soal karena diacak rumus tanpa batas
    }

    document.getElementById('total-questions-text').innerText = totalQuestions;
    gameScreen.classList.add('active');
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
    
    // ATUR DURASI WAKTU BERDASARKAN MODE DAN LEVEL
    if (currentOperation === 'xy' || currentOperation === 'analitis') {
        optionsGrid.classList.add('full-column'); 
        
        if (currentLevel === 'easy') maxTime = 60;       
        else if (currentLevel === 'normal') maxTime = 50; 
        else if (currentLevel === 'hard') maxTime = 40;   
        
        if (currentOperation === 'xy') {
            generateXYQuestion();
        } else {
            generateAnalitisQuestion();
        }
    } else {
        optionsGrid.classList.remove('full-column'); 
        
        if (currentLevel === 'easy') maxTime = 25;
        else if (currentLevel === 'normal') maxTime = 15;
        else if (currentLevel === 'hard') maxTime = 10;
        
        generateStandardQuestion();
    }
    
    startTimer();
}

function generateStandardQuestion() {
    let num1, num2;
    let opSymbol = '';
    let opType = currentOperation === 'campur' ? ['tambah', 'kurang', 'kali', 'bagi'][Math.floor(Math.random() * 4)] : currentOperation;
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

    questionBox.style.fontSize = "2.2rem";
    questionBox.innerText = `${num1} ${opSymbol} ${num2} = ?`;
    
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
    // Ambil item soal dari antrean index berjalan
    let dataSoal = activeTextQuestions[currentQuestionIndex - 1];
    let modifier = currentLevel === 'easy' ? 2 : (currentLevel === 'hard' ? -2 : 0);
    let finalX = dataSoal.x + modifier;
    let finalY = dataSoal.y;

    questionBox.style.fontSize = "1.05rem";
    questionBox.innerHTML = `<div style="font-weight:bold; margin-bottom:5px; color:var(--primary)">Soal Perbandingan:</div>${dataSoal.text}`;

    if (finalX > finalY) correctAnswer = 'A';
    else if (finalX < finalY) correctAnswer = 'B';
    else correctAnswer = 'C';

    const xyOptions = [
        { id: 'A', text: 'A. X > Y (Nilai X lebih besar dari Y)' },
        { id: 'B', text: 'B. X < Y (Nilai X lebih kecil dari Y)' },
        { id: 'C', text: 'C. X = Y (Nilai X sama dengan nilai Y)' },
        { id: 'D', text: 'D. Hubungan X dan Y tidak dapat ditentukan' }
    ];

    renderOptions(xyOptions, true);
}

function generateAnalitisQuestion() {
    // Ambil item soal penalaran analitis dari paket latihan terpilih
    let dataSoal = activeTextQuestions[currentQuestionIndex - 1];
    
    questionBox.style.fontSize = "1.05rem";
    questionBox.innerHTML = `<div style="font-weight:bold; margin-bottom:5px; color:var(--primary)">Soal Penalaran Analitis:</div>${dataSoal.text}`;
    
    correctAnswer = dataSoal.ans; // Kunci jawaban berwujud 'A', 'B', 'C', atau 'D'

    // Pembuatan Opsi Pilihan Ganda Huruf Abjad secara Dinamis dan Bebas Error
    const abjad = ['A', 'B', 'C', 'D'];
    let formattedOptions = dataSoal.options.map((optTeks, idx) => {
        return {
            id: abjad[idx],
            text: `${abjad[idx]}. ${optTeks}`
        };
    });
    
    renderOptions(formattedOptions, true);
}

function renderOptions(optionsArray, isTextMode) {
    optionsGrid.innerHTML = '';
    
    optionsArray.forEach(opt => {
        const button = document.createElement('button');
        button.classList.add('btn-option');
        
        if (isTextMode) {
            button.innerText = opt.text;
            button.setAttribute('data-value', opt.id);
            button.onclick = () => checkAnswer(button, opt.id);
        } else {
            button.innerText = opt;
            button.setAttribute('data-value', opt);
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
            revealCorrectAnswer(false); 
        }
    }, 100);
}

function checkAnswer(selectedButton, selectedValue) {
    const isCorrect = String(selectedValue) === String(correctAnswer);
    
    if (isCorrect) {
        clearInterval(timerInterval);
        selectedButton.classList.add('correct');
        
        score += (chances === 2) ? 5 : 2; 
        scoreText.innerText = score;
        feedbackText.innerHTML = "<span style='color: var(--success);'>Benar! 🎯 Nilai bertambah.</span>";
        lockOptionsAndNext();
    } else {
        chances--;
        chancesCountText.innerText = chances;
        selectedButton.classList.add('wrong');
        selectedButton.disabled = true; 

        if (chances > 0) {
            feedbackText.innerHTML = `<span style='color: var(--warning);'>Salah! Sisa 1 kesempatan lagi. Ayo telusuri lagi!</span>`;
        } else {
            clearInterval(timerInterval);
            feedbackText.innerHTML = `<span style='color: var(--danger);'>Kesempatan habis!</span>`;
            revealCorrectAnswer(true);
        }
    }
}

function revealCorrectAnswer(wasActiveClick) {
    Array.from(optionsGrid.children).forEach(btn => {
        btn.disabled = true;
        let btnValue = btn.getAttribute('data-value');
        
        if (String(btnValue) === String(correctAnswer)) {
            btn.classList.add('correct');
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
    
    let maxScorePossible = totalQuestions * 5;
    let evaluation = '';
    if(score >= maxScorePossible * 0.8) evaluation = "Kategori A: Luar biasa! Logika penalaran dan kecepatan analisismu tajam banget! 🚀";
    else if(score >= maxScorePossible * 0.5) evaluation = "Kategori B: Pemahaman logikamu sudah bagus, tingkatkan ketelitian agar tidak terkecoh! 🔥";
    else evaluation = "Kategori C: Masih sering bingung mengatur posisi urutan. Yuk coba latihan lagi pelan-pelan! 📚";
    
    document.getElementById('evaluation-text').innerText = evaluation;
}

function restartToMain() {
    resultScreen.classList.remove('active');
    levelScreen.classList.add('active');
}
