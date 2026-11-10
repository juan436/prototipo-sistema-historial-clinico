import { useState, type ReactNode } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Boton, cx, EstadoVacio } from '../components/ui'
import { RECIPE_FORMA, RECIPE_MODELO_INICIAL, RECIPE_MOSTRAR_CI } from '../data/supuestos'
import { useTienda } from '../store'
import type { Historia, Paciente, Usuario } from '../types'
import { fechaLarga, hoyISO, nombreCompleto, textoEdad } from '../utils'
import Membrete from './Membrete'
import { textoAntecedentes, textoEcg, textoEtt, textoExamen, textoFamiliares, textoLaboratorios, textoPsicobiologicos } from './narrativa'

interface PropsHoja {
  h: Historia
  paciente: Paciente
  medico: Usuario | undefined
}

function Seccion({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section className="seccion-impresa mt-[3.2mm]">
      <h2 className="border-b border-slate-300 pb-[0.5mm] text-[10.5pt] font-bold tracking-wide text-slate-900 uppercase">{titulo}</h2>
      <div className="mt-[1.2mm] text-justify">{children}</div>
    </section>
  )
}

const vacio = <span className="text-slate-500">Sin datos registrados.</span>
const Parrafo = ({ etiqueta, texto }: { etiqueta?: string; texto: string }) => (
  <p className="whitespace-pre-line">
    {etiqueta && <strong>{etiqueta}: </strong>}
    {texto ? `${texto}${/[.:;]$/.test(texto) ? '' : '.'}` : vacio}
  </p>
)

/** 9.2 Historia impresa: orden exacto de 10 puntos. */
function HojaHistoria({ h, paciente, medico }: PropsHoja) {
  return (
    <article className="hoja hoja-historia">
      <Membrete nombre={medico?.nombre ?? ''} logo={medico?.perfil?.logo} />

      <header className="seccion-impresa mt-[4mm]">
        <div className="flex items-baseline justify-between">
          <h1 className="text-[15pt] font-bold tracking-wide">Historia Médica</h1>
          <p>
            <strong>Fecha de consulta:</strong> {fechaLarga(h.fechaConsulta)}
          </p>
        </div>
        <p className="no-imprimir text-right text-[8pt] text-slate-500">«Página x de y» se numera automáticamente al imprimir.</p>
        <dl className="mt-[2mm] grid grid-cols-[auto_1fr_auto_1fr] gap-x-[3mm] gap-y-[0.8mm] rounded-sm border border-slate-400 px-[3mm] py-[2mm]">
          <dt className="font-bold">Cédula:</dt>
          <dd>{paciente.cedula}</dd>
          <dt className="font-bold">Nro. de historia:</dt>
          <dd>{h.numero}</dd>
          <dt className="font-bold">Nombre:</dt>
          <dd>{nombreCompleto(paciente)}</dd>
          <dt className="font-bold">Fecha de nacimiento:</dt>
          <dd>{fechaLarga(paciente.fechaNacimiento)}</dd>
          <dt className="font-bold">Edad:</dt>
          <dd>{textoEdad(paciente.fechaNacimiento)}</dd>
        </dl>
      </header>

      <Seccion titulo="1. Motivo de consulta"><Parrafo texto={h.motivos.join(', ')} /></Seccion>
      <Seccion titulo="2. Enfermedad actual"><Parrafo texto={h.enfermedadActual.trim()} /></Seccion>
      <Seccion titulo="3. Antecedentes personales">
        <Parrafo etiqueta="Antecedentes" texto={textoAntecedentes(h.antecedentes)} />
        <Parrafo etiqueta="Intervenciones quirúrgicas" texto={textoAntecedentes(h.intervenciones)} />
      </Seccion>
      <Seccion titulo="4. Antecedentes familiares y psicobiológicos">
        <Parrafo etiqueta="Familiares" texto={textoFamiliares(h)} />
        <Parrafo etiqueta="Psicobiológicos" texto={textoPsicobiologicos(h)} />
      </Seccion>
      <Seccion titulo="5. Examen físico"><Parrafo texto={textoExamen(h)} /></Seccion>
      <Seccion titulo="6. Paraclínicos">
        <Parrafo etiqueta="6.1 Electrocardiograma" texto={textoEcg(h)} />
        <Parrafo etiqueta="6.2 Laboratorios" texto={textoLaboratorios(h)} />
        {/* La imagen del informe del eco no se imprime: solo lo escrito. */}
        <Parrafo etiqueta="6.3 ETT" texto={textoEtt(h)} />
      </Seccion>
      <Seccion titulo="7. Diagnóstico"><Parrafo texto={h.diagnostico.trim()} /></Seccion>
      <Seccion titulo="8. Tratamiento">
        {h.tratamiento.length === 0 ? (
          <p>{vacio}</p>
        ) : (
          <ul className="list-disc pl-[5mm]">
            {h.tratamiento.map((t) => (
              <li key={t.id}>
                <strong>{t.farmaco}</strong>
                {t.concentracion && ` tab ${t.concentracion}`}
                {t.posologia && `. ${t.posologia}`}
                {t.horario && `. ${t.horario}`}
              </li>
            ))}
          </ul>
        )}
      </Seccion>
      <Seccion titulo="9. Plan"><Parrafo texto={h.plan.trim()} /></Seccion>

      {/* 10. Datos del médico que hizo la historia */}
      <section className="seccion-impresa mt-[16mm] ml-auto w-[80mm] text-center">
        <div className="border-t border-slate-800 pt-[1.5mm]">
          <p className="font-bold">{medico?.nombre}</p>
          <p>CI: {medico?.perfil?.ci || '—'}</p>
          <p>
            MPPS: {medico?.perfil?.mpps || '—'} · CML: {medico?.perfil?.cml || '—'}
          </p>
        </div>
      </section>
    </article>
  )
}

