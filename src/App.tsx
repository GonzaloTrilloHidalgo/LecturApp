import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom'
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
  const [nuevoLibro, setNuevoLibro] = useState({ titulo: '', autor: '', estado: 'por leer', notas: '', valoracion: 0 })

  const agregarLibro = async () => {
    if (!nuevoLibro.titulo || !nuevoLibro.autor) {
      alert('Por favor completa el título y autor')
      return
    }

    const { error } = await supabase.from('libros').insert([nuevoLibro])
    if (error) {
      console.error('Error al insertar:', error)
    } else {
      setNuevoLibro({ titulo: '', autor: '', estado: 'por leer', notas: '', valoracion: 0 })
      onLibroAgregado()
    }
  }

  return (
    <div className="container-form">
      <h1 className="title-form">✨ Nuevo libro</h1>
      <form className="form-card" onSubmit={e => { e.preventDefault(); agregarLibro(); }}>
        <label className="form-group">
          <span className="form-label">Título</span>
          <input
            className="form-input"
            placeholder="Ingresa el título"
            value={nuevoLibro.titulo}
            onChange={e => setNuevoLibro({ ...nuevoLibro, titulo: e.target.value })}
            required
          />
        </label>
        <label className="form-group">
          <span className="form-label">Autor</span>
          <input
            className="form-input"
            placeholder="Nombre del autor"
            value={nuevoLibro.autor}
            onChange={e => setNuevoLibro({ ...nuevoLibro, autor: e.target.value })}
            required
          />
        </label>
        <label className="form-group">
          <span className="form-label">Estado</span>
          <select
            className="form-select"
            value={nuevoLibro.estado}
            onChange={e => setNuevoLibro({ ...nuevoLibro, estado: e.target.value })}
          >
            <option value="por leer">Por leer</option>
            <option value="leyendo">Leyendo</option>
            <option value="leído">Leído</option>
          </select>
        </label>
        <label className="form-group full-width">
          <span className="form-label">Notas</span>
          <textarea
            className="form-textarea"
            placeholder="Comentarios, citas, reflexiones..."
            value={nuevoLibro.notas}
            onChange={e => setNuevoLibro({ ...nuevoLibro, notas: e.target.value })}
            rows={4}
          />
        </label>
        <div className="form-actions">
          <button type="submit" className="button">Añadir libro</button>
        </div>
      </form>
    </div>

  )
}

function ListaLibros() {
  const [libros, setLibros] = useState<Libro[]>([])
  const [libroEditando, setLibroEditando] = useState<Libro | null>(null)
  const [libroAEliminar, setLibroAEliminar] = useState<Libro | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');

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

    // Actualizamos el estado de los libros completos, no solo los filtrados
    const librosActualizados = libros.map((libro) =>
      libro.id === id ? { ...libro, valoracion: valor } : libro
    )
    setLibros(librosActualizados)
  }

  // Lógica de filtrado general (aplica a todos los libros)
  const librosFiltrados = libros.filter(libro => {
    const coincideBusqueda =
      libro.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      libro.autor.toLowerCase().includes(busqueda.toLowerCase());

    const coincideEstado =
      filtroEstado === 'todos' || libro.estado === filtroEstado;

    return coincideBusqueda && coincideEstado;
  });

  // Dividir los libros filtrados en dos categorías
  const librosPorLeerYLeyendo = librosFiltrados.filter(libro => libro.estado === 'por leer' || libro.estado === 'leyendo');
  const librosLeidos = librosFiltrados.filter(libro => libro.estado === 'leído');

  return (

    <div className="container">
      <h1 className="title">📚 Mis Libros</h1>

      <div className="filtros-wrapper">
        <input
          type="text"
          className="input filtro-busqueda"
          placeholder="Buscar por título o autor..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <div className="filtros-estado">
          <button
            className={`filtro-btn ${filtroEstado === 'todos' ? 'activo' : ''}`}
            onClick={() => setFiltroEstado('todos')}
          >
            Todos
          </button>
          <button
            className={`filtro-btn ${filtroEstado === 'por leer' ? 'activo' : ''}`}
            onClick={() => setFiltroEstado('por leer')}
          >
            Por leer
          </button>
          <button
            className={`filtro-btn ${filtroEstado === 'leyendo' ? 'activo' : ''}`}
            onClick={() => setFiltroEstado('leyendo')}
          >
            Leyendo
          </button>
          <button
            className={`filtro-btn ${filtroEstado === 'leído' ? 'activo' : ''}`}
            onClick={() => setFiltroEstado('leído')}
          >
            Leído
          </button>
        </div>
      </div>

      <div className="lists-wrapper">
        <div className="list-section">
          <h2>📖 Por leer / Leyendo</h2>
          <ul className="book-list">

            {librosPorLeerYLeyendo.length > 0 ? (
              librosPorLeerYLeyendo.map(libro => (
                <li key={libro.id} className={`book-item ${libro.estado}`}>
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
                    <button className="btn eliminar" onClick={() => setLibroAEliminar(libro)}>❌ Eliminar</button>
                    <button className="btn editar" onClick={() => setLibroEditando(libro)}>✏️ Editar</button>
                  </div>
                </li>
              ))
            ) : (
              <p>No se encontraron libros.</p>
            )}
          </ul>
        </div>

        <div className="list-section">
          <h2>✅ Leídos</h2>
          <ul className="book-list">
            {librosLeidos.length > 0 ? (
              librosLeidos.map(libro => (
                <li key={libro.id} className={`book-item ${libro.estado}`}>
                  <div className="book-details">
                    <h3>{libro.titulo}</h3>
                    <div className="autor">{libro.autor}</div>
                    <StarRating
                      value={libro.valoracion || 0}
                      onChange={(valor) => actualizarValoracion(libro.id, valor)}
                    />
                    <div className="estado">{libro.estado}</div>

                    <div className="fechas">
                      <div>📅 Inicio: {libro.fecha_inicio || 'No especificada'}</div>
                      <div>✅ Fin: {libro.fecha_fin || 'No especificada'}</div>
                    </div>

                    <div className="notas">📝 {libro.notas || 'Sin notas'}</div>
                  </div>

                  <div className="book-actions">
                    <button className="btn eliminar" onClick={() => setLibroAEliminar(libro)}>❌ Eliminar</button>
                    <button className="btn editar" onClick={() => setLibroEditando(libro)}>✏️ Editar</button>
                  </div>
                </li>
              ))
            ) : (
              <p>No se encontraron libros.</p>
            )}
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

      {libroAEliminar && (
        <Modal onClose={() => setLibroAEliminar(null)}>
          <h2 className="title">❗ Confirmar eliminación</h2>
          <p>¿Estás seguro de que quieres eliminar <strong>{libroAEliminar.titulo}</strong>?</p>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
            <button className="button cancel" onClick={() => setLibroAEliminar(null)}>Cancelar</button>
            <button
              className="button eliminar"
              onClick={() => {
                eliminarLibro(libroAEliminar.id);
                setLibroAEliminar(null);
              }}
            >
              Eliminar
            </button>
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
        <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          ➕ Añadir libro
        </NavLink>
        <NavLink to="/libros" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          📚 Ver lista
        </NavLink>
      </nav>


      <Routes>
        <Route path="/" element={<Formulario onLibroAgregado={() => { }} />} />
        <Route path="/libros" element={<ListaLibros />} />
      </Routes>
    </Router>
  )
}

export default App
