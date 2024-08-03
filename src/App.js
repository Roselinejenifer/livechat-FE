import React from 'react'
import Home from './Home'
import Chat from './components/Chat'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
const App = () => {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/chat' element={<Chat />} />
      </Routes>
    </BrowserRouter>
    </div>
  )
}

export default App
