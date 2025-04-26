import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type Libro = {
  estado: string;
  valoracion?: number;
};

interface EstadisticasProps {
  libros: Libro[];
}

const Estadisticas = ({ libros }: EstadisticasProps) => {
  const [estadisticas, setEstadisticas] = useState({
    totalLibros: 0,
    porLeer: 0,
    leyendo: 0,
    leidos: 0,
    valoracionPromedio: 0,
  });

  useEffect(() => {
    // Calculamos las estadísticas
    const totalLibros = libros.length;
    const porLeer = libros.filter(libro => libro.estado === 'por leer').length;
    const leyendo = libros.filter(libro => libro.estado === 'leyendo').length;
    const leidos = libros.filter(libro => libro.estado === 'leído').length;
    const valoracionPromedio =
      libros.filter(libro => libro.estado === 'leído').reduce((sum, libro) => sum + (libro.valoracion || 0), 0) /
      (leidos || 1);
      

    setEstadisticas({
      totalLibros,
      porLeer,
      leyendo,
      leidos,
      valoracionPromedio,
    });
  }, [libros]);

  const data = [
    { name: 'Por leer', value: estadisticas.porLeer, color: '#FFAA00' },
    { name: 'Leyendo', value: estadisticas.leyendo, color: '#00A1FF' },
    { name: 'Leído', value: estadisticas.leidos, color: '#0A9B00' },
  ];

  return (
    <div className="estadisticas-container">
      <div className="estadisticas-card">
        <h3>📊 Estadísticas de Lectura</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={data} dataKey="value" outerRadius={80} fill="#8884d8" label>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Estadisticas;
