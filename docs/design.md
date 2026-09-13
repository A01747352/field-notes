# FIELD NOTES — Design Doc (UX/UI)

> A quiet record of the places you go, the things you notice, and the days you want to remember.

Este documento define la experiencia y la interfaz antes de escribir código. Es la referencia que usaremos para construir el MVP.

---

## 1. Principio de producto

**No registrar tu vida entera. Registrar momentos que valió la pena guardar.**

Reglas que se derivan de esto:

- No es una red social: sin followers, sin likes, sin feed público.
- No es gamification: sin streaks, sin puntos, sin notificaciones de "llevas 3 días sin escribir".
- Crear una nota debe tomar **menos de 15 segundos** si el usuario quiere.
- El contexto (fecha, hora, ubicación, clima) se rellena solo. El usuario solo escribe lo que le importa.
- Todo el copy suena a libreta de campo, no a app de startup: tono bajo, frases cortas, nada de exclamaciones de marketing.

---

## 2. Usuario y caso de uso

**Usuario primario:** una persona (el propio autor del portfolio) que vive de forma nómada/en movimiento (Erasmus, viajes, ciudad nueva) y quiere un archivo personal de lugares, comidas, caminatas y momentos — sin fricción de escribir un diario largo.

**Momento de uso típico:** está en un café, en un hike, o llegando a casa después del día. Saca el móvil, abre la app, toca "+", escribe una frase, adjunta una foto, guarda. 10-20 segundos.

---

## 3. Arquitectura de la información

```
FIELD NOTES
│
├── Today / Timeline (home)
│   └── Notes agrupadas por fecha
│
├── Map
│   └── Notes agrupadas por ubicación, filtrables por categoría
│
├── Collections
│   ├── Automáticas (por categoría: Hikes, Cafés, Food, Museums...)
│   └── Manuales (creadas por el usuario: "Places I want to return to")
│
├── Places (página por lugar)
│   └── Notes + fotos + stats de ese lugar
│
├── Trips
│   └── Agrupación automática de notes en un rango de fechas/ciudad
│
├── Monthly Journal
│   └── Recap mensual (manual o generado)
│
└── Note (unidad atómica)
    ├── texto
    ├── foto(s)
    ├── categoría
    ├── ubicación
    ├── fecha/hora
    ├── clima (auto)
    ├── música (opcional)
    └── personas (opcional)
```

---

## 4. Navegación (mobile-first)

Bottom nav de 3 elementos, con el botón de crear en el centro y elevado:

```
┌───────────────────────────────┐
│                                │
│         (contenido)           │
│                                │
├───────────────────────────────┤
│   ◉         ⊕         ◇       │
│ Notes      New        Map     │
└───────────────────────────────┘
```

- **Notes** → timeline (home)
- **⊕** → crear nota (modal a pantalla completa, no una tab)
- **Map** → mapa de notas

Collections, Places, Trips y Journal viven **dentro** de Notes, accesibles desde un header o un ícono secundario (no ocupan tab bar — mantener la barra mínima).

---

## 5. Pantallas clave

### 5.1 Home / Timeline

```
FIELD NOTES                         09 / 2026
                                     UPPSALA
─────────────────────────────────────────────

13
UPPSALA
"Found a really nice café after class."
[ foto ]

11
STOCKHOLM
"Spent the afternoon walking around
Södermalm."
[ foto ] [ foto ]

08
UPPSALA
First week of classes.
[ foto ]
```

Comportamiento:

- Scroll vertical infinito, agrupado por día.
- Tap en una nota → abre el detalle a pantalla completa.
- Swipe lateral en una nota → acceso rápido a "editar" / "colección".
- Header sticky con mes/ciudad actual (se actualiza al hacer scroll, como un diario que pasa de capítulo).

### 5.2 Crear nota

```
        FIELD NOTE
        What's worth keeping?

        ┌───────────────┐
        │   📷 PHOTO     │
        └───────────────┘

        Write something...
        ─────────────────
        📍 Uppsala   ☁️ 12°C   🕐 16:42

        + Add music
        + Add people
        + Add place

              SAVE
```

Reglas de UX:

