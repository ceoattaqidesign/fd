// Data Kuis (Contoh Sederhana)
const quizData = {
    general: {
        name: "Pengetahuan Umum",
        icon: "🌍",
        difficulty: "Mudah",
        time: 30,
        description: "Tes wawasan umum Anda",
        questions: [
            {
                question: "Apa nama ibukota Indonesia saat ini?",
                options: { A: "Jakarta", B: "Bandung", C: "Surabaya", D: "Yogyakarta" },
                answer: "A",
                explanation: "Jakarta adalah ibukota negara Republik Indonesia saat ini, meskipun ibukota baru sedang dibangun di Kalimantan Timur (Nusantara)."
            },
            {
                question: "Planet manakah yang dikenal sebagai 'Planet Merah'?",
                options: { A: "Venus", B: "Mars", C: "Jupiter", D: "Saturnus" },
                answer: "B",
                explanation: "Mars sering disebut 'Planet Merah' karena warna kemerahan yang berasal dari besi oksida (karat) di permukaannya."
            },
            {
                question: "Siapa penemu lampu pijar?",
                options: { A: "Nikola Tesla", B: "Thomas Edison", C: "Alexander Graham Bell", D: "Albert Einstein" },
                answer: "B",
                explanation: "Thomas Edison diakui secara luas sebagai penemu lampu pijar yang praktis dan dapat dipasarkan."
            },
            {
                question: "Sungai terpanjang di dunia adalah?",
                options: { A: "Amazon", B: "Nil", C: "Yangtze", D: "Mississippi" },
                answer: "B",
                explanation: "Sungai Nil di Afrika secara tradisional dianggap sebagai sungai terpanjang di dunia, meskipun perdebatan mengenai panjang Sungai Amazon masih berlangsung."
            },
            {
                question: "Berapa jumlah benua di dunia?",
                options: { A: "5", B: "6", C: "7", D: "8" },
                answer: "C",
                explanation: "Secara umum diakui ada 7 benua: Asia, Afrika, Amerika Utara, Amerika Selatan, Antartika, Eropa, dan Australia (Oseania)."
            }
        ]
    },
    science: {
        name: "Sains & Teknologi",
        icon: "🔬",
        difficulty: "Sedang",
        time: 45,
        description: "Uji pengetahuan sains Anda",
        questions: [
            // Placeholder questions
        ]
    },
    history: {
        name: "Sejarah",
        icon: "📚",
        difficulty: "Sedang",
        time: 40,
        description: "Jelajahi peristiwa bersejarah",
        questions: [
            // Placeholder questions
        ]
    },
    sports: {
        name: "Olahraga",
        icon: "⚽",
        difficulty: "Mudah",
        time: 25,
        description: "Tes pengetahuan olahraga Anda",
        questions: [
            // Placeholder questions
        ]
    }
};

// State Aplikasi
let currentPage = 'home';
let currentQuizCategory = null;
let currentQuizQuestions = [];
let currentQuestionIndex = 0;
let selectedAnswer = null;
let quizInterval = null;
let timeLeft = 0;
let totalScore = 0;
let correctAnswersCount = 0;

// Elemen DOM Utama
const pages = {
    'home': document.getElementById('home-page'),
    'quiz': document.getElementById('quiz-page'),
    'leaderboard': document.getElementById('leaderboard-page'),
    'help': document.getElementById('help-page'),
    'category-screen': document.getElementById('category-screen'),
    'welcome-screen': document.getElementById('welcome-screen'),
    'quiz-screen': document.getElementById('quiz-screen'),
    'result-screen': document.getElementById('result-screen'),
    'review-screen': document.getElementById('review-screen'),
    'loading-state': document.getElementById('loading-state')
};
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const closeMobileMenuBtn = document.getElementById('close-mobile-menu');
const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');

// --- FUNGSI NAVIGASI ---

/**
 * Menampilkan halaman utama berdasarkan ID
 * @param {string} pageId - ID halaman (misalnya 'home', 'quiz', 'leaderboard')
 */
function showPage(pageId) {
    // Logika untuk menampilkan/menyembunyikan halaman utama
    // Pastikan hanya halaman utama yang memiliki suffix '-page'
    const allPages = document.querySelectorAll('.page'); 
    allPages.forEach(page => {
        page.classList.add('hidden');
    });

    const targetPage = document.getElementById(pageId + '-page');
    if (targetPage) {
        targetPage.classList.remove('hidden');
        currentPage = pageId;
        window.scrollTo(0, 0); // Gulir ke atas halaman baru
    }

    // Tutup menu mobile jika terbuka
    if (mobileMenu && mobileMenu.classList.contains('open')) {
        closeMobileMenu();
    }

    // Tampilkan layar awal kuis saat masuk ke halaman kuis
    if (pageId === 'quiz') {
        showQuizScreen('category-screen');
    }
}

