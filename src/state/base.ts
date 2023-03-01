import { create } from 'zustand'
import { defaultText } from '../lib/defaultText'
import { api } from './api'

export interface State {
  markdown: string
  allBindings: {[key: string]: string}
  pages:    string[]
  drafts:   string[]
  setMarkdown: (s: string) => void
  getAll:      () => Promise<void>
  getDraft:    (s: string) => Promise<void>
  getPage:     (s: string) => Promise<void>
}

export const useStore = create<State>()((set) => ({
  markdown: defaultText,
  allBindings: {},
  pages: [],
  drafts: [],
  setMarkdown: (s) => set(() => ({ markdown: s })),
  getAll: async () => {
    let pages       = await api.scry({ app: 'blog', path: '/pages' })
    let drafts      = await api.scry({ app: 'blog', path: '/drafts' })
    let allBindings = await api.scry({ app: 'blog', path: '/all-bindings'})
    set({ drafts, pages, allBindings })
  },
  getDraft: async (s) => { // TODO remove or integrate
    let draft = await api.scry({ app : 'blog', path: `/draft${s}`})
    set({ markdown : draft })
  },
  getPage: async (s) => {  // TODO remove or integrate
    let page  = await api.scry({ app : 'blog', path: `/md${s}`})
    set({ markdown : page })
  }
}))