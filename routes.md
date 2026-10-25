# Rutas del proyecto

Inventario generado el 25 de octubre de 2026 a partir de `src/routes`. Incluye únicamente los archivos `+page.svelte` y `+server.ts`.

## Convenciones

- Los grupos de ruta de SvelteKit (por ejemplo, `(public)` y `(statics)`) no forman parte de la URL.
- `{nombre}` representa un parámetro dinámico de SvelteKit (`[nombre]`); `{nombre?}` es opcional (`[[nombre]]`).
- Este documento no incluye `+page.server.ts`, layouts, componentes ni otros ficheros auxiliares, pues no crean una ruta propia.

## Endpoints (`+server.ts`) — 43

| Ruta | Archivo |
| --- | --- |
| `/admin/matchcards/export/{slug}` | `src/routes/admin/matchcards/export/[slug]/+server.ts` |
| `/admin/matchcards/export/txt` | `src/routes/admin/matchcards/export/txt/+server.ts` |
| `/api/analytics/track` | `src/routes/api/analytics/track/+server.ts` |
| `/api/auth/check` | `src/routes/api/auth/check/+server.ts` |
| `/api/auth/logout` | `src/routes/api/auth/logout/+server.ts` |
| `/api/blog/generate` | `src/routes/api/blog/generate/+server.ts` |
| `/api/blog/generate/gemini` | `src/routes/api/blog/generate/gemini/+server.ts` |
| `/api/blog/generate/groq` | `src/routes/api/blog/generate/groq/+server.ts` |
| `/api/blog/generate/model/{model}` | `src/routes/api/blog/generate/model/[model]/+server.ts` |
| `/api/blog/posts` | `src/routes/api/blog/posts/+server.ts` |
| `/api/blog/slug/refresh` | `src/routes/api/blog/slug/refresh/+server.ts` |
| `/api/blog/toggle-publish/{id}` | `src/routes/api/blog/toggle-publish/[id]/+server.ts` |
| `/api/brands/adjust` | `src/routes/api/brands/adjust/+server.ts` |
| `/api/cronjob/refresh-host` | `src/routes/api/cronjob/refresh-host/+server.ts` |
| `/api/cronjobs/{slug}` | `src/routes/api/cronjobs/[slug]/+server.ts` |
| `/api/cronjobs/check-injuries` | `src/routes/api/cronjobs/check-injuries/+server.ts` |
| `/api/cronjobs/execute-all` | `src/routes/api/cronjobs/execute-all/+server.ts` |
| `/api/export/csv/wrestlers` | `src/routes/api/export/csv/wrestlers/+server.ts` |
| `/api/export/database/all` | `src/routes/api/export/database/all/+server.ts` |
| `/api/export/database/table/{slug}` | `src/routes/api/export/database/table/[slug]/+server.ts` |
| `/api/export/json/{model}` | `src/routes/api/export/json/[model]/+server.ts` |
| `/api/export/json/all` | `src/routes/api/export/json/all/+server.ts` |
| `/api/export/sql/all` | `src/routes/api/export/sql/all/+server.ts` |
| `/api/export/sql/table/{model}` | `src/routes/api/export/sql/table/[model]/+server.ts` |
| `/api/images` | `src/routes/api/images/+server.ts` |
| `/api/images/upload` | `src/routes/api/images/upload/+server.ts` |
| `/api/images/upload/vps` | `src/routes/api/images/upload/vps/+server.ts` |
| `/api/imgur/auth` | `src/routes/api/imgur/auth/+server.ts` |
| `/api/imgur/delete/{hash}` | `src/routes/api/imgur/delete/[hash]/+server.ts` |
| `/api/imgur/images` | `src/routes/api/imgur/images/+server.ts` |
| `/api/imgur/upload` | `src/routes/api/imgur/upload/+server.ts` |
| `/api/ppv/card/match/{id}` | `src/routes/api/ppv/card/match/[id]/+server.ts` |
| `/api/ppv/year/refresh` | `src/routes/api/ppv/year/refresh/+server.ts` |
| `/api/push/send` | `src/routes/api/push/send/+server.ts` |
| `/api/push/subscribe` | `src/routes/api/push/subscribe/+server.ts` |
| `/api/reigns/update-days/current` | `src/routes/api/reigns/update-days/current/+server.ts` |
| `/api/subscribe` | `src/routes/api/subscribe/+server.ts` |
| `/api/teams/delete/{uuid}` | `src/routes/api/teams/delete/[uuid]/+server.ts` |
| `/api/teams/gender/refresh` | `src/routes/api/teams/gender/refresh/+server.ts` |
| `/api/test` | `src/routes/api/test/+server.ts` |
| `/api/test/email` | `src/routes/api/test/email/+server.ts` |
| `/api/wrestler/slug/refresh` | `src/routes/api/wrestler/slug/refresh/+server.ts` |
| `/test/pep` | `src/routes/test/pep/+server.ts` |

