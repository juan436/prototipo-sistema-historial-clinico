import { Tarjeta } from '../components/ui'
import type { PropsSeccion } from './secciones'

/** 6.8 Tratamiento (se completa en la etapa 5). */
export default function SeccionTratamiento({ h }: PropsSeccion) {
  return (
    <Tarjeta titulo="Tratamiento">
      <p className="text-sm text-slate-600">{h.tratamiento.length} fármaco(s) en esta historia.</p>
    </Tarjeta>
  )
}
