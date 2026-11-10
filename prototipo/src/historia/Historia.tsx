import { useEffect, useRef, useState } from 'react'
import { Link, useBlocker, useNavigate, useParams } from 'react-router-dom'
import FormDatosPersonales from '../components/FormDatosPersonales'
import { Boton, cx, EstadoVacio, Insignia, Modal, Tarjeta } from '../components/ui'
import { SECCIONES } from '../data/opciones'
import { ADMIN_PUEDE_EDITAR_HISTORIAS } from '../data/supuestos'
import { useTienda } from '../store'
import type { DatosPersonales, Historia as TipoHistoria } from '../types'
import { hoyISO, nombreCompleto, nuevoId, textoEdad } from '../utils'
import { seccionesCompletas } from './completitud'
import SeccionExamenFisico from './ExamenFisico'
import SeccionParaclinicos from './Paraclinicos'
import { SeccionAntecedentesPersonales, SeccionDiagnostico, SeccionFamiliares, SeccionMotivo, SeccionPlan } from './secciones'
import SeccionTratamiento from './Tratamiento'

/** Pantalla 5: historia clínica de primera vez (9 secciones). */
export default function Historia() {
  const { pacienteId, historiaId } = useParams()
  const tienda = useTienda()
  const { usuario, esAdmin, pacientesVisibles, historiasVisibles, usuarios } = tienda
  const navegar = useNavigate()

  const paciente = pacientesVisibles.find((p) => p.id === pacienteId)
  const esNueva = historiaId === 'nueva'
  const guardada = historiasVisibles.find((x) => x.id === historiaId && x.pacienteId === pacienteId)

  const [h, setH] = useState<TipoHistoria | null>(() => {
    if (guardada) return structuredClone(guardada)
    if (esNueva && paciente && usuario?.rol === 'medico') {
      return {
        id: nuevoId('h'), numero: tienda.siguienteNumero(), pacienteId: paciente.id, medicoId: usuario.id, fechaConsulta: hoyISO(),
        motivos: [], enfermedadActual: '', antecedentes: [], intervenciones: [], familiares: {}, psicobiologicos: {},
        examen: {}, ecg: {}, laboratorios: {}, laboratoriosOtros: '', ett: {}, diagnostico: '', tratamiento: [], plan: '',
      }
    }
    return null
  })
  const [datos, setDatos] = useState<DatosPersonales | null>(() => (paciente ? { ...paciente } : null))
  const [seccion, setSeccion] = useState(0)
  const [sucio, setSucio] = useState(false)
  const [pedirGuardarParaVista, setPedirGuardarParaVista] = useState(false)
  const sucioRef = useRef(false)
  const marcarSucio = (v: boolean) => {
    sucioRef.current = v
    setSucio(v)
  }

  // Advertencia al cerrar o salir con cambios sin guardar.
  const bloqueo = useBlocker(({ currentLocation, nextLocation }) => sucioRef.current && currentLocation.pathname !== nextLocation.pathname)
  useEffect(() => {
    const antesDeSalir = (e: BeforeUnloadEvent) => {
      if (sucioRef.current) e.preventDefault()
    }
    window.addEventListener('beforeunload', antesDeSalir)
    return () => window.removeEventListener('beforeunload', antesDeSalir)
  }, [])

  if (!paciente || !h || !datos || !usuario) {
    return (
      <Tarjeta>
        <EstadoVacio
          titulo="Historia no disponible"
          texto="La historia no existe o fue hecha por otro médico. Cada médico solo ve las historias que él hizo."
          accion={<Link to="/pacientes"><Boton>Volver a la lista</Boton></Link>}
        />
      </Tarjeta>
    )
  }

  const soloLectura = esAdmin ? !ADMIN_PUEDE_EDITAR_HISTORIAS : h.medicoId !== usuario.id
  const medico = usuarios.find((u) => u.id === h.medicoId)
  const completas = seccionesCompletas(h, datos)
  const totalCompletas = completas.filter(Boolean).length
  const rutaFicha = `/pacientes/${paciente.id}`
  const rutaImpresion = `/historias/${h.id}/imprimir/historia`

  const cambiar = (cambio: Partial<TipoHistoria>) => {
    setH((x) => (x ? { ...x, ...cambio } : x))
    marcarSucio(true)
  }

  const guardar = () => {
    tienda.guardarPaciente({ ...paciente, ...datos })
    tienda.guardarHistoria(h)
    marcarSucio(false)
    tienda.avisar('Historia guardada')
    if (esNueva) navegar(`/pacientes/${paciente.id}/historias/${h.id}`, { replace: true })
  }

  const vistaPrevia = () => {
    if (!soloLectura && (sucio || esNueva)) setPedirGuardarParaVista(true)
    else navegar(rutaImpresion)
  }

  const props = { h, cambiar }
  const contenido = [
    <Tarjeta titulo="Datos personales" key={0}>
      <FormDatosPersonales
        valor={datos}
        onChange={(cambio) => {
          setDatos((d) => (d ? { ...d, ...cambio } : d))
          marcarSucio(true)
        }}
        cedulaBloqueada
        ayudaCedula="Única por paciente."
      />
    </Tarjeta>,
    <SeccionMotivo {...props} key={1} />,
    <SeccionAntecedentesPersonales {...props} key={2} />,
    <SeccionFamiliares {...props} key={3} />,
    null, // el examen físico gestiona su propio bloqueo de solo lectura
    <SeccionParaclinicos {...props} key={5} />,
    <SeccionDiagnostico {...props} key={6} />,
    <SeccionTratamiento {...props} key={7} />,
    <SeccionPlan {...props} key={8} />,
  ]

  return (
    <div className="-mt-6">
      {/* Barra fija superior: encabezado de la historia y botones Guardar / Vista previa / Cerrar */}
      <div className="sticky top-0 z-30 -mx-8 border-b border-slate-200 bg-white/95 px-8 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-x-6 gap-y-2">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Historia clínica de primera vez</p>
            <h1 className="truncate text-xl font-semibold text-slate-900">
              {nombreCompleto(datos) || 'Paciente'}
              <span className="ml-2 text-sm font-normal text-slate-500">
                {datos.cedula}
                {textoEdad(datos.fechaNacimiento) && ` · ${textoEdad(datos.fechaNacimiento)}`}
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {soloLectura ? <Insignia tono="gris">Solo lectura</Insignia> : sucio && <Insignia tono="ambar">Cambios sin guardar</Insignia>}
            {!soloLectura && <Boton variante="primario" onClick={guardar}>Guardar</Boton>}
            <Boton onClick={vistaPrevia}>Vista previa de impresión</Boton>
            <Boton onClick={() => navegar(rutaFicha)}>Cerrar</Boton>
          </div>
        </div>
        <div className="mx-auto mt-2.5 flex max-w-[1280px] flex-wrap items-center gap-x-8 gap-y-2 text-sm">
          <label className="flex items-center gap-2">
            <span className="font-medium text-slate-600">Fecha de consulta</span>
            <input
              type="date"
              className="control !w-auto !py-1"
              value={h.fechaConsulta}
              max="9999-12-31"
              disabled={soloLectura}
              onChange={(e) => cambiar({ fechaConsulta: e.target.value })}
            />
          </label>
          <p>
            <span className="font-medium text-slate-600">Nro. de historia</span>{' '}
            <span className="rounded bg-slate-100 px-2 py-1 font-semibold tabular-nums text-slate-800" title="Asignado por el sistema">{h.numero}</span>
          </p>
          <p>
            <span className="font-medium text-slate-600">Médico</span> <span className="font-semibold text-slate-800">{medico?.nombre ?? '—'}</span>
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-start gap-6">
        {/* Navegación lateral con indicador de secciones completas */}
        <nav className="sticky top-[118px] w-72 shrink-0 rounded-lg border border-slate-200 bg-white p-2 shadow-xs" aria-label="Secciones de la historia">
          <div className="px-2 pt-1.5 pb-2.5">
            <p className="text-sm font-medium text-slate-700">
              {totalCompletas} de {SECCIONES.length} secciones completas
            </p>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${(totalCompletas / SECCIONES.length) * 100}%` }} />
            </div>
          </div>
          <ol className="space-y-0.5">
            {SECCIONES.map((nombre, i) => (
              <li key={nombre}>
                <button
                  type="button"
                  onClick={() => setSeccion(i)}
                  aria-current={seccion === i ? 'step' : undefined}
                  className={cx(
                    'flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-left text-sm transition',
                    seccion === i ? 'bg-accion-50 font-semibold text-accion-800' : 'text-slate-700 hover:bg-slate-100',
                  )}
                >
                  <span
                    className={cx(
                      'flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold',
                      completas[i] ? 'bg-emerald-500 text-white' : 'border border-slate-300 bg-white text-slate-400',
                    )}
                    title={completas[i] ? 'Sección completa' : 'Sección incompleta'}
                  >
                    {completas[i] ? '✓' : i + 1}
                  </span>
                  <span className="flex-1 leading-snug">{nombre}</span>
                  <span className="sr-only">{completas[i] ? '(completa)' : '(incompleta)'}</span>
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <div className="min-w-0 flex-1 pb-10">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              {seccion + 1}. {SECCIONES[seccion]}
            </h2>
            {completas[seccion] ? <Insignia tono="verde">Completa</Insignia> : <Insignia tono="ambar">Incompleta</Insignia>}
          </div>

          {seccion === 4 ? (
            <SeccionExamenFisico {...props} soloLectura={soloLectura} />
          ) : (
            <fieldset disabled={soloLectura}>{contenido[seccion]}</fieldset>
          )}

          <div className="mt-5 flex justify-between">
            <Boton disabled={seccion === 0} onClick={() => setSeccion(seccion - 1)}>← Anterior</Boton>
            <Boton disabled={seccion === SECCIONES.length - 1} onClick={() => setSeccion(seccion + 1)}>Siguiente →</Boton>
          </div>
        </div>
      </div>

      {bloqueo.state === 'blocked' && (
        <Modal
          titulo="Hay cambios sin guardar"
          onCerrar={() => bloqueo.reset()}
          pie={
            <>
              <Boton onClick={() => bloqueo.reset()}>Seguir editando</Boton>
              <Boton variante="peligro" onClick={() => bloqueo.proceed()}>Salir sin guardar</Boton>
              <Boton
                variante="primario"
                onClick={() => {
                  tienda.guardarPaciente({ ...paciente, ...datos })
                  tienda.guardarHistoria(h)
                  marcarSucio(false)
                  tienda.avisar('Historia guardada')
                  bloqueo.proceed()
                }}
              >
                Guardar y salir
              </Boton>
            </>
          }
        >
          <p className="text-[15px] text-slate-700">Si sale ahora, perderá los cambios que no ha guardado en esta historia.</p>
        </Modal>
      )}

      {pedirGuardarParaVista && (
        <Modal
          titulo="Guardar antes de la vista previa"
          onCerrar={() => setPedirGuardarParaVista(false)}
          pie={
            <>
              <Boton onClick={() => setPedirGuardarParaVista(false)}>Cancelar</Boton>
              <Boton
                variante="primario"
                onClick={() => {
                  tienda.guardarPaciente({ ...paciente, ...datos })
                  tienda.guardarHistoria(h)
                  marcarSucio(false)
                  tienda.avisar('Historia guardada')
                  navegar(rutaImpresion)
                }}
              >
                Guardar y ver vista previa
              </Boton>
            </>
          }
        >
          <p className="text-[15px] text-slate-700">La vista previa de impresión muestra la historia guardada. Guarde los cambios para continuar.</p>
        </Modal>
      )}
    </div>
  )
}
