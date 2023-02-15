import { useState, useEffect } from 'react'
import MDEditor from '@uiw/react-md-editor'
import MarkdownPreview from '@uiw/react-markdown-preview'
import { Urbit } from '@urbit/http-api'
import { renderToString } from 'react-dom/server'

const defaultString =
`
# Welcome to \`%blog\`
![sigils](https://media.urbit.org/site/understanding-urbit/urbit-id/urbit-id-sigils%402x.png)

Use markdown to write a file. If you don't know how to write markdown, take a quick read through [this](https://www.markdownguide.org/), it's easy.
To bind a post to a URL, just type in the path on the right and click \`Save File\`. For example, if your ships's domain is \`https://sampel-palnet.urbit.org\`, and you type in \`/blog/1\`, you will be able to see your blog at \`https://sampel-palnet.urbit.org/blog/1\`. Try it now and you will see this post in browser.

## Notes on \`<style>\`
- Use \`<style>\` tags to customize the layout.
- if you do not know CSS, either:
  - learn how [here](https://www.w3schools.com/css/), or 
  - ask ChatGPT to "write me a style sheet for markdown" and it'll know what to do
- There is some very weird behavior because the editor and the document share a style sheet. To avoid messing up the editor, add the \`.wmde-markdown\` class in front of all styles to keep them from propogating to the editor, as I have done below. This is a bug that I'll fix at some point


## Features Coming Soon
- improved error handling
- sharable themes
- comments
- "follow" a ship for new blog posts
- \`%eyre\` binding dashboard

For any feature requests, make an issue or a PR into [here](https://github.com/tadad/blog-ui/issues) for the UI repo, or [here](https://github.com/tadad/blog/issues) for the hoon code.

Happy blogging!

\`~dachus-tiprel\`

<style>
.wmde-markdown h1, h2, h3, h4, h5, h6 {
    color : black;
    text-align: center;
}
.wmde-markdown img {
    margin: auto;
    max-height: 300px;
    display: block;
}
.wmde-markdown {
    margin : 5rem;
    font-size : 1.5vw;
    color: #393939
}
</style>
`

function App() {
  const [api, setApi] = useState<Urbit>()
  const [markdown, setMarkdown] = useState(defaultString)
  const [fileName, setFileName] = useState('')
  const [bindings, setBindings] = useState<string[]>([])
  const [rescry, setRescry] = useState<any>()
  const [showModal, setShowModal] = useState(false)
  const [toRemove, setToRemove] = useState('')

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
      let res = await api.scry({app: 'blog', path: '/pages'})
      setBindings(res)
    }
    getBindings()
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
            <label className="block text-gray font-bold mb-2">Files</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="/example/path"
              value={fileName}
              onChange={e => setFileName(e.target.value)}
              pattern="^\/(?!(~.*)|(apps.*)|\/).+"
              required
            />
            <p className="text-gray-500 text-xs italic">
              The rendered markdown file will be bound to this url path on your ship. /, /~, and /apps are not allowed.
            </p>
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded w-full"
          >Save File</button>
        </form>
        { bindings.length !== 0 &&
          <ul className="list-none">
            <label className="block text-gray-700 text-sm font-bold mb-2">Files</label>
            { bindings.map((bind: string, i) => (
              <li key={i} className={`d-flex justify-content-between ${fileName === bind ? 'bg-light' : ''}`}>
                <a href={`${bind}`} target="_blank" rel="noreferrer">{bind}</a>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded"
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
                  className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded"
                  onClick={() => { setToRemove(bind); setShowModal(true)}}
                >
                  Remove
                </button>
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
                    Are you sure you want to delete {toRemove}? You will not be able to recover it
                  </p>
                </div>
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded"
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
