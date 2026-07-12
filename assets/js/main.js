/* =========================================================
   Simple Solutions - Main interactions
   Loader, cursor, reveal on scroll, counter, header
========================================================= */

(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ----------------- Loader ----------------- */
  window.addEventListener('load', () => {
    const loader = $('#loader');
    if (!loader) return;
    setTimeout(() => loader.classList.add('hidden'), 1400);
  });

  /* ----------------- Custom Cursor ----------------- */
  const cursor = $('#cursor');
  const cursorDot = $('#cursor-dot');
  if (cursor && cursorDot && window.matchMedia('(hover: hover)').matches) {
    let mx = 0, my = 0, cx = 0, cy = 0, dx = 0, dy = 0;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
      dx = e.clientX;
      dy = e.clientY;
    });

    (function loop() {
      cx += (mx - cx) * 0.18;
      cy += (my - cy) * 0.18;
      cursor.style.transform = `translate(${cx - 20}px, ${cy - 20}px)`;
      cursorDot.style.transform = `translate(${dx - 3}px, ${dy - 3}px)`;
      requestAnimationFrame(loop);
    })();

    $$('a, button, details, .service-card, .quote-card').forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('grow'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('grow'));
    });
  }

  /* ----------------- Header on scroll ----------------- */
  const header = $('#site-header');
  const progress = $('#scroll-progress');
  const onScroll = () => {
    const y = window.scrollY;
    if (header) header.classList.toggle('scrolled', y > 40);
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (y / max) * 100 : 0;
      progress.style.width = pct + '%';
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ----------------- Reveal on scroll ----------------- */
  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in-view');
          revealObs.unobserve(e.target);
        }
      });
    },
    { rootMargin: '0px 0px -80px 0px', threshold: 0.05 }
  );
  $$('.reveal, .reveal-line').forEach((el) => revealObs.observe(el));

  /* ----------------- Number counters ----------------- */
  const countObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        const dur = 1400;
        const t0 = performance.now();
        const tick = (t) => {
          const p = Math.min((t - t0) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        countObs.unobserve(el);
      });
    },
    { threshold: 0.4 }
  );
  $$('.metric-num[data-count]').forEach((el) => countObs.observe(el));

  /* ----------------- Mobile menu ----------------- */
  const mobileToggle = $('#mobile-toggle');
  const nav = $('.site-nav');
  if (mobileToggle && nav) {
    mobileToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      mobileToggle.classList.toggle('open', open);
      if (open) {
        nav.style.display = 'flex';
        nav.style.flexDirection = 'column';
        nav.style.position = 'fixed';
        nav.style.top = '80px';
        nav.style.right = '20px';
        nav.style.left = '20px';
        nav.style.background = 'rgba(253, 245, 238, 0.98)';
        nav.style.padding = '20px';
        nav.style.borderRadius = '24px';
        nav.style.boxShadow = 'var(--shadow-2)';
        nav.style.backdropFilter = 'blur(20px)';
        nav.style.zIndex = '99';
      } else {
        nav.removeAttribute('style');
      }
    });
  }
})();
