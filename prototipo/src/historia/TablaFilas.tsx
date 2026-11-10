import { useState, type ReactNode } from 'react'
import { Boton } from '../components/ui'

export interface Columna<F> {
  titulo: string
  ancho?: string
  celda: (fila: F, indice: number) => ReactNode
}

/** Tabla con botones Agregar y Quitar: se marcan filas con la casilla y «Quitar» las elimina. */
export default function TablaFilas<F extends { id: string }>({
  columnas,
  filas,
  onAgregar,
  onQuitar,
  textoAgregar = 'Agregar',
  textoVacio,
  accionesExtra,
}: {
  columnas: Columna<F>[]
  filas: F[]
  onAgregar: () => void
  onQuitar: (ids: string[]) => void
  textoAgregar?: string
  textoVacio: string
  accionesExtra?: ReactNode
}) {
  const [marcadas, setMarcadas] = useState<string[]>([])
  const vigentes = marcadas.filter((id) => filas.some((f) => f.id === id))
  const alternar = (id: string) => setMarcadas((m) => (m.includes(id) ? m.filter((x) => x !== id) : [...m, id]))

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <Boton variante="primario" chico onClick={onAgregar}>+ {textoAgregar}</Boton>
        <Boton
          variante="peligro"
          chico
          disabled={vigentes.length === 0}
          onClick={() => {
            onQuitar(vigentes)
            setMarcadas([])
          }}
        >
          Quitar{vigentes.length > 0 ? ` (${vigentes.length})` : ''}
        </Boton>
        {accionesExtra}
      </div>
      <div className="overflow-x-auto rounded-md border border-slate-200">
        <table className="tabla">
          <thead>
            <tr>
              <th className="w-10">
                <span className="sr-only">Seleccionar</span>
              </th>
              {columnas.map((c) => (
                <th key={c.titulo} className={c.ancho}>{c.titulo}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filas.length === 0 ? (
              <tr>
                <td colSpan={columnas.length + 1} className="py-5 text-center text-sm text-slate-500">{textoVacio}</td>
              </tr>
            ) : (
              filas.map((f, i) => (
                <tr key={f.id} className={vigentes.includes(f.id) ? 'bg-rose-50/60' : undefined}>
                  <td>
                    <input
                      type="checkbox"
                      aria-label="Seleccionar fila para quitar"
                      className="h-4 w-4 accent-accion-600"
                      checked={vigentes.includes(f.id)}
                      onChange={() => alternar(f.id)}
                    />
                  </td>
                  {columnas.map((c) => (
                    <td key={c.titulo}>{c.celda(f, i)}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
