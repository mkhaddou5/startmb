'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'
import { supabase } from '@/utils/supabase/client'

export default function EditListingPage() {
  const params = useParams()
  const listingId = params.id as string

  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [status, setStatus] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    setFile(selectedFile)
  }

  const handleUpload = async () => {
    if (!file || !listingId) {
      setStatus('Missing file or listing ID.')
      return
    }

    setUploading(true)
    setStatus(null)

    const filePath = `${listingId}/${file.name}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('listing-documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      setStatus('Upload failed.')
      setUploading(false)
      return
    }

    const publicUrl = supabase.storage
      .from('listing-documents')
      .getPublicUrl(filePath).data.publicUrl

    // Fetch current documents array
    const { data: listingData, error: listingFetchError } = await supabase
      .from('listings')
      .select('documents')
      .eq('id', listingId)
      .single()

    if (listingFetchError) {
      console.error('Failed to fetch listing:', listingFetchError)
      setStatus('Failed to fetch listing.')
      setUploading(false)
      return
    }

    const updatedDocs = Array.isArray(listingData.documents)
      ? [...listingData.documents, publicUrl]
      : [publicUrl]

    const { error: updateError } = await supabase
      .from('listings')
      .update({ documents: updatedDocs })
      .eq('id', listingId)

    if (updateError) {
      console.error('Failed to update listing:', updateError)
      setStatus('Failed to update documents.')
    } else {
      setStatus('✅ Upload successful!')
    }

    setUploading(false)
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upload Listing Documents</h1>

      <input
        type="file"
        onChange={handleFileChange}
        className="border p-2 rounded w-full mb-3"
      />

      <button
        onClick={handleUpload}
        disabled={uploading || !file}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>

      {status && <p className="mt-2 text-sm text-gray-700">{status}</p>}
    </div>
  )
}
