import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { HISTORIAS_EJEMPLO, PACIENTES_EJEMPLO, USUARIOS_EJEMPLO } from './data/ejemplos'
import { MEDICAMENTOS_SEMILLA } from './data/medicamentos'
import type { Historia, Medicamento, Paciente, Usuario } from './types'

// Sin backend: todo vive en el estado de la aplicación y se copia a localStorage
// para que lo capturado sobreviva a recargar la página.
const CLAVE = 'hcc-prototipo-v1'

interface Datos {
  usuarios: Usuario[]
  pacientes: Paciente[]
  historias: Historia[]
  medicamentos: Medicamento[]
  sesionId: string | null
}

const datosIniciales = (): Datos => ({
  usuarios: USUARIOS_EJEMPLO,
  pacientes: PACIENTES_EJEMPLO,
  historias: HISTORIAS_EJEMPLO,
  medicamentos: MEDICAMENTOS_SEMILLA,
  sesionId: null,
})

const cargar = (): Datos => {
  try {
    const crudo = localStorage.getItem(CLAVE)
    if (crudo) return { ...datosIniciales(), ...JSON.parse(crudo) }
  } catch {
    /* si localStorage falla, se usan los datos de ejemplo */
  }
  return datosIniciales()
}

interface Tienda extends Datos {
  usuario: Usuario | null
  esAdmin: boolean
  entrar: (id: string) => void
  salir: () => void
  restablecer: () => void
  guardarPaciente: (p: Paciente) => void
  vincularPaciente: (pacienteId: string, medicoId: string) => void
  guardarHistoria: (h: Historia) => void
  guardarUsuario: (u: Usuario) => void
  guardarMedicamento: (m: Medicamento) => void
  /** Pacientes que puede ver el usuario en sesión. */
  pacientesVisibles: Paciente[]
  /** Historias que puede ver el usuario en sesión (el médico, solo las que él hizo). */
  historiasVisibles: Historia[]
  siguienteNumero: () => number
  aviso: string
  avisar: (mensaje: string) => void
}

const Contexto = createContext<Tienda | null>(null)

const reemplazar = <T extends { id: string }>(lista: T[], item: T) =>
  lista.some((x) => x.id === item.id) ? lista.map((x) => (x.id === item.id ? item : x)) : [...lista, item]

export function ProveedorTienda({ children }: { children: ReactNode }) {
  const [datos, setDatos] = useState<Datos>(cargar)
  const [aviso, setAviso] = useState('')
  const temporizador = useRef<number | undefined>(undefined)

  useEffect(() => {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(datos))
    } catch {
      /* cuota llena (imágenes grandes): el estado sigue en memoria */
    }
  }, [datos])

  const avisar = useCallback((mensaje: string) => {
    setAviso(mensaje)
    window.clearTimeout(temporizador.current)
    temporizador.current = window.setTimeout(() => setAviso(''), 3500)
  }, [])

  const tienda = useMemo<Tienda>(() => {
    const usuario = datos.usuarios.find((u) => u.id === datos.sesionId && u.activo) ?? null
    const esAdmin = usuario?.rol === 'admin'
    // REGLA DE VISIBILIDAD (doc. 01, sección 3):
    const pacientesVisibles = !usuario
      ? []
      : esAdmin
        ? datos.pacientes
        : datos.pacientes.filter((p) => p.medicoIds.includes(usuario.id))
    const historiasVisibles = !usuario
      ? []
      : esAdmin
        ? datos.historias
        : datos.historias.filter((h) => h.medicoId === usuario.id)
    return {
      ...datos,
      usuario,
      esAdmin,
      pacientesVisibles,
      historiasVisibles,
      entrar: (id) => setDatos((d) => ({ ...d, sesionId: id })),
      salir: () => setDatos((d) => ({ ...d, sesionId: null })),
      restablecer: () => setDatos(datosIniciales()),
      guardarPaciente: (p) => setDatos((d) => ({ ...d, pacientes: reemplazar(d.pacientes, p) })),
      vincularPaciente: (pacienteId, medicoId) =>
        setDatos((d) => ({
          ...d,
          pacientes: d.pacientes.map((p) =>
            p.id === pacienteId && !p.medicoIds.includes(medicoId) ? { ...p, medicoIds: [...p.medicoIds, medicoId] } : p,
          ),
        })),
      guardarHistoria: (h) => setDatos((d) => ({ ...d, historias: reemplazar(d.historias, h) })),
      guardarUsuario: (u) => setDatos((d) => ({ ...d, usuarios: reemplazar(d.usuarios, u) })),
      guardarMedicamento: (m) => setDatos((d) => ({ ...d, medicamentos: reemplazar(d.medicamentos, m) })),
      // [PENDIENTE] La numeración definitiva no está definida: se usa un consecutivo simple.
      siguienteNumero: () => datos.historias.reduce((max, h) => Math.max(max, h.numero), 0) + 1,
      aviso,
      avisar,
    }
  }, [datos, aviso, avisar])

  return <Contexto.Provider value={tienda}>{children}</Contexto.Provider>
}

export const useTienda = () => {
  const t = useContext(Contexto)
  if (!t) throw new Error('useTienda debe usarse dentro de ProveedorTienda')
  return t
}
