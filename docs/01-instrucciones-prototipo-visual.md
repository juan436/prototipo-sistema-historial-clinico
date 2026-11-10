# Instrucciones para construir el prototipo visual

Proyecto: **sistema web de historia clínica cardiológica** para una organización de cardiólogos (consulta privada).
Este documento es para que un agente (Claude Code) construya **solo el prototipo visual**. Para entender cómo funcionará el sistema real, leer también `02-funcionamiento-del-sistema.md`.

## 0. Cómo leer este documento

- Todo lo que está aquí viene del documento que mandó el cliente (diapositivas con fotos de su programa actual y anotaciones) y de decisiones tomadas por el desarrollador. No inventar campos, opciones ni textos clínicos que no estén escritos aquí.
- Los puntos marcados **[SUPUESTO]** son interpretaciones que el cliente aún no confirmó. Construirlos como se indica y dejarlos fáciles de cambiar.
- Los puntos marcados **[PENDIENTE]** no están definidos. No construirlos; solo dejar el espacio o una nota.
- Todo el texto de la interfaz va **en español**.
- Todos los datos de ejemplo son **inventados**. No usar nombres, cédulas ni datos de personas reales.

## 1. Qué es y qué NO es el prototipo

**Es:** una aplicación web navegable, con aspecto de producto terminado, que muestra cómo se verá y se sentirá el sistema: pantallas, formularios, navegación por rol, vistas de impresión (historia y récipe) y pantallas de administración.

**No es:** un sistema funcional. No hay servidor ni base de datos.

- Los datos viven en archivos locales de ejemplo (`mock`) y en el estado de la aplicación. Se puede guardar en `localStorage` para que lo capturado sobreviva a recargar, pero no es obligatorio.
- El «login» acepta los usuarios de ejemplo del punto 3. No valida seguridad real.
- «Guardar» muestra una confirmación y actualiza el estado local.
- «Imprimir» abre la vista de impresión del navegador (`window.print()`) con el diseño de la sección 9. No genera PDF en servidor.
- «Subir imagen» (informe del eco) acepta un archivo y muestra una miniatura local. No lo envía a ningún lado.

### Stack sugerido (solo para el prototipo)

React + Vite + TypeScript + Tailwind CSS. React Router para la navegación. Sin librerías de estado pesadas (basta Context o Zustand). Sin backend. El stack del sistema real no está decidido: el prototipo debe poder descartarse sin perder nada.

## 2. Contexto que condiciona el diseño

- Los médicos hoy usan un programa de escritorio antiguo («Historia de Consulta Externa»), con pestañas laterales y tablas grises. El prototipo debe verse **moderno y limpio**, y reducir al mínimo el tecleo: **selectores, casillas y listas en lugar de texto libre**, con cajas de texto solo donde el cliente lo pidió.
- Se usa en computador de escritorio durante la consulta. Diseñar **primero para pantalla de escritorio** (≥1280 px). Debe ser usable en tablet; el móvil no es prioridad.
- Es un sistema clínico: priorizar **legibilidad** (texto base de 14–16 px, buen contraste, etiquetas siempre visibles, no solo placeholders) y **densidad ordenada** (hay muchos campos).
- Referencia visual de marca: el programa actual usa un corazón rojo con línea de electrocardiograma. Para la impresión, el membrete va sobre un **fondo de papel de ECG** (cuadrícula fina rosada). Paleta sugerida para la aplicación: blanco y grises claros de base, un azul o verde azulado sobrio como color de acción, y un rojo corazón solo como acento y en el logotipo. Evitar estilos decorativos.

## 3. Usuarios, roles y navegación

Hay dos roles. Crear **tres usuarios de ejemplo** y una pantalla de inicio de sesión que permita elegir entre ellos (un botón por usuario basta para el prototipo):

| Usuario de ejemplo | Rol |
|---|---|
| Dra. Ana Rojas (ficticia) | Médico |
| Dr. Luis Prado (ficticio) | Médico |
| Administrador | Admin |

### Menú del rol Médico

1. **Mis pacientes** (inicio)
2. **Mi perfil y membrete**

### Menú del rol Admin

1. **Pacientes** (todos)
2. **Usuarios**
3. **Catálogo de medicamentos**

El admin **ve** todos los pacientes y todas las historias, pero **no crea ni edita historias** **[SUPUESTO: las historias las firma el médico; el admin solo las ve]**. Si el admin abre una historia, se muestra en modo solo lectura.

