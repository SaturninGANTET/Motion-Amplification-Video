import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from "./pages/HomePage"
import RequireAuth from './RequireAuth'
import Upload from './pages/Upload'
import Output from './pages/Output'
import Signup from './pages/Signup'
import Login from './pages/Login'
import InputPage from './pages/InputPage'

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element= {<HomePage/>} />
          <Route path="/upload" element={<RequireAuth><Upload/></RequireAuth>} />
          <Route path="/output" element={<RequireAuth><Output/></RequireAuth>} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/input" element={<RequireAuth><InputPage/></RequireAuth>} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
