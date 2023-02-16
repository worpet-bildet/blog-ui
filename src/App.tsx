import MDEditor from '@uiw/react-md-editor'
import MarkdownPreview from '@uiw/react-markdown-preview'
import { Urbit } from '@urbit/http-api'
import { defaultString } from './lib'
import { renderToString } from 'react-dom/server'
import React, { useState, useEffect, useCallback } from 'react'
import Drafts from './components/Drafts'
import Published from './components/Published'

function App() {
  // api
  const [api, setApi] = useState<Urbit>()
  // inputs
  const [fileName, setFileName] = useState('')
  const [markdown, setMarkdown] = useState(defaultString)
  // scries
  const [published, setPublished]       = useState<string[]>([])
  const [drafts, setDrafts]     = useState<string[]>([])
  const [bindings, setBindings] = useState<any>()
  // frontend state
  const [toEdit, setToEdit]               = useState('')
  const [toRemove, setToRemove]           = useState('')
  const [toPublish, setToPublish]         = useState('')
  const [rescry, setRescry]               = useState<any>()
  const [disableSave, setDisableSave]     = useState(true)
  const [fileNameError, setFileNameError] = useState('')
  
  // api
  useEffect(() => {
    const getApi = async () => {
      // const api = new Urbit('')
      // api.ship = (window as any).ship as string
      // (window as any).api = api
      const api = await Urbit.authenticate({
        ship : 'zod',
        url: 'http://localhost:80',
        code: 'lidlut-tabwed-pillex-ridrup',
        verbose: true
      })
      setApi(api)
    }
    getApi()
  }, [])

  // scries
  useEffect(() => {
    if (!api) return
    const getBindings = async () => {
      let res = await api.scry({app: 'blog', path: '/all-bindings'})
      setBindings(res)
    }
    const getDrafts = async () => {
      let res = await api.scry({app: 'blog', path: '/drafts'})
      console.log(res)
      setDrafts(res)
    }
    const getPublished = async () => {
      let res = await api.scry({app: 'blog', path: '/pages'})
      setPublished(res)
    }
    getBindings()
    getDrafts()
    getPublished()
  }, [api, rescry])

  // frontend state
  useEffect(() => {
    if (fileName.charAt(fileName.length - 1) === '/') {
      setFileNameError(`cannot end in a slash`)
      setDisableSave(true)
    } else if (fileName.charAt(0) !== '/'){
      setFileNameError(`must start with a slash`)
      setDisableSave(true)
    } else if (bindings?.[fileName]) {
      const inUse = bindings[fileName]
      if (inUse === 'desk: %blog') {
        setFileNameError(`you will overwrite ${fileName}`)
        setDisableSave(false)
      } else {
        setFileNameError(`${fileName} is in use by ${inUse}`)
        setDisableSave(true)
      }
    } else {
      setFileNameError('')
      setDisableSave(false)
    }
  }, [fileName, bindings])

  const handleSaveDraft = useCallback(
    () => async (e : React.SyntheticEvent) => {
      e.preventDefault()
      if (!api) {
        console.error('api not connected')
        return
      }
      const a = await api.poke({
        app: 'blog',
        mark: 'blog-action',
        json: {
          "save-draft": {
            "path": fileName,
            "md": markdown
      }}})
      setRescry(a)
      setDisableSave(true)
  }, [api, fileName, markdown])

  const handleUnpublish = useCallback(
    async (e: React.SyntheticEvent) => {
      e.preventDefault()
      if (!api) {
        console.error('api not connected')
        return
      }
      const a = await api.poke({
        app: 'blog',
        mark: 'blog-action',
        json: { 'unpublish': { 'path': toRemove } }
      })
      setRescry(a)
      setToRemove('')
  }, [api, toRemove])

  const handleEdit = useCallback(
    async (e: React.SyntheticEvent) => {
      e.preventDefault()
      if (!api) {
        console.error('api not connected')
        return
      }
      const res = await api.scry({
        app: 'blog',
        path: `/draft${toEdit}` // TODO need to be set to either /draft or /md depending
      })
      setFileName(toEdit)
      setMarkdown(res)
      setToEdit('')
    }, [api, toEdit])

  return (
    <div className="grid grid-rows-1 lg:grid-cols-12 md:grid-cols-1 gap-4">
      <div className="col-span-9 shadow-md">
        <MDEditor
          height={730}
          value={markdown}
          onChange={(e) => {setDisableSave(false); setMarkdown(e!)}}
          data-color-mode="light"
        />
      </div>
      <div className="col-span-3">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Bind to <code>$path</code>:</label>
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
              disabled={disableSave || !fileName}
              onClick={handleSaveDraft}
            >
              <code>%save-draft</code>
            </button>
            <button
              className="flex-1 bg-blue-500 hover:bg-blue-700 text-white p-2 rounded w-full disabled:opacity-50"
              disabled={disableSave || !fileName}
              onClick={async (e) => {
                e.preventDefault()
                if (!api) {
                  console.error('api not connected')
                  return
                }
                const a = await api.poke({
                  app: 'blog',
                  mark: 'blog-action',
                  json: {
                    "publish": {
                      "path": fileName,
                      "html": renderToString(<MarkdownPreview source={markdown}/>),
                      "md": markdown
                }}})
                setRescry(a)
                setDisableSave(true)
              }}
            >
              <code>%publish</code>
            </button>
          </div>

        </div>
        <Published published={published} fileName={fileName} setToEdit={setToEdit} setToRemove={setToRemove}/>
        <Drafts drafts={drafts} fileName={fileName} setToEdit={setToEdit} setToPublish={setToPublish}/>
      </div>
      {
        toRemove && (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="relative p-6 flex-auto">
                  <p className="my-4 text-slate-500 text-lg leading-relaxed">
                    Are you sure you want to delete <code>{toRemove}</code>? You will not be able to recover it
                  </p>
                </div>
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white p-2 rounded mr-3"
                    onClick={handleUnpublish}
                  >
                    <code>%remove</code>
                  </button>
                  <button
                    className="bg-gray-500 hover:bg-gray-700 text-white p-2 rounded"
                    onClick={() => setToRemove('')}
                  >
                    <code>%close</code>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
        )
      }
      {
        toEdit && !disableSave && (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="relative p-6 flex-auto">
                  <p className="my-4 text-slate-500 text-lg leading-relaxed">
                    Are you sure you want to edit <code>{toEdit}</code>? You will lose all progress on your current draft
                  </p>
                </div>
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white p-2 rounded mr-3"
                    onClick={handleEdit}
                  >
                    <code>{`[%edit ${toEdit}]`}</code>
                  </button>
                  <button
                    className="bg-gray-500 hover:bg-gray-700 text-white p-2 rounded"
                    onClick={() => setToEdit('')}
                  >
                    <code>%close</code>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
        )
      }
    </div>
  );
}

export default App
