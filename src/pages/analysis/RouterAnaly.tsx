import { Outlet } from 'react-router-dom'
import { SidebarAnalysis } from './components/sidebarAnaly'

export const AnalysisInitPage = () => {
  return (
    <div className="flex min-h-screen w-[100vw] bg-slate-50 dark:bg-zinc-900">
      <SidebarAnalysis />
      <main className="w-full">
        <Outlet />
      </main>
    </div>
  )
}
