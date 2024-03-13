import React, { useState } from 'react';
import { supabase } from '../client';
import { Link, useNavigate } from 'react-router-dom';
import './accounts.css';

const Login = ({ setToken }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });
            if (error) throw error;
            setToken(data);
            navigate('/landing');
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className='acc-form'>
            <form onSubmit={handleSubmit}>
                <input
                    className='form-group'
                    placeholder='Email'
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                />
                <input
                    className='form-group'
                    placeholder='Password'
                    name='password'
                    type='password'
                    value={formData.password}
                    onChange={handleChange}
                />
                <button type='submit'>Submit</button>
            </form>
            <div className='alternative-acc'>
                Don't have an account? <Link to='/register'>Register</Link>
            </div>
        </div>
    );
};

export default Login;
