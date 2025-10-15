export function supportsCore(){
  try { new URL('/'); return !!(window.fetch && (window as any).ResizeObserver); }
  catch { return false; }
}
export function setVh(){ document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`); }
if (!supportsCore()){
  const s = document.createElement('script');
  s.src = 'https://cdn.polyfill.io/v3/polyfill.min.js?features=es2020,fetch,AbortController,URL,ResizeObserver,Intl.PluralRules';
  document.head.appendChild(s);
}
window.addEventListener('resize', setVh, { passive: true });
setVh();
