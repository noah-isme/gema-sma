import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email?: string | null
      name: string
      role: string
      userType?: string
      studentId?: string | null
      username?: string | null
      class?: string
    }
  }

  interface User {
    id: string
    email?: string | null
    name: string
    role: string
    userType?: string
    studentId?: string | null
    username?: string | null
    class?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string
    userType?: string
    studentId?: string | null
    username?: string | null
    class?: string
  }
}
