import { useEffect, useId, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode } from 'react'

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')

/** Logotipo: corazón rojo con línea de electrocardiograma. */
export function Logo({ className = 'h-9 w-9' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        d="M24 42S6 30.5 6 17.5C6 11.7 10.5 7.5 15.8 7.5c3.3 0 6.4 1.7 8.2 4.4 1.8-2.7 4.9-4.4 8.2-4.4C37.5 7.5 42 11.7 42 17.5 42 30.5 24 42 24 42z"
        fill="#e11d48"
      />
      <path d="M8 24h9l3-7 5 13 3.5-6H40" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

type Variante = 'primario' | 'secundario' | 'fantasma' | 'peligro'
const VARIANTES: Record<Variante, string> = {
  primario: 'bg-accion-600 text-white hover:bg-accion-700 border-transparent',
  secundario: 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300',
  fantasma: 'bg-transparent text-accion-700 hover:bg-accion-50 border-transparent',
  peligro: 'bg-white text-rose-700 hover:bg-rose-50 border-rose-200',
}

export function Boton({
  variante = 'secundario',
  chico,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variante?: Variante; chico?: boolean }) {
  return (
    <button
      type="button"
      {...props}
      className={cx(
        'inline-flex items-center justify-center gap-1.5 rounded-md border font-medium shadow-xs transition focus-visible:ring-2 focus-visible:ring-accion-200 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
        chico ? 'px-2.5 py-1 text-sm' : 'px-3.5 py-2 text-[15px]',
        VARIANTES[variante],
        className,
      )}
    />
  )
}

/** Etiqueta siempre visible sobre el control. */
export function Campo({
  etiqueta,
  ayuda,
  className,
  children,
}: {
  etiqueta: ReactNode
  ayuda?: ReactNode
  className?: string
  children: ReactNode
}) {
  return (
    <label className={cx('block', className)}>
      <span className="mb-1 block text-sm font-medium text-slate-700">{etiqueta}</span>
      {children}
      {ayuda && <span className="mt-1 block text-xs text-slate-500">{ayuda}</span>}
    </label>
  )
}

type PropsTexto = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> & {
  value: string | undefined
  onChange: (v: string) => void
}

export function Texto({ value, onChange, className, ...props }: PropsTexto) {
  return <input type="text" {...props} value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={cx('control', className)} />
}

/** Campo numérico: admite dígitos, coma o punto decimal y signo negativo. */
export function Numero({ value, onChange, className, sufijo, ...props }: PropsTexto & { sufijo?: string }) {
  const input = (
    <input
      type="text"
      inputMode="decimal"
      {...props}
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value.replace(/[^0-9.,-]/g, ''))}
      className={cx('control', sufijo && 'pr-9', className)}
    />
  )
  if (!sufijo) return input
  return (
    <span className="relative block">
      {input}
      <span className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-sm text-slate-400">{sufijo}</span>
    </span>
  )
}

/** Valor calculado por el sistema, solo lectura. */
export function Calculado({ valor, sufijo }: { valor: string; sufijo?: string }) {
  return (
    <div className="flex min-h-[34px] items-center gap-1 rounded-md border border-dashed border-accion-200 bg-accion-50 px-2.5 py-1.5 text-[15px] font-semibold text-accion-800">
      {valor ? (
        <>
          {valor} {sufijo && <span className="font-normal text-accion-700">{sufijo}</span>}
        </>
      ) : (
        <span className="font-normal text-slate-400">Se calcula automáticamente</span>
      )}
    </div>
  )
}

export function Area({
  value,
  onChange,
  filas = 3,
  className,
  placeholder,
}: {
  value: string | undefined
  onChange: (v: string) => void
  filas?: number
  className?: string
  placeholder?: string
}) {
  return (
    <textarea
      rows={filas}
      value={value ?? ''}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={cx('control resize-y leading-relaxed', className)}
    />
  )
}

/** Lista desplegable. Si no hay opciones definidas por el cliente, lo indica y no inventa ninguna. */
export function Selector({
  value,
  onChange,
  opciones,
  grupos,
  disabled,
}: {
  value: string | undefined
  onChange: (v: string) => void
  opciones?: readonly string[]
  grupos?: { etiqueta: string; opciones: readonly string[] }[]
  disabled?: boolean
}) {
  const sinOpciones = !grupos && (!opciones || opciones.length === 0)
  return (
    <select value={value ?? ''} onChange={(e) => onChange(e.target.value)} className="control" disabled={disabled || sinOpciones}>
      <option value="">{sinOpciones ? 'Opciones por definir' : 'Seleccionar…'}</option>
      {opciones?.map((o) => <option key={o}>{o}</option>)}
      {grupos?.map((g) => (
        <optgroup key={g.etiqueta} label={g.etiqueta}>
          {g.opciones.map((o) => <option key={o}>{o}</option>)}
        </optgroup>
      ))}
    </select>
  )
}

