# Parisian Driver

Site vitrine d'un chauffeur privé VTC en Île-de-France : présentation des
services, du véhicule, de la zone de couverture, des tarifs, formulaire de
réservation en deux étapes et formulaire de contact.

Site **statique** — aucun outil de build, aucune dépendance à installer.

## Structure

```
.
├── index.html              Page unique (toutes les sections)
├── css/
│   └── styles.css          Thème sombre, mise en page responsive, états
├── js/
│   └── main.js             Navigation, scroll-spy, formulaires, modale légale
└── assets/
    └── hero-paris-nuit.jpg Visuel du hero
```

## Lancer en local

Ouvrir `index.html` directement dans un navigateur, ou servir le dossier :

```bash
python3 -m http.server 8000
# puis http://localhost:8000
```

## Fonctionnalités

- **Navigation** : défilement doux, lien actif mis en évidence au scroll
  (barre horizontale défilante sur mobile, barre d'actions fixe en bas).
- **Réservation** : formulaire → récapitulatif → confirmation, avec référence
  générée. Aucune donnée n'est envoyée (maquette front) : à brancher sur le
  module de réservation / paiement réel.
- **Contact** : validation navigateur puis écran de confirmation.
- **Pages légales** : Mentions légales et CGV affichées en modale.

## À compléter avant mise en production

Ces éléments sont volontairement laissés en attente (repérables par des
crochets `[…]` dans le texte) :

- Grille tarifaire réelle (le site affiche « Sur devis »).
- Informations légales de l'entreprise (SIRET, RCS, assureur, hébergeur…).
- Branchement des formulaires à un backend (email, module de réservation,
  paiement de l'acompte).
- Photographies du véhicule (les vignettes sont des emplacements réservés).

## Design

Palette : encre `#0E0F11`, texte `#ECECE8`, bleu `#9BB4D8`, navy `#0C2340`.
Typographies : *Instrument Sans* (texte) et *IBM Plex Mono* (libellés),
chargées depuis Google Fonts.
