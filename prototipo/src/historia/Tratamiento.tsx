import { useMemo, useState } from 'react'
import { Boton, Insignia, Modal, Tarjeta, Texto } from '../components/ui'
import { useTienda } from '../store'
import type { FilaTratamiento, Medicamento } from '../types'
import { normalizar, nuevoId } from '../utils'
import type { PropsSeccion } from './secciones'
import TablaFilas from './TablaFilas'

/** Buscador por nombre: agrupa el catálogo por fármaco y muestra TODAS sus presentaciones. */
function BuscadorMedicamentos({
  onElegir,
  onLibre,
  onCerrar,
}: {
  onElegir: (m: Medicamento) => void
  onLibre: () => void
  onCerrar: () => void
}) {
  const { medicamentos } = useTienda()
  const [busqueda, setBusqueda] = useState('')
  const grupos = useMemo(() => {
    const q = normalizar(busqueda)
    const porNombre = new Map<string, Medicamento[]>()
    for (const m of medicamentos) {
      if (!m.activo || !normalizar(m.nombre).includes(q)) continue
      porNombre.set(m.nombre, [...(porNombre.get(m.nombre) ?? []), m])
    }
    return [...porNombre.entries()]
  }, [busqueda, medicamentos])

  return (
    <Modal titulo="Agregar medicamento" ancho="max-w-2xl" onCerrar={onCerrar}>
      <input
        type="search"
        autoFocus
        className="control mb-3"
        placeholder="Escriba el nombre del fármaco, por ejemplo «cande»"
        aria-label="Buscar medicamento por nombre"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />
      <ul className="max-h-[48vh] overflow-y-auto rounded-md border border-slate-200">
        {grupos.length === 0 && (
          <li className="px-3 py-5 text-center text-sm text-slate-500">
            Ningún medicamento del catálogo coincide con «{busqueda}». Puede escribirlo a mano con la opción de abajo.
          </li>
        )}
        {grupos.map(([nombre, presentaciones]) => (
          <li key={nombre} className="flex items-center justify-between gap-4 border-b border-slate-100 px-3 py-2.5 last:border-b-0">
            <span className="text-[15px] font-medium text-slate-900">{nombre}</span>
            <span className="flex flex-wrap justify-end gap-1.5">
              {presentaciones.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onElegir(m)}
                  title={m.posologia}
                  className="rounded-md border border-accion-200 bg-accion-50 px-2.5 py-1 text-sm font-semibold text-accion-800 transition hover:border-accion-600 hover:bg-accion-600 hover:text-white"
                >
                  {m.concentracion}
                </button>
              ))}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-xs text-slate-500">Elija una presentación para agregarla al tratamiento.</p>
        <Boton variante="fantasma" chico onClick={onLibre}>Agregar fármaco que no está en el catálogo</Boton>
      </div>
    </Modal>
  )
}

/** 6.8 Tratamiento: tabla Fármaco | Posología | Horario con Agregar y Quitar. */
export default function SeccionTratamiento({ h, cambiar }: PropsSeccion) {
  const [abierto, setAbierto] = useState(false)
  const filas = h.tratamiento
  const editar = (id: string, cambio: Partial<FilaTratamiento>) =>
    cambiar({ tratamiento: filas.map((f) => (f.id === id ? { ...f, ...cambio } : f)) })
  const agregar = (fila: Omit<FilaTratamiento, 'id'>) => {
    cambiar({ tratamiento: [...filas, { ...fila, id: nuevoId('t') }] })
    setAbierto(false)
  }

  return (
    <Tarjeta titulo="Tratamiento">
      <TablaFilas
        columnas={[
          {
            titulo: 'Fármaco',
            ancho: 'w-[32%]',
            celda: (f) =>
              f.libre ? (
                <span className="flex items-center gap-2">
                  <Texto aria-label="Fármaco escrito a mano" placeholder="Escriba el fármaco" value={f.farmaco} onChange={(v) => editar(f.id, { farmaco: v })} />
                  <Insignia>A mano</Insignia>
                </span>
              ) : (
                <span className="font-medium text-slate-900">
                  {f.farmaco} <span className="font-normal text-slate-600">tab {f.concentracion}</span>
                </span>
              ),
          },
          {
            titulo: 'Posología',
            celda: (f) => <Texto aria-label={`Posología de ${f.farmaco}`} value={f.posologia} onChange={(v) => editar(f.id, { posologia: v })} />,
          },
          {
            titulo: 'Horario',
            ancho: 'w-44',
            celda: (f) => <Texto aria-label={`Horario de ${f.farmaco}`} placeholder="Ej.: 8am-8pm" value={f.horario} onChange={(v) => editar(f.id, { horario: v })} />,
          },
        ]}
        filas={filas}
        onAgregar={() => setAbierto(true)}
        onQuitar={(ids) => cambiar({ tratamiento: filas.filter((f) => !ids.includes(f.id)) })}
        textoVacio="Sin medicamentos. Use «Agregar» para buscarlos en el catálogo."
      />
      <p className="mt-3 rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-600">
        Recordatorio: las filas de esta tabla definen lo que se imprime en el récipe.
      </p>

      {abierto && (
        <BuscadorMedicamentos
          onCerrar={() => setAbierto(false)}
          // Se guarda una COPIA del texto: si el catálogo cambia después, la historia no cambia.
          onElegir={(m) => agregar({ farmaco: m.nombre, concentracion: m.concentracion, posologia: m.posologia, horario: '', libre: false })}
          onLibre={() => agregar({ farmaco: '', concentracion: '', posologia: '', horario: '', libre: true })}
        />
      )}
    </Tarjeta>
  )
}
