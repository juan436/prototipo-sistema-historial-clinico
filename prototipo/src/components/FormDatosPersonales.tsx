import { NIVELES_ACADEMICOS, SEXOS } from '../data/opciones'
import type { DatosPersonales } from '../types'
import { textoEdad } from '../utils'
import { Area, Calculado, Campo, Opciones, Selector, Texto } from './ui'

/**
 * 6.1 Datos personales: los 15 campos del documento, en su orden.
 * Se usa en «Nuevo paciente», en la ficha y en la sección 1 de la historia.
 */
export default function FormDatosPersonales({
  valor,
  onChange,
  soloLectura,
  cedulaBloqueada,
  onCedulaBlur,
  ayudaCedula,
}: {
  valor: DatosPersonales
  onChange: (cambio: Partial<DatosPersonales>) => void
  soloLectura?: boolean
  cedulaBloqueada?: boolean
  onCedulaBlur?: () => void
  ayudaCedula?: string
}) {
  const c = <K extends keyof DatosPersonales>(k: K) => (v: DatosPersonales[K]) => onChange({ [k]: v } as Partial<DatosPersonales>)
  return (
    <fieldset disabled={soloLectura} className="grid grid-cols-12 gap-x-4 gap-y-3.5">
      <Campo etiqueta="Cédula" className="col-span-3" ayuda={ayudaCedula}>
        <Texto value={valor.cedula} onChange={c('cedula')} onBlur={onCedulaBlur} readOnly={cedulaBloqueada} placeholder="V-00.000.000" />
      </Campo>
      <Campo etiqueta="Nombres" className="col-span-4">
        <Texto value={valor.nombres} onChange={c('nombres')} />
      </Campo>
      <Campo etiqueta="Apellidos" className="col-span-5">
        <Texto value={valor.apellidos} onChange={c('apellidos')} />
      </Campo>

      <Campo etiqueta="Sexo" className="col-span-4">
        <Opciones value={valor.sexo} onChange={(v) => c('sexo')(v as DatosPersonales['sexo'])} opciones={SEXOS} />
      </Campo>
      <Campo etiqueta="Fecha de nacimiento" className="col-span-4">
        <input type="date" className="control" value={valor.fechaNacimiento} max="9999-12-31" onChange={(e) => c('fechaNacimiento')(e.target.value)} />
      </Campo>
      <Campo etiqueta="Edad" className="col-span-4">
        <Calculado valor={textoEdad(valor.fechaNacimiento)} />
      </Campo>

      <Campo etiqueta="Dirección actual" className="col-span-12">
        <Area value={valor.direccion} onChange={c('direccion')} filas={2} />
      </Campo>

      <Campo etiqueta="País" className="col-span-4">
        <Texto value={valor.pais} onChange={c('pais')} />
      </Campo>
      <Campo etiqueta="Estado" className="col-span-4">
        <Texto value={valor.estado} onChange={c('estado')} />
      </Campo>
      <Campo etiqueta="Municipio" className="col-span-4">
        <Texto value={valor.municipio} onChange={c('municipio')} />
      </Campo>

      <Campo etiqueta="Teléfono 1" className="col-span-3">
        <Texto value={valor.telefono1} onChange={c('telefono1')} inputMode="tel" />
      </Campo>
      <Campo etiqueta="Teléfono 2" className="col-span-3">
        <Texto value={valor.telefono2} onChange={c('telefono2')} inputMode="tel" />
      </Campo>
      <Campo etiqueta="Correo electrónico" className="col-span-6">
        <input type="email" className="control" value={valor.correo} onChange={(e) => c('correo')(e.target.value)} />
      </Campo>

      <Campo etiqueta="Ocupación" className="col-span-6">
        <Texto value={valor.ocupacion} onChange={c('ocupacion')} />
      </Campo>
      <Campo etiqueta="Nivel académico" className="col-span-6">
        <Selector value={valor.nivelAcademico} onChange={c('nivelAcademico')} opciones={NIVELES_ACADEMICOS} />
      </Campo>
    </fieldset>
  )
}
