import Link from 'next/link'
import React from 'react'

export default function NotFound() {
  return (
    <html>
      <body className='flex flex-col items-center justify-center'>
        <div className='text-2xl font-bold'>NotFound</div>
        <Link href="/ar" className='text-blue-700'>Go Home</Link>
      </body>
    </html>
  )
}
