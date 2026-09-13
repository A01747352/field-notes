# FIELD NOTES — GitHub Workflow

Guía de trabajo con Git/GitHub para llevar Field Notes como si fuera un proyecto profesional real, desde el primer commit. Pensado para seguirse con Claude Code.

---

## 1. Estructura del repositorio

```
field-notes/
├── .github/
│   └── workflows/          # CI (lint, build, tests)
├── docs/
│   ├── design.md            # este doc de diseño UX/UI
│   └── github-workflow.md   # este documento
├── src/
│   ├── components/
│   ├── pages/
│   ├── lib/                 # clientes (supabase, spotify, weather)
│   ├── hooks/
│   └── types/
├── public/
├── .env.example
├── README.md
└── package.json
```

Desde el inicio: `README.md` con qué es el proyecto, stack, y cómo correrlo local. Es lo primero que verá cualquiera (incluido tú en 6 meses).

---

## 2. Modelo de ramas (branching)

Usamos un modelo simple tipo **GitHub Flow** (no Git Flow completo — es overkill para un proyecto solo/pequeño, pero sí replica cómo se trabaja en la industria):

```
main                    → siempre desplegable, siempre estable
 └── feat/timeline-view
 └── feat/create-note-flow
 └── feat/spotify-oauth
 └── fix/note-date-timezone-bug
 └── chore/setup-tailwind
```

### Reglas

- **`main`** nunca recibe commits directos. Todo entra por Pull Request.
- Cada feature, fix o tarea vive en su propia rama, creada desde `main` actualizado.
- Una rama = una unidad de trabajo razonable (no "feat/everything"). Si una rama crece demasiado, se parte en varias.

### Convención de nombres de rama

| Prefijo     | Uso                                           |
| ----------- | --------------------------------------------- |
| `feat/`     | nueva funcionalidad                           |
| `fix/`      | corrección de bug                             |
| `chore/`    | tareas de mantenimiento, config, dependencias |
| `refactor/` | cambio de código sin cambiar comportamiento   |
| `docs/`     | cambios solo de documentación                 |

Ejemplos: `feat/note-detail-page`, `fix/map-marker-cluster`, `chore/eslint-setup`.

---

## 3. Commits

Usamos **Conventional Commits** — es el estándar más usado en la industria y hace que el historial se lea como una changelog.

```
<tipo>(<scope opcional>): <descripción corta en imperativo>

[cuerpo opcional explicando el porqué, no el qué]
```

### Tipos

- `feat` — nueva funcionalidad visible para el usuario
- `fix` — corrección de bug
- `refactor` — cambio interno sin alterar comportamiento
- `style` — formato, espacios, sin cambio de lógica
- `docs` — documentación
- `chore` — config, dependencias, tareas de build
- `test` — tests

### Ejemplos reales para este proyecto

```
feat(notes): add create-note modal with photo upload
fix(map): prevent duplicate markers on same coordinates
refactor(timeline): extract note-card into own component
chore: configure tailwind and instrument serif font
docs: update design.md with spotify integration
feat(spotify): implement PKCE oauth flow
```

### Reglas de commit

- Un commit = un cambio lógico. No mezclar "agrego feature X" con "arreglo bug Y" en el mismo commit.
- Mensajes en imperativo presente: "add", no "added" ni "adding".
- Si el commit necesita explicar el _por qué_ (no el qué, eso ya lo dice el diff), usar el cuerpo del mensaje.

---

## 4. Pull Requests

Incluso trabajando solo, el PR es donde queda registrado el razonamiento — muy útil para portfolio y para tu propio "yo" del futuro.

### Plantilla sugerida de PR

```markdown
## Qué hace

Breve descripción de la funcionalidad o fix.

## Por qué

Contexto o motivación (referencia a docs/design.md si aplica).

## Cómo probarlo

1. Pasos para verificar el cambio localmente.

## Screenshots (si hay UI)

[capturas]
```

### Reglas

- PR pequeño y enfocado > PR gigante. Más fácil de revisar (incluso auto-revisarte) y de revertir si algo sale mal.
- Antes de mergear: leer el diff completo una vez más, correr la app local, verificar que no rompe nada.
- Squash merge a `main` para mantener el historial limpio (un commit por feature en `main`), manteniendo el detalle en la rama si hace falta.
- Borrar la rama después de mergear.

---

## 5. Issues y proyecto (tablero)

Usar **GitHub Issues** para trackear trabajo, aunque seas el único desarrollador — es exactamente cómo se documenta el progreso en un proyecto real y es excelente evidencia para el portfolio.

### Labels sugeridos

```
type: feature
type: bug
type: chore
priority: high / medium / low
area: design
area: frontend
area: backend
```

### Milestones = versiones del roadmap

```
V0.1 — MVP core
V0.2 — Map & Collections
V0.3 — Places, People, Trips, Journal
V0.4 — Spotify, AI, Export
```

Cada Issue se asocia a un milestone. Cada PR referencia su Issue (`Closes #12`) para que se cierre automáticamente al mergear.

Opcional: usar **GitHub Projects** (tablero Kanban integrado) con columnas `Backlog / In progress / In review / Done`, ligado a los milestones.

---

## 6. Versionado y tags

Cuando se cierre cada milestone (V0.1, V0.2...), crear un tag y un Release en GitHub:

```bash
git tag -a v0.1.0 -m "MVP: create note, timeline, note detail"
git push origin v0.1.0
```

En el Release de GitHub, pegar un resumen tipo changelog (qué se puede hacer en esta versión, capturas de pantalla). Esto se ve muy bien en un portfolio: historial de versiones real, no solo un repo con un commit final.

---

## 7. CI básico (GitHub Actions)

Desde `V0.1`, un workflow mínimo en `.github/workflows/ci.yml` que corra en cada PR:

```yaml
name: CI
on:
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run lint
      - run: npm run build
```

Esto demuestra prácticas reales de ingeniería (no solo "funciona en mi máquina") y evita mergear código que ni siquiera compila.

---

## 8. Variables de entorno y secretos

- Nunca commitear `.env` — solo `.env.example` con las claves necesarias sin valores reales:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_SPOTIFY_CLIENT_ID=
VITE_WEATHER_API_KEY=
```

- Secretos reales van en GitHub Secrets (para CI/deploy) y en `.env` local (ignorado por `.gitignore`).
- Spotify con PKCE no requiere client secret en el frontend — solo `client_id`, que sí puede ser público.

---

## 9. Flujo de trabajo día a día (resumen operativo)

```
1. git checkout main && git pull
2. git checkout -b feat/nombre-de-la-tarea
3. Trabajar (con Claude Code) en pasos pequeños, commiteando seguido
4. git push -u origin feat/nombre-de-la-tarea
5. Abrir PR en GitHub, describir qué y por qué
6. Revisar el diff, correr local, mergear (squash)
7. Borrar la rama, volver a main, actualizar Issue/Milestone
```

Este ciclo se repite por cada feature del roadmap (sección 10 de `design.md`), lo que da un historial de commits y PRs que documenta la construcción completa del producto — justo lo que quieres mostrar en el case study del portfolio.
