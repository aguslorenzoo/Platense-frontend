import { useEffect, useState } from "react"
import './FormJugadoras.css'

const FormJugadoras = ({onJugadoraAgregada}) => {

    const [form, setForm] = useState({
        name: '',
        last_name: '',
        dni: '',
        birth_date: '',
        category: '',
        club: '',
        contact_name: '',
        contact_phone: ''
    })

    const [errores, setErrores] = useState([])
    const [enviado, setEnviado] = useState(false)
        const [categoriaCalculada, setCategoriaCalculada] = useState('');

    // Función para calcular categoría según fecha de nacimiento
    const calcularCategoria = (fechaNacimiento) => {
        if (!fechaNacimiento) return '';
        
        const nacimiento = new Date(fechaNacimiento);
        const añoNacimiento = nacimiento.getFullYear();
        const añoActual = new Date().getFullYear();
        const edad = añoActual - añoNacimiento;

        // Ajustar si aún no cumplió años este año
        const hoy = new Date();
        const mesActual = hoy.getMonth() + 1; // Enero = 1
        const diaActual = hoy.getDate();
        const mesNacimiento = nacimiento.getMonth() + 1;
        const diaNacimiento = nacimiento.getDate();

        let edadReal = edad;
        if (mesActual < mesNacimiento || (mesActual === mesNacimiento && diaActual < diaNacimiento)) {
            edadReal = edad - 1;
        }

        // Calcular categoría según tu especificación
        if (añoNacimiento === 2014 || añoNacimiento === 2013) {
            return 'u13';
        } else if (añoNacimiento === 2012 || añoNacimiento === 2011) {
            return 'u15';
        } else if (añoNacimiento === 2010 || añoNacimiento === 2009) {
            return 'u17';
        } else if (añoNacimiento >= 2005 && añoNacimiento <= 2008) {
            return 'u21';
        } else if (edadReal < 9) {
            return 'Infantil (menor a 9 años)';
        } else if (edadReal > 21) {
            return 'Mayores (mayor a 21 años)';
        } else {
            return 'Categoría no definida';
        }
    };

    // Efecto para calcular categoría cuando cambia la fecha
    useEffect(() => {
        if (form.birth_date) {
            const categoria = calcularCategoria(form.birth_date);
            setCategoriaCalculada(categoria);
            
            // Actualizar el campo category en el form
            setForm(prev => ({
                ...prev,
                category: categoria
            }));
        } else {
            setCategoriaCalculada('');
            setForm(prev => ({
                ...prev,
                category: ''
            }));
        }
    }, [form.birth_date]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
            })
        )
    }

    if (errores.length > 0) {
        setErrores([])
    }

    const validarFormulario = () => {
        const nuevosErrores = [];

        if (!form.name.trim()) nuevosErrores.push('El nombre es requerido');
        if (!form.last_name.trim()) nuevosErrores.push('El apellido es requerido');
        if (!form.dni) nuevosErrores.push('El DNI es requerido');
        if (form.dni && (form.dni < 1000000 || form.dni > 99999999)) {
            nuevosErrores.push('El DNI debe tener entre 7 y 8 dígitos');
        }
        if (!form.birth_date) nuevosErrores.push('La fecha de nacimiento es requerida');
        if (!form.contact_name.trim()) nuevosErrores.push('El nombre del contacto es requerido');
        if (!form.contact_phone.trim()) nuevosErrores.push('El teléfono de contacto es requerido');

        return nuevosErrores;
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        const nuevosErrores = validarFormulario()
        if (nuevosErrores.length > 0) {
            setErrores(nuevosErrores)
            return
        }

        setEnviado(true)

        try {
            // Llamar a la función del padre (App.jsx) que manejará la creación
            await onJugadoraAgregada(form)
            
            // Limpiar formulario si fue exitoso
            setForm({
                name: '',
                last_name: '',
                dni: '',
                birth_date: '',
                category: '',
                club: '',
                contact_name: '',
                contact_phone: ''
            });
            
            setErrores([]);
            
        } catch (error) {
            setErrores([error.message || 'Error al crear la jugadora']);
        } finally {
            setEnviado(false);
        }
    };
    return(
        <div className="container">
            <h1 className="title">Agrega una Jugadora</h1>
            {errores.length > 0 && (
                <div className="errores-container">
                    <h3>⚠️ Errores:</h3>
                    <ul>
                        {errores.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}
            <div className="form-container">
                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Nombre</label>
                        <input 
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        disabled={enviado} />
                    </div>

                    <div className="form-group">
                        <label>Apellido</label>
                        <input 
                        type="text"
                        name="last_name"
                        value={form.last_name}
                        onChange={handleChange}
                        disabled={enviado} />
                    </div>  

                    <div className="form-group">
                        <label>DNI</label>
                        <input 
                        type="number"
                        name="dni"
                        value={form.dni}
                        onChange={handleChange}
                        disabled={enviado} />
                    </div>  

                    <div className="form-group">
                        <label>Fecha de Nacimiento</label>
                        <input 
                            type="date" 
                            name="birth_date"
                            value={form.birth_date}
                            onChange={handleChange}
                            max={new Date().toISOString().split('T')[0]}
                            disabled={enviado}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Categoría</label>
                            <div className="categoria-display">
                                <input 
                                    type="text" 
                                    value={categoriaCalculada || 'Ingresa fecha para calcular'}
                                    readOnly
                                    className="categoria-input"
                                />

                            </div>
                        </div>
                    </div>
                    

                    <div className="form-group">
                        <label>Club de origen</label>
                        <input 
                        type="text"
                        name="club"
                        value={form.club}
                        onChange={handleChange}
                        disabled={enviado} />
                    </div>  

                    <div className="form-group">
                        <label>Contacto (nombre)</label>
                        <input 
                        type="text"
                        name="contact_name"
                        value={form.contact_name}
                        onChange={handleChange}
                        disabled={enviado} />
                    </div>  

                    <div className="form-group">
                        <label>Telefono de contacto</label>
                        <input 
                        type="number"
                        name="contact_phone"
                        value={form.contact_phone}
                        onChange={handleChange}
                        disabled={enviado} />
                    </div>  

                    <div className="button-container">
                        <button 
                            type="submit" 
                            className="btn-agregar"
                            disabled={enviado}
                        >
                            {enviado ? 'Enviando...' : 'Agregar Jugadora'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default FormJugadoras