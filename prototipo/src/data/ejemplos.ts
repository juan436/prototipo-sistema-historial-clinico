// =====================================================================
// DATOS DE EJEMPLO — TODOS INVENTADOS.
// Ningún nombre, cédula, teléfono, correo, registro profesional ni dato
// clínico corresponde a una persona real.
// =====================================================================
import type { FilaTratamiento, Historia, Paciente, Usuario } from '../types'
import { posologiaPorDefecto } from './supuestos'

/** Logo de muestra (monograma ficticio) para ver el membrete con imagen. */
const LOGO_MUESTRA =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><circle cx="60" cy="60" r="56" fill="#fff" stroke="#be123c" stroke-width="5"/><text x="60" y="76" font-family="Georgia,serif" font-size="46" font-weight="700" text-anchor="middle" fill="#be123c">AR</text></svg>`,
  )

export const USUARIOS_EJEMPLO: Usuario[] = [
  {
    id: 'u-ana',
    nombre: 'Dra. Ana Rojas',
    correo: 'ana.rojas@ejemplo.test',
    rol: 'medico',
    activo: true,
    perfil: { ci: 'V-00.000.001', mpps: '000001', cml: '0001', logo: LOGO_MUESTRA },
  },
  {
    id: 'u-luis',
    nombre: 'Dr. Luis Prado',
    correo: 'luis.prado@ejemplo.test',
    rol: 'medico',
    activo: true,
    perfil: { ci: 'V-00.000.002', mpps: '000002', cml: '0002' },
  },
  { id: 'u-admin', nombre: 'Administrador', correo: 'admin@ejemplo.test', rol: 'admin', activo: true },
]

const VACIO = { pais: 'Venezuela', telefono2: '' }

export const PACIENTES_EJEMPLO: Paciente[] = [
  {
    ...VACIO, id: 'p-1', cedula: 'V-99.000.101', nombres: 'María Fernanda', apellidos: 'Quintero Sosa',
    sexo: 'Femenino', fechaNacimiento: '1958-03-14', direccion: 'Av. Ficticia, Edif. Ejemplo, piso 2, apto. 2-B',
    estado: 'Mérida', municipio: 'Libertador', telefono1: '0000-555.01.01', telefono2: '0000-555.01.02',
    correo: 'mf.quintero@ejemplo.test', ocupacion: 'Docente jubilada', nivelAcademico: 'Universitaria',
    medicoIds: ['u-ana'],
  },
  {
    ...VACIO, id: 'p-2', cedula: 'V-99.000.102', nombres: 'José Gregorio', apellidos: 'Belandria Mora',
    sexo: 'Masculino', fechaNacimiento: '1949-11-02', direccion: 'Calle Inventada n.º 12, sector De Prueba',
    estado: 'Mérida', municipio: 'Campo Elías', telefono1: '0000-555.01.03',
    correo: '', ocupacion: 'Comerciante', nivelAcademico: 'Secundaria',
    medicoIds: ['u-ana', 'u-luis'], // vinculado a los dos médicos
  },
  {
    ...VACIO, id: 'p-3', cedula: 'V-99.000.103', nombres: 'Rosa Elvira', apellidos: 'Camacho Duarte',
    sexo: 'Femenino', fechaNacimiento: '1972-07-25', direccion: 'Urb. Imaginaria, calle 3, casa 45',
    estado: 'Táchira', municipio: 'San Cristóbal', telefono1: '0000-555.01.04',
    correo: 'rosa.camacho@ejemplo.test', ocupacion: 'Enfermera', nivelAcademico: 'Técnico',
    medicoIds: ['u-luis'],
  },
  {
    ...VACIO, id: 'p-4', cedula: 'V-99.000.104', nombres: 'Pedro Antonio', apellidos: 'Lugo Rivas',
    sexo: 'Masculino', fechaNacimiento: '1985-01-09', direccion: 'Residencias Modelo, torre A, apto. 7',
    estado: 'Mérida', municipio: 'Libertador', telefono1: '0000-555.01.05',
    correo: 'pedro.lugo@ejemplo.test', ocupacion: 'Ingeniero', nivelAcademico: 'Universitaria',
    medicoIds: ['u-ana'],
  },
  {
    ...VACIO, id: 'p-5', cedula: 'V-99.000.105', nombres: 'Yolanda Beatriz', apellidos: 'Parra Núñez',
    sexo: 'Femenino', fechaNacimiento: '1964-09-30', direccion: 'Sector Ejemplo, vereda 8, casa 3',
    estado: 'Barinas', municipio: 'Barinas', telefono1: '0000-555.01.06',
    correo: '', ocupacion: 'Ama de casa', nivelAcademico: 'Primaria',
    medicoIds: ['u-luis'],
  },
  {
    ...VACIO, id: 'p-6', cedula: 'V-99.000.106', nombres: 'Andrés Eloy', apellidos: 'Sequera Blanco',
    sexo: 'Masculino', fechaNacimiento: '1996-05-18', direccion: 'Av. De Muestra, quinta Demo',
    estado: 'Mérida', municipio: 'Libertador', telefono1: '0000-555.01.07',
    correo: 'andres.sequera@ejemplo.test', ocupacion: 'Estudiante', nivelAcademico: 'Universitaria',
    medicoIds: ['u-ana'],
  },
  {
    ...VACIO, id: 'p-7', cedula: 'V-99.000.107', nombres: 'Carlos Alberto', apellidos: 'Mendoza Pino',
    sexo: 'Masculino', fechaNacimiento: '1955-12-06', direccion: 'Calle Simulada, casa s/n',
    estado: 'Trujillo', municipio: 'Valera', telefono1: '0000-555.01.08',
    correo: '', ocupacion: 'Agricultor', nivelAcademico: 'Analfabeta',
    medicoIds: ['u-luis'], // sirve para probar la vinculación desde la sesión de la Dra. Rojas
  },
]

let n = 0
const tto = (farmaco: string, concentracion: string, horario: string): FilaTratamiento => ({
  id: `t-${++n}`, farmaco, concentracion, posologia: posologiaPorDefecto(concentracion), horario, libre: false,
})
const ant = (descripcion: string, observacion: string) => ({ id: `a-${++n}`, descripcion, observacion })

const HISTORIA_VACIA = {
  motivos: [], enfermedadActual: '', antecedentes: [], intervenciones: [], familiares: {}, psicobiologicos: {},
  examen: {}, ecg: {}, laboratorios: {}, laboratoriosOtros: '', ett: {}, diagnostico: '', tratamiento: [], plan: '',
}

export const HISTORIAS_EJEMPLO: Historia[] = [
  // ---------- 1. COMPLETA — Dra. Rojas ----------
  {
    id: 'h-1', numero: 1, pacienteId: 'p-1', medicoId: 'u-ana', fechaConsulta: '2026-09-22',
    motivos: ['Cifras de presión arterial elevadas', 'Cefalea', 'Mareos'],
    enfermedadActual:
      'Paciente femenina que refiere inicio de enfermedad actual hace 3 semanas, caracterizada por cefalea occipital de moderada intensidad, opresiva, acompañada de mareos y registros domiciliarios de presión arterial de hasta 170/100 mmHg, sin mejoría con el tratamiento habitual, por lo que acude a valoración.',
    antecedentes: [
      ant('Hipertensión arterial', 'Diagnosticada hace 12 años, en tratamiento irregular'),
      ant('Dislipidemia', 'Sin tratamiento actual'),
      ant('Gastritis', ''),
    ],
    intervenciones: [ant('Colecistectomía', 'Hace 15 años, sin complicaciones'), ant('Cataratas', 'Ojo derecho')],
    familiares: { Madre: 'Hipertensión arterial. Fallecida por ECV.', Padre: 'Diabetes.', Hermanos: 'Una hermana hipertensa.', Otros: 'Niega.' },
    psicobiologicos: { Tabaquismo: 'Niega.', Chimó: 'Niega.', OH: 'Ocasional, social.', 'Sustancias ilícitas': 'Niega.' },
    examen: {
      satO2: '97', peso: '72', talla: '1,58', temperatura: '36,5', fc: '82', fr: '18', cadera: '104', cintura: '96',
      paPieSis: '158', paPieDia: '96', paSentadoSis: '162', paSentadoDia: '98', paAcostadoSis: '160', paAcostadoDia: '94',
      piel: 'Normocoloreada, hidratada, sin lesiones.', estadoHemodinamico: 'Estable', llenadoCapilar: 'Menor a 3 s',
      pulsoVenosoYugular: 'No ingurgitado a 45°', pulsoArterial: 'Simétrico, de buena amplitud',
      soploCarotideo: 'Sin soplo', toraxSimetria: 'Simétricos', apexVisible: 'No', apexPalpable: 'Sí', apexTipo: 'Normodinámico',
      ritmoCardiaco: 'Rítmico', primerRuido: '', primerRuidoObs: 'Único, de intensidad normal.',
      segundoRuido: '', segundoRuidoObs: 'Reforzado en foco aórtico.',
      ruidosResp: 'Normal', ruidosRespObs: 'Presentes en ambos campos pulmonares, sin agregados.',
      circAbdominal: '98', abdomenBlando: 'Sí', visceromegalia: 'No', abdomenObs: 'Depresible, no doloroso.',
      miSimetria: 'Simétricos', edema: 'Ausente',
      conciencia: 'Vigil', orientado: 'Sí', marcha: 'Normal', lenguajeCoherente: 'Sí', disartria: 'No',
      fuerzaMSD: 'V/V', fuerzaMSI: 'V/V', fuerzaMID: 'V/V', fuerzaMII: 'V/V', neuroObs: 'Sin déficit focal.',
    },
    ecg: { ritmo: 'S', fc: '80', pr: '0,16', qrs: '0,09', qt: '0,36', qtc: '0,41', eje: 'Desviado a la izquierda', ejeValor: '-20', descripcion: 'Signos de crecimiento ventricular izquierdo. Sin trastornos agudos de la repolarización.' },
    laboratorios: {
      Hb: '13,4', GB: '6.800', Seg: '58', Plaq: '245.000', 'Glucemia basal': '98', Urea: '32', Creatinina: '0,9',
      TP: '12,5', INR: '1,0', TTP: '30', Leucos: '0-2', Nitritos: 'Negativo', Bacterias: 'Escasas', VIH: 'Negativo', VDRL: 'No reactivo',
      CT: '236', LDLc: '152', TG: '180', TGO: '24', TGP: '28', PT: '7,1', ALB: '4,2',
      Sodio: '139', Potasio: '4,2', Cloro: '102', Calcio: '9,4', Magnesio: '2,0', TSH: '2,1', T3L: '3,0', T4L: '1,2',
      NTproBNP: '95', BNP: '40', 'Troponina I': 'Negativa', 'Dímero D': '0,3',
    },
    laboratoriosOtros: 'Ácido úrico 5,8.',
    ett: {
      fecha: '18/09/2026', vi: 'No dilatado', fevi: '62', ims: 'Aumentado', imvi: '112', grp: '0,46', volAi: '30', volAd: '22',
      tapse: '22', vmit: '2,3', valvulopatias: 'Esclerosis valvular aórtica sin estenosis.', observaciones: 'Hipertrofia concéntrica del ventrículo izquierdo. Disfunción diastólica grado I.',
    },
    diagnostico: '1. Hipertensión arterial sistémica no controlada.\n2. Cardiopatía hipertensiva con función sistólica conservada.\n3. Dislipidemia mixta.',
    tratamiento: [tto('Candesartán', '16 mg', '8am'), tto('Amlodipina', '5 mg', '8pm'), tto('Atorvastatina', '20 mg', '9pm')],
    plan: 'Dieta hiposódica y baja en grasas. Control domiciliario de presión arterial dos veces al día con registro. Actividad física aeróbica 30 minutos, 5 días a la semana. Control en 4 semanas con registro de presión arterial.',
  },

  // ---------- 2. COMPLETA — Dra. Rojas (paciente compartido) ----------
  {
    id: 'h-2', numero: 2, pacienteId: 'p-2', medicoId: 'u-ana', fechaConsulta: '2026-10-06',
    motivos: ['Disnea', 'Edema', 'Palpitaciones'],
    enfermedadActual:
      'Paciente masculino que refiere disnea progresiva de 2 meses de evolución, actualmente a pequeños esfuerzos, con ortopnea de dos almohadas y edema vespertino de miembros inferiores. Se asocian palpitaciones irregulares de aparición reciente.',
    antecedentes: [
      ant('Hipertensión arterial', 'Más de 20 años de evolución'),
      ant('IM', 'Hace 6 años, tratamiento médico'),
      ant('Insuficiencia cardíaca', ''),
      ant('Diabetes', 'Tipo 2, en tratamiento oral'),
      ant('Arritmia', 'Fibrilación auricular de reciente diagnóstico'),
    ],
    intervenciones: [ant('Hernioplastia', 'Inguinal derecha'), ant('Prostatectomía', '')],
    familiares: { Madre: 'Diabetes.', Padre: 'Fallecido por IM a los 62 años.', Hermanos: 'Un hermano con cardiopatía isquémica.', Otros: 'Niega.' },
    psicobiologicos: { Tabaquismo: '20 cigarrillos al día por 30 años. Suspendido hace 6 años.', Chimó: 'Ocasional.', OH: 'Fines de semana, suspendido.', 'Sustancias ilícitas': 'Niega.' },
    examen: {
      satO2: '93', peso: '84', talla: '1,70', temperatura: '36,8', fc: '104', fr: '22', cadera: '100', cintura: '106',
      paPieSis: '108', paPieDia: '68', paSentadoSis: '112', paSentadoDia: '70', paAcostadoSis: '116', paAcostadoDia: '72',
      piel: 'Palidez cutánea leve, fría en extremidades.', estadoHemodinamico: 'Estable', llenadoCapilar: 'Menor a 3 s',
      pulsoVenosoYugular: 'Ingurgitación yugular a 45°', pulsoArterial: 'Irregular, de amplitud variable',
      soploCarotideo: 'Con soplo', soploLado: 'Derecha', toraxSimetria: 'Simétricos', apexVisible: 'Sí', apexPalpable: 'Sí', apexTipo: 'Sostenido',
      ritmoCardiaco: 'Arrítmico', primerRuido: '', primerRuidoObs: 'De intensidad variable.',
      segundoRuido: '', segundoRuidoObs: 'Único.', r3: 'Sí',
      ruidosResp: 'Con agregados', agregados: 'Crepitantes', ruidosRespObs: 'Crepitantes bibasales.',
      circAbdominal: '108', abdomenBlando: 'Sí', visceromegalia: 'Sí', abdomenObs: 'Hepatomegalia a 2 cm del reborde costal.',
      miSimetria: 'Simétricos', edema: 'Presente', edemaLado: 'Ambos miembros inferiores', edemaGrado: 'II',
      conciencia: 'Vigil', orientado: 'Sí', marcha: 'Normal', lenguajeCoherente: 'Sí', disartria: 'No',
      fuerzaMSD: 'V/V', fuerzaMSI: 'V/V', fuerzaMID: 'IV/V', fuerzaMII: 'IV/V', neuroObs: 'Sin déficit focal.',
    },
    ecg: { ritmo: 'NS', fc: '108', pr: '', qrs: '0,11', qt: '0,34', qtc: '0,45', eje: 'Desviado a la izquierda', ejeValor: '-40', descripcion: 'Fibrilación auricular con respuesta ventricular rápida. Onda Q en cara inferior.' },
    laboratorios: {
      Hb: '12,1', GB: '7.400', Seg: '64', Plaq: '198.000', 'Glucemia basal': '142', Urea: '58', Creatinina: '1,4',
      TP: '14', INR: '1,1', TTP: '32', Leucos: '2-4', Nitritos: 'Negativo', Bacterias: 'Escasas', VIH: 'Negativo', VDRL: 'No reactivo',
      CT: '188', LDLc: '118', TG: '160', TGO: '42', TGP: '48', PT: '6,4', ALB: '3,5',
      Sodio: '134', Potasio: '4,8', Cloro: '98', Calcio: '8,9', Magnesio: '1,8', TSH: '3,4', T3L: '2,6', T4L: '1,1',
      NTproBNP: '3.250', BNP: '820', 'Troponina I': 'Negativa', 'Dímero D': '0,6',
    },
    laboratoriosOtros: 'HbA1c 7,4.',
    ett: {
      fecha: '02/10/2026', vi: 'Dilatado', fevi: '32', ims: 'Aumentado', imvi: '138', grp: '0,34', volAi: '48', volAd: '36',
      tapse: '15', vmit: '1,6', valvulopatias: 'Insuficiencia mitral moderada funcional. Insuficiencia tricuspídea leve.', observaciones: 'Acinesia de pared inferior. Disfunción sistólica severa del ventrículo izquierdo.',
    },
    diagnostico: '1. Insuficiencia cardíaca con fracción de eyección reducida, descompensada.\n2. Cardiopatía isquémica crónica.\n3. Fibrilación auricular.\n4. Hipertensión arterial sistémica.\n5. Diabetes tipo 2.',
    tratamiento: [
      tto('Sacubitril/valsartán', '50 mg', '8am-8pm'), tto('Bisoprolol', '2,5 mg', '8am'), tto('Furosemida', '40 mg', '8am'),
      tto('Dapagliflozina', '10 mg', '8am'), tto('Apixabán', '5 mg', '8am-8pm'), tto('Atorvastatina', '40 mg', '9pm'),
    ],
    plan: 'Restricción hídrica a 1,5 litros al día y dieta hiposódica. Control de peso diario. Laboratorio de control (función renal y electrolitos) en 2 semanas. Reevaluación en 2 semanas para titulación de tratamiento.',
  },

  // ---------- 3. COMPLETA — Dr. Prado ----------
  {
    id: 'h-3', numero: 3, pacienteId: 'p-3', medicoId: 'u-luis', fechaConsulta: '2026-10-15',
    motivos: ['Valoración preoperatoria', 'Control cardiovascular'],
    enfermedadActual:
      'Paciente femenina asintomática desde el punto de vista cardiovascular, referida para valoración preoperatoria por cirugía electiva de tiroides. Niega dolor torácico, disnea, palpitaciones o síncope. Clase funcional I.',
    antecedentes: [ant('Hipotiroidismo', 'En tratamiento de reemplazo hormonal'), ant('Asma', 'Sin crisis en los últimos 5 años')],
    intervenciones: [ant('Apendicectomía', 'En la infancia'), ant('Histerectomía', 'Hace 4 años')],
    familiares: { Madre: 'Hipotiroidismo.', Padre: 'Hipertensión arterial.', Hermanos: 'Sanos.', Otros: 'Niega.' },
    psicobiologicos: { Tabaquismo: 'Niega.', Chimó: 'Niega.', OH: 'Niega.', 'Sustancias ilícitas': 'Niega.' },
    examen: {
      satO2: '98', peso: '63', talla: '1,62', temperatura: '36,4', fc: '70', fr: '16', cadera: '98', cintura: '80',
      paPieSis: '116', paPieDia: '74', paSentadoSis: '118', paSentadoDia: '76', paAcostadoSis: '120', paAcostadoDia: '76',
      piel: 'Normocoloreada, sin lesiones.', estadoHemodinamico: 'Estable', llenadoCapilar: 'Menor a 3 s',
      pulsoVenosoYugular: 'No ingurgitado', pulsoArterial: 'Simétrico, regular',
      soploCarotideo: 'Sin soplo', toraxSimetria: 'Simétricos', apexVisible: 'No', apexTipo: 'Normodinámico',
      ritmoCardiaco: 'Rítmico', primerRuido: '', primerRuidoObs: 'Normal.', segundoRuido: '', segundoRuidoObs: 'Normal.',
      ruidosResp: 'Normal', ruidosRespObs: 'Sin agregados.',
      circAbdominal: '82', abdomenBlando: 'Sí', visceromegalia: 'No', abdomenObs: 'Sin hallazgos.',
      miSimetria: 'Simétricos', edema: 'Ausente',
      conciencia: 'Vigil', orientado: 'Sí', marcha: 'Normal', lenguajeCoherente: 'Sí', disartria: 'No',
      fuerzaMSD: 'V/V', fuerzaMSI: 'V/V', fuerzaMID: 'V/V', fuerzaMII: 'V/V', neuroObs: 'Normal.',
    },
    ecg: { ritmo: 'S', fc: '68', pr: '0,14', qrs: '0,08', qt: '0,38', qtc: '0,40', eje: 'Normal', ejeValor: '45', descripcion: 'Trazado dentro de límites normales.' },
    laboratorios: {
      Hb: '13,0', GB: '5.900', Seg: '55', Plaq: '260.000', 'Glucemia basal': '88', Urea: '26', Creatinina: '0,7',
      TP: '12', INR: '1,0', TTP: '29', Leucos: '0-2', Nitritos: 'Negativo', Bacterias: 'Escasas', VIH: 'Negativo', VDRL: 'No reactivo',
      CT: '176', LDLc: '98', TG: '110', TGO: '20', TGP: '22', PT: '7,2', ALB: '4,4',
      Sodio: '140', Potasio: '4,1', Cloro: '103', Calcio: '9,5', Magnesio: '2,1', TSH: '2,8', T3L: '3,1', T4L: '1,3',
      NTproBNP: '60', BNP: '25', 'Troponina I': 'Negativa', 'Dímero D': '0,2',
    },
    laboratoriosOtros: 'Sin otros estudios.',
    ett: {
      fecha: '10/10/2026', vi: 'No dilatado', fevi: '65', ims: 'Disminuido', imvi: '78', grp: '0,38', volAi: '24', volAd: '20',
      tapse: '24', vmit: '2,6', valvulopatias: 'Sin valvulopatías significativas.', observaciones: 'Estudio dentro de límites normales.',
    },
    diagnostico: '1. Corazón estructuralmente sano.\n2. Riesgo cardiovascular perioperatorio bajo.\n3. Hipotiroidismo controlado.',
    tratamiento: [tto('Ácido acetilsalicílico (aspirina)', '81 mg', '8am')],
    plan: 'Sin contraindicación cardiovascular para la cirugía propuesta. Mantener tratamiento habitual. Control cardiovascular anual.',
  },

  // ---------- 4. INCOMPLETA — Dr. Prado (mismo paciente que la historia 2) ----------
  {
    ...HISTORIA_VACIA,
    id: 'h-4', numero: 4, pacienteId: 'p-2', medicoId: 'u-luis', fechaConsulta: '2026-10-29',
    motivos: ['Dolor torácico'],
    enfermedadActual: 'Paciente que acude por dolor torácico atípico de 2 días de evolución, punzante, que se modifica con los movimientos.',
    examen: { satO2: '95', peso: '83', talla: '1,70', fc: '88', paSentadoSis: '118', paSentadoDia: '72' },
    ecg: { ritmo: 'NS', fc: '90' },
  },

  // ---------- 5. INCOMPLETA — Dra. Rojas ----------
  {
    ...HISTORIA_VACIA,
    id: 'h-5', numero: 5, pacienteId: 'p-4', medicoId: 'u-ana', fechaConsulta: '2026-11-03',
    motivos: ['Palpitaciones', 'Mareos'],
    enfermedadActual: 'Paciente masculino que refiere palpitaciones de inicio súbito, de minutos de duración, asociadas al consumo de bebidas energizantes.',
    antecedentes: [ant('Gastritis', '')],
    psicobiologicos: { Tabaquismo: 'Niega.' },
  },
]
