import { NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom'
import { NOMBRE_SISTEMA } from '../data/opciones'
import { useTienda } from '../store'
import type { Rol } from '../types'
import { cx, Logo } from './ui'

// Menús por rol (doc. 01, sección 3).
const MENUS: Record<Rol, { a: string; texto: string }[]> = {
  medico: [
    { a: '/pacientes', texto: 'Mis pacientes' },
    { a: '/perfil', texto: 'Mi perfil y membrete' },
  ],
  admin: [
    { a: '/pacientes', texto: 'Pacientes' },
    { a: '/usuarios', texto: 'Usuarios' },
    { a: '/catalogo', texto: 'Catálogo de medicamentos' },
  ],
}

export function Aviso() {
  const { aviso } = useTienda()
  if (!aviso) return null
  return (
    <div role="status" className="no-imprimir fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-lg">
      ✓ {aviso}
    </div>
  )
}

/** Exige sesión iniciada y, si se indica, un rol concreto. */
export function Protegida({ rol }: { rol?: Rol }) {
  const { usuario } = useTienda()
  if (!usuario) return <Navigate to="/" replace />
  if (rol && usuario.rol !== rol) return <Navigate to="/pacientes" replace />
  return <Outlet />
}

export default function Layout() {
  const { usuario, salir } = useTienda()
  const navegar = useNavigate()
  if (!usuario) return <Navigate to="/" replace />

  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col border-r border-slate-200 bg-white">
        <div className="flex items-center gap-2.5 border-b border-slate-200 px-4 py-4">
          <Logo />
          <span className="text-[15px] leading-tight font-semibold text-slate-900">{NOMBRE_SISTEMA}</span>
        </div>
        <nav className="flex-1 space-y-1 p-3" aria-label="Menú principal">
          {MENUS[usuario.rol].map((m) => (
            <NavLink
              key={m.a}
              to={m.a}
              className={({ isActive }) =>
                cx(
                  'block rounded-md px-3 py-2 text-[15px] font-medium transition',
                  isActive ? 'bg-accion-50 text-accion-800' : 'text-slate-700 hover:bg-slate-100',
                )
              }
            >
              {m.texto}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-slate-200 p-4">
          <p className="text-sm font-semibold text-slate-900">{usuario.nombre}</p>
          <p className="text-xs text-slate-500">{usuario.rol === 'admin' ? 'Admin' : 'Médico'}</p>
          <button
            type="button"
            className="mt-2 text-sm font-medium text-accion-700 underline-offset-2 hover:underline"
            onClick={() => {
              navegar('/')
              salir()
            }}
          >
            Cambiar de usuario
          </button>
        </div>
      </aside>
      <main className="min-w-0 flex-1 px-8 py-6">
        <div className="mx-auto max-w-[1280px]">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
