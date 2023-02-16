type PublishedProps = {
  published: string[]
  fileName: string
  setToEdit: React.Dispatch<React.SetStateAction<string>>
  setToRemove: React.Dispatch<React.SetStateAction<string>>
}

export default function Published(props : PublishedProps) {
  const { published, fileName, setToEdit, setToRemove } = props

  if (published.length === 0) return <></>

  return (
    <ul className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <label className="block text-gray-700 font-bold mb-5 text-center">Published <code>%blog</code>s</label>
      { published.map((bind: string, i) => (
        <li key={i} className="flex mb-3 text-blue-600 visited:text-purple-600 text-xs">
          <div className="text-left flex-1 my-auto truncate">
            <a href={`${bind}`} target="_blank" rel="noreferrer"><code>{bind}</code></a>
          </div>
          <div className="flex-1 flex justify-end">
            <button
              className="bg-yellow-500 hover:bg-yellow-700 text-white p-2 rounded mr-3 disabled:opacity-50"
              onClick={() => setToEdit(bind)}
              disabled={fileName === bind}
            >
              <code>%edit</code>
            </button>
            <button 
              className="bg-red-500 hover:bg-red-700 text-white p-2 rounded disabled:opacity-50"
              onClick={() => setToRemove(bind)}
            >
              <code>%unpublish</code>
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}