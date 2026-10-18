import { Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Login from './pages/Login'
import Tienda from './pages/Tienda'
import Dashboard from './pages/Dashboard'
import EditarProducto from './pages/EditarProducto'
import NuestraHistoria from './pages/NuestraHistoria'
import Contactanos from './pages/Contactanos'
import Carrito from './pages/Carrito'
import RutaProtegida from './routes/RutaProtegida'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Tienda />} />
        <Route path="/nuestra-historia" element={<NuestraHistoria />} />
        <Route path="/contactanos" element={<Contactanos />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <RutaProtegida>
              <Dashboard />
            </RutaProtegida>
          }
        />

        <Route
          path="/editar/:id"
          element={
            <RutaProtegida>
              <EditarProducto />
            </RutaProtegida>
          }
        />
      </Routes>
    </AuthProvider>
  )
}
