import { Link, useMatch } from 'react-router-dom'
import { useStore } from '../state/base'

interface SideBarProps {
  onToggle: any
}

export default function SideBar({ onToggle }: SideBarProps) {
  const drafts = useStore((state) => state.drafts)
  const pages = useStore((state) => state.pages)
  const themes = useStore((state) => state.themes)
  const match = useMatch('*')

  type SidebarItemProps = {
    linkbase: string
    item: string
  }

  const SidebarItem = ({ linkbase, item }: SidebarItemProps) => {
    let linkto = `${linkbase}${item}`
    return (
      <Link to={linkto}>
        <li
          className={`flex mb-1 text-blue-600 visited:text-purple-600 text-xs hover:bg-gray-100 p-2 ${
            match?.pathname === linkto ? 'bg-gray-100' : ''
          }`}
        >
          <div className='text-left flex-1 my-auto truncate'>
            <code>{item}</code>
          </div>
        </li>
      </Link>
    )
  }

  return (
    <div className='h-full overflow-y-scroll pr-4'>
      <div className='flex flex-row items-center justify-between w-full'>
        <Link to='/'>
          <h1 className='text-3xl'>
            <code>%blog</code>
          </h1>
        </Link>
        <button onClick={onToggle}>{'<<'}</button>
      </div>
      <ul className='bg-white pt-6'>
        <label className='block text-gray-700 font-bold mb-3'>
          Published <code>%blog</code>s
        </label>
        {pages.sort().map((pub: string, i) => (
          <SidebarItem linkbase={`/published`} item={pub} key={i}></SidebarItem>
        ))}
      </ul>
      <ul className='bg-white pt-6'>
        <label className='block text-gray-700 font-bold mb-3'>
          <code>%draft</code>s
        </label>
        {drafts.sort().map((draft: string, i) => (
          <SidebarItem linkbase={`/draft`} item={draft} key={i}></SidebarItem>
        ))}
      </ul>
      <ul className='bg-white pt-6'>
        <label className='block text-gray-700 font-bold mb-3'>
          <code>%theme</code>s
        </label>
        {themes.sort().map((theme: string, i) => (
          <SidebarItem linkbase={`/theme/`} item={theme} key={i}></SidebarItem>
        ))}
      </ul>
      <Link to='/theme'>
        <button className='bg-blue-500 hover:bg-blue-700 text-white p-2 rounded disabled:opacity-50'>
          <code>%new-theme</code>
        </button>
      </Link>
    </div>
  )
}
