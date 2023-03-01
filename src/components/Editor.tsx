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
    <>
      <div className="flex">
        <MDEditor
          value={markdown}
          onChange={(e) => {setMarkdown(e!)}}
          data-color-mode="light"
          preview="edit"
          hideToolbar
          className={`${showPreview? 'flex-1' : 'flex-2'}`}
        />
        { showPreview && 
          <iframe
            title="preview"
            srcDoc={`${marked.parse(markdown)}`}
            className="flex-1"
          />
        }
        <BottomBar showPreview={showPreview} setShowPreview={setShowPreview}/>
      </div>
    </>
  )
}