# DEVIS – Générateur de devis (Sky Alu)

Application Angular légère pour créer, imprimer (PDF) et sauvegarder des devis.
Les données sont stockées dans le navigateur (localStorage) ; export/import JSON disponible.

- Code : `devis-app/`
- Modèle d'origine : `docs/`

## Développement
```
cd devis-app
npm install
npx ng serve
```

## Déploiement
Chaque push sur `main` construit l'application et la publie sur GitHub Pages
(`.github/workflows/deploy.yml`). Réglage unique : *Settings → Pages → Source : GitHub Actions*.
