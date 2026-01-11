import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import ContextProvider from './context/global.context.jsx'
import App from './App.jsx'
import './styles/basics.scss'
import { HomeButton } from './Components/molecules/HomeButton.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter basename={import.meta.env.BASE_URL}>
    <ContextProvider>
      <HomeButton />
      <App />
    </ContextProvider>
  </BrowserRouter>
)