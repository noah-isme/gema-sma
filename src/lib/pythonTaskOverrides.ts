import type { PythonCodingTask, PythonTestCase } from '@prisma/client'

type TaskWithCases = PythonCodingTask & { testCases: PythonTestCase[] }

type OverrideTestCase = {
  name: string
  input: string
  expectedOutput: string
  isHidden?: boolean
  points?: number
  order?: number
}

type TaskOverride = {
  starterCode: string
  description?: string
  testCases: OverrideTestCase[]
}

const overrides: Record<string, TaskOverride> = {
  'penjumlahan-dua-bilangan': {
    description: `Buatlah fungsi yang menerima dua bilangan sebagai parameter dan mengembalikan hasil penjumlahannya.

Contoh:
- Input: 5, 3 → Output: 8
- Input: -2, 7 → Output: 5

Format input: dua bilangan dipisahkan spasi, misalnya "5 3". Cetak hasil penjumlahannya.`,
    starterCode: `def add_numbers(a, b):
    # TODO: Return the sum of a and b
    pass

if __name__ == "__main__":
    import sys
    raw = sys.stdin.read().strip().split()
    if len(raw) >= 2:
        a, b = map(int, raw[:2])
        print(add_numbers(a, b))`,
    testCases: [
      { name: 'Test Case 1: Bilangan Positif', input: '5 3', expectedOutput: '8', points: 33, order: 1, isHidden: false },
      { name: 'Test Case 2: Bilangan Negatif', input: '-2 7', expectedOutput: '5', points: 33, order: 2, isHidden: false },
      { name: 'Test Case 3: Nol', input: '10 0', expectedOutput: '10', points: 34, order: 3, isHidden: true }
    ]
  },
  fizzbuzz: {
    description: `Buatlah fungsi FizzBuzz yang menerima sebuah bilangan n dan mengembalikan:
- "Fizz" jika n habis dibagi 3
- "Buzz" jika n habis dibagi 5
- "FizzBuzz" jika n habis dibagi 3 dan 5
- String dari bilangan tersebut jika tidak memenuhi kondisi di atas

Contoh:
- Input: 3 → Output: "Fizz"
- Input: 5 → Output: "Buzz"
- Input: 15 → Output: "FizzBuzz"
- Input: 7 → Output: "7"

Format input: satu bilangan bulat n. Cetak hasil FizzBuzz untuk n.`,
    starterCode: `def fizzbuzz(n):
    # TODO: Implement FizzBuzz logic
    pass

if __name__ == "__main__":
    import sys
    raw = sys.stdin.read().strip()
    if raw:
        n = int(raw)
        print(fizzbuzz(n))`,
    testCases: [
      { name: 'Test Case 1: Fizz', input: '3', expectedOutput: 'Fizz', points: 25, order: 1, isHidden: false },
      { name: 'Test Case 2: Buzz', input: '5', expectedOutput: 'Buzz', points: 25, order: 2, isHidden: false },
      { name: 'Test Case 3: FizzBuzz', input: '15', expectedOutput: 'FizzBuzz', points: 25, order: 3, isHidden: false },
      { name: 'Test Case 4: Number', input: '7', expectedOutput: '7', points: 25, order: 4, isHidden: false }
    ]
  },
  'palindrome-checker': {
    description: `Buatlah fungsi yang mengecek apakah sebuah string adalah palindrome (dibaca sama dari depan dan belakang).

Fungsi harus:
- Return True jika string adalah palindrome
- Return False jika bukan palindrome
- Ignore spasi dan case sensitivity

Contoh:
- "katak" → True
- "Katak" → True
- "python" → False
- "A man a plan a canal Panama" → True (ignore spasi)

Format input: satu baris string yang bisa mengandung spasi. Cetak True atau False sesuai hasil pengecekan.`,
    starterCode: `def is_palindrome(text):
    # TODO: Check if text is palindrome
    pass

if __name__ == "__main__":
    import sys
    text = sys.stdin.read().strip()
    if text:
        print(is_palindrome(text))`,
    testCases: [
      { name: 'Test Case 1: Simple Palindrome', input: 'katak', expectedOutput: 'True', points: 50, order: 1, isHidden: false },
      { name: 'Test Case 2: Not Palindrome', input: 'python', expectedOutput: 'False', points: 50, order: 2, isHidden: false }
    ]
  },
  'faktorial-rekursif': {
    description: `Buatlah fungsi faktorial menggunakan rekursi.

Faktorial dari n (ditulis n!) adalah hasil perkalian dari semua bilangan positif dari 1 hingga n.

Contoh:
- 5! = 5 × 4 × 3 × 2 × 1 = 120
- 3! = 3 × 2 × 1 = 6
- 0! = 1 (by definition)

Fungsi harus menggunakan rekursi (fungsi memanggil dirinya sendiri).
Format input: satu bilangan bulat n. Cetak n! dalam satu baris.`,
    starterCode: `def factorial(n):
    # TODO: Implement factorial using recursion
    pass

if __name__ == "__main__":
    import sys
    raw = sys.stdin.read().strip()
    if raw:
        n = int(raw)
        print(factorial(n))`,
    testCases: [
      { name: 'Test Case 1: Faktorial 5', input: '5', expectedOutput: '120', points: 33, order: 1, isHidden: false },
      { name: 'Test Case 2: Faktorial 3', input: '3', expectedOutput: '6', points: 33, order: 2, isHidden: false },
      { name: 'Test Case 3: Faktorial 0', input: '0', expectedOutput: '1', points: 34, order: 3, isHidden: false }
    ]
  }
}

interface OverrideOptions {
  includeHidden?: boolean
}

export function applyPythonTaskOverrides<T extends TaskWithCases>(
  task: T,
  options: OverrideOptions = {}
): T {
  const override = overrides[task.slug]
  if (!override) {
    return task
  }

  const includeHidden = options.includeHidden ?? true
  const normalizedTestCases = override.testCases
    .filter(tc => includeHidden || !tc.isHidden)
    .map((tc, index) => ({
      id: `${task.id}-override-${index}`,
      taskId: task.id,
      name: tc.name,
      input: tc.input,
      expectedOutput: tc.expectedOutput,
      points: (tc.points ?? Math.round(task.points / override.testCases.length)) || 0,
      order: tc.order ?? index + 1,
      isHidden: Boolean(tc.isHidden)
    }))

  return {
    ...task,
    description: override.description ?? task.description,
    starterCode: override.starterCode ?? task.starterCode,
    testCases: normalizedTestCases
  }
}
