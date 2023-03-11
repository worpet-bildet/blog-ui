import { useState, useCallback, useEffect } from 'react'
import { api } from '../state/api'
import { marked } from 'marked'
import { useStore } from '../state/base'
import Modal from './Modal'

type BottomBarProps = {
  showPreview: boolean
  setShowPreview: React.Dispatch<React.SetStateAction<boolean>>
}

export default function BottomBar({ showPreview, setShowPreview }: BottomBarProps) {
  const { markdown, pages, activeTheme, allBindings, drafts, themes, previewCss, getAll, setPreviewCss, setActiveTheme } = useStore()
  const [fileName, setFileName]           = useState('')
  const [fileNameError, setFileNameError] = useState('')
  const [showModal, setShowModal]         = useState(false)

  useEffect(() => {
    setFileName('/' + document.location.pathname.split('/').slice(4).join('/'))  // TODO ugly
  }, [document.location.pathname])

  useEffect(() => {
    if (themes.length > 0 && activeTheme === '') setActiveTheme(themes[0])
    async function getTheme() {
      const css = await api.scry({ app : 'blog', path: `/theme/${activeTheme}`})
      setPreviewCss(css)
    }
    getTheme()
  }, [activeTheme, themes])

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
            "md": markdown,
            "theme": activeTheme
      }}})
      getAll()
      setShowModal(true)
  }, [fileName, markdown, activeTheme])

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
    <>
      <div>
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
        <p className="text-red-500 text-xs italic">{fileNameError}</p>
      </div>
      <select
        className="rounded border-none focus:outline-none"
        value={activeTheme}
        onChange={(e) => setActiveTheme(e.target.value)}
      >
        {themes.map((theme, i) => 
          <option value={theme} key={i}>%{theme}</option>
        )}
      </select>
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
      <button
        className={`${showPreview? 'bg-blue-700 shadow-inner shadow' : 'bg-blue-500'} flex-1 text-white p-2 rounded w-full`}
        onClick={() => setShowPreview(!showPreview)}
      >
        <code className="mr-2">{showPreview? '%hide-preview' : '%show-preview'}</code>
      </button>
      { showModal && <Modal justPublished={fileName} setShowModal={setShowModal}/>}
    </>
  )
}