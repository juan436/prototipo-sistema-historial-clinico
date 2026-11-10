import { ETT_NUMERICOS, GRUPOS_LABORATORIO, HABITOS, PARENTESCOS } from '../data/opciones'
import { APARTADOS_EXAMEN, ECG_RITMO_AYUDA, type BloqueExamen } from '../data/supuestos'
import type { ExamenFisico, FilaAntecedente, Historia } from '../types'
import { calcularICC, calcularIMC } from '../utils'

// Textos de la historia impresa: formato narrativo y compacto, en línea corrida
// («Peso 70; Talla 1,70; Índice de masa corporal 24,2; …»). Solo se imprime lo que tiene valor.

const v = (s: string | undefined) => (s ?? '').trim()
const par = (etiqueta: string, valor: string | undefined, sufijo = '') => (v(valor) ? `${etiqueta} ${v(valor)}${sufijo}` : '')
const unir = (partes: string[]) => partes.filter(Boolean).join('; ')
const sinPunto = (s: string) => s.replace(/[.;\s]+$/, '')

export const textoAntecedentes = (filas: FilaAntecedente[]) =>
  unir(filas.map((f) => (v(f.observacion) ? `${f.descripcion} (${sinPunto(v(f.observacion))})` : f.descripcion)))

export const textoFamiliares = (h: Historia) => unir(PARENTESCOS.map((p) => (v(h.familiares[p]) ? `${p}: ${sinPunto(v(h.familiares[p]))}` : '')))
export const textoPsicobiologicos = (h: Historia) => unir(HABITOS.map((p) => (v(h.psicobiologicos[p]) ? `${p}: ${sinPunto(v(h.psicobiologicos[p]))}` : '')))

const presion = (etiqueta: string, sis?: string, dia?: string) => (v(sis) || v(dia) ? `${etiqueta} ${v(sis) || '—'}/${v(dia) || '—'}` : '')

function bloquesExamen(e: ExamenFisico): Record<BloqueExamen, string> {
  return {
    signos: unir([
      par('SatO₂', e.satO2, ' %'), par('Peso', e.peso), par('Talla', e.talla),
      par('Índice de masa corporal', calcularIMC(e.peso, e.talla)), par('Temperatura', e.temperatura),
      par('Frecuencia cardíaca', e.fc), par('Frecuencia respiratoria', e.fr), par('Cadera', e.cadera), par('Cintura', e.cintura),
      par('Índice cintura/cadera', calcularICC(e.cintura, e.cadera)),
      presion('De pie', e.paPieSis, e.paPieDia), presion('Sentado', e.paSentadoSis, e.paSentadoDia), presion('Acostado', e.paAcostadoSis, e.paAcostadoDia),
    ]),
    piel: par('Piel:', sinPunto(v(e.piel))),
    generales: unir([par('Estado hemodinámico', e.estadoHemodinamico), par('Llenado capilar', e.llenadoCapilar?.toLowerCase())]),
    cuello: unir([
      par('Pulso venoso yugular:', e.pulsoVenosoYugular), par('Pulso arterial:', e.pulsoArterial),
      v(e.soploCarotideo) ? `Carótidas ${v(e.soploCarotideo).toLowerCase()}${v(e.soploLado) ? ` (${v(e.soploLado).toLowerCase()})` : ''}` : '',
    ]),
    torax: unir([
      par('Tórax', e.toraxSimetria?.toLowerCase()), par('Expansibilidad', e.expansibilidad), par('Ápex visible:', e.apexVisible?.toLowerCase()),
      e.apexPalpable === 'Sí' ? 'Ápex palpable' : '', par('Ápex', e.apexTipo?.toLowerCase()),
    ]),
    ruidosCardiacos: unir([
      par('Ruidos cardíacos', e.ritmoCardiaco?.toLowerCase()),
      par('Primer ruido', [v(e.primerRuido), sinPunto(v(e.primerRuidoObs))].filter(Boolean).join(', ')), par('Sístole', e.sistole),
      par('Segundo ruido', [v(e.segundoRuido), sinPunto(v(e.segundoRuidoObs))].filter(Boolean).join(', ')), par('Diástole', e.diastole),
      e.r3 === 'Sí' ? 'R3' : '', e.r4 === 'Sí' ? 'R4' : '',
    ]),
    ruidosRespiratorios: unir([
      v(e.ruidosResp) ? `Ruidos respiratorios ${v(e.ruidosResp).toLowerCase()}${v(e.agregados) ? ` (${v(e.agregados).toLowerCase()})` : ''}` : '',
      sinPunto(v(e.ruidosRespObs)),
    ]),
    abdomen: unir([
      par('Circunferencia abdominal', e.circAbdominal), par('Ruidos hidroaéreos', e.ruidosHidroaereos), par('Abdomen blando:', e.abdomenBlando?.toLowerCase()),
      par('Visceromegalia:', e.visceromegalia?.toLowerCase()), sinPunto(v(e.abdomenObs)),
    ]),
    miembros: unir([
      par('Miembros inferiores', e.miSimetria?.toLowerCase()),
      v(e.edema) ? `Edema ${v(e.edema).toLowerCase()}${v(e.edemaLado) ? ` en ${v(e.edemaLado)}` : ''}${v(e.edemaGrado) ? `, grado ${v(e.edemaGrado)}` : ''}` : '',
    ]),
    neurologico: unir([
      par('Estado de conciencia:', e.conciencia?.toLowerCase()), par('Orientado:', e.orientado?.toLowerCase()), par('Marcha', e.marcha?.toLowerCase()),
      par('Lenguaje coherente:', e.lenguajeCoherente?.toLowerCase()), par('Disartria:', e.disartria?.toLowerCase()),
      par('Fuerza motora', unir([par('MSD', e.fuerzaMSD), par('MSI', e.fuerzaMSI), par('MID', e.fuerzaMID), par('MII', e.fuerzaMII)]).replace(/; /g, ', ')),
      sinPunto(v(e.neuroObs)),
    ]),
  }
}

