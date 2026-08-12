# Mobile Lab — page de vente

Page de vente statique pour l'appel de groupe hebdomadaire du samedi (29$/mois).
Un seul fichier, `index.html`, CSS et JS inclus, aucune dépendance à installer.

## Mise en service

1. Créer un Payment Link récurrent dans Stripe (29 USD / mois).
2. Ouvrir `index.html` et renseigner la constante en bas du fichier :

   ```js
   const CHECKOUT_URL = "https://buy.stripe.com/xxxxxxxx";
   ```

   Tant qu'elle est vide, les boutons affichent un rappel au lieu de rediriger.
3. Publier (voir ci-dessous).

## Publication via GitHub Pages

Settings → Pages → Source: `Deploy from a branch` → Branch: `main` / `root`.
La page sort sur `https://ediastudio.github.io/devAffranchiMobileLab/`.

Pour un domaine propre : ajouter un fichier `CNAME` contenant le sous-domaine
(ex. `lab.devaffranchi.com`) et créer l'enregistrement DNS correspondant chez le
registrar.

## Après le paiement

Le Payment Link seul ne délivre pas l'accès. Brancher un webhook Stripe :

- `checkout.session.completed` → envoi du mail avec le lien Google Meet récurrent
- `customer.subscription.deleted` → retrait de la liste des rappels

Le lien Meet vient d'un événement Google Calendar récurrent du samedi : même URL
chaque semaine, donc un seul lien à envoyer.

## Ce qu'il reste à faire

- [ ] Renseigner `CHECKOUT_URL`
- [ ] Remplacer le lien YouTube du footer si le handle diffère
- [ ] Ajouter 2 ou 3 témoignages de membres après les premiers appels
- [ ] Brancher le webhook Stripe
