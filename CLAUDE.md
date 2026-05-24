# CLAUDE.md — Estudos +PraTi

## Overview

**Estudos +PraTi** é o guia interativo do programa Full Stack MaisPraTi 2026.
Cada módulo do programa tem sua própria área com: exemplos executáveis, diagramas, visualizadores animados e exercícios práticos.

- Stack: HTML + CSS + Vanilla JavaScript (sem framework)
- Dev server: Vite (`npm run dev`)
- Idioma: Português (pt-BR) — conteúdo em português; comentários de código e config em inglês
- Caminhos de assets: root-relative (`/assets/...`) — requer servidor web (Vite no dev, Vercel em prod)

---

## File Structure

```
maisprati-frontend/
├── index.html                        # Hub do programa (todos os módulos)
├── assets/
│   ├── css/styles.css                # Design system compartilhado (tema escuro + light)
│   └── js/
│       ├── nav.js                    # Navegação dinâmica + alternância de tema
│       ├── runner.js                 # Motor de execução de exemplos
│       └── viz.js                    # Visualizadores animados
├── modules/
│   └── 01-javascript/
│       ├── index.html                # Hub do módulo JS
│       └── pages/
│           ├── objects.html
│           ├── arrays.html
│           ├── matrices.html
│           ├── linked-list.html
│           ├── doubly-linked-list.html
│           ├── stacks.html
│           ├── queues.html
│           └── sorting.html
├── package.json
├── vite.config.js                    # MPA — todas as páginas declaradas em input
├── eslint.config.js
└── .prettierrc
```

---

## Adding a New Module

1. **Create `modules/NN-name/index.html`** — module hub (card grid of topics)
   - Static nav: `<a class="nav-logo" href="/index.html">Estudos <span>+</span>PraTi</a>`
   - Asset path: `<link rel="stylesheet" href="/assets/css/styles.css" />`
   - Script: `<script src="/assets/js/nav.js"></script>`

2. **Create `modules/NN-name/pages/<topic>.html`** for each topic:
   - `<nav data-page="<topic>" data-module="NN-name"></nav>`
   - Asset paths use root-relative: `/assets/css/styles.css`, `/assets/js/nav.js`, etc.

3. **Register topics in `assets/js/nav.js`** — add entry to the `MODULES` object:
   ```js
   'NN-name': {
     label: 'Nome do Módulo',
     hub: '/modules/NN-name/index.html',
     topics: [
       { id: 'topic-id', label: 'Rótulo', href: 'topic.html' },
     ],
   },
   ```

4. **Register all pages in `vite.config.js`** under `rollupOptions.input`:
   ```js
   'nn-hub':   resolve(__dirname, 'modules/NN-name/index.html'),
   'nn-topic': resolve(__dirname, 'modules/NN-name/pages/topic.html'),
   ```

5. **Add a module card in root `index.html`** inside `.hub-grid`:
   ```html
   <a class="topic-card" href="modules/NN-name/index.html" style="--card-accent: var(--accent);">
     <div class="tc-icon">🔤</div>
     <h3>Módulo NN — Nome</h3>
     <p>Descrição curta com <code>conceitos</code> destacados.</p>
     <div class="tc-tags"><span class="tc-tag">tag1</span></div>
     <div class="tc-go">Acessar módulo →</div>
   </a>
   ```

---

## Adding a New Topic Page (within a module)

1. **Create `modules/NN-name/pages/<topic>.html`** copiando uma página existente:
   - `<nav data-page="<topic>" data-module="NN-name"></nav>` — nav.js preenche automaticamente
   - Seções usando `<section id="concept">`, `<section id="exercises">`, etc.
   - Scripts no final: `/assets/js/nav.js` → `/assets/js/runner.js` → `/assets/js/viz.js` → `window.demos`

2. **Register in `assets/js/nav.js`** — add to the `topics` array of the corresponding module.

3. **Add a card in the module hub** (`modules/NN-name/index.html`) inside `.hub-grid`.

4. **Declare in `vite.config.js`** under `rollupOptions.input`.

---

## Animated Visualizers (`viz.js`)

Each visualizer mounts automatically on a `<div>` with `data-viz`:

```html
<!-- Singly or doubly linked list -->
<div class="viz" data-viz="linked-list" data-initial="30,20,10"></div>
<div class="viz" data-viz="linked-list" data-doubly="true" data-initial="10,20,30"></div>

<!-- Stack -->
<div class="viz" data-viz="stack" data-initial="10,20,30"></div>

<!-- Queue -->
<div class="viz" data-viz="queue" data-initial="10,20,30"></div>

<!-- Bubble Sort (animated bars) -->
<div class="viz" data-viz="bubble-sort" data-initial="64,34,25,12,22,11,90"></div>
```

**To add a new visualizer:**
1. Create `function myViz(root) { ... }` in `viz.js`
2. Register in `builders`: `'my-viz': myViz`
3. Use `buildShell(root, title, controls)` for the standard control bar
4. Use `el(tag, cls, text)`, `wait(ms)`, and `reduceMotion` available in the IIFE closure

---

