import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import Modal from './Modal'

// Tipos
type Libro = {
  id: string
  titulo: string
  autor: string
  estado: string
  notas?: string
}

function Formulario({
  onLibroAgregado,
}: {
  onLibroAgregado: () => void
}) {
  const [nuevoLibro, setNuevoLibro] = useState({ titulo: '', autor: '', estado: 'por leer', notas: '' })

  const agregarLibro = async () => {
    if (!nuevoLibro.titulo || !nuevoLibro.autor) {
      alert('Por favor completa el título y autor')
      return
    }

    const { error } = await supabase.from('libros').insert([nuevoLibro])
    if (error) {
      console.error('Error al insertar:', error)
    } else {
      setNuevoLibro({ titulo: '', autor: '', estado: 'por leer', notas: '' })
      onLibroAgregado()
    }
  }

  return (
    <div className="container">
      <h1 className="title">📖 Añadir Libro</h1>
      <div className="form">
        <input
          className="input"
          placeholder="Título"
          value={nuevoLibro.titulo}
          onChange={e => setNuevoLibro({ ...nuevoLibro, titulo: e.target.value })}
        />
        <input
          className="input"
          placeholder="Autor"
          value={nuevoLibro.autor}
          onChange={e => setNuevoLibro({ ...nuevoLibro, autor: e.target.value })}
        />
        <select
          className="select"
          value={nuevoLibro.estado}
          onChange={e => setNuevoLibro({ ...nuevoLibro, estado: e.target.value })}
        >
          <option value="por leer">Por leer</option>
          <option value="leyendo">Leyendo</option>
          <option value="leído">Leído</option>
        </select>
        <textarea
          className="input"
          placeholder="Notas"
          value={nuevoLibro.notas}
          onChange={e => setNuevoLibro({ ...nuevoLibro, notas: e.target.value })}
        />
        <button onClick={agregarLibro}>Añadir libro</button>
      </div>
    </div>
  )
}

function ListaLibros() {
  const [libros, setLibros] = useState<Libro[]>([])
  const [libroEditando, setLibroEditando] = useState<Libro | null>(null)

  useEffect(() => {
    obtenerLibros()
  }, [])

  const obtenerLibros = async () => {
    const { data, error } = await supabase.from('libros').select('*').order('created_at', { ascending: false })
    if (data) setLibros(data)
    if (error) console.error('Error al obtener libros:', error)
  }

  const eliminarLibro = async (id: string) => {
    const { error } = await supabase.from('libros').delete().eq('id', id)
    if (!error) obtenerLibros()
  }

  const actualizarLibro = async () => {
    if (!libroEditando) return
    const { error } = await supabase
      .from('libros')
      .update(libroEditando)
      .eq('id', libroEditando.id)

    if (error) {
      console.error('Error al actualizar:', error)
    } else {
      setLibroEditando(null)
      obtenerLibros()
    }
  }

  return (
    <div className="container">
      <h1 className="title">📚 Mis Libros</h1>

      <ul className="book-list">
        {libros.map(libro => (
          <li key={libro.id} className="book-item">
            <div className="book-details">
              <strong>{libro.titulo}</strong> - {libro.autor} ({libro.estado})
              {libro.notas && <p>{libro.notas}</p>}
            </div>
            <div className="book-actions">
              <button onClick={() => eliminarLibro(libro.id)}>❌</button>
              <button onClick={() => setLibroEditando(libro)}>✏️</button>
            </div>
          </li>
        ))}
      </ul>

      {libroEditando && (
        <Modal onClose={() => setLibroEditando(null)}>
          <h2 className="title">✏️ Editar Libro</h2>
          <div className="form">
            <label className="label">
              Título
              <input
                className="input"
                value={libroEditando.titulo}
                onChange={e => setLibroEditando({ ...libroEditando, titulo: e.target.value })}
              />
            </label>

            <label className="label">
              Autor
              <input
                className="input"
                value={libroEditando.autor}
                onChange={e => setLibroEditando({ ...libroEditando, autor: e.target.value })}
              />
            </label>

            <label className="label">
              Estado
              <select
                className="select"
                value={libroEditando.estado}
                onChange={e => setLibroEditando({ ...libroEditando, estado: e.target.value })}
              >
                <option value="por leer">Por leer</option>
                <option value="leyendo">Leyendo</option>
                <option value="leído">Leído</option>
              </select>
            </label>

            <label className="label">
              Notas
              <textarea
                className="input"
                placeholder="Notas"
                value={libroEditando.notas || ''}
                onChange={e => setLibroEditando({ ...libroEditando, notas: e.target.value })}
              />
            </label>

            <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
              <button className="button" onClick={actualizarLibro}>Guardar cambios</button>
              <button className="button cancel" onClick={() => setLibroEditando(null)}>Cancelar</button>
            </div>
          </div>
        </Modal>

      )}
    </div>
  )
}

function App() {
  return (
    <Router>
      <nav className="nav">
        <Link to="/" className="nav-link">➕ Añadir libro</Link>
        <Link to="/libros" className="nav-link">📚 Ver lista</Link>
      </nav>


      <Routes>
        <Route path="/" element={<Formulario onLibroAgregado={() => { }} />} />
        <Route path="/libros" element={<ListaLibros />} />
      </Routes>
    </Router>
  )
}

export default App
