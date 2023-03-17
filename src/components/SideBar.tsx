import { useState, useCallback } from 'react'
import { Link, useMatch } from 'react-router-dom'
import { TrashIcon, ArchiveBoxXMarkIcon } from '@heroicons/react/24/outline'
import { useStore } from '../state/base'
import { ConfirmDeleteDraft, ConfirmUnpublish } from './Modal'
import { api } from '../state/api'

interface SideBarProps {
  onToggle: any
}

export default function SideBar({ onToggle }: SideBarProps) {
  const drafts = useStore((state) => state.drafts)
  const pages = useStore((state) => state.pages)
  const themes = useStore((state) => state.themes)
  const { getAll } = useStore()
  const [fileName, setFileName] = useState('')
  const [showDeleteDraftModal, setShowDeleteDraftModal] = useState(false)
  const [showUnpublishModal, setShowUnpublishModal] = useState(false)
  const match = useMatch('*')

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
    setShowDeleteDraftModal(false)
    getAll()
  }, [])

  const handleUnpublish = useCallback(async (toUnpublish: string) => {
    await api.poke({
      app: 'blog',
      mark: 'blog-action',
      json: { unpublish: { path: toUnpublish } },
    })
    setShowUnpublishModal(false)
    getAll()
  }, [])

  const showModal = (linkbase: string) => {
    switch (linkbase) {
      case '/published':
        return setShowUnpublishModal(true)
      case '/draft':
        return setShowDeleteDraftModal(true)
      default:
        return
    }
  }

  type SidebarItemProps = {
    linkbase: string
    item: string
  }

  const SidebarItem = ({ linkbase, item }: SidebarItemProps) => {
    let linkto = `${linkbase}${item}`
    return (
      <li
        className={`flex flex-row justify-between items-center mb-1 text-blue-600 visited:text-purple-600 text-xs hover:bg-gray-100 p-2 ${
          match?.pathname === linkto ? 'bg-gray-100' : ''
        }`}
      >
        <Link to={linkto}>
          <div className='text-left flex-1 my-auto truncate'>
            <code>{item}</code>
          </div>
        </Link>
        {linkbase !== '/theme/' && (
          <div
            className='w-6 p-1 cursor-pointer rounded-sm text-red-500 hover:text-white hover:bg-red-500 '
            onClick={() => {
              showModal(linkbase)
              setFileName(item)
            }}
          >
            {linkbase === '/published' ? (
              <ArchiveBoxXMarkIcon />
            ) : (
              <TrashIcon />
            )}
          </div>
        )}
      </li>
    )
  }

  return (
    <div className='h-full overflow-y-scroll pr-4'>
      <div className='flex flex-row items-center justify-between w-full'>
        <Link to='/'>
          <h1 className='text-3xl'>
            <code>%blog</code>
          </h1>
        </Link>
        <button onClick={onToggle}>{'<<'}</button>
      </div>
      <ul className='bg-white pt-6'>
        <label className='block text-gray-700 font-bold mb-3'>
          Published <code>%blog</code>s
        </label>
        {pages.sort().map((pub: string, i) => (
          <SidebarItem linkbase={`/published`} item={pub} key={i}></SidebarItem>
        ))}
      </ul>
      <ul className='bg-white pt-6'>
        <label className='block text-gray-700 font-bold mb-3'>
          <code>%draft</code>s
        </label>
        {drafts.sort().map((draft: string, i) => (
          <SidebarItem linkbase={`/draft`} item={draft} key={i}></SidebarItem>
        ))}
      </ul>
      <ul className='bg-white pt-6'>
        <label className='block text-gray-700 font-bold mb-3'>
          <code>%theme</code>s
        </label>
        {themes.sort().map((theme: string, i) => (
          <SidebarItem linkbase={`/theme/`} item={theme} key={i}></SidebarItem>
        ))}
      </ul>
      <Link to='/theme'>
        <button className='bg-blue-500 hover:bg-blue-700 text-white p-2 rounded disabled:opacity-50'>
          <code>%new-theme</code>
        </button>
      </Link>
      {showDeleteDraftModal && (
        <ConfirmDeleteDraft
          fileName={fileName}
          setShowModal={setShowDeleteDraftModal}
          onConfirm={() => handleDeleteDraft(fileName)}
        />
      )}
      {showUnpublishModal && (
        <ConfirmUnpublish
          fileName={fileName}
          setShowModal={setShowUnpublishModal}
          onConfirm={() => handleUnpublish(fileName)}
        />
      )}
    </div>
  )
}