function toggleMobileMenu() {
    mobileMenu.classList.toggle('open');
    mobileMenuOverlay.classList.toggle('hidden');
}

function closeMobileMenu() {
    mobileMenu.classList.remove('open');
    mobileMenuOverlay.classList.add('hidden');
}

// --- FUNGSI KUIS ---

/**
 * Menampilkan layar kuis tertentu (misalnya kategori, welcome, kuis, hasil)
 * @param {string} screenId - ID layar kuis (misalnya 'category-screen', 'quiz-screen')
 */
function showQuizScreen(screenId) {
    // Sembunyikan semua layar kuis (category, welcome, quiz, result, review, loading)
    ['category-screen', 'welcome-screen', 'quiz-screen', 'result-screen', 'review-screen', 'loading-state'].forEach(id => {
        const screen = document.getElementById(id);
        if (screen) {
            screen.classList.add('hidden');
        }
    });

    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.remove('hidden');
    }
}

/**
 * Memilih kategori kuis dan menampilkan layar selamat datang.
 * Fungsi ini dipanggil dari HTML (onclick pada category-card).
 * @param {string} category - Kunci kategori ('general', 'science', dll.)
 */
function selectCategory(category) {
    currentQuizCategory = category;
    const categoryData = quizData[category];
    
    // Update Welcome Screen details
    const categoryIcon = document.getElementById('category-icon');
    const categoryName = document.getElementById('category-name');
    const categoryDescription = document.getElementById('category-description');
    const timeLimit = document.getElementById('time-limit');
    const difficultyLevel = document.getElementById('difficulty-level');

    if (categoryIcon) categoryIcon.textContent = categoryData.icon;
    if (categoryName) categoryName.textContent = categoryData.name;
    if (categoryDescription) categoryDescription.textContent = categoryData.description;
    if (timeLimit) timeLimit.textContent = categoryData.time + 's';
    if (difficultyLevel) difficultyLevel.textContent = categoryData.difficulty;
    
    // Tampilkan Welcome Screen
    showQuizScreen('welcome-screen');
    
    // Tambahkan event listener untuk tombol "Mulai Kuis"
    const startQuizBtn = document.getElementById('start-quiz-btn');
    if (startQuizBtn) startQuizBtn.onclick = startQuiz;
}

/**
 * Memulai kuis, mereset state, dan memuat pertanyaan pertama.
 */
function startQuiz() {
    if (!currentQuizCategory || !quizData[currentQuizCategory]) return;

    // Reset state
    currentQuestionIndex = 0;
    selectedAnswer = null;
    totalScore = 0;
    correctAnswersCount = 0;
    
    // Ambil data kuis
    currentQuizQuestions = quizData[currentQuizCategory].questions;

    // Tampilkan layar loading sebentar
    showQuizScreen('loading-state');

    // Tunggu sebentar lalu mulai kuis
    setTimeout(() => {
        showQuizScreen('quiz-screen');
        loadQuestion();
    }, 1000);
}

/**
 * Memuat pertanyaan kuis saat ini ke UI.
 */
function loadQuestion() {
    clearInterval(quizInterval);
    selectedAnswer = null;

    const questionData = currentQuizQuestions[currentQuestionIndex];
    const totalQuestions = currentQuizQuestions.length;
    const timeLimit = quizData[currentQuizCategory].time;
    
    if (!questionData) {
        // Kuis selesai
        showResult();
        return;
    }

    // Reset UI
    const questionNumberEl = document.getElementById('question-number');
    const categoryBadgeEl = document.getElementById('category-badge');
    const questionTextEl = document.getElementById('question-text');
    const explanationContainerEl = document.getElementById('explanation-container');
    const submitAnswerBtn = document.getElementById('submit-answer-btn');

    if (questionNumberEl) questionNumberEl.textContent = `Pertanyaan ${currentQuestionIndex + 1}/${totalQuestions}`;
    if (categoryBadgeEl) categoryBadgeEl.textContent = quizData[currentQuizCategory].name;
    if (questionTextEl) questionTextEl.textContent = questionData.question;
    if (explanationContainerEl) explanationContainerEl.classList.add('hidden');
    if (submitAnswerBtn) {
        submitAnswerBtn.disabled = true;
        submitAnswerBtn.textContent = 'Submit Jawaban';
        submitAnswerBtn.onclick = () => submitAnswer(false);
    }

    // Tampilkan Opsi Jawaban
    const optionsContainer = document.getElementById('options-container');
    if (optionsContainer) {
        optionsContainer.innerHTML = ''; // Kosongkan opsi lama
        
        const optionKeys = Object.keys(questionData.options);
        optionKeys.forEach(key => {
            const optionText = questionData.options[key];
            const optionElement = document.createElement('div');
            optionElement.classList.add('card', 'card-question', 'p-4', 'sm:p-5', 'flex', 'items-center', 'space-x-4', 'hover-lift');
            optionElement.setAttribute('data-option', key);
            optionElement.onclick = () => selectAnswer(optionElement, key);
            optionElement.innerHTML = `
                <div class="w-8 h-8 flex-shrink-0 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center font-bold text-sm">${key}</div>
                <span class="text-base text-gray-700">${optionText}</span>
            `;
            optionsContainer.appendChild(optionElement);
        });
    }
    
    // Mulai Timer
    timeLeft = timeLimit;
    updateTimerDisplay();
    quizInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            clearInterval(quizInterval);
            // Waktu habis, jawab otomatis sebagai salah
            submitAnswer(true); 
        }
    }, 1000);
    
    // Update Progress Bar
    const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) progressBar.style.width = `${progressPercentage}%`;
}

