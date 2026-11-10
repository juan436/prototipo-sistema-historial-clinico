# Cómo funcionará el sistema

Proyecto: **sistema web de historia clínica cardiológica** para una organización de cardiólogos (consulta privada).
Este documento describe el sistema real: qué es, quién lo usa, cómo se guardan y protegen los datos, y qué está decidido y qué no. El diseño de pantallas del prototipo está en `01-instrucciones-prototipo-visual.md`.

## 0. Cómo leer este documento

Cada punto indica su estado:

- **DECIDIDO:** acordado con el desarrollador.
- **PROPUESTO:** recomendación del desarrollador que aún no se ha confirmado.
- **PENDIENTE (cliente):** no está definido; hay que preguntarlo al cliente.
- **SUPUESTO:** interpretación del material del cliente que no está confirmada.

El documento del cliente (diapositivas con capturas de su programa actual y anotaciones) **no dice nada** sobre usuarios, roles, privacidad, hospedaje ni respaldos. Todo eso son decisiones de diseño del desarrollador que se le confirman al cliente.

## 1. Qué es el sistema

**Problema.** Los cardiólogos usan hoy un programa de escritorio antiguo («Historia de Consulta Externa», con pestañas laterales y tablas grises) para llenar la historia clínica del paciente. Piden reemplazarlo por una versión web.

**Objetivo del MVP (DECIDIDO).** Reproducir en web lo que ya les funciona y mejorarlo en lo que el cliente mismo pidió:

- Un formulario único por secciones, con **selectores y casillas en lugar de tablas grises**.
- Un **catálogo de medicamentos** buscable, con posología por defecto.
- **Impresión** de la historia y del récipe con el membrete de cada médico.
- Un **formato de historia de primera vez** definido por el cliente.

**Qué es la historia de primera vez.** El paciente llega por primera vez a un médico y este llena toda la historia. Esa es la única historia que el cliente definió. Cómo son las consultas posteriores (seguimiento) **no está definido** (ver sección 10).

## 2. Usuarios y roles

**DECIDIDO.** Dos roles, con **permisos por módulo y nivel guardados en tablas** (no fijos en el código), para poder agregar roles después sin tocar código.

| Rol | Qué hace |
|---|---|
| **Médico** | Registra pacientes, llena y firma historias, imprime historia y récipe, configura su propio membrete y datos |
| **Admin** | Ve todos los pacientes y todas las historias (**no las crea ni las edita** [SUPUESTO]), administra usuarios y mantiene el catálogo de medicamentos |

**Módulos y niveles de permiso.** Cada rol tiene un nivel por módulo: `view` (ver), `create` (crear) o `manage` (gestionar). Módulos: pacientes, historias, catálogo de medicamentos, usuarios.

**Rol futuro (no entra al MVP).** Un rol gerencial con alcance de lectura sobre todos los pacientes. Con la tabla de permisos basta agregar una fila.

**Membrete por médico (DECIDIDO).** Cada médico configura su propio perfil: nombre, CI, MPPS, CML y logo del membrete. Es configuración del usuario, no un permiso. El admin no tiene perfil de médico.

## 3. Reglas de acceso a los datos

**DECIDIDO.**

1. **El paciente es único por cédula.** No se duplica.
2. **Un paciente puede estar vinculado a varios médicos** (relación de muchos a muchos). Un médico ve los pacientes con los que está vinculado.
3. **Cada historia pertenece al médico que la hizo y solo ese médico la ve** (más el admin). Si el paciente va con otro médico, ese médico **empieza su propio historial desde cero**: no ve lo que escribió el primero.
4. **El admin ve todo.**

**Cómo se vincula un paciente.** Cuando un médico registra una cédula:
- Si no existe, se crea el paciente y se vincula a ese médico.
- Si ya existe (lo tiene otro médico), no se duplica: se **vincula** también al segundo médico, que ve los datos personales pero no las historias del otro.

**Consecuencias que el cliente debe conocer.**
- Los antecedentes (personales, familiares, hábitos) viven dentro de cada historia, así que el segundo médico los vuelve a llenar.
- Si un paciente va con otro médico por una emergencia o ausencia del suyo, ese médico lo vincula pero no ve el historial anterior.
- Un paciente con varios médicos no tiene un expediente compartido.

**Alternativas descartadas (con el motivo).**

