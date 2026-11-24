/* Portfolio — language switch, scroll-spy, LinkedIn bridge. No third-party code. */
(function () {
  'use strict';
  var LANGS = ['fr', 'en', 'es'];
  var params;
  try { params = new URLSearchParams(location.search); } catch (e) { params = { get: function () { return null; } }; }

  /* ---- language ---- */
  var btns = document.querySelectorAll('.lang button');
  var titles = {
    fr: 'Marlon Alexander Murillo Medina — Gestionnaire de projets TI et d’infrastructure',
    en: 'Marlon Alexander Murillo Medina — IT Project & Infrastructure Manager',
    es: 'Marlon Alexander Murillo Medina — Gerente de proyectos TI e infraestructura'
  };
  function setLang(l, store) {
    if (LANGS.indexOf(l) < 0) l = 'fr';
    document.documentElement.lang = l;
    document.title = titles[l];
    btns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-set') === l)); });
    if (store) { try { localStorage.setItem('lang', l); } catch (e) {} }
  }
  btns.forEach(function (b) { b.addEventListener('click', function () { setLang(b.getAttribute('data-set'), true); }); });
  var saved = null;
  try { saved = localStorage.getItem('lang'); } catch (e) {}
  var nav = (navigator.language || 'fr').slice(0, 2).toLowerCase();
  setLang([params.get('lang'), saved, nav].filter(function (x) { return LANGS.indexOf(x) >= 0; })[0] || 'fr', false);

  /* ---- scroll-spy for the top navigation ---- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav a'));
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) { a.setAttribute('aria-current', String(a.getAttribute('href') === '#' + en.target.id)); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(function (a) { var s = document.querySelector(a.getAttribute('href')); if (s) io.observe(s); });
  }

  /* ---- LinkedIn bridge: welcome visitors who come from the profile ---- */
  var fromLinkedIn = params.get('src') === 'linkedin';
  try { fromLinkedIn = fromLinkedIn || /(^|\.)(linkedin\.com|lnkd\.in)$/.test(new URL(document.referrer).hostname); } catch (e) {}
  var welcome = document.getElementById('welcome');
  if (welcome && fromLinkedIn) {
    var dismissed = false;
    try { dismissed = sessionStorage.getItem('welcome-off') === '1'; } catch (e) {}
    if (!dismissed) welcome.classList.add('on');
    welcome.querySelector('button').addEventListener('click', function () {
      welcome.classList.remove('on');
      try { sessionStorage.setItem('welcome-off', '1'); } catch (e) {}
    });
  }

  /* ---- copy a deep link to one achievement ---- */
  document.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('[data-copy]') : null;
    if (!b) return;
    var url = location.origin + location.pathname + '?lang=' + document.documentElement.lang + '#' + b.getAttribute('data-copy');
    var ok = function () {
      b.classList.add('done');
      setTimeout(function () { b.classList.remove('done'); }, 1800);
    };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(url).then(ok, function () {});
  });
})();
