export const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      }
    case 'GET_USERS':
      return {
        ...state,
        data: action.payload, // Aquí se espera que `payload` sea un array de usuarios
        error: null,
      }
    case 'ADD_USER':
      return {
        ...state,
        data: [...state.data, action.payload], // Añadir el nuevo usuario al array existente
        error: null,
      }
    case 'EDIT_USER':
      return {
        ...state,
        data: state.data.map(user => user.id === action.payload.id ? action.payload : user), // Editar el usuario en la lista
        error: null,
      }
    case 'DELETE_USER':
      return {
        ...state,
        data: state.data.filter(user => user.id !== action.payload), // Eliminar el usuario por ID
        error: null,
      }
    case 'FETCH_USERS_FAILURE':
      return {
        ...state,
        error: action.payload,
      }
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload }
    case 'OPEN_POPUP':
      return { ...state, isPopupOpen: true, popupContent: action.payload }
    case 'CLOSE_POPUP':
      return { ...state, isPopupOpen: false, popupContent: null }
    default:
      return state
  }
}