import { useState, useEffect } from 'react'
import { api } from '../state/api'
import { Link } from 'react-router-dom'
import { PencilSquareIcon } from "@heroicons/react/24/solid"

export default function SideBar() {
  const [drafts, setDrafts] = useState<string[]>([])
  const [published, setPublished] = useState<string[]>([])

  useEffect(() => {
    async function getData() {
      let published = await api.scry({app: 'blog', path: '/pages'})
      let drafts = await api.scry({app: 'blog', path: '/drafts'})
      setDrafts(drafts)
      setPublished(published)
    }
    getData()
  }, [])

  return (
    <div className="overflow-y-scroll">
      <h1 className="text-3xl"><code>%blog</code></h1>
      <ul className="bg-white px-4 pt-6">
        <label className="block text-gray-700 font-bold mb-5">Published <code>%blog</code>s</label>
        { published.map((pub: string, i) => (
          <li key={i} className="flex mb-1 text-blue-600 visited:text-purple-600 text-xs">
            <div className="text-left flex-1 my-auto truncate">
              <a href={`${pub}`} target="_blank" rel="noreferrer"><code>{pub}</code></a>
            </div>
            <div className="flex-1 flex justify-end">
              <Link to={`/published${pub}`}>
                <button className="bg-yellow-500 hover:bg-yellow-700 text-white p-2 rounded disabled:opacity-50">
                  <PencilSquareIcon className="w-4 h-4" style={{ color : 'white' }}/>
                </button>
              </Link>
            </div>
          </li>
        ))}
      </ul>
      <ul className="bg-white px-4 pt-6">
        <label className="block text-gray-700 font-bold mb-5"><code>%draft</code>s</label>
        { drafts.map((draft: string, i) => (
          <li key={i} className="flex mb-1 text-xs">
            <div className="text-left flex-1 my-auto truncate">
              <code>{draft}</code>
            </div>
            <div className="flex-1 flex justify-end">
              <Link to={`/draft${draft}`}>
                <button className="bg-yellow-500 hover:bg-yellow-700 text-white p-2 rounded disabled:opacity-50">
                  <PencilSquareIcon className="w-4 h-4" style={{ color : 'white' }}/>
                </button>
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}