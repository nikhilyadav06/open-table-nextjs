import axios from 'axios'
import { getCookie } from 'cookies-next'
import { useContext } from 'react'
import { AuthenticationContext } from '../app/context/AuthContext'

const useAuth = () => {
  const { data, error, loading, setAuthState } = useContext(AuthenticationContext)

  const signIn = async ({ email, password } : { email: string, password: string }, handleClose: () => void) => {
    setAuthState({
      data: null,
      error: null,
      loading: true
    })

    try {
      const response = await axios.post('http://localhost:3000/api/auth/signin', {
        email,
        password
      })

      setAuthState({
        data: response.data,
        error: null,
        loading: false
      })

      handleClose()
    } catch (error: any) {
      setAuthState({
        data: null,
        error: error.response.data.errorMessage,
        loading: false
      })
    }
  }
  
  const signUp = async ({ email, password, firstName, lastName, phone, city } : { email: string, password: string, firstName: string, lastName: string, phone: string, city: string }, handleClose: () => void) => {
    setAuthState({
      data: null,
      error: null,
      loading: true
    })

    try {
      const response = await axios.post('http://localhost:3000/api/auth/signup', {
        email,
        password,
        firstName,
        lastName,
        city,
        phone
      })

      setAuthState({
        data: response.data,
        error: null,
        loading: false
      })

      handleClose()
    } catch (error: any) {
      setAuthState({
        data: null,
        error: error.response.data.errorMessage,
        loading: false
      })
    }
  }

  return {
    signIn,
    signUp,
  }
}

export default useAuth