| Opción | Por qué no |
|---|---|
| Paciente de un solo médico («el que lo registró») | No cambia nunca: si va con otro, ese no lo ve |
| Paciente de un solo médico («el que lo atiende») | Obliga a un traspaso del admin; el paciente puede querer ver a dos médicos |
| Acceso colgado de la consulta | Complica el modelo con un caso (la emergencia) que el cliente no mencionó |
| Historial compartido entre los médicos del paciente | Decisión de privacidad y legal que le toca al cliente |

**PENDIENTE (cliente).** Un colega que habla con el cliente planteó una **suposición sin confirmar**: que un **consultorio lo usen varios médicos con acceso al mismo historial**, y que el paciente tiene un **médico de cabecera** con el que se trata. Si el cliente lo confirma, la regla 3 cambia: hará falta el concepto de **consultorio** (los médicos pertenecen a uno y ven los historiales de los pacientes de su consultorio). Como todavía no hay nada construido, cambiarlo ahora es barato.

## 4. Datos del sistema

**PROPUESTO.** Base de datos **PostgreSQL** con **Prisma**. Los datos son relacionales (muchos a muchos entre médicos y pacientes, claves foráneas, cédula única, transacciones). Para los bloques de campos variables de una historia (examen físico, laboratorios) se puede usar una columna `JSONB` sin perder las relaciones del resto. El diseño final de tablas se cierra al construir.

**Modelo de tablas (DECIDIDO en lo esencial).**

| Tabla | Qué guarda |
|---|---|
| `users` | Médicos y admin: nombre, correo, clave, rol, estado |
| `roles` | `admin`, `medico` |
| `role_permissions` | Por rol: módulo y nivel (`view`, `create`, `manage`) |
| `doctor_profiles` | Del médico: CI, MPPS, CML, logo del membrete |
| `patients` | Datos personales; una fila por cédula |
| `doctor_patients` | Qué médicos tienen a qué pacientes (muchos a muchos) |
| `consultations` | Cada historia: paciente, médico que la hizo, fecha, número de historia y todas las secciones |
| `medications` | Catálogo: una fila por presentación |
| `consultation_medications` | El tratamiento de cada historia: fármaco, posología y horario |

**Regla de integridad: copia del tratamiento.** `consultation_medications` guarda **una copia del texto** del fármaco, posología y horario, no solo una referencia al catálogo. Si el admin corrige una errata del catálogo, las historias ya firmadas no deben cambiar. Esto también cubre el fármaco que el médico escribe a mano y no está en el catálogo.

**Número de historia.** Lo asigna el sistema. **PENDIENTE (cliente):** si ya existe una numeración en papel que haya que respetar. El programa antiguo tiene un campo «Historia» y otro «Fecha de ingreso».

## 5. La historia clínica de primera vez

Una historia (`consultation`) tiene **9 secciones** en este orden, que es también el orden de impresión:

1. Datos personales
2. Motivo de consulta y enfermedad actual
3. Antecedentes personales (patologías e intervenciones quirúrgicas)
4. Antecedentes familiares y psicobiológicos
5. Examen físico (3 apartados)
6. Paraclínicos: electrocardiograma, laboratorios, ETT
7. Diagnóstico clínico
8. Tratamiento
9. Plan

El detalle campo por campo (con sus opciones exactas) está en `01-instrucciones-prototipo-visual.md`, sección 6. Puntos de diseño que importan para el sistema real:

- **Selectores en lugar de texto libre** en motivos de consulta, antecedentes e intervenciones. Cada selección guarda el nombre elegido y, donde aplica, una observación.
- **Campos calculados:** edad (de la fecha de nacimiento), índice de masa corporal e índice cintura/cadera.
- **Diagnóstico y Plan** son una sola caja de texto cada uno. No hay tabla de diagnósticos.
- **ETT:** se guardan los valores escritos y **la imagen del informe del eco**. La imagen se guarda en almacenamiento de archivos (sección 8), no en la base; no se imprime.
- **Quedan fuera** respecto al programa anterior: «Hand Grip» (tachado por el cliente), la fila de «Impresión diagnóstica» con códigos (cubierta por el cliente), las pestañas de «Prueba de esfuerzo» y «Otros», y las pestañas de Hábitos/Examen funcional, Diagnósticos cardiológicos y Estratificación de riesgo (no incluidas). **PENDIENTE (cliente):** confirmar cada una.
- **PENDIENTE (cliente):** el cliente dice que el examen físico «consta solo de 3 apartados» y el programa antiguo tenía 4; falta saber cuál se elimina y cómo se reagrupan.

