import React from 'react'
import Navbar from './component/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'

const App = () => {
  return (
    <div>
      <Navbar />
      <Home />
      <Login />
      <Register />
    </div>
  )
}

export default App
