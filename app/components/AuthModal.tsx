'use client'

import { useContext, useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import AuthModalInputs from './AuthModalInputs'
import useAuth from '../../hooks/useAuth'
import { AuthenticationContext } from '../context/AuthContext'
import { Alert, CircularProgress } from '@mui/material'

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  color: 'rgb(55, 65, 81)',
}

export default function AuthModal({ isSignIn }: { isSignIn: boolean }) {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const [inputs, setInputs] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    password: ''
  })

  const [disabled, setDisabled] = useState(true)

  const { signIn, signUp } = useAuth()
  const { loading, error, data } = useContext(AuthenticationContext)

  const handleChangeInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value
    })
  }

  const renderContent = (signInContent: string, signUpContent: string) => {
    return isSignIn ? signInContent : signUpContent
  }

  useEffect(() => {
    if (isSignIn) {
      if (inputs.password && inputs.email) {
        return setDisabled(false)
      }
    } else {
      if (inputs.password && inputs.email && inputs.firstName && inputs.lastName && inputs.phone && inputs.city) {
        return setDisabled(false)
      }
    }

    setDisabled(true)
  }, [inputs])

  const handleClick = () => {
    if (isSignIn) {
      signIn({ email: inputs.email, password: inputs.password }, handleClose)
    } else {
      signUp( inputs, handleClose)
    }
  }

  return (
    <div>
      <button
        className={`${renderContent('bg-blue-400 text-white', '')} border p-1 px-4 rounded mr-3`}
        onClick={handleOpen}
      >
        {renderContent('Sign In', 'Sign Up')}
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {loading ? (
              <div className='h-[250px] flex justify-center items-center'><CircularProgress /></div>
            ) : (
            <div className='p-2'>
              {error ? <Alert severity='error'>{error}</Alert> : null}
              <div className='uppercase font-bold text-center pt-2 pb-2 border-b mb-2'>
                <p className='text-sm'>
                  {renderContent('Sign In', 'Create Account')}
                </p>
              </div>

              <div className='m-auto'>
                <h2 className='text-2xl font-light text-center'>
                  {renderContent('Log Into Your Account', 'Create Your OpenTable Account')}
                </h2>
                <AuthModalInputs inputs={inputs} handleChangeInputs={handleChangeInputs} isSignIn={isSignIn} />
                <button className=' uppercase bg-red-600 w-full text-white p-3 rounded text-sm mb-5 disabled:bg-gray-400'
                  disabled={disabled}
                  onClick={handleClick}
                >
                  {renderContent('Sign In', 'Create Account')}
                </button>
              </div>
            </div>)
          }
        </Box>
      </Modal>
    </div>
  )
}