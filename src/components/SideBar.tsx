import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid"
import { useStore } from '../state/base'
import { api } from '../state/api'

export default function SideBar() {
  const drafts = useStore(state => state.drafts)
  const pages  = useStore(state => state.pages)
  const themes = useStore(state => state.themes)
  const getAll = useStore(state => state.getAll)

  const handleDeleteDraft = useCallback(
    async (toDelete: string) => {
      await api.poke({
        app: 'blog',
        mark: 'blog-action',
        json: {
          "delete-draft": {
            "path": toDelete,
      }}})
      getAll()
  }, [])

  const handleDeleteTheme = useCallback(
    async (toDelete: string) => {
      await api.poke({
        app: 'blog',
        mark: 'blog-action',
        json: {
          "delete-theme": {
            "theme": toDelete,
      }}})
      getAll()
  }, [])

  const handleUnpublish = useCallback(
    async (toUnpublish: string) => {
      await api.poke({
        app: 'blog',
        mark: 'blog-action',
        json: { 'unpublish': { 'path': toUnpublish } }
      })
      getAll()
  }, [])

  return (
    <>
      <Link to="/">
        <h1 className="text-3xl"><code>%blog</code></h1>
      </Link>
      <div className="h-full overflow-y-scroll">
        <ul className="bg-white px-4 pt-6">
          <label className="block text-gray-700 font-bold mb-3">Published <code>%blog</code>s</label>
          { pages.sort().map((pub: string, i) => (
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
                <button
                  className="bg-red-500 hover:bg-red-700 text-white p-2 rounded disabled:opacity-50 ml-1"
                  onClick={() => handleUnpublish  (pub)}
                >
                  <TrashIcon className="w-4 h-4" style={{ color : 'white' }}/>
                </button>
              </div>
            </li>
          ))}
        </ul>
        <ul className="bg-white px-4 pt-6">
          <label className="block text-gray-700 font-bold mb-3"><code>%draft</code>s</label>
          { drafts.sort().map((draft: string, i) => (
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
                <button
                  className="bg-red-500 hover:bg-red-700 text-white p-2 rounded disabled:opacity-50 ml-1"
                  onClick={() => handleDeleteDraft(draft)}
                >
                  <TrashIcon className="w-4 h-4" style={{ color : 'white' }}/>
                </button>
              </div>
            </li>
          ))}
        </ul>
        <ul className="bg-white px-4 pt-6">
          <label className="block text-gray-700 font-bold mb-3"><code>%theme</code>s</label>
          { themes.sort().map((theme: string, i) => (
            <li key={i} className="flex mb-1 text-xs">
              <div className="text-left flex-1 my-auto truncate">
                <code>%{theme}</code>
              </div>
              <div className="flex-1 flex justify-end">
                <Link to={`/theme/${theme}`}>
                  <button
                    className="bg-yellow-500 hover:bg-yellow-700 text-white p-2 rounded disabled:opacity-50"
                  >
                    <PencilSquareIcon className="w-4 h-4" style={{ color : 'white' }}/>
                  </button>
                </Link>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white p-2 rounded disabled:opacity-50 ml-1"
                  onClick={() => handleDeleteTheme(theme)}
                >
                  <TrashIcon className="w-4 h-4" style={{ color : 'white' }}/>
                </button>
              </div>
            </li>
          ))}
        </ul>
        <Link to="/theme">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded disabled:opacity-50"
          >
            <code>%new-theme</code>
          </button>
        </Link>
      </div>
    </>
  )
}