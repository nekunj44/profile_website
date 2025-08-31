import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:5000/api/auth/signup', { email, password })
      alert('Signup successful')
      navigate('/login')
    } catch {
      alert('Signup failed')
    }
  }

  return (
    <div className="container">
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <input 
          placeholder="Email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
        /><br /><br />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
        /><br /><br />
        <button type="submit" className="btn">Signup</button>
      </form>
    </div>
  )
}
