import type { DatosPersonales } from './types'

export const hoyISO = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** aaaa-mm-dd -> dd/mm/aaaa */
export const fechaLarga = (iso: string) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '')
  return m ? `${m[3]}/${m[2]}/${m[1]}` : ''
}

/** Edad en años cumplidos, calculada a partir de la fecha de nacimiento. */
export const calcularEdad = (fechaNacimiento: string): number | null => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(fechaNacimiento || '')
  if (!m) return null
  const hoy = new Date()
  let edad = hoy.getFullYear() - Number(m[1])
  const mes = hoy.getMonth() + 1
  if (mes < Number(m[2]) || (mes === Number(m[2]) && hoy.getDate() < Number(m[3]))) edad--
  return edad >= 0 && edad < 130 ? edad : null
}

export const textoEdad = (fechaNacimiento: string) => {
  const e = calcularEdad(fechaNacimiento)
  return e === null ? '' : `${e} años`
}

/** Acepta coma o punto decimal. */
export const aNumero = (v: string | undefined): number | null => {
  if (!v || !v.trim()) return null
  const n = Number(v.replace(/\s/g, '').replace(',', '.'))
  return Number.isFinite(n) ? n : null
}

const conComa = (n: number, decimales: number) => n.toFixed(decimales).replace('.', ',')

/** IMC = peso (kg) / talla (m)². */
export const calcularIMC = (peso?: string, talla?: string) => {
  const p = aNumero(peso)
  const t = aNumero(talla)
  return p && t && p > 0 && t > 0 ? conComa(p / (t * t), 1) : ''
}

/** Índice cintura/cadera = cintura / cadera. */
export const calcularICC = (cintura?: string, cadera?: string) => {
  const ci = aNumero(cintura)
  const ca = aNumero(cadera)
  return ci && ca && ci > 0 && ca > 0 ? conComa(ci / ca, 2) : ''
}

/** Para búsquedas: sin acentos, sin mayúsculas. */
export const normalizar = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()

/** Para comparar cédulas sin importar puntos, guiones ni espacios. */
export const normalizarCedula = (s: string) => s.replace(/[^0-9a-zA-Z]/g, '').toUpperCase()

export const nombreCompleto = (p: Pick<DatosPersonales, 'nombres' | 'apellidos'>) =>
  `${p.nombres} ${p.apellidos}`.trim()

export const nuevoId = (prefijo: string) =>
  `${prefijo}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`

/** Lee una imagen local y la reduce para poder guardarla en el estado (no se envía a ningún lado). */
export const leerImagen = (archivo: File, maxLado = 900): Promise<string> =>
  new Promise((resolver, rechazar) => {
    const lector = new FileReader()
    lector.onerror = () => rechazar(new Error('No se pudo leer el archivo'))
    lector.onload = () => {
      const url = String(lector.result)
      if (archivo.type === 'image/svg+xml') return resolver(url)
      const img = new Image()
      img.onerror = () => rechazar(new Error('El archivo no es una imagen válida'))
      img.onload = () => {
        const escala = Math.min(1, maxLado / Math.max(img.width, img.height))
        const lienzo = document.createElement('canvas')
        lienzo.width = Math.round(img.width * escala)
        lienzo.height = Math.round(img.height * escala)
        lienzo.getContext('2d')!.drawImage(img, 0, 0, lienzo.width, lienzo.height)
        resolver(lienzo.toDataURL(archivo.type === 'image/png' ? 'image/png' : 'image/jpeg', 0.85))
      }
      img.src = url
    }
    lector.readAsDataURL(archivo)
  })

export const DATOS_PERSONALES_VACIOS: DatosPersonales = {
  cedula: '', nombres: '', apellidos: '', sexo: '', fechaNacimiento: '', direccion: '', pais: 'Venezuela',
  estado: '', municipio: '', telefono1: '', telefono2: '', correo: '', ocupacion: '', nivelAcademico: '',
}
