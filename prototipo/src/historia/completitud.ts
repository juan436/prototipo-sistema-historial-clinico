import { SECCIONES } from '../data/opciones'
import type { DatosPersonales, Historia } from '../types'

// Criterio del indicador «sección completa». El documento pide el indicador pero no
// define cuándo una sección está completa: este es un criterio mínimo [SUPUESTO],
// reunido aquí para cambiarlo con facilidad.
const lleno = (v: string | undefined) => !!v && v.trim() !== ''
const algunValor = (r: Record<string, string | undefined>) => Object.values(r).some(lleno)

export function seccionesCompletas(h: Historia, p: DatosPersonales): boolean[] {
  return [
    // 1. Datos personales: identificación básica.
    [p.cedula, p.nombres, p.apellidos, p.sexo, p.fechaNacimiento].every(lleno),
    // 2. Al menos un motivo y la enfermedad actual.
    h.motivos.length > 0 && lleno(h.enfermedadActual),
    // 3. Al menos un antecedente o una intervención.
    h.antecedentes.length + h.intervenciones.length > 0,
    // 4. Algo escrito en familiares y algo en psicobiológicos.
    algunValor(h.familiares) && algunValor(h.psicobiologicos),
    // 5. Peso, talla, frecuencia cardíaca y una presión arterial completa.
    [h.examen.peso, h.examen.talla, h.examen.fc].every(lleno) &&
      (['Pie', 'Sentado', 'Acostado'] as const).some((pos) => lleno(h.examen[`pa${pos}Sis`]) && lleno(h.examen[`pa${pos}Dia`])),
    // 6. Algún dato en los tres bloques: ECG, laboratorios y ETT.
    algunValor(h.ecg) &&
      (algunValor(h.laboratorios) || lleno(h.laboratoriosOtros)) &&
      algunValor({ ...h.ett, imagen: '', imagenNombre: '' }),
    // 7, 8 y 9.
    lleno(h.diagnostico),
    h.tratamiento.some((t) => lleno(t.farmaco)),
    lleno(h.plan),
  ]
}

export const historiaCompleta = (h: Historia, p: DatosPersonales) => seccionesCompletas(h, p).every(Boolean)

export const TOTAL_SECCIONES = SECCIONES.length
