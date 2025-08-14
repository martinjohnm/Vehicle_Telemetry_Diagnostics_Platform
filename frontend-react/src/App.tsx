

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { SingleCarPage } from './pages/SingleCarPage'
import { LandingPage } from './pages/LandingPage'

function App() {




  return (
    <>
      <BrowserRouter>
          <Routes>
            <Route element={<SingleCarPage/>} path={`/car/:id`}/>
            <Route element={<LandingPage/>} path='/'/>
          </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
