// AUTH Imports
import NextAuth from 'next-auth'
import type { JWT } from 'next-auth/jwt'
import type { User } from 'next-auth'

interface Authenticatable {
  token?: string
}

declare module 'next-auth' {
  interface User extends Authenticatable { }
}

declare module 'next-auth/jwt' {
  interface JWT extends User { }
}
