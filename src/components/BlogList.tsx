import { useEffect, useState } from 'react'
import { api } from '../state/api'
import { TrashIcon, PencilSquareIcon } from "@heroicons/react/24/solid";

export default function Published() {
  const [published, setPublished] = useState<string[]>([])
  useEffect(() => {
    async function getPublished() {
      let res = await api.scry({app: 'blog', path: '/pages'})
      setPublished(res)
    }

    getPublished()
  }, [])

  if (published.length === 0) return <></>

  return (
    <ul className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <label className="block text-gray-700 font-bold mb-5 text-center">Published <code>%blog</code>s</label>
      { published.map((bind: string, i) => (
        <li key={i} className="flex mb-3 text-blue-600 visited:text-purple-600 text-xs">
          <div className="text-left flex-1 my-auto truncate">
            <a href={`${bind}`} target="_blank" rel="noreferrer"><code>{bind}</code></a>
          </div>
          <div className="flex-1 flex justify-end">
            <button
              className="bg-yellow-500 hover:bg-yellow-700 text-white p-2 rounded mr-3 disabled:opacity-50"
              // onClick={() => edit('/md', bind)}
            >
              <PencilSquareIcon className="w-4 h-4" style={{ color : 'white' }}/>
            </button>
            <button 
              className="bg-red-500 hover:bg-red-700 text-white p-2 rounded disabled:opacity-50"
              // onClick={() => remove(bind)}
            >
              <TrashIcon className="w-4 h-4" style={{ color : 'white' }}/>
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}