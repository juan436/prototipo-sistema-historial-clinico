import type { Medicamento } from '../types'
import { posologiaPorDefecto } from './supuestos'

// Anexo A de docs/01-instrucciones-prototipo-visual.md: una fila por presentación (70).
// Los grupos del anexo son solo para ordenar la lista: NO son un campo del catálogo.
// Erratas ya corregidas según el anexo: «Clortalidona» con un solo nombre (12,5 y 25 mg)
// y Ramipril 5 mg con la posología de 5 mg.
const SEMILLA: [nombre: string, concentraciones: string[]][] = [
  ['Candesartán', ['8 mg', '16 mg', '32 mg']],
  ['Valsartán', ['80 mg', '160 mg']],
  ['Enalapril', ['10 mg', '20 mg']],
  ['Lisinopril', ['10 mg', '20 mg']],
  ['Losartán', ['50 mg', '100 mg']],
  ['Irbesartán', ['150 mg', '300 mg']],
  ['Olmesartán', ['40 mg', '80 mg']],
  ['Ramipril', ['2,5 mg', '5 mg', '10 mg']],
  ['Candesartán + Hidroclorotiazida', ['16/12,5 mg']],
  ['Valsartán + Clortalidona', ['80/12,5 mg']],
  ['Valsartán + Hidroclorotiazida', ['80/12,5 mg']],
  ['Sacubitril/valsartán', ['50 mg', '100 mg', '200 mg']],
  ['Amlodipina', ['5 mg', '10 mg']],
  ['Nifedipina LP', ['30 mg', '60 mg']],
  ['Verapamilo', ['80 mg', '120 mg']],
  ['Diltiazem', ['60 mg', '120 mg']],
  ['Bisoprolol', ['1,25 mg', '2,5 mg', '5 mg', '10 mg']],
  ['Carvedilol', ['6,25 mg', '12,5 mg', '25 mg']],
  ['Metoprolol', ['50 mg']],
  ['Nebivolol', ['2,5 mg', '5 mg']],
  ['Empagliflozina', ['10 mg', '25 mg']],
  ['Dapagliflozina', ['10 mg']],
  ['Rivaroxabán', ['10 mg', '15 mg', '20 mg']],
  ['Apixabán', ['2,5 mg', '5 mg']],
  ['Warfarina', ['5 mg', '2,5 mg']],
  ['Ácido acetilsalicílico (aspirina)', ['81 mg']],
  ['Clopidogrel', ['75 mg']],
  ['Ticagrelor', ['90 mg']],
  ['Furosemida', ['20 mg', '40 mg']],
  ['Bumetanida', ['1 mg']],
  ['Hidroclorotiazida', ['12,5 mg', '25 mg']],
  ['Clortalidona', ['12,5 mg', '25 mg']],
  ['Atorvastatina', ['10 mg', '20 mg', '40 mg', '80 mg']],
  ['Atorvastatina/ezetimiba', ['40/10 mg']],
  ['Rosuvastatina/ezetimiba', ['20/10 mg']],
  ['Rosuvastatina', ['20 mg', '40 mg']],
]

export const MEDICAMENTOS_SEMILLA: Medicamento[] = SEMILLA.flatMap(([nombre, concentraciones]) =>
  concentraciones.map((concentracion) => ({
    id: `med-${nombre}-${concentracion}`.toLowerCase().replace(/[^a-z0-9áéíóúñ]+/g, '-'),
    nombre,
    concentracion,
    posologia: posologiaPorDefecto(concentracion),
    activo: true,
  })),
)
