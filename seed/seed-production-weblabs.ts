import { PrismaClient, WebLabDifficulty, WebLabStatus } from '@prisma/client'

const prisma = new PrismaClient()

const webLabsData = [
  {
    title: 'Web Lab 1: Portfolio Sederhana',
    description: 'Buat website portfolio pribadi dengan HTML dan CSS untuk memperkenalkan diri',
    difficulty: WebLabDifficulty.BEGINNER,
    classLevel: 'XI',
    instructions: `# Membuat Portfolio Sederhana

## Tujuan
Membuat website portfolio pribadi yang menampilkan informasi diri, skills, dan kontak.

## Instruksi

### 1. Struktur HTML
Buat file \`index.html\` dengan struktur:
- Header: Nama dan tagline
- Section About: Deskripsi diri
- Section Skills: Kemampuan yang dimiliki
- Section Projects: Daftar project (minimal 3)
- Section Contact: Email dan sosial media
- Footer: Copyright

### 2. Styling CSS
Buat file \`style.css\` dengan:
- Color scheme yang konsisten (pilih 2-3 warna utama)
- Typography yang mudah dibaca
- Layout menggunakan Flexbox atau Grid
- Responsive untuk mobile (gunakan media queries)

### 3. Requirements
✅ Semantic HTML (header, main, section, footer)
✅ Minimal 3 section (about, skills, contact)
✅ CSS external (bukan inline)
✅ Responsive design (mobile-friendly)
✅ Hover effects pada link/button
✅ Gambar profile (boleh placeholder)

## Tips
- Gunakan Google Fonts untuk typography
- Gunakan color palette dari coolors.co
- Referensi layout dari portfolio.com
- Test di mobile view (F12 → Toggle device)

## Penilaian
- HTML Structure: 30%
- CSS Styling: 30%
- Responsive Design: 20%
- Kreativitas: 20%

Good luck! 🚀`,
    starterHtml: `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio Saya</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <!-- TODO: Tambahkan konten portfolio di sini -->
    
    <header>
        <h1>Nama Kamu</h1>
        <p>Tagline / Profesi</p>
    </header>

    <main>
        <!-- About Section -->
        <section id="about">
            <h2>Tentang Saya</h2>
            <!-- TODO: Tambahkan deskripsi diri -->
        </section>

        <!-- Skills Section -->
        <section id="skills">
            <h2>Kemampuan</h2>
            <!-- TODO: Tambahkan list skills -->
        </section>

        <!-- Projects Section -->
        <section id="projects">
            <h2>Project Saya</h2>
            <!-- TODO: Tambahkan project cards -->
        </section>

        <!-- Contact Section -->
        <section id="contact">
            <h2>Kontak</h2>
            <!-- TODO: Tambahkan informasi kontak -->
        </section>
    </main>

    <footer>
        <p>&copy; 2024 Nama Kamu. All rights reserved.</p>
    </footer>
</body>
</html>`,
    starterCss: `/* Reset & Base Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
}

/* TODO: Tambahkan styling untuk header, sections, dan footer */

header {
    /* Your styles here */
}

section {
    padding: 2rem;
    /* Your styles here */
}

footer {
    /* Your styles here */
}

/* TODO: Tambahkan responsive design */
@media (max-width: 768px) {
    /* Mobile styles */
}`,
    starterJs: null,
    template: 'html-dasar',
    requirements: [
      'Gunakan semantic HTML (header, main, section, footer)',
      'Buat minimal 4 section (about, skills, projects, contact)',
      'CSS external dalam file style.css',
      'Responsive design dengan media queries',
      'Minimal 3 project cards',
      'Hover effects pada interactive elements',
      'Color scheme konsisten (2-3 warna utama)'
    ],
    hints: [
      'Gunakan Flexbox untuk layout: display: flex; justify-content: center; align-items: center;',
      'Media query untuk mobile: @media (max-width: 768px) { ... }',
      'Google Fonts: <link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" rel="stylesheet">',
      'Hover effect: .button:hover { transform: scale(1.05); transition: 0.3s; }',
      'Color palette idea: Background #f4f4f4, Primary #3498db, Secondary #2c3e50'
    ],
    solutionHtml: null,
    solutionCss: null,
    solutionJs: null,
    points: 100,
    timeLimit: 120,
    status: WebLabStatus.PUBLISHED,
    createdBy: 'admin-noah'
  },

  {
    title: 'Web Lab 2: Gallery Pemandangan Alam',
    description: 'Buat website gallery foto pemandangan alam dengan layout grid dan lightbox effect',
    difficulty: WebLabDifficulty.INTERMEDIATE,
    classLevel: 'XI',
    instructions: `# Membuat Gallery Pemandangan Alam

## Tujuan
Membuat website gallery foto dengan layout grid yang responsif dan lightbox effect menggunakan JavaScript.

## Instruksi

### 1. Struktur HTML
Buat file \`index.html\` dengan:
- Header: Judul gallery
- Gallery grid: 6-9 gambar pemandangan
- Lightbox modal untuk preview gambar besar
- Filter buttons (optional): Gunung, Pantai, Hutan

### 2. Styling CSS
- CSS Grid untuk layout gallery
- Cards untuk setiap gambar
- Hover effects (scale/zoom)
- Modal lightbox styling
- Responsive: 3 columns desktop, 2 tablet, 1 mobile

### 3. JavaScript
- Click gambar → buka lightbox
- Tombol close lightbox
- Next/Previous navigation (optional)
- Filter by category (optional)

### 4. Requirements
✅ Minimal 6 gambar (gunakan unsplash.com atau pexels.com)
✅ CSS Grid layout
✅ Lightbox modal dengan JavaScript
✅ Hover effects (zoom in)
✅ Responsive (mobile, tablet, desktop)
✅ Close button di lightbox
✅ Smooth transitions

## Tips
- Unsplash API untuk gambar: https://source.unsplash.com/800x600/?nature
- CSS Grid: display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
- Lightbox: position: fixed; z-index: 999;
- Hover zoom: transform: scale(1.1);

## Penilaian
- HTML Structure: 20%
- CSS Grid Layout: 30%
- JavaScript Lightbox: 30%
- Responsive & UX: 20%

Selamat berkarya! 📸`,
    starterHtml: `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gallery Pemandangan Alam</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>Gallery Pemandangan Alam Indonesia</h1>
        <p>Keindahan alam nusantara dalam satu frame</p>
    </header>

    <!-- TODO: Tambahkan filter buttons (optional) -->
    <div class="filters">
        <button class="filter-btn active" data-filter="all">Semua</button>
        <button class="filter-btn" data-filter="gunung">Gunung</button>
        <button class="filter-btn" data-filter="pantai">Pantai</button>
        <button class="filter-btn" data-filter="hutan">Hutan</button>
    </div>

    <!-- Gallery Grid -->
    <div class="gallery">
        <!-- TODO: Tambahkan 6-9 image cards -->
        <div class="gallery-item" data-category="gunung">
            <img src="https://source.unsplash.com/800x600/?mountain" alt="Gunung">
            <div class="overlay">
                <h3>Gunung Bromo</h3>
            </div>
        </div>
        
        <!-- Tambahkan 5-8 item lagi -->
    </div>

    <!-- Lightbox Modal -->
    <div id="lightbox" class="lightbox">
        <span class="close">&times;</span>
        <img class="lightbox-img" src="" alt="">
        <div class="caption"></div>
    </div>

    <script src="script.js"></script>
</body>
</html>`,
    starterCss: `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Arial', sans-serif;
    background: #f0f0f0;
}

header {
    text-align: center;
    padding: 2rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

/* Gallery Grid */
.gallery {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.gallery-item {
    position: relative;
    cursor: pointer;
    overflow: hidden;
    border-radius: 8px;
    /* TODO: Tambahkan hover effect */
}

.gallery-item img {
    width: 100%;
    height: 300px;
    object-fit: cover;
    transition: transform 0.3s ease;
}

/* TODO: Tambahkan hover effect untuk zoom */

/* Lightbox Modal */
.lightbox {
    display: none; /* Hidden by default */
    position: fixed;
    z-index: 999;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    /* TODO: Styling untuk lightbox */
}

/* TODO: Tambahkan responsive design */
@media (max-width: 768px) {
    .gallery {
        grid-template-columns: 1fr;
    }
}`,
    starterJs: `// Gallery & Lightbox JavaScript

// Get elements
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.querySelector('.lightbox-img');
const closeBtn = document.querySelector('.close');

// TODO: Add click event to each gallery item
galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        // TODO: Show lightbox with clicked image
        // lightbox.style.display = 'block';
        // lightboxImg.src = ...
    });
});

// TODO: Close lightbox when clicking X button
closeBtn.addEventListener('click', () => {
    // lightbox.style.display = 'none';
});

// TODO: Close lightbox when clicking outside image
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        // lightbox.style.display = 'none';
    }
});

// Optional: Filter functionality
const filterBtns = document.querySelectorAll('.filter-btn');
// TODO: Implement filter logic`,
    template: 'gallery-grid',
    requirements: [
      'Minimal 6 gambar pemandangan (gunakan Unsplash atau Pexels)',
      'CSS Grid layout dengan 3 columns di desktop',
      'Lightbox modal yang bisa dibuka dengan JavaScript',
      'Hover effect zoom pada gambar',
      'Tombol close (X) di lightbox',
      'Responsive: 3 cols desktop, 2 tablet, 1 mobile',
      'Smooth transitions pada hover dan modal'
    ],
    hints: [
      'Unsplash API: https://source.unsplash.com/800x600/?nature,mountain',
      'CSS Grid auto-fit: grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));',
      'Hover zoom: .gallery-item:hover img { transform: scale(1.1); }',
      'Show lightbox: lightbox.style.display = "flex";',
      'Get image src: item.querySelector("img").src;',
      'Close on outside click: if (e.target === lightbox) { lightbox.style.display = "none"; }'
    ],
    solutionHtml: null,
    solutionCss: null,
    solutionJs: null,
    points: 150,
    timeLimit: 180,
    status: WebLabStatus.PUBLISHED,
    createdBy: 'admin-noah'
  },

  {
    title: 'Web Lab 3: Website Resep Makanan & Minuman',
    description: 'Buat website katalog resep dengan fitur search, filter, dan detail resep menggunakan JavaScript',
    difficulty: WebLabDifficulty.INTERMEDIATE,
    classLevel: 'XI',
    instructions: `# Website Resep Makanan & Minuman

## Tujuan
Membuat website katalog resep dengan fitur interaktif: search bar, filter kategori, dan detail resep.

## Instruksi

### 1. Struktur HTML
- Header: Logo & navigation
- Search bar: Input untuk cari resep
- Filter buttons: Makanan, Minuman, Dessert
- Recipe cards grid: Minimal 6 resep
- Detail modal: Bahan, langkah, waktu masak

### 2. Data Resep (JavaScript)
Buat array of objects berisi resep:
\`\`\`javascript
const recipes = [
  {
    id: 1,
    title: "Nasi Goreng Spesial",
    category: "makanan",
    image: "...",
    time: "30 menit",
    ingredients: ["Nasi", "Telur", "Kecap", ...],
    steps: ["Panaskan wajan", "Tumis bumbu", ...]
  },
  // ... 5+ resep lagi
];
\`\`\`

### 3. Fitur JavaScript
- **Search**: Filter resep by title
- **Filter kategori**: Makanan / Minuman / Dessert
- **Click card**: Buka modal detail resep
- **Close modal**: Tombol X atau klik di luar
- **Render dynamic**: Loop data ke HTML

### 4. Requirements
✅ Minimal 6 resep (2 makanan, 2 minuman, 2 dessert)
✅ Search bar yang berfungsi (real-time)
✅ Filter by category
✅ Modal detail resep (bahan + langkah)
✅ Responsive design
✅ Animasi smooth (fade in, slide)
✅ Clean & modern UI

## Tips
- Gunakan array filter(): recipes.filter(r => r.category === 'makanan')
- Search: recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
- Modal: position: fixed; display: none; (toggle dengan JS)
- Template literal untuk render HTML: element.innerHTML = \`<div>...</div>\`

## Penilaian
- Data Structure (Array): 20%
- Search & Filter JS: 30%
- Modal Detail: 25%
- UI/UX & Responsive: 25%

Selamat memasak kode! 🍳`,
    starterHtml: `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resep Nusantara</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>🍴 Resep Nusantara</h1>
        <p>Kumpulan resep makanan & minuman khas Indonesia</p>
    </header>

    <!-- Search & Filter -->
    <div class="controls">
        <input type="text" id="searchInput" placeholder="Cari resep..." />
        
        <div class="filters">
            <button class="filter-btn active" data-category="all">Semua</button>
            <button class="filter-btn" data-category="makanan">Makanan</button>
            <button class="filter-btn" data-category="minuman">Minuman</button>
            <button class="filter-btn" data-category="dessert">Dessert</button>
        </div>
    </div>

    <!-- Recipe Cards Grid -->
    <div id="recipeContainer" class="recipe-grid">
        <!-- Recipes will be rendered here by JavaScript -->
    </div>

    <!-- Detail Modal -->
    <div id="recipeModal" class="modal">
        <div class="modal-content">
            <span class="close">&times;</span>
            <div id="modalBody">
                <!-- Recipe details will be inserted here -->
            </div>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>`,
    starterCss: `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: #fafafa;
}

header {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
    color: white;
    text-align: center;
    padding: 2rem;
}

/* Search & Filter Controls */
.controls {
    max-width: 1200px;
    margin: 2rem auto;
    padding: 0 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

#searchInput {
    padding: 0.8rem;
    font-size: 1rem;
    border: 2px solid #ddd;
    border-radius: 8px;
    /* TODO: Add focus styles */
}

.filters {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.filter-btn {
    padding: 0.6rem 1.2rem;
    border: none;
    background: #eee;
    border-radius: 20px;
    cursor: pointer;
    transition: 0.3s;
}

.filter-btn.active {
    background: #ff6b6b;
    color: white;
}

/* Recipe Grid */
.recipe-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem 2rem;
}

.recipe-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    cursor: pointer;
    transition: transform 0.3s;
    /* TODO: Add hover effect */
}

/* Modal */
.modal {
    display: none;
    position: fixed;
    z-index: 999;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    /* TODO: Center modal content */
}

/* TODO: Add responsive styles */
@media (max-width: 768px) {
    .recipe-grid {
        grid-template-columns: 1fr;
    }
}`,
    starterJs: `// Recipe Data
const recipes = [
    {
        id: 1,
        title: "Nasi Goreng Spesial",
        category: "makanan",
        image: "https://source.unsplash.com/400x300/?fried-rice",
        time: "30 menit",
        difficulty: "Mudah",
        ingredients: [
            "2 piring nasi putih",
            "2 butir telur",
            "3 siung bawang putih",
            "2 sdm kecap manis",
            "Garam dan merica secukupnya"
        ],
        steps: [
            "Panaskan minyak, tumis bawang putih hingga harum",
            "Masukkan telur, orak-arik hingga matang",
            "Masukkan nasi, aduk rata",
            "Tambahkan kecap, garam, merica",
            "Aduk hingga bumbu meresap, sajikan"
        ]
    },
    // TODO: Tambahkan 5+ resep lagi
    {
        id: 2,
        title: "Es Teh Manis",
        category: "minuman",
        image: "https://source.unsplash.com/400x300/?iced-tea",
        time: "10 menit",
        difficulty: "Sangat Mudah",
        ingredients: ["Teh celup", "Gula pasir", "Air panas", "Es batu"],
        steps: ["Seduh teh dengan air panas", "Tambahkan gula", "Dinginkan", "Tambah es batu"]
    },
    // Add more recipes...
];

// DOM Elements
const recipeContainer = document.getElementById('recipeContainer');
const searchInput = document.getElementById('searchInput');
const filterBtns = document.querySelectorAll('.filter-btn');
const modal = document.getElementById('recipeModal');
const modalBody = document.getElementById('modalBody');
const closeBtn = document.querySelector('.close');

// State
let currentCategory = 'all';
let searchTerm = '';

// Render Recipes
function renderRecipes() {
    // TODO: Filter recipes based on category and search
    let filtered = recipes;
    
    if (currentCategory !== 'all') {
        filtered = filtered.filter(r => r.category === currentCategory);
    }
    
    if (searchTerm) {
        filtered = filtered.filter(r => 
            r.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    
    // TODO: Render filtered recipes to HTML
    recipeContainer.innerHTML = filtered.map(recipe => \`
        <div class="recipe-card" onclick="showDetail(\${recipe.id})">
            <img src="\${recipe.image}" alt="\${recipe.title}" style="width: 100%; height: 200px; object-fit: cover;">
            <div style="padding: 1rem;">
                <h3>\${recipe.title}</h3>
                <p>⏱️ \${recipe.time} | 📊 \${recipe.difficulty}</p>
                <span class="category-badge">\${recipe.category}</span>
            </div>
        </div>
    \`).join('');
}

// Show Recipe Detail in Modal
function showDetail(id) {
    const recipe = recipes.find(r => r.id === id);
    // TODO: Populate modal with recipe details
    modalBody.innerHTML = \`
        <h2>\${recipe.title}</h2>
        <img src="\${recipe.image}" style="width: 100%; max-height: 300px; object-fit: cover; border-radius: 8px;">
        <div>
            <h3>Bahan-bahan:</h3>
            <ul>
                \${recipe.ingredients.map(i => \`<li>\${i}</li>\`).join('')}
            </ul>
            <h3>Langkah-langkah:</h3>
            <ol>
                \${recipe.steps.map(s => \`<li>\${s}</li>\`).join('')}
            </ol>
        </div>
    \`;
    modal.style.display = 'flex';
}

// Event Listeners
searchInput.addEventListener('input', (e) => {
    searchTerm = e.target.value;
    renderRecipes();
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.dataset.category;
        renderRecipes();
    });
});

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
});

// Initial render
renderRecipes();`,
    template: 'recipe-catalog',
    requirements: [
      'Array berisi minimal 6 resep (2 makanan, 2 minuman, 2 dessert)',
      'Search bar yang berfungsi real-time',
      'Filter by category (Makanan, Minuman, Dessert)',
      'Click recipe card membuka modal detail',
      'Modal menampilkan: gambar, bahan, langkah-langkah',
      'Tombol close modal (X dan klik luar)',
      'Responsive design untuk mobile',
      'Clean UI dengan card-based layout'
    ],
    hints: [
      'Array filter: recipes.filter(r => r.category === currentCategory)',
      'Search includes: title.toLowerCase().includes(searchTerm.toLowerCase())',
      'Map array to HTML: recipes.map(r => `<div>...</div>`).join("")',
      'Show modal: modal.style.display = "flex";',
      'Template literal untuk dynamic HTML',
      'Event delegation untuk dynamic elements',
      'Gunakan onclick attribute atau addEventListener'
    ],
    solutionHtml: null,
    solutionCss: null,
    solutionJs: null,
    points: 200,
    timeLimit: 240,
    status: WebLabStatus.PUBLISHED,
    createdBy: 'admin-noah'
  }
]

async function main() {
  console.log('💻 Seeding web lab assignments...')

  for (const webLab of webLabsData) {
    const existing = await prisma.webLabAssignment.findFirst({
      where: { title: webLab.title }
    })

    if (existing) {
      await prisma.webLabAssignment.update({
        where: { id: existing.id },
        data: webLab
      })
      console.log(`✅ Updated: ${webLab.title}`)
    } else {
      await prisma.webLabAssignment.create({
        data: webLab
      })
      console.log(`✅ Created: ${webLab.title}`)
    }
  }

  console.log(`\n✅ Seeded ${webLabsData.length} web lab assignments`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
