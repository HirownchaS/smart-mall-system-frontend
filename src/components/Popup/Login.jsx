import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Swal from 'sweetalert2';
import axios from 'axios';
import Register from './Register';
import { AuthContext } from '../../helper/AuthContext';


function Login({ modal, setModal }) {
  const { setAuthState} = useContext(AuthContext)
  const [showRegister, setShowRegister] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = () => {
    setShowRegister(true);
  };

  const handleShowLogin = () => {
    setShowRegister(false);
  };

  const navigate = useNavigate()

  const schema = yup.object().shape({
    email : yup.string().email().required(),
    password : yup.string().required(),
  })
  
  const {register , handleSubmit ,formState : {errors}} = useForm({
    resolver : yupResolver(schema)
  })
  
  const onSubmit = (data) => {
    const login_data = {
      email : data.email,
      password : data.password
    }
    
    axios.post('http://localhost:8080/api/user/login', login_data).then((res) => {
      if(res.data.error){
        // Use ONLY the error message from the server without adding extra text
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: 'The provided email/password was not found. Please check and try again.',
        });
      } else {
        localStorage.setItem('authtoken', res.data.token)
        setAuthState(res.data.token);
        Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: 'You have successfully logged in!',
        }).then(() => {
          setModal(false);
          navigate('/')
          window.location.reload();
        });
      }
    }).catch(err => {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: 'The provided email/password was not found. Please check and try again.',
      });
    });
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center'>
      <div className='w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg relative'>
        <button
          className='text-gray-600 dark:text-gray-300 text-2xl absolute top-4 right-4'
          onClick={() => setModal(false)}
        >
          X
        </button>
        {showRegister ? (
          <Register handleShowLogin={handleShowLogin} />
        ) : (
          <>
            <h2 className='text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100'>
              Login
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col'>
              <input
                id='email'
                type='email'
                placeholder='Enter your email'
                {...register('email', { required: 'Email is required' })}
                className='mb-4 p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200'
              />
              {errors.email && <p className='text-red-500'>{errors.email.message}</p>}
              <input
                id='password'
                type='password'
                placeholder='Password'
                {...register('password', { required: 'Password is required' })}
                className='mb-4 p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200'
              />
              {errors.password && <p className='text-red-500'>{errors.password.message}</p>}
              {error && <p className='text-red-500'>{error}</p>}
              <button
                type='submit'
                className='bg-blue-500 dark:bg-blue-700 text-white p-2 rounded hover:bg-blue-600 dark:hover:bg-blue-600 w-full'
              >
                Login
              </button>
              <div className='mt-4 text-center'>
                <p className='text-gray-700 dark:text-gray-300'>
                  Don&apos;t have an account?{' '}
                  <button
                    type='button'
                    onClick={handleRegister}
                    className='text-blue-500 dark:text-blue-400 underline'
                  >
                    Register
                  </button>
                </p>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;