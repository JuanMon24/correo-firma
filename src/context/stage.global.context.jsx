import { createContext, useContext, useEffect, useReducer } from 'react'
import { reducer } from '../reducers/reducer'
import { fetchData } from '../utils/js/fetchData'

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



  const getUsers = async () => {
    setLoading(true)
    try {
      const data = await fetchData({ method: 'get', url: '/users' })
      dispatch({ type: 'GET_USERS', payload: data })
    } catch (error) {
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
  const addUser = async (user) => {
    setLoading(true)
    try {
      const data = await fetchData({ method: 'post', url: '/users', data: user })
      dispatch({ type: 'ADD_USER', payload: data })
    } catch (error) {
      console.error('Error adding user:', error)
    } finally {
      setLoading(false)
    }
  }
  const editUser = async (user) => {
    setLoading(true)
    try {
      const data = await fetchData({ method: 'put', url: `/users/${user.id}`, data: user })
      dispatch({ type: 'EDIT_USER', payload: data })
    } catch (error) {
      console.error('Error editing user:', error)
    } finally {
      setLoading(false)
    }
  }
  const deleteUser = async (id) => {
    setLoading(true)
    try {
      await fetchData({ method: 'delete', url: `/users/${id}` })
      dispatch({ type: 'DELETE_USER', payload: id })
    } catch (error) {
      console.error('Error deleting user:', error)
    } finally {
      setLoading(false)
    }
  }



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
    addUser,
    editUser,
    deleteUser,
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