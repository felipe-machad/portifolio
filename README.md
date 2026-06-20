# Portfólio — Felipe Machado da Silva

Site **estático** (HTML + CSS + JS puro, sem build) do portfólio pessoal de
Felipe Machado da Silva — especialista em **automação**, **integração de sistemas**
e **Inteligência Artificial aplicada a negócios**.

## Estrutura de arquivos

```
portfolio-felipe/
├── index.html        # Página única com todas as seções
├── styles.css        # Estilos (paleta verde esmeralda / off-white)
├── script.js         # Interações: nav, reveal, menu mobile, timeline, form → WhatsApp
├── logo.svg          # Logo-mark TROCÁVEL (usado no nav/hero/rodapé)
├── favicon.svg       # Favicon (mesmo desenho do logo)
├── og-image.png      # Imagem de compartilhamento (1200x630)
├── Dockerfile        # Imagem nginx para deploy (porta 80)
├── nginx.conf        # Configuração do nginx (gzip + cache de assets)
├── .dockerignore     # Arquivos ignorados na imagem Docker
├── .gitignore        # Arquivos ignorados no Git
└── README.md         # Este arquivo
```

## Seções

É um **showcase puro** — sem formulário ou dados de contato.

1. **Hero** — nome, headline ("Transformo processos complexos em soluções inteligentes.") e CTAs internos ("Ver trajetória", "Ver projetos")
2. **Sobre** — bio real + filosofia (statement) + chips de competências
3. **Trajetória** — timeline-gráfico interativa: marcos clicáveis (teclado + aria) com TOTVS RM/Integração → Automação → IA aplicada → Sites com IA. No mobile vira timeline vertical.
4. **Especialidades** — 3 cards + stack completa (IA, automação, integração, SQL, TOTVS RM, APIs REST/SOAP, dashboards, soluções corporativas, consultoria)
5. **Demo** — slot de mídia 16:9 (trocável)
6. **Projetos** — cases reais (jufisioterapia.com, pwrtecnologia.com.br) + um 3º case de exemplo
7. **Rodapé minimalista** — apenas marca e ano (sem contato)

## Itens a revisar antes de publicar

- Anos exatos de cada marco da **Trajetória** (2023/2024/2025/2026) — ajuste se quiser datas precisas
- 3º card de projeto ("Conecta Vendas") — é um **exemplo**; troque por um case real
- Domínio nas meta tags (`felipemachado.dev`) — ajuste para o seu

> Os textos de Sobre, Hero, Trajetória e Especialidades já usam o conteúdo real.
> O portfólio **não tem contato** por opção — é uma vitrine.

---

## Personalização rápida

### Trocar o logo (logo-mark)
O símbolo da marca fica em **`logo.svg`** (verde, arquivo único), usado no menu, no hero e no
rodapé via `<img src="logo.svg">`. Para trocar, substitua o conteúdo de `logo.svg` por outro
SVG — o tamanho é controlado por CSS (`.brand__logo`, `.hero__mark`). O `favicon.svg` usa o
mesmo desenho; troque-o junto para manter a coerência.

### Trocar a foto do hero
O retrato do hero é **`felipe-portrait.png`** (gerado a partir de `felipe.png` com um leve
tratamento de cor para harmonizar com a paleta verde + cantos arredondados). Para trocar,
substitua `felipe-portrait.png` por outra imagem quadrada (mantendo o nome) ou edite o
`<img>` dentro de `.hero__portrait` no `index.html`. A moldura verde e o brilho são feitos
em CSS (`.hero__portrait-frame`), então qualquer foto entra no mesmo enquadramento.

### Slot de demo (vídeo / GIF / iframe)
Na seção **Demo** (`#demo` no `index.html`) há um placeholder 16:9. Para colocar uma demo real,
substitua o bloco `<div class="media__frame">…</div>` por **uma** das linhas (já comentadas
logo acima dele):

- Vídeo: `<video class="media__el" src="demo.mp4" poster="demo-poster.jpg" controls playsinline></video>`
- GIF: `<img class="media__el" src="demo.gif" alt="Demonstração" />`
- Iframe: `<iframe class="media__el" src="https://SEU-LINK" title="Demo" allowfullscreen loading="lazy"></iframe>`

Coloque o arquivo (`demo.mp4` / `demo.gif`) na raiz da pasta. O container mantém o 16:9.

### OG image (compartilhamento)
`og-image.png` (1200×630) já está na raiz; as meta tags OpenGraph/Twitter apontam para
`https://felipemachado.dev/og-image.png`. Ajuste o domínio ao publicar.

### Exemplos a substituir
Alguns valores são **exemplos** (marcados com comentários `EXEMPLO` no HTML): o domínio nas
metas (`felipemachado.dev`), o 3º case ("Conecta Vendas") e os anos da timeline (2023–2026).
Troque pelos dados reais. O portfólio **não tem seção de contato** — é uma vitrine.

---

## Deploy via GitHub + EasyPanel (Dockerfile)

O deploy é feito por **Dockerfile a partir de um repositório no GitHub**. O `Dockerfile`
sobe um nginx servindo os arquivos estáticos na **porta 80**.

### 1. Criar o repositório no GitHub

Crie um repositório novo (ex.: `portfolio-felipe`) em https://github.com/new
(pode ser público ou privado).

### 2. Enviar os arquivos (push)

Dentro da pasta `portfolio-felipe/`:

```bash
git init
git add .
git commit -m "Portfólio Felipe Machado — site estático"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/portfolio-felipe.git
git push -u origin main
```

### 3. Criar o App no EasyPanel

1. No EasyPanel, abra seu **Project** → **+ Service → App**.
2. Em **Source**, escolha **GitHub** e selecione o repositório `portfolio-felipe`
   (branch `main`). Conecte sua conta do GitHub se ainda não tiver feito.
3. Em **Build**, selecione **Dockerfile** (o EasyPanel detecta o `Dockerfile` na raiz).
   - Caminho do Dockerfile: `Dockerfile` (raiz do repo).
4. Em **Deploy / Ports**, exponha a **porta 80** (a porta do container definida no Dockerfile).
5. Clique em **Deploy**. O EasyPanel faz o build da imagem e sobe o container.

### 4. Domínio + HTTPS

1. Na aba **Domains** do serviço, adicione seu domínio (ex.: `felipemachado.com.br`).
2. Aponte o DNS do domínio para o IP da sua VPS (registro A).
3. Ative o **HTTPS (Let's Encrypt)** — o EasyPanel emite o certificado automaticamente.

### Atualizações futuras

Cada novo `git push` na branch `main` pode disparar um novo build/deploy
(ative o **Auto Deploy** no serviço, se desejar).

### Teste local (opcional)

```bash
# servir sem Docker
python3 -m http.server 8080
# ou testar a imagem Docker localmente
docker build -t portfolio-felipe .
docker run --rm -p 8080:80 portfolio-felipe
# abra http://localhost:8080
```

---

Feito com HTML, CSS e JavaScript puro — fácil de manter e hospedar em qualquer lugar.
