const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setError(null)

  if (!userId) {
    setError("User not authenticated.")
    return
  }

  const price = parseFloat(priceRaw.replace(/[^0-9.]/g, ''))
  const houseSqft = parseInt(houseSqftRaw)
  const lotSqft = parseInt(lotSqftRaw)

  let uploadedImageUrls: string[] = []

  for (let i = 0; i < imageFiles.length; i++) {
    const file = imageFiles[i]
    if (file) {
      const fileExt = file.name.split('.').pop()
      const filePath = `${userId}/${Date.now()}-${i}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('listing-images')
        .upload(filePath, file)

      if (uploadError) {
        console.error('Upload error:', uploadError.message)
        setError('Image upload failed: ' + uploadError.message)
        return
      }

      const { data: publicUrlData } = supabase.storage
        .from('listing-images')
        .getPublicUrl(filePath)

      uploadedImageUrls.push(publicUrlData.publicUrl)
    }
  }

  const { error: insertError } = await supabase.from('listings').insert([
    {
      title,
      description,
      price,
      address,
      bedrooms: parseInt(bedrooms),
      bathrooms: parseInt(bathrooms),
      house_sqft: houseSqft,
      lot_sqft: lotSqft,
      user_id: userId, // this is the important part!
      images: uploadedImageUrls,
    },
  ])

  if (insertError) {
    console.error('Insert error:', insertError.message)
    setError('Failed to add listing: ' + insertError.message)
  } else {
    router.push('/dashboard')
  }
}