/** Opción única en botones contiguos. Volver a pulsar la opción activa la desmarca. */
export function Opciones({
  value,
  onChange,
  opciones,
  ayudas,
}: {
  value: string | undefined
  onChange: (v: string) => void
  opciones: readonly string[]
  ayudas?: Record<string, string>
}) {
  return (
    <div className="inline-flex flex-wrap overflow-hidden rounded-md border border-slate-300 bg-white shadow-xs" role="radiogroup">
      {opciones.map((o) => {
        const activa = value === o
        return (
          <button
            key={o}
            type="button"
            role="radio"
            aria-checked={activa}
            title={ayudas?.[o]}
            onClick={() => onChange(activa ? '' : o)}
            className={cx(
              'border-r border-slate-300 px-3 py-1.5 text-[15px] transition last:border-r-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accion-500 disabled:cursor-default',
              activa ? 'bg-accion-600 font-semibold text-white' : 'text-slate-700 enabled:hover:bg-slate-50',
            )}
          >
            {o}
          </button>
        )
      })}
    </div>
  )
}

export function Casilla({ etiqueta, marcada, onChange }: { etiqueta: ReactNode; marcada: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-[15px] text-slate-800">
      <input type="checkbox" checked={marcada} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 rounded border-slate-400 accent-accion-600" />
      {etiqueta}
    </label>
  )
}

export function Tarjeta({ titulo, acciones, children, className }: { titulo?: ReactNode; acciones?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cx('rounded-lg border border-slate-200 bg-white shadow-xs', className)}>
      {(titulo || acciones) && (
        <header className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-2.5">
          <h3 className="text-base font-semibold text-slate-800">{titulo}</h3>
          <div className="flex items-center gap-2">{acciones}</div>
        </header>
      )}
      <div className="p-4">{children}</div>
    </section>
  )
}

export function Insignia({ tono = 'gris', children }: { tono?: 'gris' | 'verde' | 'ambar' | 'azul' | 'rojo'; children: ReactNode }) {
  const tonos = {
    gris: 'bg-slate-100 text-slate-600',
    verde: 'bg-emerald-50 text-emerald-700',
    ambar: 'bg-amber-50 text-amber-700',
    azul: 'bg-accion-50 text-accion-700',
    rojo: 'bg-rose-50 text-rose-700',
  }
  return <span className={cx('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap', tonos[tono])}>{children}</span>
}

export function Modal({
  titulo,
  onCerrar,
  children,
  pie,
  ancho = 'max-w-xl',
}: {
  titulo: ReactNode
  onCerrar: () => void
  children: ReactNode
  pie?: ReactNode
  ancho?: string
}) {
  const idTitulo = useId()
  useEffect(() => {
    const tecla = (e: KeyboardEvent) => e.key === 'Escape' && onCerrar()
    window.addEventListener('keydown', tecla)
    return () => window.removeEventListener('keydown', tecla)
  }, [onCerrar])
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/40 p-6 pt-[8vh]" onMouseDown={onCerrar}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={idTitulo}
        className={cx('w-full rounded-lg bg-white shadow-xl', ancho)}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
          <h2 id={idTitulo} className="text-lg font-semibold text-slate-800">{titulo}</h2>
          <button type="button" onClick={onCerrar} aria-label="Cerrar" className="rounded p-1 text-xl leading-none text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            ×
          </button>
        </header>
        <div className="px-5 py-4">{children}</div>
        {pie && <footer className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-3 rounded-b-lg">{pie}</footer>}
      </div>
    </div>
  )
}

export function EstadoVacio({ titulo, texto, accion }: { titulo: string; texto?: string; accion?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
      <p className="text-base font-semibold text-slate-700">{titulo}</p>
      {texto && <p className="max-w-md text-sm text-slate-500">{texto}</p>}
      {accion && <div className="mt-2">{accion}</div>}
    </div>
  )
}

export function Encabezado({ titulo, subtitulo, acciones }: { titulo: ReactNode; subtitulo?: ReactNode; acciones?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{titulo}</h1>
        {subtitulo && <p className="mt-0.5 text-sm text-slate-500">{subtitulo}</p>}
      </div>
      <div className="flex items-center gap-2">{acciones}</div>
    </div>
  )
}
