import React, { useState } from 'react';
import { supabase } from '../client';
import { Link, useNavigate } from 'react-router-dom';
import './accounts.css';


const Login = ({setToken}) => {

    let navigate = useNavigate();

    const [formData, setFormData] = useState({
        email:'',
        password:'',
    })
 
console.log(formData)

    function handleChange(event) {
    setFormData((prevFormData)=>{
     return{
        ...prevFormData,
        [event.target.name]: event.target.value
     }
    })
    }

    async function handleSubmit(event){
        event.preventDefault()

        try{
            const { data, error } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
              })
            if (error) throw error
            console.log(data)
            setToken(data)
            navigate('/landing')


        }catch(error){
            alert(error)
        }
    }

   

    return (
        <div className='acc-form'>
            <form onSubmit={handleSubmit}>

                <input className='form-group'
                placeholder='Email'
                name='email'
                onChange={handleChange}
                />
                
                <input className='form-group'
                placeholder='Password'
                name='password'
                type='password'
                onChange={handleChange}
                />

                <button type='submit'>
                    Submit
                </button>
            </form>
            <div className='alternative-acc'>
            Dont have an account? <Link to='/register'>Register</Link>  
            </div>
        </div>
    )
}

export default Login