import NextAuth from 'next-auth'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import { db } from './db-postgres'
import { users, accounts, sessions } from './db/schema'

export const {
  handlers,
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
  }),
  providers: [
    CredentialsProvider({
      name: 'demo',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'Enter any username' }
      },
      async authorize(credentials) {
        // Demo mode - no email verification required
        if (!credentials?.username) {
          throw new Error('Username is required')
        }

        // Create a demo user session without database validation
        return {
          id: `demo-${Date.now()}`,
          email: `${credentials.username}@demo.local`,
          name: credentials.username as string,
          image: null,
          role: 'user',
        }
      }
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
})

// Export for middleware
export const config = {
  matcher: ['/admin/:path*', '/account/:path*', '/checkout/:path*']
}
