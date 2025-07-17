import React from 'react'

const AdminDashboard = ({name}) => {
  return (
    <div className="h-screen flex flex-col">
        <nav className="bg-blue-500 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
            <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-6">
                <a href="#" className="text-white-700 hover:text-white">Dashboard</a>
                <a href="#" className="text-gray-700 hover:text-white">Users</a>
                <a href="#" className="text-gray-700 hover:text-white">Settings</a>
                <a href="#" className="text-white hover:underline">Logout</a>
            </div>
            </div>
        </div>
        </nav>
            
       <div>
        <div className="h-full flex items-center justify-center mt-20">
            <div className="text-2xl text-blue-500 font-bold text-center">
                Welcome Admin! <span className='text-red-500'>Admin</span>
            </div>
        </div>
       </div>
    </div>
  )
}

export default AdminDashboard;
