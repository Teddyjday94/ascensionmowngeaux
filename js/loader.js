(() => {
  const loader = document.querySelector('[data-amng-loader]');
  if (!loader) {
    document.documentElement.classList.remove('amng-loading');
    return;
  }

  const SESSION_KEY = 'amng-loader-seen-v2';
  const bar = loader.querySelector('[data-loader-bar]');
  const percent = loader.querySelector('[data-loader-percent]');
  const status = loader.querySelector('[data-loader-status]');

  try {
    if (sessionStorage.getItem(SESSION_KEY) === '1') {
      loader.remove();
      document.documentElement.classList.remove('amng-loading');
      return;
    }
  } catch (error) {
    // Session storage can be unavailable in strict privacy modes. The loader still works.
  }

  // Use a native, same-origin MP4 instead of a third-party iframe. This keeps
  // autoplay reliable on Safari/iPadOS and avoids embed/privacy blocking.
  const videoWrap = loader.querySelector('.amng-loader__video');
  if (videoWrap) {
    const nativeVideo = document.createElement('video');
    nativeVideo.className = 'amng-loader__media';
    nativeVideo.autoplay = true;
    nativeVideo.muted = true;
    nativeVideo.defaultMuted = true;
    nativeVideo.loop = true;
    nativeVideo.playsInline = true;
    nativeVideo.preload = 'auto';
    nativeVideo.poster = 'media/hero-mowing-poster.jpg';
    nativeVideo.setAttribute('autoplay', '');
    nativeVideo.setAttribute('muted', '');
    nativeVideo.setAttribute('loop', '');
    nativeVideo.setAttribute('playsinline', '');
    nativeVideo.setAttribute('aria-hidden', 'true');

    const source = document.createElement('source');
    source.src = 'media/hero-mowing.mp4';
    source.type = 'video/mp4';
    nativeVideo.appendChild(source);

    nativeVideo.addEventListener('canplay', () => {
      videoWrap.classList.add('has-video');
    }, { once: true });

    videoWrap.replaceChildren(nativeVideo);
    const playAttempt = nativeVideo.play();
    if (playAttempt && typeof playAttempt.catch === 'function') {
      playAttempt.catch(() => {
        // The poster remains visible if a browser refuses autoplay.
      });
    }
  }

  let progress = 0;
  let finishing = false;
  let pageReady = document.readyState === 'complete';
  const started = performance.now();
  const minimumVisibleMs = 1900;
  const hardStopMs = 6000;

  const paint = (value) => {
    progress = Math.max(progress, Math.min(100, Math.round(value)));
    if (bar) bar.style.width = `${progress}%`;
    if (percent) percent.textContent = `${progress}%`;
  };

  const completeProgress = () => {
    let value = progress;
    const finalTimer = window.setInterval(() => {
      value = Math.min(100, value + Math.max(2, Math.ceil((100 - value) * 0.28)));
      paint(value);

      if (value >= 100) {
        window.clearInterval(finalTimer);
        loader.classList.add('is-complete');

        try {
          sessionStorage.setItem(SESSION_KEY, '1');
        } catch (error) {
          // No-op when storage is unavailable.
        }

        window.setTimeout(() => {
          loader.classList.add('is-hidden');
          document.documentElement.classList.remove('amng-loading');
        }, 720);

        window.setTimeout(() => loader.remove(), 1500);
      }
    }, 34);
  };

  const finish = () => {
    if (finishing) return;
    finishing = true;
    if (status) status.textContent = 'Ready to geaux.';
    const elapsed = performance.now() - started;
    window.setTimeout(completeProgress, Math.max(0, minimumVisibleMs - elapsed));
  };

  const fakeProgress = window.setInterval(() => {
    if (finishing) {
      window.clearInterval(fakeProgress);
      return;
    }

    const ceiling = pageReady ? 94 : 86;
    const step = progress < 40 ? 4 : progress < 70 ? 2 : 1;
    paint(Math.min(ceiling, progress + step));
  }, 90);

  window.addEventListener('load', () => {
    pageReady = true;
    finish();
  }, { once: true });

  window.setTimeout(() => {
    pageReady = true;
    finish();
  }, hardStopMs);

  paint(0);
})();
