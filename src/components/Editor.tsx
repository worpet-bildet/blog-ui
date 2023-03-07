import MDEditor from '@uiw/react-md-editor'
import { marked } from 'marked'
import { useState } from 'react'
import BottomBar from './BottomBar'
import TopBar from './TopBar'
import { useStore } from '../state/base'

export default function Editor() {
  const markdown = useStore((state) => state.markdown)
  const setMarkdown = useStore((state) => state.setMarkdown)
  const previewCss = useStore((state) => state.previewCss)

  const [showPreview, setShowPreview] = useState(false)

  return (
    <div className='grid grid-cols-2 h-full grid-rows-12'>
      <div className='col-span-2 grid grid-cols-4 gap-x-4 border-b-4'>
        <TopBar showPreview={showPreview} setShowPreview={setShowPreview} />
      </div>
      <MDEditor
        value={markdown}
        onChange={(e) => {
          setMarkdown(e!)
        }}
        data-color-mode='light'
        preview='edit'
        hideToolbar
        className={`w-full h-full row-span-10 ${
          showPreview ? 'col-span-1' : 'col-span-2'
        } overflow-y-scroll`}
        height={'' as any}
      />
      {showPreview && (
        <iframe
          title='preview'
          srcDoc={`${marked.parse(markdown)}<style>${previewCss}</style>`}
          className='col-span-1 w-full h-full row-span-10'
        />
      )}
      <div className='col-span-2 flex gap-x-4 border-t-4 pt-2 h-14'>
        <BottomBar />
      </div>
    </div>
  )
}
