/* ============================================================
   Parisian Driver — comportements de la page
   ============================================================ */
(function () {
  'use strict';

  var header = document.getElementById('site-header');
  var rail = document.getElementById('nav-rail');
  var sectionIds = ['accueil', 'services', 'vehicule', 'zone', 'evenementiel',
    'tarifs', 'reservation', 'apropos', 'contact'];

  /* ── Défilement doux vers une section ────────────────── */
  function headerHeight() {
    return (rail && getComputedStyle(rail).display !== 'none') ? 124 : 76;
  }

  function goTo(id) {
    var el = document.getElementById(id);
    if (!el) return;
    var top = Math.max(0, el.getBoundingClientRect().top + window.pageYOffset - headerHeight());
    window.scrollTo({ top: top, behavior: 'smooth' });
  }

  document.addEventListener('click', function (e) {
    var target = e.target.closest('[data-go]');
    if (target) {
      e.preventDefault();
      goTo(target.getAttribute('data-go'));
    }
  });

  /* ── Scroll spy : lien actif + ombre du header ───────── */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
  var railLinks = Array.prototype.slice.call(document.querySelectorAll('.rail-link'));

  function setActive(id) {
    navLinks.forEach(function (l) {
      l.classList.toggle('active', l.getAttribute('data-go') === id);
    });
    railLinks.forEach(function (l) {
      l.classList.toggle('active', l.getAttribute('data-nav') === id);
    });
    // Centre la puce active dans le rail mobile
    if (rail && getComputedStyle(rail).display !== 'none') {
      var chip = rail.querySelector('[data-nav="' + id + '"]');
      if (chip) {
        var left = chip.offsetLeft - (rail.clientWidth - chip.offsetWidth) / 2;
        rail.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
      }
    }
  }

  var current = 'accueil';
  function onScroll() {
    var pos = window.pageYOffset;
    var active = sectionIds[0];
    sectionIds.forEach(function (id) {
      var el = document.getElementById(id);
      if (el && pos >= el.getBoundingClientRect().top + pos - headerHeight() - 60) active = id;
    });
    if (active !== current) { current = active; setActive(active); }
    header.classList.toggle('scrolled', pos > 10);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ── Vidéo de fond du hero ───────────────────────────────
     Chargée uniquement si l'utilisateur ne réduit pas les
     animations et si la connexion n'est pas lente / en mode
     économie de données. Sinon on garde le poster + le repli
     image (hero-paris-nuit.jpg). */
  (function () {
    var video = document.querySelector('.hero-video');
    if (!video) return;

    var reduce = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection || {};
    var slow = !!conn.saveData ||
      (typeof conn.effectiveType === 'string' && /2g/.test(conn.effectiveType));

    if (reduce || slow) return; // on reste sur l'image de repli

    var source = document.createElement('source');
    source.src = video.getAttribute('data-src');
    source.type = 'video/mp4';
    video.appendChild(source);
    video.load();
    var p = video.play();
    if (p && typeof p.catch === 'function') p.catch(function () {}); // autoplay refusé : poster affiché
  })();

  /* ── Année du footer ─────────────────────────────────── */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ── Réservation (3 étapes) ──────────────────────────── */
  var bForm = document.getElementById('booking-form');
  var bRecap = document.getElementById('booking-recap');
  var bDone = document.getElementById('booking-done');
  var bHint = document.getElementById('b-hint');
  var bSubmit = document.getElementById('b-submit');

  function bookingComplete() {
    return ['b-from', 'b-to', 'b-date', 'b-time'].every(function (id) {
      return document.getElementById(id).value.trim() !== '';
    });
  }

  function updateHint() {
    var ok = bookingComplete();
    bSubmit.style.opacity = ok ? '1' : '0.45';
    bHint.textContent = ok
      ? 'Aucun paiement à cette étape : le prix est confirmé par le chauffeur avant l’acompte.'
      : 'Renseignez le départ, la destination, la date et l’heure pour continuer.';
  }

  function frDate(v) {
    if (!v) return 'à préciser';
    var p = v.split('-');
    return p.length === 3 ? p[2] + '/' + p[1] + '/' + p[0] : v;
  }

  function showBookingStep(step) {
    bForm.classList.toggle('hidden', step !== 'form');
    bRecap.classList.toggle('hidden', step !== 'recap');
    bDone.classList.toggle('hidden', step !== 'done');
  }

  if (bForm) {
    ['b-from', 'b-to', 'b-date', 'b-time'].forEach(function (id) {
      document.getElementById(id).addEventListener('input', updateHint);
    });
    updateHint();

    bForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!bookingComplete()) { updateHint(); return; }
      var from = document.getElementById('b-from').value.trim();
      var to = document.getElementById('b-to').value.trim();
      var pax = document.getElementById('b-pax').value;
      var note = document.getElementById('b-note').value.trim();
      document.getElementById('r-type').textContent = document.getElementById('b-type').value;
      document.getElementById('r-route').textContent = from + ' → ' + to;
      document.getElementById('r-when').textContent =
        frDate(document.getElementById('b-date').value) + ' à ' +
        (document.getElementById('b-time').value || 'heure à préciser');
      document.getElementById('r-pax').textContent = pax + (pax === '1' ? ' passager' : ' passagers');
      document.getElementById('r-note').textContent = note || 'Aucune';
      showBookingStep('recap');
    });

    document.getElementById('b-confirm').addEventListener('click', function () {
      document.getElementById('b-ref').textContent = 'PD-' + String(1000 + Math.floor(Math.random() * 8999));
      showBookingStep('done');
    });

    Array.prototype.slice.call(document.querySelectorAll('[data-booking-back]')).forEach(function (btn) {
      btn.addEventListener('click', function () { showBookingStep('form'); });
    });
  }

  /* ── Contact ─────────────────────────────────────────── */
  var cForm = document.getElementById('contact-form');
  var cDone = document.getElementById('contact-done');
  if (cForm) {
    cForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!cForm.checkValidity()) { cForm.reportValidity(); return; }
      cForm.classList.add('hidden');
      cDone.classList.remove('hidden');
    });
    document.getElementById('contact-reset').addEventListener('click', function () {
      cForm.reset();
      cDone.classList.add('hidden');
      cForm.classList.remove('hidden');
    });
  }

  /* ── Modale légale ───────────────────────────────────── */
  var legalDocs = {
    mentions: {
      title: 'Mentions légales',
      blocks: [
        { title: 'Éditeur du site', body: 'Parisian Driver, SASU au capital de [montant] €, siège social [adresse], Île-de-France. Représentant légal : [nom du dirigeant]. SIRET : [à compléter]. RCS : [à compléter]. Téléphone : 06 95 50 59 01.' },
        { title: 'Activité réglementée', body: 'Exploitant de véhicule de transport avec chauffeur (VTC) inscrit au registre national des exploitants VTC. Attestation d’assurance RC professionnelle : [assureur, n° de police].' },
        { title: 'Hébergement', body: 'Site hébergé par [hébergeur], [adresse], [téléphone]. Nom de domaine parisiandriver.fr.' },
        { title: 'Données personnelles', body: 'Les informations transmises via les formulaires de réservation et de contact servent uniquement à traiter la demande de course. Aucune donnée n’est cédée à un tiers hors prestataires techniques (réservation, paiement). Droit d’accès, de rectification et de suppression sur simple demande à contact@parisiandriver.fr.' },
        { title: 'Propriété intellectuelle', body: 'Textes, photographies et identité visuelle sont la propriété de Parisian Driver. Toute reproduction sans accord écrit est interdite.' }
      ]
    },
    cgv: {
      title: 'CGV & politique d’annulation',
      blocks: [
        { title: 'Objet', body: 'Les présentes conditions régissent les prestations de transport de personnes avec chauffeur assurées par Parisian Driver (SASU, SIRET [à compléter]) pour toute réservation effectuée via le site, par téléphone au 06 95 50 59 01 ou par WhatsApp.' },
        { title: 'Réservation et délai minimum', body: 'Toute réservation doit être effectuée au minimum 2 heures à l’avance du jeudi au dimanche, et 24 heures à l’avance du lundi au mercredi. La réservation devient ferme après confirmation explicite du chauffeur.' },
        { title: 'Prix et acompte', body: 'Le prix est communiqué avant confirmation et reste ferme, sauf modification du trajet demandée par le client. Un acompte de 20 % est demandé à la réservation en ligne ; le solde est réglé à l’issue de la course. Le client peut également réserver sans acompte en contactant directement le chauffeur. Grille tarifaire et suppléments (nuit, jours fériés, bagages, animaux, attente) : [à compléter].' },
        { title: 'Annulation et remboursement', body: 'Annulation plus de 24 heures avant la prise en charge : remboursement intégral de l’acompte. Annulation à moins de 24 heures : abattement de 20 % appliqué sur la somme versée. En cas d’empêchement du chauffeur, la totalité des sommes versées est remboursée ; l’engagement de zéro annulation vaut engagement contractuel.' },
        { title: 'Attente et retard', body: 'Une attente de 45 minutes est incluse pour les transferts aéroport (15 minutes pour les gares et adresses privées). Au-delà, l’attente est facturée selon le tarif horaire en vigueur.' },
        { title: 'Comportement à bord', body: 'Le transport d’animaux, de bagages volumineux ou l’installation d’un siège enfant se demandent à la réservation. Il est interdit de fumer à bord. Le chauffeur peut refuser une prise en charge en cas de comportement dangereux ou de nombre de passagers supérieur à celui déclaré.' },
        { title: 'Paiement', body: 'Paiement en ligne via [prestataire Time], ou par carte à bord. Facture transmise par email après chaque course.' },
        { title: 'Réclamations', body: 'Toute réclamation peut être adressée à contact@parisiandriver.fr dans un délai de 15 jours après la course. Droit applicable : droit français.' }
      ]
    }
  };

  var overlay = document.getElementById('legal-overlay');
  var legalTitle = document.getElementById('legal-title');
  var legalBody = document.getElementById('legal-body');

  function openLegal(key) {
    var doc = legalDocs[key];
    if (!doc) return;
    legalTitle.textContent = doc.title;
    legalBody.innerHTML = '';
    doc.blocks.forEach(function (b) {
      var wrap = document.createElement('div');
      wrap.className = 'legal-block';
      var h = document.createElement('h3');
      h.textContent = b.title;
      var p = document.createElement('p');
      p.textContent = b.body;
      wrap.appendChild(h);
      wrap.appendChild(p);
      legalBody.appendChild(wrap);
    });
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeLegal() {
    overlay.classList.add('hidden');
    document.body.style.overflow = '';
  }

  document.addEventListener('click', function (e) {
    var opener = e.target.closest('[data-legal]');
    if (opener) { openLegal(opener.getAttribute('data-legal')); return; }
    if (e.target === overlay || e.target.closest('#legal-close') || e.target.closest('#legal-back')) {
      closeLegal();
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !overlay.classList.contains('hidden')) closeLegal();
  });
})();
