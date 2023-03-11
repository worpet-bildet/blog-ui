import { useState, useCallback, useEffect } from 'react'
import { marked } from 'marked'
import {
  TrashIcon,
  PencilSquareIcon,
  RssIcon,
} from '@heroicons/react/24/outline'
import { api } from '../state/api'
import { useStore } from '../state/base'
import Modal from './Modal'

type BottomBarProps = {
  disabled: boolean
  fileName: string
}

export default function BottomBar({ fileName, disabled }: BottomBarProps) {
  const {
    markdown,
    pages,
    activeTheme,
    allBindings,
    drafts,
    themes,
    getAll,
    setPreviewCss,
    setActiveTheme,
  } = useStore()

  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (themes.length > 0 && activeTheme === '') setActiveTheme(themes[0])
    async function getTheme() {
      const css = await api.scry({ app: 'blog', path: `/theme/${activeTheme}` })
      setPreviewCss(css)
    }
    getTheme()
  }, [activeTheme, themes])

  const handlePublish = useCallback(
    async (e: React.SyntheticEvent) => {
      e.preventDefault()
      await api.poke({
        app: 'blog',
        mark: 'blog-action',
        json: {
          publish: {
            path: fileName,
            html: marked.parse(markdown),
            md: markdown,
            theme: activeTheme,
          },
        },
      })
      getAll()
      setShowModal(true)
    },
    [fileName, markdown, activeTheme]
  )

  const handleDeleteDraft = useCallback(async (toDelete: string) => {
    await api.poke({
      app: 'blog',
      mark: 'blog-action',
      json: {
        'delete-draft': {
          path: toDelete,
        },
      },
    })
    getAll()
  }, [])

  const handleUnpublish = useCallback(async (toUnpublish: string) => {
    await api.poke({
      app: 'blog',
      mark: 'blog-action',
      json: { unpublish: { path: toUnpublish } },
    })
    getAll()
  }, [])

  return (
    <>
      <div className='w-1/4'>
        %theme:
        <select
          className='rounded border-none focus:outline-none'
          value={activeTheme}
          onChange={(e) => setActiveTheme(e.target.value)}
        >
          {themes.map((theme, i) => (
            <option value={theme} key={i}>
              %{theme}
            </option>
          ))}
        </select>
      </div>
      <button
        className='flex-1 flex items-center justify-center text-red-500 hover:text-white hover:bg-red-500 border rounded disabled:opacity-50'
        disabled={!fileName}
        onClick={() => handleDeleteDraft(fileName)}
      >
        <div className='w-5 mr-2'>
          <TrashIcon />
        </div>
        <code>delete %blog</code>
      </button>
      <button
        className='flex-1 flex items-center justify-center text-white bg-orange-500 hover:bg-orange-700 rounded disabled:opacity-50'
        disabled={!fileName || disabled}
        onClick={() => handleUnpublish(fileName)}
      >
        <div className='w-5 mr-2'>
          <PencilSquareIcon />
        </div>
        <code>unpublish %blog</code>
      </button>
      <button
        className='flex-1 flex items-center justify-center text-white bg-green-500 hover:bg-green-700 rounded disabled:opacity-50'
        disabled={!fileName || disabled}
        onClick={handlePublish}
      >
        <div className='w-5 mr-2'>
          <RssIcon />
        </div>
        <code>publish %blog</code>
      </button>
      {showModal && (
        <Modal justPublished={fileName} setShowModal={setShowModal} />
      )}
    </>
  )
}
