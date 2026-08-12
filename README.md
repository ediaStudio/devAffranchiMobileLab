# Mobile Lab — page de vente + accès sécurisé post-paiement

Page de vente statique (GitHub Pages, domaine `ai.devaffranchi.com`) pour l'appel
de groupe hebdomadaire du samedi (29$/mois).

Le lien Google Meet et le lien du calendrier ne sont **jamais** dans le repo ni
dans les pages publiques. Ils sont délivrés par un Cloudflare Worker qui vérifie
le paiement Stripe avant de les renvoyer.

## Architecture

```
ai.devaffranchi.com/index.html   page de vente (bouton -> Worker /start)
  -> Worker /start               cree une Checkout Session Stripe (abonnement 29$)
     -> Stripe checkout          paiement
        -> merci.html?session_id=...   page de confirmation
           -> Worker /links      verifie payment_status=paid, renvoie les liens
```

## Déploiement

1. **Stripe** : créer un prix récurrent (29 USD / mois) dans le dashboard,
   récupérer son `price_...`.
2. **Worker** :
   ```bash
   cd worker
   npx wrangler deploy
   npx wrangler secret put STRIPE_SECRET_KEY   # sk_live_...
   npx wrangler secret put PRICE_ID            # price_...
   npx wrangler secret put MEET_URL            # lien Google Meet récurrent
   npx wrangler secret put CALENDAR_URL        # lien public événement calendrier
   npx wrangler secret put ALLOWED_ORIGIN      # https://ai.devaffranchi.com
   ```
   Les secrets ne sont jamais commités : `worker/worker.js` ne contient que du code.
3. **URL du Worker** : coller l'URL (`https://mobile-lab.<ton-sub>.workers.dev`)
   dans la constante `WORKER_URL` de `index.html` et `merci.html`, puis push.
4. Pages se rebuild automatiquement au push.

## Lien du calendrier Google

Créer l'événement récurrent du samedi dans Google Calendar, avec le lien Meet en
lieu. Rendre l'événement public (paramètres de l'événement -> visibilité), copier
son lien public (`google.com/calendar/event?eid=...`). C'est ce lien qui va dans
le secret `CALENDAR_URL` : chaque membre peut ajouter toute la série en un clic.

## Test

- `https://ai.devaffranchi.com/merci.html` sans `session_id` -> "Paiement non confirmé"
- Avec un vrai paiement : la page affiche les deux boutons (Meet + calendrier)
- Un `session_id` d'une session non payée -> refus (403 côté Worker)

## Sécurité

- Le repo est public mais ne contient aucun secret ni lien d'accès.
- Le Worker ne renvoie les liens que si `payment_status === "paid"`.
- Le lien Meet reste un lien partagé : pour du très haut volume, activer la
  salle d'attente Meet ou régénérer le lien entre chaque cohorte.
