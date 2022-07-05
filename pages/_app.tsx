import type { AppProps } from 'next/app'
import { AuthProvider } from '../lib/auth'
import React from "react"
import Head from 'next/head'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <React.StrictMode>
        <Head>
          <link rel="shortcut icon" href="/favicon.ico" />
        </Head>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
    </React.StrictMode>
  )
}
