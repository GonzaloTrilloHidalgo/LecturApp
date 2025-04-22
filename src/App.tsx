import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import Modal from './Modal'
import StarRating from './StarRating'

// Tipos
type Libro = {
  id: string
  titulo: string
  autor: string
  estado: string
  notas?: string
  fecha_inicio?: string | null
  fecha_fin?: string | null
  valoracion?: number
}

function Formulario({
  onLibroAgregado,
}: {
  onLibroAgregado: () => void
}) {
  const [nuevoLibro, setNuevoLibro] = useState({ titulo: '', autor: '', estado: 'por leer', notas: '', fecha_inicio: '', fecha_fin: '', valoracion: 0 })

  const agregarLibro = async () => {
    if (!nuevoLibro.titulo || !nuevoLibro.autor) {
      alert('Por favor completa el título y autor')
      return
    }

    const { error } = await supabase.from('libros').insert([nuevoLibro])
    if (error) {
      console.error('Error al insertar:', error)
    } else {
      setNuevoLibro({ titulo: '', autor: '', estado: 'por leer', notas: '', fecha_inicio: '', fecha_fin: '', valoracion: 0 })
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
        <label className="label">
          Fecha de inicio
          <input
            type="date"
            className="input"
            value={nuevoLibro.fecha_inicio}
            onChange={e => setNuevoLibro({ ...nuevoLibro, fecha_inicio: e.target.value })}
          />
        </label>

        <label className="label">
          Fecha de finalización
          <input
            type="date"
            className="input"
            value={nuevoLibro.fecha_fin}
            onChange={e => setNuevoLibro({ ...nuevoLibro, fecha_fin: e.target.value })}
          />
        </label>
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

  const actualizarValoracion = async (id: string, valor: number) => {
    const { error } = await supabase
      .from('libros')
      .update({ valoracion: valor })
      .eq('id', id)

    if (error) {
      console.error('Error al actualizar valoración:', error)
      return
    }

    const librosActualizados = libros.map((libro) =>
      libro.id === id ? { ...libro, valoracion: valor } : libro
    )
    setLibros(librosActualizados)
  }


  const librosPorLeer = libros.filter(l => l.estado === 'por leer' || l.estado === 'leyendo')
  const librosLeidos = libros.filter(l => l.estado === 'leído')

  return (
    <div className="container">
      <h1 className="title">📚 Mis Libros</h1>

      <div className="lists-wrapper">
        <div className="list-section">
          <h2>📖 Por leer / Leyendo</h2>
          <ul className="book-list">
            {librosPorLeer.map(libro => (
              <li key={libro.id} className="book-item">
                <div className="book-details">
                  <h3>{libro.titulo}</h3>
                  <div className="autor">{libro.autor}</div>
                  <div className="estado">{libro.estado}</div>


                  <div className="fechas">
                    <div>📅 Inicio: {libro.fecha_inicio || 'No especificada'}</div>
                    <div>✅ Fin: {libro.fecha_fin || 'No especificada'}</div>
                  </div>


                  <div className="notas">📝 {libro.notas || 'Sin notas'}</div>
                </div>

                <div className="book-actions">
                  <button className="btn eliminar" onClick={() => eliminarLibro(libro.id)}>❌ Eliminar</button>
                  <button className="btn editar" onClick={() => setLibroEditando(libro)}>✏️ Editar</button>
                </div>

              </li>
            ))}
          </ul>
        </div>

        <div className="list-section">
          <h2>✅ Leídos</h2>
          <ul className="book-list">
            {librosLeidos.map(libro => (
              <li key={libro.id} className="book-item">
                <div className="book-details">
                  <h3>{libro.titulo}</h3>
                  <div className="autor">{libro.autor}</div>
                  <StarRating
                    value={libro.valoracion ?? 0}
                    onChange={(valor: number) => actualizarValoracion(libro.id, valor)}
                  />
                  <div className="estado">{libro.estado}</div>

                  <div className="fechas">
                    <div>📅 Inicio: {libro.fecha_inicio || 'No especificada'}</div>
                    <div>✅ Fin: {libro.fecha_fin || 'No especificada'}</div>
                  </div>


                  <div className="notas">📝 {libro.notas || 'Sin notas'}</div>
                </div>
                <div className="book-actions">
                  <button className="btn eliminar" onClick={() => eliminarLibro(libro.id)}>❌ Eliminar</button>
                  <button className="btn editar" onClick={() => setLibroEditando(libro)}>✏️ Editar</button>
                </div>

              </li>
            ))}
          </ul>
        </div>
      </div>

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
            <label className="label">
              Fecha de inicio
              <input
                type="date"
                className="input"
                value={libroEditando.fecha_inicio || ''}
                onChange={e => setLibroEditando({ ...libroEditando, fecha_inicio: e.target.value })}
              />
            </label>

            <label className="label">
              Fecha de finalización
              <input
                type="date"
                className="input"
                value={libroEditando.fecha_fin || ''}
                onChange={e => setLibroEditando({ ...libroEditando, fecha_fin: e.target.value })}
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
