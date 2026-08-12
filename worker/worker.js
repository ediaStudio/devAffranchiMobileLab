// Mobile Lab · Worker de paiement
// Cree une Checkout Session Stripe, verifie le paiement, delivre les liens d'acces.
// Aucun secret dans ce fichier : tout est dans les variables d'environnement.
//
// Routes :
//   GET /start   -> cree une Checkout Session (abonnement 29$/mois) et redirige vers Stripe
//   GET /links?session_id=xxx -> renvoie { meet_url, calendar_url } si la session est PAYEE
//
// Secrets (wrangler secret put) :
//   STRIPE_SECRET_KEY  clé secrète Stripe (sk_live_...)
//   PRICE_ID           id du prix récurrent Stripe (price_...)
//   MEET_URL           lien Google Meet récurrent du samedi
//   CALENDAR_URL       lien public de l'événement Google Calendar
//   ALLOWED_ORIGIN     https://ai.devaffranchi.com

const STRIPE_API = "https://api.stripe.com/v1";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = env.ALLOWED_ORIGIN || "https://ai.devaffranchi.com";
    const cors = {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    try {
      if (url.pathname === "/start") {
        return await startCheckout(env, cors);
      }
      if (url.pathname === "/links") {
        return await deliverLinks(env, cors, url.searchParams.get("session_id"));
      }
      return json({ error: "not found" }, 404, cors);
    } catch (err) {
      return json({ error: "erreur interne" }, 500, cors);
    }
  },
};

async function startCheckout(env, cors) {
  if (!env.STRIPE_SECRET_KEY || !env.PRICE_ID) {
    return json({ error: "worker non configure" }, 500, cors);
  }
  const body = new URLSearchParams({
    mode: "subscription",
    "line_items[0][price]": env.PRICE_ID,
    "line_items[0][quantity]": "1",
    success_url: "https://ai.devaffranchi.com/merci.html?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: "https://ai.devaffranchi.com/",
  });
  const res = await fetch(`${STRIPE_API}/checkout/sessions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  const session = await res.json();
  if (!res.ok || !session.url) {
    return json({ error: "stripe a refuse la session" }, 502, cors);
  }
  return Response.redirect(session.url, 303);
}

async function deliverLinks(env, cors, sessionId) {
  if (!sessionId) {
    return json({ error: "session manquante" }, 400, cors);
  }
  const res = await fetch(`${STRIPE_API}/checkout/sessions/${sessionId}`, {
    headers: { Authorization: `Bearer ${env.STRIPE_SECRET_KEY}` },
  });
  const session = await res.json();
  if (!res.ok || session.payment_status !== "paid") {
    return json({ error: "paiement non confirme" }, 403, cors);
  }
  return json({ meet_url: env.MEET_URL, calendar_url: env.CALENDAR_URL }, 200, cors);
}

function json(data, status, cors) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...cors },
  });
}
