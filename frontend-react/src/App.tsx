

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { SingleCarPage } from './pages/SingleCarPage'
import { LandingPage } from './pages/LandingPage'
import { HistoricPage } from './pages/HistoricPage'

function App() {




  return (
    <>
      <BrowserRouter>
          <Routes>
            <Route element={<SingleCarPage/>} path={`/car/:id`}/>
            <Route element={<LandingPage/>} path='/'/>
            <Route element={<HistoricPage/>} path='/historic-data'/>
          </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
