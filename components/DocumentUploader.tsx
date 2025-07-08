'use client'

type Props = {
  onFileSelect: (files: FileList) => void
  uploadedFiles: string[]
  reviewResults: string[]
  loadingReview: boolean
}

export default function DocumentUploader({
  onFileSelect,
  uploadedFiles,
  reviewResults,
  loadingReview,
}: Props) {
  return (
    <div className="space-y-6">
      <label className="block font-semibold">Upload Seller Documents</label>
      <p className="text-sm text-gray-500 mb-1">
        You can upload multiple files. No file type restrictions.
      </p>
      <input
        type="file"
        multiple
        className="border p-2 rounded w-full"
        onChange={(e) => {
          if (e.target.files) {
            onFileSelect(e.target.files)
          }
        }}
      />

      {uploadedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          {uploadedFiles.map((fileName, index) => (
            <p key={index} className="text-green-600 text-sm">
              ✅ Uploaded: {fileName}
              {loadingReview && (
                <span className="ml-2 text-blue-600">🤖 AI reviewing...</span>
              )}
              {reviewResults[index] && (
                <div className="mt-1 text-gray-700 text-sm">
                  <strong>AI Feedback:</strong> {reviewResults[index]}
                </div>
              )}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}
