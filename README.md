# Estudos +PraTi — Guia de Estudos Full Stack MaisPraTi

> Material interativo para o programa Full Stack 2026. Cada módulo tem sua própria área com exemplos executáveis, visualizadores animados e exercícios práticos.

---

## Módulos do Programa

| # | Módulo | Status |
|---|--------|--------|
| 01 | **JavaScript** — DS&A, estruturas de dados, ordenação | Disponível |
| 02 | **Desenvolvimento Web: Frontend Essencial e Controle de Versão** — HTML, CSS, Git | Em breve |
| 03 | **Desenvolvimento Web com React** — componentes, hooks, roteamento | Em breve |
| 04 | **Fundamentos de Programação em Java e Introdução ao Ecossistema Spring** | Em breve |
| 05 | **Desenvolvimento Backend com Spring Framework e Bancos de Dados Relacionais** | Em breve |
| 06 | **DevOps Básico e Introdução à Inteligência Artificial com Python** — Docker, AWS, Python, IA | Em breve |

---

## Como executar localmente

```bash
npm install       # instala Vite + ESLint + Prettier
npm run dev       # servidor local em http://localhost:5173
```

Os caminhos de assets usam root-relative (`/assets/...`), então é necessário um servidor — o Vite cuida disso.

---

## Estrutura do projeto

```
maisprati-frontend/
├── index.html                        # Hub do programa (todos os módulos)
├── assets/
│   ├── css/styles.css                # Design system compartilhado
│   └── js/
│       ├── nav.js                    # Navegação dinâmica + tema claro/escuro
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
├── vite.config.js
├── eslint.config.js
└── .prettierrc
```

---

## Tecnologias

| Ferramenta | Uso |
|------------|-----|
| HTML5 + CSS3 + JS (ES2024) | Conteúdo, estilo e lógica |
| Vite 6 | Dev server + build MPA |
| Prism.js (CDN) | Highlight de sintaxe |
| Google Fonts | JetBrains Mono + Syne |
| ESLint + Prettier | Qualidade de código |

---

## Scripts

```bash
npm run dev      # Inicia o servidor de desenvolvimento
npm run build    # Gera versão de produção em dist/
npm run preview  # Visualiza o build localmente
npm run lint     # Analisa os arquivos JS com ESLint
npm run format   # Formata todos os arquivos com Prettier
```

---

## Adicionando um novo módulo

1. Crie `modules/NN-nome/index.html` (hub do módulo) e `modules/NN-nome/pages/`
2. Registre as páginas em `vite.config.js` (seção `input`)
3. Adicione o card do módulo em `index.html` (hub do programa)
4. Em `assets/js/nav.js`, adicione a entrada no objeto `MODULES`
5. Atualize a tabela de módulos neste README

Consulte `CLAUDE.md` para convenções detalhadas.

---

## Deploy na Vercel

1. Importe o repositório na Vercel
2. Configure: **Framework** `Vite` · **Build Command** `npm run build` · **Output** `dist`
3. Clique em Deploy — sem `vercel.json` necessário

---

## Licença

Material didático de uso livre para fins educacionais.
