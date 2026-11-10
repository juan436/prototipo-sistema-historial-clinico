export type Rol = 'medico' | 'admin'

export interface PerfilMedico {
  ci: string
  mpps: string
  cml: string
  /** Imagen del logo del membrete como data URL (solo local). */
  logo?: string
}

export interface Usuario {
  id: string
  nombre: string
  correo: string
  rol: Rol
  activo: boolean
  /** Solo los médicos tienen perfil. */
  perfil?: PerfilMedico
}

export interface DatosPersonales {
  cedula: string
  nombres: string
  apellidos: string
  sexo: '' | 'Femenino' | 'Masculino'
  fechaNacimiento: string // aaaa-mm-dd
  direccion: string
  pais: string
  estado: string
  municipio: string
  telefono1: string
  telefono2: string
  correo: string
  ocupacion: string
  nivelAcademico: string
}

export interface Paciente extends DatosPersonales {
  id: string
  /** Médicos vinculados (relación de muchos a muchos). */
  medicoIds: string[]
}

export interface FilaAntecedente {
  id: string
  descripcion: string
  observacion: string
}

export interface FilaTratamiento {
  id: string
  /** Copia del texto del fármaco (no una referencia al catálogo). */
  farmaco: string
  /** Concentración de la presentación elegida, p. ej. «8 mg». Vacía si es fármaco libre. */
  concentracion: string
  posologia: string
  horario: string
  /** true si el médico lo escribió a mano (no está en el catálogo). */
  libre: boolean
}

export type ClaveExamen =
  // Apartado 1
  | 'satO2' | 'peso' | 'talla' | 'temperatura' | 'fc' | 'fr' | 'cadera' | 'cintura'
  | 'paPieSis' | 'paPieDia' | 'paSentadoSis' | 'paSentadoDia' | 'paAcostadoSis' | 'paAcostadoDia'
  | 'piel' | 'estadoHemodinamico' | 'llenadoCapilar'
  | 'pulsoVenosoYugular' | 'pulsoArterial' | 'soploCarotideo' | 'soploLado'
  | 'toraxSimetria' | 'expansibilidad' | 'apexVisible' | 'apexPalpable' | 'apexTipo'
  // Apartado 2
  | 'ritmoCardiaco' | 'primerRuido' | 'primerRuidoObs' | 'sistole'
  | 'segundoRuido' | 'segundoRuidoObs' | 'diastole' | 'r3' | 'r4'
  | 'ruidosResp' | 'agregados' | 'ruidosRespObs'
  // Apartado 3
  | 'circAbdominal' | 'ruidosHidroaereos' | 'abdomenBlando' | 'visceromegalia' | 'abdomenObs'
  | 'miSimetria' | 'edema' | 'edemaLado' | 'edemaGrado'
  | 'conciencia' | 'orientado' | 'marcha' | 'lenguajeCoherente' | 'disartria'
  | 'fuerzaMSD' | 'fuerzaMSI' | 'fuerzaMID' | 'fuerzaMII' | 'neuroObs'

/** Todos los valores se guardan como texto; las casillas guardan «Sí» o vacío. */
export type ExamenFisico = Partial<Record<ClaveExamen, string>>

export type ClaveEcg = 'ritmo' | 'fc' | 'pr' | 'qrs' | 'qt' | 'qtc' | 'eje' | 'ejeValor' | 'descripcion'
export type Ecg = Partial<Record<ClaveEcg, string>>

export type ClaveEtt =
  | 'fecha' | 'vi' | 'fevi' | 'ims' | 'imvi' | 'grp' | 'volAi' | 'volAd' | 'tapse' | 'vmit'
  | 'valvulopatias' | 'observaciones'
  | 'imagen' | 'imagenNombre'
export type Ett = Partial<Record<ClaveEtt, string>>

export interface Historia {
  id: string
  numero: number
  pacienteId: string
  /** Médico que hizo la historia: solo él (y el admin) la ve. */
  medicoId: string
  fechaConsulta: string // aaaa-mm-dd
  motivos: string[]
  enfermedadActual: string
  antecedentes: FilaAntecedente[]
  intervenciones: FilaAntecedente[]
  /** Clave: parentesco (Madre, Padre, Hermanos, Otros). */
  familiares: Record<string, string>
  /** Clave: hábito (Tabaquismo, Chimó, OH, Sustancias ilícitas). */
  psicobiologicos: Record<string, string>
  examen: ExamenFisico
  ecg: Ecg
  /** Clave: nombre del campo de laboratorio (Hb, GB, …). */
  laboratorios: Record<string, string>
  laboratoriosOtros: string
  ett: Ett
  diagnostico: string
  tratamiento: FilaTratamiento[]
  plan: string
}

export interface Medicamento {
  id: string
  nombre: string
  concentracion: string
  posologia: string
  activo: boolean
}
