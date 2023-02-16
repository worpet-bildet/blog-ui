import MDEditor from '@uiw/react-md-editor'
import MarkdownPreview from '@uiw/react-markdown-preview'
import { Urbit } from '@urbit/http-api'
import { defaultString } from './lib'
import { renderToString } from 'react-dom/server'
import { useState, useEffect } from 'react'

function App() {
  // api
  const [api, setApi] = useState<Urbit>()
  // inputs
  const [fileName, setFileName] = useState('')
  const [markdown, setMarkdown] = useState(defaultString)
  // scries
  const [pages, setPages] = useState<string[]>([])
  const [bindings, setBindings] = useState<any>()
  // frontend state
  const [rescry, setRescry] = useState<any>()
  const [toRemove, setToRemove] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [fileNameError, setFileNameError] = useState('')

  useEffect(() => {
    if (bindings?.[fileName]) {
      setFileNameError(`${fileName} is in use by ${bindings[fileName]}`)
    } else {
      setFileNameError('')
    }
  }, [fileName, bindings])

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

  useEffect(() => {
    if (!api) return
    const getBindings = async () => {
      let res = await api.scry({app: 'blog', path: '/all-bindings'})
      setBindings(res)
    }
    const getPages = async () => {
      let res = await api.scry({app: 'blog', path: '/pages'})
      setPages(res)
    }
    getBindings()
    getPages()
  }, [api, rescry])

  return (
    <div className="grid grid-rows-1 lg:grid-cols-12 md:grid-cols-1 gap-4">
      <div className="col-span-9">
        <MDEditor height={730} value={markdown} onChange={setMarkdown as any} data-color-mode="light"/>
      </div>
      <div className="col-span-3">
        <form
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          onSubmit={async (e) => {
            e.preventDefault()
            if (!api) {
              console.error('api not connected')
              return
            }
            const a = await api.poke({
              app: 'blog',
              mark: 'blog-action',
              json: {
                "save-file": {
                  // NOTE need a leading slash
                  "path": fileName,
                  "html": renderToString(<MarkdownPreview source={markdown}/>),
                  "md": markdown
            }}})
            setRescry(a)
          }
        }>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Bind to <code>$path</code>:</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="/example/path"
              value={fileName}
              onChange={e => setFileName(e.target.value)}
              pattern="^\/(?!(~.*)|(apps.*)|\/).+"
              required
            />
            {
              fileNameError &&
              <p className="text-red-500 text-xs italic mt-1">{fileNameError}</p>
            }
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded w-full"
          >Save File</button>
        </form>
        { pages.length !== 0 &&
          <ul className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <label className="block text-gray-700 font-bold mb-5 text-center"><code>%blog</code> bindings</label>
            { pages.map((bind: string, i) => (
              <li key={i} className="flex mb-3 text-blue-600 visited:text-purple-600">
                <div className="text-left flex-1 my-auto truncate">
                  <a href={`${bind}`} target="_blank" rel="noreferrer"><code>{bind}</code></a>
                </div>
                <div className="flex-1 flex justify-end">
                  <button
                    className="bg-yellow-500 hover:bg-yellow-700 text-white p-2 rounded mr-3"
                    onClick={async (e) => {
                      e.preventDefault()
                      if (!api) {
                        console.error('api not connected')
                        return
                      }
                      const res = await api.scry({
                        app: 'blog',
                        path: `/md${bind}`
                      })
                      setFileName(bind)
                      setMarkdown(res)
                    }}
                  >
                    Edit
                  </button>
                  <button 
                    className="bg-red-500 hover:bg-red-700 text-white p-2 rounded"
                    onClick={() => { setToRemove(bind); setShowModal(true)}}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
            </ul>
          }
      </div>
      {
        showModal && (
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
                    onClick={async (e) => {
                      e.preventDefault()
                      if (!api) {
                        console.error('api not connected')
                        return
                      }
                      const a = await api.poke({
                        app: 'blog',
                        mark: 'blog-action',
                        json: { "delete-file": { "path": toRemove } }
                      })
                      setRescry(a)
                      setShowModal(false)
                    }}
                  >
                    Remove
                  </button>
                  <button
                    className="bg-gray-500 hover:bg-gray-700 text-white p-2 rounded"
                    onClick={() => setShowModal(false)}
                  >
                    Close
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
