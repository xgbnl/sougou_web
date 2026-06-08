// Next Imports
import { NextResponse } from 'next/server'

// Types Imports
import type { User } from 'next-auth'

// Libs Imports
import { post } from '@/libs/http/next'

export async function POST(req: Request) {
  const credentials = await req.json()

  const response = await post<User>('/auth', { body: credentials })

  return NextResponse.json(response.body())
}
