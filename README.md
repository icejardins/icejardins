# ICE Jardins

Site estático da Igreja Cristã Evangélica Jardins, feito com Hugo e publicado via GitHub Pages.

## Rodar localmente

Requisitos:

- Hugo Extended `0.160.1` ou superior.
- Git com submódulos habilitados.

Primeiro preparo:

```powershell
git submodule update --init --recursive
```

Servidor local:

```powershell
hugo server -D
```

Build de produção:

```powershell
hugo --gc --minify
```

## Criar um sermão

Use o archetype da seção `posts`:

```powershell
hugo new posts/nome-do-sermao.md
```

Preencha no frontmatter:

- `title`: título público.
- `subtitle`: resumo curto.
- `date`: data do sermão ou publicação.
- `categorias` e `tags`: classificação.
- `series`: série do sermão, quando houver.
- `biblicalText`: texto bíblico principal.
- `speaker`: pregador, quando conhecido.
- `image`: imagem em `/images/posts/...webp`.

## Imagens

Preferir `.webp`.

Metas práticas:

- Hero: abaixo de `250KB`, quando possível.
- Sermões: abaixo de `150KB`, quando possível.

Exemplo usando `ffmpeg`:

```powershell
ffmpeg -i entrada.jpg -vf "scale='min(1200,iw)':-2" -c:v libwebp -quality 78 static/images/posts/saida.webp
```

## Dados da igreja

Informações institucionais ficam em `[params.church]` no `hugo.toml`: nome, slogan, horários, endereço, WhatsApp, e-mail e mapas.
