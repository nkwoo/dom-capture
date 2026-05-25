<p align="center">
  <img src="../logo.png" alt="DOM Capture" width="500" />
</p>

<h1 align="center">DOM Capture</h1>

<p align="center">
  Chrome-Erweiterung zum Erfassen von DOM-Elementen oder ganzen Seiten als PNG oder PDF
</p>

<p align="center">
  <a href="../README.md">English</a>
</p>

---

## Funktionen

- **Element-Picker** — Fahre über ein Element und klicke es an, um es zu erfassen
- **CSS / XPath-Selektor** — Erfasse ein bestimmtes Element per Selektor
- **Viewport erfassen** — Screenshot des aktuell sichtbaren Bereichs
- **Gesamte Seite erfassen** — Scrollendes Screenshot der gesamten Seite
- **Export** — Als PNG oder PDF speichern oder in die Zwischenablage kopieren

## Installation

### Option A — Chrome Web Store

Im [Chrome Web Store](https://chromewebstore.google.com/detail/dom-capture/cmknlcgmcbinbngoijkmbihpohjkokda) auf **Zu Chrome hinzufügen** klicken.

### Option B — Manuell (Entwicklermodus)

1. **Repository klonen**
   ```bash
   git clone https://github.com/nkwoo/dom-capture.git
   ```

2. **Chrome-Erweiterungsseite öffnen**
   `chrome://extensions` in die Adressleiste eingeben.

3. **Entwicklermodus aktivieren**
   Den Schalter **Entwicklermodus** oben rechts aktivieren.

4. **Erweiterung laden**
   Auf **Entpackte Erweiterung laden** klicken und den geklonten Ordner auswählen.

5. **Erweiterung anheften** (optional)
   Auf das Puzzle-Symbol in der Chrome-Symbolleiste klicken und **DOM Capture** anheften.

## Verwendung

| Aufgabe | Vorgehensweise |
|---------|----------------|
| Element erfassen | Erweiterungssymbol klicken → **Element auswählen** → Element auf der Seite klicken |
| Per Selektor erfassen | Erweiterungssymbol klicken → CSS- oder XPath-Selektor eingeben → **Erfassen** |
| Viewport erfassen | Erweiterungssymbol klicken → Tab **Ansicht** → **Erfassen** |
| Gesamte Seite erfassen | Erweiterungssymbol klicken → Tab **Ganze Seite** → **Erfassen** |
| Herunterladen | Nach der Erfassung auf **Herunterladen** klicken (PNG oder PDF) |
| In Zwischenablage kopieren | Nach der Erfassung auf **Kopieren** klicken (nur PNG) |

## Beitragen

Beiträge sind willkommen!

1. Repository forken.
2. Feature-Branch erstellen: `git checkout -b feat/your-feature`
3. Änderungen committen: `git commit -m "feat: describe your change"`
4. Branch pushen: `git push origin feat/your-feature`
5. Pull Request gegen `main` öffnen.

Bitte halte Pull Requests fokussiert — ein Feature oder Bugfix pro PR.

## Fehler melden

Einen Fehler gefunden oder einen Funktionswunsch? [Issue öffnen](https://github.com/nkwoo/dom-capture/issues/new) und folgende Informationen angeben:

- Chrome-Version (`chrome://version`)
- Erweiterungsversion (sichtbar unter `chrome://extensions`)
- Schritte zur Reproduktion
- Erwartetes vs. tatsächliches Verhalten
- Screenshots oder Bildschirmaufnahmen, falls zutreffend

## Lizenz

[MIT](https://github.com/nkwoo/dom-capture/blob/main/LICENSE)