## Páginas (`+page.svelte`) — 106

| Ruta | Archivo |
| --- | --- |
| `/` | `src/routes/+page.svelte` |
| `/about` | `src/routes/(public)/(statics)/about/+page.svelte` |
| `/admin` | `src/routes/admin/+page.svelte` |
| `/admin/analytics` | `src/routes/admin/analytics/+page.svelte` |
| `/admin/blog` | `src/routes/admin/blog/+page.svelte` |
| `/admin/blog/{slug}/notifications` | `src/routes/admin/blog/[slug]/notifications/+page.svelte` |
| `/admin/blog/categories` | `src/routes/admin/blog/categories/+page.svelte` |
| `/admin/blog/create` | `src/routes/admin/blog/create/+page.svelte` |
| `/admin/blog/ia-log` | `src/routes/admin/blog/ia-log/+page.svelte` |
| `/admin/blog/update/{id}` | `src/routes/admin/blog/update/[id]/+page.svelte` |
| `/admin/blog/upsert` | `src/routes/admin/blog/upsert/+page.svelte` |
| `/admin/championship-reigns` | `src/routes/admin/championship-reigns/+page.svelte` |
| `/admin/championship-reigns/adjust` | `src/routes/admin/championship-reigns/adjust/+page.svelte` |
| `/admin/championship-reigns/bydate` | `src/routes/admin/championship-reigns/bydate/+page.svelte` |
| `/admin/championship-reigns/bywrestler` | `src/routes/admin/championship-reigns/bywrestler/+page.svelte` |
| `/admin/championship-reigns/championship` | `src/routes/admin/championship-reigns/championship/+page.svelte` |
| `/admin/championship-reigns/create` | `src/routes/admin/championship-reigns/create/+page.svelte` |
| `/admin/championship-reigns/create/new` | `src/routes/admin/championship-reigns/create/new/+page.svelte` |
| `/admin/championship-reigns/create/test` | `src/routes/admin/championship-reigns/create/test/+page.svelte` |
| `/admin/championship-reigns/defences` | `src/routes/admin/championship-reigns/defences/+page.svelte` |
| `/admin/championship-reigns/defences/update` | `src/routes/admin/championship-reigns/defences/update/+page.svelte` |
| `/admin/championship-reigns/rankings` | `src/routes/admin/championship-reigns/rankings/+page.svelte` |
| `/admin/championship-reigns/rankings/test` | `src/routes/admin/championship-reigns/rankings/test/+page.svelte` |
| `/admin/championship-reigns/update/{id}` | `src/routes/admin/championship-reigns/update/[id]/+page.svelte` |
| `/admin/championship-reigns/upsert` | `src/routes/admin/championship-reigns/upsert/+page.svelte` |
| `/admin/championships` | `src/routes/admin/championships/+page.svelte` |
| `/admin/championships/create` | `src/routes/admin/championships/create/+page.svelte` |
| `/admin/championships/draft` | `src/routes/admin/championships/draft/+page.svelte` |
| `/admin/championships/update/{id}` | `src/routes/admin/championships/update/[id]/+page.svelte` |
| `/admin/championships/upsert/{id?}` | `src/routes/admin/championships/upsert/[[id]]/+page.svelte` |
| `/admin/cronjobs` | `src/routes/admin/cronjobs/+page.svelte` |
| `/admin/cronjobs/upsert` | `src/routes/admin/cronjobs/upsert/+page.svelte` |
| `/admin/cronjobs/upsert/{slug}` | `src/routes/admin/cronjobs/upsert/[slug]/+page.svelte` |
| `/admin/dashboard` | `src/routes/admin/dashboard/+page.svelte` |
| `/admin/draft` | `src/routes/admin/draft/+page.svelte` |
| `/admin/draft/random` | `src/routes/admin/draft/random/+page.svelte` |
| `/admin/export` | `src/routes/admin/export/+page.svelte` |
| `/admin/gallery` | `src/routes/admin/gallery/+page.svelte` |
| `/admin/image-editor` | `src/routes/admin/image-editor/+page.svelte` |
| `/admin/injuries` | `src/routes/admin/injuries/+page.svelte` |
| `/admin/injuries/upsert` | `src/routes/admin/injuries/upsert/+page.svelte` |
| `/admin/matchcards` | `src/routes/admin/matchcards/+page.svelte` |
| `/admin/matchcards/event` | `src/routes/admin/matchcards/event/+page.svelte` |
| `/admin/matchcards/import` | `src/routes/admin/matchcards/import/+page.svelte` |
| `/admin/matchcards/matches/upsert-matches` | `src/routes/admin/matchcards/matches/upsert-matches/+page.svelte` |
| `/admin/matchcards/rating` | `src/routes/admin/matchcards/rating/+page.svelte` |
| `/admin/matchcards/summary` | `src/routes/admin/matchcards/summary/+page.svelte` |
| `/admin/money-in-the-bank` | `src/routes/admin/money-in-the-bank/+page.svelte` |
| `/admin/money-in-the-bank/cash-in` | `src/routes/admin/money-in-the-bank/cash-in/+page.svelte` |
| `/admin/money-in-the-bank/upsert` | `src/routes/admin/money-in-the-bank/upsert/+page.svelte` |
| `/admin/ppvs` | `src/routes/admin/ppvs/+page.svelte` |
| `/admin/ppvs/create` | `src/routes/admin/ppvs/create/+page.svelte` |
| `/admin/ppvs/update/{slug}` | `src/routes/admin/ppvs/update/[slug]/+page.svelte` |
| `/admin/ppvs/update/calendar` | `src/routes/admin/ppvs/update/calendar/+page.svelte` |
| `/admin/push` | `src/routes/admin/push/+page.svelte` |
| `/admin/rivalries` | `src/routes/admin/rivalries/+page.svelte` |
| `/admin/rumble` | `src/routes/admin/rumble/+page.svelte` |
| `/admin/subscriptions` | `src/routes/admin/subscriptions/+page.svelte` |
| `/admin/teams` | `src/routes/admin/teams/+page.svelte` |
| `/admin/teams/random` | `src/routes/admin/teams/random/+page.svelte` |
| `/admin/teams/upsert` | `src/routes/admin/teams/upsert/+page.svelte` |
| `/admin/teams/upsert/{slug}` | `src/routes/admin/teams/upsert/[slug]/+page.svelte` |
| `/admin/test/dates` | `src/routes/admin/test/dates/+page.svelte` |
| `/admin/test/gemini` | `src/routes/admin/test/gemini/+page.svelte` |
| `/admin/test/reigns` | `src/routes/admin/test/reigns/+page.svelte` |
| `/admin/test/state` | `src/routes/admin/test/state/+page.svelte` |
| `/admin/test/steps` | `src/routes/admin/test/steps/+page.svelte` |
| `/admin/test/wrestlers` | `src/routes/admin/test/wrestlers/+page.svelte` |
| `/admin/tweets` | `src/routes/admin/tweets/+page.svelte` |
| `/admin/tweets/bulk` | `src/routes/admin/tweets/bulk/+page.svelte` |
| `/admin/tweets/upsert` | `src/routes/admin/tweets/upsert/+page.svelte` |
| `/admin/users` | `src/routes/admin/users/+page.svelte` |
| `/admin/users/update/{id}` | `src/routes/admin/users/update/[id]/+page.svelte` |
| `/admin/wrestlers` | `src/routes/admin/wrestlers/+page.svelte` |
| `/admin/wrestlers/{id}/reigns` | `src/routes/admin/wrestlers/[id]/reigns/+page.svelte` |
| `/admin/wrestlers/brands` | `src/routes/admin/wrestlers/brands/+page.svelte` |
| `/admin/wrestlers/bulk/update/status` | `src/routes/admin/wrestlers/bulk/update/status/+page.svelte` |
| `/admin/wrestlers/create` | `src/routes/admin/wrestlers/create/+page.svelte` |
| `/admin/wrestlers/fire-hire` | `src/routes/admin/wrestlers/fire-hire/+page.svelte` |
| `/admin/wrestlers/genders` | `src/routes/admin/wrestlers/genders/+page.svelte` |
| `/admin/wrestlers/smackdown-hotel` | `src/routes/admin/wrestlers/smackdown-hotel/+page.svelte` |
| `/admin/wrestlers/update/{slug}` | `src/routes/admin/wrestlers/update/[slug]/+page.svelte` |
| `/blog` | `src/routes/(public)/blog/+page.svelte` |
| `/blog/{slug}` | `src/routes/(public)/blog/[slug]/+page.svelte` |
| `/champions` | `src/routes/(public)/champions/+page.svelte` |
| `/champions/history` | `src/routes/(public)/champions/history/+page.svelte` |
| `/champions/ranking` | `src/routes/(public)/champions/ranking/+page.svelte` |
| `/champions/ranking/championships` | `src/routes/(public)/champions/ranking/championships/+page.svelte` |
| `/contact` | `src/routes/(public)/(statics)/contact/+page.svelte` |
| `/cookies` | `src/routes/(public)/(statics)/cookies/+page.svelte` |
| `/legal-notice` | `src/routes/(public)/(statics)/legal-notice/+page.svelte` |
| `/login` | `src/routes/(public)/login/+page.svelte` |
| `/pages` | `src/routes/(public)/pages/+page.svelte` |
| `/ppvs` | `src/routes/(public)/ppvs/+page.svelte` |
| `/privacy` | `src/routes/(public)/(statics)/privacy/+page.svelte` |
| `/roster` | `src/routes/(public)/roster/+page.svelte` |
| `/roster/{wrestler}` | `src/routes/(public)/roster/[wrestler]/+page.svelte` |
| `/roster/teams` | `src/routes/(public)/roster/teams/+page.svelte` |
| `/terms` | `src/routes/(public)/(statics)/terms/+page.svelte` |
| `/test` | `src/routes/test/+page.svelte` |
| `/test/date` | `src/routes/test/date/+page.svelte` |
| `/test/datest` | `src/routes/test/datest/+page.svelte` |
| `/test/gallery` | `src/routes/test/gallery/+page.svelte` |
| `/test/pep` | `src/routes/test/pep/+page.svelte` |
| `/twitter` | `src/routes/(public)/twitter/+page.svelte` |
| `/twitter/tweet/{slug}` | `src/routes/(public)/twitter/tweet/[slug]/+page.svelte` |

## Observaciones para la revisión

- Hay rutas de pruebas expuestas bajo `/test` y `/admin/test`; conviene confirmar si deben mantenerse fuera de desarrollo.
- Hay endpoints de prueba bajo `/api/test` y `/api/test/email`; si no están protegidos o ya no se usan, son candidatos prioritarios para revisar.
- Antes de eliminar una ruta, comprobad enlaces internos, marcadores, integraciones externas y tareas programadas que puedan depender de ella.
