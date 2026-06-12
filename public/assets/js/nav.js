/* ════════════════════════════════════════════════════════
   nav.js — Navigation menu + light/dark theme toggle

   Topic pages declare:
     <nav data-page="arrays" data-module="01-javascript"></nav>
     <script src="/assets/js/nav.js"></script>

   Hub pages (root and module) declare a static <nav> and
   only get the theme toggle added dynamically.
════════════════════════════════════════════════════════ */

(function () {
  // Apply saved theme before DOMContentLoaded to avoid flash.
  const _saved = localStorage.getItem('jstheme');
  if (_saved) document.documentElement.setAttribute('data-theme', _saved);

  const MODULES = {
    '01-javascript': {
      label: 'JavaScript',
      hub: '/modules/01-javascript/index.html',
      topics: [
        { id: 'objects',            label: 'Objetos',       href: 'objects.html' },
        { id: 'arrays',             label: 'Arrays',        href: 'arrays.html' },
        { id: 'matrices',           label: 'Matrizes',      href: 'matrices.html' },
        { id: 'linked-list',        label: 'Lista Simples', href: 'linked-list.html' },
        { id: 'doubly-linked-list', label: 'Lista Dupla',   href: 'doubly-linked-list.html' },
        { id: 'stacks',             label: 'Pilhas',        href: 'stacks.html' },
        { id: 'queues',             label: 'Filas',         href: 'queues.html' },
        { id: 'sorting',            label: 'Ordenação',     href: 'sorting.html' },
      ],
    },
    '02-frontend': {
      label: 'Frontend & Git',
      hub: '/modules/02-frontend/index.html',
      topics: [
        { id: 'git-github',     label: 'Git & GitHub',   href: 'git-github.html' },
        { id: 'html-basico',    label: 'HTML Básico',    href: 'html-basico.html' },
        { id: 'css-basico',     label: 'CSS Básico',     href: 'css-basico.html' },
        { id: 'unidades',       label: 'Unidades',       href: 'unidades.html' },
        { id: 'box-model',      label: 'Box Model',      href: 'box-model.html' },
        { id: 'posicionamento', label: 'Posicionamento', href: 'posicionamento.html' },
        { id: 'flexbox',        label: 'Flexbox',        href: 'flexbox.html' },
      ],
    },
  };

  // ── Theme helpers ────────────────────────────────────
  function getTheme() {
    return document.documentElement.getAttribute('data-theme') || 'dark';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('jstheme', theme);
  }

  function syncBtn(btn) {
    const isLight = getTheme() === 'light';
    btn.textContent = isLight ? '🌙' : '☀️';
    btn.title = isLight ? 'Mudar para tema escuro' : 'Mudar para tema claro';
    btn.setAttribute('aria-label', btn.title);
  }

  // ── Build nav for topic pages ────────────────────────
  function build(nav) {
    const current = nav.dataset.page;
    const moduleId = nav.dataset.module || '01-javascript';
    const mod = MODULES[moduleId];
    if (!mod) return;

    const parts = [];
    parts.push('<a class="nav-logo" href="/index.html">Estudos <span>+</span>PraTi</a>');
    parts.push(`<a class="nav-home" href="${mod.hub}">← ${mod.label}</a>`);
    parts.push('<div class="nav-sep"></div>');
    mod.topics.forEach(t => {
      const active = t.id === current ? ' class="active"' : '';
      parts.push(`<a href="${t.href}"${active}>${t.label}</a>`);
    });
    nav.innerHTML = parts.join('\n  ');
  }

  // ── Add theme toggle to any nav on the page ──────────
  function addThemeToggle(nav) {
    if (nav.querySelector('.nav-theme-btn')) return;
    const btn = document.createElement('button');
    btn.className = 'nav-theme-btn';
    syncBtn(btn);
    btn.addEventListener('click', () => {
      applyTheme(getTheme() === 'light' ? 'dark' : 'light');
      document.querySelectorAll('.nav-theme-btn').forEach(syncBtn);
    });
    nav.appendChild(btn);
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('nav[data-page]').forEach(build);
    document.querySelectorAll('nav').forEach(addThemeToggle);
  });
})();
