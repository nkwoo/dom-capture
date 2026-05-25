<p align="center">
  <img src="../logo.png" alt="DOM Capture" width="500" />
</p>

<h1 align="center">DOM Capture</h1>

<p align="center">
  Extensión de Chrome para capturar elementos DOM o páginas completas como PNG o PDF
</p>

<p align="center">
  <a href="../README.md">English</a>
</p>

---

## Características

- **Selector de elementos** — Pasa el ratón por cualquier elemento y haz clic para capturarlo
- **Selector CSS / XPath** — Captura un elemento específico mediante selector
- **Captura de ventana** — Captura de pantalla del área visible actual
- **Captura de página completa** — Captura con desplazamiento de la página completa
- **Exportar** — Guardar como PNG o PDF, o copiar al portapapeles

## Instalación

### Opción A — Chrome Web Store

En la [Chrome Web Store](https://chromewebstore.google.com/detail/dom-capture/cmknlcgmcbinbngoijkmbihpohjkokda), haz clic en **Añadir a Chrome**.

### Opción B — Manual (Modo desarrollador)

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/nkwoo/dom-capture.git
   ```

2. **Abrir la página de extensiones de Chrome**
   Escribe `chrome://extensions` en la barra de direcciones.

3. **Activar el Modo desarrollador**
   Activa el interruptor **Modo desarrollador** en la esquina superior derecha.

4. **Cargar la extensión**
   Haz clic en **Cargar extensión sin empaquetar** y selecciona la carpeta clonada.

5. **Fijar la extensión** (opcional)
   Haz clic en el icono de puzzle en la barra de herramientas de Chrome y fija **DOM Capture**.

## Uso

| Tarea | Cómo |
|-------|------|
| Capturar un elemento | Clic en el icono → **Seleccionar elemento** → Clic en cualquier elemento de la página |
| Capturar por selector | Clic en el icono → Introduce un selector CSS o XPath → **Capturar** |
| Capturar ventana | Clic en el icono → Pestaña **Ventana** → **Capturar** |
| Capturar página completa | Clic en el icono → Pestaña **Página completa** → **Capturar** |
| Descargar | Tras la captura, clic en **Descargar** (PNG o PDF) |
| Copiar al portapapeles | Tras la captura, clic en **Copiar** (solo PNG) |

## Contribuir

¡Las contribuciones son bienvenidas!

1. Haz un fork del repositorio.
2. Crea una rama de funcionalidad: `git checkout -b feat/your-feature`
3. Realiza tus cambios: `git commit -m "feat: describe your change"`
4. Sube la rama: `git push origin feat/your-feature`
5. Abre una Pull Request contra `main`.

Por favor, mantén las pull requests enfocadas — una funcionalidad o corrección por PR.

## Reportar problemas

¿Encontraste un bug o tienes una solicitud de función? [Abre un issue](https://github.com/nkwoo/dom-capture/issues/new) e incluye:

- Versión de Chrome (`chrome://version`)
- Versión de la extensión (visible en `chrome://extensions`)
- Pasos para reproducir
- Comportamiento esperado vs. comportamiento actual
- Capturas de pantalla o grabaciones si aplica

## Licencia

[MIT](https://github.com/nkwoo/dom-capture/blob/main/LICENSE)
