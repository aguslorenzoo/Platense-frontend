import React from "react"
import FormJugadoras from "../../components/FormJugadoras/FormJugadoras"
import api from "../../sevices/api";
import { Link } from "react-router";
import './HomeScreen.css'

const HomeScreen = () => {
    const handleJugadoraAgregada = async (jugadoraData) => {
        try {
            await api.crearJugadora(jugadoraData);
            // El éxito se maneja en el componente FormJugadoras
        } catch (error) {
            throw new Error(error.message || 'Error al crear la jugadora');
        }
    };

    return (
        <div className="App">
            <header>
                <div className="btn-container">
                    <nav>
                        <Link to="/lista" className="nav-link">Ver Lista</Link>
                    </nav>
                </div>
            </header>
            
            <main>
                <FormJugadoras onJugadoraAgregada={handleJugadoraAgregada} />
            </main>
        </div>
    )
}

export default HomeScreen 