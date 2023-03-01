import MDEditor from '@uiw/react-md-editor'
import { marked } from 'marked'
import { useState } from 'react'
import BottomBar from './BottomBar'
import { useStore } from '../state/base'

export default function Editor() {
  const markdown    = useStore(state => state.markdown)
  const setMarkdown = useStore(state => state.setMarkdown)

  const [showPreview, setShowPreview] = useState(false)

  return (
    <div className="grid grid-rows-2 grid-cols-2 h-full" style={{gridTemplateRows : '1fr auto', height: '95vh'}}>
      <MDEditor
        value={markdown}
        onChange={(e) => {setMarkdown(e!)}}
        data-color-mode="light"
        preview="edit"
        hideToolbar
        className={`w-full h-full ${showPreview? 'col-span-1' : 'col-span-2'} overflow-y-scroll`}
        height={'' as any}
      />
      { showPreview && 
        <iframe
          title="preview"
          srcDoc={`${marked.parse(markdown)}`}
          className="col-span-1 w-full h-full"
        />
      }
      <div className="col-span-2 flex gap-x-4 pt-5" style={{height: 'fit-content'}}>
        <BottomBar showPreview={showPreview} setShowPreview={setShowPreview}/>
      </div>
    </div>
  )
}