### Regla de visibilidad (debe verse en los datos de ejemplo)

- Un **paciente** es un registro único por cédula y puede estar vinculado a **varios médicos**.
- Un **médico** ve únicamente los pacientes con los que está vinculado y, de cada paciente, **solo las historias que él hizo**. No ve las historias de otros médicos.
- El **admin** ve todo.

En los datos de ejemplo debe haber: pacientes de un solo médico, y **al menos un paciente vinculado a los dos médicos**, cada uno con su propia historia (para que se vea que cada médico solo ve la suya).

## 4. Mapa de pantallas

| # | Pantalla | Rol |
|---|---|---|
| 1 | Inicio de sesión | Todos |
| 2 | Lista de pacientes | Médico (sus pacientes) / Admin (todos) |
| 3 | Nuevo paciente (con verificación de cédula) | Médico |
| 4 | Ficha del paciente (datos + lista de historias) | Médico / Admin |
| 5 | Historia clínica de primera vez (formulario por secciones) | Médico (edición) / Admin (lectura) |
| 6 | Vista de impresión: Historia | Médico / Admin |
| 7 | Vista de impresión: Récipe | Médico / Admin |
| 8 | Mi perfil y membrete | Médico |
| 9 | Usuarios (lista y crear/editar) | Admin |
| 10 | Catálogo de medicamentos (lista y crear/editar) | Admin |

## 5. Pantallas generales

### 5.1 Inicio de sesión
Logotipo, nombre del sistema, y los tres usuarios de ejemplo como botones («Entrar como …»). Texto breve: «Prototipo: sin autenticación real».

### 5.2 Lista de pacientes
- Barra de búsqueda por **cédula o nombre**.
- Tabla: Cédula, Nombre y apellido, Edad, Teléfono, Última consulta (fecha). Para el admin, una columna extra «Médicos vinculados».
- Botón **Nuevo paciente** (solo médico).
- Clic en una fila abre la ficha del paciente.
- Estado vacío con mensaje claro.

### 5.3 Nuevo paciente
Formulario de **Datos personales** (ver 6.1). Al escribir la cédula y salir del campo, el sistema **verifica si ya existe**:
- **No existe:** continúa y crea el paciente.
- **Ya existe (lo tiene otro médico):** no se duplica. Mostrar un aviso: «Este paciente ya está registrado. Se vinculará a su lista», con los datos personales ya cargados (solo lectura) y un botón **Vincular a mis pacientes**. Tras vincular, el médico ve al paciente pero **no** las historias del otro médico.

### 5.4 Ficha del paciente
- Datos personales en la parte superior, con botón de editar.
- Lista de **historias del médico en sesión**: fecha, número de historia, motivo(s) de consulta (resumen), botones Ver / Imprimir.
- Botón **Nueva historia** (primera vez).
- El admin ve las historias de todos los médicos, indicando el médico de cada una.

### 5.8 Mi perfil y membrete (médico)
Campos: Nombre completo, Cédula de identidad (CI), **MPPS**, **CML**, y carga de **logo** del membrete. Con **vista previa del membrete** tal como saldrá impreso. Estos datos se usan en el récipe y en la historia impresa.

### 5.9 Usuarios (admin)
Tabla: Nombre, Correo, Rol, Estado (activo/inactivo). Crear y editar usuario: nombre, correo, rol (Admin/Médico), activo. Si el rol es Médico, mostrar los campos del perfil (CI, MPPS, CML).

### 5.10 Catálogo de medicamentos (admin)
Tabla con búsqueda: Nombre, Concentración, Posología por defecto, Estado (activo/inactivo). Crear y editar. La lista de semillas está en el anexo A. Solo el admin edita el catálogo.

## 6. Historia clínica de primera vez (pantalla 5)

Es la pantalla central. Un solo formulario dividido en **9 secciones**, con navegación lateral o por pestañas, que muestra cuáles están completas. Botones fijos en la parte superior: **Guardar**, **Vista previa de impresión**, **Cerrar**.

Orden de las secciones (es el mismo orden de impresión):

1. Datos personales
2. Motivo de consulta y enfermedad actual
3. Antecedentes personales
4. Antecedentes familiares y psicobiológicos
5. Examen físico
6. Paraclínicos (Electrocardiograma, Laboratorios, ETT)
7. Diagnóstico clínico
8. Tratamiento
9. Plan

