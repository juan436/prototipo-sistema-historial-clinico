/**
 * 9.1 Membrete: logo y nombre del médico (los de su perfil) sobre fondo de papel de ECG.
 * Si el médico aún no subió su logo se muestra el marcador «MEMBRETE», como en el material del cliente.
 */
export default function Membrete({ nombre, logo }: { nombre: string; logo?: string }) {
  return (
    <div className="papel-ecg flex items-center gap-5 rounded-sm border border-rose-200 px-6" style={{ minHeight: '30mm' }}>
      {logo ? (
        <img src={logo} alt="Logo del membrete" style={{ maxHeight: '22mm', maxWidth: '45mm' }} className="object-contain" />
      ) : (
        <div
          className="flex items-center justify-center rounded border border-dashed border-rose-300 bg-white/70 text-[8pt] font-semibold tracking-[0.2em] text-rose-400"
          style={{ height: '20mm', width: '34mm' }}
        >
          MEMBRETE
        </div>
      )}
      <p className="text-[17pt] leading-tight font-semibold text-slate-900">{nombre || 'Nombre del médico'}</p>
    </div>
  )
}
