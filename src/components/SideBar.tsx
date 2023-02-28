import Published from './BlogList'
import Publish from './Publish'
import Drafts from './DraftsList'

export default function SideBar() {
  return (
    <div className="overflow-y-scroll">
      <Publish />
      <Published/>
      <Drafts/>
    </div>
  )
}