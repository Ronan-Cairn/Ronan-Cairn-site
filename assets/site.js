'use strict';
// Les nouveaux bulletins s’ajoutent à la fin du document, dans l’ordre chronologique.
if (document.body.classList.contains('news')) {
  const navigation = performance.getEntriesByType('navigation')[0];
  if (!location.hash && navigation?.type !== 'back_forward') {
    let userInteracted = false;
    const cancel = () => { userInteracted = true; };
    for (const event of ['wheel', 'touchstart', 'keydown', 'pointerdown']) {
      window.addEventListener(event, cancel, { once: true, passive: true });
    }
    const alignLatest = () => {
      if (userInteracted) return;
      const latest = document.querySelector('.news-item:last-child');
      if (!latest) return;
      const bottom = latest.getBoundingClientRect().bottom + window.scrollY;
      window.scrollTo({ top: Math.max(0, bottom - window.innerHeight), behavior: 'instant' });
    };
    if (document.readyState === 'complete') alignLatest();
    else window.addEventListener('load', alignLatest, { once: true });
    document.fonts.ready.then(alignLatest);
  }
}
const progress = document.querySelector('#reading-progress');
if (progress) {
  const output = document.querySelector('.reading-rail output');
  const maxScroll = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  const update = () => {
    const value = maxScroll() ? Math.max(0, Math.min(100, window.scrollY / maxScroll() * 100)) : 0;
    progress.value = value.toFixed(1);
    const label = `${Math.round(value)}\u00a0%`;
    progress.setAttribute('aria-valuetext', label);
    output.value = label;
  };
  progress.addEventListener('input', () => {
    window.scrollTo({ top: Number(progress.value) / 100 * maxScroll(), behavior: 'instant' });
    update();
  });
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  window.addEventListener('load', update, { once: true });
  update();
}
