

/* ── DARK MODE ── */
function toggleTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
}
(function() {
  const saved = localStorage.getItem('theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', saved);
})();

/* ── PHOTO: profile.jpg in root folder ── */


/* ── CURSOR ── */
const cur = document.getElementById('cur');
const ring = document.getElementById('cur-ring');
let mx=0, my=0, rx=0, ry=0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cur.style.left = mx+'px'; cur.style.top = my+'px';
});

;(function loop(){
  rx += (mx-rx)*.11; ry += (my-ry)*.11;
  ring.style.left = rx+'px'; ring.style.top = ry+'px';
  requestAnimationFrame(loop);
})();

document.querySelectorAll('a, button, .tag, .r-tag').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('on-link'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('on-link'));
});

/* ── COLOUR-SHIFT CURSOR ON PROJECT CARDS ── */
document.querySelectorAll('.proj-card').forEach(card => {
  const accent = getComputedStyle(card).getPropertyValue('--card-accent').trim();
  card.addEventListener('mouseenter', () => {
    cur.style.background = accent;
    ring.style.borderColor = accent;
  });
  card.addEventListener('mouseleave', () => {
    cur.style.background = 'var(--teal)';
    ring.style.borderColor = 'var(--teal)';
  });
});

/* ── MAGNETIC BUTTONS ── */
document.querySelectorAll('.mag').forEach(wrap => {
  const btn = wrap.querySelector('.btn');
  wrap.addEventListener('mousemove', e => {
    const r = wrap.getBoundingClientRect();
    const x = e.clientX - r.left - r.width/2;
    const y = e.clientY - r.top  - r.height/2;
    btn.style.transform = `translate(${x*.28}px,${y*.38}px)`;
  });
  wrap.addEventListener('mouseleave', () => { btn.style.transform = ''; });
});

/* ── NAV SCROLL SHADOW ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

/* ── SCROLL REVEAL ── */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    Array.from(e.target.children).forEach((c,i) => {
      c.style.transitionDelay = `${i*.055}s`;
    });
    io.unobserve(e.target);
  });
}, { threshold: 0.07 });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));


/* ── CASE STUDY TOGGLES ── */
function toggleCase(btn) {
  const body = btn.nextElementSibling;
  const isOpen = body.classList.contains('open');
  btn.classList.toggle('open', !isOpen);
  body.classList.toggle('open', !isOpen);
}

/* ── PROGRESS BAR ANIMATION ── */
const barObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.build-bar-fill').forEach(bar => {
        bar.classList.add('animated');
      });
      barObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.build-card.main').forEach(el => barObserver.observe(el));

/* ── GITHUB REPO COUNT FETCH ── */
fetch('https://api.github.com/users/fredopoku')
  .then(r => r.json())
  .then(data => {
    if (data.public_repos !== undefined) {
      const el = document.getElementById('repo-count');
      if (el) el.textContent = data.public_repos;
    }
  })
  .catch(() => {});

/* ── COUNT-UP ANIMATION ── */
function countUp(el, target, duration) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { el.textContent = target; clearInterval(timer); return; }
    el.textContent = Math.floor(start);
  }, 16);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.gh-stat-n').forEach(el => {
        const n = parseInt(el.textContent);
        if (!isNaN(n) && n > 1) countUp(el, n, 900);
      });
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.gh-panel').forEach(el => counterObserver.observe(el));

