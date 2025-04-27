import { useState } from 'react';
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom';
import './register.css'; // Asegúrate de importar los estilos CSS

const Register = ({ setUser, setMensaje }: { setUser: (user: any) => void; setMensaje: (message: string) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Usamos useNavigate aquí

  const handleRegister = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setLoading(true);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    setLoading(false);

    if (error) {
      setMensaje(`Error: ${error.message}`);
    } else {
      setUser(data.user);
      setMensaje('Registro exitoso');
      navigate('/'); // Redirigir al inicio después de registrarse
    }
  };

  return (
    <div className="register-form-container">
      <h2>Registro</h2>
      <form onSubmit={handleRegister} className="register-form">
        <label className="input-label">
          Correo electrónico:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-field"
          />
        </label>
        <label className="input-label">
          Contraseña:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-field"
          />
        </label>
        <button type="submit" disabled={loading} className="submit-button">
          {loading ? 'Cargando...' : 'Registrarse'}
        </button>
      </form>
    </div>
  );
};

export default Register;
