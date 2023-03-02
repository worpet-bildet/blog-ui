import { useState, useEffect, useCallback } from 'react' 
import { useParams } from 'react-router-dom'
import { api } from '../state/api'
import { useStore } from '../state/base'

export default function Theme() {
  const { theme } = useParams()
  const [name, setName] = useState(theme? theme: '')
  const [css, setCss] = useState('')
  const getAll = useStore(state => state.getAll)

  useEffect(() => {
    async function getCss() {
      const a = await api.scry({ app : 'blog', path: `/theme/${theme}`})
      setCss(a)
    }
    getCss()
  }, [theme])

  const hanldeSaveTheme = useCallback(
    async (e : React.SyntheticEvent) => {
      e.preventDefault()
      await api.poke({
        app: 'blog',
        mark: 'blog-action',
        json: {
          "save-theme": {
            "theme": name,
            "css": css
      }}})
      getAll()
  },  [name, css])

  return (
    <div className="h-full">
      <h1 className="text-3xl"><code>%theme-editor</code></h1>
      <p className="text-gray-700">put your css below to add a theme</p>
      <textarea
        className="h-full w-full"
        value={css}
        onChange={e => setCss(e.target.value)}
      />
      <div className="flex gap-x-4">
        <input
          className="flex-1 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="theme-name"
        />
        <button
          className="flex-1 bg-blue-500 hover:bg-blue-700 text-white p-2 rounded w-full disabled:opacity-50"
          onClick={hanldeSaveTheme}
          disabled={name === ''}
        >
          <code>%save-theme</code>
        </button>
      </div>
    </div>
  )
}