/**
 * Memperbarui tampilan timer di UI.
 */
function updateTimerDisplay() {
    const timerDisplay = document.getElementById('timer-display');
    if (!timerDisplay) return;
    
    timerDisplay.textContent = `${timeLeft}s`;
    
    if (timeLeft <= 5) {
        timerDisplay.classList.remove('text-gray-600');
        timerDisplay.classList.add('text-red-500', 'font-extrabold', 'animate-pulse');
    } else {
        timerDisplay.classList.add('text-gray-600');
        timerDisplay.classList.remove('text-red-500', 'font-extrabold', 'animate-pulse');
    }
}

/**
 * Menandai jawaban yang dipilih pengguna.
 * @param {HTMLElement} element - Elemen opsi yang diklik
 * @param {string} answerKey - Kunci jawaban (A, B, C, D)
 */
function selectAnswer(element, answerKey) {
    const submitAnswerBtn = document.getElementById('submit-answer-btn');

    // Nonaktifkan jika sudah disubmit
    if (submitAnswerBtn && submitAnswerBtn.textContent === 'Jawaban Terkirim') return; 

    // Reset semua pilihan
    document.querySelectorAll('.card-question').forEach(card => {
        card.classList.remove('selected');
    });

    // Tandai pilihan yang dipilih
    element.classList.add('selected');
    selectedAnswer = answerKey;
    if (submitAnswerBtn) submitAnswerBtn.disabled = false;
}

/**
 * Memproses jawaban yang dipilih atau jika waktu habis.
 * @param {boolean} timeUp - True jika dipanggil karena waktu habis.
 */
function submitAnswer(timeUp = false) {
    clearInterval(quizInterval);
    
    const submitAnswerBtn = document.getElementById('submit-answer-btn');
    const questionData = currentQuizQuestions[currentQuestionIndex];
    
    if (!questionData || (!selectedAnswer && !timeUp)) return; 
    
    const isCorrect = selectedAnswer === questionData.answer;
    
    // Nonaktifkan semua klik opsi dan tombol submit
    document.querySelectorAll('.card-question').forEach(card => {
        card.onclick = null;
        card.classList.remove('hover-lift');
    });
    if (submitAnswerBtn) {
        submitAnswerBtn.disabled = true;
        submitAnswerBtn.textContent = 'Jawaban Terkirim';
        submitAnswerBtn.onclick = null; // Hapus event agar tidak terulang
    }
    
    // Logika Penilaian
    if (isCorrect) {
        correctAnswersCount++;
        // Hitung skor (misalnya: 1000 poin + (waktu tersisa * 10 poin))
        const timeBonus = timeLeft * 10;
        const questionScore = 1000 + timeBonus;
        totalScore += questionScore;
    } else if (timeUp) {
        // Waktu habis, skor 0
        selectedAnswer = 'Time Out';
    }
    
    // Tampilkan feedback visual dan penjelasan
    const optionsContainer = document.getElementById('options-container');
    if (optionsContainer) {
        Array.from(optionsContainer.children).forEach(option => {
            const optionKey = option.getAttribute('data-option');
            if (optionKey === questionData.answer) {
                option.classList.add('correct'); // Jawaban Benar
                option.classList.remove('selected');
            } else if (optionKey === selectedAnswer && selectedAnswer !== 'Time Out') {
                option.classList.add('incorrect'); // Jawaban Salah Anda
                option.classList.remove('selected');
            }
        });
    }
    
    const explanationTextEl = document.getElementById('explanation-text');
    const explanationContainerEl = document.getElementById('explanation-container');

    if (explanationTextEl) explanationTextEl.textContent = questionData.explanation;
    if (explanationContainerEl) explanationContainerEl.classList.remove('hidden');

    // Lanjut ke pertanyaan berikutnya setelah jeda
    setTimeout(() => {
        // Simpan riwayat jawaban di sini jika diperlukan
        
        currentQuestionIndex++;
        selectedAnswer = null; // Reset pilihan
        
        // Cek apakah ada pertanyaan berikutnya
        if (currentQuestionIndex < currentQuizQuestions.length) {
            loadQuestion();
        } else {
            showResult();
        }
    }, 3000); // Tampilkan hasil selama 3 detik
}

