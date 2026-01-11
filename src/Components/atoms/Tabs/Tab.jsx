const Tab = ({ name, isActive, onClick }) => {
  return (
    <div className={`d-grid center bg-${isActive ? 'purple' : 'white'} tab paragraph border-${isActive ? 'white' : 'purple'} p-15 ${isActive ? 'active' : ''}`} onClick={onClick}>
      <p className={`txt-${isActive ? 'white' : 'purple'} txt-upercase d-flex g-5`}><i className={`fa-solid fa-${name.icon}`}></i>{name.text}</p>
    </div>
  )
}

export default Tab