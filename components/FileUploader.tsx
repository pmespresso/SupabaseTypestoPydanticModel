'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

export default function FileUploader() {
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [convertedCode, setConvertedCode] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) return

    setIsLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Conversion failed')
      }

      const code = await response.text()
      setConvertedCode(code)
    } catch (err) {
      setError('An error occurred during conversion')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = () => {
    if (!convertedCode) return
    const blob = new Blob([convertedCode], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.style.display = 'none'
    a.href = url
    a.download = 'converted_models.py'
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleCopyToClipboard = () => {
    if (!convertedCode) return
    navigator.clipboard.writeText(convertedCode)
      .then(() => alert('Copied to clipboard!'))
      .catch(() => alert('Failed to copy to clipboard'))
  }

  return (
    <div className="space-y-4 border-black">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="file"
            accept=".ts"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>
        <Button type="submit" disabled={!file || isLoading}>
          {isLoading ? 'Converting...' : 'Convert to Pydantic Models'}
        </Button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
      {convertedCode && (
        <div className="space-y-4">
          <Textarea
            value={convertedCode}
            readOnly
            className="font-mono text-sm h-64"
          />
          <div className="space-x-2">
            <Button onClick={handleDownload}>Download</Button>
            <Button onClick={handleCopyToClipboard}>Copy to Clipboard</Button>
          </div>
        </div>
      )}
    </div>
  )
}

