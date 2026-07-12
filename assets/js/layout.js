/* Shared header/footer/octopus injector for sub-pages */
(function () {
  const base = document.body.dataset.base || '../';

  const header = `
  <header class="site-header" id="site-header">
    <div class="nav-wrap">
      <a href="${base}index.html" class="logo">
        <span class="logo-mark">◐</span>
        <span class="logo-text">Simple <em>Solutions</em></span>
      </a>
      <nav class="site-nav">
        <a href="${base}index.html">בית</a>
        <a href="${base}pages/campaigns.html">ניהול קמפיינים</a>
        <a href="${base}pages/social.html">ניהול סושיאל</a>
        <a href="${base}pages/automation.html">אוטומציות</a>
        <a href="${base}pages/articles.html">מאמרים</a>
        <a href="${base}pages/about.html">אודות</a>
      </nav>
      <a href="${base}pages/contact.html" class="nav-cta">
        <span>צור קשר</span>
        <svg viewBox="0 0 24 24" width="18" height="18"><path d="M14 5l7 7-7 7M21 12H3" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </a>
      <button class="mobile-toggle" id="mobile-toggle" aria-label="תפריט"><span></span><span></span><span></span></button>
    </div>
  </header>`;

  const octopus = `
  <div class="octopus-stage" id="octopus-stage" aria-hidden="true">
    <svg id="octopus" viewBox="0 0 400 520" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bodyGrad" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#ffd7c2"/><stop offset="35%" stop-color="#ff9670"/>
          <stop offset="70%" stop-color="#d94a3a"/><stop offset="100%" stop-color="#7a1a1a"/>
        </radialGradient>
        <radialGradient id="bellyGrad" cx="50%" cy="60%" r="55%">
          <stop offset="0%" stop-color="#ffe6d2"/><stop offset="100%" stop-color="#ff9670" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="eyeGrad" cx="35%" cy="35%" r="60%">
          <stop offset="0%" stop-color="#fff"/><stop offset="60%" stop-color="#f5e9dc"/><stop offset="100%" stop-color="#c8a889"/>
        </radialGradient>
        <radialGradient id="pupilGrad"><stop offset="0%" stop-color="#1a1a1a"/><stop offset="100%" stop-color="#000"/></radialGradient>
        <linearGradient id="tentacleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#d94a3a"/><stop offset="60%" stop-color="#a02a24"/><stop offset="100%" stop-color="#5a0f0f"/>
        </linearGradient>
        <filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" /><feOffset dy="4"/>
          <feComponentTransfer><feFuncA type="linear" slope="0.35"/></feComponentTransfer>
          <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <pattern id="suckers" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
          <circle cx="5" cy="5" r="1.6" fill="#3a0808" opacity="0.55"/>
          <circle cx="5" cy="5" r="0.7" fill="#ffb89a" opacity="0.35"/>
        </pattern>
      </defs>
      <g id="tentacles-back" filter="url(#softShadow)">
        <path class="tentacle" d="M170,290 Q120,360 130,430 Q140,490 100,510" stroke="url(#tentacleGrad)" stroke-width="28" stroke-linecap="round" fill="none"/>
        <path class="tentacle" d="M140,280 Q80,320 60,380 Q40,440 20,460" stroke="url(#tentacleGrad)" stroke-width="26" stroke-linecap="round" fill="none"/>
        <path class="tentacle" d="M230,290 Q280,360 270,430 Q260,490 300,510" stroke="url(#tentacleGrad)" stroke-width="28" stroke-linecap="round" fill="none"/>
        <path class="tentacle" d="M260,280 Q320,320 340,380 Q360,440 380,460" stroke="url(#tentacleGrad)" stroke-width="26" stroke-linecap="round" fill="none"/>
      </g>
      <g id="body-group">
        <ellipse cx="200" cy="200" rx="140" ry="150" fill="url(#bodyGrad)" filter="url(#softShadow)"/>
        <ellipse cx="200" cy="220" rx="100" ry="90" fill="url(#bellyGrad)" opacity="0.7"/>
        <ellipse cx="150" cy="140" rx="18" ry="12" fill="#ffb89a" opacity="0.5"/>
        <ellipse cx="250" cy="145" rx="16" ry="11" fill="#ffb89a" opacity="0.5"/>
        <circle cx="130" cy="200" r="4" fill="#7a1a1a" opacity="0.4"/>
        <circle cx="260" cy="205" r="3.5" fill="#7a1a1a" opacity="0.4"/>
        <g id="eyes">
          <ellipse cx="160" cy="195" rx="26" ry="30" fill="url(#eyeGrad)"/>
          <ellipse cx="240" cy="195" rx="26" ry="30" fill="url(#eyeGrad)"/>
          <ellipse id="pupil-left"  cx="160" cy="200" rx="10" ry="14" fill="url(#pupilGrad)"/>
          <ellipse id="pupil-right" cx="240" cy="200" rx="10" ry="14" fill="url(#pupilGrad)"/>
          <circle cx="156" cy="192" r="4" fill="#fff"/><circle cx="236" cy="192" r="4" fill="#fff"/>
          <rect id="lid-left"  x="132" y="163" width="56" height="0" fill="#a02a24" rx="26"/>
          <rect id="lid-right" x="212" y="163" width="56" height="0" fill="#a02a24" rx="26"/>
        </g>
        <path d="M180,268 Q200,282 220,268" stroke="#5a0f0f" stroke-width="3" fill="none" stroke-linecap="round"/>
      </g>
      <g id="tentacles-front" filter="url(#softShadow)">
        <path class="tentacle" d="M175,320 Q160,400 180,470 Q195,510 170,510" stroke="url(#tentacleGrad)" stroke-width="30" stroke-linecap="round" fill="none"/>
        <path class="tentacle" d="M225,320 Q240,400 220,470 Q205,510 230,510" stroke="url(#tentacleGrad)" stroke-width="30" stroke-linecap="round" fill="none"/>
        <path class="tentacle" d="M195,325 Q185,420 210,490" stroke="url(#tentacleGrad)" stroke-width="24" stroke-linecap="round" fill="none"/>
        <path class="tentacle" d="M205,325 Q215,420 190,490" stroke="url(#tentacleGrad)" stroke-width="24" stroke-linecap="round" fill="none"/>
        <path class="suckers-overlay" d="M175,320 Q160,400 180,470 Q195,510 170,510" stroke="url(#suckers)" stroke-width="18" stroke-linecap="round" fill="none" opacity="0.7"/>
        <path class="suckers-overlay" d="M225,320 Q240,400 220,470 Q205,510 230,510" stroke="url(#suckers)" stroke-width="18" stroke-linecap="round" fill="none" opacity="0.7"/>
      </g>
      <ellipse cx="165" cy="115" rx="45" ry="20" fill="#fff" opacity="0.28"/>
    </svg>
    <div class="ink-trail" id="ink-trail"></div>
  </div>`;

  const footer = `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="footer-logo">Simple <em>Solutions</em></div>
          <p>מערכת אחת. שלוש זרועות. צמיחה שמדברת במספרים.</p>
        </div>
        <div><h5>ניווט</h5>
          <a href="${base}index.html">בית</a>
          <a href="${base}pages/about.html">אודות</a>
          <a href="${base}pages/articles.html">מאמרים</a>
          <a href="${base}pages/contact.html">צור קשר</a>
        </div>
        <div><h5>שירותים</h5>
          <a href="${base}pages/campaigns.html">ניהול קמפיינים</a>
          <a href="${base}pages/social.html">ניהול סושיאל</a>
          <a href="${base}pages/automation.html">אוטומציות</a>
        </div>
        <div><h5>צור קשר</h5>
          <a href="tel:0509697776" dir="ltr">050-969-7776</a>
          <a href="mailto:simple.solutions05055@gmail.com">simple.solutions05055@gmail.com</a>
          <a href="https://wa.me/972509697776" target="_blank" rel="noopener">WhatsApp</a>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2026 Simple Solutions · כל הזכויות שמורות</span>
        <span>עוצב ונבנה בישראל</span>
      </div>
    </div>
  </footer>`;

  const progress = `<div class="scroll-progress" id="scroll-progress"></div>`;
  const cursors = `<div class="cursor" id="cursor"></div><div class="cursor-dot" id="cursor-dot"></div>`;

  document.body.insertAdjacentHTML('afterbegin', cursors + header + octopus + progress);
  document.body.insertAdjacentHTML('beforeend', footer);
})();
