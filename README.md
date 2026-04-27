# ICE Jardins React

Migração do site institucional de Hugo para React + Vite, mantendo conteúdo e identidade visual.

## Stack

- React 18 + TypeScript
- Vite
- React Router
- Bootstrap + CSS Modules
- Pipeline de conteúdo Markdown (`gray-matter` + `remark/rehype`)
- Prerender estático via SSR (`scripts/prerender.mjs`)

## Estrutura

```txt
src/
  app/
  core/
  shared/
  features/
  content/
  styles/
scripts/
```

## Comandos

```bash
npm install
npm run dev
npm run check
npm run build
npm run preview
```

## Pipeline de build

`npm run build` executa:

1. `build:content` -> converte Markdown/frontmatter em JSON para o app
2. `build:search-index` -> gera índice local de busca
3. `build:client` -> build client Vite
4. `build:ssr` -> bundle SSR para prerender
5. `prerender` -> gera HTML estático por rota pública

## Rotas principais

- `/`
- `/visita/`
- `/fe/`
- `/posts/`
- `/posts/:slug/`
- `/tags/:slug/`
- `/categorias/:slug/`

## Origem de conteúdo

- Páginas Markdown: `content/*.md`
- Sermões: `content/posts/*.md`
- Assets: `static/images/*`

Dados gerados automaticamente para o app ficam em `src/content/generated/`.

## Publicacao no Vercel

- Branch de producao React: `vercel-react-prod`
- Dominio planejado: `https://icejardins.com.br`
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm ci`

O site atual em GitHub Pages permanece preservado na branch `main`. A branch React deve ser usada pelo Vercel para deploys de preview e producao.

## Guia editorial

- Criação de novas publicações via GitHub (sem backend): [`docs/GUIA-PUBLICACOES.md`](docs/GUIA-PUBLICACOES.md)
