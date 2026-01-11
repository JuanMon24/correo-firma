import { Route, Routes } from 'react-router-dom'
import { routes } from './utils/routes'
import Home from './pages/home/Home'
import Popup from './Components/molecules/Popup'

function App() {
  console.log('🚀 Desarrollado con ❤️ por {ERROR500} para OWAK.🚀') 

  return (
    <>
      <Routes>
        <Route path={routes.home} element={<Home />} />
        <Route path={routes.admin} element={<Home />} />
      </Routes>
      <Popup />
    </>
  )
}

export default App