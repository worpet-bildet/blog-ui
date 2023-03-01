import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../state/api'
import { marked } from 'marked'

export default function Theme() {
  const { theme } = useParams()
  const [css, setCss] = useState('')

  useEffect(() => {
    const getDraft = async () => {
      if (!theme) return
      const res = await api.scry({
        app: 'blog',
        path: `/theme/${theme}`
      })
      setCss(res)
    }
    getDraft()
  }, [theme])

  return (
    <div className="flex">
      <textarea value={css} onChange={(e) => setCss(e.target.value)}/>
      <iframe
        title="preview"
        srcDoc={`${marked.parse('# hello world!')}<style>${css}</style>`}
        className="col-span-1 w-full h-full"
      />
      <select>
        <option>asdf</option>
        <option>fdsa</option>
      </select>
    </div>
  )
}