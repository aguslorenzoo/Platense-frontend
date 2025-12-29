import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import api from "../../sevices/api"
import './ListaJugadoras.css'


const ListaJugadoras = () => {
    const navigate =  useNavigate()
    const [jugadoras, setJugadoras] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        cargarJugadoras()
    },
    [])

    const cargarJugadoras = async () => {
        try {
            setCargando(true)
            const data = await api.getJugadoras()
            setJugadoras(data)
            setError('')
        }
        catch(error){
            setError('Error al cargar la lista de jugadoras: ', error.message)
            console.error(error)
        }
        finally{
            setCargando(false)
        }
    }

     const jugadorasPorCategoria = jugadoras.reduce((acc, jugadora) => {
        const categoria = jugadora.category || 'Sin categoría';
        if (!acc[categoria]) {
            acc[categoria] = [];
        }
        acc[categoria].push(jugadora);
        return acc;
    }, {});

    // Orden de categorías
    const ordenCategorias = ['u13', 'u15', 'u17', 'u21', 'Sin categoría'];

    // Calcular edad desde fecha de nacimiento
    const calcularEdad = (fechaNacimiento) => {
        const hoy = new Date();
        const nacimiento = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }
        return edad;
    };

    // Estilos para cada categoría
    const estilosCategoria = {
        'u13': { color: '#e63946', bg: '#ffeaea', border: '#ff9999' },
        'u15': { color: '#2a9d8f', bg: '#e8f6f3', border: '#88d3c7' },
        'u17': { color: '#1d3557', bg: '#e8edf5', border: '#a8b5d1' },
        'u21': { color: '#e9c46a', bg: '#fef9e7', border: '#f5d897' },
        'Sin categoría': { color: '#6c757d', bg: '#f8f9fa', border: '#dee2e6' }
    };

    if (cargando) {
        return (
            <div className="cargando-container">
                <div className="spinner"></div>
                <p>Cargando jugadoras...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <h3>❌ Error</h3>
                <p>{error}</p>
                <button onClick={cargarJugadoras} className="btn-reintentar">
                    Reintentar
                </button>
            </div>
        );
    }

    return (
        <div className="lista-categorias-container">
            <header className="lista-header">
                <button onClick={() => navigate('/')} className="btn-volver">
                    ← Volver 
                </button>
                <h1>Lista de Jugadoras por Categoría</h1>
                <p className="total-jugadoras">
                    Total: {jugadoras.length} jugadora{jugadoras.length !== 1 ? 's' : ''}
                </p>
            </header>

            {jugadoras.length === 0 ? (
                <div className="sin-jugadoras">
                    <h3>No hay jugadoras registradas aún</h3>
                    <p>Regresa al inicio para agregar jugadoras</p>
                    <button onClick={() => navigate('/')} className="btn-agregar">
                        Agregar Jugadora
                    </button>
                </div>
            ) : (
                <div className="categorias-grid">
                    {ordenCategorias.map(categoria => {
                        const jugadorasCategoria = jugadorasPorCategoria[categoria] || [];
                        const estilo = estilosCategoria[categoria] || estilosCategoria['Sin categoría'];
                        
                        if (jugadorasCategoria.length === 0) return null;

                        return (
                            <div 
                                key={categoria} 
                                className="categoria-card"
                                style={{ 
                                    borderColor: estilo.border,
                                    backgroundColor: estilo.bg 
                                }}
                            >
                                <div className="categoria-header" style={{ color: estilo.color }}>
                                    <h2>
                                        {categoria.toUpperCase()}
                                        <span className="contador"> ({jugadorasCategoria.length})</span>
                                    </h2>
                                </div>
                                
                                <div className="jugadoras-list">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Nombre</th>
                                                <th>Apellido</th>
                                                <th>DNI</th>
                                                <th>Edad</th>
                                                <th>Club</th>
                                                <th>Contacto</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {jugadorasCategoria.map(jugadora => (
                                                <tr key={jugadora._id}>
                                                    <td>{jugadora.name}</td>
                                                    <td>{jugadora.last_name}</td>
                                                    <td>{jugadora.dni}</td>
                                                    <td>{calcularEdad(jugadora.birth_date)} años</td>
                                                    <td>{jugadora.club || 'N/A'}</td>
                                                    <td>
                                                        <div>{jugadora.contact_name}</div>
                                                        <small>{jugadora.contact_phone}</small>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <footer className="lista-footer">
                <p>Actualizado: {new Date().toLocaleDateString()}</p>
                <button onClick={cargarJugadoras} className="btn-actualizar">
                    Actualizar Lista
                </button>
            </footer>
        </div>
    );
};

export default ListaJugadoras

