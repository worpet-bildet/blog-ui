import { useState, useCallback, useEffect } from 'react'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  InboxArrowDownIcon,
} from '@heroicons/react/24/outline'
import { api } from '../state/api'
import { useStore } from '../state/base'

type TopBarProps = {
  showPreview: boolean
  setShowPreview: React.Dispatch<React.SetStateAction<boolean>>
  fileName: string
  setFileName: React.Dispatch<React.SetStateAction<string>>
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>
}

export default function TopBar({
  showPreview,
  setShowPreview,
  fileName,
  setFileName,
  setDisabled,
}: TopBarProps) {
  const { markdown, pages, allBindings, drafts, getAll } = useStore()
  const [fileNameError, setFileNameError] = useState('')

  useEffect(() => {
    setFileName('/' + document.location.pathname.split('/').slice(4).join('/')) // TODO ugly
  }, [document.location.pathname])

  const handleSaveDraft = useCallback(
    async (e: React.SyntheticEvent) => {
      e.preventDefault()
      await api.poke({
        app: 'blog',
        mark: 'blog-action',
        json: {
          'save-draft': {
            path: fileName,
            md: markdown,
          },
        },
      })
      getAll()
    },
    [fileName, markdown]
  )

  useEffect(() => {
    if (fileName.charAt(fileName.length - 1) === '/') {
      setDisabled(true)
      setFileNameError(`cannot end in a slash`)
    } else if (fileName.charAt(0) !== '/') {
      setDisabled(true)
      setFileNameError(`must start with a slash`)
    } else if (allBindings[fileName]) {
      const inUse = allBindings[fileName]
      if (inUse === 'app: %blog') {
        setDisabled(false)
        setFileNameError(`replace ${fileName}`)
      } else {
        setDisabled(true)
        setFileNameError(`${fileName} is in use by ${inUse}`)
      }
    } else if (drafts.includes(fileName)) {
      setDisabled(false)
      setFileNameError(`replace ${fileName}`)
    } else {
      setDisabled(false)
      setFileNameError('')
    }
  }, [fileName, pages])

  return (
    <>
      <div className='col-span-2'>
        <code>
          <p className='text-red-500 text-xs italic line-clamp-1'>
            {fileNameError}
          </p>
          <input
            className='w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            placeholder='/example/path'
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            pattern='^\/.+(?!\/)'
            required
          />
        </code>
      </div>
      <button
        className='flex-1 flex items-center justify-center text-black p-2 rounded w-full disabled:opacity-50 hover:text-gray-500'
        disabled={!fileName}
        onClick={handleSaveDraft}
      >
        <div className='w-5 mr-2'>
          <InboxArrowDownIcon></InboxArrowDownIcon>
        </div>
        <code>save %draft</code>
      </button>
      <button
        className='flex-1 flex items-center justify-center rounded w-full text-blue-500 hover:text-blue-700'
        onClick={() => setShowPreview(!showPreview)}
      >
        <div className='text-left flex items-center'>
          <div className='w-5 mr-2'>
            {showPreview ? (
              <ChevronRightIcon></ChevronRightIcon>
            ) : (
              <ChevronLeftIcon></ChevronLeftIcon>
            )}
          </div>
          <div>
            <code>{showPreview ? 'hide' : 'preview'}</code>
          </div>
        </div>
      </button>
    </>
  )
}
