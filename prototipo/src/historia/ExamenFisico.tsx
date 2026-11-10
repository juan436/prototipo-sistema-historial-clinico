import { useState, type ReactNode } from 'react'
import { Area, Calculado, Campo, Casilla, cx, Numero, Opciones, Selector, Texto } from '../components/ui'
import { EXAMEN } from '../data/opciones'
import { APARTADOS_EXAMEN, MIEMBROS_SIMETRIA, OPCIONES_POR_DEFINIR, type BloqueExamen } from '../data/supuestos'
import type { ClaveExamen, ExamenFisico } from '../types'
import { calcularICC, calcularIMC } from '../utils'
import type { PropsSeccion } from './secciones'

function Bloque({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white shadow-xs">
      <h4 className="border-b border-slate-200 px-4 py-2 text-base font-semibold text-slate-800">{titulo}</h4>
      <div className="grid grid-cols-12 gap-x-4 gap-y-3.5 p-4">{children}</div>
    </section>
  )
}

const SI_NO = EXAMEN.siNo

/** 6.5 Examen físico: 3 apartados [SUPUESTO], definidos en data/supuestos.ts. */
export default function SeccionExamenFisico({ h, cambiar, soloLectura }: PropsSeccion & { soloLectura?: boolean }) {
  const [apartado, setApartado] = useState(0)
  const e = h.examen
  const poner = (cambio: ExamenFisico) => cambiar({ examen: { ...e, ...cambio } })
  const c = (k: ClaveExamen) => (v: string) => poner({ [k]: v })
  const casilla = (k: ClaveExamen) => ({ marcada: e[k] === 'Sí', onChange: (v: boolean) => poner({ [k]: v ? 'Sí' : '' }) })

  const presion = (etiqueta: string, sis: ClaveExamen, dia: ClaveExamen) => (
    <Campo etiqueta={etiqueta} className="col-span-4">
      <span className="flex items-center gap-1.5">
        <Numero value={e[sis]} onChange={c(sis)} aria-label={`${etiqueta}: sistólica`} placeholder="Sistólica" />
        <span className="text-lg text-slate-400">/</span>
        <Numero value={e[dia]} onChange={c(dia)} aria-label={`${etiqueta}: diastólica`} placeholder="Diastólica" />
      </span>
    </Campo>
  )

  const bloques: Record<BloqueExamen, ReactNode> = {
    signos: (
      <Bloque titulo="Signos vitales y antropometría">
        <Campo etiqueta={<>SatO₂</>} className="col-span-2"><Numero value={e.satO2} onChange={c('satO2')} sufijo="%" /></Campo>
        <Campo etiqueta="Peso" className="col-span-2"><Numero value={e.peso} onChange={c('peso')} sufijo="kg" /></Campo>
        <Campo etiqueta="Talla" className="col-span-2"><Numero value={e.talla} onChange={c('talla')} sufijo="m" /></Campo>
        <Campo etiqueta="Índice de masa corporal" className="col-span-3"><Calculado valor={calcularIMC(e.peso, e.talla)} /></Campo>
        <Campo etiqueta="Temperatura" className="col-span-3"><Numero value={e.temperatura} onChange={c('temperatura')} sufijo="°C" /></Campo>

        <Campo etiqueta="Frecuencia cardíaca" className="col-span-2"><Numero value={e.fc} onChange={c('fc')} /></Campo>
        <Campo etiqueta="Frecuencia respiratoria" className="col-span-2"><Numero value={e.fr} onChange={c('fr')} /></Campo>
        <Campo etiqueta="Cadera" className="col-span-2"><Numero value={e.cadera} onChange={c('cadera')} sufijo="cm" /></Campo>
        <Campo etiqueta="Cintura" className="col-span-3"><Numero value={e.cintura} onChange={c('cintura')} sufijo="cm" /></Campo>
        <Campo etiqueta="Índice cintura/cadera" className="col-span-3"><Calculado valor={calcularICC(e.cintura, e.cadera)} /></Campo>

        <p className="col-span-12 -mb-1 text-sm font-semibold text-slate-700">Presión arterial (sistólica / diastólica)</p>
        {presion('De pie', 'paPieSis', 'paPieDia')}
        {presion('Sentado', 'paSentadoSis', 'paSentadoDia')}
        {presion('Acostado', 'paAcostadoSis', 'paAcostadoDia')}
      </Bloque>
    ),
    piel: (
      <Bloque titulo="Piel">
        <Campo etiqueta="Piel" className="col-span-12"><Area value={e.piel} onChange={c('piel')} filas={2} /></Campo>
      </Bloque>
    ),
    generales: (
      <Bloque titulo="Condiciones clínicas generales">
        <Campo etiqueta="Estado hemodinámico" className="col-span-4">
          <Selector value={e.estadoHemodinamico} onChange={c('estadoHemodinamico')} opciones={EXAMEN.estadoHemodinamico} />
        </Campo>
        <Campo etiqueta="Llenado capilar" className="col-span-8">
          <Opciones value={e.llenadoCapilar} onChange={c('llenadoCapilar')} opciones={EXAMEN.llenadoCapilar} />
        </Campo>
      </Bloque>
    ),
    cuello: (
      <Bloque titulo="Cuello">
        <Campo etiqueta="Pulso venoso yugular" className="col-span-6"><Texto value={e.pulsoVenosoYugular} onChange={c('pulsoVenosoYugular')} /></Campo>
        <Campo etiqueta="Pulso arterial" className="col-span-6"><Texto value={e.pulsoArterial} onChange={c('pulsoArterial')} /></Campo>
        <Campo etiqueta="Soplo carotídeo" className="col-span-5">
          <Opciones
            value={e.soploCarotideo}
            onChange={(v) => poner({ soploCarotideo: v, soploLado: v === 'Con soplo' ? e.soploLado : '' })}
            opciones={EXAMEN.soploCarotideo}
          />
        </Campo>
        {e.soploCarotideo === 'Con soplo' && (
          <Campo etiqueta="Lado del soplo" className="col-span-7">
            <Opciones value={e.soploLado} onChange={c('soploLado')} opciones={EXAMEN.soploLado} />
          </Campo>
        )}
      </Bloque>
    ),
    torax: (
      <Bloque titulo="Tórax">
        <Campo etiqueta="Simetría" className="col-span-5">
          <Opciones value={e.toraxSimetria} onChange={c('toraxSimetria')} opciones={EXAMEN.toraxSimetria} />
        </Campo>
        <Campo etiqueta="Expansibilidad" className="col-span-7">
          <Selector value={e.expansibilidad} onChange={c('expansibilidad')} opciones={OPCIONES_POR_DEFINIR.expansibilidad} />
        </Campo>
        <Campo etiqueta="Ápex visible" className="col-span-3">
          <Opciones value={e.apexVisible} onChange={c('apexVisible')} opciones={SI_NO} />
        </Campo>
        <div className="col-span-3 flex items-end pb-1.5">
          <Casilla etiqueta="Ápex palpable" {...casilla('apexPalpable')} />
        </div>
        <Campo etiqueta="Tipo de ápex" className="col-span-6">
          <Opciones value={e.apexTipo} onChange={c('apexTipo')} opciones={EXAMEN.apexTipo} />
        </Campo>
      </Bloque>
    ),
    ruidosCardiacos: (
      <Bloque titulo="Ruidos cardíacos">
        <Campo etiqueta="Ruidos cardíacos" className="col-span-12">
          <Opciones value={e.ritmoCardiaco} onChange={c('ritmoCardiaco')} opciones={EXAMEN.ritmoCardiaco} />
        </Campo>

        <Campo etiqueta="Primer ruido" className="col-span-3">
          <Selector value={e.primerRuido} onChange={c('primerRuido')} opciones={OPCIONES_POR_DEFINIR.primerRuido} />
        </Campo>
        <Campo etiqueta="Observación del primer ruido" className="col-span-6">
          <Texto value={e.primerRuidoObs} onChange={c('primerRuidoObs')} />
        </Campo>
        <Campo etiqueta="Sístole" className="col-span-3">
          <Selector value={e.sistole} onChange={c('sistole')} opciones={OPCIONES_POR_DEFINIR.sistole} />
        </Campo>

        <Campo etiqueta="Segundo ruido" className="col-span-3">
          <Selector value={e.segundoRuido} onChange={c('segundoRuido')} opciones={OPCIONES_POR_DEFINIR.segundoRuido} />
        </Campo>
        <Campo etiqueta="Observación del segundo ruido" className="col-span-6">
          <Texto value={e.segundoRuidoObs} onChange={c('segundoRuidoObs')} />
        </Campo>
        <Campo etiqueta="Diástole" className="col-span-3">
          <Selector value={e.diastole} onChange={c('diastole')} opciones={OPCIONES_POR_DEFINIR.diastole} />
        </Campo>

        <div className="col-span-12 flex gap-6">
          <Casilla etiqueta="R3" {...casilla('r3')} />
          <Casilla etiqueta="R4" {...casilla('r4')} />
        </div>
      </Bloque>
    ),
    ruidosRespiratorios: (
      <Bloque titulo="Ruidos respiratorios">
        <Campo etiqueta="Ruidos respiratorios" className="col-span-6">
          <Opciones
            value={e.ruidosResp}
            onChange={(v) => poner({ ruidosResp: v, agregados: v === 'Con agregados' ? e.agregados : '' })}
            opciones={EXAMEN.ruidosResp}
          />
        </Campo>
        {e.ruidosResp === 'Con agregados' && (
          <Campo etiqueta="Tipo de agregados" className="col-span-6">
            <Opciones value={e.agregados} onChange={c('agregados')} opciones={EXAMEN.agregados} />
          </Campo>
        )}
        <Campo etiqueta="Observación" className="col-span-12"><Area value={e.ruidosRespObs} onChange={c('ruidosRespObs')} filas={2} /></Campo>
      </Bloque>
    ),
    abdomen: (
      <Bloque titulo="Abdomen">
        <Campo etiqueta="Circunferencia abdominal" className="col-span-3"><Numero value={e.circAbdominal} onChange={c('circAbdominal')} sufijo="cm" /></Campo>
        <Campo etiqueta="Ruidos hidroaéreos" className="col-span-3">
          <Selector value={e.ruidosHidroaereos} onChange={c('ruidosHidroaereos')} opciones={OPCIONES_POR_DEFINIR.ruidosHidroaereos} />
        </Campo>
        <Campo etiqueta="Blando" className="col-span-3"><Opciones value={e.abdomenBlando} onChange={c('abdomenBlando')} opciones={SI_NO} /></Campo>
        <Campo etiqueta="Visceromegalia" className="col-span-3"><Opciones value={e.visceromegalia} onChange={c('visceromegalia')} opciones={SI_NO} /></Campo>
        <Campo etiqueta="Observación" className="col-span-12"><Area value={e.abdomenObs} onChange={c('abdomenObs')} filas={2} /></Campo>
      </Bloque>
    ),
    miembros: (
      <Bloque titulo="Miembros inferiores">
        <Campo etiqueta="Simetría" className="col-span-5">
          <Opciones value={e.miSimetria} onChange={c('miSimetria')} opciones={MIEMBROS_SIMETRIA} />
        </Campo>
        <Campo etiqueta="Edema" className="col-span-7">
          <Opciones
            value={e.edema}
            onChange={(v) => poner({ edema: v, ...(v === 'Presente' ? {} : { edemaLado: '', edemaGrado: '' }) })}
            opciones={EXAMEN.edema}
          />
        </Campo>
        {e.edema === 'Presente' && (
          <>
            <Campo etiqueta="Lado del edema" className="col-span-5">
              <Selector
                value={e.edemaLado}
                onChange={c('edemaLado')}
                grupos={[
                  { etiqueta: 'Miembros inferiores', opciones: EXAMEN.edemaLadoInferiores },
                  { etiqueta: 'Miembros superiores', opciones: EXAMEN.edemaLadoSuperiores },
                ]}
              />
            </Campo>
            <Campo etiqueta="Grado" className="col-span-7">
              <Opciones value={e.edemaGrado} onChange={c('edemaGrado')} opciones={EXAMEN.edemaGrado} />
            </Campo>
          </>
        )}
      </Bloque>
    ),
    neurologico: (
      <Bloque titulo="Neurológico">
        <Campo etiqueta="Estado de conciencia" className="col-span-12">
          <Opciones value={e.conciencia} onChange={c('conciencia')} opciones={EXAMEN.conciencia} />
        </Campo>
        <Campo etiqueta="Orientado" className="col-span-3"><Opciones value={e.orientado} onChange={c('orientado')} opciones={SI_NO} /></Campo>
        <Campo etiqueta="Marcha" className="col-span-3"><Opciones value={e.marcha} onChange={c('marcha')} opciones={EXAMEN.marcha} /></Campo>
        <Campo etiqueta="Lenguaje coherente" className="col-span-3"><Opciones value={e.lenguajeCoherente} onChange={c('lenguajeCoherente')} opciones={SI_NO} /></Campo>
        <Campo etiqueta="Disartria" className="col-span-3"><Opciones value={e.disartria} onChange={c('disartria')} opciones={SI_NO} /></Campo>

        <p className="col-span-12 -mb-1 text-sm font-semibold text-slate-700">Fuerza motora por miembro</p>
        <Campo etiqueta="MSD" className="col-span-3"><Texto value={e.fuerzaMSD} onChange={c('fuerzaMSD')} /></Campo>
        <Campo etiqueta="MSI" className="col-span-3"><Texto value={e.fuerzaMSI} onChange={c('fuerzaMSI')} /></Campo>
        <Campo etiqueta="MID" className="col-span-3"><Texto value={e.fuerzaMID} onChange={c('fuerzaMID')} /></Campo>
        <Campo etiqueta="MII" className="col-span-3"><Texto value={e.fuerzaMII} onChange={c('fuerzaMII')} /></Campo>
        <Campo etiqueta="Observaciones" className="col-span-12"><Area value={e.neuroObs} onChange={c('neuroObs')} filas={2} /></Campo>
      </Bloque>
    ),
  }

  return (
    <div>
      <div className="mb-4 flex gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-xs" role="tablist" aria-label="Apartados del examen físico">
        {APARTADOS_EXAMEN.map((a, i) => (
          <button
            key={a.titulo}
            type="button"
            role="tab"
            aria-selected={apartado === i}
            onClick={() => setApartado(i)}
            className={cx(
              'flex-1 rounded-md px-3 py-2 text-left text-sm transition',
              apartado === i ? 'bg-accion-600 text-white' : 'text-slate-700 hover:bg-slate-100',
            )}
          >
            <span className="block text-xs font-semibold uppercase tracking-wide opacity-80">Apartado {i + 1}</span>
            <span className="block font-medium">{a.titulo}</span>
          </button>
        ))}
      </div>
      {/* Los apartados son navegación y quedan fuera del bloqueo de solo lectura. */}
      <fieldset disabled={soloLectura} className="space-y-4">
        {APARTADOS_EXAMEN[apartado].bloques.map((b) => (
          <div key={b}>{bloques[b]}</div>
        ))}
      </fieldset>
    </div>
  )
}
