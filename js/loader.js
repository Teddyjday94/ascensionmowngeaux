(() => {
  const loader = document.querySelector('[data-amng-loader]');
  if (!loader) {
    document.documentElement.classList.remove('amng-loading');
    return;
  }

  const SESSION_KEY = 'amng-loader-seen-v3';
  const bar = loader.querySelector('[data-loader-bar]');
  const percent = loader.querySelector('[data-loader-percent]');
  const status = loader.querySelector('[data-loader-status]');
  const loaderVideo = loader.querySelector('[data-loader-video]');

  try {
    if (sessionStorage.getItem(SESSION_KEY) === '1') {
      loader.remove();
      document.documentElement.classList.remove('amng-loading');
      return;
    }
  } catch (error) {
    // Session storage can be unavailable in strict privacy modes. The loader still works.
  }

  // Reinforce muted inline playback before play() for Safari and iPadOS.
  if (loaderVideo) {
    loaderVideo.muted = true;
    loaderVideo.defaultMuted = true;
    loaderVideo.playsInline = true;

    const playAttempt = loaderVideo.play();
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
