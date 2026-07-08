/**
 * pdp.js — Product Detail Page shared behaviours
 * 1. Scrollspy: highlights the active subnav link as the user scrolls
 * 2. Subnav clicks use replaceState (no new history entry) so back button
 *    always leaves the product page entirely, returning to the products list
 */

(function () {
  'use strict';

  /* ── 1. SCROLLSPY + SECTION CLICKS (no history push) ─────────────────── */
  var subnav = document.querySelector('.pdp-subnav');
  if (subnav) {
    var links = Array.from(subnav.querySelectorAll('a[href^="#"]'));
    var sections = links.map(function (a) {
      return document.querySelector(a.getAttribute('href'));
    }).filter(Boolean);

    // Height of main nav (72px) + subnav itself (~50px) + small buffer
    var OFFSET = 130;

    function setActive(id) {
      links.forEach(function (a) {
        a.classList.toggle('active', a.getAttribute('href') === '#' + id);
      });
    }

    // Intercept subnav clicks: scroll manually + replaceState instead of
    // the default anchor behaviour (which pushes a new history entry).
    links.forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var target = document.querySelector(a.getAttribute('href'));
        if (!target) return;
        var top = target.getBoundingClientRect().top + window.scrollY - OFFSET + 1;
        window.scrollTo({ top: top, behavior: 'smooth' });
        // replaceState: update the URL hash without adding to history
        try { history.replaceState(null, '', a.getAttribute('href')); } catch (_) {}
      });
    });

    // IntersectionObserver: highlight the link for the section in view
    var observer = new IntersectionObserver(function (entries) {
      var visible = entries
        .filter(function (e) { return e.isIntersecting; })
        .sort(function (a, b) { return a.boundingClientRect.top - b.boundingClientRect.top; });
      if (visible.length) setActive(visible[0].target.id);
    }, {
      rootMargin: '-' + OFFSET + 'px 0px -55% 0px',
      threshold: 0
    });

    sections.forEach(function (s) { observer.observe(s); });

    // Scroll fallback: pick the section whose top has passed the offset line
    window.addEventListener('scroll', function () {
      var current = sections[0];
      sections.forEach(function (s) {
        if (s.getBoundingClientRect().top <= OFFSET + 10) current = s;
      });
      if (current) setActive(current.id);
    }, { passive: true });

    // Initial active state
    if (sections[0]) setActive(sections[0].id);
  }

})();
