import { useState, useCallback, useEffect } from 'react'
import { api } from '../state/api'
import { marked } from 'marked'
import { useStore } from '../state/base'

type BottomBarProps = {
  showPreview: boolean
  setShowPreview: React.Dispatch<React.SetStateAction<boolean>>
}

export default function BottomBar({ showPreview, setShowPreview }: BottomBarProps) {
  const [fileName, setFileName] = useState('')
  const [fileNameError, setFileNameError] = useState('')
  const { markdown, pages, allBindings, drafts, getAll } = useStore() // TODO could make more efficient by not rerendering every time

  const handlePublish = useCallback(
    async (e : React.SyntheticEvent) => {
      e.preventDefault()
      await api.poke({
        app: 'blog',
        mark: 'blog-action',
        json: {
          "publish": {
            "path": fileName,
            "html": marked.parse(markdown),
            "md": markdown
      }}})
      getAll()
  }, [fileName, markdown])

  const handleSaveDraft = useCallback(
    async (e : React.SyntheticEvent) => {
      e.preventDefault()
      await api.poke({
        app: 'blog',
        mark: 'blog-action',
        json: {
          "save-draft": {
            "path": fileName,
            "md": markdown
      }}})
      getAll()
  },  [fileName, markdown])

  useEffect(() => {
    if (fileName.charAt(fileName.length - 1) === '/') {
      setFileNameError(`cannot end in a slash`)
    } else if (fileName.charAt(0) !== '/'){
      setFileNameError(`must start with a slash`)
    } else if (allBindings[fileName]) {
      const inUse = allBindings[fileName]
      if (inUse === 'desk: %blog') {
        setFileNameError(`you will overwrite ${fileName}`)
      } else {
        setFileNameError(`${fileName} is in use by ${inUse}`)
      }
    } else if (drafts.includes(fileName)) {
      setFileNameError(`you will overwrite ${fileName}`)
    } else {
      setFileNameError('')
    }
  }, [fileName, pages])

  return (
    <div className="absolute bottom-4 w-100 absolute bg-white flex space-x-6">
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2"><code>$path:</code></label>
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
      <div>
        <label>
          <code className="mr-2">%show-preview</code>
          <input
            type="checkbox"
            checked={showPreview}
            onChange={() => setShowPreview(!showPreview)}
          />
        </label>
      </div>
    </div>
  )
}