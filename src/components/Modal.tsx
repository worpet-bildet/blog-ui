
//  Are you sure you want to unPublish <code>{toRemove}</code>? You will not be able to recover it
//  %remove
//  handleUnpublish
//  setToRemove

//  Are you sure you want to edit <code>{toEdit}</code>? You will lose all progress on your current draft
//  handleEdit
//  [%edit ${toEdit}]
//  setToEdit

type ModalProps = {
  text : string
  buttonText : string
  close: (value: React.SetStateAction<boolean>) => void
  action: (e: React.SyntheticEvent) => Promise<void>
}

export default function Modal(props: ModalProps) {
  const { text, buttonText, close, action } = props

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="relative p-6 flex-auto">
              <p className="my-4 text-slate-500 text-lg leading-relaxed">
                {text}
              </p>
            </div>
            <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
              <button
                className="bg-red-500 hover:bg-red-700 text-white p-2 rounded mr-3"
                onClick={action}
              >
                <code>{buttonText}</code>
              </button>
              <button
                className="bg-gray-500 hover:bg-gray-700 text-white p-2 rounded"
                onClick={() => close(false)}
              >
                <code>%close</code>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  )
}