**No existe** la pestaña «Hand Grip» del programa antiguo: el cliente la tachó. Tampoco las pestañas de «Hábitos/Examen funcional», «Diagnósticos cardiológicos» ni «Estratificación de riesgo»: el cliente no las incluyó **[PENDIENTE: confirmar si se eliminan o quedan para una fase 2]**. No construirlas.

En el encabezado de la historia mostrar: **Fecha de consulta** (hoy por defecto, editable), **Nro. de historia** (asignado por el sistema, solo lectura), y el nombre del médico que la hace.

### 6.1 Datos personales

Campos, en este orden:

| Campo | Tipo |
|---|---|
| Cédula | Texto (único por paciente) |
| Nombres | Texto |
| Apellidos | Texto |
| Sexo | Selección: Femenino / Masculino |
| Fecha de nacimiento | Fecha |
| Edad | **Calculada** a partir de la fecha de nacimiento, solo lectura |
| Dirección actual | Texto largo |
| País | Texto (por defecto Venezuela) |
| Estado | Texto |
| Municipio | Texto |
| Teléfono 1 | Texto |
| Teléfono 2 | Texto |
| Correo electrónico | Correo |
| Ocupación | Texto |
| Nivel académico | Selección única: Analfabeta, Primaria, Secundaria, Técnico, Universitaria |

El programa antiguo tenía además estado civil, lugar de nacimiento, parroquia, fax, profesión y «representante o familiar». El cliente **no los incluyó** en su lista nueva: no construirlos.

### 6.2 Motivo de consulta y enfermedad actual

- **Motivo de consulta:** una tabla con botones **Agregar** y **Quitar**. «Agregar» abre un **selector** con estos 25 motivos (se pueden agregar varios; no se repite el mismo):

  Cambio de coloración en miembros · Cefalea · Cifras de presión arterial elevadas · Cianosis · Control cardiovascular · Debilidad · Disminución de fuerza muscular · Disnea · Dolor en miembros inferiores · Dolor torácico · Edema · Evacuaciones líquidas · Fiebre · Lesión en piel · Mareos · Movimientos involuntarios · Palpitaciones · Pérdida de la consciencia · Referido · Sangrado · Tinnitus · Tos · Valoración preoperatoria · Vértigos · Visión borrosa

- **Enfermedad actual:** una caja de texto grande, libre.

### 6.3 Antecedentes personales

Dos bloques con el mismo comportamiento:

**a) Antecedentes (patologías).** Tabla con dos columnas: **Descripción** (la patología elegida) y **Observación** (campo para escribir). Botones Agregar y Quitar. «Agregar» abre un selector con estas **44 opciones**:

Hipertensión arterial · Enf. vascular cerebral · Enf. valvular cardíaca · IM · Angina inestable · Angina estable · Insuficiencia cardíaca · Enfermedad de Chagas · Cardiopatía valvular · Arritmia · Asma · EPOC · Trombosis venosa profunda · Tromboembolismo pulmonar · Anemia · Hemorragia · Trastorno de conducción cardíaca · Enfermedad arterial periférica · Fibrosis pulmonar · Neumopatía · Sepsis · Muerte súbita abortada · Trombo intracavitario · Cáncer · LOE · Preeclampsia · Eclampsia · Insuficiencia venosa crónica · Artritis reumatoide · Epilepsia · Hipertiroidismo · Hipotiroidismo · Enf. renal crónica · Úlcera péptica · Gastritis · Lupus · Síndrome antifosfolípidos · Portador de MCP · Hernia discal · ITU · Diabetes · Dislipidemia · Vía accesoria · Otros

**No hay columna de edad** (el cliente tachó con una X la columna «Edad Apar./Enf.» del programa antiguo y marcó con ✓ la de Observación).

**b) Intervenciones quirúrgicas.** Misma tabla (Descripción y Observación) con Agregar y Quitar. Selector con estas **15 opciones**:

Histerectomía · Colecistectomía · Apendicectomía · Amigdalectomía · Tiroidectomía · Prostatectomía · Hernioplastia · Varicocele · Cirugía valvular · TU · Miomatosis uterina · Cataratas · Safenectomía · Fractura · Otros

El programa antiguo tenía además un bloque de **Alergias**. El cliente no lo mencionó **[PENDIENTE: confirmar si se conserva]**: no construirlo.

### 6.4 Antecedentes familiares y psicobiológicos

