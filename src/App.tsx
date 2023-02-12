import { useState, useEffect } from 'react'
import MDEditor from '@uiw/react-md-editor'
import MarkdownPreview from '@uiw/react-markdown-preview';
import { Urbit } from '@urbit/http-api'
import { renderToString } from 'react-dom/server'

const existingBindings = [
  '/~debug',
  '/~/scry',
  '/~/logout',
  '/~/login',
  '/~/channel',
  '/spider',
  '/apps',
  '/.well-known/acme-challenge',
  '/',
]

function App() {
  const [api, setApi] = useState<Urbit>()
  const [value, setValue] = useState('# %studio')
  const [fileName, setFileName] = useState('')
  const [bindings, setBindings] = useState([])

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
  }, [value])

  useEffect(() => {
    if (!api) return
    const getBindings = async () => {
      let res = await api.scry({app: 'blog', path: '/existing-bindings'})
      setBindings(res)
    }
    getBindings()
  }, [api])

  return (
    <div className='App'>
      <header className='App-header'>
        <h1>%studio</h1>
      </header>
      <MDEditor height={200} value={value} onChange={setValue as any} />
      <form onSubmit={async (e) => {
        e.preventDefault()
        if (!api) {
          console.error('api not connected')
          return
        }
        await api.poke({
          app: 'blog',
          mark: 'blog-action',
          json: {
            "save-file": {
              // NOTE need a leading and trailing slash - also append html for them.
              // Need to get rid of the need for /html at the end on the hoon side later
              "file": fileName,
              "text": renderToString(<MarkdownPreview source={value}/>)
        }}})
      }}>
        <label>
          file location
          <input value={fileName} onChange={e => setFileName(e.target.value)}/>
        </label>
        <button type="submit">save file</button>
      </form>
      <ul>
        { bindings.filter(
            (bind : string) => !existingBindings.includes(bind)
          ).map((bind: string, i) => (
            <span key={i}>
              <li>{bind}</li>
              <button onClick={async (e) => {
                e.preventDefault()
                if (!api) {
                  console.error('api not connected')
                  return
                }
                const a = await api.poke({
                  app: 'blog',
                  mark: 'blog-action',
                  json: {
                    "delete-file": {
                      "file": bind,
                }}})
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
                setValue(res)
              }}>edit</button>
            </span>
        ))}
      </ul>
    </div>
  );
}

export default App
