import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateAccordionModalTutorial() {
  console.log('💡 Updating accordion & modal tutorial with full content...');

  const fullContent = `
<div class="tutorial-content max-w-4xl mx-auto">
  <!-- Hero Section -->
  <div class="tutorial-hero bg-gradient-to-r from-indigo-100 to-purple-100 p-8 rounded-2xl mb-8">
    <div class="flex items-center gap-4 mb-4">
      <div class="text-6xl">💡</div>
      <div>
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Website Tips Interaktif: Bikin Konten yang Engaging!</h1>
        <p class="text-lg text-gray-600">Konten website membosankan? Nggak lagi! Yuk bikin accordion dan modal yang bikin pengunjung betah! 🚀</p>
      </div>
    </div>
    
    <div class="flex flex-wrap gap-4 mt-6">
      <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">⏱️ 30 menit</span>
      <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">🚀 Intermediate</span>
      <span class="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">🔗 Project: Website Tips</span>
    </div>
  </div>

  <!-- Preview Image -->
  <div class="mb-8 text-center">
    <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80" 
         alt="Interactive website with accordion and modal" 
         class="w-full max-w-2xl mx-auto rounded-lg shadow-lg">
    <p class="text-sm text-gray-500 mt-2">Preview: Website interaktif dengan accordion dan modal keren! ✨</p>
  </div>

  <!-- Learning Objectives -->
  <div class="bg-blue-50 p-6 rounded-xl mb-8">
    <h2 class="text-2xl font-bold text-blue-800 mb-4">🎯 Yang Akan Kamu Pelajari:</h2>
    <div class="grid md:grid-cols-2 gap-4">
      <div class="flex items-start gap-3">
        <span class="text-green-500 text-xl">✅</span>
        <span>Bikin accordion yang bisa expand/collapse</span>
      </div>
      <div class="flex items-start gap-3">
        <span class="text-green-500 text-xl">✅</span>
        <span>Membuat modal popup yang smooth</span>
      </div>
      <div class="flex items-start gap-3">
        <span class="text-green-500 text-xl">✅</span>
        <span>Styling dengan CSS yang modern dan responsive</span>
      </div>
      <div class="flex items-start gap-3">
        <span class="text-green-500 text-xl">✅</span>
        <span>JavaScript untuk interaktivitas yang smooth</span>
      </div>
    </div>
  </div>

  <!-- Prerequisites -->
  <div class="bg-yellow-50 p-6 rounded-xl mb-8">
    <h2 class="text-2xl font-bold text-yellow-800 mb-4">📋 Yang Perlu Kamu Kuasai Dulu:</h2>
    <ul class="space-y-2">
      <li class="flex items-center gap-3">
        <span class="text-yellow-500">📝</span>
        <span>Dasar HTML & CSS (udah pernah bikin halaman web sederhana)</span>
      </li>
      <li class="flex items-center gap-3">
        <span class="text-yellow-500">🎨</span>
        <span>Konsep responsive layout (flexbox atau grid)</span>
      </li>
      <li class="flex items-center gap-3">
        <span class="text-yellow-500">⚡</span>
        <span>JavaScript dasar (variabel, function, event handling)</span>
      </li>
      <li class="flex items-center gap-3">
        <span class="text-yellow-500">🛠️</span>
        <span>Text editor favorit (VS Code recommended!)</span>
      </li>
    </ul>
  </div>

  <!-- Main Tutorial Steps -->
  <div class="tutorial-steps space-y-12">
    <h2 class="text-3xl font-bold text-center text-gray-800 mb-8">🚀 Mari Kita Mulai!</h2>
    
    <!-- Step 1: HTML Structure -->
    <div class="step bg-white border-l-4 border-indigo-400 p-6 rounded-r-xl shadow-sm">
      <div class="flex items-center gap-3 mb-4">
        <span class="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center font-bold">1</span>
        <h3 class="text-2xl font-bold text-gray-800">📝 Bikin Struktur HTML</h3>
      </div>
      
      <p class="text-gray-600 mb-4">
        Pertama, kita bikin struktur dasar untuk accordion dan modal. Anggap ini kayak bikin kerangka bangunan dulu! 🏗️
      </p>

      <div class="bg-gray-50 p-4 rounded-lg mb-4">
        <p class="text-sm text-gray-600 mb-2">📁 Buat file baru: <code class="bg-gray-200 px-2 py-1 rounded">tips-interaktif.html</code></p>
      </div>

      <pre class="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm mb-4"><code>&lt;!DOCTYPE html&gt;
&lt;html lang="id"&gt;
&lt;head&gt;
    &lt;meta charset="UTF-8"&gt;
    &lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;
    &lt;title&gt;Website Tips Belajar&lt;/title&gt;
    &lt;link rel="stylesheet" href="style.css"&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;div class="container"&gt;
        &lt;header&gt;
            &lt;h1&gt;💡 Tips Belajar Efektif&lt;/h1&gt;
            &lt;p&gt;Klik untuk melihat tips lengkapnya!&lt;/p&gt;
        &lt;/header&gt;

        &lt;!-- Accordion Section --&gt;
        &lt;section class="accordion-section"&gt;
            &lt;div class="accordion-item"&gt;
                &lt;button class="accordion-header"&gt;
                    &lt;span&gt;📚 Tip 1: Buat Jadwal Belajar&lt;/span&gt;
                    &lt;span class="icon"&gt;+&lt;/span&gt;
                &lt;/button&gt;
                &lt;div class="accordion-content"&gt;
                    &lt;p&gt;Bikin jadwal belajar yang konsisten itu penting banget! Tentuin waktu khusus setiap hari buat belajar, misalnya 1-2 jam setelah pulang sekolah.&lt;/p&gt;
                    &lt;button class="detail-btn" data-tip="1"&gt;Lihat Detail&lt;/button&gt;
                &lt;/div&gt;
            &lt;/div&gt;

            &lt;div class="accordion-item"&gt;
                &lt;button class="accordion-header"&gt;
                    &lt;span&gt;🎯 Tip 2: Fokus pada Satu Topik&lt;/span&gt;
                    &lt;span class="icon"&gt;+&lt;/span&gt;
                &lt;/button&gt;
                &lt;div class="accordion-content"&gt;
                    &lt;p&gt;Jangan multitasking! Fokus belajar satu topik sampai paham baru pindah ke topik lain. Ini bikin otak kamu lebih mudah nyerap informasi.&lt;/p&gt;
                    &lt;button class="detail-btn" data-tip="2"&gt;Lihat Detail&lt;/button&gt;
                &lt;/div&gt;
            &lt;/div&gt;

            &lt;div class="accordion-item"&gt;
                &lt;button class="accordion-header"&gt;
                    &lt;span&gt;⏰ Tip 3: Pakai Teknik Pomodoro&lt;/span&gt;
                    &lt;span class="icon"&gt;+&lt;/span&gt;
                &lt;/button&gt;
                &lt;div class="accordion-content"&gt;
                    &lt;p&gt;Belajar 25 menit, istirahat 5 menit. Teknik ini terbukti bikin fokus lebih maksimal dan nggak cepet capek!&lt;/p&gt;
                    &lt;button class="detail-btn" data-tip="3"&gt;Lihat Detail&lt;/button&gt;
                &lt;/div&gt;
            &lt;/div&gt;
        &lt;/section&gt;

        &lt;!-- Modal Overlay --&gt;
        &lt;div class="modal-overlay" id="modal"&gt;
            &lt;div class="modal-content"&gt;
                &lt;button class="close-btn"&gt;&times;&lt;/button&gt;
                &lt;h2 id="modal-title"&gt;Detail Tips&lt;/h2&gt;
                &lt;div id="modal-body"&gt;
                    &lt;!-- Content will be inserted by JavaScript --&gt;
                &lt;/div&gt;
            &lt;/div&gt;
        &lt;/div&gt;
    &lt;/div&gt;

    &lt;script src="script.js"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>

      <div class="bg-blue-50 p-4 rounded-lg">
        <p class="font-semibold text-blue-800 mb-2">💡 Tips Pro:</p>
        <p class="text-sm text-gray-700">Perhatiin struktur accordion-nya! Setiap item punya header buat di-klik dan content yang bisa expand/collapse.</p>
      </div>
    </div>

    <!-- Step 2: CSS Styling -->
    <div class="step bg-white border-l-4 border-purple-400 p-6 rounded-r-xl shadow-sm">
      <div class="flex items-center gap-3 mb-4">
        <span class="bg-purple-100 text-purple-600 w-8 h-8 rounded-full flex items-center justify-center font-bold">2</span>
        <h3 class="text-2xl font-bold text-gray-800">🎨 Styling dengan CSS</h3>
      </div>
      
      <p class="text-gray-600 mb-4">
        Sekarang kita bikin tampilannya jadi keren! CSS ini yang bikin accordion dan modal jadi eye-catching. 🌟
      </p>

      <div class="bg-gray-50 p-4 rounded-lg mb-4">
        <p class="text-sm text-gray-600 mb-2">📁 Buat file: <code class="bg-gray-200 px-2 py-1 rounded">style.css</code></p>
      </div>

      <pre class="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm mb-4"><code>/* Reset dan Base Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    padding: 20px;
}

.container {
    max-width: 800px;
    margin: 0 auto;
}

/* Header Styles */
header {
    text-align: center;
    color: white;
    margin-bottom: 40px;
}

header h1 {
    font-size: 2.5rem;
    margin-bottom: 10px;
}

header p {
    font-size: 1.2rem;
    opacity: 0.9;
}

/* Accordion Styles */
.accordion-section {
    background: white;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.accordion-item {
    border-bottom: 1px solid #e0e0e0;
}

.accordion-item:last-child {
    border-bottom: none;
}

.accordion-header {
    width: 100%;
    padding: 20px;
    background: white;
    border: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 1.1rem;
    font-weight: 600;
}

.accordion-header:hover {
    background: #f5f5f5;
}

.accordion-header .icon {
    font-size: 1.5rem;
    font-weight: bold;
    transition: transform 0.3s ease;
}

.accordion-item.active .icon {
    transform: rotate(45deg);
}

.accordion-content {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
    background: #f9f9f9;
}

.accordion-item.active .accordion-content {
    max-height: 300px;
}

.accordion-content p {
    padding: 20px;
    color: #555;
    line-height: 1.6;
}

.detail-btn {
    margin: 0 20px 20px;
    padding: 10px 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: transform 0.2s ease;
}

.detail-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

/* Modal Styles */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
}

.modal-overlay.active {
    opacity: 1;
    visibility: visible;
}

.modal-content {
    background: white;
    border-radius: 20px;
    padding: 40px;
    max-width: 600px;
    width: 90%;
    position: relative;
    transform: scale(0.8);
    transition: transform 0.3s ease;
}

.modal-overlay.active .modal-content {
    transform: scale(1);
}

.close-btn {
    position: absolute;
    top: 15px;
    right: 15px;
    background: none;
    border: none;
    font-size: 2rem;
    cursor: pointer;
    color: #999;
    transition: color 0.3s ease;
}

.close-btn:hover {
    color: #333;
}

#modal-title {
    color: #333;
    margin-bottom: 20px;
    font-size: 1.8rem;
}

#modal-body {
    color: #666;
    line-height: 1.8;
}

/* Responsive Design */
@media (max-width: 768px) {
    header h1 {
        font-size: 2rem;
    }
    
    .accordion-header {
        padding: 15px;
        font-size: 1rem;
    }
    
    .modal-content {
        padding: 30px 20px;
    }
}</code></pre>

      <div class="bg-purple-50 p-4 rounded-lg">
        <p class="font-semibold text-purple-800 mb-2">🎨 Penjelasan CSS:</p>
        <ul class="text-sm text-gray-700 space-y-2">
          <li>• <strong>max-height transition:</strong> Bikin efek smooth saat accordion expand/collapse</li>
          <li>• <strong>transform rotate:</strong> Icon "+" jadi "×" saat diklik</li>
          <li>• <strong>Modal overlay:</strong> Background gelap dengan opacity untuk fokus ke modal</li>
          <li>• <strong>transform scale:</strong> Modal muncul dengan animasi zoom in yang smooth</li>
        </ul>
      </div>
    </div>

    <!-- Step 3: JavaScript Magic -->
    <div class="step bg-white border-l-4 border-pink-400 p-6 rounded-r-xl shadow-sm">
      <div class="flex items-center gap-3 mb-4">
        <span class="bg-pink-100 text-pink-600 w-8 h-8 rounded-full flex items-center justify-center font-bold">3</span>
        <h3 class="text-2xl font-bold text-gray-800">⚡ Bikin Interaktif dengan JavaScript</h3>
      </div>
      
      <p class="text-gray-600 mb-4">
        Ini bagian serunya! JavaScript ini yang bikin accordion dan modal bener-bener hidup dan interaktif. 🎯
      </p>

      <div class="bg-gray-50 p-4 rounded-lg mb-4">
        <p class="text-sm text-gray-600 mb-2">📁 Buat file: <code class="bg-gray-200 px-2 py-1 rounded">script.js</code></p>
      </div>

      <pre class="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm mb-4"><code>// Accordion Functionality
const accordionHeaders = document.querySelectorAll('.accordion-header');

accordionHeaders.forEach(header => {
    header.addEventListener('click', function() {
        const accordionItem = this.parentElement;
        const isActive = accordionItem.classList.contains('active');
        
        // Tutup semua accordion yang lagi kebuka
        document.querySelectorAll('.accordion-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Buka accordion yang diklik (kecuali kalau udah kebuka)
        if (!isActive) {
            accordionItem.classList.add('active');
        }
    });
});

// Modal Functionality
const modal = document.getElementById('modal');
const detailButtons = document.querySelectorAll('.detail-btn');
const closeBtn = document.querySelector('.close-btn');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');

// Data detail untuk setiap tips
const tipsDetails = {
    '1': {
        title: '📚 Detail: Buat Jadwal Belajar',
        content: \`
            <h3>Kenapa Jadwal Belajar Penting?</h3>
            <p>Dengan jadwal yang konsisten, otak kamu akan terbiasa dan siap menerima informasi baru di waktu-waktu tertentu.</p>
            
            <h4>Tips Bikin Jadwal Efektif:</h4>
            <ul>
                <li>✓ Tentuin waktu yang sama setiap hari</li>
                <li>✓ Pilih waktu saat kamu paling fokus (pagi/malam)</li>
                <li>✓ Mulai dari 30 menit dulu, nanti tambah perlahan</li>
                <li>✓ Jangan lupa masukkin waktu istirahat</li>
            </ul>
            
            <div class="tip-box">
                <strong>🎯 Contoh Jadwal:</strong>
                <p>Senin-Jumat: 19.00-20.30 (Belajar Matematika & Fisika)</p>
                <p>Sabtu-Minggu: 09.00-11.00 (Review materi minggu ini)</p>
            </div>
        \`
    },
    '2': {
        title: '🎯 Detail: Fokus pada Satu Topik',
        content: \`
            <h3>Single-Tasking vs Multi-Tasking</h3>
            <p>Research menunjukkan bahwa otak kita lebih efektif kalau fokus ke satu hal. Multi-tasking malah bikin kita 40% lebih lambat!</p>
            
            <h4>Cara Melatih Fokus:</h4>
            <ul>
                <li>✓ Matiin notifikasi HP saat belajar</li>
                <li>✓ Tutup tab browser yang nggak perlu</li>
                <li>✓ Siapkan semua bahan belajar sebelum mulai</li>
                <li>✓ Kasih tau keluarga kalau lagi fokus belajar</li>
            </ul>
            
            <div class="tip-box">
                <strong>🎯 Challenge 30 Hari:</strong>
                <p>Coba fokus belajar 1 topik per hari selama 30 hari. Lihat perbedaannya!</p>
            </div>
        \`
    },
    '3': {
        title: '⏰ Detail: Teknik Pomodoro',
        content: \`
            <h3>Apa itu Teknik Pomodoro?</h3>
            <p>Teknik yang diciptakan Francesco Cirillo ini pakai timer untuk membagi waktu belajar jadi interval-interval pendek.</p>
            
            <h4>Cara Menggunakan Pomodoro:</h4>
            <ol>
                <li>1️⃣ Set timer 25 menit</li>
                <li>2️⃣ Fokus belajar sampai timer berbunyi</li>
                <li>3️⃣ Istirahat 5 menit</li>
                <li>4️⃣ Ulangi 4 kali</li>
                <li>5️⃣ Setelah 4 sesi, istirahat panjang 15-30 menit</li>
            </ol>
            
            <div class="tip-box">
                <strong>🎯 Tools yang Bisa Dipakai:</strong>
                <p>• Tomato Timer (website gratis)</p>
                <p>• Focus To-Do (app mobile)</p>
                <p>• Forest (app gamifikasi yang seru!)</p>
            </div>
        \`
    }
};

// Event listener untuk tombol detail
detailButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation(); // Biar nggak trigger accordion
        const tipNumber = this.getAttribute('data-tip');
        const tipData = tipsDetails[tipNumber];
        
        // Update modal content
        modalTitle.textContent = tipData.title;
        modalBody.innerHTML = tipData.content;
        
        // Tampilkan modal
        modal.classList.add('active');
    });
});

// Tutup modal saat klik tombol close
closeBtn.addEventListener('click', function() {
    modal.classList.remove('active');
});

// Tutup modal saat klik di luar modal content
modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        modal.classList.remove('active');
    }
});

// Tutup modal dengan tombol Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        modal.classList.remove('active');
    }
});</code></pre>

      <div class="bg-pink-50 p-4 rounded-lg">
        <p class="font-semibold text-pink-800 mb-2">⚡ Penjelasan JavaScript:</p>
        <ul class="text-sm text-gray-700 space-y-2">
          <li>• <strong>querySelectorAll:</strong> Ambil semua elemen accordion sekaligus</li>
          <li>• <strong>classList.toggle:</strong> Tambah/hapus class 'active' buat show/hide</li>
          <li>• <strong>stopPropagation:</strong> Cegah event bubbling ke parent</li>
          <li>• <strong>Template literals:</strong> Bikin HTML content yang dinamis</li>
          <li>• <strong>Keyboard events:</strong> User bisa tutup modal pakai tombol Escape</li>
        </ul>
      </div>
    </div>

    <!-- Step 4: Testing -->
    <div class="step bg-white border-l-4 border-green-400 p-6 rounded-r-xl shadow-sm">
      <div class="flex items-center gap-3 mb-4">
        <span class="bg-green-100 text-green-600 w-8 h-8 rounded-full flex items-center justify-center font-bold">4</span>
        <h3 class="text-2xl font-bold text-gray-800">🧪 Saatnya Testing!</h3>
      </div>
      
      <p class="text-gray-600 mb-4">
        Sekarang coba buka file HTML kamu di browser. Test semua fiturnya! 🎉
      </p>

      <div class="bg-green-50 p-4 rounded-lg mb-4">
        <p class="font-semibold text-green-800 mb-2">✅ Checklist Testing:</p>
        <ul class="space-y-2 text-sm">
          <li class="flex items-center gap-2">
            <input type="checkbox" class="w-4 h-4">
            <span>Accordion bisa expand saat diklik</span>
          </li>
          <li class="flex items-center gap-2">
            <input type="checkbox" class="w-4 h-4">
            <span>Accordion yang lain otomatis close</span>
          </li>
          <li class="flex items-center gap-2">
            <input type="checkbox" class="w-4 h-4">
            <span>Icon berubah dari + jadi ×</span>
          </li>
          <li class="flex items-center gap-2">
            <input type="checkbox" class="w-4 h-4">
            <span>Tombol "Lihat Detail" buka modal</span>
          </li>
          <li class="flex items-center gap-2">
            <input type="checkbox" class="w-4 h-4">
            <span>Modal bisa ditutup dengan tombol ×</span>
          </li>
          <li class="flex items-center gap-2">
            <input type="checkbox" class="w-4 h-4">
            <span>Modal bisa ditutup dengan klik di luar</span>
          </li>
          <li class="flex items-center gap-2">
            <input type="checkbox" class="w-4 h-4">
            <span>Modal bisa ditutup dengan tombol Escape</span>
          </li>
          <li class="flex items-center gap-2">
            <input type="checkbox" class="w-4 h-4">
            <span>Responsive di mobile dan desktop</span>
          </li>
        </ul>
      </div>
    </div>
  </div>

  <!-- Bonus Section -->
  <div class="bg-gradient-to-r from-yellow-100 to-orange-100 p-8 rounded-2xl my-8">
    <h2 class="text-2xl font-bold text-gray-800 mb-4">🌟 Bonus: Upgrade Level!</h2>
    <p class="text-gray-700 mb-4">Udah selesai bikin accordion dan modal? Sekarang saatnya level up dengan fitur-fitur keren ini:</p>
    
    <div class="grid md:grid-cols-2 gap-4">
      <div class="bg-white p-4 rounded-lg">
        <h4 class="font-bold text-purple-600 mb-2">🎨 Tambah Animasi Lebih Smooth</h4>
        <p class="text-sm text-gray-600">Coba pakai CSS @keyframes buat bikin animasi custom yang lebih keren!</p>
      </div>
      
      <div class="bg-white p-4 rounded-lg">
        <h4 class="font-bold text-blue-600 mb-2">🌙 Dark Mode Toggle</h4>
        <p class="text-sm text-gray-600">Tambahin tombol buat switch antara light mode dan dark mode!</p>
      </div>
      
      <div class="bg-white p-4 rounded-lg">
        <h4 class="font-bold text-green-600 mb-2">💾 Simpan Status Accordion</h4>
        <p class="text-sm text-gray-600">Pakai localStorage biar accordion yang dibuka tetap kebuka saat refresh!</p>
      </div>
      
      <div class="bg-white p-4 rounded-lg">
        <h4 class="font-bold text-pink-600 mb-2">🔍 Tambah Search Function</h4>
        <p class="text-sm text-gray-600">Bikin fitur pencarian tips berdasarkan keyword!</p>
      </div>
    </div>
  </div>

  <!-- Conclusion -->
  <div class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-2xl">
    <h2 class="text-3xl font-bold mb-4">🎉 Selamat! Kamu Berhasil!</h2>
    <p class="text-lg mb-4">
      Kamu udah berhasil bikin website interaktif dengan accordion dan modal yang keren! Ini skill yang super berguna dan sering banget dipake di website-website modern.
    </p>
    
    <div class="bg-white/20 p-4 rounded-lg mb-4">
      <h3 class="font-bold mb-2">📚 Yang Udah Kamu Pelajari:</h3>
      <ul class="space-y-2">
        <li>✓ Bikin accordion yang smooth dengan HTML, CSS, dan JavaScript</li>
        <li>✓ Membuat modal popup yang responsive dan user-friendly</li>
        <li>✓ Handling event dengan JavaScript (click, keyboard)</li>
        <li>✓ Animasi CSS dengan transition dan transform</li>
        <li>✓ Responsive design untuk semua ukuran layar</li>
      </ul>
    </div>
    
    <p class="text-lg font-semibold">
      💪 Sekarang coba praktekin skill ini di project kamu sendiri! Bikin FAQ page, tutorial page, atau apapun yang butuh accordion dan modal.
    </p>
    
    <div class="mt-6 flex flex-wrap gap-4">
      <a href="/student/coding-lab" class="bg-white text-indigo-600 px-6 py-3 rounded-full font-bold hover:bg-indigo-50 transition">
        🚀 Coba Coding Lab
      </a>
      <a href="/tutorial" class="bg-white/20 text-white px-6 py-3 rounded-full font-bold hover:bg-white/30 transition">
        📚 Tutorial Lainnya
      </a>
    </div>
  </div>

  <!-- Tips & Tricks -->
  <div class="mt-8 bg-blue-50 p-6 rounded-xl">
    <h3 class="text-xl font-bold text-blue-800 mb-4">💡 Tips & Trik dari Developer Pro:</h3>
    <div class="space-y-3 text-sm text-gray-700">
      <p><strong>🎯 Accessibility:</strong> Jangan lupa tambahin aria-label dan aria-expanded buat screen reader!</p>
      <p><strong>⚡ Performance:</strong> Kalau accordion item-nya banyak banget, consider pakai virtual scrolling.</p>
      <p><strong>🎨 UX Design:</strong> Pastiin visual feedback jelas saat user hover atau klik accordion.</p>
      <p><strong>📱 Mobile First:</strong> Selalu test di mobile dulu, karena mayoritas user browsing pakai HP!</p>
      <p><strong>🔄 Reusable:</strong> Bikin accordion sebagai component yang bisa dipake ulang di project lain.</p>
    </div>
  </div>

</div>
`;

  try {
    // Update the article
    const updatedArticle = await prisma.article.update({
      where: {
        slug: 'tutorial-website-tips-belajar-accordion-modal'
      },
      data: {
        content: fullContent,
        status: 'published',
        publishedAt: new Date()
      }
    });

    console.log(`✅ Successfully updated: ${updatedArticle.title}`);
    console.log(`📝 Content length: ${fullContent.length} characters`);
    console.log(`📅 Published at: ${updatedArticle.publishedAt}`);
    console.log(`🔗 URL: /tutorial/articles/${updatedArticle.slug}`);
  } catch (error) {
    console.error('❌ Error updating article:', error);
    throw error;
  }
}

updateAccordionModalTutorial()
  .catch((e) => {
    console.error('💥 Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
