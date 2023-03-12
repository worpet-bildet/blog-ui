import { useState } from 'react'
import { Modal, ModalProps } from './Modal'

interface PublishModalProps extends ModalProps {
  fileName: string
}

export default function Share({ setShowModal, fileName }: PublishModalProps) {
  const [value, setValue] = useState(
    `AAAAH I'M GONNA %blog : ${window.location.origin}${fileName}`
  )
  return (
    <Modal>
      <h4 className='text-md font-bold'>
        Success! Do you want to share your <code>%blog</code> via{' '}
        <code>%rumors</code>?
      </h4>
      <p className='text-xs mb-4 text-gray-500'>
        (download <code>%pals</code> and <code>%rumors</code> from{' '}
        <code>~paldev</code>)
      </p>
      <form
        method='post'
        action={`${window.location.origin}/rumors`}
        className='mb-4 w-full'
      >
        <input
          type='text'
          name='rumor'
          required
          className='w-full mb-4'
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <div className='flex text-xs gap-x-2'>
          <button
            className='flex-1 bg-red-500 hover:bg-red-700 text-white p-2 rounded w-full'
            onClick={(e) => {
              e.preventDefault()
              setShowModal(false)
            }}
          >
            <code>%close</code>
          </button>
          <button
            className='flex-1 bg-blue-500 hover:bg-blue-700 text-white p-2 rounded w-full'
            type='submit'
          >
            <code>%send</code>
          </button>
        </div>
      </form>
    </Modal>
  )
}
