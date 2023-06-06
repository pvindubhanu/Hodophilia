import axios from 'axios';
import React, { useContext, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { LoginContext } from '../../contexts/loginContext';

const LoginOAuth = () => {
   const [param] = useSearchParams();
   const context = useContext(LoginContext);

   const navigate = useNavigate()
   useEffect(() => {

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({email: param.get("email"), password: "test"})
    }

    fetch('http://localhost:8080/auth/login/', requestOptions)
    .then(res => res.json())
    .then(res => context.login(null, param.get("email"), [], res.accessToken) // TODO: fill first field or remove it
    )
    .then(res => navigate("/"))
    .catch((error)=> alert(error.message))

   
   }, [])

  return (
    <div>loginoauth</div>
  )
}

export default LoginOAuth