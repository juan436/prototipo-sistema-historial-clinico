import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FormDatosPersonales from '../components/FormDatosPersonales'
import { Boton, Encabezado, Tarjeta } from '../components/ui'
import { useTienda } from '../store'
import type { DatosPersonales, Paciente } from '../types'
import { DATOS_PERSONALES_VACIOS, nombreCompleto, normalizarCedula, nuevoId } from '../utils'

export default function NuevoPaciente() {
  const { pacientes, usuario, guardarPaciente, vincularPaciente, avisar } = useTienda()
  const navegar = useNavigate()
  const [datos, setDatos] = useState<DatosPersonales>(DATOS_PERSONALES_VACIOS)
  const [existente, setExistente] = useState<Paciente | null>(null)
  const [verificada, setVerificada] = useState(false)
  const [error, setError] = useState('')
  if (!usuario) return null

  // Al salir del campo de cédula se verifica si el paciente ya existe (doc. 01, 5.3).
  const verificar = () => {
    const cedula = normalizarCedula(datos.cedula)
    if (!cedula) return
    const hallado = pacientes.find((p) => normalizarCedula(p.cedula) === cedula) ?? null
    setExistente(hallado)
    setVerificada(true)
  }

  const reiniciar = () => {
    setExistente(null)
    setVerificada(false)
    setDatos(DATOS_PERSONALES_VACIOS)
  }

  const crear = () => {
    if (!datos.cedula.trim() || !datos.nombres.trim() || !datos.apellidos.trim()) {
      setError('Para registrar al paciente indique al menos cédula, nombres y apellidos.')
      return
    }
    if (pacientes.some((p) => normalizarCedula(p.cedula) === normalizarCedula(datos.cedula))) return verificar()
    const p: Paciente = { ...datos, id: nuevoId('p'), medicoIds: [usuario.id] }
    guardarPaciente(p)
    avisar('Paciente registrado')
    navegar(`/pacientes/${p.id}`)
  }

  const yaEsMio = existente?.medicoIds.includes(usuario.id)

  return (
    <>
      <Encabezado titulo="Nuevo paciente" subtitulo="Escriba la cédula y salga del campo: el sistema verifica si el paciente ya existe." />

      {existente ? (
        <Tarjeta titulo="Datos personales">
          <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-[15px] text-amber-900" role="alert">
            {yaEsMio ? (
              <>
                <strong>Este paciente ya está en su lista.</strong> No es necesario registrarlo de nuevo.
              </>
            ) : (
              <>
                <strong>Este paciente ya está registrado. Se vinculará a su lista.</strong>
                <span className="mt-0.5 block text-sm">
                  No se crea un duplicado. Verá sus datos personales, pero no las historias hechas por otros médicos.
                </span>
              </>
            )}
          </div>
          <FormDatosPersonales valor={existente} onChange={() => {}} soloLectura />
          <div className="mt-5 flex justify-end gap-2">
            <Boton onClick={reiniciar}>Usar otra cédula</Boton>
            {yaEsMio ? (
              <Link to={`/pacientes/${existente.id}`}>
                <Boton variante="primario">Abrir ficha del paciente</Boton>
              </Link>
            ) : (
              <Boton
                variante="primario"
                onClick={() => {
                  vincularPaciente(existente.id, usuario.id)
                  avisar(`${nombreCompleto(existente)} se vinculó a sus pacientes`)
                  navegar(`/pacientes/${existente.id}`)
                }}
              >
                Vincular a mis pacientes
              </Boton>
            )}
          </div>
        </Tarjeta>
      ) : (
        <Tarjeta titulo="Datos personales">
          <FormDatosPersonales
            valor={datos}
            onChange={(cambio) => {
              setDatos((d) => ({ ...d, ...cambio }))
              if ('cedula' in cambio) setVerificada(false)
              setError('')
            }}
            onCedulaBlur={verificar}
            ayudaCedula={verificada ? '✓ Cédula no registrada: puede continuar.' : 'Única por paciente.'}
          />
          {error && <p className="mt-4 text-sm font-medium text-rose-700" role="alert">{error}</p>}
          <div className="mt-5 flex justify-end gap-2">
            <Link to="/pacientes">
              <Boton>Cancelar</Boton>
            </Link>
            <Boton variante="primario" onClick={crear}>Registrar paciente</Boton>
          </div>
        </Tarjeta>
      )}
    </>
  )
}