**Antecedentes familiares:** tabla fija de cuatro filas, columnas «Parentesco» y «Descripción» (texto libre): **Madre, Padre, Hermanos, Otros**. Las filas son fijas y no se agregan ni se quitan.

**Antecedentes psicobiológicos:** tabla fija de cuatro filas, columnas «Hábito» y «Descripción» (texto libre): **Tabaquismo, Chimó, OH, Sustancias ilícitas**.

### 6.5 Examen físico

El cliente escribió: **«Consta solo de 3 apartados»**. El programa antiguo tenía 4 pestañas (I a IV). **[PENDIENTE: el cliente no dijo cuál se elimina ni cómo se reagrupan.]** Construir **3 apartados** con esta agrupación **[SUPUESTO]**, fácil de reordenar:

**Apartado 1: Signos vitales, condiciones generales, cuello y tórax**
- **Signos vitales y antropometría:** SatO₂ (nuevo; porcentaje), Peso (kg), Talla (m), Índice de masa corporal (**calculado**), Temperatura (°C), Frecuencia cardíaca, Frecuencia respiratoria, Cadera (cm), Cintura (cm), Índice cintura/cadera (**calculado**), Presión arterial en tres posiciones: **de pie, sentado y acostado**, cada una con sistólica / diastólica.
- **Piel:** texto libre.
- **Condiciones clínicas generales:** Estado hemodinámico (selección; opción «Estable», más las que se agreguen), Llenado capilar (**menor a 3 s / mayor a 3 s**).
- **Cuello:** Pulso venoso yugular (texto), Pulso arterial (texto), **Soplo carotídeo: con soplo / sin soplo**, y si es con soplo, lado: **Izquierda / Derecha / Ambas**.
- **Tórax:** Simetría (**Simétricos / Asimétricos**), Expansibilidad (selección), Ápex (visible: sí/no; palpable: casilla; tipo: **Normodinámico / Hiperdinámico / Sostenido**).

**Apartado 2: Ruidos cardíacos y respiratorios**
- Ruidos cardíacos: **Rítmico / Arrítmico**.
- **Primer ruido:** selección, con su **campo de Observación** (texto libre); Sístole (selección).
- **Segundo ruido:** selección, con su **campo de Observación** (texto libre); Diástole (selección); casillas **R3** y **R4**.
- **Ruidos respiratorios:** **Normal / Con agregados / Abolidos**. Si es «Con agregados», selección: **Crepitantes / Bulosos**. Campo de Observación (texto libre).

**Apartado 3: Abdomen, miembros y neurológico**
- **Abdomen:** circunferencia abdominal (cm), ruidos hidroaéreos (selección), blando (Sí/No), visceromegalia (Sí/No), observación.
- **Miembros inferiores:** simetría; **edema** (Presente / Ausente), lado (**MII / MID / Ambos miembros inferiores**) y **grado I, II, III, IV**. Si el edema es en miembros superiores, el cliente incluyó las opciones **MSI / MSD / Ambos miembros superiores**.
- **Neurológico:** **Estado de conciencia: Vigil / Somnoliento / Estuporoso / Inconsciente**; orientado (Sí/No); marcha (Normal/Anormal); lenguaje coherente (Sí/No); disartria (Sí/No); fuerza motora por miembro (MSD, MSI, MID, MII); observaciones.

> Nota: en el programa antiguo el apartado de miembros inferiores también tenía «enfermedad vascular periférica arterial (amplitud)» y «venosa (localización, grado, úlceras)». El cliente no los mencionó **[PENDIENTE]**. No construirlos salvo que se confirmen.

Existe además un campo **Sí/No** en las anotaciones del cliente cuya etiqueta no se ve en las capturas **[PENDIENTE]**. No construirlo.

### 6.6 Paraclínicos

Es **una sola pantalla**, sin pestañas internas, con tres bloques en este orden. (El programa antiguo tenía pestañas «Electrocardiograma, Laboratorio, Ecocardiograma, Prueba de esfuerzo, Otros»: el cliente las tachó. «Prueba de esfuerzo» y «Otros» no se incluyen **[PENDIENTE]**.)

