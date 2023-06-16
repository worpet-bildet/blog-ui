import { useState } from 'react'
import { Modal, ModalProps } from './Modal'

interface ConfirmUriModalProps extends ModalProps {
  uri: string
  onConfirm: Function
}

export default function ConfirmUri({
  uri,
  setShowModal,
  onConfirm,
}: ConfirmUriModalProps) {
  const [newUri, setNewUri] = useState(uri || window.location.origin)
  return (
    <Modal>
      <div className='flex flex-col gap-2'>
        {(uri && (
          <p>
            Your blog is published to {uri} - if that's not right, you can
            change it here.
          </p>
        )) || (
          <p>
            You have not yet specified the URL of your blog, please confirm the
            below location.
          </p>
        )}
        <p>
          Subscribers to your blog require this in order to create the correct
          links.
        </p>
        <input
          type='text'
          onChange={(e) => setNewUri(e.target.value)}
          value={newUri}
        />
        <div className='flex text-xs gap-x-2'>
          <button
            className='flex-1 bg-red-500 hover:bg-red-700 text-white p-2 rounded w-full'
            onClick={(e) => {
              e.preventDefault()
              setShowModal(false)
            }}
          >
            Close
          </button>
          <button
            className='flex-1 bg-blue-500 hover:bg-blue-700 text-white p-2 rounded w-full'
            onClick={(e) => {
              e.preventDefault()
              onConfirm(newUri)
              setShowModal(false)
            }}
            type='submit'
          >
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  )
}
