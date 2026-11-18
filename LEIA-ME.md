# Convite da Tayane ❤️

## Estrutura
- `index.html`, `style.css`, `script.js` — o site
- `config.js` — número do WhatsApp, nomes e mensagens
- `painel/index.html` — painel só seu (`seusite.netlify.app/painel/`)

## Publicar
1. Suba esta pasta inteira no GitHub (repositório novo).
2. No Netlify: **Add new site → Import from Git** → escolha o repositório.
   Sem build command; Publish directory: `.` (raiz).
3. Em **Site configuration → Forms**, confirme que a detecção de formulários está ativa.
4. Para ver as escolhas dela: Netlify → **Forms → escolha**. Para aviso por e-mail: *Form notifications*.

## Mudar algo antes de mandar
Abra `/painel/`, edite os textos, baixe o `config.js` novo, substitua o arquivo e faça push.
O Netlify republica sozinho.

Obs.: o registro das escolhas só funciona no site publicado no Netlify, não abrindo o arquivo local.
