import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { useGlobalContext } from '../../../context/global.context'
import areas from '../../../utils/json/areas.json'
import SignaturePreview from '../../molecules/SignaturePreview'
import CopyButton from '../CopyButton'
import Loader from '../../atoms/Loader'

const GeneratorSection = () => {
  const { state } = useGlobalContext()
  const { data } = state
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedBanner, setSelectedBanner] = useState(null)
  const [selectedArea, setSelectedArea] = useState(null)
  const [signatureData, setSignatureData] = useState(null)
  const [loadingContent, setLoadingContent] = useState(true) // Estado para el primer loader
  const [loadingSignature, setLoadingSignature] = useState(false) // Estado para el segundo loader
  const [infoRef, setInfoRef] = useState(null)
  const [userInputValue, setUserInputValue] = useState('')

  useEffect(() => {
    setTimeout(() => {
      setLoadingContent(false)
    }, 2000)
  }, [])

  useEffect(() => {
    if (selectedUser && selectedBanner) {
      setLoadingSignature(true)
      setSignatureData({
        ...selectedUser,
        bannerSrc: import.meta.env.BASE_URL + selectedBanner,
      })
      setTimeout(() => setLoadingSignature(false), 1000)
    } else {
      setSignatureData(null)
    }
  }, [selectedUser, selectedBanner])
  
  useEffect(() => {
    if (signatureData && !loadingSignature) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        icon: 'success',
        title: 'Firma creada exitosamente',
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
    }
  }, [signatureData, loadingSignature])

  const handleAreaChange = (e) => {
    const selectedIndex = e.target.value
    setSelectedArea(areas[selectedIndex]?.label)
    setSelectedBanner(areas[selectedIndex]?.src)
    // setSelectedBanner(areas[selectedIndex]?.srcPrueba)  // Pruebas
    setSelectedUser(null) // Reset user when area changes
    setUserInputValue('') // Reset input value
  }

  const filteredUsers = selectedArea ? data.filter((user) => user.area === selectedArea).sort((a, b) => a.name.localeCompare(b.name)) : []

  const handleUserChange = (e) => {
    const userName = e.target.value
    setUserInputValue(userName)
    const selected = filteredUsers.find((user) => user.name === userName)
    setSelectedUser(selected || null)
  }

  return (
    <>
      <div className='d-grid g-5'>
        <Loader loading={loadingContent}>
          <div className='d-grid label-input g-5'>
            <label className='txt-purple txt-right paragraph' htmlFor='banner-select'>Área:</label>
            <select className='txt-darkgray border-gray br-15 legal p-15' id='banner-select' onChange={handleAreaChange}>
              <option value=''>Selecciona tu área</option>
              {areas.map((area, index) => (
                <option key={index} value={index}>{area.label}</option>
              ))}
            </select>
          </div>
          <div className='d-grid label-input g-5'>
            <label className='txt-purple txt-right paragraph' htmlFor='user-input'>Usuario:</label>
            <input
              className='txt-darkgray border-gray br-15 legal p-15'
              id='user-input'
              list='user-list'
              onChange={handleUserChange}
              disabled={!selectedArea}
              value={userInputValue} // Usa el valor del input
              placeholder='Escribe tu nombre de usuario'
            />
            <datalist id='user-list'>
              {filteredUsers.map((user, index) => (
                <option key={index} className='txt-capitalize' value={user.name} />
              ))}
            </datalist>
          </div>
        </Loader>
      </div>
      <Loader loading={loadingSignature}>
        {!loadingSignature && signatureData && (
          <>
            <SignaturePreview userData={signatureData} setInfoRef={setInfoRef} />
            <CopyButton infoRef={infoRef} />
            <div>
              <p className='txt-purple txt-center paragraph'><strong className='f-neue--bold'>¡Gracias por elegir que importe tu firma!</strong></p>
              <p className='txt-purple txt-center legal'>✨ ¡Ahora, continúa marcando la diferencia <a className='txt-purple' href="https://scribehow.com/shared/Create_an_Email_Signature_OWAK__AWUy5dIJQlGJ0eFl_EbXjA#c81b763b" target="_blank" rel="noopener noreferrer"><strong>siguiendo el tutorial</strong></a> ✨</p>
            </div>
          </>
        )}
      </Loader>
    </>
  )
}

export default GeneratorSection