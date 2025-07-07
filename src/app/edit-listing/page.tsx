'use client'

import { Suspense } from 'react'
import EditListingInner from './EditListingInner'

export default function EditListingPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <EditListingInner />
    </Suspense>
  )
}
