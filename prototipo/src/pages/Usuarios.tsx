import { useState } from 'react'
import { Boton, Campo, Casilla, Encabezado, Insignia, Modal, Opciones, Tarjeta, Texto } from '../components/ui'
import { useTienda } from '../store'
import type { Usuario } from '../types'
import { nuevoId } from '../utils'

const ROLES = { Admin: 'admin', Médico: 'medico' } as const
const etiquetaRol = (u: Usuario) => (u.rol === 'admin' ? 'Admin' : 'Médico')

/** 5.9 Usuarios (admin): lista y crear/editar. */
export default function Usuarios() {
  const { usuarios, usuario: enSesion, guardarUsuario, avisar } = useTienda()
  const [edicion, setEdicion] = useState<Usuario | null>(null)
  const [error, setError] = useState('')
  const esNuevo = !!edicion && !usuarios.some((u) => u.id === edicion.id)
  const cambiar = (cambio: Partial<Usuario>) => {
    setEdicion((u) => (u ? { ...u, ...cambio } : u))
    setError('')
  }
  const perfil = edicion?.perfil ?? { ci: '', mpps: '', cml: '' }

  const guardar = () => {
    if (!edicion) return
    if (!edicion.nombre.trim() || !edicion.correo.trim()) return setError('Indique el nombre y el correo.')
    // El admin no tiene perfil de médico.
    guardarUsuario({ ...edicion, nombre: edicion.nombre.trim(), perfil: edicion.rol === 'medico' ? perfil : undefined })
    setEdicion(null)
    avisar(esNuevo ? 'Usuario creado' : 'Usuario guardado')
  }

  return (
    <>
      <Encabezado
        titulo="Usuarios"
        subtitulo="Médicos y administradores del sistema"
        acciones={
          <Boton variante="primario" onClick={() => setEdicion({ id: nuevoId('u'), nombre: '', correo: '', rol: 'medico', activo: true })}>
            + Nuevo usuario
          </Boton>
        }
      />
      <Tarjeta>
        <div className="overflow-x-auto rounded-md border border-slate-200">
          <table className="tabla">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Estado</th>
                <th className="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td className="font-medium text-slate-900">{u.nombre}</td>
                  <td>{u.correo}</td>
                  <td><Insignia tono={u.rol === 'admin' ? 'gris' : 'azul'}>{etiquetaRol(u)}</Insignia></td>
                  <td>{u.activo ? <Insignia tono="verde">Activo</Insignia> : <Insignia tono="rojo">Inactivo</Insignia>}</td>
                  <td className="text-right"><Boton chico onClick={() => setEdicion(structuredClone(u))}>Editar</Boton></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Tarjeta>

      {edicion && (
        <Modal
          titulo={esNuevo ? 'Nuevo usuario' : 'Editar usuario'}
          onCerrar={() => setEdicion(null)}
          pie={
            <>
              <Boton onClick={() => setEdicion(null)}>Cancelar</Boton>
              <Boton variante="primario" onClick={guardar}>Guardar</Boton>
            </>
          }
        >
          <div className="grid grid-cols-2 gap-x-4 gap-y-3.5">
            <Campo etiqueta="Nombre" className="col-span-2"><Texto value={edicion.nombre} onChange={(v) => cambiar({ nombre: v })} /></Campo>
            <Campo etiqueta="Correo" className="col-span-2">
              <input type="email" className="control" value={edicion.correo} onChange={(e) => cambiar({ correo: e.target.value })} />
            </Campo>
            <Campo etiqueta="Rol">
              <Opciones
                value={etiquetaRol(edicion)}
                onChange={(v) => v && cambiar({ rol: ROLES[v as keyof typeof ROLES] })}
                opciones={Object.keys(ROLES)}
              />
            </Campo>
            <div className="flex items-end pb-1.5">
              {edicion.id === enSesion?.id ? (
                <span className="text-sm text-slate-500">Usuario en sesión (activo)</span>
              ) : (
                <Casilla etiqueta="Activo" marcada={edicion.activo} onChange={(v) => cambiar({ activo: v })} />
              )}
            </div>
            {edicion.rol === 'medico' && (
              <fieldset className="col-span-2 grid grid-cols-3 gap-4 rounded-md border border-slate-200 p-3.5">
                <legend className="px-1 text-sm font-semibold text-slate-700">Perfil del médico</legend>
                <Campo etiqueta="CI"><Texto value={perfil.ci} onChange={(v) => cambiar({ perfil: { ...perfil, ci: v } })} /></Campo>
                <Campo etiqueta="MPPS"><Texto value={perfil.mpps} onChange={(v) => cambiar({ perfil: { ...perfil, mpps: v } })} /></Campo>
                <Campo etiqueta="CML"><Texto value={perfil.cml} onChange={(v) => cambiar({ perfil: { ...perfil, cml: v } })} /></Campo>
              </fieldset>
            )}
          </div>
          {error && <p className="mt-3 text-sm font-medium text-rose-700" role="alert">{error}</p>}
        </Modal>
      )}
    </>
  )
}
