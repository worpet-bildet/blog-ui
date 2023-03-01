import { useState, useEffect } from 'react'
import { useMatch } from 'react-router-dom'
import { api } from '../state/api'
import Editor from '../components/Editor'

export default function Published() {
  const [post, setPost] = useState('')
  const match = useMatch('*')

  useEffect(() => {
    const getDraft = async () => {
      if (!match) return
      const res = await api.scry({
        app: 'blog',
        path: '/md/' + match?.pathname.split('/').slice(2).join('/') // TODO ugly code
      })
      setPost(res)
    }
    getDraft()
  }, [])

  return (
    <Editor markdown={post} setMarkdown={setPost}/>
  )
}