import MainContent from './components/MainContent'
import RightSideMenu from './components/RightSideMenu'
import BottomBar from './components/BottomBar'

export default function Home() {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-grow overflow-auto">
        <MainContent />
      </div>
      <RightSideMenu />
      <BottomBar />
    </div>
  )
}

