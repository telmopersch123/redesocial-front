import { ArrowUpIcon } from 'lucide-react'
import './App.css'
import { Button } from './components/ui/button'

function App() {
  return (
    <>
      <div className="min-h-screen bg-black/20">
        <Button variant="outline">Button</Button>
        <Button variant="outline" size="icon" aria-label="Submit">
          <ArrowUpIcon />
        </Button>
      </div>
    </>
  )
}

export default App
