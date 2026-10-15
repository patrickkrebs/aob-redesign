document.documentElement.classList.add('js');

// Header turns solid once the hero has scrolled past
const header = document.querySelector('.site-header');
const hero = document.querySelector('.hero, .cs-hero');
if (header && hero && !header.classList.contains('site-header--solid')) {
  const onScroll = () => header.classList.toggle('is-solid', window.scrollY > hero.offsetHeight - 120);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

// Mobile menu
document.querySelectorAll('.menu-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const open = document.body.classList.toggle('menu-open');
    document.querySelectorAll('.menu-toggle[aria-controls]').forEach(b => { b.setAttribute('aria-expanded', open); b.textContent = open ? 'Close' : 'Menu'; });
  });
});
document.querySelectorAll('.mobile-nav a').forEach(a => a.addEventListener('click', () => { document.body.classList.remove('menu-open'); document.querySelectorAll('.menu-toggle[aria-controls]').forEach(b => { b.setAttribute('aria-expanded', false); b.textContent = 'Menu'; }); }));

// Slow reveals; anything already on screen shows at once, and a fallback shows the rest
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px' });
  reveals.forEach(el => io.observe(el));
} else {
  reveals.forEach(el => el.classList.add('is-in'));
}
setTimeout(() => reveals.forEach(el => el.classList.add('is-in')), 4000);

// Project index filters
const filters = document.querySelectorAll('.index__filters button');
filters.forEach(btn => btn.addEventListener('click', () => {
  filters.forEach(b => b.setAttribute('aria-pressed', b === btn));
  const f = btn.dataset.filter;
  document.querySelectorAll('.index__row').forEach(row => {
    row.hidden = f !== 'all' && !row.dataset.kind.split(' ').includes(f);
  });
}));

// Four-step inquiry
const form = document.querySelector('#inquiry-form');
if (form) {
  const steps = [...form.querySelectorAll('.step')];
  const marks = [...document.querySelectorAll('.steps li')];
  const back = form.querySelector('[data-back]');
  const next = form.querySelector('[data-next]');
  const count = form.querySelector('.count');
  let i = 0;
  const show = () => {
    steps.forEach((s, n) => (s.hidden = n !== i));
    marks.forEach((m, n) => { m.classList.toggle('is-active', n === i); m.classList.toggle('is-done', n < i); });
    back.hidden = i === 0;
    next.textContent = i === steps.length - 1 ? 'Send inquiry' : 'Continue';
    count.textContent = `Step ${i + 1} of ${steps.length}`;
  };
  back.addEventListener('click', () => { i = Math.max(0, i - 1); show(); });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const current = steps[i];
    const invalid = [...current.querySelectorAll('input, select, textarea')].find(el => !el.checkValidity());
    if (invalid) { invalid.reportValidity(); return; }
    if (i < steps.length - 1) { i++; show(); form.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    form.hidden = true;
    document.querySelector('.form__done').hidden = false;
  });
  show();
}

// Cursor-following preview on the project index
const preview = document.querySelector('.cursor-preview');
if (preview && matchMedia('(hover: hover)').matches) {
  const pimg = preview.querySelector('img');
  let x = 0, y = 0, px = 0, py = 0, raf;
  const loop = () => { px += (x - px) * .18; py += (y - py) * .18; preview.style.left = px + 'px'; preview.style.top = py + 'px'; raf = requestAnimationFrame(loop); };
  document.querySelectorAll('.index__row').forEach(row => {
    row.addEventListener('mouseenter', e => { pimg.src = row.dataset.img; x = px = e.clientX; y = py = e.clientY; preview.classList.add('is-on'); cancelAnimationFrame(raf); loop(); });
    row.addEventListener('mousemove', e => { x = e.clientX; y = e.clientY; });
    row.addEventListener('mouseleave', () => { preview.classList.remove('is-on'); cancelAnimationFrame(raf); });
  });
}

// The hidden detail
const toast = document.querySelector('.toast');
document.querySelectorAll('.easter').forEach(dot => dot.addEventListener('click', () => {
  if (!toast) return;
  toast.classList.add('is-on');
  setTimeout(() => toast.classList.remove('is-on'), 3600);
}));

// Studio clock, Sarasota time
const clock = document.querySelector('[data-clock]');
if (clock) {
  const tick = () => {
    const now = new Date();
    const t = now.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit' });
    const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', weekday: 'short', hour: 'numeric', hour12: false }).formatToParts(now);
    const h = +parts.find(p => p.type === 'hour').value, d = parts.find(p => p.type === 'weekday').value;
    const open = !['Sat', 'Sun'].includes(d) && h >= 9 && h < 18;
    clock.textContent = `Sarasota ${t} · Studio ${open ? 'open' : 'closed'}`;
  };
  tick(); setInterval(tick, 30000);
}
