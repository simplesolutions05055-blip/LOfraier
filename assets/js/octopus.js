/* =========================================================
   Octopus Companion
   Follows scroll · Tentacles wave organically · Eyes track
   Alternates sides between sections · Ink puffs on stop
========================================================= */

(function () {
  const stage = document.getElementById('octopus-stage');
  const svg = document.getElementById('octopus');
  const inkTrail = document.getElementById('ink-trail');
  const pupilL = document.getElementById('pupil-left');
  const pupilR = document.getElementById('pupil-right');
  const lidL = document.getElementById('lid-left');
  const lidR = document.getElementById('lid-right');
  const bodyGroup = document.getElementById('body-group');

  if (!stage || !svg) return;

  // Store original tentacle paths so we can wobble from a stable base
  const tentacles = Array.from(svg.querySelectorAll('.tentacle'));
  const suckerOverlays = Array.from(svg.querySelectorAll('.suckers-overlay'));
  const baseAll = tentacles.concat(suckerOverlays);
  const originals = baseAll.map((t) => t.getAttribute('d'));

  /* ----- Tentacle wave animation -----
     Parse each path and gently perturb Q control points using sine waves.
  */
  function parsePath(d) {
    // Very small parser for M x,y Q cx,cy x,y ...
    const tokens = d.match(/[MQ][^MQ]+/gi) || [];
    return tokens.map((tok) => {
      const cmd = tok[0];
      const nums = tok
        .slice(1)
        .trim()
        .split(/[\s,]+/)
        .map(Number);
      return { cmd, nums };
    });
  }

  const parsed = originals.map(parsePath);

  function pathString(segs, phase, amp) {
    return segs
      .map((s, i) => {
        if (s.cmd === 'M') {
          return `M${s.nums[0]},${s.nums[1]}`;
        } else {
          // Q cx,cy x,y — wobble control point
          const wobbleX = Math.sin(phase + i * 0.9) * amp;
          const wobbleY = Math.cos(phase * 0.8 + i * 1.2) * amp * 0.6;
          const cx = s.nums[0] + wobbleX;
          const cy = s.nums[1] + wobbleY;
          const x = s.nums[2];
          const y = s.nums[3];
          return `Q${cx.toFixed(1)},${cy.toFixed(1)} ${x},${y}`;
        }
      })
      .join(' ');
  }

  let phase = 0;
  let baseAmp = 6;
  let targetAmp = 6;

  /* ----- Scroll following -----
     The octopus is fixed-position; we translate it vertically inside its
     stage so it seems to swim along the page, while its 'top' pins near
     the middle of the viewport. We also alternate left/right per section.
  */
  const sections = Array.from(document.querySelectorAll('main > section'));
  let currentSide = 'left';
  stage.classList.add(currentSide);

  let targetX = 0, currentX = 0;
  let targetY = 0, currentY = 0;
  let targetRot = 0, currentRot = 0;
  let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function updateSide() {
    const y = window.scrollY + window.innerHeight * 0.4;
    let idx = 0;
    sections.forEach((s, i) => {
      if (s.offsetTop <= y) idx = i;
    });
    const side = idx % 2 === 0 ? 'left' : 'right';
    if (side !== currentSide) {
      currentSide = side;
      stage.classList.remove('left', 'right');
      stage.classList.add(side);
      // Puff ink briefly
      if (inkTrail) {
        inkTrail.style.transition = 'none';
        inkTrail.style.opacity = '0.85';
        inkTrail.style.transform = 'translateX(-50%) scale(1)';
        requestAnimationFrame(() => {
          inkTrail.style.transition = 'opacity 1.2s ease-out, transform 1.2s ease-out';
          inkTrail.style.opacity = '0';
          inkTrail.style.transform = 'translateX(-50%) scale(2)';
        });
      }
      // Swing more energetically after switch
      targetAmp = 14;
      setTimeout(() => (targetAmp = 6), 900);
    }
  }

  /* ----- Blink loop ----- */
  function blink() {
    if (!lidL || !lidR) return;
    lidL.animate(
      [{ height: '0px' }, { height: '30px' }, { height: '0px' }],
      { duration: 260, easing: 'ease-in-out' }
    );
    lidR.animate(
      [{ height: '0px' }, { height: '30px' }, { height: '0px' }],
      { duration: 260, easing: 'ease-in-out' }
    );
    setTimeout(blink, 3200 + Math.random() * 3200);
  }
  setTimeout(blink, 2000);

  /* ----- Idle body bob ----- */
  let bobPhase = 0;

  /* ----- Main animation loop ----- */
  function animate() {
    phase += 0.06;
    bobPhase += 0.02;

    // Ease amplitude
    baseAmp += (targetAmp - baseAmp) * 0.05;

    // Update tentacle paths
    baseAll.forEach((el, i) => {
      const segs = parsed[i];
      const localPhase = phase + i * 0.6;
      el.setAttribute('d', pathString(segs, localPhase, baseAmp));
    });

    // Body bob
    const bobY = Math.sin(bobPhase) * 6;
    const bobRot = Math.sin(bobPhase * 0.7) * 2;
    if (bodyGroup) {
      bodyGroup.setAttribute(
        'transform',
        `translate(0 ${bobY.toFixed(2)}) rotate(${bobRot.toFixed(2)} 200 200)`
      );
    }

    // Eyes track cursor
    if (pupilL && pupilR) {
      const rect = stage.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 3;
      const dx = mouseX - cx;
      const dy = mouseY - cy;
      const dist = Math.hypot(dx, dy) || 1;
      const maxMove = 5;
      const mx = (dx / dist) * Math.min(maxMove, dist / 40);
      const my = (dy / dist) * Math.min(maxMove, dist / 40);
      pupilL.setAttribute('cx', 160 + mx);
      pupilL.setAttribute('cy', 200 + my);
      pupilR.setAttribute('cx', 240 + mx);
      pupilR.setAttribute('cy', 200 + my);
    }

    // Smooth Y follow — octopus stays near 25% of viewport,
    // small parallax based on scroll speed
    const scrollY = window.scrollY;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPct = docH > 0 ? scrollY / docH : 0;
    // Position within the viewport: from 22vh at top to 40vh at bottom
    const topPct = 22 + scrollPct * 18;
    stage.style.top = topPct + 'vh';

    // Face left vs right depending on side
    const targetScale = currentSide === 'left' ? 1 : -1;
    // Smooth mirror flip
    const currentScale = svg.dataset.scale ? parseFloat(svg.dataset.scale) : 1;
    const nextScale = currentScale + (targetScale - currentScale) * 0.08;
    svg.dataset.scale = nextScale.toFixed(3);
    svg.style.transform = `scaleX(${nextScale})`;

    requestAnimationFrame(animate);
  }

  window.addEventListener('scroll', updateSide, { passive: true });
  updateSide();
  animate();

  // Hide octopus on very small screens after scroll into footer
  const footer = document.querySelector('.site-footer');
  if (footer) {
    const footerObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          stage.style.opacity = e.isIntersecting ? '0' : '1';
        });
      },
      { threshold: 0.1 }
    );
    footerObs.observe(footer);
  }
})();