- El campo de texto es lo primero visible tras la foto (no forzar título/categoría antes de escribir).
- La categoría se puede asignar después (o Field Notes la sugiere por palabras clave / ubicación, sin ser intrusivo).
- Todo lo automático (ubicación, hora, clima) se muestra ya rellenado, editable con un tap.
- Guardar es una sola acción, sin pantallas intermedias de confirmación.

### 5.3 Detalle de nota

```
FIELD NOTE                              FN—024
─────────────────────────────────────────────

                 [ LARGE PHOTO ]

SEPTEMBER 13 · UPPSALA · 16:42

"The city felt unusually quiet today."

📍 59.8586° N, 17.6389° E
☁️ 12°C, cloudy
🎧 Apéro — Polo & Pan
```

Editorial, mucho whitespace, foto grande, metadata en monospace pequeño.

### 5.4 Map

```
FIELD MAP

      ●              ●
              ●
   ●                    ●
        ●

Filters: ALL · 2026 · UPPSALA · STOCKHOLM · HIKES · FOOD · MUSEUMS
```

- Pines por nota, clusterizados por zoom.
- Tap en pin → preview card con foto + primera línea + fecha.
- Tap en preview → detalle completo.

### 5.5 Places (página de lugar)

```
Hammarskog
Uppsala, Sweden
───────────────
🥾 Hikes: 3   📓 Notes: 5   📷 Photos: 21   ⭐ 4.5

YOUR NOTES
Sep 12 — "Beautiful afternoon..."
Aug 31 — "Would definitely come back in autumn."
```

Se genera automáticamente cuando hay ≥1 nota con la misma ubicación (agrupado por radio/nombre de lugar).

### 5.6 Collections

```
COLLECTIONS

🥾 Hikes        12 notes
☕ Cafés        18 notes
🎨 Museums       7 notes
🍜 Food         23 notes
🇸🇪 Sweden      41 notes
✈️ Travels       5 trips

+ New collection
```

Automáticas (por categoría) arriba, manuales del usuario abajo.

### 5.7 Monthly Journal

```
SEPTEMBER 2026 — UPPSALA

12 places · 8 cafés · 3 hikes · 2 museums · 1 new city

"A month of arriving. Cold mornings.
New people. Too much coffee."

[ mosaico de fotos del mes ]
```

Se genera al cerrar el mes; el usuario puede editar el texto libremente o dejar que quede vacío (nunca forzado).

---

## 6. Sistema de diseño

### Concepto visual

**Analog field notebook × editorial suizo × archivo fotográfico.** Nada de "dashboard SaaS", nada de estética Notion genérica.

### Tipografía

| Uso                           | Fuente           |
| ----------------------------- | ---------------- |
| Display / títulos             | Instrument Serif |
| UI / cuerpo                   | Inter            |
| Metadata (fecha, coords, IDs) | IBM Plex Mono    |

### Color

**Decisión: blanco y negro puro, sin acento de marca. El único color permitido en la interfaz viene del contenido — fotos y carátulas de música — nunca de la UI misma.**

- Base clara: blanco (`#FFFFFF`) o blanco roto (`#FAFAFA`), texto negro (`#111111`).
- Modo oscuro: negro real (`#0A0A0A`), texto blanco roto.
- Grises intermedios solo para separadores, metadata y estados deshabilitados.
- **Accent dinámico:** cuando una nota tiene foto o canción, se puede extraer el color dominante de la imagen o de la carátula del track (Vibrant.js / Canvas API) y usarlo puntualmente — un borde fino, un fondo sutil detrás de la carátula, el color de un highlight de texto seleccionado. Nunca se aplica a botones, iconos de navegación ni texto de UI genérico.
- Regla dura: **si no hay foto ni música en la nota, la pantalla es 100% blanco/negro/gris.** El color se lo gana el contenido, no lo regala el sistema.

### Layout

- Grid editorial, mucho whitespace, fotos grandes (no thumbnails cuadrados forzados — respetar aspect ratio original).
- Líneas finas como separadores (`───`), no cards con sombra pesada.
- Números de referencia tipo catálogo (`FN—024`) para reforzar sensación de archivo.

### Interacción

- Transiciones suaves, sin rebotes exagerados.
- Sin badges rojos de notificación agresivos.
- Feedback de guardado discreto (un fade, no un toast gritón).

---

## 7. Integración con Spotify

**Objetivo:** que una nota pueda llevar una canción como "sello" del momento, y que esa carátula sea la fuente principal del accent de color de esa nota.

