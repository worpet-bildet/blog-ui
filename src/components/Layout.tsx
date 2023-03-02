import { ReactNode } from 'react'
import SideBar from '../components/SideBar'

export default function Layout({ children } : { children: ReactNode}) {

  
  return (
    <main className="p-4 h-full">
      <div className="grid grid-rows-1 lg:grid-cols-12 md:grid-cols-1 gap-4 h-full">
        <div className="col-span-3 border-r-[1px] border-solid">
          <SideBar />
        </div>
        <div className="col-span-9">
          {children}
        </div>
      </div>
    </main>
  )
}