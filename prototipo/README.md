# Prototipo visual: Historia Clínica Cardiológica

Prototipo navegable, **sin backend ni base de datos**. Todos los datos son inventados.
La especificación está en `../docs/` y las notas de lo construido en `../docs/NOTAS-PROTOTIPO.md`.

## Cómo ejecutarlo

```bash
npm install
```

```bash
npm run dev
```

Otros comandos: `npm run build` (compila y verifica tipos) y `npm run preview` (sirve la compilación).

## Dónde está cada cosa

| Ruta | Contenido |
|---|---|
| `src/data/opciones.ts` | Listas exactas del documento (motivos, antecedentes, intervenciones, laboratorios…) |
| `src/data/supuestos.ts` | Todos los **[SUPUESTO]** y puntos por definir, en un solo archivo fácil de cambiar |
| `src/data/medicamentos.ts` | Catálogo semilla (anexo A, 70 presentaciones) |
| `src/data/ejemplos.ts` | Usuarios, pacientes e historias de ejemplo (ficticios) |
| `src/store.tsx` | Estado de la aplicación, `localStorage` y regla de visibilidad |
| `src/historia/` | Historia clínica: 9 secciones, criterio de «sección completa», tratamiento |
| `src/impresion/` | Membrete, historia impresa y récipe |
| `src/pages/` | Inicio de sesión, pacientes, perfil, usuarios y catálogo |

Lo capturado se guarda en el `localStorage` del navegador. En la pantalla de inicio de sesión,
«Restablecer datos de ejemplo» vuelve al estado inicial.