### Flujo de conexión

- OAuth **Authorization Code + PKCE** (compatible con PWA sin backend que guarde secretos).
- Conexión única desde ajustes: _"Connect Spotify"_ — no es obligatoria para usar la app.
- Scopes mínimos necesarios: `user-read-currently-playing`, `user-read-recently-played`. No se pide nada de escritura ni de playlists.

### Dos formas de añadir música a una nota

1. **Manual:** el usuario escribe el nombre de una canción/artista → búsqueda en `/v1/search` de Spotify → elige de una lista con carátula + nombre + artista.
2. **Automática (si hay cuenta conectada):** al crear la nota, Field Notes sugiere _"You were listening to — [canción]"_ usando `currently-playing` o `recently-played`, con un tap para confirmar o descartar (igual que el clima o la ubicación — nunca se adjunta sin confirmación del usuario).

### En la UI

- La carátula se muestra pequeña, cuadrada, junto al nombre de la canción, en monospace para el texto (nombre — artista).
- El color dominante de la carátula alimenta el accent dinámico de esa nota (ver sección 6).
- No se reproduce audio dentro de la app en el MVP — es un sello visual/memoria, no un reproductor. (Posible V0.4+: deep link a Spotify para abrir la canción).

---

## 8. "People" — sin red social

**Objetivo:** poder decir "estuve con X" sin construir perfiles, seguidores ni red social.

### Nivel 1 — Mención libre (MVP)

- Al crear una nota, campo opcional _"+ Add people"_ → texto libre, tipo tags (`Marta`, `Erasmus group`). No son cuentas, no son objetos vinculados a nadie externo — es solo metadata tuya.
- Si el mismo nombre aparece en varias notas, Field Notes genera automáticamente una **página de esa persona**, con el mismo patrón que Places:

```
Marta
──────────────
📓 Notes: 6   📍 Places: 4   🗓 First mentioned: Sep 3

YOUR NOTES
Sep 12 — "Dinner with Marta after the hike."
Sep 03 — "Met Marta at orientation."
```

- Es memoria personal y privada del usuario — la otra persona no tiene cuenta, no ve nada, no es notificada.

### Nivel 2 — futuro, fuera del MVP

- Posibilidad de que dos usuarios de Field Notes "co-firmen" una nota puntual por mutuo acuerdo (compartir esa nota específica entre dos cuentas). Explícitamente **no** se construye en V0.1–V0.4: es la puerta de entrada más fácil hacia comentarios/reacciones/feed, que rompe la filosofía del producto. Se documenta aquí solo para no perder la idea, no para implementarla ahora.

---

## 9. Iconografía y microcopy

- Categorías representadas con emoji simple + label, no iconografía custom compleja en el MVP (📍 Place, ☕ Café, 🥾 Hike, 🍜 Food, 🎨 Culture, 👥 People, 💭 Thought, 🎧 Sound).
- Copy siempre en minúscula tono diario: _"What's worth keeping?"_, no _"Create New Entry!"_.
- Estados vacíos con voz personal: _"Nothing here yet. Go outside."_

---

## 10. Alcance de diseño por versión (alineado con el roadmap de producto)

| Versión | Pantallas / features a diseñar                               |
| ------- | ------------------------------------------------------------ |
| V0.1    | Timeline, Crear nota, Detalle de nota (B&W + accent de foto) |
| V0.2    | Map, Collections, Search/Filters                             |
| V0.3    | Places, People, Trips, Monthly Journal                       |
| V0.4    | Spotify (manual + auto), AI recap, Share cards, Export       |

---

## 11. Próximos pasos

1. Maquetar Timeline + Crear nota + Detalle en alta fidelidad (Figma o directo en código con Tailwind), validando el sistema B&W + accent dinámico con fotos reales.
2. Prototipar la extracción de color dominante de una imagen/carátula (librería tipo `node-vibrant` o Canvas API) antes de integrarlo al flujo real.
3. Registrar una app en el Spotify Developer Dashboard y configurar el flujo PKCE en local antes de escribir UI de conexión.
4. Pasar este doc, junto con `field-notes-github-workflow.md`, a Claude Code como referencia para el andamiaje del proyecto (React + TypeScript + Tailwind + Supabase).
