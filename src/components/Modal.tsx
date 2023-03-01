import { useState } from 'react'

type ModalProps = {
  justPublished: string
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
};

export default function Modal({ justPublished, setShowModal }: ModalProps) {
  const [value, setValue] = useState(`AAAAH I'M GONNA %blog : ${window.location.origin}${justPublished}`)

  return (
    <>
      <div className="fixed inset-0 z-10 overflow-y-auto backdrop-blur-md">
        <div className="flex items-center min-h-screen px-4 py-8">
          <div className="relative w-full max-w-lg p-4 mx-auto bg-white rounded-md shadow-lg text-center">
            <h4 className="text-md font-bold">
              Success! Do you want to share your <code>%blog</code> via <code>%rumors</code>?
            </h4>
            <p className="text-xs mb-4 text-gray-500">(download <code>%pals</code> and <code>%rumors</code> from <code>~paldev</code>)</p>
            <form
              method="post"
              action={`${window.location.origin}/rumors`}
              className="mb-4 w-full"
            >
              <input
                type="text"
                name="rumor"
                required
                className="w-full mb-4"
                value={value}
                onChange={e => setValue(e.target.value)}
              />
              <div className="flex text-xs gap-x-2">
                <button
                  className="flex-1 bg-blue-500 hover:bg-blue-700 text-white p-2 rounded w-full"
                  type="submit"
                ><code>%send</code></button>
                <button
                  className="flex-1 bg-red-500 hover:bg-red-700 text-white p-2 rounded w-full"
                  onClick={() => setShowModal(false)}
                ><code>%close</code></button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