/** 9.3 Récipe impreso: Modelo A y Modelo B. */
function HojaRecipe({ h, paciente, medico, modelo }: PropsHoja & { modelo: 'A' | 'B' }) {
  return (
    <article className="hoja hoja-recipe">
      <Membrete nombre={medico?.nombre ?? ''} logo={medico?.perfil?.logo} />

      <dl className="mt-[5mm] flex flex-wrap gap-x-[10mm] gap-y-[1mm] rounded-sm border border-slate-500 px-[4mm] py-[2.5mm] text-[11pt]">
        <div className="flex gap-[2mm]">
          <dt className="font-bold">Nombre y apellido:</dt>
          <dd>{nombreCompleto(paciente)}</dd>
        </div>
        <div className="flex gap-[2mm]">
          <dt className="font-bold">Edad:</dt>
          <dd>{textoEdad(paciente.fechaNacimiento)}</dd>
        </div>
        {RECIPE_MOSTRAR_CI && (
          <div className="flex gap-[2mm]">
            <dt className="font-bold">CI:</dt>
            <dd>{paciente.cedula}</dd>
          </div>
        )}
      </dl>

      <div className="mt-[8mm] flex-1 text-[12pt]">
        {h.tratamiento.length === 0 ? (
          <p className="text-slate-500">La sección Tratamiento de esta historia no tiene medicamentos.</p>
        ) : (
          <ul className="list-disc space-y-[3mm] pl-[7mm]">
            {h.tratamiento.map((t) =>
              modelo === 'A' ? (
                <li key={t.id}>
                  <strong>{t.farmaco}</strong>
                  {t.concentracion && ` ${RECIPE_FORMA} ${t.concentracion}`}
                </li>
              ) : (
                <li key={t.id}>
                  <strong>{t.farmaco}:</strong> {[t.posologia, t.horario].filter(Boolean).join(' ')}
                </li>
              ),
            )}
          </ul>
        )}
      </div>

      {/* Pie: fecha de emisión automática y datos del médico tomados de su perfil */}
      <footer className="flex flex-wrap justify-between gap-x-[6mm] gap-y-[1mm] border-t border-slate-500 pt-[2.5mm] text-[10pt]">
        <p><strong>Fecha:</strong> {fechaLarga(hoyISO())}</p>
        <p><strong>Médico:</strong> {medico?.nombre}</p>
        <p><strong>CI:</strong> {medico?.perfil?.ci || '—'}</p>
        <p><strong>MPPS:</strong> {medico?.perfil?.mpps || '—'}</p>
        <p><strong>CML:</strong> {medico?.perfil?.cml || '—'}</p>
      </footer>
    </article>
  )
}

/** Pantallas 6 y 7: vista previa de impresión de la historia y del récipe. */
export default function Imprimir() {
  const { historiaId, documento } = useParams()
  const { usuario, historiasVisibles, pacientes, usuarios } = useTienda()
  const [modelo, setModelo] = useState<'A' | 'B'>(RECIPE_MODELO_INICIAL)
  if (!usuario) return <Navigate to="/" replace />

  const h = historiasVisibles.find((x) => x.id === historiaId)
  const paciente = h && pacientes.find((p) => p.id === h.pacienteId)
  if (!h || !paciente) {
    return (
      <div className="p-10">
        <EstadoVacio
          titulo="Historia no disponible"
          texto="La historia no existe o fue hecha por otro médico."
          accion={<Link to="/pacientes"><Boton>Volver a la lista</Boton></Link>}
        />
      </div>
    )
  }
  const medico = usuarios.find((u) => u.id === h.medicoId)
  const esRecipe = documento === 'recipe'
  const pestana = (activa: boolean) =>
    cx('rounded-md px-3 py-1.5 text-sm font-medium transition', activa ? 'bg-accion-600 text-white' : 'text-slate-700 hover:bg-slate-100')

  return (
    <div className="min-h-screen bg-slate-200 print:bg-white">
      <div className="no-imprimir sticky top-0 z-10 border-b border-slate-300 bg-white px-6 py-3 shadow-sm">
        <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <Link to={`/pacientes/${paciente.id}/historias/${h.id}`}><Boton chico>← Volver a la historia</Boton></Link>
            <div className="flex gap-1 rounded-lg border border-slate-200 p-1" role="tablist" aria-label="Documento a imprimir">
              <Link to={`/historias/${h.id}/imprimir/historia`} replace role="tab" aria-selected={!esRecipe} className={pestana(!esRecipe)}>Historia</Link>
              <Link to={`/historias/${h.id}/imprimir/recipe`} replace role="tab" aria-selected={esRecipe} className={pestana(esRecipe)}>Récipe</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {esRecipe && (
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-slate-600">Modelo de récipe</span>
                <div className="flex gap-1 rounded-lg border border-slate-200 p-1" role="radiogroup" aria-label="Modelo de récipe">
                  {(['A', 'B'] as const).map((m) => (
                    <button key={m} type="button" role="radio" aria-checked={modelo === m} onClick={() => setModelo(m)} className={pestana(modelo === m)}>
                      Modelo {m}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <Boton variante="primario" onClick={() => window.print()}>Imprimir</Boton>
          </div>
        </div>
      </div>

      <div className="py-8 print:py-0">
        {esRecipe ? <HojaRecipe h={h} paciente={paciente} medico={medico} modelo={modelo} /> : <HojaHistoria h={h} paciente={paciente} medico={medico} />}
      </div>
    </div>
  )
}
