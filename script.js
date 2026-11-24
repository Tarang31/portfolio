/* ════════════════════════════════════════════
   TARANG RANIPA PORTFOLIO — script.js
════════════════════════════════════════════ */

/* ── 1. THEME TOGGLE (default = dark) ── */
const themeBtn  = document.getElementById('themeBtn');
const themeIcon = document.getElementById('themeIcon');

(function initTheme() {
  const saved = localStorage.getItem('tr-theme');
  if (saved === 'light') {
    document.body.classList.add('light');
    themeIcon.className = 'bi bi-moon-fill';
  }
  // default is dark — no class needed
})();

themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('light');
  const isLight = document.body.classList.contains('light');
  themeIcon.className = isLight ? 'bi bi-moon-fill' : 'bi bi-sun-fill';
  localStorage.setItem('tr-theme', isLight ? 'light' : 'dark');
});


/* ── 2. MOBILE MENU ── */
const menuBtn = document.getElementById('menuBtn');
const mobMenu = document.getElementById('mobMenu');
const hamIcon = document.getElementById('hamIcon');

menuBtn.addEventListener('click', () => {
  const open = mobMenu.classList.toggle('open');
  hamIcon.className = open ? 'bi bi-x-lg' : 'bi bi-list';
});

document.querySelectorAll('.mob-link').forEach(l => {
  l.addEventListener('click', () => {
    mobMenu.classList.remove('open');
    hamIcon.className = 'bi bi-list';
  });
});


/* ── 3. NAVBAR SCROLL + ACTIVE LINK ── */
const nav      = document.getElementById('mainNav');
const sections = document.querySelectorAll('section[id]');
const nmLinks  = document.querySelectorAll('.nm');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);

  let cur = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 140) cur = s.id;
  });
  nmLinks.forEach(l => {
    l.classList.remove('active');
    if (l.getAttribute('href') === '#' + cur) l.classList.add('active');
  });
}, { passive: true });


/* ── 4. SCROLL REVEAL ── */
const revEls = document.querySelectorAll('[data-reveal]');
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      setTimeout(
        () => e.target.classList.add('revealed'),
        parseInt(e.target.dataset.delay) || 0
      );
      revObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
revEls.forEach(el => revObs.observe(el));


/* ── 5. TYPED TEXT ── */
const typedEl = document.getElementById('typedEl');
if (typedEl) {
  const roles = [
    'B.Tech Computer Engineering Student 🎓',
    'Web Developer — HTML, CSS & JS 💻',
    'Problem Solver & Algorithm Enthusiast 🧠',
    'Java & Python Developer ⚡',
    'Open Source Learner & Builder 🚀',
  ];
  let ri = 0, ci = 0, del = false;

  function tick() {
    const cur = roles[ri];
    if (!del) {
      typedEl.textContent = cur.substring(0, ci + 1);
      ci++;
      if (ci === cur.length) { del = true; setTimeout(tick, 1800); return; }
    } else {
      typedEl.textContent = cur.substring(0, ci - 1);
      ci--;
      if (ci === 0) {
        del = false;
        ri = (ri + 1) % roles.length;
        setTimeout(tick, 400);
        return;
      }
    }
    setTimeout(tick, del ? 25 : 55);
  }
  tick();
}


/* ── 6. SKILLS TABS ── */
const stabs     = document.querySelectorAll('.stab');
const tabPanels = document.querySelectorAll('.tab-panel');

stabs.forEach(btn => {
  btn.addEventListener('click', () => {
    stabs.forEach(b => b.classList.remove('active'));
    tabPanels.forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const target = document.getElementById('tab-' + btn.dataset.tab);
    if (target) {
      target.classList.add('active');
      // Trigger bar animations
      target.querySelectorAll('.ss-fill').forEach(bar => {
        const w = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => { bar.style.width = w; }, 50);
      });
    }
  });
});

// Animate bars on first view
const barsObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.ss-fill').forEach(bar => {
        const w = bar.getAttribute('style').match(/width:(\d+%)/)?.[1] || '0%';
        bar.style.width = '0';
        setTimeout(() => { bar.style.width = w; }, 100);
      });
      barsObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
const softPanel = document.getElementById('tab-soft');
if (softPanel) barsObs.observe(softPanel);


/* ── 7. CONTACT FORM VALIDATION ── */
const form   = document.getElementById('contactForm');
const fOK    = document.getElementById('fSuccess');
const fFail  = document.getElementById('fError');
const EM_RE  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function vField(id, errId, fn) {
  const el  = document.getElementById(id);
  const err = document.getElementById(errId);
  const ok  = fn(el.value.trim());
  el.classList.toggle('ferr', !ok);
  el.classList.toggle('fok',   ok);
  err.classList.toggle('show', !ok);
  return ok;
}

form.addEventListener('submit', e => {
  e.preventDefault();
  fOK.classList.add('hidden');
  fFail.classList.add('hidden');

  const a = vField('fname',    'fnameErr',    v => v.length > 0);
  const b = vField('femail',   'femailErr',   v => EM_RE.test(v));
  const c = vField('fsubject', 'fsubjectErr', v => v.length > 0);
  const d = vField('fmessage', 'fmessageErr', v => v.length > 0);

  if (a && b && c && d) {
    fOK.classList.remove('hidden');
    form.reset();
    ['fname','femail','fsubject','fmessage'].forEach(id => {
      const el = document.getElementById(id);
      el.classList.remove('fok','ferr');
    });
    document.querySelectorAll('.cf-err').forEach(el => el.classList.remove('show'));
  } else {
    fFail.classList.remove('hidden');
  }
});

// Live clear on input
['fname','femail','fsubject','fmessage'].forEach(id => {
  document.getElementById(id).addEventListener('input', function () {
    if (this.value.trim()) {
      this.classList.remove('ferr');
      this.classList.add('fok');
      const e = document.getElementById(id + 'Err');
      if (e) e.classList.remove('show');
    }
  });
});
