

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { SingleCarPage } from './pages/SingleCarPage'
import { LandingPage } from './pages/LandingPage'
import { useInitialize } from './hooks/useInitialize'
import { AnalyticsPage } from './pages/Analytics'
function App() {




  const {loading}  = useInitialize()

  if (loading) {
    return <div>
      Loading
    </div>
  }
  return (


    <>
      
        <BrowserRouter>
            <Routes>
              <Route element={<SingleCarPage/>} path={`/car/:id`}/>
              <Route element={<LandingPage/>} path='/'/>
              <Route element={<AnalyticsPage/>} path='/analytics'/>
            </Routes>
        </BrowserRouter>
    </>
  )
}

export default App
