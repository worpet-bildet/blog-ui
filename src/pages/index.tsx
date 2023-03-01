import React, { useState, useEffect, useCallback } from 'react'
import { marked } from 'marked'
import MDEditor from '@uiw/react-md-editor'
import { defaultText } from '../lib/defaultText'
import Modal from '../components/Modal'
import { api } from '../state/api'

function Index() {
  // inputs
  const [fileName, setFileName] = useState('')
  const [markdown, setMarkdown] = useState(defaultText)
  // scries
  const [published, setPublished] = useState<string[]>([])
  const [drafts, setDrafts]       = useState<string[]>([])
  const [bindings, setBindings]   = useState<any>()
  // frontend state
  const [rescry, setRescry]               = useState<any>()
  const [showPreview, setShowPreview]     = useState(false)
  const [disableSave, setDisableSave]     = useState(true)
  const [fileNameError, setFileNameError] = useState('')
  const [justPublished, setJustPublished] = useState('')

  // scries
  useEffect(() => {
    const getBindings = async () => {
      let res = await api.scry({app: 'blog', path: '/all-bindings'})
      setBindings(res)
    }
    const getDrafts = async () => {
      let res = await api.scry({app: 'blog', path: '/drafts'})
      setDrafts(res)
    }
    const getPublished = async () => {
      let res = await api.scry({app: 'blog', path: '/pages'})
      setPublished(res)
    }
    getBindings()
    getDrafts()
    getPublished()
  }, [api, rescry])

  // frontend state
  useEffect(() => {
    if (fileName.charAt(fileName.length - 1) === '/') {
      setFileNameError(`cannot end in a slash`)
      setDisableSave(true)
    } else if (fileName.charAt(0) !== '/'){
      setFileNameError(`must start with a slash`)
      setDisableSave(true)
    } else if (bindings?.[fileName]) {
      const inUse = bindings[fileName]
      if (inUse === 'desk: %blog') {
        setFileNameError(`you will overwrite ${fileName}`)
        setDisableSave(false)
      } else {
        setFileNameError(`${fileName} is in use by ${inUse}`)
        setDisableSave(true)
      }
    } else {
      setFileNameError('')
      setDisableSave(false)
    }
  }, [fileName, bindings])

  const handlePublish = useCallback(
    async (e : React.SyntheticEvent) => {
      e.preventDefault()
      const a = await api.poke({
        app: 'blog',
        mark: 'blog-action',
        json: {
          "publish": {
            "path": fileName,
            "html": marked.parse(markdown),
            "md": markdown
      }}})
      setRescry(a)
      setDisableSave(true)
      setJustPublished(`${window.location.origin}${fileName}`)
  }, [api, fileName, markdown])

  const handleSaveDraft = useCallback(
    async (e : React.SyntheticEvent) => {
      e.preventDefault()
      const a = await api.poke({
        app: 'blog',
        mark: 'blog-action',
        json: {
          "save-draft": {
            "path": fileName,
            "md": markdown
      }}})
      setRescry(a)
      setDisableSave(true)
  }, [api, fileName, markdown])

  const handleDeleteDraft = useCallback(
    async (toDelete: string) => {
      const a = await api.poke({
        app: 'blog',
        mark: 'blog-action',
        json: {
          "delete-draft": {
            "path": toDelete,
      }}})
      setRescry(a)
      setDisableSave(true)
  }, [api])

  const handleUnpublish = useCallback(
    async (toUnpublish: string) => {
      const a = await api.poke({
        app: 'blog',
        mark: 'blog-action',
        json: { 'unpublish': { 'path': toUnpublish } }
      })
      setRescry(a)
  }, [api])

  const handleEdit = useCallback(
    async (path: string, toEdit: string) => {
      const res = await api.scry({
        app: 'blog',
        path: `${path}${toEdit}` // path is either /draft or /md
      })
      setFileName(toEdit)
      setMarkdown(res)
    }, [api])

  return (
    <>
      {/* <Published published={published} edit={handleEdit} remove={handleUnpublish}/> */}
      {/* <Drafts drafts={drafts} edit={handleEdit} remove={handleDeleteDraft}/> */}
      { justPublished.length !== 0 && <Modal justPublished={justPublished} setJustPublished={setJustPublished}/> }
    </>
  );
}

export default Index
