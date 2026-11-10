import { createHashRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom'
import Layout, { Aviso, Protegida } from './components/Layout'
import { Encabezado } from './components/ui'
import FichaPaciente from './pages/FichaPaciente'
import Historia from './historia/Historia'
import Login from './pages/Login'
import NuevoPaciente from './pages/NuevoPaciente'
import Pacientes from './pages/Pacientes'
import { useTienda } from './store'

function Raiz() {
  return (
    <>
      <Outlet />
      <Aviso />
    </>
  )
}

/** Marcador temporal mientras se construyen las pantallas por etapas. */
function EnConstruccion({ titulo }: { titulo: string }) {
  const { usuario, pacientesVisibles, historiasVisibles } = useTienda()
  return (
    <>
      <Encabezado titulo={titulo} subtitulo="Pantalla en construcción" />
      <p className="text-sm text-slate-600">
        Sesión: {usuario?.nombre}. Pacientes visibles: {pacientesVisibles.length}. Historias visibles: {historiasVisibles.length}.
      </p>
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
              { path: '/perfil', element: <EnConstruccion titulo="Mi perfil y membrete" /> },
            ],
          },
          {
            element: <Protegida rol="admin" />,
            children: [
              { path: '/usuarios', element: <EnConstruccion titulo="Usuarios" /> },
              { path: '/catalogo', element: <EnConstruccion titulo="Catálogo de medicamentos" /> },
            ],
          },
        ],
      },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
