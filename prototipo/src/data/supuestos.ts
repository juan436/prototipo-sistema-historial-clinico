// =====================================================================
// SUPUESTOS y puntos POR DEFINIR, reunidos en un solo archivo para que
// sean fáciles de cambiar cuando el cliente confirme.
// Cada punto remite a docs/01-instrucciones-prototipo-visual.md.
// =====================================================================

/** [SUPUESTO] 3 — El admin ve las historias pero no las crea ni las edita. */
export const ADMIN_PUEDE_EDITAR_HISTORIAS = false

/**
 * [SUPUESTO] 6.5 — Agrupación del examen físico en 3 apartados.
 * Para reagrupar: mover los identificadores de bloque entre apartados o cambiar su orden.
 */
export type BloqueExamen =
  | 'signos' | 'piel' | 'generales' | 'cuello' | 'torax'
  | 'ruidosCardiacos' | 'ruidosRespiratorios'
  | 'abdomen' | 'miembros' | 'neurologico'

export const APARTADOS_EXAMEN: { titulo: string; bloques: BloqueExamen[] }[] = [
  {
    titulo: 'Signos vitales, condiciones generales, cuello y tórax',
    bloques: ['signos', 'piel', 'generales', 'cuello', 'torax'],
  },
  { titulo: 'Ruidos cardíacos y respiratorios', bloques: ['ruidosCardiacos', 'ruidosRespiratorios'] },
  { titulo: 'Abdomen, miembros y neurológico', bloques: ['abdomen', 'miembros', 'neurologico'] },
]

/** [SUPUESTO] 6.6 a — Ayuda emergente del ritmo (las siglas se muestran tal cual). */
export const ECG_RITMO_AYUDA: Record<string, string> = { S: 'Sinusal', NS: 'No sinusal' }

/** [SUPUESTO] 6.6 a — Opciones del EJE (no se ven en las capturas del cliente). */
export const ECG_EJE = ['Normal', 'Desviado a la izquierda', 'Desviado a la derecha']

/**
 * POR DEFINIR — Campos que el documento marca como «selección» pero sin dar sus opciones.
 * No se inventan: quedan vacíos y el selector muestra «Opciones por definir».
 * Al recibir las opciones del cliente, basta escribirlas aquí.
 */
export const OPCIONES_POR_DEFINIR = {
  expansibilidad: [] as string[],
  primerRuido: [] as string[],
  sistole: [] as string[],
  segundoRuido: [] as string[],
  diastole: [] as string[],
  ruidosHidroaereos: [] as string[],
}

/**
 * [SUPUESTO] 6.5 — «Simetría» de miembros inferiores: el documento no da opciones.
 * Se reutilizan las de la simetría del tórax (Simétricos / Asimétricos).
 */
export const MIEMBROS_SIMETRIA = ['Simétricos', 'Asimétricos']

/**
 * [PENDIENTE] 9.3 — El cliente mostró el recuadro del récipe con CI y sin CI.
 * Se construye con CI (como indica el documento). Cambiar a false para ocultarla.
 */
export const RECIPE_MOSTRAR_CI = true

/** [PENDIENTE] 9.3 — Modelo de récipe que se muestra al abrir la vista previa. */
export const RECIPE_MODELO_INICIAL: 'A' | 'B' = 'A'

/** Texto de la forma farmacéutica en el Modelo A del récipe («Fármaco Tab X mg»). */
export const RECIPE_FORMA = 'Tab'

/** Anexo A — Posología por defecto de una presentación. */
export const posologiaPorDefecto = (concentracion: string) => `Tomar una tableta de ${concentracion}`
