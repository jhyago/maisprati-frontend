/* ════════════════════════════════════════════════════════
   runner.js — Shared engine for study pages
   Responsibilities:
     • run demo blocks (window.demos)
     • run student code from the editor
     • toggle solution visibility
     • highlight the active nav link on scroll
   Page-specific demos live in window.demos = { ... }
   defined in each HTML file.
════════════════════════════════════════════════════════ */

// ── Intercept console.log safely and collect lines ──
function captureConsole(fn) {
  const logs = [];
  const orig = console.log;
  console.log = (...args) => {
    logs.push(args.map(a => {
      if (typeof a === 'object' && a !== null) {
        try { return JSON.stringify(a, null, 2); } catch (e) { return String(a); }
      }
      return String(a);
    }).join(' '));
  };
  try { fn(); } catch (e) { logs.push('ERRO: ' + e.message); }
  console.log = orig;
  return logs;
}

// ── Escape HTML for safe output in the console ───────
function escHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ── Run a pre-defined demo block ─────────────────────
function runCode(id) {
  const demos = window.demos || {};
  const el = document.getElementById(id + '-console');
  if (!el || !demos[id]) return;
  const logs = captureConsole(demos[id]);
  el.innerHTML = logs.map(l => `<div class="log-line">${escHtml(l)}</div>`).join('');
  el.classList.add('visible');
}

// ── Run code the student typed in the exercise editor ─
function runExercise(id) {
  const code = document.getElementById(id + '-editor').value;
  const out = document.getElementById(id + '-output');
  const logs = captureConsole(() => { eval(code); });
  out.innerHTML = logs.map(l =>
    l.startsWith('ERRO:')
      ? `<div class="out-err">${escHtml(l)}</div>`
      : `<div class="out-line">${escHtml(l)}</div>`
  ).join('');
  out.classList.add('visible');
}

// ── Show/hide the solution block for an exercise ──────
function toggleSolution(id) {
  const el = document.getElementById(id);
  el.classList.toggle('visible');
  const btn = el.previousElementSibling;
  btn.textContent = el.classList.contains('visible') ? 'Ocultar solução' : 'Ver solução';
}

// ── Behaviours activated after the DOM loads ─────────
document.addEventListener('DOMContentLoaded', () => {
  // Tab key inserts 2 spaces inside code editors
  document.querySelectorAll('textarea.code-editor').forEach(ta => {
    ta.addEventListener('keydown', e => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const s = ta.selectionStart, end = ta.selectionEnd;
        ta.value = ta.value.substring(0, s) + '  ' + ta.value.substring(end);
        ta.selectionStart = ta.selectionEnd = s + 2;
      }
    });
  });

  // Highlight nav link for the currently visible section
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav a');
  if (sections.length && navLinks.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          navLinks.forEach(a => a.classList.remove('active'));
          const link = document.querySelector(`nav a[href="#${e.target.id}"]`);
          if (link) link.classList.add('active');
        }
      });
    }, { threshold: 0.3 });
    sections.forEach(s => observer.observe(s));
  }
});
