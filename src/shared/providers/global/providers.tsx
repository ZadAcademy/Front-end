import React from 'react'
import { ReactQueryProviders } from './providers/react-query.provider'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { NextIntlClientProvider } from 'next-intl'
import NextAuthProvider from './providers/next-auth.provider'
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProviders>
      
      <ReactQueryDevtools initialIsOpen={true} />
      
      <NextIntlClientProvider>
        <NextAuthProvider>
          {children}
        </NextAuthProvider>
      </NextIntlClientProvider>

    </ReactQueryProviders>
  )
}
