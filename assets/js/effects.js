// Shared site interaction effects: scroll-reveal, sticky-nav shrink, stat count-up.
// Safe no-ops on pages that don't have the relevant elements.
(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    // ── Scroll-reveal ──────────────────────────────────────────────
    var els = document.querySelectorAll('.reveal-up');
    if (els.length) {
      if (!('IntersectionObserver' in window)) {
        els.forEach(function (el) { el.classList.add('is-visible'); });
      } else {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              io.unobserve(entry.target);
            }
          });
        }, { threshold: 0.2, rootMargin: '0px 0px -60px 0px' });
        els.forEach(function (el) { io.observe(el); });
      }
    }

    // ── Sticky nav: shrink + shadow after scrolling past the hero ──
    var nav = document.querySelector('.nav');
    if (nav) {
      var onScroll = function () {
        nav.classList.toggle('is-scrolled', window.scrollY > 40);
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    // ── Stats strip: count up when scrolled into view ──────────────
    var nums = document.querySelectorAll('.stat-number[data-count-to]');
    if (nums.length) {
      var animate = function (el) {
        var target = parseFloat(el.getAttribute('data-count-to'));
        var suffix = el.getAttribute('data-suffix') || '';
        var duration = 1200, start = null;
        function step(ts) {
          if (start === null) start = ts;
          var progress = Math.min((ts - start) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      };
      if (!('IntersectionObserver' in window)) {
        nums.forEach(animate);
      } else {
        var io2 = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              animate(entry.target);
              io2.unobserve(entry.target);
            }
          });
        }, { threshold: 0.5 });
        nums.forEach(function (el) { io2.observe(el); });
      }
    }
    // ── Inline video modal (data-yt-id elements open a lightbox instead of navigating) ──
    var vm = document.getElementById('videoModal');
    if (vm) {
      var vmFrame = document.getElementById('videoModalIframe');
      var openVideoModal = function (id) {
        vmFrame.src = 'https://www.youtube.com/embed/' + id + '?autoplay=1&rel=0';
        vm.classList.add('is-open');
        vm.setAttribute('aria-hidden', 'false');
      };
      var closeVideoModal = function () {
        vm.classList.remove('is-open');
        vm.setAttribute('aria-hidden', 'true');
        vmFrame.src = '';
      };
      document.querySelectorAll('[data-yt-id]').forEach(function (el) {
        el.addEventListener('click', function (e) {
          e.preventDefault();
          openVideoModal(el.getAttribute('data-yt-id'));
        });
      });
      vm.querySelectorAll('.video-modal-backdrop, .video-modal-close').forEach(function (el) {
        el.addEventListener('click', closeVideoModal);
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeVideoModal();
      });
    }
  });
})();
