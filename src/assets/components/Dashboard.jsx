import React from 'react'

const Dashboard = ({name}) => {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="text-2xl text-blue-500 font-bold text-center">
        {" "}
        Welcome Back! <span className='text-red-500'>{name}</span>
      </div>
    </div>
  )
}

export default Dashboard
