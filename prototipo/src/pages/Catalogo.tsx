import { useMemo, useState } from 'react'
import { Boton, Campo, Casilla, Encabezado, EstadoVacio, Insignia, Modal, Tarjeta, Texto } from '../components/ui'
import { posologiaPorDefecto } from '../data/supuestos'
import { useTienda } from '../store'
import type { Medicamento } from '../types'
import { normalizar, nuevoId } from '../utils'

/** 5.10 Catálogo de medicamentos (solo el admin lo edita): una fila por presentación. */
export default function Catalogo() {
  const { medicamentos, guardarMedicamento, avisar } = useTienda()
  const [busqueda, setBusqueda] = useState('')
  const [edicion, setEdicion] = useState<Medicamento | null>(null)
  const [error, setError] = useState('')
  const esNuevo = !!edicion && !medicamentos.some((m) => m.id === edicion.id)

  const filas = useMemo(() => {
    const q = normalizar(busqueda)
    return medicamentos.filter((m) => normalizar(`${m.nombre} ${m.concentracion}`).includes(q))
  }, [busqueda, medicamentos])

  const cambiar = (cambio: Partial<Medicamento>) => {
    setEdicion((m) => (m ? { ...m, ...cambio } : m))
    setError('')
  }

  const guardar = () => {
    if (!edicion) return
    const nombre = edicion.nombre.trim()
    const concentracion = edicion.concentracion.trim()
    if (!nombre || !concentracion) return setError('Indique el nombre y la concentración.')
    if (medicamentos.some((m) => m.id !== edicion.id && normalizar(m.nombre) === normalizar(nombre) && normalizar(m.concentracion) === normalizar(concentracion)))
      return setError('Ya existe esa presentación en el catálogo.')
    guardarMedicamento({ ...edicion, nombre, concentracion, posologia: edicion.posologia.trim() || posologiaPorDefecto(concentracion) })
    setEdicion(null)
    avisar(esNuevo ? 'Medicamento agregado al catálogo' : 'Medicamento guardado')
  }

  return (
    <>
      <Encabezado
        titulo="Catálogo de medicamentos"
        subtitulo="Un solo catálogo para todos los médicos. Cada fila es una presentación."
        acciones={
          <Boton variante="primario" onClick={() => setEdicion({ id: nuevoId('med'), nombre: '', concentracion: '', posologia: '', activo: true })}>
            + Nuevo medicamento
          </Boton>
        }
      />
      <Tarjeta>
        <label className="mb-4 block max-w-md">
          <span className="mb-1 block text-sm font-medium text-slate-700">Buscar medicamento</span>
          <input type="search" className="control" placeholder="Ej.: candesartán" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
        </label>
        {filas.length === 0 ? (
          <EstadoVacio titulo="Sin resultados" texto={`Ningún medicamento coincide con «${busqueda}».`} />
        ) : (
          <div className="overflow-x-auto rounded-md border border-slate-200">
            <table className="tabla">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Concentración</th>
                  <th>Posología por defecto</th>
                  <th>Estado</th>
                  <th className="text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filas.map((m) => (
                  <tr key={m.id}>
                    <td className="font-medium text-slate-900">{m.nombre}</td>
                    <td className="whitespace-nowrap tabular-nums">{m.concentracion}</td>
                    <td>{m.posologia}</td>
                    <td>{m.activo ? <Insignia tono="verde">Activo</Insignia> : <Insignia tono="rojo">Inactivo</Insignia>}</td>
                    <td className="text-right"><Boton chico onClick={() => setEdicion({ ...m })}>Editar</Boton></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="mt-3 text-xs text-slate-500">
          {filas.length} de {medicamentos.length} presentaciones. Falta añadir antibióticos y antidiabéticos: el cliente aportará la lista.
        </p>
      </Tarjeta>

      {edicion && (
        <Modal
          titulo={esNuevo ? 'Nuevo medicamento' : 'Editar medicamento'}
          onCerrar={() => setEdicion(null)}
          pie={
            <>
              <Boton onClick={() => setEdicion(null)}>Cancelar</Boton>
              <Boton variante="primario" onClick={guardar}>Guardar</Boton>
            </>
          }
        >
          <div className="grid grid-cols-3 gap-x-4 gap-y-3.5">
            <Campo etiqueta="Nombre" className="col-span-2"><Texto value={edicion.nombre} onChange={(v) => cambiar({ nombre: v })} /></Campo>
            <Campo etiqueta="Concentración">
              <Texto
                value={edicion.concentracion}
                placeholder="Ej.: 8 mg"
                onChange={(v) =>
                  // Mientras la posología siga siendo la de por defecto, acompaña a la concentración.
                  cambiar({
                    concentracion: v,
                    ...(edicion.posologia === '' || edicion.posologia === posologiaPorDefecto(edicion.concentracion) ? { posologia: v.trim() ? posologiaPorDefecto(v) : '' } : {}),
                  })
                }
              />
            </Campo>
            <Campo etiqueta="Posología por defecto" className="col-span-3" ayuda="Se propone al médico al agregar el fármaco; él puede modificarla.">
              <Texto value={edicion.posologia} onChange={(v) => cambiar({ posologia: v })} />
            </Campo>
            <div className="col-span-3">
              <Casilla etiqueta="Activo (aparece en el buscador de tratamiento)" marcada={edicion.activo} onChange={(v) => cambiar({ activo: v })} />
            </div>
          </div>
          {error && <p className="mt-3 text-sm font-medium text-rose-700" role="alert">{error}</p>}
        </Modal>
      )}
    </>
  )
}
