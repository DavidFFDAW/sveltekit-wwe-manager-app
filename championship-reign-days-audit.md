# Auditoría de `ChampionshipReign.days`

Inventario de dependencias del campo `days` del modelo `ChampionshipReign`. El objetivo es dejar de usar el valor almacenado y calcular la duración a partir de `won_date` y `lost_date` (o la fecha actual cuando el reinado siga activo).

> Este documento es una fotografía del código revisado el 25 de octubre de 2026. No implica la eliminación de la columna de base de datos.

## Consideración de esquema

El campo está definido como obligatorio y sin valor por defecto:

```prisma
days Int @db.Int
```

Mientras siga así, Prisma y la base de datos exigirán un valor en las creaciones de reinados. Para conservar la columna pero dejar de escribirla desde la aplicación, habrá que decidir si pasa a tener un valor por defecto (por ejemplo, `@default(0)`) o si se vuelve opcional.

## Escrituras y actualizaciones

| Ubicación | Uso actual |
| --- | --- |
| `src/lib/server/adapters/reigns.adapter.ts` | Lee `days` del formulario y lo incluye en los tres objetos de creación de reinado. |
| `src/routes/admin/championship-reigns/components/upsert-common-datas.svelte` | Calcula y asigna `reign.days`; mantiene además un input con `name="days"`. |
| `src/routes/admin/championship-reigns/upsert/+page.server.ts` | Calcula y guarda los días del reinado creado/editado y del reinado anterior que se cierra. |
| `src/routes/admin/championship-reigns/create/+page.server.ts` | Guarda los días recalculados al cerrar el reinado anterior. |
| `src/routes/admin/championship-reigns/+page.server.ts` | Recalcula y persiste los días al editar un reinado. |
| `src/routes/admin/championship-reigns/championship/+page.server.ts` | Recalcula y persiste los días al editar desde la vista por campeonato. |
| `src/lib/server/dao/championship.dao.ts` | Al desactivar un campeonato, cierra el reinado actual y guarda los días calculados. |
| `src/lib/server/dao/repositories/reigns.repository.ts` | `finishReign` calcula y guarda los días al cerrar un reinado. |
| `src/routes/admin/money-in-the-bank/upsert/+page.server.ts` | Guarda los días calculados al crear o editar un reinado Money in the Bank. |
| `src/routes/admin/money-in-the-bank/cash-in/+page.server.ts` | Crea el nuevo reinado tras un canje con `days`. |

## Mantenimiento automático a retirar o adaptar

| Ubicación | Uso actual |
| --- | --- |
| `src/lib/server/dao/reigns.dao.ts` | `updateCurrentChampionshipReignDays` incrementa `days` en todos los reinados actuales. |
| `src/routes/api/cronjobs/cronjobs.execute.ts` | Registra esa función con la clave de cron `update-reigns`. |
| `src/routes/api/reigns/update-days/current/+server.ts` | Endpoint que recalcula y persiste los días de los reinados actuales. |

Cuando las duraciones se calculen en lectura, estas actualizaciones diarias dejan de aportar valor y deben eliminarse del cron y del endpoint, o quedar explícitamente deprecadas.

## Lecturas y presentación

| Área | Ubicaciones | Uso actual |
| --- | --- | --- |
| Público | `src/routes/(public)/champions/champion-card.svelte` | Muestra `reign.days` junto a la duración formateada. |
| Público | `src/routes/(public)/roster/[wrestler]/+page.svelte` | Muestra los días de cada reinado del luchador. |
| Administración | `src/routes/admin/championship-reigns/championship-reign-card.svelte` | Muestra el número de días en la tarjeta de reinado. |
| Administración | `src/routes/admin/championship-reigns/bywrestler/+page.server.ts` | Genera `days_str` desde `reign.days`. |
| Administración | `src/routes/admin/championships/update/[id]/+page.svelte` | Formatea `reign.days` en el historial del campeonato. |
| Administración | `src/routes/admin/championship-reigns/defences/update/+page.server.ts` | Ordena por `days` y genera `time_days`. |
| Administración | `src/routes/admin/championship-reigns/adjust/+page.svelte` | Compara `calculated_days` con el valor guardado, específicamente para detectar discrepancias. |
| Money in the Bank | `src/routes/admin/money-in-the-bank/+page.server.ts` | Selecciona `days` y genera el texto `days_held`. |
| Money in the Bank | `src/routes/admin/money-in-the-bank/cash-in/+page.server.ts` | Incluye `reign.days` en los datos enviados a la pantalla de canje. |
| Consultas auxiliares | `src/lib/server/dao/reigns.dao.ts` | Genera `days_month` a partir de `reign.days` al obtener reinados ordenados. |

## Rankings, sumatorios y consultas históricas

Estos son los puntos de mayor impacto: no basta sustituir una lectura individual, porque actualmente agregan la columna almacenada.

| Ubicación | Uso actual |
| --- | --- |
| `src/lib/server/dao/repositories/reigns.repository.ts` | Dos consultas SQL hacen `SUM(r.days)` para los rankings por luchador y por campeonato; también ordenan por `total_days`. |
| `src/routes/admin/championship-reigns/+page.server.ts` | Usa Prisma `groupBy` con `_sum: { days: true }`. |
| `src/routes/admin/championship-reigns/rankings/+page.server.ts` | Usa `_sum.days` para el total y su texto formateado. |
| `src/routes/admin/championship-reigns/rankings/test/+page.server.ts` | Usa `_sum.days` de luchadores y parejas, suma los valores y ordena por días en caso de empate. |
| `src/routes/admin/championship-reigns/bydate/+page.server.ts` | La consulta SQL selecciona `r.days` para reinados visibles en una fecha histórica. |

Con MySQL, los agregados pueden calcularse en SQL usando la diferencia entre fechas y un final efectivo como `COALESCE(lost_date, CURDATE())`. Como alternativa, se pueden obtener los reinados y sumar la duración calculada en TypeScript. Prisma no permite reemplazar directamente `_sum.days` por una expresión de fecha en un `groupBy`.

## Orden recomendado para la migración

1. Crear una función única de duración que reciba `won_date` y `lost_date` y defina con precisión el criterio de redondeo y la zona horaria.
2. Sustituir las lecturas y formatos individuales por dicha función.
3. Adaptar las consultas históricas, ordenaciones y rankings, especialmente los `SUM` y `_sum.days`.
4. Eliminar las escrituras desde formularios, adaptadores y operaciones de cierre/creación.
5. Retirar el endpoint y el cron de actualización diaria.
6. Ajustar el esquema para que el campo pueda permanecer sin ser escrito por la aplicación.

