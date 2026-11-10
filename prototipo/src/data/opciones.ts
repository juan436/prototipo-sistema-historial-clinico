// Listas EXACTAS tomadas de docs/01-instrucciones-prototipo-visual.md.
// No agregar opciones que no estén en el documento.

export const NOMBRE_SISTEMA = 'Historia Clínica Cardiológica'

export const SEXOS = ['Femenino', 'Masculino'] as const

export const NIVELES_ACADEMICOS = ['Analfabeta', 'Primaria', 'Secundaria', 'Técnico', 'Universitaria']

/** 6.2 — 25 motivos de consulta. */
export const MOTIVOS_CONSULTA = [
  'Cambio de coloración en miembros', 'Cefalea', 'Cifras de presión arterial elevadas', 'Cianosis',
  'Control cardiovascular', 'Debilidad', 'Disminución de fuerza muscular', 'Disnea',
  'Dolor en miembros inferiores', 'Dolor torácico', 'Edema', 'Evacuaciones líquidas', 'Fiebre',
  'Lesión en piel', 'Mareos', 'Movimientos involuntarios', 'Palpitaciones', 'Pérdida de la consciencia',
  'Referido', 'Sangrado', 'Tinnitus', 'Tos', 'Valoración preoperatoria', 'Vértigos', 'Visión borrosa',
]

/** 6.3 a — 44 antecedentes personales (patologías). */
export const ANTECEDENTES_PERSONALES = [
  'Hipertensión arterial', 'Enf. vascular cerebral', 'Enf. valvular cardíaca', 'IM', 'Angina inestable',
  'Angina estable', 'Insuficiencia cardíaca', 'Enfermedad de Chagas', 'Cardiopatía valvular', 'Arritmia',
  'Asma', 'EPOC', 'Trombosis venosa profunda', 'Tromboembolismo pulmonar', 'Anemia', 'Hemorragia',
  'Trastorno de conducción cardíaca', 'Enfermedad arterial periférica', 'Fibrosis pulmonar', 'Neumopatía',
  'Sepsis', 'Muerte súbita abortada', 'Trombo intracavitario', 'Cáncer', 'LOE', 'Preeclampsia', 'Eclampsia',
  'Insuficiencia venosa crónica', 'Artritis reumatoide', 'Epilepsia', 'Hipertiroidismo', 'Hipotiroidismo',
  'Enf. renal crónica', 'Úlcera péptica', 'Gastritis', 'Lupus', 'Síndrome antifosfolípidos', 'Portador de MCP',
  'Hernia discal', 'ITU', 'Diabetes', 'Dislipidemia', 'Vía accesoria', 'Otros',
]

/** 6.3 b — 15 intervenciones quirúrgicas. */
export const INTERVENCIONES_QUIRURGICAS = [
  'Histerectomía', 'Colecistectomía', 'Apendicectomía', 'Amigdalectomía', 'Tiroidectomía', 'Prostatectomía',
  'Hernioplastia', 'Varicocele', 'Cirugía valvular', 'TU', 'Miomatosis uterina', 'Cataratas', 'Safenectomía',
  'Fractura', 'Otros',
]

/** 6.4 — filas fijas. */
export const PARENTESCOS = ['Madre', 'Padre', 'Hermanos', 'Otros']
export const HABITOS = ['Tabaquismo', 'Chimó', 'OH', 'Sustancias ilícitas']

/** 6.5 — opciones del examen físico que sí están en el documento. */
export const EXAMEN = {
  /** «Estable», más las que se agreguen. */
  estadoHemodinamico: ['Estable'],
  llenadoCapilar: ['Menor a 3 s', 'Mayor a 3 s'],
  soploCarotideo: ['Con soplo', 'Sin soplo'],
  soploLado: ['Izquierda', 'Derecha', 'Ambas'],
  toraxSimetria: ['Simétricos', 'Asimétricos'],
  apexTipo: ['Normodinámico', 'Hiperdinámico', 'Sostenido'],
  ritmoCardiaco: ['Rítmico', 'Arrítmico'],
  ruidosResp: ['Normal', 'Con agregados', 'Abolidos'],
  agregados: ['Crepitantes', 'Bulosos'],
  edema: ['Presente', 'Ausente'],
  edemaLadoInferiores: ['MII', 'MID', 'Ambos miembros inferiores'],
  edemaLadoSuperiores: ['MSI', 'MSD', 'Ambos miembros superiores'],
  edemaGrado: ['I', 'II', 'III', 'IV'],
  conciencia: ['Vigil', 'Somnoliento', 'Estuporoso', 'Inconsciente'],
  marcha: ['Normal', 'Anormal'],
  siNo: ['Sí', 'No'],
}

/** 6.6 a — ECG. */
export const ECG_RITMO = ['S', 'NS']

/** 6.6 b — Laboratorios: grupo fijo y sus campos. Sin unidades (no se dieron). */
export const GRUPOS_LABORATORIO: { grupo: string; campos: string[] }[] = [
  { grupo: 'Hematología completa', campos: ['Hb', 'GB', 'Seg', 'Plaq'] },
  { grupo: 'Química sanguínea', campos: ['Glucemia basal', 'Urea', 'Creatinina'] },
  { grupo: 'Tiempos de coagulación', campos: ['TP', 'INR', 'TTP'] },
  { grupo: 'Uroanálisis', campos: ['Leucos', 'Nitritos', 'Bacterias'] },
  { grupo: 'Serología', campos: ['VIH', 'VDRL'] },
  { grupo: 'Perfil lipídico', campos: ['CT', 'LDLc', 'TG'] },
  { grupo: 'Perfil hepático', campos: ['TGO', 'TGP', 'PT', 'ALB'] },
  { grupo: 'Electrolitos séricos', campos: ['Sodio', 'Potasio', 'Cloro', 'Calcio', 'Magnesio'] },
  { grupo: 'H. tiroideas', campos: ['TSH', 'T3L', 'T4L'] },
  { grupo: 'Biomarcadores', campos: ['NTproBNP', 'BNP', 'Troponina I', 'Dímero D'] },
]

/** 6.6 c — ETT. */
export const ETT_VI = ['Dilatado', 'No dilatado']
export const ETT_IMS = ['Aumentado', 'Disminuido']
export const ETT_NUMERICOS: { clave: 'imvi' | 'grp' | 'volAi' | 'volAd' | 'tapse' | 'vmit'; etiqueta: string }[] = [
  { clave: 'imvi', etiqueta: 'IMVI' },
  { clave: 'grp', etiqueta: 'GRP' },
  { clave: 'volAi', etiqueta: 'VOL AI' },
  { clave: 'volAd', etiqueta: 'VOL AD' },
  { clave: 'tapse', etiqueta: 'TAPSE' },
  { clave: 'vmit', etiqueta: 'VMIT' },
]

/** Las 9 secciones de la historia, en el orden del documento (6). */
export const SECCIONES = [
  'Datos personales',
  'Motivo de consulta y enfermedad actual',
  'Antecedentes personales',
  'Antecedentes familiares y psicobiológicos',
  'Examen físico',
  'Paraclínicos',
  'Diagnóstico clínico',
  'Tratamiento',
  'Plan',
]
