import { useState, useEffect } from 'react'
import MDEditor from '@uiw/react-md-editor'
import MarkdownPreview from '@uiw/react-markdown-preview';
import { Urbit } from '@urbit/http-api'
import { renderToString } from 'react-dom/server'

function App() {
  const [api, setApi] = useState<Urbit>()
  const [value, setValue] = useState('# %studio')
  const [bindings, setBindings] = useState([])

  useEffect(() => {
    const getApi = async () => {
      console.log('awaiting')
      const api = await Urbit.authenticate({
        ship : 'zod',
        url: 'http://localhost:80',
        code: 'lidlut-tabwed-pillex-ridrup',
        verbose: false
      })
      console.log('finished ', api)
      setApi(api)
    }
    getApi()
  }, [value])

  // useEffect(() => {
  //   if (!api) return
  //   const getBindings = async () => {
  //     let res = await api.scry({app: 'blog', path: '/existing-bindings'})
  //     setBindings(res)
  //   }
  //   getBindings()
  // }, [api])

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
        console.log('blog')
        const a = await api.poke({
          app: 'blog',
          mark: 'blog-action',
          json: {
            "save-file": {
              "file": "/test",
              "text": renderToString(<MarkdownPreview source={value}/>)
        }}})
        console.log(a)
      }}>
        <button type="submit">save</button>
      </form>
      <ul>
        {bindings.map((bind: string, i) => 
          <li key={i}>{bind}</li>
        )}
      </ul>
    </div>
  );
}

export default App