**a) Electrocardiograma**
- **Ritmo:** opción única **S / NS** (probablemente sinusal / no sinusal; mostrar las siglas tal cual y agregar la ayuda emergente «Sinusal / No sinusal» **[SUPUESTO]**).
- **FC, PR, QRS, QT, QTC:** números.
- **EJE:** selección (las opciones no se ven en las capturas; usar «Normal / Desviado a la izquierda / Desviado a la derecha» **[SUPUESTO]**).
- **Valor del eje:** número (puede ser negativo, por ejemplo −40).
- **Descripción:** texto libre.

No incluir la fila «Impresión diagnóstica» con «Cod. Dx», «Cod. Árbol» y «Buscar» del programa antiguo: aparece cubierta y con rayas rojas en el material del cliente **[PENDIENTE: confirmar si se elimina]**. El diagnóstico va en su propia sección.

**b) Laboratorios.** Tabla de dos columnas: grupo (fijo) y sus campos. Todos los campos son numéricos o de texto corto; **no se dieron unidades**, no inventarlas.

| Grupo | Campos |
|---|---|
| Hematología completa | Hb, GB, Seg, Plaq |
| Química sanguínea | Glucemia basal, Urea, Creatinina |
| Tiempos de coagulación | TP, INR, TTP |
| Uroanálisis | Leucos, Nitritos, Bacterias |
| Serología | VIH, VDRL |
| Perfil lipídico | CT, LDLc, TG |
| Perfil hepático | TGO, TGP, PT, ALB |
| Electrolitos séricos | Sodio, Potasio, Cloro, Calcio, Magnesio |
| H. tiroideas | TSH, T3L, T4L |
| Biomarcadores | NTproBNP, BNP, Troponina I, Dímero D |
| Otros | Texto libre |

**c) ETT (ecocardiograma transtorácico)**
- **Fecha del estudio** (formato día/mes/año).
- **VI:** dos opciones, **dilatado / no dilatado**.
- **FEVI:** número.
- **IMS:** dos opciones, **aumentado / disminuido**.
- **IMVI, GRP, VOL AI, VOL AD, TAPSE, VMIT:** números.
- **Valvulopatías:** texto libre.
- **Observaciones:** texto libre.
- **Adjuntar imagen del informe del eco:** carga de un archivo con miniatura. **La imagen NO se imprime**; en la impresión solo sale lo escrito en los campos anteriores.

### 6.7 Diagnóstico clínico
**Una única caja de texto grande, libre.** Sin tabla, sin fecha, sin observación aparte (el cliente tachó la tabla y la caja de observación y dijo: «este es el único apartado que tendrá esta sección, que permita escribir»).

### 6.8 Tratamiento
Tabla con tres columnas: **Fármaco | Posología | Horario**, y botones **Agregar** y **Quitar**.

- **Agregar:** abre un buscador de medicamentos por nombre. Al escribir (por ejemplo «cande»), la lista muestra **todas las presentaciones** de ese fármaco (Candesartán 8 mg, 16 mg, 32 mg). Al elegir una, se agrega la fila.
- **Posología:** al agregar, se rellena **por defecto** con «Tomar una tableta de X mg» (X según la presentación), y **el médico puede modificarla**.
- **Horario:** campo de texto libre donde se escribe la hora (por ejemplo «8am» o «8am-8pm»).
- **Fármaco libre:** si el medicamento no está en el catálogo, el médico puede **escribirlo a mano** en la fila (opción «Agregar fármaco que no está en el catálogo»). No se agrega al catálogo.
- Mostrar al pie de la sección el recordatorio: las filas definen lo que se imprime en el récipe.

Los medicamentos de ejemplo están en el anexo A.

### 6.9 Plan
**Una única caja de texto grande** para las conclusiones. Sin tabla ni botones de agregar.

## 7. Datos de ejemplo mínimos

- 3 usuarios (punto 3) con perfiles de médico completos (CI, MPPS y CML **inventados**, claramente falsos).
- 6 a 8 pacientes **inventados**, de varias edades y sexos, con cédulas **inventadas**. Al menos uno vinculado a ambos médicos.
- Al menos **2 historias completas** (todas las secciones llenas) y 2 incompletas, con datos clínicos plausibles pero ficticios.
- El catálogo del anexo A.

## 8. Comportamientos que el prototipo debe mostrar

- Selectores con búsqueda y selección múltiple en motivos, antecedentes e intervenciones, sin repetir elementos.
- Cálculo automático de edad, IMC e índice cintura/cadera al llenar los campos.
- Buscador de medicamentos agrupado por nombre con todas las presentaciones; posología por defecto editable.
- Aviso al registrar una cédula que ya existe, y vinculación sin duplicar.
- Aislamiento por médico: cambiar de usuario en el prototipo y comprobar que cada uno ve solo sus historias.
- Indicador de secciones completas/incompletas en la historia.
- Confirmación de «Guardar» (mensaje) y advertencia al cerrar con cambios sin guardar.

