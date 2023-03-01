import { useState, useCallback } from 'react'
import { api } from '../state/api'
import { useStore } from '../state/base'

type ModalProps = {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
};

export default function ThemeModal({ setShowModal }: ModalProps) {
  const [css, setCss] = useState('')
  const [name, setName] = useState('')
  const getAll = useStore(state => state.getAll)

  const handleSaveTheme = useCallback(
    async (e : React.SyntheticEvent) => {
      e.preventDefault()
      await api.poke({
        app: 'blog',
        mark: 'blog-action',
        json: {
          "save-theme": {
            "theme": name,
            "css": css
      }}})
      getAll()
      setShowModal(false)
  }, [name, css])

  return (
    <>
      <div className="fixed inset-0 z-10 overflow-y-auto backdrop-blur-md">
        <div className="flex items-center min-h-screen px-4 py-8">
          <div className="relative w-full max-w-lg p-4 mx-auto bg-white rounded-md shadow-lg text-center">
            <h4 className="text-md font-bold">
              <code>%new-theme</code>
            </h4>
            <input
              className="w-full mb-4"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="example-theme"
            />
            <textarea
              value={css}
              onChange={(e) => setCss(e.target.value)}
            />
            <div className="flex text-xs gap-x-2">
              <button
                className="flex-1 bg-blue-500 hover:bg-blue-700 text-white p-2 rounded w-full"
                onClick={handleSaveTheme}
              ><code>%save</code></button>
              <button
                className="flex-1 bg-red-500 hover:bg-red-700 text-white p-2 rounded w-full"
                onClick={() => setShowModal(false)}
              ><code>%close</code></button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
