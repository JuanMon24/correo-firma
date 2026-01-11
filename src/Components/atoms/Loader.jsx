import React from 'react'


const Loader = ({ loading, children }) => {
  if (!loading) {
    return children
  }

  return (
    <div className='loader d-grid center'>
      <div className='spinner'></div>
    </div>
  )
}

export default Loader