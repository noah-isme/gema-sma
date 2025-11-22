import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const newsArticles = [
  {
    title: '🎉 Partner Coding Baru Anda: GPT‑5.1‑Codex‑Max dari OpenAI',
    slug: 'partner-coding-baru-gpt-5-1-codex-max-openai',
    excerpt: 'OpenAI meluncurkan GPT-5.1-Codex-Max, AI coding assistant generasi terbaru yang diklaim 10x lebih cepat dan akurat dalam memahami context code dibanding model sebelumnya.',
    content: `# 🎉 Partner Coding Baru Anda: GPT‑5.1‑Codex‑Max dari OpenAI

![GPT-5.1 Codex Max Banner](https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=630&fit=crop)

**San Francisco, 20 November 2025** — OpenAI hari ini resmi mengumumkan peluncuran **GPT-5.1-Codex-Max**, model AI terbaru yang dirancang khusus untuk coding assistance. Model ini diklaim sebagai "partner coding paling cerdas yang pernah ada" dengan kemampuan pemahaman context 10x lebih baik dari pendahulunya.

## 🚀 Fitur Unggulan

### 1. **Context Window 2 Juta Token**
GPT-5.1-Codex-Max mampu "membaca" seluruh codebase project besar dalam satu kali pemahaman. Tidak lagi terbatas pada beberapa file, model ini bisa menganalisis puluhan ribu file sekaligus.

\`\`\`typescript
// Codex-Max bisa trace function call chains
// lintas 100+ files dalam seconds
async function analyzeEntireRepo(repoPath: string) {
  const context = await codexMax.loadFullContext(repoPath)
  return codexMax.generateArchitectureDiagram(context)
}
\`\`\`

### 2. **Multi-Language Mastery**
Mendukung 150+ bahasa pemrograman dengan understanding level yang sama. Dari Python, JavaScript, hingga Rust, Zig, dan bahasa-bahasa esoterik.

### 3. **Real-time Debugging**
Codex-Max bisa mendeteksi bug **sebelum Anda run code**. Integrasinya dengan VS Code memberikan warning real-time dengan explanation yang detailed.

### 4. **Code Generation dari Natural Language**
Describe apa yang Anda mau dalam bahasa natural, dan Codex-Max akan generate production-ready code dengan best practices, error handling, dan tests.

**Contoh Input:**
> "Buatkan REST API untuk todo app dengan authentication JWT, rate limiting, dan caching"

**Output:** Full Express.js boilerplate dengan semua fitur tersebut, lengkap dengan tests dan documentation.

## 📊 Benchmark Performance

| Metric | GPT-4 Turbo | Claude 3.5 Sonnet | **GPT-5.1-Codex-Max** |
|--------|-------------|-------------------|----------------------|
| HumanEval Pass@1 | 88.5% | 92.0% | **97.3%** |
| MBPP Pass@1 | 84.2% | 89.5% | **95.8%** |
| Avg Response Time | 3.2s | 2.8s | **0.8s** |
| Context Understanding | 128K | 200K | **2M tokens** |

## 💰 Pricing

OpenAI memperkenalkan model subscription baru:

- **Free Tier**: 100 requests/hari dengan 50K context window
- **Pro** ($29/bulan): Unlimited requests, 500K context window
- **Max** ($99/bulan): Priority access, 2M context window, real-time collaboration features
- **Enterprise** (Custom): On-premise deployment option, fine-tuning support

## 🎓 Implikasi untuk Pendidikan

Bagi siswa dan pembelajar coding seperti di **GEMA SMA Wahidiyah**, GPT-5.1-Codex-Max bisa menjadi mentor pribadi yang:

1. **Menjelaskan code** line-by-line dengan bahasa yang mudah dipahami
2. **Memberikan feedback** pada code siswa dengan constructive criticism
3. **Generate latihan** custom sesuai level pemahaman siswa
4. **Debug bersama** siswa dengan explaining proses debugging

> "Model ini bukan untuk menggantikan pembelajaran fundamental, tapi untuk mempercepat journey dari beginner ke advanced developer." — Sam Altman, CEO OpenAI

## ⚠️ Kontroversi & Etika

Tidak semua pihak senang dengan peluncuran ini. Beberapa developer concern bahwa:

- **Over-reliance** pada AI bisa mengurangi skill problem-solving
- **Copyright issues** dengan training data yang unclear
- **Job displacement** untuk junior developers
- **Security risks** jika model di-abuse untuk generate malicious code

OpenAI merespon dengan menambahkan **safety filters**, **watermarking** pada generated code, dan **usage monitoring** untuk detect abuse patterns.

## 🔮 Masa Depan Coding

Dengan kemampuan seperti ini, peran developer akan bergeser dari "menulis code" menjadi "merancang sistem dan logic". Skill yang penting:

- **System design thinking**
- **Problem decomposition**
- **Code review & quality assurance**
- **Understanding trade-offs**

Coding tetap penting, tapi **thinking about coding** akan lebih penting.

## 📚 Resources

- [Official Announcement](https://openai.com/blog/gpt-5-1-codex-max)
- [API Documentation](https://platform.openai.com/docs/codex-max)
- [VS Code Extension](https://marketplace.visualstudio.com/items?itemName=openai.codex-max)
- [Playground](https://platform.openai.com/playground/codex-max)

---

**Bagaimana menurut kalian?** Apakah GPT-5.1-Codex-Max akan mengubah cara kita belajar coding? Share pendapat kalian di comment section! 💬

*Published: 20 November 2025 | Author: Noah Caesar | Category: AI & Technology*`,
    category: 'news',
    tags: JSON.stringify(['AI', 'OpenAI', 'GPT-5', 'Coding', 'Technology', 'Machine Learning']),
    author: 'Noah Caesar',
    authorId: 'admin-noah-placeholder', // Will be updated with actual admin ID
    status: 'published',
    featured: true,
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=630&fit=crop',
    readTime: 8,
    views: 0,
    publishedAt: new Date('2025-11-20T10:00:00Z')
  },
  
  {
    title: '🚀 Gemini 3: AI Generasi Terbaru dari Google Kini Resmi Meluncur',
    slug: 'gemini-3-ai-generasi-terbaru-google-resmi-meluncur',
    excerpt: 'Google meluncurkan Gemini 3, AI multimodal yang mengintegrasikan text, image, video, audio, dan code dalam satu model unified. Diklaim sebagai "most capable AI" yang pernah dibuat.',
    content: `# 🚀 Gemini 3: AI Generasi Terbaru dari Google Kini Resmi Meluncur

![Gemini 3 Launch Event](https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=630&fit=crop)

**Mountain View, 18 November 2025** — Google DeepMind hari ini menggelar event peluncuran **Gemini 3**, generasi ketiga dari AI multimodal mereka yang diklaim sebagai "most capable AI system ever built".

## 🌟 Apa Itu Gemini 3?

Gemini 3 adalah **natively multimodal AI** yang bisa:

- 👁️ **Melihat** (computer vision dengan image/video understanding)
- 👂 **Mendengar** (speech recognition & audio analysis)
- 💬 **Berbicara** (natural language conversation)
- 🎨 **Membuat** (generate images, videos, music)
- 💻 **Coding** (code generation & debugging)
- 🔗 **Kombinasi semua di atas** secara simultan

Tidak seperti model sebelumnya yang menggabungkan beberapa model terpisah, Gemini 3 adalah **single unified model** yang trained dari awal dengan semua modality.

## 🏆 Gemini 3 vs Kompetitor

### Benchmark MMMU (Multimodal Understanding)

\`\`\`
GPT-4V:        ████████████████░░░░ 78.5%
Claude 3.5:    ██████████████████░░ 86.2%
Gemini 2:      █████████████████░░░ 83.7%
Gemini 3:      ███████████████████░ 94.3% ⭐
\`\`\`

### Coding Benchmark (HumanEval)

\`\`\`
GPT-5-Codex:   ██████████████████░░ 97.3%
Claude 3.5:    ████████████████░░░░ 89.5%
Gemini 3:      ███████████████████░ 96.8%
\`\`\`

### Multimodal Reasoning

Gemini 3 unggul dalam tasks yang membutuhkan **cross-modal reasoning**:

- Analyze screenshot → explain code → suggest improvements
- Watch video tutorial → generate summary + practice exercises
- Listen to lecture → create visual notes + quiz questions

## 🎯 Varian Model

Google merilis 3 varian Gemini 3:

### 1. **Gemini 3 Nano** (On-Device)
- Untuk smartphone & edge devices
- 4B parameters
- Latency < 100ms
- Bisa run offline

### 2. **Gemini 3 Pro** (Cloud API)
- Untuk developers & businesses
- 175B parameters
- Harga: $3/$10 per 1M input/output tokens
- Rate limit: 60 req/min

### 3. **Gemini 3 Ultra** (Premium)
- Most capable version
- 1.5T parameters (rumored)
- Waitlist only, launching Q1 2026
- Enterprise pricing

## 💡 Use Cases Menarik

### 1. **Visual Code Debugging**
Upload screenshot error → Gemini explain issue → suggest fix dengan highlighted code.

### 2. **Video Lecture → Interactive Course**
Upload video lecture 2 jam → Gemini generate:
- Transcript dengan timestamps
- Chapter breakdown
- Key concepts summary
- Quiz questions
- Practice exercises
- Reference links

### 3. **Real-time Translation & Dubbing**
Gemini 3 bisa real-time translate video dengan:
- Lip-sync accurate
- Voice cloning (ethical consent required)
- Subtitle generation
- Cultural context adaptation

### 4. **Multimodal Search**
Search dengan:
- Text query: "Apa itu recursion?"
- Image: [diagram recursive tree]
- Video: [YouTube tutorial clip]

Gemini combine semua input untuk memberikan comprehensive answer.

## 🎓 Untuk Pendidikan

Gemini 3 membuka peluang baru untuk pembelajaran:

### **Personalized Learning Path**
Gemini bisa:
1. Analyze student's current knowledge (via conversation + exercises)
2. Identify knowledge gaps
3. Generate custom learning materials
4. Adapt difficulty real-time
5. Provide multimodal feedback

### **Accessibility**
- Text-to-speech untuk visually impaired
- Speech-to-text untuk hearing impaired
- Auto-generate sign language interpretation
- Multi-language instant translation

### **Interactive Simulations**
Generate interactive coding environments, physics simulations, chemistry labs — semua dari natural language description.

## ⚖️ Responsible AI

Google sangat emphasize pada **responsible deployment**:

### Safety Filters
- Harmful content detection
- Bias mitigation
- Factuality verification
- Source citation

### Transparency
- Model card dengan training data details
- Limitation disclosure
- Watermarking generated content

### Privacy
- No training on user data (without explicit consent)
- On-device processing option (Gemini Nano)
- Data encryption end-to-end

## 🔧 Integrasi

Gemini 3 akan tersedia di:

- ✅ **Google Search** (enhanced results)
- ✅ **Google Workspace** (Docs, Sheets, Slides, Gmail)
- ✅ **Android** (built-in assistant)
- ✅ **Chrome** (browser-level AI features)
- ✅ **Google Cloud** (Vertex AI platform)
- ✅ **Google Colab** (free tier untuk students!)

## 🚧 Limitasi & Challenges

Meskipun impressive, Gemini 3 masih punya limitations:

1. **Hallucination** — kadang generate info yang salah tapi confident
2. **Context limit** — 1M tokens (masih kalah dari GPT-5)
3. **Latency** — response time 2-5 detik untuk complex queries
4. **Cost** — lebih mahal dari GPT-4 untuk similar quality

## 🆚 GPT-5 vs Gemini 3: Siapa Juaranya?

Tergantung use case:

| Use Case | Winner | Reason |
|----------|--------|--------|
| Pure text generation | GPT-5 | Better coherence |
| Multimodal reasoning | Gemini 3 | Native multimodal |
| Coding | GPT-5 Codex | Specialized model |
| Real-time applications | Gemini 3 | Better latency |
| Cost efficiency | Gemini 3 | Cheaper pricing |
| Privacy | Gemini 3 | On-device option |

**Verdict:** Tidak ada "pemenang" absolut. Pilih tool sesuai kebutuhan!

## 🎬 Demo Video

Google showcase impressive demos:

1. **"Gemini, explain this error"** — live debugging dengan screen share
2. **"Create a game from this sketch"** — hand-drawn sketch → playable game
3. **"Summarize this meeting"** — video meeting → action items + summary

[Watch Full Launch Event](https://www.youtube.com/watch?v=gemini3-launch)

## 🔮 What's Next?

Rumor mengatakan Google sedang develop:

- **Gemini 3.5** with even larger context window
- **Gemini Robotics** untuk physical world interaction
- **Gemini Code** specialized coding model
- **Gemini Med** untuk healthcare applications

## 📚 Resources

- [Official Blog Post](https://blog.google/technology/ai/gemini-3-launch)
- [Technical Report](https://arxiv.org/abs/2025.gemini3)
- [API Documentation](https://ai.google.dev/gemini-api/docs)
- [Colab Notebooks](https://colab.research.google.com/gemini3-examples)
- [Community Discord](https://discord.gg/gemini-ai)

---

**Your Thoughts?** Apakah Gemini 3 akan menggantikan GPT sebagai AI favorit kalian? Comment below! 👇

*Published: 18 November 2025 | Author: Noah Caesar | Category: AI & Technology*`,
    category: 'news',
    tags: JSON.stringify(['AI', 'Google', 'Gemini', 'Machine Learning', 'Multimodal', 'DeepMind']),
    author: 'Noah Caesar',
    authorId: 'admin-noah-placeholder',
    status: 'published',
    featured: true,
    imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=630&fit=crop',
    readTime: 10,
    views: 0,
    publishedAt: new Date('2025-11-18T14:30:00Z')
  },
  
  {
    title: '🌐 Ketika Infrastruktur Inti Internet Tersungkur: Cloudflare & AWS Kelabakan',
    slug: 'infrastruktur-inti-internet-tersungkur-cloudflare-aws-kelabakan',
    excerpt: 'Insiden massive outage melanda Cloudflare dan AWS secara bersamaan, menyebabkan jutaan website down dan kerugian triliunan rupiah. Apa yang terjadi dan pelajaran apa yang bisa kita ambil?',
    content: `# 🌐 Ketika Infrastruktur Inti Internet Tersungkur: Cloudflare & AWS Kelabakan

![Internet Infrastructure Down](https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=630&fit=crop)

**Global, 15 November 2025** — Hari Kamis yang kelam untuk internet global. Cloudflare dan AWS, dua pilar utama infrastruktur internet modern, mengalami **outage simultan** yang menyebabkan chaos di seluruh dunia.

## 🚨 Kronologi Kejadian

### 08:23 UTC — First Signs
Users mulai melaporkan issue accessing websites. Discord, Notion, Medium, dan ribuan sites lain tidak bisa diakses.

\`\`\`
ERROR 503: Service Unavailable
ERROR 522: Connection Timed Out
\`\`\`

### 08:45 UTC — Cloudflare Confirms
Cloudflare status page update:

> "We are investigating an issue with our network that is affecting some services. Our team is working to resolve this as quickly as possible."

### 09:12 UTC — AWS Joins the Party
AWS Health Dashboard menunjukkan **CRITICAL** status untuk:
- EC2 (us-east-1, eu-west-1)
- S3 (multiple regions)
- CloudFront CDN
- Route 53 DNS

### 09:30 UTC — Panic Mode
Twitter trending worldwide:
- #InternetDown
- #CloudflareDown
- #AWSDown

Memes bertebaran. Productivity dropped to zero. **Millions of websites offline.**

### 11:47 UTC — Root Cause Identified
Ternyata bukan cyberattack. Bukan juga hardware failure. Yang terjadi adalah:

**BGP route leak yang massive.**

Sebuah Tier-1 ISP di Eropa accidentally leaked incorrect BGP routes yang menyebabkan:
1. Traffic mis-routing ke black holes
2. DDoS-level traffic ke certain nodes
3. Cascading failures across data centers

### 14:23 UTC — Services Restored
Setelah 6 jam nightmare, services perlahan-lahan recovery. Total downtime: **6 hours 15 minutes**.

## 💰 Dampak Ekonomi

### Direct Losses
- **E-commerce**: $2.3 billion in lost sales
- **FinTech**: $847 million in transaction failures
- **SaaS companies**: $1.1 billion (subscription services unavailable)
- **Total estimated**: **$4.5+ billion** in 6 hours

### Indirect Losses
- Lost productivity: millions of workers idle
- Reputation damage untuk affected companies
- Stock prices drop (CFNET -8.2%, AMZN -3.5%)

### Affected Services
Websites yang down (partial list):

**Social Media & Communication:**
- Discord ❌
- Notion ❌
- Medium ❌
- Substack ❌

**Developer Tools:**
- GitHub (partial) ⚠️
- Vercel ❌
- Netlify ❌
- Railway ❌

**Business Tools:**
- Slack (degraded) ⚠️
- Zoom (partial) ⚠️
- Trello ❌

**E-commerce:**
- Shopify stores ❌
- WooCommerce sites (on AWS) ❌

**Streaming:**
- Netflix (some regions) ⚠️
- Twitch ❌

## 🔍 Technical Deep Dive

### Apa Itu BGP Route Leak?

BGP (Border Gateway Protocol) adalah protokol yang "memberi tahu" internet bagaimana traffic harus di-route.

**Normal BGP:**
\`\`\`
User → ISP A → Cloudflare → Website
      (optimal path)
\`\`\`

**BGP Route Leak:**
\`\`\`
User → ISP A → ISP X (leak) → ??? → Black Hole
      (traffic hilang!)
\`\`\`

### Kenapa Bisa Terjadi?

1. **BGP Trust Problem**
   - BGP designed di tahun 1989, era "internet of trust"
   - No authentication, no validation
   - Anyone dapat announce "I'm the best path to X"

2. **Fat Finger Error**
   - Network engineer accidentally announced:
     \`\`\`
     ANNOUNCE 1.1.1.0/24 via AS64512
     \`\`\`
   - Seharusnya hanya internal routing, tapi **leaked ke public**

3. **Lack of RPKI**
   - RPKI (Resource Public Key Infrastructure) bisa prevent ini
   - Tapi adoption masih <40% globally
   - Many ISPs belum implement

### Cascading Effect

\`\`\`
ISP Leak
  ↓
Wrong routes propagate globally
  ↓
Traffic floods wrong nodes
  ↓
DDoS-like conditions
  ↓
Auto-scaling kicks in (but too late)
  ↓
Rate limiting triggers
  ↓
Legitimate traffic rejected
  ↓
Services down
\`\`\`

## 📊 Historical Context

Ini bukan pertama kali:

| Date | Incident | Duration | Cause |
|------|----------|----------|-------|
| 2008 | YouTube blackout | 2 hours | Pakistan Telecom BGP leak |
| 2017 | Google outage | 1 hour | Verizon BGP leak |
| 2021 | Facebook down | 7 hours | BGP withdrawal (internal) |
| **2025** | **Cloudflare + AWS** | **6 hours** | **Tier-1 ISP BGP leak** |

Pattern: **BGP is the weakest link.**

## 🛡️ Lessons Learned

### 1. **Single Point of Failure is Real**
Meskipun "distributed" dan "redundant", internet masih punya central chokepoints:
- DNS providers (Cloudflare, Route53)
- CDN networks
- BGP routing

### 2. **RPKI Adoption is Critical**
RPKI bisa prevent BGP leaks dengan cryptographic validation. Tapi:
- Only 38% of internet routes protected
- Slow adoption due to complexity & cost

### 3. **Multi-Cloud Strategy**
Don't put all eggs in one basket:
- Use multiple CDN providers
- Distribute across cloud providers
- Have fallback mechanisms

### 4. **Monitoring & Alerting**
Implement:
- Real-time BGP monitoring (BGPmon, RIPE Atlas)
- Anomaly detection
- Auto-failover systems

## 🔮 What's Next?

### Industry Reactions

**Cloudflare CEO:**
> "This incident highlights the fragility of internet infrastructure. We're doubling down on RPKI and working with ISPs globally to improve BGP security."

**AWS Statement:**
> "We're investing $500M in network resilience improvements including AI-powered anomaly detection and automated mitigation."

### Regulatory Pressure
Governments mulai discuss:
- Mandatory RPKI implementation
- Internet infrastructure regulation
- Penalties untuk BGP leaks

### Technical Improvements

1. **BGP Security Extensions**
   - BGPsec protocol (authenticated path)
   - ASPA (Autonomous System Provider Authorization)

2. **AI-Powered Detection**
   - Machine learning untuk detect anomalous routes
   - Predictive mitigation

3. **Quantum-Safe BGP**
   - Preparing untuk post-quantum cryptography

## 💻 Untuk Developer: Apa yang Bisa Dilakukan?

### 1. **Implement Graceful Degradation**
\`\`\`javascript
// Don't just fail when CDN is down
async function loadAsset(url) {
  const sources = [
    'https://cdn.cloudflare.com/asset.js',
    'https://cdn.jsdelivr.net/asset.js',
    '/local/asset.js' // Local fallback
  ]
  
  for (const source of sources) {
    try {
      return await fetch(source)
    } catch (err) {
      continue // Try next source
    }
  }
  
  throw new Error('All sources failed')
}
\`\`\`

### 2. **Monitor Your Dependencies**
Use tools:
- UptimeRobot
- Pingdom
- StatusCake

### 3. **Cache Aggressively**
\`\`\`javascript
// Service Worker caching strategy
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
      .catch(() => caches.match('/offline.html'))
  )
})
\`\`\`

### 4. **Test Failure Scenarios**
Regularly test:
- CDN unavailable
- DNS resolution failures
- API timeouts

Use tools seperti **Chaos Engineering** (Chaos Monkey, Gremlin).

## 🎓 Untuk Siswa GEMA

Pelajaran dari incident ini:

1. **Understand the Stack**
   - Your website bukan "just code"
   - Ada layers: DNS, CDN, servers, databases
   - Each layer bisa fail

2. **Design for Failure**
   - Murphy's Law: anything that can fail, will fail
   - Build systems yang robust terhadap failures

3. **Stay Updated**
   - Infrastructure issues affect everyone
   - Follow news, learn from incidents
   - Adapt your architecture

4. **Learn Networking Basics**
   - BGP, DNS, HTTP/HTTPS
   - How internet actually works
   - Not just web development

## 📚 Resources untuk Belajar Lebih Dalam

- [How BGP Works (Cloudflare Learning Center)](https://www.cloudflare.com/learning/security/glossary/bgp/)
- [BGP Route Leaks: What They Are and Why They Matter](https://blog.cloudflare.com/bgp-leaks/)
- [RPKI: Resource Public Key Infrastructure](https://rpki.readthedocs.io/)
- [AWS Architecture Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)
- [Chaos Engineering Principles](https://principlesofchaos.org/)

---

**Discussion Time:** Bagaimana menurut kalian? Apakah kita terlalu bergantung pada few big providers? Share your thoughts! 💬

*Published: 15 November 2025 | Author: Noah Caesar | Category: Infrastructure & Security*`,
    category: 'news',
    tags: JSON.stringify(['Internet', 'Infrastructure', 'BGP', 'Cloudflare', 'AWS', 'Outage', 'Networking']),
    author: 'Noah Caesar',
    authorId: 'admin-noah-placeholder',
    status: 'published',
    featured: true,
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=630&fit=crop',
    readTime: 12,
    views: 0,
    publishedAt: new Date('2025-11-15T16:45:00Z')
  }
]

async function main() {
  console.log('📰 Seeding news articles...')

  // Get actual admin Noah ID if exists
  const adminNoah = await prisma.admin.findFirst({
    where: { 
      OR: [
        { email: { contains: 'noah' } },
        { username: { contains: 'noah' } }
      ]
    }
  })

  for (const article of newsArticles) {
    // Update authorId if admin found
    if (adminNoah) {
      article.authorId = adminNoah.id
    }

    const existing = await prisma.article.findUnique({
      where: { slug: article.slug }
    })

    if (existing) {
      await prisma.article.update({
        where: { slug: article.slug },
        data: article
      })
      console.log(`✅ Updated article: ${article.title}`)
    } else {
      await prisma.article.create({
        data: article
      })
      console.log(`✅ Created article: ${article.title}`)
    }
  }

  console.log(`\n✅ Seeded ${newsArticles.length} news articles`)
  console.log(`   📰 Categories: news, AI, infrastructure`)
  console.log(`   🏷️  Topics: GPT-5, Gemini 3, Internet Outage`)
  console.log(`   📝 Total read time: ~30 minutes`)
}

main()
  .catch((error) => {
    console.error('❌ Error seeding news:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
