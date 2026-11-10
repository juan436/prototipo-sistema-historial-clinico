import { createHashRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom'
import Layout, { Aviso } from './components/Layout'
import { Encabezado } from './components/ui'
import Login from './pages/Login'

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
        children: [{ path: '/pacientes', element: <Encabezado titulo="Pacientes" subtitulo="En construcción" /> }],
      },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
