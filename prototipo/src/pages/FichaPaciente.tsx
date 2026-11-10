import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import FormDatosPersonales from '../components/FormDatosPersonales'
import { Boton, Encabezado, EstadoVacio, Insignia, Modal, Tarjeta } from '../components/ui'
import { historiaCompleta } from '../historia/completitud'
import { useTienda } from '../store'
import type { DatosPersonales } from '../types'
import { fechaLarga, nombreCompleto, textoEdad } from '../utils'

function Dato({ etiqueta, valor, ancho = 'col-span-3' }: { etiqueta: string; valor: string; ancho?: string }) {
  return (
    <div className={ancho}>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{etiqueta}</dt>
      <dd className="mt-0.5 text-[15px] text-slate-900">{valor || <span className="text-slate-400">—</span>}</dd>
    </div>
  )
}

export default function FichaPaciente() {
  const { id } = useParams()
  const { pacientesVisibles, historiasVisibles, usuarios, esAdmin, guardarPaciente, avisar } = useTienda()
  const paciente = pacientesVisibles.find((p) => p.id === id)
  const [edicion, setEdicion] = useState<DatosPersonales | null>(null)

  if (!paciente) {
    return (
      <Tarjeta>
        <EstadoVacio
          titulo="Paciente no disponible"
          texto="El paciente no existe o no está vinculado a usted."
          accion={<Link to="/pacientes"><Boton>Volver a la lista</Boton></Link>}
        />
      </Tarjeta>
    )
  }

  // El médico solo ve las historias que él hizo; el admin, las de todos.
  const historias = historiasVisibles
    .filter((h) => h.pacienteId === paciente.id)
    .sort((a, b) => b.fechaConsulta.localeCompare(a.fechaConsulta))
  const nombreMedico = (mid: string) => usuarios.find((u) => u.id === mid)?.nombre ?? '—'

  return (
    <>
      <p className="mb-2 text-sm">
        <Link to="/pacientes" className="font-medium text-accion-700 hover:underline">← {esAdmin ? 'Pacientes' : 'Mis pacientes'}</Link>
      </p>
      <Encabezado titulo={nombreCompleto(paciente)} subtitulo={`Cédula ${paciente.cedula}`} />

      <Tarjeta
        titulo="Datos personales"
        acciones={!esAdmin && <Boton chico onClick={() => setEdicion({ ...paciente })}>Editar</Boton>}
      >
        <dl className="grid grid-cols-12 gap-x-4 gap-y-3.5">
          <Dato etiqueta="Cédula" valor={paciente.cedula} />
          <Dato etiqueta="Nombres" valor={paciente.nombres} />
          <Dato etiqueta="Apellidos" valor={paciente.apellidos} />
          <Dato etiqueta="Sexo" valor={paciente.sexo} />
          <Dato etiqueta="Fecha de nacimiento" valor={fechaLarga(paciente.fechaNacimiento)} />
          <Dato etiqueta="Edad" valor={textoEdad(paciente.fechaNacimiento)} />
          <Dato etiqueta="Dirección actual" valor={paciente.direccion} ancho="col-span-6" />
          <Dato etiqueta="País" valor={paciente.pais} />
          <Dato etiqueta="Estado" valor={paciente.estado} />
          <Dato etiqueta="Municipio" valor={paciente.municipio} />
          <Dato etiqueta="Teléfono 1" valor={paciente.telefono1} />
          <Dato etiqueta="Teléfono 2" valor={paciente.telefono2} />
          <Dato etiqueta="Correo electrónico" valor={paciente.correo} />
          <Dato etiqueta="Ocupación" valor={paciente.ocupacion} />
          <Dato etiqueta="Nivel académico" valor={paciente.nivelAcademico} />
          {esAdmin && <Dato etiqueta="Médicos vinculados" valor={paciente.medicoIds.map(nombreMedico).join(', ')} ancho="col-span-6" />}
        </dl>
      </Tarjeta>

      <Tarjeta
        className="mt-5"
        titulo={esAdmin ? 'Historias (todos los médicos)' : 'Mis historias de este paciente'}
        acciones={
          !esAdmin && (
            <Link to={`/pacientes/${paciente.id}/historias/nueva`}>
              <Boton variante="primario" chico>+ Nueva historia</Boton>
            </Link>
          )
        }
      >
        {historias.length === 0 ? (
          <EstadoVacio
            titulo="Sin historias"
            texto={
              esAdmin
                ? 'Ningún médico ha registrado una historia para este paciente.'
                : 'Usted aún no ha hecho una historia para este paciente. Las historias de otros médicos no se muestran.'
            }
          />
        ) : (
          <div className="overflow-x-auto rounded-md border border-slate-200">
            <table className="tabla">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Nro. de historia</th>
                  <th>Motivo(s) de consulta</th>
                  {esAdmin && <th>Médico</th>}
                  <th>Estado</th>
                  <th className="text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {historias.map((h) => (
                  <tr key={h.id}>
                    <td className="whitespace-nowrap tabular-nums">{fechaLarga(h.fechaConsulta)}</td>
                    <td className="tabular-nums">{h.numero}</td>
                    <td>{h.motivos.join(', ') || <span className="text-slate-400">Sin motivo registrado</span>}</td>
                    {esAdmin && <td className="whitespace-nowrap">{nombreMedico(h.medicoId)}</td>}
                    <td>
                      {historiaCompleta(h, paciente) ? <Insignia tono="verde">Completa</Insignia> : <Insignia tono="ambar">Incompleta</Insignia>}
                    </td>
                    <td>
                      <div className="flex justify-end gap-2">
                        <Link to={`/pacientes/${paciente.id}/historias/${h.id}`}><Boton chico>Ver</Boton></Link>
                        <Link to={`/historias/${h.id}/imprimir/historia`}><Boton chico>Imprimir</Boton></Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Tarjeta>

      {edicion && (
        <Modal
          titulo="Editar datos personales"
          ancho="max-w-4xl"
          onCerrar={() => setEdicion(null)}
          pie={
            <>
              <Boton onClick={() => setEdicion(null)}>Cancelar</Boton>
              <Boton
                variante="primario"
                onClick={() => {
                  guardarPaciente({ ...paciente, ...edicion })
                  setEdicion(null)
                  avisar('Datos personales guardados')
                }}
              >
                Guardar
              </Boton>
            </>
          }
        >
          <FormDatosPersonales
            valor={edicion}
            onChange={(cambio) => setEdicion((d) => (d ? { ...d, ...cambio } : d))}
            cedulaBloqueada
            ayudaCedula="La cédula identifica al paciente y no se cambia aquí."
          />
        </Modal>
      )}
    </>
  )
}
