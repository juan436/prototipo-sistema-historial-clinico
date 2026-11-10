# Notas del prototipo visual

Notas de construcción del prototipo que está en `prototipo/`, hecho a partir de
`01-instrucciones-prototipo-visual.md` y `02-funcionamiento-del-sistema.md`.

Para ejecutarlo: ver `prototipo/README.md`.

## 1. Qué quedó construido

Stack: React + Vite + TypeScript + Tailwind CSS + React Router. Sin backend. Los datos viven en
archivos locales y en el estado de la aplicación, con copia en `localStorage`.

| # | Pantalla | Estado |
|---|---|---|
| 1 | Inicio de sesión con los 3 usuarios («Entrar como …») | Construida |
| 2 | Lista de pacientes con búsqueda por cédula o nombre; columna «Médicos vinculados» para el admin; estado vacío | Construida |
| 3 | Nuevo paciente con verificación de cédula al salir del campo y vinculación sin duplicar | Construida |
| 4 | Ficha del paciente: datos, edición y lista de historias | Construida |
| 5 | Historia clínica de primera vez: 9 secciones | Construida |
| 6 | Vista de impresión: Historia (orden de 10 puntos) | Construida |
| 7 | Vista de impresión: Récipe (Modelo A y Modelo B con interruptor) | Construida |
| 8 | Mi perfil y membrete, con vista previa | Construida |
| 9 | Usuarios (lista, crear, editar) | Construida |
| 10 | Catálogo de medicamentos (lista con búsqueda, crear, editar) | Construida |

Comportamientos de la sección 8 del documento 01, todos presentes:

- Selectores con búsqueda y selección múltiple (motivos, antecedentes, intervenciones); lo ya agregado aparece como «Ya agregado» y no se repite.
- Cálculo automático de edad, IMC e índice cintura/cadera.
- Buscador de medicamentos agrupado por nombre con todas las presentaciones; posología por defecto editable; horario libre; fármaco escrito a mano que no entra al catálogo.
- Aviso de cédula existente y vinculación sin duplicar.
- Aislamiento por médico (se comprueba con «Cambiar de usuario»).
- Indicador de secciones completas e incompletas.
- Confirmación de «Guardar» y advertencia al cerrar o salir con cambios sin guardar.

Datos de ejemplo (todos inventados): 3 usuarios, 7 pacientes, 5 historias (3 completas y 2 incompletas) y las
70 presentaciones del anexo A. El paciente con cédula `V-99.000.102` está vinculado a los dos médicos y cada uno
tiene su propia historia.

### Cómo probar los casos clave

- **Aislamiento:** entrar como Dra. Ana Rojas, abrir al paciente `V-99.000.102` (una historia); cambiar a Dr. Luis Prado y abrir al mismo paciente (otra historia distinta); entrar como Administrador (ve las dos, en solo lectura).
- **Vinculación:** como Dra. Ana Rojas, «Nuevo paciente», escribir la cédula `V-99.000.107` (paciente del Dr. Prado) y salir del campo.
- **Restablecer:** en el inicio de sesión, «Restablecer datos de ejemplo».

## 2. Criterios de aceptación (sección 10 del documento 01)

Revisados uno por uno en el navegador (prueba automatizada con Chromium y revisión de capturas y del PDF generado).

| Criterio | Resultado |
|---|---|
| Inicio de sesión con los 3 usuarios y menús según el rol | Cumple |
| El médico solo ve sus pacientes y sus historias; el admin ve todo y no edita historias | Cumple (también al entrar por dirección directa a una historia ajena o a su impresión) |
| Registrar una cédula existente vincula sin duplicar | Cumple |
| 9 secciones en el orden indicado y sin «Hand Grip» | Cumple |
| Datos personales con 15 campos y nivel académico con 5 opciones | Cumple |
| 25 motivos, 44 antecedentes, 15 intervenciones, sin columna de edad | Cumple |
| Antecedentes familiares (4 filas) y psicobiológicos (4 filas) fijos | Cumple |
| Examen físico en 3 apartados con SatO₂, llenado capilar, soplo carotídeo con lado, crepitantes/bulosos y observaciones de ruidos | Cumple |
| Paraclínicos en una pantalla: ECG, laboratorios por grupos y ETT con imagen que no se imprime | Cumple |
| Diagnóstico y Plan: una sola caja de texto cada uno | Cumple |
| Tratamiento con buscador, todas las presentaciones, posología editable y horario libre | Cumple |
| Historia impresa en el orden de 10 puntos; récipe con fecha automática y datos del médico | Cumple |
| El perfil configura el membrete y se refleja en la vista previa | Cumple |
| El admin gestiona usuarios y catálogo | Cumple |

