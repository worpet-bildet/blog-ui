import { Modal, ModalProps } from './Modal'

interface ConfirmUriModalProps extends ModalProps {
  onConfirm: Function
}

export default function ConfirmUri({
  setShowModal,
  onConfirm,
}: ConfirmUriModalProps) {
  return (
    <Modal>
      <h4 className='text-md font-bold'>Hold up!</h4>
      <p>Please confirm that you're publishing from {window.location.origin}</p>
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
            onConfirm()
            setShowModal(false)
          }}
          type='submit'
        >
          Confirm
        </button>
      </div>
    </Modal>
  )
}
