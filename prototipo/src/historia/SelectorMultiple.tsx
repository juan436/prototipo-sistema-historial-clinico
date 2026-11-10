import { useMemo, useState } from 'react'
import { Boton, cx, Modal } from '../components/ui'
import { normalizar } from '../utils'

/** Selector con búsqueda y selección múltiple. Los elementos ya agregados no se pueden repetir. */
export default function SelectorMultiple({
  titulo,
  opciones,
  yaAgregadas,
  onAgregar,
  onCerrar,
}: {
  titulo: string
  opciones: readonly string[]
  yaAgregadas: string[]
  onAgregar: (elegidas: string[]) => void
  onCerrar: () => void
}) {
  const [busqueda, setBusqueda] = useState('')
  const [elegidas, setElegidas] = useState<string[]>([])
  const visibles = useMemo(() => {
    const q = normalizar(busqueda)
    return opciones.filter((o) => normalizar(o).includes(q))
  }, [busqueda, opciones])

  return (
    <Modal
      titulo={titulo}
      onCerrar={onCerrar}
      pie={
        <>
          <Boton onClick={onCerrar}>Cancelar</Boton>
          <Boton variante="primario" disabled={elegidas.length === 0} onClick={() => onAgregar(opciones.filter((o) => elegidas.includes(o)))}>
            Agregar{elegidas.length > 0 ? ` (${elegidas.length})` : ''}
          </Boton>
        </>
      }
    >
      <input
        type="search"
        autoFocus
        className="control mb-3"
        placeholder="Buscar…"
        aria-label="Buscar en la lista"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />
      <ul className="max-h-[46vh] overflow-y-auto rounded-md border border-slate-200">
        {visibles.length === 0 && <li className="px-3 py-4 text-center text-sm text-slate-500">Sin resultados para «{busqueda}».</li>}
        {visibles.map((o) => {
          const agregada = yaAgregadas.includes(o)
          const marcada = elegidas.includes(o)
          return (
            <li key={o} className="border-b border-slate-100 last:border-b-0">
              <label className={cx('flex items-center gap-2.5 px-3 py-2 text-[15px]', agregada ? 'text-slate-400' : 'cursor-pointer hover:bg-accion-50', marcada && 'bg-accion-50')}>
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-accion-600"
                  disabled={agregada}
                  checked={agregada || marcada}
                  onChange={() => setElegidas((e) => (marcada ? e.filter((x) => x !== o) : [...e, o]))}
                />
                <span className="flex-1">{o}</span>
                {agregada && <span className="text-xs">Ya agregado</span>}
              </label>
            </li>
          )
        })}
      </ul>
      <p className="mt-2 text-xs text-slate-500">{opciones.length} opciones. Puede marcar varias.</p>
    </Modal>
  )
}
