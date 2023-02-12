import { useState, useEffect } from 'react'
import MDEditor from '@uiw/react-md-editor'
import MarkdownPreview from '@uiw/react-markdown-preview';
import { Urbit } from '@urbit/http-api'
import { renderToString } from 'react-dom/server'

function App() {
  const [api, setApi] = useState<Urbit>()
  const [markdown, setMarkdown] = useState('# Start Writing Here\nLorum ipsum')
  const [fileName, setFileName] = useState('')
  const [bindings, setBindings] = useState<string[]>([])
  const [rescry, setRescry] = useState<any>()

  useEffect(() => {
    const getApi = async () => {
      const api = await Urbit.authenticate({
        ship : 'zod',
        url: 'http://localhost:80',
        code: 'lidlut-tabwed-pillex-ridrup',
        verbose: false
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
    <div className='App'>
      <MDEditor height={200} value={markdown} onChange={setMarkdown as any} />
      <form onSubmit={async (e) => {
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
              // NOTE need a leading and trailing slash - also append html for them.
              // Need to get rid of the need for /html at the end on the hoon side later
              "path": fileName,
              "html": renderToString(<MarkdownPreview source={markdown}/>),
              "md": markdown
        }}})
        setRescry(a)
      }}>
        <label>
          file location
          <input value={fileName} onChange={e => setFileName(e.target.value)}/>
        </label>
        <button type="submit">save file</button>
      </form>
      <ul>
        { bindings.map((bind: string, i) => (
            <span key={i}>
              <li>
                <a href={`${bind}`} target="_blank" rel="noreferrer">{bind}</a>
              </li>
              <button onClick={async (e) => {
                e.preventDefault()
                if (!api) {
                  console.error('api not connected')
                  return
                }
                const a = await api.poke({
                  app: 'blog',
                  mark: 'blog-action',
                  json: { "delete-file": { "path": bind } }
                })
                setRescry(a)
              }}>remove</button>
              <button onClick={async (e) => {
                e.preventDefault()
                if (!api) {
                  console.error('api not connected')
                  return
                }
                const res = await api.scry({
                  app: 'blog',
                  path: `/md${bind}`
                })
                setMarkdown(res)
              }}>edit</button>
            </span>
        ))}
      </ul>
    </div>
  );
}

export default App