/**
 * Menampilkan layar hasil kuis.
 */
function showResult() {
    const totalQuestions = currentQuizQuestions.length;
    
    // Anggap total waktu adalah totalQuestions * waktu_maks - waktu_sisa_di_akhir
    // Ini adalah perhitungan kasar untuk demo, karena waktu yang dihabiskan untuk setiap soal tidak dilacak
    // Kita gunakan waktu dummy saja
    const totalTime = Math.floor(Math.random() * 150) + 60; // Random time between 60s and 210s
    
    // Update Result Screen
    const finalScoreEl = document.getElementById('final-score');
    const timeTakenEl = document.getElementById('time-taken');
    const resultIconEl = document.getElementById('result-icon');
    const resultTitleEl = document.getElementById('result-title');
    const resultMessageEl = document.getElementById('result-message');

    if (finalScoreEl) finalScoreEl.textContent = `${correctAnswersCount}/${totalQuestions}`;
    if (timeTakenEl) timeTakenEl.textContent = `${totalTime}s`;

    if (correctAnswersCount === totalQuestions) {
        if (resultIconEl) resultIconEl.textContent = '🎉';
        if (resultTitleEl) resultTitleEl.textContent = 'Sempurna!';
        if (resultMessageEl) resultMessageEl.textContent = 'Anda menjawab semua pertanyaan dengan benar. Skor Anda sangat mengesankan!';
    } else if (correctAnswersCount >= totalQuestions / 2) {
        if (resultIconEl) resultIconEl.textContent = '🥳';
        if (resultTitleEl) resultTitleEl.textContent = 'Luar Biasa!';
        if (resultMessageEl) resultMessageEl.textContent = `Anda mendapatkan ${correctAnswersCount} jawaban benar. Pertahankan!`;
    } else {
        if (resultIconEl) resultIconEl.textContent = '😅';
        if (resultTitleEl) resultTitleEl.textContent = 'Terus Berlatih!';
        if (resultMessageEl) resultMessageEl.textContent = `Anda mendapatkan ${correctAnswersCount} jawaban benar. Jangan menyerah, coba lagi!`;
    }
    
    showQuizScreen('result-screen');
}

/**
 * Menampilkan layar tinjauan jawaban.
 */
function showReviewScreen() {
    const reviewContainer = document.getElementById('review-questions');
    if (!reviewContainer) return;

    reviewContainer.innerHTML = '';

    currentQuizQuestions.forEach((q, index) => {
        // Catatan: Ini adalah placeholder, karena riwayat jawaban pengguna yang sebenarnya tidak disimpan.
        // Di sini saya hanya menampilkan jawaban benar.
        const reviewItem = document.createElement('div');
        reviewItem.classList.add('card', 'p-6', 'border-l-4', 'border-green-500', 'bg-green-50');
        reviewItem.innerHTML = `
            <p class="font-bold text-gray-900 mb-2">${index + 1}. ${q.question}</p>
            <p class="text-sm text-green-700">Jawaban Benar: ${q.options[q.answer]}</p>
            <div class="p-3 bg-white rounded-lg mt-3">
                <h4 class="font-bold text-gray-900 mb-1">Penjelasan:</h4>
                <p class="text-sm text-gray-700">${q.explanation}</p>
            </div>
        `;
        reviewContainer.appendChild(reviewItem);
    });
    
    showQuizScreen('review-screen');
}


// --- FUNGSI UTILITY ---

/**
 * Toggle (buka/tutup) FAQ Accordion.
 * Fungsi ini dipanggil dari HTML (onclick pada faq-item).
 * @param {HTMLElement} element - Elemen FAQ yang diklik.
 */
function toggleFaq(element) {
    const answer = element.querySelector('.faq-answer');
    const icon = element.querySelector('.faq-icon');

    if (!answer || !icon) return;

    const isOpen = element.classList.toggle('open');

    if (isOpen) {
        answer.classList.remove('hidden');
        icon.style.transform = 'rotate(180deg)';
    } else {
        answer.classList.add('hidden');
        icon.style.transform = 'rotate(0deg)';
    }
}

// --- INITIALIZATION ---
function initApp() {
    // Event Listeners
    if(mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    if(closeMobileMenuBtn) closeMobileMenuBtn.addEventListener('click', closeMobileMenu);
    if(mobileMenuOverlay) mobileMenuOverlay.addEventListener('click', closeMobileMenu);
    
    // Handle window resize for mobile optimization
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) {
            closeMobileMenu();
        }
    });

    // Panggil showPage('home') untuk memastikan halaman beranda tampil
    showPage('home');

}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);