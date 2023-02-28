import { useState, useCallback } from 'react'
import { api } from '../state/api'
import { marked } from 'marked'

// TODO handlePublish and handleSaveDraft don't work. Probably shoouldn't even be here

export default function Publish() {
  const [fileName, setFileName] = useState('')
  const [markdown, setMarkdown] = useState('')
  const [fileNameError, setFileNameError] = useState('')

  const handlePublish = useCallback(
    async (e : React.SyntheticEvent) => {
      e.preventDefault()
      const a = await api.poke({
        app: 'blog',
        mark: 'blog-action',
        json: {
          "publish": {
            "path": fileName,
            "html": marked.parse(markdown),
            "md": markdown
      }}})
  }, [api, fileName, markdown])

  const handleSaveDraft = useCallback(
    async (e : React.SyntheticEvent) => {
      e.preventDefault()
      const a = await api.poke({
        app: 'blog',
        mark: 'blog-action',
        json: {
          "save-draft": {
            "path": fileName,
            "md": markdown
      }}})
  }, [api, fileName, markdown])
  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
    <div className="mb-4">
      <label className="block text-gray-700 font-bold mb-2">Name as <code>$path</code>:</label>
      <code>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="/example/path"
          value={fileName}
          onChange={e => setFileName(e.target.value)}
          pattern="^\/.+(?!\/)"
          required
        />
      </code>
      {
        fileNameError &&
        <p className="text-red-500 text-xs italic mt-1">{fileNameError}</p>
      }
    </div>
    <div className="flex text-xs gap-x-2">
      <button
        className="flex-1 bg-blue-500 hover:bg-blue-700 text-white p-2 rounded w-full disabled:opacity-50"
        disabled={!fileName}
        onClick={handleSaveDraft}
      >
        <code>%save-draft</code>
      </button>
      <button
        className="flex-1 bg-blue-500 hover:bg-blue-700 text-white p-2 rounded w-full disabled:opacity-50"
        disabled={!fileName}
        onClick={handlePublish}
      >
        <code>%publish</code>
      </button>
    </div>
  </div>
  )
}