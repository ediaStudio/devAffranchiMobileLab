# Mobile Lab — page de vente

Page de vente statique (GitHub Pages, domaine `ai.devaffranchi.com`) pour l'appel
de groupe hebdomadaire du samedi (29$/mois).

Le paiement est géré entièrement par un Payment Link Stripe. Le message custom
(avec les liens Google Meet et calendrier) est la description du produit Stripe :
Stripe l'affiche après le paiement sur sa page de confirmation et l'envoie dans
le reçu email.

## Mise en service

1. Dans Stripe, créer le prix récurrent 29 USD / mois puis le Payment Link.
2. Coller la description ci-dessous dans la fiche produit du Payment Link
   (Products -> description), avec les vraies URLs à la place des placeholders.
3. Coller l'URL du Payment Link (`https://buy.stripe.com/xxxx`) dans la
   constante `CHECKOUT_URL` en bas de `index.html`.
4. Pages se rebuild automatiquement au push.

## Message custom (description du produit Stripe)

```
Bienvenue dans le Mobile Lab. Rendez-vous samedi à 10h00.
Lien du Meet : [LIEN_MEET]
Ajouter les appels à ton calendrier : [LIEN_CALENDRIER]
Tu peux annuler ton abonnement à tout moment depuis le lien de gestion de ton reçu.
```

## Lien du calendrier Google

Créer l'événement récurrent du samedi dans Google Calendar, avec le lien Meet en
lieu. Rendre l'événement public (paramètres de l'événement -> visibilité), copier
son lien public (`google.com/calendar/event?eid=...`). Chaque membre peut alors
ajouter toute la série en un clic.

## Limite assumée

La description du produit s'affiche aussi sur la page de paiement avant paiement.
Les liens Meet et calendrier sont donc visibles sans payer. C'est le compromis du
tout-Stripe. Si le volume devient un sujet, activer la salle d'attente Meet pour
valider qui entre.
