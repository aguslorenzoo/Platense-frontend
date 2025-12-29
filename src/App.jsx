import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router'
import HomeScreen from './Screens/HomeScreen/HomeScreen.jsx'
import ListaJugadorasScreen from './Screens/ListaJugadorasScreen/ListaJugadorasScreen.jsx'

function App() {
  
  return (
      <Routes>
        <Route path="/" element={<HomeScreen/>}/>
        <Route path="/lista" element={<ListaJugadorasScreen/>}/>
      </Routes>
  )
}

export default App
