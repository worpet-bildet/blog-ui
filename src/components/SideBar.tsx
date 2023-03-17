import { useState, useCallback, useEffect } from 'react'
import { Link, useMatch, useNavigate } from 'react-router-dom'
import {
  TrashIcon,
  ArchiveBoxXMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline'
import { useStore } from '../state/base'
import { ConfirmDeleteDraft, ConfirmUnpublish } from './Modal'
import { api } from '../state/api'

interface SideBarProps {
  onToggle: any
}

type SidebarEntry = {
  path: string
  children: string[]
}

export default function SideBar({ onToggle }: SideBarProps) {
  const drafts = useStore((state) => state.drafts)
  const pages = useStore((state) => state.pages)
  const themes = useStore((state) => state.themes)
  const { getAll } = useStore()
  const navigate = useNavigate()
  const [fileName, setFileName] = useState('')
  const [showDeleteDraftModal, setShowDeleteDraftModal] = useState(false)
  const [showUnpublishModal, setShowUnpublishModal] = useState(false)

  const [nestedDrafts, setNestedDrafts] = useState<SidebarEntry[]>([])
  const [nestedPages, setNestedPages] = useState<SidebarEntry[]>([])

  useEffect(() => {
    setNestedDrafts(nestPaths(drafts, '/drafts'))
    setNestedPages(nestPaths(pages, '/published'))
  }, [pages, drafts])

  const nestPaths = (paths: string[], linkbase: string) => {
    return paths
      .map((d) => ({
        path: parentPath(d),
        children: paths.filter((_d) => parentPath(_d) === parentPath(d)),
        linkbase,
      }))
      .filter((d) => !!d)
      .reduce((acc: SidebarEntry[], cur) => {
        if (acc.length === 0) return [...acc, cur]
        if (!acc.find((d) => d.path === cur.path)) return [...acc, cur]
        return acc
      }, [])
      .map((path) =>
        path && path.children && path.children.length === 1
          ? { ...path, path: path.children[0] }
          : path
      )
  }

  const parentPath = (path: string) => {
    return path.split('/').slice(0, 2).join('/')
  }

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
    item: SidebarEntry
  }

  const SidebarItem = ({ linkbase, item }: SidebarItemProps) => {
    let linkto = `${linkbase}${item.path}`
    const [open, setOpen] = useState(false)
    const hasChildren = item.children.length > 1
    return (
      <>
        <li
          className={`flex cursor-pointer pointer-events-auto justify-between mb-1 text-blue-600 visited:text-purple-600 text-xs hover:bg-gray-100 p-2 ${
            match?.pathname === linkto ? 'bg-gray-100' : ''
          } ${
            hasChildren ? 'flex-col justify-center' : 'flex-row  items-center'
          }`}
          onClick={() => {
            if (hasChildren) return
            navigate(linkto)
          }}
        >
          {!hasChildren && (
            <>
              <div className='text-left flex-1 my-auto truncate'>
                <code>{item.path}</code>
              </div>
              {linkbase !== '/theme/' && (
                <div
                  className='w-6 p-1 cursor-pointer rounded-sm text-red-500 hover:text-white hover:bg-red-500 '
                  onClick={() => {
                    showModal(linkbase)
                    setFileName(item.path)
                  }}
                >
                  {linkbase === '/published' ? (
                    <ArchiveBoxXMarkIcon />
                  ) : (
                    <TrashIcon />
                  )}
                </div>
              )}
            </>
          )}
          {hasChildren && (
            <div
              className='flex flex-row w-full justify-between pointer-events-auto'
              onClick={() => {
                setOpen(!open)
              }}
            >
              <div className='text-left flex-1 my-auto truncate'>
                <code>{item.path}</code>
              </div>
              <div className='w-6'>
                {open ? <ChevronUpIcon /> : <ChevronDownIcon />}
              </div>
            </div>
          )}
        </li>
        {open &&
          item.children.map((p) => (
            <SidebarItem
              item={{ path: p, children: [] }}
              linkbase={linkbase}
              key={p}
            />
          ))}
      </>
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
        {nestedPages.sort().map((pub: SidebarEntry, i) => (
          <SidebarItem linkbase={`/published`} item={pub} key={i}></SidebarItem>
        ))}
      </ul>
      <ul className='bg-white pt-6'>
        <label className='block text-gray-700 font-bold mb-3'>
          <code>%draft</code>s
        </label>
        {nestedDrafts.sort().map((draft: SidebarEntry, i) => (
          <SidebarItem linkbase={`/draft`} item={draft} key={i}></SidebarItem>
        ))}
      </ul>
      <ul className='bg-white pt-6'>
        <label className='block text-gray-700 font-bold mb-3'>
          <code>%theme</code>s
        </label>
        {themes.sort().map((theme: string, i) => (
          <SidebarItem
            linkbase={`/theme/`}
            item={{ path: theme, children: [] }}
            key={i}
          ></SidebarItem>
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
