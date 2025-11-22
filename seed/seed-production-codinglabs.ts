import { PrismaClient, CodingDifficulty } from '@prisma/client'

const prisma = new PrismaClient()

const codingLabsData = [
  {
    title: 'Python Fundamentals - Level 1 (Easy)',
    description: 'Latihan dasar Python untuk pemula: print, input, operasi aritmatika sederhana',
    difficulty: CodingDifficulty.BEGINNER,
    language: 'Python',
    points: 100,
    duration: 60,
    isActive: true,
    exercises: [
      {
        title: 'Print Hello',
        description: 'Buat program yang menerima input nama dan mencetak "Hello, <nama>"',
        difficulty: CodingDifficulty.BEGINNER,
        points: 10,
        timeLimit: 5,
        memoryLimit: 128,
        instructions: `# Print Hello

## Deskripsi
Buat program yang menerima input nama dari user dan mencetak "Hello, <nama>".

## Input
- Satu baris string: nama user

## Output
- Cetak: "Hello, <nama>"

## Contoh
**Input:**
\`\`\`
Budi
\`\`\`

**Output:**
\`\`\`
Hello, Budi
\`\`\`

## Hints
- Gunakan \`input()\` untuk menerima input
- Gunakan \`print()\` untuk output
- Gunakan f-string atau concatenation`,
        starterCode: `# Tulis kode kamu di sini
nama = input()
# TODO: Print "Hello, <nama>"
`,
        solutionCode: `nama = input()
print(f"Hello, {nama}")`,
        hints: JSON.stringify(['Gunakan f-string: f"Hello, {nama}"', 'Atau concatenation: "Hello, " + nama']),
        tags: JSON.stringify(['print', 'input', 'string', 'basic']),
        testCases: [
          { input: 'Budi', expectedOutput: 'Hello, Budi', isHidden: false, explanation: 'Test case dasar' },
          { input: 'Ani', expectedOutput: 'Hello, Ani', isHidden: false, explanation: 'Test dengan nama lain' },
          { input: 'John Doe', expectedOutput: 'Hello, John Doe', isHidden: true, explanation: 'Test dengan nama lengkap' }
        ]
      },
      {
        title: 'Jumlah Dua Angka',
        description: 'Hitung jumlah dari dua bilangan integer',
        difficulty: CodingDifficulty.BEGINNER,
        points: 10,
        timeLimit: 5,
        memoryLimit: 128,
        instructions: `# Jumlah Dua Angka

## Deskripsi
Buat program yang menerima dua bilangan integer dan mencetak jumlahnya.

## Input
- Baris 1: integer pertama (a)
- Baris 2: integer kedua (b)

## Output
- Cetak jumlah a + b

## Contoh
**Input:**
\`\`\`
5
3
\`\`\`

**Output:**
\`\`\`
8
\`\`\`

## Constraints
- -1000 ≤ a, b ≤ 1000`,
        starterCode: `# Input dua angka
a = int(input())
b = int(input())
# TODO: Hitung dan print jumlahnya
`,
        solutionCode: `a = int(input())
b = int(input())
print(a + b)`,
        hints: JSON.stringify(['Gunakan int() untuk convert string ke integer', 'Operator + untuk penjumlahan']),
        tags: JSON.stringify(['aritmatika', 'input', 'integer', 'basic']),
        testCases: [
          { input: '5\n3', expectedOutput: '8', isHidden: false, explanation: 'Test positif' },
          { input: '-10\n15', expectedOutput: '5', isHidden: false, explanation: 'Test dengan negatif' },
          { input: '0\n0', expectedOutput: '0', isHidden: true, explanation: 'Test dengan nol' },
          { input: '999\n1', expectedOutput: '1000', isHidden: true, explanation: 'Test batas atas' }
        ]
      },
      {
        title: 'Selisih Angka (Absolute Difference)',
        description: 'Hitung selisih mutlak dari dua bilangan',
        difficulty: CodingDifficulty.BEGINNER,
        points: 10,
        timeLimit: 5,
        memoryLimit: 128,
        instructions: `# Selisih Angka

## Deskripsi
Hitung selisih mutlak (absolute difference) dari dua bilangan integer.

## Input
- Baris 1: integer a
- Baris 2: integer b

## Output
- Cetak |a - b| (nilai mutlak dari a - b)

## Contoh
**Input:**
\`\`\`
10
3
\`\`\`

**Output:**
\`\`\`
7
\`\`\`

**Input 2:**
\`\`\`
3
10
\`\`\`

**Output 2:**
\`\`\`
7
\`\`\`

## Hints
- Gunakan fungsi \`abs()\` untuk nilai mutlak`,
        starterCode: `a = int(input())
b = int(input())
# TODO: Hitung selisih mutlak
`,
        solutionCode: `a = int(input())
b = int(input())
print(abs(a - b))`,
        hints: JSON.stringify(['Fungsi abs() mengembalikan nilai mutlak', 'abs(-5) = 5', 'abs(5) = 5']),
        tags: JSON.stringify(['abs', 'aritmatika', 'basic']),
        testCases: [
          { input: '10\n3', expectedOutput: '7', isHidden: false, explanation: 'a > b' },
          { input: '3\n10', expectedOutput: '7', isHidden: false, explanation: 'a < b' },
          { input: '5\n5', expectedOutput: '0', isHidden: true, explanation: 'a = b' },
          { input: '-5\n5', expectedOutput: '10', isHidden: true, explanation: 'Negatif dan positif' }
        ]
      }
    ]
  },
  
  {
    title: 'Python Fundamentals - Level 2 (Medium)',
    description: 'Logika pemrograman menengah: loop, kondisi, fungsi matematika',
    difficulty: CodingDifficulty.INTERMEDIATE,
    language: 'Python',
    points: 150,
    duration: 90,
    isActive: true,
    exercises: [
      {
        title: 'Faktorial (Loop)',
        description: 'Hitung faktorial dari bilangan n menggunakan loop',
        difficulty: CodingDifficulty.INTERMEDIATE,
        points: 20,
        timeLimit: 10,
        memoryLimit: 128,
        instructions: `# Faktorial

## Deskripsi
Hitung faktorial dari bilangan n (n!).
Faktorial: n! = n × (n-1) × (n-2) × ... × 1

## Input
- Satu integer n (0 ≤ n ≤ 20)

## Output
- Cetak n!

## Contoh
**Input:**
\`\`\`
5
\`\`\`

**Output:**
\`\`\`
120
\`\`\`

**Penjelasan:** 5! = 5 × 4 × 3 × 2 × 1 = 120

## Catatan
- 0! = 1
- Gunakan loop, bukan rekursi`,
        starterCode: `n = int(input())
# TODO: Hitung faktorial n
# Gunakan loop for atau while
`,
        solutionCode: `n = int(input())
faktorial = 1
for i in range(1, n + 1):
    faktorial *= i
print(faktorial)`,
        hints: JSON.stringify([
          'Mulai dari faktorial = 1',
          'Loop dari 1 sampai n',
          'faktorial *= i di setiap iterasi',
          'range(1, n+1) untuk 1, 2, ..., n'
        ]),
        tags: JSON.stringify(['loop', 'faktorial', 'matematika', 'medium']),
        testCases: [
          { input: '5', expectedOutput: '120', isHidden: false, explanation: '5! = 120' },
          { input: '0', expectedOutput: '1', isHidden: false, explanation: '0! = 1' },
          { input: '1', expectedOutput: '1', isHidden: false, explanation: '1! = 1' },
          { input: '10', expectedOutput: '3628800', isHidden: true, explanation: '10!' },
          { input: '20', expectedOutput: '2432902008176640000', isHidden: true, explanation: 'Batas atas' }
        ]
      },
      {
        title: 'Cek Prima',
        description: 'Cek apakah sebuah bilangan adalah bilangan prima',
        difficulty: CodingDifficulty.INTERMEDIATE,
        points: 25,
        timeLimit: 10,
        memoryLimit: 128,
        instructions: `# Cek Bilangan Prima

## Deskripsi
Cek apakah bilangan n adalah bilangan prima.
Prima: bilangan > 1 yang hanya habis dibagi 1 dan dirinya sendiri.

## Input
- Satu integer n (2 ≤ n ≤ 10000)

## Output
- "PRIMA" jika n prima
- "BUKAN PRIMA" jika n bukan prima

## Contoh
**Input:**
\`\`\`
7
\`\`\`

**Output:**
\`\`\`
PRIMA
\`\`\`

**Input 2:**
\`\`\`
10
\`\`\`

**Output 2:**
\`\`\`
BUKAN PRIMA
\`\`\`

## Algoritma
- Loop dari 2 sampai sqrt(n)
- Jika n habis dibagi i, bukan prima
- Optimasi: cek sampai √n saja`,
        starterCode: `n = int(input())
# TODO: Cek apakah n prima
# Hint: loop dari 2 sampai sqrt(n)
`,
        solutionCode: `n = int(input())
prima = True
for i in range(2, int(n**0.5) + 1):
    if n % i == 0:
        prima = False
        break
if prima:
    print("PRIMA")
else:
    print("BUKAN PRIMA")`,
        hints: JSON.stringify([
          'Loop dari 2 sampai sqrt(n)',
          'Jika n % i == 0, maka n bukan prima',
          'Gunakan break untuk efisiensi',
          'import math untuk math.sqrt() atau gunakan n**0.5'
        ]),
        tags: JSON.stringify(['prima', 'loop', 'matematika', 'medium']),
        testCases: [
          { input: '7', expectedOutput: 'PRIMA', isHidden: false, explanation: '7 adalah prima' },
          { input: '10', expectedOutput: 'BUKAN PRIMA', isHidden: false, explanation: '10 = 2 × 5' },
          { input: '2', expectedOutput: 'PRIMA', isHidden: false, explanation: 'Prima terkecil' },
          { input: '97', expectedOutput: 'PRIMA', isHidden: true, explanation: 'Prima dua digit' },
          { input: '100', expectedOutput: 'BUKAN PRIMA', isHidden: true, explanation: '100 = 10 × 10' }
        ]
      },
      {
        title: 'Jumlah Deret 1 sampai N',
        description: 'Hitung jumlah 1 + 2 + 3 + ... + n',
        difficulty: CodingDifficulty.INTERMEDIATE,
        points: 15,
        timeLimit: 10,
        memoryLimit: 128,
        instructions: `# Jumlah Deret

## Deskripsi
Hitung jumlah: 1 + 2 + 3 + ... + n

## Input
- Satu integer n (1 ≤ n ≤ 1000000)

## Output
- Cetak jumlah deret

## Contoh
**Input:**
\`\`\`
5
\`\`\`

**Output:**
\`\`\`
15
\`\`\`

**Penjelasan:** 1 + 2 + 3 + 4 + 5 = 15

## Bonus Challenge
Ada formula matematika untuk ini: n × (n + 1) / 2
Coba implementasi dengan loop DAN dengan formula!`,
        starterCode: `n = int(input())
# TODO: Hitung jumlah 1 + 2 + ... + n
`,
        solutionCode: `n = int(input())
# Solusi 1: Loop (O(n))
# jumlah = 0
# for i in range(1, n + 1):
#     jumlah += i
# print(jumlah)

# Solusi 2: Formula (O(1))
print(n * (n + 1) // 2)`,
        hints: JSON.stringify([
          'Solusi loop: jumlah = sum(range(1, n+1))',
          'Solusi formula: n × (n + 1) / 2',
          'Gunakan // untuk integer division'
        ]),
        tags: JSON.stringify(['deret', 'loop', 'matematika', 'medium']),
        testCases: [
          { input: '5', expectedOutput: '15', isHidden: false, explanation: '1+2+3+4+5 = 15' },
          { input: '1', expectedOutput: '1', isHidden: false, explanation: 'n = 1' },
          { input: '10', expectedOutput: '55', isHidden: false, explanation: '1+...+10 = 55' },
          { input: '100', expectedOutput: '5050', isHidden: true, explanation: 'Classic problem' },
          { input: '1000', expectedOutput: '500500', isHidden: true, explanation: 'Larger input' }
        ]
      }
    ]
  },
  
  {
    title: 'Python Fundamentals - Level 3 (Hard)',
    description: 'Algoritma menengah-lanjut: array manipulation, dictionary, problem solving',
    difficulty: CodingDifficulty.ADVANCED,
    language: 'Python',
    points: 200,
    duration: 120,
    isActive: true,
    exercises: [
      {
        title: 'Maximum Subarray Sum',
        description: 'Cari jumlah maksimum dari subarray yang berurutan (Kadane\'s Algorithm)',
        difficulty: CodingDifficulty.ADVANCED,
        points: 40,
        timeLimit: 15,
        memoryLimit: 256,
        instructions: `# Maximum Subarray Sum

## Deskripsi
Diberikan array of integers, cari jumlah maksimum dari subarray yang berurutan (contiguous).

## Input
- Baris 1: integer n (1 ≤ n ≤ 100000)
- Baris 2: n integers dipisah spasi

## Output
- Cetak jumlah maksimum subarray

## Contoh
**Input:**
\`\`\`
9
-2 1 -3 4 -1 2 1 -5 4
\`\`\`

**Output:**
\`\`\`
6
\`\`\`

**Penjelasan:** 
Subarray [4, -1, 2, 1] punya jumlah terbesar = 6

## Algoritma (Kadane's Algorithm)
1. Traverse array dari kiri ke kanan
2. Track: current_sum dan max_sum
3. current_sum = max(num, current_sum + num)
4. max_sum = max(max_sum, current_sum)

## Complexity
- Time: O(n)
- Space: O(1)`,
        starterCode: `n = int(input())
arr = list(map(int, input().split()))
# TODO: Implementasi Kadane's Algorithm
# Track current_sum dan max_sum
`,
        solutionCode: `n = int(input())
arr = list(map(int, input().split()))

max_sum = arr[0]
current_sum = arr[0]

for i in range(1, n):
    current_sum = max(arr[i], current_sum + arr[i])
    max_sum = max(max_sum, current_sum)

print(max_sum)`,
        hints: JSON.stringify([
          'Kadane\'s Algorithm: DP approach',
          'current_sum = max(num, current_sum + num)',
          'Artinya: mulai baru atau lanjut subarray?',
          'max_sum track nilai terbesar sepanjang traverse'
        ]),
        tags: JSON.stringify(['array', 'dynamic-programming', 'kadane', 'hard']),
        testCases: [
          { input: '9\n-2 1 -3 4 -1 2 1 -5 4', expectedOutput: '6', isHidden: false, explanation: '[4,-1,2,1] = 6' },
          { input: '1\n5', expectedOutput: '5', isHidden: false, explanation: 'Single element' },
          { input: '3\n-1 -2 -3', expectedOutput: '-1', isHidden: false, explanation: 'All negative' },
          { input: '5\n1 2 3 4 5', expectedOutput: '15', isHidden: true, explanation: 'All positive' },
          { input: '6\n-2 -3 4 -1 -2 1', expectedOutput: '4', isHidden: true, explanation: 'Mixed' }
        ]
      },
      {
        title: 'Frekuensi Karakter',
        description: 'Hitung frekuensi kemunculan setiap karakter dalam string',
        difficulty: CodingDifficulty.ADVANCED,
        points: 35,
        timeLimit: 10,
        memoryLimit: 256,
        instructions: `# Frekuensi Karakter

## Deskripsi
Hitung berapa kali setiap karakter muncul dalam string.
Output: dictionary (huruf → jumlah) dalam format yang terurut.

## Input
- Satu baris string (hanya lowercase a-z)

## Output
- Setiap baris: "huruf: jumlah"
- Urut berdasarkan alfabet

## Contoh
**Input:**
\`\`\`
hello
\`\`\`

**Output:**
\`\`\`
e: 1
h: 1
l: 2
o: 1
\`\`\`

## Hints
- Gunakan dictionary: freq = {}
- Loop string, hitung kemunculan
- Sort by key saat print`,
        starterCode: `s = input()
# TODO: Hitung frekuensi setiap karakter
# Gunakan dictionary
# Print terurut alfabetis
`,
        solutionCode: `s = input()
freq = {}
for char in s:
    freq[char] = freq.get(char, 0) + 1

for char in sorted(freq.keys()):
    print(f"{char}: {freq[char]}")`,
        hints: JSON.stringify([
          'Dictionary: freq[char] = freq.get(char, 0) + 1',
          'Atau gunakan defaultdict(int)',
          'sorted(freq.keys()) untuk urut alfabet',
          'f-string: f"{char}: {freq[char]}"'
        ]),
        tags: JSON.stringify(['dictionary', 'string', 'frequency', 'hard']),
        testCases: [
          { input: 'hello', expectedOutput: 'e: 1\nh: 1\nl: 2\no: 1', isHidden: false, explanation: 'Basic test' },
          { input: 'aaa', expectedOutput: 'a: 3', isHidden: false, explanation: 'Single char' },
          { input: 'abcabc', expectedOutput: 'a: 2\nb: 2\nc: 2', isHidden: true, explanation: 'Repeated pattern' },
          { input: 'programming', expectedOutput: 'a: 1\ng: 2\ni: 1\nm: 2\nn: 1\no: 1\np: 1\nr: 2', isHidden: true, explanation: 'Longer string' }
        ]
      },
      {
        title: 'Mode (Nilai Terbanyak)',
        description: 'Cari nilai yang paling sering muncul dalam list',
        difficulty: CodingDifficulty.ADVANCED,
        points: 30,
        timeLimit: 10,
        memoryLimit: 256,
        instructions: `# Mode (Nilai Terbanyak)

## Deskripsi
Cari nilai yang paling sering muncul (mode) dalam list angka.
Jika ada beberapa mode, cetak yang terkecil.

## Input
- Baris 1: integer n (1 ≤ n ≤ 10000)
- Baris 2: n integers dipisah spasi

## Output
- Cetak mode (nilai terbanyak)

## Contoh
**Input:**
\`\`\`
7
1 2 2 3 3 3 4
\`\`\`

**Output:**
\`\`\`
3
\`\`\`

**Penjelasan:** 3 muncul 3 kali (paling banyak)

## Contoh 2 (Tie)
**Input:**
\`\`\`
6
1 1 2 2 3 4
\`\`\`

**Output:**
\`\`\`
1
\`\`\`

**Penjelasan:** 1 dan 2 sama-sama muncul 2x, pilih yang terkecil (1)

## Hints
- Gunakan dictionary untuk frekuensi
- Track max_count dan mode
- Jika tie, pilih yang lebih kecil`,
        starterCode: `n = int(input())
arr = list(map(int, input().split()))
# TODO: Cari mode (nilai terbanyak)
# Jika tie, pilih yang terkecil
`,
        solutionCode: `n = int(input())
arr = list(map(int, input().split()))

freq = {}
for num in arr:
    freq[num] = freq.get(num, 0) + 1

max_count = max(freq.values())
mode = min([num for num, count in freq.items() if count == max_count])

print(mode)`,
        hints: JSON.stringify([
          'Hitung frekuensi dengan dictionary',
          'max_count = max(freq.values())',
          'List comprehension: [num for num, count in freq.items() if count == max_count]',
          'min() untuk pilih yang terkecil saat tie'
        ]),
        tags: JSON.stringify(['dictionary', 'statistics', 'mode', 'hard']),
        testCases: [
          { input: '7\n1 2 2 3 3 3 4', expectedOutput: '3', isHidden: false, explanation: '3 muncul 3x' },
          { input: '6\n1 1 2 2 3 4', expectedOutput: '1', isHidden: false, explanation: 'Tie: pilih 1 (kecil)' },
          { input: '1\n5', expectedOutput: '5', isHidden: false, explanation: 'Single element' },
          { input: '5\n5 5 5 5 5', expectedOutput: '5', isHidden: true, explanation: 'All same' },
          { input: '10\n1 2 3 4 5 5 4 3 2 1', expectedOutput: '1', isHidden: true, explanation: 'All tie' }
        ]
      }
    ]
  }
]

