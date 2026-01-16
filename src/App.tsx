import { Toaster } from 'react-hot-toast'
import './App.css'
import AppRoutes from './routes/routes'
function App() {
  return (
    <>
      <Toaster position="top-right" />
      <AppRoutes />
    </>
  )
}

export default App
