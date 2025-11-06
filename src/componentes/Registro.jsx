import { useState } from 'react';
import { useAuth } from "../context/useAuth";
import { useNavigate } from 'react-router-dom'; 

export default function Registro() {
    // 1. Estados
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // NUEVO: Estado para confirmar la contraseña
    const [confirmPassword, setConfirmPassword] = useState(''); 
    const [error, setError] = useState(null); 
    const [loading, setLoading] = useState(false); 

    // 2. Contexto y Navegación
    const { register, loginWithGoogle } = useAuth(); 
    const navigate = useNavigate(); 
    
    // --- Lógica de Manejo de Formulario ---
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); 
        
        // **********************************************
        // VALIDACIÓN CLAVE: Confirmar que las contraseñas coincidan
        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden. Por favor, verifícalas.");
            return; // Detiene el proceso si no coinciden
        }
        // **********************************************
        
        setLoading(true);

        try {
            // Verifica que la contraseña tenga la longitud mínima requerida por Firebase
            if (password.length < 6) {
                setError("La contraseña debe tener al menos 6 caracteres.");
                setLoading(false);
                return;
            }

            await register(email, password); 
            navigate('/'); // Redirige
        } catch (err) {
            // Muestra un error más amigable si es de Firebase (ej: correo ya en uso)
            setError(err.message || "Ocurrió un error en el registro."); 
        } finally {
            setLoading(false);
        }
    };
    
    const handleGoogle = async () => {
        setError(null);
        setLoading(true);

        try {
            await loginWithGoogle(); 
            navigate('/'); 
        } catch (err) {
            setError(err.message || "Error al iniciar sesión con Google.");
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-slate-100">
                <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6">
                    <h1 className="text-2xl font-bold mb-4 text-center">
                        Crear cuenta
                    </h1>

                    {error && (
                        <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
                            {error}
                        </p>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Correo electrónico
                            </label>
                            <input
                                type="email"
                                // ... clases de estilo ...
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="tucorreo@ejemplo.com"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Contraseña
                            </label>
                            <input
                                type="password"
                                // ... clases de estilo ...
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Mínimo 6 caracteres"
                                required 
                                disabled={loading}
                            />
                        </div>
                        
                        {/* NUEVO CAMPO: Confirmar Contraseña */}
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Confirmar Contraseña
                            </label>
                            <input
                                type="password"
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Repite la contraseña"
                                required 
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? 'Registrando...' : 'Registrarse'}
                        </button>
                    </form>

                    <div className="mt-4">
                        <button
                            type="button"
                            onClick={handleGoogle}
                            className="w-full border border-slate-300 hover:bg-slate-50 text-slate-800 font-medium py-2 rounded-lg transition text-sm disabled:opacity-50"
                            disabled={loading}
                        >
                            Continuar con Google
                        </button>
                    </div>
                </div>
            </div> 
        </>
    );
}