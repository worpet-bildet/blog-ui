type DraftsProps = {
  drafts: string[]
  fileName: string
  setToEdit: React.Dispatch<React.SetStateAction<string>>
  setToPublish: React.Dispatch<React.SetStateAction<string>>
}

export default function Drafts(props: DraftsProps) {
  const { drafts, fileName, setToEdit, setToPublish } = props

  if (drafts.length === 0) return <></>

  return (
    <ul className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <label className="block text-gray-700 font-bold mb-5 text-center"><code>%draft</code>s</label>
      { drafts.map((bind: string, i) => (
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
              className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded disabled:opacity-50"
              onClick={() => setToPublish(bind)}
            >
              <code>%publish</code>
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}