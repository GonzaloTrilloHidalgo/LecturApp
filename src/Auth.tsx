import { useState } from 'react'
import { supabase } from './supabaseClient'
import { User } from '@supabase/supabase-js'  // Importa el tipo User de Supabase
import { useNavigate } from 'react-router-dom' // Importa useNavigate para redireccionar

interface LoginProps {
  setUser: (user: User | null) => void; // setUser debe aceptar un User o null
  setMensaje: (mensaje: string) => void; // setMensaje debe aceptar un string
}

const Login = ({ setUser, setMensaje }: LoginProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
    const navigate = useNavigate() // Usamos useNavigate aquí

  const handleLogin = async (e: { preventDefault: () => void; }) => {
    e.preventDefault()
    setLoading(true)
  
    // Modifica la llamada a signInWithPassword y accede a la respuesta correcta
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
  
    setLoading(false)
  
    if (error) {
      setMensaje(`Error: ${error.message}`)
    } else {
      // Ahora accedes a la propiedad 'user' dentro de 'data'
      setUser(data.user)  // Aquí accedemos a `data.user` en lugar de solo `user`
      //email
      
      setMensaje(`Bienvenido ${data.user?.user_metadata.full_name} !!`) // Asegúrate de que `user_metadata` tenga el campo `full_name`      
      navigate('/');
    }
  }
  
  return (
    <div className="login-form-container">
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleLogin} className="login-form">
        <label className="input-label">
          Correo electrónico
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-field"
          />
        </label>
        <label className="input-label">
          Contraseña
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-field"
          />
        </label>
        <button type="submit" disabled={loading} className="submit-button">
          {loading ? 'Cargando...' : 'Iniciar sesión'}
        </button>
      </form>
    </div>
  )
}

export default Login
