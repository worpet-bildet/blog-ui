import { ReactNode, useState } from 'react'
import SideBar from '../components/SideBar'

export default function Layout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <main className='p-4 h-full'>
      <div className='grid grid-rows-1 lg:grid-cols-12 md:grid-cols-1 gap-4 h-full'>
        {isSidebarOpen ? (
          <div className='border-r-[1px] border-solid col-span-3'>
            <SideBar onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
          </div>
        ) : (
          <div className='border-r-[1px] border-solid col-span-1'>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              {'>>'}
            </button>
          </div>
        )}
        <div className={`${isSidebarOpen ? 'col-span-9' : 'col-span-11'}`}>
          {children}
        </div>
      </div>
    </main>
  )
}
