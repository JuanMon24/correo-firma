import { useGlobalContext } from '../../context/global.context'
import '../../styles/popup.scss'

const Popup = () => {
  const { state, closePopup } = useGlobalContext()
  const { isPopupOpen, popupContent } = state

  if (!isPopupOpen) return null

  return (
    <div className='d-grid center cont-popup'>
      <div className='d-flex popup br-15 p-section'>
        <button className='d-grid center popup-close' onClick={closePopup}>
          <i className='txt-purple fa-solid fa-xmark paragraph'></i>
        </button>
        {popupContent}
      </div>
    </div>
  )
}

export default Popup