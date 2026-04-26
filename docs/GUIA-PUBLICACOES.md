# Guia de Publicacoes (GitHub Web)

Este guia ensina como criar uma nova publicacao no site sem backend, usando apenas o GitHub.

## Antes de comecar

- Voce precisa ter permissao de escrita no repositorio.
- Tudo e feito pelo navegador (nao precisa instalar nada).
- As publicacoes ficam em `content/posts/`.

## Passo a passo (forma recomendada)

1. Abra o repositorio no GitHub.
2. Entre na pasta [`content/posts`](../content/posts).
3. Clique em `Add file` -> `Create new file`.
4. No nome do arquivo, use este padrao:

```txt
nome-da-publicacao.md
```

Exemplo:

```txt
joao-3-16-o-amor-de-deus.md
```

5. Cole o modelo abaixo e preencha os campos.
6. Desca ate o final da pagina e clique em `Commit changes...`.
7. Selecione `Commit directly to the main branch` (ou abra PR, se sua equipe preferir).
8. Aguarde o deploy automatico.

## Modelo pronto de publicacao

Copie e cole exatamente este bloco em um novo arquivo `.md`:

```md
+++
title = "Titulo da publicacao"
subtitle = "Resumo curto da mensagem"
date = "2026-04-26"
draft = false
tags = ["Tag 1", "Tag 2"]
categorias = ["Sermoes", "Serie X"]
image = "/images/posts/nome-da-imagem.webp"
+++

Texto de abertura da publicacao.

## Titulo da secao

Paragrafo normal da mensagem.

> **Joao 3:16** Porque Deus amou o mundo de tal maneira...

Continua o texto da mensagem.
```

## Regras importantes

- Sempre mantenha os marcadores `+++` no inicio e no fim do cabecalho.
- O `date` deve estar no formato `AAAA-MM-DD`.
- Use `draft = false` para publicar.
- O nome do arquivo vira a URL da publicacao. Use:
  - letras minusculas
  - numeros
  - hifen (`-`)
  - sem espacos e sem acentos

## Como adicionar imagem da publicacao

1. Va para a pasta [`static/images/posts`](../static/images/posts).
2. Clique em `Add file` -> `Upload files`.
3. Envie a imagem (exemplo: `joao-3-16-o-amor-de-deus.webp`).
4. No arquivo da publicacao, use:

```toml
image = "/images/posts/joao-3-16-o-amor-de-deus.webp"
```

## Boas praticas de conteudo

- Use um titulo claro e objetivo.
- Coloque resumo no `subtitle`.
- Para passagens biblicas, use bloco de citacao com `>` para facilitar leitura.
- Revise ortografia antes do commit.

## Como editar uma publicacao existente

1. Abra `content/posts`.
2. Clique no arquivo da publicacao.
3. Clique no icone de lapis (`Edit this file`).
4. Edite, revise e faca `Commit changes...`.

## Checklist rapido (antes de publicar)

- Arquivo criado em `content/posts/`
- Frontmatter com `+++` correto
- `title`, `subtitle`, `date`, `tags`, `categorias`, `image`
- `draft = false`
- Imagem enviada em `static/images/posts/`
- Commit realizado