## 9. Vistas de impresión

Ambas usan el **membrete del médico** y se imprimen con `window.print()` (hoja carta; estilos `@media print`; sin barras de la aplicación; saltos de página sin partir una sección por la mitad).

### 9.1 Membrete
Zona superior con el logo y el nombre del médico/consultorio (los del perfil del punto 5.8), sobre un **fondo de papel de ECG** (cuadrícula fina rosada con puntos). El fondo debe ser sutil para no afectar la lectura. El cliente solo mostró la palabra «MEMBRETE» como marcador: el logo real lo configura cada médico.

### 9.2 Historia impresa
Estilo de documento clínico **narrativo y compacto**, tal como el ejemplo del cliente (una historia real, que no se reproduce aquí).

Encabezado: **«Historia Médica»**, Página x de y, **Fecha de consulta**, y los datos: Cédula, Nombre, Fecha de nacimiento, Edad, Nro. de historia.

Orden **exacto** de las secciones:

1. Motivo de consulta
2. Enfermedad actual
3. Antecedentes personales
4. Antecedentes familiares y psicobiológicos
5. Examen físico
6. Paraclínicos:
   1. Electrocardiograma
   2. Laboratorios
   3. ETT (**no se imprime la imagen del informe**; solo lo escrito en el apartado)
7. Diagnóstico
8. Tratamiento
9. Plan
10. Datos del médico que hizo la historia (firma y datos: nombre, CI, MPPS, CML)

Formato de la sección de examen físico y paraclínicos en una línea corrida, como en el ejemplo, por ejemplo (valores inventados): «Peso 70; Talla 1,70; Índice de masa corporal 24,2; Frecuencia cardíaca 78; Sentado 120/80 …» y «Electrocardiograma: Ritmo sinusal; FC 72; PR 0,16; QRS 0,10; QT 0,36; QTC 0,40; Eje 30; descripción …».

### 9.3 Récipe impreso
Una hoja con el membrete arriba. Debajo, **un recuadro con**: Nombre y apellido del paciente, Edad y CI (el modelo del cliente muestra dos variantes: una con CI y otra sin CI **[PENDIENTE]**).

Cuerpo: la lista de medicamentos de la sección Tratamiento. El cliente mostró **dos modelos lado a lado** **[PENDIENTE: confirmar cuál prefieren]**. Construir ambos y un **interruptor «Modelo A / Modelo B»** en la vista previa:

- **Modelo A:** viñetas con «**Fármaco** Tab Xmg» (por ejemplo «**Candesartán** Tab 8 mg»).
- **Modelo B:** viñetas con «**Fármaco:** posología y hora» (por ejemplo «**Candesartán:** Tomar una tableta de 8 mg 7am»).

Pie (en la parte inferior de la hoja): **Fecha** (fecha de emisión, **automática**), **Médico**, **CI**, **MPPS**, **CML**, tomados del perfil del médico que hizo la historia, no escritos a mano.

## 10. Criterios de aceptación del prototipo

- [ ] Hay inicio de sesión con los 3 usuarios y los menús cambian según el rol.
- [ ] Un médico solo ve sus pacientes y solo sus historias; el admin ve todo y no edita historias.
- [ ] Registrar una cédula existente vincula al paciente sin duplicarlo.
- [ ] La historia tiene las 9 secciones en el orden indicado y sin «Hand Grip».
- [ ] Datos personales con los 15 campos de la lista y nivel académico con sus 5 opciones.
- [ ] Motivo de consulta con 25 opciones; antecedentes personales con 44; intervenciones con 15; sin columna de edad.
- [ ] Antecedentes familiares (4 filas) y psicobiológicos (4 filas) fijos.
- [ ] Examen físico en 3 apartados, con SatO₂, llenado capilar, soplo carotídeo con lado, crepitantes/bulosos y observaciones de ruidos.
- [ ] Paraclínicos en una pantalla: ECG, laboratorios por grupos y ETT con imagen que no se imprime.
- [ ] Diagnóstico y Plan son una sola caja de texto cada uno.
- [ ] Tratamiento con buscador por nombre, todas las presentaciones, posología editable por defecto y horario libre.
- [ ] La historia impresa respeta el orden de 10 puntos y el récipe tiene fecha automática y datos del médico.
- [ ] El perfil del médico configura el membrete y se refleja en la vista previa.
- [ ] El admin gestiona usuarios y catálogo.

