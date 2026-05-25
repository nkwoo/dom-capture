<p align="center">
  <img src="../logo.png" alt="DOM Capture" width="500" />
</p>

<h1 align="center">DOM Capture</h1>

<p align="center">
  Extension Chrome pour capturer des éléments DOM ou des pages entières en PNG ou PDF
</p>

<p align="center">
  <a href="../README.md">English</a>
</p>

---

## Fonctionnalités

- **Sélecteur d'éléments** — Survolez n'importe quel élément et cliquez pour le capturer
- **Sélecteur CSS / XPath** — Capturez un élément spécifique par sélecteur
- **Capture de la fenêtre** — Capture d'écran de la zone visible actuelle
- **Capture de page entière** — Capture d'écran avec défilement de la page entière
- **Export** — Enregistrez en PNG ou PDF, ou copiez dans le presse-papiers

## Installation

### Option A — Chrome Web Store

Dans le [Chrome Web Store](https://chromewebstore.google.com/detail/dom-capture/cmknlcgmcbinbngoijkmbihpohjkokda), cliquez sur **Ajouter à Chrome**.

### Option B — Manuelle (Mode développeur)

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/nkwoo/dom-capture.git
   ```

2. **Ouvrir la page des extensions Chrome**
   Saisir `chrome://extensions` dans la barre d'adresse.

3. **Activer le Mode développeur**
   Activer le bouton **Mode développeur** en haut à droite.

4. **Charger l'extension**
   Cliquer sur **Charger l'extension non empaquetée** et sélectionner le dossier cloné.

5. **Épingler l'extension** (optionnel)
   Cliquer sur l'icône puzzle dans la barre d'outils Chrome et épingler **DOM Capture**.

## Utilisation

| Tâche | Comment |
|-------|---------|
| Capturer un élément | Cliquer sur l'icône → **Sélectionner un élément** → Cliquer sur un élément de la page |
| Capturer par sélecteur | Cliquer sur l'icône → Saisir un sélecteur CSS ou XPath → **Capturer** |
| Capturer la fenêtre | Cliquer sur l'icône → Onglet **Fenêtre** → **Capturer** |
| Capturer la page entière | Cliquer sur l'icône → Onglet **Page entière** → **Capturer** |
| Télécharger | Après la capture, cliquer sur **Télécharger** (PNG ou PDF) |
| Copier dans le presse-papiers | Après la capture, cliquer sur **Copier** (PNG uniquement) |

## Contribuer

Les contributions sont les bienvenues !

1. Forker le dépôt.
2. Créer une branche de fonctionnalité : `git checkout -b feat/your-feature`
3. Committer les modifications : `git commit -m "feat: describe your change"`
4. Pousser la branche : `git push origin feat/your-feature`
5. Ouvrir une Pull Request vers `main`.

Veuillez garder les pull requests focalisées — une fonctionnalité ou correction par PR.

## Signaler un problème

Vous avez trouvé un bug ou souhaitez proposer une fonctionnalité ? [Ouvrez une issue](https://github.com/nkwoo/dom-capture/issues/new) en incluant :

- Version de Chrome (`chrome://version`)
- Version de l'extension (visible dans `chrome://extensions`)
- Étapes pour reproduire
- Comportement attendu vs. comportement réel
- Captures d'écran ou enregistrements si applicable

## Licence

[MIT](https://github.com/nkwoo/dom-capture/blob/main/LICENSE)