async function main() {
  console.log('💻 Seeding coding labs...')

  for (const lab of codingLabsData) {
    const { exercises, ...labData } = lab
    
    const existing = await prisma.codingLab.findFirst({
      where: { title: labData.title }
    })

    let codingLab
    if (existing) {
      codingLab = await prisma.codingLab.update({
        where: { id: existing.id },
        data: labData
      })
      console.log(`✅ Updated lab: ${labData.title}`)
    } else {
      codingLab = await prisma.codingLab.create({
        data: labData
      })
      console.log(`✅ Created lab: ${labData.title}`)
    }

    // Create exercises and test cases
    for (const exercise of exercises) {
      const { testCases, ...exerciseData } = exercise
      
      const existingExercise = await prisma.codingExercise.findFirst({
        where: { 
          labId: codingLab.id,
          title: exerciseData.title 
        }
      })

      let codingExercise
      if (existingExercise) {
        codingExercise = await prisma.codingExercise.update({
          where: { id: existingExercise.id },
          data: { ...exerciseData, labId: codingLab.id }
        })
        console.log(`  ✅ Updated exercise: ${exerciseData.title}`)
      } else {
        codingExercise = await prisma.codingExercise.create({
          data: { ...exerciseData, labId: codingLab.id }
        })
        console.log(`  ✅ Created exercise: ${exerciseData.title}`)
      }

      // Create test cases
      await prisma.codingTestCase.deleteMany({
        where: { exerciseId: codingExercise.id }
      })

      for (const testCase of testCases) {
        await prisma.codingTestCase.create({
          data: {
            ...testCase,
            exerciseId: codingExercise.id
          }
        })
      }
      console.log(`    ✅ Created ${testCases.length} test cases`)
    }
  }

  const totalExercises = codingLabsData.reduce((sum, lab) => sum + lab.exercises.length, 0)
  console.log(`\n✅ Seeded ${codingLabsData.length} coding labs with ${totalExercises} exercises`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
