import { useState, useMemo } from 'react'
import { useGlobalContext } from '../../../context/global.context'
import { getFormOptions } from '../../../utils/js/formConfig'
import UserForm from '../../atoms/UserForm'

const AddUserSection = () => {
  const [selectedArea, setSelectedArea] = useState('')
  const [userAdded, setUserAdded] = useState(false)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const { state, addUser } = useGlobalContext()
  const { loading } = state

  // Memoriza las opciones del formulario en base al área seleccionada
  const formOptions = useMemo(() => getFormOptions(selectedArea), [selectedArea])

  // Maneja el cambio de área en el formulario
  const handleAreaChange = (area) => {
    if (area !== selectedArea) {
      setSelectedArea(area) // Actualiza el área seleccionada
    }
  }

  // Enviar el formulario y agregar el usuario
  const onSubmit = async (data) => {
    setFormSubmitting(true) // Activa el estado de carga local
    try {
      await addUser(data) // Llama a la función para agregar el usuario
      setUserAdded(true) // Marca que el usuario fue agregado
    } catch (error) {
      console.error("Error al agregar el usuario:", error)
    } finally {
      setFormSubmitting(false) // Desactiva el estado de carga local
    }
  }

  return (
    <>
      <p className='txt-purple txt-center legal'>Verifica la información actual y completa la restante. En el campo "Nombre para firma" puede considerarse una abreviación, diminutivo u otro en tu nombre o apellido, siempre recordando que por su uso, será visible para tus contactos internos y externos como clientes, aliados y proveedores así que decide pensando en tu eje: POSITION (Audience + Products).</p>

      <UserForm
        config={{
          mode: 'add',
          onSubmit: onSubmit,
          ...formOptions,
          onAreaChange: handleAreaChange
        }}
      />

      {loading || formSubmitting ? ( // Mostrar mensaje de carga si el formulario o el estado global está cargando
        <p className='txt-purple txt-center paragraph'>Cargando...</p>
      ) : (
        <>
          {userAdded && (
            <>
              <p className='txt-purple txt-center paragraph'><strong className='f-neue--bold'>¡Gracias por elegir que importe tu firma!</strong></p>
              <p className='txt-purple txt-center legal'><strong className='f-neue--bold'>Ve a la sección "Genera tu firma"</strong></p>
            </>
          )}
        </>
      )}
    </>
  )
}

export default AddUserSection