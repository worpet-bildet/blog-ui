import { useState, useEffect } from 'react'
import { useMatch } from 'react-router-dom'
import { api } from '../state/api'
import Editor from '../components/Editor'

export default function Draft() {
  const [draft, setDraft] = useState('')
  const match = useMatch('*')
  console.log(match)
  useEffect(() => {
    const getDraft = async () => {
      if (!match) return
      const res = await api.scry({
        app: 'blog',
        path: match.pathname
      })
      setDraft(res)
    }
    getDraft()
  }, [])

  return (
    <Editor markdown={draft} setMarkdown={setDraft}/>
  )
}