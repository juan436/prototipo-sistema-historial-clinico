import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Boton, Encabezado, EstadoVacio, Tarjeta } from '../components/ui'
import { useTienda } from '../store'
import { fechaLarga, nombreCompleto, normalizar, normalizarCedula, textoEdad } from '../utils'

export default function Pacientes() {
  const { pacientesVisibles, historiasVisibles, usuarios, esAdmin } = useTienda()
  const [busqueda, setBusqueda] = useState('')
  const navegar = useNavigate()

  const filas = useMemo(() => {
    const q = normalizar(busqueda)
    const qCedula = normalizarCedula(busqueda)
    return pacientesVisibles
      .filter(
        (p) =>
          !q ||
          normalizar(nombreCompleto(p)).includes(q) ||
          (qCedula !== '' && normalizarCedula(p.cedula).includes(qCedula)),
      )
      .map((p) => ({
        p,
        // Última consulta entre las historias que el usuario puede ver.
        ultima: historiasVisibles.filter((h) => h.pacienteId === p.id).map((h) => h.fechaConsulta).sort().at(-1) ?? '',
      }))
      .sort((a, b) => nombreCompleto(a.p).localeCompare(nombreCompleto(b.p), 'es'))
  }, [busqueda, pacientesVisibles, historiasVisibles])

  const nombreMedico = (id: string) => usuarios.find((u) => u.id === id)?.nombre ?? '—'

  return (
    <>
      <Encabezado
        titulo={esAdmin ? 'Pacientes' : 'Mis pacientes'}
        subtitulo={esAdmin ? 'Todos los pacientes registrados' : 'Pacientes vinculados a usted'}
        acciones={
          !esAdmin && (
            <Link to="/pacientes/nuevo">
              <Boton variante="primario">+ Nuevo paciente</Boton>
            </Link>
          )
        }
      />
      <Tarjeta>
        <label className="mb-4 block max-w-md">
          <span className="mb-1 block text-sm font-medium text-slate-700">Buscar por cédula o nombre</span>
          <input
            type="search"
            className="control"
            placeholder="Ej.: 99.000.101 o Quintero"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </label>

        {filas.length === 0 ? (
          <EstadoVacio
            titulo={busqueda ? 'No se encontraron pacientes' : 'Aún no hay pacientes'}
            texto={
              busqueda
                ? `Ningún paciente coincide con «${busqueda}». Revise la cédula o el nombre.`
                : esAdmin
                  ? 'Cuando los médicos registren pacientes, aparecerán aquí.'
                  : 'Registre su primer paciente con el botón «Nuevo paciente».'
            }
          />
        ) : (
          <div className="overflow-x-auto rounded-md border border-slate-200">
            <table className="tabla">
              <thead>
                <tr>
                  <th>Cédula</th>
                  <th>Nombre y apellido</th>
                  <th>Edad</th>
                  <th>Teléfono</th>
                  <th>Última consulta</th>
                  {esAdmin && <th>Médicos vinculados</th>}
                </tr>
              </thead>
              <tbody>
                {filas.map(({ p, ultima }) => (
                  <tr
                    key={p.id}
                    tabIndex={0}
                    className="cursor-pointer hover:bg-accion-50 focus-visible:bg-accion-50 focus-visible:outline-none"
                    onClick={() => navegar(`/pacientes/${p.id}`)}
                    onKeyDown={(e) => e.key === 'Enter' && navegar(`/pacientes/${p.id}`)}
                  >
                    <td className="whitespace-nowrap tabular-nums">{p.cedula}</td>
                    <td className="font-medium text-slate-900">{nombreCompleto(p)}</td>
                    <td className="whitespace-nowrap">{textoEdad(p.fechaNacimiento) || '—'}</td>
                    <td className="whitespace-nowrap tabular-nums">{p.telefono1 || '—'}</td>
                    <td className="whitespace-nowrap tabular-nums">{fechaLarga(ultima) || <span className="text-slate-400">Sin consultas</span>}</td>
                    {esAdmin && <td>{p.medicoIds.map(nombreMedico).join(', ')}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="mt-3 text-xs text-slate-500">
          {filas.length} {filas.length === 1 ? 'paciente' : 'pacientes'}
        </p>
      </Tarjeta>
    </>
  )
}