## 6. Catálogo de medicamentos

**DECIDIDO.**

1. **Solo el admin** agrega y modifica el catálogo. Los médicos solo lo usan. Motivo: si cada médico agregara fármacos, aparecerían variantes del mismo nombre y el buscador dejaría de mostrar todas las presentaciones juntas, que es lo que pide el cliente.
2. **Fármaco libre como respaldo.** Si el medicamento no está en el catálogo, el médico lo escribe a mano en la fila de tratamiento. Una historia no puede quedar bloqueada porque falte un fármaco (hoy faltan los antibióticos y los antidiabéticos). La fila escrita a mano no entra al catálogo.
3. **Un solo catálogo para todos los médicos.** El cliente habló de «los medicamentos que solemos usar», como organización.

**Cómo funciona el tratamiento.** Al agregar un medicamento, el médico busca por nombre y el sistema muestra **todas las presentaciones** (por ejemplo, 8, 16 y 32 mg). La **posología** viene rellena («Tomar una tableta de X mg») y se puede modificar. El **horario** lo escribe el médico. Esas filas definen lo que sale en el récipe.

**Datos iniciales.** ~70 presentaciones (anexo A del documento de instrucciones del prototipo), con tres erratas por confirmar con el cliente. **PENDIENTE (cliente):** la lista de **antibióticos y antidiabéticos**, que el desarrollador pedirá al cliente, y con qué frecuencia cambia el catálogo.

## 7. Impresión

**DECIDIDO.** Dos documentos distintos, ambos con el **membrete del médico** que hizo la historia, sobre fondo de papel de ECG.

**Historia impresa.** Formato de documento clínico narrativo y compacto, en este orden: motivo de consulta, enfermedad actual, antecedentes personales, antecedentes familiares y psicobiológicos, examen físico, paraclínicos (electrocardiograma, laboratorios, ETT sin la imagen), diagnóstico, tratamiento, plan, y datos del médico. El encabezado lleva cédula, nombre, fecha de nacimiento, edad, número de historia y fecha de consulta.

**Récipe.** Membrete, recuadro con nombre, edad y CI del paciente, lista de medicamentos según el tratamiento, y pie con **fecha de emisión automática** y los datos del médico (nombre, CI, MPPS, CML) tomados de su perfil. **PENDIENTE (cliente):** el cliente mostró dos modelos (uno solo con «Fármaco Tab Xmg» y otro con posología y hora), y uno sin CI. Hay que confirmar cuál prefieren.

## 8. Hospedaje, seguridad y respaldos

Los datos son **datos clínicos sensibles**. Perder la base no se recupera.

**Hospedaje (DECIDIDO).** Un **VPS propio** con la configuración de seguridad estándar del desarrollador, la misma plantilla que se usa en otros sistemas: llave SSH por servidor, SSH solo por VPN (WireGuard), cortafuegos (UFW), fail2ban, actualizaciones automáticas de seguridad, Docker, y un proxy inverso (Traefik) como única puerta de entrada web. **El mantenimiento lo hace el desarrollador.** Se descartó una base de datos administrada de terceros por costo variable y dependencia del proveedor; como PostgreSQL funciona igual en ambos, se puede migrar si el cliente lo pide.

**Respaldos (DECIDIDO).**
- **Destino principal:** Cloudflare R2 (gratis hasta 10 GB, sin costo de descarga, compatible con S3).
- **Copia secundaria:** Google, en otro proveedor.
- **PROPUESTO** (pendiente de confirmar): copia diaria de la base; **cifrado antes de subir**, con la clave fuera del servidor; retención definida (por ejemplo 30 días de diarias y algunas mensuales); **prueba de restauración periódica**; respaldo también de los archivos subidos (la imagen del eco).
- **PENDIENTE:** qué producto de Google (Drive o Cloud Storage), y la frecuencia y retención definitivas.
- Los 10 GB de R2 alcanzan mientras el sistema sea pequeño; las imágenes del eco crecen con el uso y hay que vigilarlo.

**PENDIENTE (cliente).** De quién es la cuenta del servidor; quién responde por los datos clínicos; qué exige la ley venezolana sobre datos de salud (no está verificado, hay que confirmarlo con quien corresponda); quién accede directamente a la base (idealmente solo el desarrollador, por VPN).

