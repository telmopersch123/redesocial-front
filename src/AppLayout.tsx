import { Outlet } from 'react-router-dom'
import BatePapoLateral from './components/componentsPages/componentBatePapo/BatePapoComponent'
import BreathingComponent from './components/componentsPages/componentsBreathing/BreathingComponent'
import { PostDialog } from './components/componentsPages/componentsFeed/PostDialog'
import { AppSidebar } from './components/componentsPages/Navbar/navbar'
import { SidebarTrigger } from './components/ui/sidebar'

export function AppLayout() {
  return (
    <>
      {/* <div className="flex h-screen w-full"> */}
      <BreathingComponent />

      <AppSidebar />
      <main className="flex-shrink-0 overflow-x-auto">
        <SidebarTrigger className="absolute left-0 top-0 m-3 bg-gray-500/5 p-3 transition-all ease-linear hover:bg-gray-500/15" />
        <PostDialog />
        <Outlet />
      </main>
      <BatePapoLateral />
      {/* </div> */}
    </>
  )
}
