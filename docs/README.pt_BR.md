<p align="center">
  <img src="../logo.png" alt="DOM Capture" width="500" />
</p>

<h1 align="center">DOM Capture</h1>

<p align="center">
  Extensão do Chrome para capturar elementos DOM ou páginas inteiras como PNG ou PDF
</p>

<p align="center">
  <a href="../README.md">English</a>
</p>

---

## Funcionalidades

- **Seletor de elementos** — Passe o mouse sobre qualquer elemento e clique para capturá-lo
- **Seletor CSS / XPath** — Capture um elemento específico por seletor
- **Captura de região** — Arraste um retângulo sobre a janela para capturar a área selecionada
- **Captura de janela** — Captura de tela da área visível atual
- **Captura de página inteira** — Captura com rolagem da página inteira
- **Exportar** — Salvar como PNG ou PDF, ou copiar para a área de transferência

## Instalação

### Opção A — Chrome Web Store

Na [Chrome Web Store](https://chromewebstore.google.com/detail/dom-capture/cmknlcgmcbinbngoijkmbihpohjkokda), clique em **Usar no Chrome**.

### Opção B — Manual (Modo do desenvolvedor)

1. **Clonar o repositório**
   ```bash
   git clone https://github.com/nkwoo/dom-capture.git
   ```

2. **Abrir a página de extensões do Chrome**
   Digite `chrome://extensions` na barra de endereços.

3. **Ativar o Modo do desenvolvedor**
   Ative o botão **Modo do desenvolvedor** no canto superior direito.

4. **Carregar a extensão**
   Clique em **Carregar sem compactação** e selecione a pasta clonada.

5. **Fixar a extensão** (opcional)
   Clique no ícone de quebra-cabeça na barra de ferramentas do Chrome e fixe o **DOM Capture**.

## Uso

| Tarefa | Como |
|--------|------|
| Capturar um elemento | Clique no ícone → **Selecionar elemento** → Clique em qualquer elemento da página |
| Capturar por seletor | Clique no ícone → Digite um seletor CSS ou XPath → **Capturar** |
| Capturar uma região | Clique no ícone → Aba **Região** → Arraste para selecionar uma área → **Capturar** |
| Capturar janela | Clique no ícone → Aba **Janela** → **Capturar** |
| Capturar página inteira | Clique no ícone → Aba **Página inteira** → **Capturar** |
| Baixar | Após captura, clique em **Baixar** (PNG ou PDF) |
| Copiar para área de transferência | Após captura, clique em **Copiar** (somente PNG) |

## Contribuir

Contribuições são bem-vindas!

1. Faça um fork do repositório.
2. Crie uma branch de funcionalidade: `git checkout -b feat/your-feature`
3. Faça o commit das suas alterações: `git commit -m "feat: describe your change"`
4. Envie a branch: `git push origin feat/your-feature`
5. Abra um Pull Request para `main`.

Por favor, mantenha os pull requests focados — uma funcionalidade ou correção por PR.

## Reportar problemas

Encontrou um bug ou tem uma solicitação de funcionalidade? [Abra uma issue](https://github.com/nkwoo/dom-capture/issues/new) e inclua:

- Versão do Chrome (`chrome://version`)
- Versão da extensão (visível em `chrome://extensions`)
- Passos para reproduzir
- Comportamento esperado vs. comportamento real
- Capturas de tela ou gravações, se aplicável

## Licença

[MIT](https://github.com/nkwoo/dom-capture/blob/main/LICENSE)
