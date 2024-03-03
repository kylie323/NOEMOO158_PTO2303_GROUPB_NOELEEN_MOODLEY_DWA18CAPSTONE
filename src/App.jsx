import React from 'react'
import { useEffect, useState } from 'react'
import Register from './accounts/Register'
import Login from './accounts/Login'
import Landing from './accounts/Landing'
import { Routes, Route } from "react-router-dom"
import Footer from './structure/Footer'




function App() {
  
  const [token, setToken] = useState(false) 
  if(token){
      sessionStorage.setItem('token', JSON.stringify(token))
  }

  useEffect(() => {
      if(sessionStorage.getItem('token')){
          let data = JSON.parse(sessionStorage.getItem('token'))
          setToken(data)
      }
  }, [])



  return (
    <>
      <div>
        <Routes>
        <Route path='/' element={<Login setToken={setToken} />} />  
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login setToken={setToken} />} />
          {token?<Route path='/landing' element={<Landing token={token} />} />: ""  }  
          <Route path='/landing' element={<Landing />} />
         </Routes>
        <Footer />
      </div>
     
    </>
  )
}

export default App
