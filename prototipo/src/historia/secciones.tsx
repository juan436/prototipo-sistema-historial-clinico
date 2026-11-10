import { useState } from 'react'
import { Area, Tarjeta, Texto } from '../components/ui'
import { ANTECEDENTES_PERSONALES, HABITOS, INTERVENCIONES_QUIRURGICAS, MOTIVOS_CONSULTA, PARENTESCOS } from '../data/opciones'
import type { FilaAntecedente, Historia } from '../types'
import { nuevoId } from '../utils'
import SelectorMultiple from './SelectorMultiple'
import TablaFilas from './TablaFilas'

export interface PropsSeccion {
  h: Historia
  cambiar: (cambio: Partial<Historia>) => void
}

/** 6.2 Motivo de consulta y enfermedad actual. */
export function SeccionMotivo({ h, cambiar }: PropsSeccion) {
  const [abierto, setAbierto] = useState(false)
  return (
    <div className="space-y-5">
      <Tarjeta titulo="Motivo de consulta">
        <TablaFilas
          columnas={[{ titulo: 'Motivo', celda: (f) => f.id }]}
          filas={h.motivos.map((m) => ({ id: m }))}
          onAgregar={() => setAbierto(true)}
          onQuitar={(ids) => cambiar({ motivos: h.motivos.filter((m) => !ids.includes(m)) })}
          textoVacio="Sin motivos. Use «Agregar» para elegirlos de la lista."
        />
      </Tarjeta>
      <Tarjeta titulo="Enfermedad actual">
        <Area value={h.enfermedadActual} onChange={(v) => cambiar({ enfermedadActual: v })} filas={9} />
      </Tarjeta>
      {abierto && (
        <SelectorMultiple
          titulo="Agregar motivo de consulta"
          opciones={MOTIVOS_CONSULTA}
          yaAgregadas={h.motivos}
          onCerrar={() => setAbierto(false)}
          onAgregar={(elegidas) => {
            cambiar({ motivos: [...h.motivos, ...elegidas] })
            setAbierto(false)
          }}
        />
      )}
    </div>
  )
}

/** Tabla Descripción + Observación con selector (sin columna de edad). */
function BloqueAntecedentes({
  titulo,
  tituloSelector,
  opciones,
  filas,
  onChange,
}: {
  titulo: string
  tituloSelector: string
  opciones: readonly string[]
  filas: FilaAntecedente[]
  onChange: (filas: FilaAntecedente[]) => void
}) {
  const [abierto, setAbierto] = useState(false)
  return (
    <Tarjeta titulo={titulo}>
      <TablaFilas
        columnas={[
          { titulo: 'Descripción', ancho: 'w-[34%]', celda: (f) => <span className="font-medium text-slate-900">{f.descripcion}</span> },
          {
            titulo: 'Observación',
            celda: (f) => (
              <Texto
                aria-label={`Observación de ${f.descripcion}`}
                value={f.observacion}
                onChange={(v) => onChange(filas.map((x) => (x.id === f.id ? { ...x, observacion: v } : x)))}
              />
            ),
          },
        ]}
        filas={filas}
        onAgregar={() => setAbierto(true)}
        onQuitar={(ids) => onChange(filas.filter((f) => !ids.includes(f.id)))}
        textoVacio="Sin registros. Use «Agregar» para elegirlos de la lista."
      />
      {abierto && (
        <SelectorMultiple
          titulo={tituloSelector}
          opciones={opciones}
          yaAgregadas={filas.map((f) => f.descripcion)}
          onCerrar={() => setAbierto(false)}
          onAgregar={(elegidas) => {
            onChange([...filas, ...elegidas.map((descripcion) => ({ id: nuevoId('a'), descripcion, observacion: '' }))])
            setAbierto(false)
          }}
        />
      )}
    </Tarjeta>
  )
}

/** 6.3 Antecedentes personales. */
export function SeccionAntecedentesPersonales({ h, cambiar }: PropsSeccion) {
  return (
    <div className="space-y-5">
      <BloqueAntecedentes
        titulo="Antecedentes (patologías)"
        tituloSelector="Agregar antecedente personal"
        opciones={ANTECEDENTES_PERSONALES}
        filas={h.antecedentes}
        onChange={(antecedentes) => cambiar({ antecedentes })}
      />
      <BloqueAntecedentes
        titulo="Intervenciones quirúrgicas"
        tituloSelector="Agregar intervención quirúrgica"
        opciones={INTERVENCIONES_QUIRURGICAS}
        filas={h.intervenciones}
        onChange={(intervenciones) => cambiar({ intervenciones })}
      />
    </div>
  )
}

function TablaFija({
  columna,
  filas,
  valores,
  onChange,
}: {
  columna: string
  filas: string[]
  valores: Record<string, string>
  onChange: (v: Record<string, string>) => void
}) {
  return (
    <div className="overflow-hidden rounded-md border border-slate-200">
      <table className="tabla">
        <thead>
          <tr>
            <th className="w-48">{columna}</th>
            <th>Descripción</th>
          </tr>
        </thead>
        <tbody>
          {filas.map((f) => (
            <tr key={f}>
              <td className="font-medium text-slate-900">{f}</td>
              <td>
                <Texto aria-label={`Descripción: ${f}`} value={valores[f]} onChange={(v) => onChange({ ...valores, [f]: v })} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** 6.4 Antecedentes familiares y psicobiológicos: tablas fijas de cuatro filas. */
export function SeccionFamiliares({ h, cambiar }: PropsSeccion) {
  return (
    <div className="space-y-5">
      <Tarjeta titulo="Antecedentes familiares">
        <TablaFija columna="Parentesco" filas={PARENTESCOS} valores={h.familiares} onChange={(familiares) => cambiar({ familiares })} />
      </Tarjeta>
      <Tarjeta titulo="Antecedentes psicobiológicos">
        <TablaFija columna="Hábito" filas={HABITOS} valores={h.psicobiologicos} onChange={(psicobiologicos) => cambiar({ psicobiologicos })} />
      </Tarjeta>
    </div>
  )
}

/** 6.7 Diagnóstico clínico: una única caja de texto grande. */
export function SeccionDiagnostico({ h, cambiar }: PropsSeccion) {
  return (
    <Tarjeta titulo="Diagnóstico clínico">
      <Area value={h.diagnostico} onChange={(v) => cambiar({ diagnostico: v })} filas={14} />
    </Tarjeta>
  )
}

/** 6.9 Plan: una única caja de texto grande. */
export function SeccionPlan({ h, cambiar }: PropsSeccion) {
  return (
    <Tarjeta titulo="Plan">
      <Area value={h.plan} onChange={(v) => cambiar({ plan: v })} filas={14} />
    </Tarjeta>
  )
}