## 3. Supuestos aplicados

Los marcados **[SUPUESTO]** en los documentos están reunidos en `prototipo/src/data/supuestos.ts` para cambiarlos en un solo lugar.

| Supuesto | Cómo se construyó | Dónde se cambia |
|---|---|---|
| El admin ve las historias y no las crea ni edita | Solo lectura, sin «Guardar» ni «Nueva historia» | `ADMIN_PUEDE_EDITAR_HISTORIAS` |
| Examen físico en 3 apartados | Agrupación del documento; cada apartado es una lista de bloques | `APARTADOS_EXAMEN` (mover o reordenar bloques) |
| Ritmo del ECG: S / NS | Se muestran las siglas con la ayuda «Sinusal / No sinusal»; en la impresión sale «Ritmo sinusal / no sinusal», como el ejemplo del documento | `ECG_RITMO_AYUDA` |
| Opciones del EJE | Normal / Desviado a la izquierda / Desviado a la derecha | `ECG_EJE` |

Decisiones propias, tomadas donde el documento no define el detalle (la opción más simple y reversible):

1. **Selecciones sin opciones definidas.** El documento marca como «selección» estos campos pero no da sus opciones: Expansibilidad, Primer ruido, Sístole, Segundo ruido, Diástole y Ruidos hidroaéreos. No se inventaron: el selector aparece con el texto «Opciones por definir». Al recibirlas basta escribirlas en `OPCIONES_POR_DEFINIR`. En las historias de ejemplo esos campos están vacíos.
2. **Estado hemodinámico.** Solo tiene la opción «Estable», la única que da el documento.
3. **Simetría de miembros inferiores.** El documento no da opciones; se reutilizaron las de la simetría del tórax (Simétricos / Asimétricos). Se cambia en `MIEMBROS_SIMETRIA`.
4. **Lado del edema.** Una sola lista con dos grupos: miembros inferiores (MII, MID, Ambos) y superiores (MSI, MSD, Ambos).
5. **Fuerza motora por miembro.** El documento no dice el tipo de dato: son cuatro campos de texto corto.
6. **Criterio de «sección completa».** El documento pide el indicador pero no define cuándo una sección está completa. Se aplicó un criterio mínimo, reunido en `prototipo/src/historia/completitud.ts`: datos de identificación; un motivo y la enfermedad actual; un antecedente o intervención; algo en familiares y en psicobiológicos; peso, talla, FC y una presión arterial; algún dato en ECG, laboratorios y ETT; diagnóstico; un fármaco; plan.
7. **Columna «Estado» en la lista de historias de la ficha** (Completa / Incompleta). No está en la lista de columnas del documento; se agregó para que el indicador de completitud se vea desde la ficha. Es fácil de quitar.
8. **Número de historia.** Consecutivo simple asignado por el sistema al crear la historia.
9. **Edad.** Se calcula respecto a la fecha de hoy en todas las pantallas y en la impresión.
10. **Cédula.** No se edita desde la ficha ni desde la historia, porque identifica al paciente. Se compara sin puntos, guiones ni espacios.
11. **Datos personales en la historia.** La sección 1 edita los datos del paciente (registro único), que se guardan junto con la historia.
12. **El admin no edita datos personales de pacientes.** El documento solo dice que el admin «ve» los pacientes; se dejó en solo lectura.
13. **Cédula que ya está en la lista del propio médico.** Caso no descrito: se avisa «Este paciente ya está en su lista» y se ofrece abrir su ficha.
14. **Vista previa con cambios sin guardar.** La vista previa muestra la historia guardada, así que primero pide guardar.
15. **Récipe, recuadro del paciente.** Se construyó con CI. Se oculta con `RECIPE_MOSTRAR_CI`. El modelo inicial se cambia con `RECIPE_MODELO_INICIAL`.
16. **Récipe, Modelo A.** Imprime «Fármaco Tab concentración». Un fármaco escrito a mano no tiene concentración aparte: sale solo su nombre.
17. **Membrete.** Muestra el logo y el nombre del perfil. Si el médico no ha subido logo se ve el marcador «MEMBRETE», como en el material del cliente (así está el Dr. Luis Prado en los datos de ejemplo). El logo de la Dra. Ana Rojas es un monograma ficticio.
18. **Copia del tratamiento.** Cada fila guarda el texto del fármaco, no una referencia: editar el catálogo no cambia las historias ya guardadas.
19. **Unidades.** Solo se muestran las que da el documento (%, kg, m, °C, cm). Laboratorios, ECG y ETT van sin unidades.
20. **«Página x de y».** Se numera al imprimir, con las cajas de margen de `@page`. Funciona en Chrome y Edge. Otros navegadores pueden no mostrarla; en ese caso se puede activar el encabezado propio del navegador.
21. **Inicio de sesión.** Lista los usuarios activos: los tres de ejemplo y los que cree el admin.
22. **Textos de ayuda de la interfaz** (estados vacíos, avisos, confirmaciones) redactados para el prototipo; no son textos clínicos.

