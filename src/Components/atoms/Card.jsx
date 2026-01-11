import { useState, useEffect, useRef } from 'react'
import Button from './Button'
import { formatPhoneNumber } from '../../utils/js/formatPhoneNumber'

const Card = ({ config }) => {
  const { data, onEdit, onDelete, isMenuOpen, onToggleMenu } = config
  const [showMore, setShowMore] = useState(false)
  const menuRef = useRef(null)
  const buttonRef = useRef(null)

  const toggleShowMore = () => {
    setShowMore((prevState) => !prevState)
  }

  // Maneja el clic fuera del menú
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Verificar si menuRef y buttonRef están disponibles antes de acceder a contains
      if (menuRef.current && buttonRef.current) {
        if (!menuRef.current.contains(event.target) && !buttonRef.current.contains(event.target)) {
          onToggleMenu() // Cierra el menú si se hace clic fuera
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menuRef, buttonRef, onToggleMenu])


  const formattedPhone = formatPhoneNumber(data.phone)

  const positions = Array.isArray(data.position)
    ? data.position
    : data.position.split(',').map((item) => item.trim())

  return (
    <div className={`d-grid card bg-${showMore ? 'purple' : 'white'} br-15`}>
      <header className={`p-15 ${!showMore && 'glass'} txt-${showMore ? 'white' : 'purple'}`}>
        <h3 className='paragraph' onClick={toggleShowMore}>{data.name}</h3>
        <nav className='d-flex card-menu' ref={menuRef}>
          <Button className={`txt-${showMore ? 'white' : 'purple'} btn`} onClick={onToggleMenu}> {/* Cambiado a onToggleMenu */}
            <i className={`fa-solid fa-ellipsis-vertical`}></i>
          </Button>
        </nav>
      </header>
      {isMenuOpen && (
        <ul className='items bg-gray' ref={menuRef}>
          <li className='txt-purple' onClick={() => {
              onToggleMenu() // Cierra el menú
              onEdit(data.id)
            }}
          >
            Editar
          </li>
          <li
            className='txt-purple'
            onClick={() => {
              onToggleMenu() // Cierra el menú
              onDelete(data.id)
            }}
          >
            Eliminar
          </li>
        </ul>
      )}
      {showMore && (
        <>
          <span className='bg-white separator--line'></span>
          <div className={`d-grid card-body p-15 g-5 txt-${showMore ? 'white' : 'purple'} ${showMore ? 'open' : ''}`}>
            <p className='legal anim'><strong>Firma:</strong> {data.signature_name}</p>
            <p className='legal anim'><strong>Area:</strong> {data.area}</p>
            <p className='legal anim'><strong>Cargo:</strong> {positions.join(', ')}</p>
            <p className='legal anim'><strong>Hat:</strong> {data.hat}</p>
            <p className='legal anim'><strong>Email:</strong> {data.email}</p>
            <p className='legal anim'><strong>Phone:</strong> {formattedPhone}</p>
          </div>
        </>
      )}
    </div>
  )
}

export default Card