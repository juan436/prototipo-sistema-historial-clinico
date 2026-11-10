import { createHashRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom'
import Layout, { Aviso, Protegida } from './components/Layout'
import Catalogo from './pages/Catalogo'
import FichaPaciente from './pages/FichaPaciente'
import Historia from './historia/Historia'
import Imprimir from './impresion/Imprimir'
import Login from './pages/Login'
import NuevoPaciente from './pages/NuevoPaciente'
import Pacientes from './pages/Pacientes'
import Perfil from './pages/Perfil'
import Usuarios from './pages/Usuarios'

function Raiz() {
  return (
    <>
      <Outlet />
      <Aviso />
    </>
  )
}

const router = createHashRouter([
  {
    element: <Raiz />,
    children: [
      { path: '/', element: <Login /> },
      {
        element: <Layout />,
        children: [
          { path: '/pacientes', element: <Pacientes /> },
          { path: '/pacientes/:id', element: <FichaPaciente /> },
          { path: '/pacientes/:pacienteId/historias/:historiaId', element: <Historia /> },
          {
            element: <Protegida rol="medico" />,
            children: [
              { path: '/pacientes/nuevo', element: <NuevoPaciente /> },
              { path: '/perfil', element: <Perfil /> },
            ],
          },
          {
            element: <Protegida rol="admin" />,
            children: [
              { path: '/usuarios', element: <Usuarios /> },
              { path: '/catalogo', element: <Catalogo /> },
            ],
          },
        ],
      },
      { path: '/historias/:historiaId/imprimir/:documento', element: <Imprimir /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
