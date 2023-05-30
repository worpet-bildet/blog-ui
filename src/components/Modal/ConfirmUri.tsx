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
  const [newUri, setNewUri] = useState(uri)
  return (
    <Modal>
      <div className='flex flex-col gap-2'>
        <h4 className='text-md font-bold'>Published!</h4>
        <p>
          Your blog has been published to {uri} - if that's not right, you can
          change it here.
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
