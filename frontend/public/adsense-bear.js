// Google AdSense test ad script loader
export function loadAdsense() {
  if (window.adsbygoogleLoaded) return;
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
  script.setAttribute('data-ad-client', 'ca-pub-3940256099942544'); // Google test publisher ID
  document.head.appendChild(script);
  window.adsbygoogleLoaded = true;
}