/* ── SKILL TAG RIPPLE ── */
document.querySelectorAll('.tag').forEach(tag => {
  tag.addEventListener('click', function(e) {
    const r = this.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position:absolute;width:6px;height:6px;background:var(--teal);
      border-radius:50%;pointer-events:none;
      left:${e.clientX-r.left-3}px;top:${e.clientY-r.top-3}px;
      animation:ripple .5s ease forwards;
    `;
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);
  });
});

const styleEl = document.createElement('style');
styleEl.textContent = `@keyframes ripple{to{transform:scale(18);opacity:0}}`;
document.head.appendChild(styleEl);

/* ── MOBILE NAV DRAWER ── */
function toggleMobileNav() {
  const open = document.body.classList.toggle('nav-open');
  const btn = document.getElementById('nav-hamburger');
  const drawer = document.getElementById('mobile-nav-drawer');
  if (btn) btn.setAttribute('aria-expanded', String(open));
  if (drawer) drawer.setAttribute('aria-hidden', String(!open));
}
function closeMobileNav() {
  document.body.classList.remove('nav-open');
  const btn = document.getElementById('nav-hamburger');
  const drawer = document.getElementById('mobile-nav-drawer');
  if (btn) btn.setAttribute('aria-expanded', 'false');
  if (drawer) drawer.setAttribute('aria-hidden', 'true');
}
// Close on outside tap
document.addEventListener('click', function(e) {
  if (!document.body.classList.contains('nav-open')) return;
  const drawer = document.getElementById('mobile-nav-drawer');
  const btn = document.getElementById('nav-hamburger');
  const navbar = document.getElementById('navbar');
  if (drawer && navbar && !navbar.contains(e.target) && !drawer.contains(e.target)) {
    closeMobileNav();
  }
});
// Close on resize to desktop
window.addEventListener('resize', function() {
  if (window.innerWidth > 768) closeMobileNav();
  setMobilePagination();
  scaleDemoFrames();
});

/* ── DEMO IFRAME SCALING ── */
function scaleDemoFrames() {
  document.querySelectorAll('.demo-frame-wrap').forEach(wrap => {
    const frame = wrap.querySelector('.demo-frame');
    if (!frame) return;
    const scale = wrap.clientWidth / 1280;
    frame.style.transform = `scale(${scale})`;
    wrap.style.height = Math.round(800 * scale) + 'px';
  });
}
scaleDemoFrames();

const pageSections = Array.from(document.querySelectorAll('section[id]'));
const pageIds = pageSections.map((section) => section.id);
const pageTitles = pageSections.map((section) => {
  const title = section.querySelector('.sec-title');
  return title ? title.textContent.trim() : section.id;
});
const prevBtn = document.getElementById('page-prev');
const nextBtn = document.getElementById('page-next');
const pageLabel = document.getElementById('page-label');
let currentPageIndex = 0;

function setMobilePagination() {
  const pageControls = document.getElementById('page-controls');
  const isMobile = window.innerWidth <= 768;
  document.body.classList.toggle('mobile-paged', isMobile);
  pageSections.forEach((section, index) => {
    section.classList.toggle('page-section', isMobile);
    section.classList.toggle('active', !isMobile ? true : index === currentPageIndex);
  });
  if (!isMobile) {
    pageControls?.classList.remove('visible');
  }
}

function showPage(index) {
  currentPageIndex = Math.max(0, Math.min(index, pageSections.length - 1));
  pageSections.forEach((section, sectionIndex) => {
    section.classList.toggle('active', sectionIndex === currentPageIndex);
  });
  if (pageLabel) pageLabel.textContent = pageTitles[currentPageIndex] || pageIds[currentPageIndex];
  if (prevBtn) prevBtn.disabled = currentPageIndex === 0;
  if (nextBtn) nextBtn.disabled = currentPageIndex === pageSections.length - 1;
  window.scrollTo({ top: 0, behavior: 'auto' });
}

function updatePageFromHash() {
  if (window.innerWidth > 768) return;
  const hash = window.location.hash.slice(1);
  const targetIndex = pageIds.indexOf(hash);
  if (targetIndex !== -1) {
    showPage(targetIndex);
  }
}

prevBtn?.addEventListener('click', () => showPage(currentPageIndex - 1));
nextBtn?.addEventListener('click', () => showPage(currentPageIndex + 1));

window.addEventListener('hashchange', updatePageFromHash);

document.querySelectorAll('#mobile-nav-drawer a, .nav-links a').forEach((link) => {
  link.addEventListener('click', (event) => {
    if (window.innerWidth <= 768) {
      const href = link.getAttribute('href');
      if (!href?.startsWith('#')) return;
      const id = href.slice(1);
      const targetIndex = pageIds.indexOf(id);
      if (targetIndex !== -1) {
        event.preventDefault();
        showPage(targetIndex);
        closeMobileNav();
      }
    }
  });
});

setMobilePagination();
if (window.innerWidth <= 768) updatePageFromHash();
