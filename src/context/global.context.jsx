import { createContext, useContext, useEffect, useReducer } from 'react'
import { reducer } from '../reducers/reducer'

export const initialState = {
  data: [],
  loading: false,
  isPopupOpen: false,
  popupContent: null,
  activeTab: localStorage.getItem('activeTab') ? parseInt(localStorage.getItem('activeTab')) : 1,
  error: null,
}

export const GlobalContext = createContext()

const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const setLoading = (isLoading) => {
    dispatch({ type: 'SET_LOADING', payload: isLoading })
  }

  // Construimos la URL completa
  const usersJsonUrl = `${import.meta.env.BASE_URL}${import.meta.env.VITE_API_URL}`

  // Función para desencriptar usando la clave y el IV
  const decrypt = async (encryptedText, key) => {
    const [ivBase64, encryptedBase64] = encryptedText.split(':');
    const iv = Uint8Array.from(atob(ivBase64), (c) => c.charCodeAt(0));
    const keyBuffer = new TextEncoder().encode(key);

    const importedKey = await crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: 'AES-CBC' },
      false,
      ['decrypt']
    );

    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-CBC', iv: iv },
      importedKey,
      Uint8Array.from(atob(encryptedBase64), (c) => c.charCodeAt(0))
    );

    return new TextDecoder().decode(decryptedBuffer);
  };

  const getUsers = async () => {
    setLoading(true)
    try {
      const response = await fetch(usersJsonUrl)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const encryptedData = await response.text(); // Leer datos encriptados como texto
      const decryptedData = await decrypt(encryptedData, import.meta.env.VITE_ENCRYPTION_KEY); // Desencriptar datos
      const parsedData = JSON.parse(decryptedData);

      // console.log('Datos obtenidos:', parsedData)
      dispatch({ type: 'GET_USERS', payload: parsedData })
    } catch (error) {
      console.error('Error al obtener los usuarios:', error)
      dispatch({ type: 'FETCH_USERS_FAILURE', payload: error.message })
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    if (!localStorage.getItem('activeTab')) {
      localStorage.setItem('activeTab', '1')
    }
    getUsers()
  }, [])



  // Popup
  // Open Function
  const openPopup = (content) => {
    dispatch({ type: 'OPEN_POPUP', payload: content })
  }
  // Close Function
  const closePopup = () => {
    dispatch({ type: 'CLOSE_POPUP' })
  }



  // Tabs
  const setActiveTab = (tabId) => {
    localStorage.setItem('activeTab', tabId)
    dispatch({ type: 'SET_ACTIVE_TAB', payload: tabId })
  }

  const contextValue = {
    state,
    setActiveTab,
    openPopup,
    closePopup,
  }

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  )
}

export default GlobalProvider

export const useGlobalContext = () => useContext(GlobalContext)