## 11. Lo que el prototipo no incluye

Autenticación real, base de datos, subida real de archivos, migración de historias del sistema anterior, respaldos, hospedaje, historias de seguimiento (posteriores a la primera), PDF del informe para el paciente, consultorio compartido entre médicos, y toda la fase de inteligencia artificial. Ver `02-funcionamiento-del-sistema.md` para lo que es decisión y lo que está pendiente.

---

## Anexo A: Catálogo de medicamentos (datos semilla)

Una fila por presentación (70 filas). Los encabezados de grupo (antihipertensivos, betabloqueantes, etc.) son solo para ordenar esta lista: **el cliente no los definió y no son un campo del catálogo**. Posología por defecto: «Tomar una tableta de X mg». Entre paréntesis, el horario que el cliente mostró como ejemplo (el horario es de texto libre y **no** se guarda en el catálogo).

**Antihipertensivos y de insuficiencia cardíaca**
- Candesartán tab 8 mg, 16 mg, 32 mg (8am)
- Valsartán tab 80 mg, 160 mg (8am-8pm)
- Enalapril tab 10 mg, 20 mg (8am-8pm)
- Lisinopril tab 10 mg, 20 mg (8am)
- Losartán tab 50 mg, 100 mg (8am-8pm)
- Irbesartán tab 150 mg, 300 mg (8am)
- Olmesartán tab 40 mg, 80 mg
- Ramipril tab 2,5 mg, 5 mg, 10 mg
- Candesartán + Hidroclorotiazida tab 16/12,5 mg
- Valsartán + Clortalidona tab 80/12,5 mg
- Valsartán + Hidroclorotiazida tab 80/12,5 mg
- Sacubitril/valsartán tab 50 mg, 100 mg, 200 mg
- Amlodipina tab 5 mg, 10 mg
- Nifedipina LP tab 30 mg, 60 mg
- Verapamilo tab 80 mg, 120 mg
- Diltiazem tab 60 mg, 120 mg

**Betabloqueantes**
- Bisoprolol tab 1,25 mg, 2,5 mg, 5 mg, 10 mg
- Carvedilol tab 6,25 mg, 12,5 mg, 25 mg
- Metoprolol tab 50 mg
- Nebivolol tab 2,5 mg, 5 mg

**Antidiabéticos cardiometabólicos (iSGLT2)**
- Empagliflozina tab 10 mg, 25 mg
- Dapagliflozina tab 10 mg

**Anticoagulantes y antiagregantes**
- Rivaroxabán tab 10 mg, 15 mg, 20 mg
- Apixabán tab 2,5 mg, 5 mg
- Warfarina tab 5 mg, 2,5 mg
- Ácido acetilsalicílico (aspirina) tab 81 mg
- Clopidogrel tab 75 mg
- Ticagrelor tab 90 mg

**Diuréticos**
- Furosemida tab 20 mg, 40 mg
- Bumetanida tab 1 mg
- Hidroclorotiazida tab 12,5 mg, 25 mg
- Clortalidona tab 12,5 mg y 25 mg (ver erratas)

**Estatinas e hipolipemiantes**
- Atorvastatina tab 10 mg, 20 mg, 40 mg, 80 mg
- Atorvastatina/ezetimiba tab 40/10 mg
- Rosuvastatina/ezetimiba tab 20/10 mg
- Rosuvastatina tab 20 mg, 40 mg

**Erratas detectadas en el material del cliente (confirmar con ellos; en el prototipo aplicar la corrección indicada):**
- «Cloralidona 12,5 mg» y «Clortalidona 25 mg» aparecen como dos fármacos. Se asume que es **Clortalidona**; usar un solo nombre con 12,5 mg y 25 mg.
- «Ramipril 5 mg» trae la posología de 2,5 mg. Corregir a «Tomar una tableta de 5 mg».
- Olmesartán 40 y 80 mg no traen horario de ejemplo (no afecta: el horario es libre).

**Falta añadir:** antibióticos y antidiabéticos. El cliente lo indicó; la lista la aportará después. No inventarlos: el admin podrá agregarlos desde la pantalla del catálogo.
