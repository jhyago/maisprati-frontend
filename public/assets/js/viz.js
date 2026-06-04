/* ════════════════════════════════════════════════════════
   viz.js — Animated data structure visualizers
   Auto-mounted on any element with a data-viz attribute:

     <div class="viz" data-viz="linked-list"
          data-doubly="true" data-initial="30,20,10"></div>
     <div class="viz" data-viz="stack" data-initial="10,20,30"></div>

   Shows the structure changing step by step (nodes entering/
   leaving, pointers rewiring) so students can see each operation.
════════════════════════════════════════════════════════ */

(function () {
  const ANIM = 360; // ms — must match the .viz-node transition duration in CSS
  const reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function parseInitial(str) {
    if (!str) return [];
    return str.split(',').map(s => s.trim()).filter(Boolean);
  }

  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function wait(ms) {
    return new Promise(res => setTimeout(res, reduceMotion ? 0 : ms));
  }

  // ── Shell: control bar + stage + log ────────────────────
  function buildShell(root, title, controls) {
    root.innerHTML = '';
    const bar = el('div', 'viz-bar');
    bar.appendChild(el('span', 'viz-title', title));
    const input = el('input', 'viz-input');
    input.type = 'number';
    input.value = Math.floor(Math.random() * 90) + 10;
    bar.appendChild(input);
    controls.forEach(c => {
      const b = el('button', 'viz-btn' + (c.cls ? ' ' + c.cls : ''), c.label);
      b.addEventListener('click', () => c.run(input));
      bar.appendChild(b);
      c.btn = b;
    });
    const stage = el('div', 'viz-stage');
    const log = el('div', 'viz-log', 'pronto.');
    root.appendChild(bar);
    root.appendChild(stage);
    root.appendChild(log);
    return { stage, log, input, controls };
  }

  // ─────────────────────────────────────────────────────────
  //  LINKED LIST (singly or doubly)
  // ─────────────────────────────────────────────────────────
  function linkedList(root) {
    const doubly = root.dataset.doubly === 'true';
    let state = parseInitial(root.dataset.initial);
    let busy = false;

    const ui = buildShell(root, (doubly ? 'Lista dupla' : 'Lista simples') + ' — interativa', [
      { label: 'Inserir início', run: i => op(() => insert(0, i)) },
      { label: 'Inserir fim', cls: 'teal', run: i => op(() => insert(state.length, i)) },
      { label: 'Remover início', cls: 'pink', run: () => op(() => remove(0)) },
      { label: 'Remover fim', cls: 'pink', run: () => op(() => remove(state.length - 1)) },
      { label: 'Limpar', cls: 'ghost', run: () => op(() => { state = []; render(); say('lista esvaziada'); }) },
    ]);

    function say(msg) { ui.log.textContent = msg; }

    function setBusy(b) {
      busy = b;
      ui.controls.forEach(c => { c.btn.disabled = b; });
    }
    function op(fn) {
      if (busy) return;
      setBusy(true);
      Promise.resolve(fn()).finally(() => setBusy(false));
    }

    function render(animateIdx, animClass) {
      const arrow = doubly ? '⇄' : '→';
      ui.stage.innerHTML = '';
      const row = el('div', 'viz-row');
      if (state.length === 0) {
        row.appendChild(el('span', 'viz-empty', 'lista vazia (head = null)'));
        ui.stage.appendChild(row);
        return;
      }
      row.appendChild(el('span', 'viz-null', 'null'));
      state.forEach((v, idx) => {
        row.appendChild(el('span', 'viz-arrow' + (doubly ? ' bidir' : ''), arrow));
        const node = el('div', 'viz-node', v);
        if (idx === 0) node.appendChild(el('span', 'viz-tag', 'head'));
        if (doubly && idx === state.length - 1 && state.length > 1)
          node.appendChild(el('span', 'viz-tag', 'tail'));
        if (idx === animateIdx && animClass) node.classList.add(animClass);
        row.appendChild(node);
      });
      row.appendChild(el('span', 'viz-arrow' + (doubly ? ' bidir' : ''), arrow));
      row.appendChild(el('span', 'viz-null', 'null'));
      ui.stage.appendChild(row);
      return row;
    }

    async function insert(pos, input) {
      const v = (input.value || '').trim();
      if (v === '') { say('digite um valor para inserir'); return; }
      if (state.length >= 8) { say('limite de 8 nós para caber na tela'); return; }
      state.splice(pos, 0, v);
      const row = render(pos, 'enter');
      const nodeEls = row.querySelectorAll('.viz-node');
      // force reflow then remove class to trigger enter animation
      void row.offsetWidth;
      const target = nodeEls[pos];
      if (target) target.classList.remove('enter');
      const onde = pos === 0 ? 'inicio' : 'fim';
      say(`inserir${onde[0].toUpperCase()}${onde.slice(1)}(${v}) → O(1)` +
          (doubly ? ' · religa prev/next das pontas' : ' · novo nó aponta para o head'));
      input.value = Math.floor(Math.random() * 90) + 10;
      await wait(ANIM);
    }

    async function remove(pos) {
      if (state.length === 0) { say('lista já está vazia'); return; }
      const row = ui.stage.querySelector('.viz-row');
      const target = row.querySelectorAll('.viz-node')[pos];
      const v = state[pos];
      if (target) {
        target.classList.add('leave');
        await wait(ANIM);
      }
      state.splice(pos, 1);
      render();
      const onde = pos === 0 ? 'Inicio' : 'Fim';
      say(`remover${onde}() devolveu ${v} → O(1)`);
    }

    render();
    say(doubly
      ? 'cada nó conhece o anterior e o próximo; head e tail dão O(1) nas duas pontas'
      : 'cada nó conhece apenas o próximo; head dá O(1) no início');
  }

  // ─────────────────────────────────────────────────────────
  //  STACK (LIFO)
  // ─────────────────────────────────────────────────────────
  function stack(root) {
    let state = parseInitial(root.dataset.initial);
    let busy = false;

    const ui = buildShell(root, 'Pilha (LIFO) — interativa', [
      { label: 'push', run: i => op(() => push(i)) },
      { label: 'pop', cls: 'pink', run: () => op(() => pop()) },
      { label: 'peek', cls: 'teal', run: () => op(() => peek()) },
      { label: 'Limpar', cls: 'ghost', run: () => op(() => { state = []; render(); say('pilha esvaziada'); }) },
    ]);

    function say(msg) { ui.log.textContent = msg; }
    function setBusy(b) { busy = b; ui.controls.forEach(c => { c.btn.disabled = b; }); }
    function op(fn) { if (busy) return; setBusy(true); Promise.resolve(fn()).finally(() => setBusy(false)); }

    function render(animateTop, animClass) {
      ui.stage.innerHTML = '';
      const col = el('div', 'viz-stack');
      if (state.length === 0) {
        col.appendChild(el('span', 'viz-empty', 'pilha vazia'));
        ui.stage.appendChild(col);
        return col;
      }
      state.forEach((v, idx) => {
        const node = el('div', 'viz-node', v);
        if (idx === state.length - 1) node.appendChild(el('span', 'viz-tag', 'topo'));
        if (animateTop && idx === state.length - 1 && animClass) node.classList.add(animClass);
        col.appendChild(node);
      });
      ui.stage.appendChild(col);
      return col;
    }

    async function push(input) {
      const v = (input.value || '').trim();
      if (v === '') { say('digite um valor para empilhar'); return; }
      if (state.length >= 8) { say('limite de 8 itens para caber na tela'); return; }
      state.push(v);
      const col = render(true, 'enter');
      const nodes = col.querySelectorAll('.viz-node');
      void col.offsetWidth;
      nodes[nodes.length - 1].classList.remove('enter');
      say(`push(${v}) → entra no topo · O(1)`);
      input.value = Math.floor(Math.random() * 90) + 10;
      await wait(ANIM);
    }

    async function pop() {
      if (state.length === 0) { say('pilha vazia: pop() devolve null'); return; }
      const col = ui.stage.querySelector('.viz-stack');
      const nodes = col.querySelectorAll('.viz-node');
      const top = nodes[nodes.length - 1];
      const v = state[state.length - 1];
      top.classList.add('leave');
      await wait(ANIM);
      state.pop();
      render();
      say(`pop() devolveu ${v} (topo) → O(1)`);
    }

    async function peek() {
      if (state.length === 0) { say('pilha vazia: peek() devolve null'); return; }
      const col = ui.stage.querySelector('.viz-stack');
      const nodes = col.querySelectorAll('.viz-node');
      const top = nodes[nodes.length - 1];
      top.classList.add('flash');
      say(`peek() → ${state[state.length - 1]} (sem remover)`);
      await wait(ANIM + 140);
      top.classList.remove('flash');
    }

    render();
    say('o último a entrar é o primeiro a sair');
  }

  // ─────────────────────────────────────────────────────────
  //  QUEUE (FIFO)
  // ─────────────────────────────────────────────────────────
  function queue(root) {
    let state = parseInitial(root.dataset.initial);
    let busy = false;

    const ui = buildShell(root, 'Fila (FIFO) — interativa', [
      { label: 'enqueue', cls: 'teal', run: i => op(() => enqueue(i)) },
      { label: 'dequeue', cls: 'pink', run: () => op(() => dequeue()) },
      { label: 'Limpar', cls: 'ghost', run: () => op(() => { state = []; render(); say('fila esvaziada'); }) },
    ]);

    function say(msg) { ui.log.textContent = msg; }
    function setBusy(b) { busy = b; ui.controls.forEach(c => { c.btn.disabled = b; }); }
    function op(fn) { if (busy) return; setBusy(true); Promise.resolve(fn()).finally(() => setBusy(false)); }

    function render(animateIdx, animClass) {
      ui.stage.innerHTML = '';
      const row = el('div', 'viz-row queue');
      if (state.length === 0) {
        row.appendChild(el('span', 'viz-empty', 'fila vazia (front = null)'));
        ui.stage.appendChild(row);
        return row;
      }
      state.forEach((v, idx) => {
        if (idx > 0) row.appendChild(el('span', 'viz-arrow', '→'));
        const node = el('div', 'viz-node', v);
        if (idx === 0) node.appendChild(el('span', 'viz-tag', 'front'));
        if (idx === state.length - 1 && state.length > 1) node.appendChild(el('span', 'viz-tag', 'rear'));
        if (idx === animateIdx && animClass) node.classList.add(animClass);
        row.appendChild(node);
      });
      ui.stage.appendChild(row);
      return row;
    }

    async function enqueue(input) {
      const v = (input.value || '').trim();
      if (v === '') { say('digite um valor para enfileirar'); return; }
      if (state.length >= 8) { say('limite de 8 itens para caber na tela'); return; }
      state.push(v);
      const row = render(state.length - 1, 'enter');
      const nodes = row.querySelectorAll('.viz-node');
      void row.offsetWidth;
      nodes[nodes.length - 1].classList.remove('enter');
      say(`enqueue(${v}) → entra no fim (rear) · O(1)`);
      input.value = Math.floor(Math.random() * 90) + 10;
      await wait(ANIM);
    }

    async function dequeue() {
      if (state.length === 0) { say('fila vazia: dequeue() devolve null'); return; }
      const row = ui.stage.querySelector('.viz-row');
      const first = row.querySelectorAll('.viz-node')[0];
      const v = state[0];
      first.classList.add('leave');
      await wait(ANIM);
      state.shift();
      render();
      say(`dequeue() devolveu ${v} (front) → O(1)`);
    }

    render();
    say('o primeiro a entrar é o primeiro a sair');
  }

  // ─────────────────────────────────────────────────────────
  //  BUBBLE SORT (animated bars, step by step)
  // ─────────────────────────────────────────────────────────
  function bubbleSortViz(root) {
    const STEP_MS = 320;

    function parseNums(str) {
      if (!str) return [64, 34, 25, 12, 22, 11, 90];
      return str.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
    }

    const original = parseNums(root.dataset.initial);
    let state, pass, idx, done, comparisons, swaps, sortedFrom;
    let running = false;

    // ── Custom UI (no value input — bars only) ─────────────
    root.innerHTML = '';
    const bar = el('div', 'viz-bar');
    bar.appendChild(el('span', 'viz-title', 'Bubble Sort — passo a passo'));
    const statsEl = el('span', 'viz-sort-stats', '');
    bar.appendChild(statsEl);

    const btnStep  = el('button', 'viz-btn', 'Passo');
    const btnAuto  = el('button', 'viz-btn teal', 'Auto ▶');
    const btnReset = el('button', 'viz-btn ghost', 'Resetar');
    bar.appendChild(btnStep); bar.appendChild(btnAuto); bar.appendChild(btnReset);

    const stage = el('div', 'viz-stage sort-stage');
    const log   = el('div', 'viz-log', 'pronto.');
    root.appendChild(bar);
    root.appendChild(stage);
    root.appendChild(log);

    function say(msg)  { log.textContent = msg; }
    function updateStats() {
      statsEl.textContent = `comparações: ${comparisons}   trocas: ${swaps}`;
    }

    function reset() {
      state = [...original];
      pass = 0; idx = 0; done = false;
      comparisons = 0; swaps = 0;
      sortedFrom = state.length;
      running = false;
      btnAuto.textContent = 'Auto ▶';
      btnStep.disabled = false;
      renderBars();
      say('Clique em Passo para avançar um a um, ou Auto para executar completo.');
    }

    function renderBars(compareIdxs = [], swapIdxs = []) {
      stage.innerHTML = '';
      const maxVal = Math.max(...state);
      const container = el('div', 'sort-bars');

      state.forEach((v, i) => {
        const wrap = el('div', 'sort-bar');
        const fill = el('div', 'sort-bar-fill');
        const pct  = Math.max(10, Math.round((v / maxVal) * 100));
        fill.style.height = pct + '%';

        if (i >= sortedFrom)           fill.classList.add('sorted');
        else if (swapIdxs.includes(i)) fill.classList.add('swapping');
        else if (compareIdxs.includes(i)) fill.classList.add('comparing');

        wrap.appendChild(fill);
        wrap.appendChild(el('div', 'sort-bar-label', v));
        container.appendChild(wrap);
      });

      stage.appendChild(container);
      updateStats();
    }

    async function step() {
      if (done) { say('Ordenação completa — clique Resetar para recomeçar.'); return; }

      if (idx < sortedFrom - 1) {
        comparisons++;
        renderBars([idx, idx + 1]);
        await wait(STEP_MS / 2);

        if (state[idx] > state[idx + 1]) {
          swaps++;
          [state[idx], state[idx + 1]] = [state[idx + 1], state[idx]];
          renderBars([], [idx, idx + 1]);
          say(`↕ Troca: posições [${idx}] e [${idx + 1}] · comparações: ${comparisons}, trocas: ${swaps}`);
          await wait(STEP_MS / 2);
        } else {
          renderBars([idx, idx + 1]);
          say(`✓ Sem troca: ${state[idx]} ≤ ${state[idx + 1]} · comparações: ${comparisons}`);
        }
        idx++;
      } else {
        sortedFrom--;
        pass++;
        idx = 0;

        if (sortedFrom <= 0) {
          done = true;
          sortedFrom = 0;
          renderBars();
          say(`✅ Ordenado em ${pass} passagens · ${comparisons} comparações · ${swaps} trocas`);
          btnAuto.textContent = 'Auto ▶';
          btnStep.disabled = false;
          running = false;
          return;
        }
        renderBars();
        say(`Passagem ${pass} concluída — o maior restante foi para o lugar certo`);
      }
    }

    async function autoRun() {
      if (running) {
        running = false;
        btnAuto.textContent = 'Auto ▶';
        btnStep.disabled = false;
        return;
      }
      if (done) reset();
      running = true;
      btnAuto.textContent = '⏸ Pausar';
      btnStep.disabled = true;

      while (running && !done) {
        await step();
        await wait(reduceMotion ? 10 : 80);
      }

      if (!done) {
        running = false;
        btnAuto.textContent = 'Auto ▶';
        btnStep.disabled = false;
      }
    }

    btnStep.addEventListener('click',  () => { if (!running) step(); });
    btnAuto.addEventListener('click',  autoRun);
    btnReset.addEventListener('click', reset);

    reset();
  }

  // ─────────────────────────────────────────────────────────
  //  GIT FLOW (the 4 areas a change travels through)
  // ─────────────────────────────────────────────────────────
  function gitFlow(root) {
    // Areas left→right; `cmd` is the command that moves a change INTO this area.
    const AREAS = [
      { emoji: '📝', label: 'Working\nDirectory', cmd: '' },
      { emoji: '➕', label: 'Staging\nArea',      cmd: 'git add' },
      { emoji: '📦', label: 'Repositório\nLocal',  cmd: 'git commit' },
      { emoji: '☁️', label: 'Remoto\n(GitHub)',    cmd: 'git push' },
    ];
    let pos = -1; // -1 = nada modificado (working tree limpo); 0..3 = área atual da mudança
    let busy = false;

    // Custom UI (no numeric input)
    root.innerHTML = '';
    const bar = el('div', 'viz-bar');
    bar.appendChild(el('span', 'viz-title', 'Fluxo do Git — por onde um arquivo passa'));
    const mk = (label, cls) => {
      const b = el('button', 'viz-btn' + (cls ? ' ' + cls : ''), label);
      bar.appendChild(b);
      return b;
    };
    const bEdit   = mk('✏️ editar');
    const bAdd    = mk('git add');
    const bCommit = mk('git commit');
    const bPush   = mk('git push');
    const bUndo   = mk('↩ desfazer', 'pink');
    const bReset  = mk('reset', 'ghost');

    const stage = el('div', 'viz-stage');
    const log   = el('div', 'viz-log', 'pronto.');
    root.appendChild(bar);
    root.appendChild(stage);
    root.appendChild(log);

    function say(m) { log.textContent = m; }

    function render(animate) {
      stage.innerHTML = '';
      const wrap = el('div', 'git-areas');
      AREAS.forEach((a, i) => {
        if (i > 0) {
          const arr = el('div', 'git-flow-arrow');
          arr.appendChild(el('span', 'gfa-cmd', a.cmd));
          arr.appendChild(el('span', 'gfa-tip', '→'));
          wrap.appendChild(arr);
        }
        const col = el('div', 'git-area' + (i === pos ? ' active' : ''));
        const box = el('div', 'git-area-box');
        box.appendChild(el('div', 'git-area-emoji', a.emoji));
        if (i === pos) box.appendChild(el('div', 'git-file' + (animate ? ' enter' : ''), 'app.js'));
        col.appendChild(box);
        const lbl = el('div', 'git-area-label');
        lbl.innerHTML = a.label.replace('\n', '<br>');
        col.appendChild(lbl);
        wrap.appendChild(col);
      });
      stage.appendChild(wrap);
      if (animate) {
        const f = stage.querySelector('.git-file.enter');
        if (f) { void f.offsetWidth; f.classList.remove('enter'); }
      }
    }

    function updateButtons() {
      bAdd.disabled    = busy || pos !== 0;
      bCommit.disabled = busy || pos !== 1;
      bPush.disabled   = busy || pos !== 2;
      bUndo.disabled   = busy || pos < 0;
      bEdit.disabled   = busy;
      bReset.disabled  = busy;
    }

    async function move(to, msg) {
      busy = true;
      updateButtons();
      pos = to;
      render(to >= 0);
      say(msg);
      await wait(ANIM);
      busy = false;
      updateButtons();
    }

    bEdit.addEventListener('click', () => {
      if (busy) return;
      move(0, pos >= 1
        ? 'Você editou app.js de novo → ele reaparece como "modified" no Working Directory.'
        : 'Você criou/editou app.js → mudança "untracked/modified" no Working Directory.');
    });
    bAdd.addEventListener('click', () => {
      if (busy || pos !== 0) return;
      move(1, 'git add app.js → a mudança entra na Staging Area, pronta para o próximo commit.');
    });
    bCommit.addEventListener('click', () => {
      if (busy || pos !== 1) return;
      move(2, 'git commit -m "..." → cria um commit no Repositório Local. Stage fica limpo.');
    });
    bPush.addEventListener('click', () => {
      if (busy || pos !== 2) return;
      move(3, 'git push → envia os commits locais para o Remoto (GitHub). Agora todos veem.');
    });
    bUndo.addEventListener('click', () => {
      if (busy || pos < 0) return;
      const msgs = {
        0: 'git restore app.js → descarta a edição e volta o arquivo ao último commit.',
        1: 'git restore --staged app.js → tira do stage, mas mantém a edição no Working Directory.',
        2: 'git reset --soft HEAD~1 → desfaz o commit e devolve as mudanças ao stage.',
        3: 'Já está no remoto: use git revert <hash> (novo commit que desfaz) — não reescreva histórico público.',
      };
      if (pos === 3) { say(msgs[3]); return; } // não "volta" do remoto no modelo
      move(pos - 1, msgs[pos]);
    });
    bReset.addEventListener('click', () => {
      if (busy) return;
      pos = -1;
      render(false);
      say('Working tree limpo. Clique em ✏️ editar para começar o ciclo.');
      updateButtons();
    });

    render(false);
    updateButtons();
    say('Working tree limpo. Edite o arquivo e siga add → commit → push.');
  }

  // ─────────────────────────────────────────────────────────
  //  POSITION — how position:static/relative/absolute/sticky
  //  behave inside a scrollable, positioned ancestor.
  // ─────────────────────────────────────────────────────────
  function positionViz(root) {
    // top/left/right offsets applied to the target per mode + a plain explanation.
    const MODES = {
      static: {
        css: {},
        desc: 'static (padrão) — a caixa fica no fluxo normal. top/left/right são ignorados.',
      },
      relative: {
        css: { position: 'relative', top: '20px', left: '28px' },
        desc: 'relative — deslocada a partir da posição original; o espaço dela continua reservado (as irmãs não se movem).',
      },
      absolute: {
        css: { position: 'absolute', top: '12px', right: '12px' },
        desc: 'absolute — sai do fluxo (as irmãs sobem) e ancora no ancestral posicionado mais próximo: a moldura. Rola junto com o conteúdo dela.',
      },
      sticky: {
        css: { position: 'sticky', top: '8px' },
        desc: 'sticky — rola como uma caixa normal até encostar em top:8px e então gruda. Role a moldura para ver.',
      },
    };

    root.innerHTML = '';
    const bar = el('div', 'viz-bar');
    bar.appendChild(el('span', 'viz-title', 'position — interativo'));
    const stage = el('div', 'viz-stage pos-stage');

    // The scrollable, positioned ancestor (the containing block for absolute).
    const viewport = el('div', 'pos-viewport');
    const content = el('div', 'pos-content');
    // Normal-flow siblings + the target in the middle.
    const before = ['#topo', 'caixa 1', 'caixa 2'];
    const after = ['caixa 3', 'caixa 4', 'caixa 5', '#fim'];
    before.forEach(t => content.appendChild(el('div', 'pos-box', t)));
    const target = el('div', 'pos-box pos-target', '🎯 alvo');
    content.appendChild(target);
    after.forEach(t => content.appendChild(el('div', 'pos-box', t)));
    viewport.appendChild(content);

    const hint = el('div', 'pos-hint', '↕ a moldura rola — experimente com sticky e absolute');
    const log = el('div', 'viz-log');

    const buttons = {};
    Object.keys(MODES).forEach(mode => {
      const b = el('button', 'viz-btn', mode);
      b.addEventListener('click', () => apply(mode));
      bar.appendChild(b);
      buttons[mode] = b;
    });

    function apply(mode) {
      const { css, desc } = MODES[mode];
      // Reset every positioning property, then set this mode's.
      target.style.cssText = '';
      Object.assign(target.style, css);
      Object.keys(buttons).forEach(m => buttons[m].classList.toggle('teal', m === mode));
      log.textContent = 'position: ' + mode + ' — ' + desc;
      viewport.scrollTop = 0;
    }

    root.appendChild(bar);
    stage.appendChild(viewport);
    stage.appendChild(hint);
    root.appendChild(stage);
    root.appendChild(log);
    apply('static');
  }

  const builders = {
    'linked-list':  linkedList,
    'stack':        stack,
    'queue':        queue,
    'bubble-sort':  bubbleSortViz,
    'git-flow':     gitFlow,
    'position':     positionViz,
  };

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-viz]').forEach(root => {
      const build = builders[root.dataset.viz];
      if (build) build(root);
    });
  });
})();