## 9. Migración de las historias del sistema anterior

**DECIDIDO.** Las historias del programa antiguo se migran desde un archivo **Excel, CSV o JSON** que entrega el cliente. El desarrollador hace la importación.

**PENDIENTE (cliente).** Cómo se asigna un médico a cada historia migrada (un campo en el archivo, todas a un médico, o sin médico hasta reasignarlas, visibles solo para el admin). Y qué campos trae el archivo, para mapearlos a este formato.

## 10. Lo que no está definido (resumen de preguntas para el cliente)

1. **Seguimiento.** ¿Cómo es la consulta de seguimiento? ¿Repite la historia completa o es más corta? ¿Se copian antecedentes de la visita anterior? (El título «Historia de primera vez» y los campos «Historia» y «Fecha de ingreso» del programa antiguo sugieren que existe un paciente con consultas sucesivas, pero el documento no lo confirma.)
2. **Consultorio compartido** y médico de cabecera (sección 3).
3. **Compartir el historial con colegas.**
4. **PDF para el paciente.** ¿El paciente recibe su historia como informe en PDF? ¿Es el mismo documento o una versión resumida? ¿Cómo se entrega (descarga, correo)?
5. **Admin:** ¿puede crear o editar historias, o solo verlas?
6. **Examen físico:** cuál de las 4 pestañas desaparece y qué es el campo Sí/No sin etiqueta.
7. **Paraclínicos:** si se elimina la impresión diagnóstica con códigos, y qué pasa con prueba de esfuerzo y «Otros».
8. **Otras pestañas del programa antiguo:** alergias, hábitos/examen funcional, diagnósticos cardiológicos, estratificación de riesgo.
9. **Récipe:** modelo con o sin posología y horario, con o sin CI.
10. **Catálogo:** antibióticos y antidiabéticos; erratas; frecuencia de cambios.
11. **Numeración** de historias.
12. **Hospedaje y datos:** cuenta del servidor, responsable, normativa.
13. **Migración:** asignación de médico y campos del archivo.
14. **Presupuesto y plazo** del cliente (no hay ninguno).

## 11. Fases

**DECIDIDO (como estructura).** Se sigue la estrategia de cotización por fases: MVP barato y rápido, y las demás fases como valores agregados que se contratan aparte; desarrollo y despliegue se cobran por separado en cada fase.

| Fase | Contenido |
|---|---|
| **MVP** | Historia de primera vez en web, roles admin y médico, pacientes con regla de acceso, catálogo de medicamentos, impresión de historia y récipe con membrete, migración del sistema anterior |
| **Fase 2 (propuesta)** | **IA experta** dentro de la sesión de cada médico (ver abajo) |
| **Soporte** | VPS con la plantilla de seguridad, respaldos y mantenimiento mensual |

**Fase 2: IA experta (PROPUESTA, no entra al MVP).** Idea que planteó el cliente a través de un colega: una IA que responda sobre el sistema dentro de la sesión de cada médico, con:
- información general de los pacientes;
- cuántos pacientes tienen hipertensión;
- pacientes que dejaron de ir a consulta;
- reportes generales;
- ayuda para generar el diagnóstico en el récipe.

El colega aclaró que es una idea y que puede ser después de todo. Para cuando se cotice, hay tres consideraciones:
1. **Gran parte no necesita IA.** «Cuántos tienen hipertensión» o «quiénes no volvieron» son consultas a la base de datos. La IA aporta que el médico las pida en lenguaje natural. Conviene separar los reportes fijos de la conversación.
2. **Debe respetar el acceso.** La IA solo puede consultar los pacientes y las historias de la sesión del médico (o del consultorio, si se decide así).
3. **La ayuda con el diagnóstico es lo más delicado.** Es una sugerencia que el médico revisa y firma; hay que decidir cómo se presenta y quién responde por ella. Además, enviar datos de pacientes a un proveedor de IA externo es una decisión de privacidad aparte que hay que definir antes de ofrecerlo.

## 12. Lo que el sistema NO hace en el MVP

Historias de seguimiento, expediente compartido entre médicos, PDF del informe para el paciente, consultorio compartido, estratificación de riesgo, alergias, Hand Grip, prueba de esfuerzo, impresión diagnóstica con códigos, y la fase de inteligencia artificial. Todo lo anterior depende de las respuestas del cliente (sección 10) o de una fase posterior.
