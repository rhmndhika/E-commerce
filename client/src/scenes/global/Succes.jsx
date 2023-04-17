import React from 'react'
import { useLocation } from 'react-router-dom'

const Succes = () => {
  
  const location = useLocation();

  console.log(location)

  return (
    <div>Succes!!</div>
  )
}

export default Succes