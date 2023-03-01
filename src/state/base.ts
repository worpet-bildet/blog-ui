import { create } from 'zustand'
import { defaultText } from '../lib/defaultText'

export interface State {
  markdown: string
  bindings: any
  drafts: string[]
  setMarkdown: (s: string) => void
  setBindings: (s: any) => void
  setDrafts: (s: string[]) => void
}

export const useStore = create<State>()((set) => ({
  markdown: defaultText,
  bindings: undefined,
  drafts: [],
  setMarkdown: (s) => set((state) => ({ markdown: s })),
  setBindings: (s) => set((state) => ({ bindings : s })),
  setDrafts: (s) => set((state) => ({ bindings : s }))
}))