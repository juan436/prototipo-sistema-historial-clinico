import { Navigate, useNavigate } from 'react-router-dom'
import { Insignia, Logo } from '../components/ui'
import { NOMBRE_SISTEMA } from '../data/opciones'
import { useTienda } from '../store'

export default function Login() {
  const { usuarios, usuario, entrar, restablecer, avisar } = useTienda()
  const navegar = useNavigate()
  if (usuario) return <Navigate to="/pacientes" replace />

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-slate-200 p-6">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-lg">
        <div className="flex flex-col items-center text-center">
          <Logo className="h-16 w-16" />
          <h1 className="mt-3 text-2xl font-semibold text-slate-900">{NOMBRE_SISTEMA}</h1>
          <p className="mt-1 text-sm text-slate-500">Prototipo: sin autenticación real</p>
        </div>

        <div className="mt-7 space-y-2.5">
          {usuarios
            .filter((u) => u.activo)
            .map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => {
                  entrar(u.id)
                  navegar('/pacientes')
                }}
                className="flex w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-4 py-3 text-left shadow-xs transition hover:border-accion-500 hover:bg-accion-50 focus-visible:ring-2 focus-visible:ring-accion-200 focus-visible:outline-none"
              >
                <span>
                  <span className="block text-xs text-slate-500">Entrar como</span>
                  <span className="block text-base font-semibold text-slate-900">{u.nombre}</span>
                </span>
                <Insignia tono={u.rol === 'admin' ? 'gris' : 'azul'}>{u.rol === 'admin' ? 'Admin' : 'Médico'}</Insignia>
              </button>
            ))}
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          Todos los datos que se muestran son inventados. Lo capturado se guarda solo en este navegador.
        </p>
        <div className="mt-2 text-center">
          <button
            type="button"
            className="text-xs font-medium text-accion-700 underline-offset-2 hover:underline"
            onClick={() => {
              restablecer()
              avisar('Datos de ejemplo restablecidos')
            }}
          >
            Restablecer datos de ejemplo
          </button>
        </div>
      </div>
    </div>
  )
}
