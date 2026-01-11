import { useState } from 'react'
import { useGlobalContext } from '../../../context/global.context'
import { getFormOptions } from '../../../utils/js/formConfig'
import Swal from 'sweetalert2'
import Loader from '../../atoms/Loader'
import areasData from '../../../utils/json/areas.json'
import Card from '../../atoms/Card'
import UserForm from '../../atoms/UserForm'

const ListUsersSection = () => {
  const { state, editUser, deleteUser, openPopup, closePopup } = useGlobalContext()
  const { data, loading, error } = state
  const [searchTerm, setSearchTerm] = useState('')
  const [activeMenu, setActiveMenu] = useState(null)

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase())
  }

  const handleEdit = async (id) => {
    const user = data.find(user => user.id === id)
    if (user) {
      const formOptions = getFormOptions(user.area)
      openPopup(
        <UserForm
          config={{
            mode: 'edit',
            user: user,
            onEdit: async (updatedUser) => {
              await editUser(updatedUser)
              closePopup()
              Swal.fire({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                icon: 'success',
                title: `${updatedUser.name} ha sido actualizado exitosamente`,
                didOpen: (toast) => {
                  toast.addEventListener('mouseenter', Swal.stopTimer)
                  toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
              })
            },
            ...formOptions,
            onAreaChange: (area) => {},
            onClose: closePopup
          }}
        />
      )
    }
  }

  const handleDelete = async (id) => {
    const user = data.find(user => user.id === id)
    if (!user) return

    Swal.fire({
      title: `¿Estás seguro de eliminar a ${user.name}?`,
      text: "No podrás revertirlo.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#EB4D10",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteUser(id)
        Swal.fire({
          title: "Eliminado!",
          html: `<strong>${user.name}</strong> ha sido eliminado.`,
          icon: "success"
        })
      }
    })
  }

  const toggleMenu = (id) => {
    setActiveMenu(activeMenu === id ? null : id)
  }

  if (loading || !data.length) {
    return <Loader loading={true} />
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  const filteredUsers = data.filter(user =>
    (user.name && user.name.toLowerCase().includes(searchTerm)) ||
    (user.area && user.area.toLowerCase().includes(searchTerm)) ||
    (user.firma && user.firma.toLowerCase().includes(searchTerm))
  )

  const sortedAreas = areasData.sort((a, b) => a.label.localeCompare(b.label))

  return (
    <div className='cont-list d-grid g-15'>
      <div className='d-grid label-input g-5'>
        <label className='paragraph txt-right txt-purple' htmlFor='name'>Buscador:</label>
        <input
          className='br-15 p-15 border-gray txt-darkgray legal'
          type='text'
          id='name'
          placeholder='Nombre, área o firma...'
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {sortedAreas.map(area => {
        const usersInArea = filteredUsers.filter(user => user.area === area.label).sort((a, b) => a.name.localeCompare(b.name))

        return usersInArea.length > 0 && (
          <details className='cont-area p-15' key={area.id}>
            <summary className='d-flex'>{area.label} ({usersInArea.length})</summary>
            {usersInArea.map(user => {
              const cardConfig = {
                data: user,
                isMenuOpen: activeMenu === user.id,
                onToggleMenu: () => toggleMenu(user.id),
                onEdit: () => handleEdit(user.id),
                onDelete: () => handleDelete(user.id),
              }

              return <Card key={user.id} config={cardConfig} />
            })}
          </details>
        )
      })}
    </div>
  )
}

export default ListUsersSection