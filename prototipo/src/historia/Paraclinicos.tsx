import { Area, Boton, Campo, Numero, Opciones, Selector, Tarjeta, Texto } from '../components/ui'
import { ECG_RITMO, ETT_IMS, ETT_NUMERICOS, ETT_VI, GRUPOS_LABORATORIO } from '../data/opciones'
import { ECG_EJE, ECG_RITMO_AYUDA } from '../data/supuestos'
import { useTienda } from '../store'
import type { ClaveEcg, ClaveEtt } from '../types'
import { leerImagen } from '../utils'
import type { PropsSeccion } from './secciones'

/** Escribe la fecha como día/mes/año e inserta las barras. */
const mascaraFecha = (v: string) => {
  const d = v.replace(/\D/g, '').slice(0, 8)
  return [d.slice(0, 2), d.slice(2, 4), d.slice(4, 8)].filter(Boolean).join('/')
}

/** 6.6 Paraclínicos: una sola pantalla con tres bloques (ECG, Laboratorios, ETT). */
export default function SeccionParaclinicos({ h, cambiar }: PropsSeccion) {
  const { avisar } = useTienda()
  const ecg = (k: ClaveEcg) => (v: string) => cambiar({ ecg: { ...h.ecg, [k]: v } })
  const ett = (k: ClaveEtt) => (v: string) => cambiar({ ett: { ...h.ett, [k]: v } })

  const adjuntar = async (archivo: File | undefined) => {
    if (!archivo) return
    try {
      const imagen = await leerImagen(archivo)
      cambiar({ ett: { ...h.ett, imagen, imagenNombre: archivo.name } })
    } catch {
      avisar('No se pudo leer la imagen')
    }
  }

  return (
    <div className="space-y-5">
      <Tarjeta titulo="Electrocardiograma">
        <div className="grid grid-cols-12 gap-x-4 gap-y-3.5">
          <Campo etiqueta="Ritmo" className="col-span-2" ayuda="S: sinusal · NS: no sinusal">
            <Opciones value={h.ecg.ritmo} onChange={ecg('ritmo')} opciones={ECG_RITMO} ayudas={ECG_RITMO_AYUDA} />
          </Campo>
          {(['fc', 'pr', 'qrs', 'qt', 'qtc'] as const).map((k) => (
            <Campo key={k} etiqueta={k.toUpperCase()} className="col-span-2">
              <Numero value={h.ecg[k]} onChange={ecg(k)} />
            </Campo>
          ))}
          <Campo etiqueta="EJE" className="col-span-4">
            <Selector value={h.ecg.eje} onChange={ecg('eje')} opciones={ECG_EJE} />
          </Campo>
          <Campo etiqueta="Valor del eje" className="col-span-2" ayuda="Puede ser negativo">
            <Numero value={h.ecg.ejeValor} onChange={ecg('ejeValor')} />
          </Campo>
          <Campo etiqueta="Descripción" className="col-span-12">
            <Area value={h.ecg.descripcion} onChange={ecg('descripcion')} filas={3} />
          </Campo>
        </div>
      </Tarjeta>

      <Tarjeta titulo="Laboratorios">
        <div className="overflow-hidden rounded-md border border-slate-200">
          <table className="tabla">
            <thead>
              <tr>
                <th className="w-52">Grupo</th>
                <th>Campos</th>
              </tr>
            </thead>
            <tbody>
              {GRUPOS_LABORATORIO.map((g) => (
                <tr key={g.grupo}>
                  <td className="font-medium text-slate-900">{g.grupo}</td>
                  <td>
                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                      {g.campos.map((campo) => (
                        <label key={campo} className="flex items-center gap-1.5">
                          <span className="text-sm font-medium text-slate-700">{campo}</span>
                          <Texto
                            className="!w-28"
                            value={h.laboratorios[campo]}
                            onChange={(v) => cambiar({ laboratorios: { ...h.laboratorios, [campo]: v } })}
                          />
                        </label>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
              <tr>
                <td className="font-medium text-slate-900">Otros</td>
                <td>
                  <Area value={h.laboratoriosOtros} onChange={(v) => cambiar({ laboratoriosOtros: v })} filas={2} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Tarjeta>

      <Tarjeta titulo="ETT (ecocardiograma transtorácico)">
        <div className="grid grid-cols-12 gap-x-4 gap-y-3.5">
          <Campo etiqueta="Fecha del estudio" className="col-span-3" ayuda="Formato día/mes/año">
            <Texto value={h.ett.fecha} onChange={(v) => ett('fecha')(mascaraFecha(v))} placeholder="dd/mm/aaaa" inputMode="numeric" />
          </Campo>
          <Campo etiqueta="VI" className="col-span-3">
            <Opciones value={h.ett.vi} onChange={ett('vi')} opciones={ETT_VI} />
          </Campo>
          <Campo etiqueta="FEVI" className="col-span-2">
            <Numero value={h.ett.fevi} onChange={ett('fevi')} />
          </Campo>
          <Campo etiqueta="IMS" className="col-span-4">
            <Opciones value={h.ett.ims} onChange={ett('ims')} opciones={ETT_IMS} />
          </Campo>
          {ETT_NUMERICOS.map((n) => (
            <Campo key={n.clave} etiqueta={n.etiqueta} className="col-span-2">
              <Numero value={h.ett[n.clave]} onChange={ett(n.clave)} />
            </Campo>
          ))}
          <Campo etiqueta="Valvulopatías" className="col-span-6">
            <Area value={h.ett.valvulopatias} onChange={ett('valvulopatias')} filas={3} />
          </Campo>
          <Campo etiqueta="Observaciones" className="col-span-6">
            <Area value={h.ett.observaciones} onChange={ett('observaciones')} filas={3} />
          </Campo>

          <div className="col-span-12 rounded-md border border-dashed border-slate-300 bg-slate-50 p-3.5">
            <p className="text-sm font-medium text-slate-700">Adjuntar imagen del informe del eco</p>
            <p className="text-xs text-slate-500">La imagen no se imprime: en la impresión solo sale lo escrito en los campos anteriores.</p>
            <div className="mt-2.5 flex items-center gap-4">
              {h.ett.imagen && (
                <a href={h.ett.imagen} target="_blank" rel="noreferrer" title="Abrir imagen">
                  <img src={h.ett.imagen} alt="Miniatura del informe del eco" className="h-24 w-32 rounded border border-slate-300 bg-white object-cover" />
                </a>
              )}
              <div className="space-y-2">
                {h.ett.imagenNombre && <p className="text-sm text-slate-700">{h.ett.imagenNombre}</p>}
                <div className="flex items-center gap-2">
                  <label className="inline-flex cursor-pointer items-center rounded-md border border-slate-300 bg-white px-2.5 py-1 text-sm font-medium text-slate-700 shadow-xs hover:bg-slate-50 has-disabled:cursor-not-allowed has-disabled:opacity-50">
                    {h.ett.imagen ? 'Cambiar imagen' : 'Elegir imagen…'}
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => {
                        void adjuntar(e.target.files?.[0])
                        e.target.value = ''
                      }}
                    />
                  </label>
                  {h.ett.imagen && (
                    <Boton variante="peligro" chico onClick={() => cambiar({ ett: { ...h.ett, imagen: '', imagenNombre: '' } })}>
                      Quitar imagen
                    </Boton>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Tarjeta>
    </div>
  )
}
