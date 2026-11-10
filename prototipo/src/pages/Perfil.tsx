import { useState } from 'react'
import { Boton, Campo, Encabezado, Tarjeta, Texto } from '../components/ui'
import Membrete from '../impresion/Membrete'
import { useTienda } from '../store'
import type { PerfilMedico } from '../types'
import { leerImagen } from '../utils'

/** 5.8 Mi perfil y membrete (médico), con vista previa del membrete tal como saldrá impreso. */
export default function Perfil() {
  const { usuario, guardarUsuario, avisar } = useTienda()
  const [nombre, setNombre] = useState(usuario?.nombre ?? '')
  const [perfil, setPerfil] = useState<PerfilMedico>(usuario?.perfil ?? { ci: '', mpps: '', cml: '' })
  const [sucio, setSucio] = useState(false)
  if (!usuario) return null

  const p = (k: keyof PerfilMedico) => (v: string) => {
    setPerfil((x) => ({ ...x, [k]: v }))
    setSucio(true)
  }
  const subirLogo = async (archivo: File | undefined) => {
    if (!archivo) return
    try {
      p('logo')(await leerImagen(archivo, 500))
    } catch {
      avisar('No se pudo leer la imagen')
    }
  }

  return (
    <>
      <Encabezado titulo="Mi perfil y membrete" subtitulo="Estos datos se usan en el récipe y en la historia impresa." />
      <div className="grid grid-cols-12 items-start gap-5">
        <Tarjeta titulo="Datos del médico" className="col-span-5">
          <div className="space-y-3.5">
            <Campo etiqueta="Nombre completo">
              <Texto
                value={nombre}
                onChange={(v) => {
                  setNombre(v)
                  setSucio(true)
                }}
              />
            </Campo>
            <Campo etiqueta="Cédula de identidad (CI)"><Texto value={perfil.ci} onChange={p('ci')} /></Campo>
            <div className="grid grid-cols-2 gap-4">
              <Campo etiqueta="MPPS"><Texto value={perfil.mpps} onChange={p('mpps')} /></Campo>
              <Campo etiqueta="CML"><Texto value={perfil.cml} onChange={p('cml')} /></Campo>
            </div>
            <div>
              <span className="mb-1 block text-sm font-medium text-slate-700">Logo del membrete</span>
              <div className="flex items-center gap-2">
                <label className="inline-flex cursor-pointer items-center rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-xs hover:bg-slate-50">
                  {perfil.logo ? 'Cambiar logo' : 'Subir logo…'}
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => {
                      void subirLogo(e.target.files?.[0])
                      e.target.value = ''
                    }}
                  />
                </label>
                {perfil.logo && <Boton variante="peligro" chico onClick={() => p('logo')('')}>Quitar logo</Boton>}
              </div>
              <p className="mt-1 text-xs text-slate-500">La imagen se guarda solo en este navegador.</p>
            </div>
          </div>
          <div className="mt-5 flex items-center justify-end gap-3">
            {sucio && <span className="text-sm text-amber-700">Cambios sin guardar</span>}
            <Boton
              variante="primario"
              disabled={!nombre.trim()}
              onClick={() => {
                guardarUsuario({ ...usuario, nombre: nombre.trim(), perfil: { ...perfil, logo: perfil.logo || undefined } })
                setSucio(false)
                avisar('Perfil y membrete guardados')
              }}
            >
              Guardar
            </Boton>
          </div>
        </Tarjeta>

        <Tarjeta titulo="Vista previa del membrete" className="col-span-7">
          <div className="rounded-md bg-slate-200 p-5">
            <div className="bg-white p-5 shadow">
              <Membrete nombre={nombre} logo={perfil.logo} />
              <div className="mt-8 flex flex-wrap justify-between gap-x-6 gap-y-1 border-t border-slate-400 pt-2 text-sm text-slate-800">
                <p><strong>Médico:</strong> {nombre || '—'}</p>
                <p><strong>CI:</strong> {perfil.ci || '—'}</p>
                <p><strong>MPPS:</strong> {perfil.mpps || '—'}</p>
                <p><strong>CML:</strong> {perfil.cml || '—'}</p>
              </div>
            </div>
          </div>
          <p className="mt-3 text-sm text-slate-500">
            Así saldrá el membrete en la historia impresa y en el récipe. Debajo, los datos que se imprimen al pie del récipe.
          </p>
        </Tarjeta>
      </div>
    </>
  )
}