## Demo and Exercise System (`runner.js`)

Each HTML page defines `window.demos` with functions run when "▶ Executar" is clicked:

```html
<script>
window.demos = {
  ex1: () => {
    console.log("result");
  },
};
</script>
```

Triggered by:
```html
<button class="run-btn" onclick="runCode('ex1')">▶ Executar</button>
<div class="console" id="ex1-console"></div>
```

For exercises with an editor:
```html
<textarea class="code-editor" id="exA-editor">// starter code</textarea>
<button class="run-ex-btn" onclick="runExercise('exA')">▶ Executar</button>
<div class="ex-output" id="exA-output"></div>
```

---

## Syntax Highlighting

### Legacy approach (existing pages): manual spans
```html
<span class="kw">function</span> <span class="fn">hello</span>() { <span class="kw">return</span> <span class="str">"oi"</span>; }
```
Available classes: `.kw` `.str` `.num` `.fn` `.prop` `.op` `.bool` `.cmt`

### Modern approach (new pages): Prism.js
New pages use Prism.js via CDN with a custom theme:
```html
<!-- At the bottom of <body> -->
<script src="https://cdn.jsdelivr.net/npm/prismjs@1/prism.min.js" defer></script>
<script src="https://cdn.jsdelivr.net/npm/prismjs@1/components/prism-javascript.min.js" defer></script>
```
```html
<!-- Code block -->
<pre class="language-javascript"><code class="language-javascript">function hello() { return "oi"; }</code></pre>
```
The Prism theme is mapped to project CSS variables in `styles.css`.

---

## CSS Design System (MaisPraTi palette)

```css
/* Backgrounds */
--bg: #0a0d14          /* deep dark navy */
--surface: #12161f     /* cards, panels */
--surface2: #191e2a    /* secondary backgrounds */
--border: #252d3d      /* borders */

/* Text */
--text: #e2eaf5        /* primary text */
--muted: #6b85a8       /* secondary text */
--code-bg: #060a12     /* code block background */

/* Brand accents */
--accent: #0080ED      /* MaisPraTi blue — primary */
--accent2: #FE8C68     /* MaisPraTi coral — secondary */
--accent3: #22d3ee     /* cyan */
--accent4: #f43f5e     /* rose — danger/error */
--accent5: #fbbf24     /* amber — warning */

/* Supporting palette */
--green: #34d399       /* success / sorted */
--blue: #60a5fa        /* light blue */
--purple: #c084fc      /* properties */
--yellow: #fbbf24      /* alias of accent5 */
--red: #f43f5e         /* alias of accent4 */
```

---

## Development Commands

```bash
npm run dev      # Start Vite at http://localhost:5173
npm run build    # Build bundle to dist/
npm run preview  # Serve the build locally
npm run lint     # ESLint on JS files
npm run format   # Prettier on all files
```

---

## Conventions

- **Asset paths**: always root-relative (`/assets/css/styles.css`) — works with Vite and any web server
- **Inline styles** only for single-use values (e.g. `style="--card-accent: var(--accent)"`)
- **No ES modules yet** — scripts use IIFE + globals to support `onclick` attributes
- **Animations**: respect `prefers-reduced-motion` via `reduceMotion` variable in viz.js
- **Node limit** in visualizers: 8 items (fits on screen without horizontal scroll)
- **Complexity**: always show Big-O notation for operations being taught
- **Text content**: stays in Portuguese (pt-BR); code comments and config in English

---

## Path to React

Vite is already the standard build tool for React. The migration is incremental.

### Step 1 — Enable the React plugin

```bash
npm install react react-dom @vitejs/plugin-react
```

In `vite.config.js`, uncomment the pre-wired lines:

```js
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
```

### Step 2 — Convert files to components

| Today (vanilla JS) | In React |
|---|---|
| `modules/01-javascript/pages/stacks.html` | `src/modules/01-javascript/pages/Stacks.jsx` |
| `assets/js/nav.js` | `src/components/Nav.jsx` |
| `assets/js/viz.js` | `src/components/viz/` (one component per visualizer) |
| `assets/js/runner.js` | `src/hooks/useRunner.js` |
| `window.demos = { ex1: () => {...} }` | props ou Context |
| `onclick="runCode('ex1')"` | `onClick={() => runCode('ex1')}` |

### Patterns that migrate without changes

- **CSS variables** (`--bg`, `--accent`, etc.) — work identically in React
- **Prism.js** — load via `useEffect` after render
- **`prefers-reduced-motion`** — stays as a CSS media query
- **Light/dark theme** — move the toggle from `nav.js` into a `ThemeContext`
- **Routing** — add React Router v6 (`npm install react-router-dom`)
- **Module structure** — `modules/NN-name/` maps cleanly to routes

---

## Planned Improvements

- [ ] Migrate legacy pages to Prism.js (remove manual spans)
- [ ] Add remaining modules (HTML/CSS, React, Java, SQL, Git, Docker, Python)
- [ ] New JS pages: Binary Search Tree, Hash Map, Search Algorithms
- [ ] PWA offline support
- [ ] Migrate to React (see section above)
