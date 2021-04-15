import React, { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'


const Login = ({ setToken, show, setPage }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [login, result] = useMutation(LOGIN)

  useEffect(() => {
    if(result.data) {
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('user-token', token)
    }
  }, [result.data])
  
  if (!show) {
    return null
  }

  const handleLogin = (e) => {
    e.preventDefault()

    login({ variables: { username, password } })
    setPage('authors')
  }

  return (
    <div>
      <form onSubmit={handleLogin}>
        <div>
          <label>
            username
            <input type="text" value={username} onChange={({ target }) => setUsername(target.value)} />
          </label>
        </div>
        <div>
          <label>
            password
            <input type="password" value={password} onChange={({ target }) => setPassword(target.value)} />
          </label>
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default Login