## 4. Lo que no se construyó por ser [PENDIENTE]

- Pestañas «Hábitos/Examen funcional», «Diagnósticos cardiológicos» y «Estratificación de riesgo».
- «Hand Grip» (tachado por el cliente).
- Bloque de Alergias.
- En miembros inferiores: enfermedad vascular periférica arterial y venosa.
- El campo Sí/No del examen físico cuya etiqueta no se ve en las capturas.
- Paraclínicos: «Prueba de esfuerzo», «Otros» y la fila «Impresión diagnóstica» con códigos.
- Campos del programa antiguo que el cliente no incluyó: estado civil, lugar de nacimiento, parroquia, fax, profesión y representante o familiar.
- Antibióticos y antidiabéticos del catálogo: no se inventaron; el admin puede agregarlos desde la pantalla del catálogo.
- Todo lo de la sección 11 del documento 01: autenticación real, base de datos, subida real de archivos, migración, respaldos, hospedaje, historias de seguimiento, PDF para el paciente, consultorio compartido e inteligencia artificial.

Quedan construidos, pero a la espera de confirmación del cliente: el récipe con CI y los dos modelos (A y B) con su interruptor.

## 5. Dudas y ambigüedades para el cliente

1. Opciones de las seis selecciones del punto 3.1 (Expansibilidad, Primer ruido, Sístole, Segundo ruido, Diástole, Ruidos hidroaéreos) y las demás opciones de Estado hemodinámico.
2. Opciones de «Simetría» en miembros inferiores y tipo de dato de la fuerza motora.
3. Agrupación definitiva de los 3 apartados del examen físico.
4. Significado de S / NS y opciones del EJE en el ECG.
5. Cuándo se considera completa cada sección, o si el indicador debe ser otro.
6. Si «Ápex palpable» es una casilla independiente de «Ápex visible» (así se construyó, siguiendo el documento).
7. El lado del edema mezcla miembros inferiores y superiores dentro del bloque «Miembros inferiores»: confirmar si debe llamarse «Miembros».
8. Récipe: modelo preferido, con o sin CI, y si lleva algún título.
9. Si el membrete debe llevar algo más que logo y nombre (consultorio, dirección, teléfonos): hoy el perfil no tiene esos campos.
10. Si la edad de la historia impresa debe ser la de la fecha de consulta en lugar de la actual.
11. Si el admin puede corregir datos personales de un paciente.
12. Errata del anexo A: dice «70 filas» y «Clortalidona tab 12,5 mg y 25 mg (ver erratas)»; se cargaron 70 presentaciones con Clortalidona bajo un solo nombre y Ramipril 5 mg con su posología corregida.

## 6. Limitaciones conocidas del prototipo

- Las imágenes (logo e informe del eco) se reducen y se guardan en `localStorage`; si el navegador se queda sin espacio, siguen en memoria hasta recargar.
- El formato visual de los campos de fecha nativos depende del idioma del navegador. La fecha del estudio del ETT es un campo propio con formato día/mes/año.
- Diseñado para escritorio (1280 px o más). No se ajustó para móvil.
