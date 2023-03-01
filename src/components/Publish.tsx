import { useState, useCallback } from 'react'
import { api } from '../state/api'
import { marked } from 'marked'

// TODO handlePublish and handleSaveDraft don't work. Probably shoouldn't even be here

export default function Publish() {
  const [fileName, setFileName] = useState('')
  const [markdown, setMarkdown] = useState('')
  const [fileNameError, setFileNameError] = useState('')



  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">

    <div className="flex text-xs gap-x-2">

    </div>
  </div>
  )
}