/** Examen físico en línea corrida, siguiendo el orden de los apartados configurados. */
export const textoExamen = (h: Historia) => {
  const b = bloquesExamen(h.examen)
  return unir(APARTADOS_EXAMEN.flatMap((a) => a.bloques.map((id) => b[id])))
}

export const textoEcg = (h: Historia) => {
  const g = h.ecg
  return unir([
    par('Ritmo', (ECG_RITMO_AYUDA[v(g.ritmo)] ?? v(g.ritmo)).toLowerCase()),
    par('FC', g.fc), par('PR', g.pr), par('QRS', g.qrs), par('QT', g.qt), par('QTC', g.qtc),
    v(g.eje) || v(g.ejeValor) ? `Eje ${[v(g.ejeValor), v(g.eje).toLowerCase()].filter(Boolean).join(', ')}` : '',
    sinPunto(v(g.descripcion)),
  ])
}

export const textoLaboratorios = (h: Historia) =>
  [
    ...GRUPOS_LABORATORIO.map((g) => {
      const campos = g.campos.map((c) => par(c, h.laboratorios[c])).filter(Boolean)
      return campos.length ? `${g.grupo}: ${campos.join(', ')}` : ''
    }),
    v(h.laboratoriosOtros) ? `Otros: ${sinPunto(v(h.laboratoriosOtros))}` : '',
  ]
    .filter(Boolean)
    .join('. ')

/** ETT: solo lo escrito en los campos. La imagen del informe NO se imprime. */
export const textoEtt = (h: Historia) => {
  const t = h.ett
  return unir([
    par('Fecha del estudio', t.fecha), par('VI', t.vi?.toLowerCase()), par('FEVI', t.fevi), par('IMS', t.ims?.toLowerCase()),
    ...ETT_NUMERICOS.map((n) => par(n.etiqueta, t[n.clave])),
    par('Valvulopatías:', sinPunto(v(t.valvulopatias))), par('Observaciones:', sinPunto(v(t.observaciones))),
  ])
}
