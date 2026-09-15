// Ascension Mow N' Geaux - shared interaction behavior

(function primeSharedSiteBehavior() {
  var activeScript = document.currentScript;
  var siteRoot = activeScript && activeScript.src
    ? new URL('../', activeScript.src)
    : new URL('./', window.location.href);

  window.__amgSiteRoot = siteRoot;

  // `overflow-x: hidden` on body creates a scrolling box in some browsers and
  // breaks the sticky header. `clip` prevents horizontal spill without doing so.
  if (document.body) document.body.style.overflowX = 'clip';

  var existingFixes = document.querySelector('link[data-amg-site-fixes]');
  if (!existingFixes) {
    var fixes = document.createElement('link');
    fixes.rel = 'stylesheet';
    fixes.href = new URL('css/site-fixes.css', siteRoot).href;
    fixes.setAttribute('data-amg-site-fixes', '');
    document.head.appendChild(fixes);
  }
})();

document.addEventListener('DOMContentLoaded', function () {
  var siteRoot = window.__amgSiteRoot || new URL('./', window.location.href);
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  var backdrop = document.querySelector('.nav-backdrop');
  var dropdownParent = document.querySelector('.has-dropdown');
  var servicesToggle = document.querySelector('.services-toggle');
  var desktopQuery = window.matchMedia('(min-width: 901px)');

  var serviceTargets = {
    'Lawn Maintenance': 'lawn-maintenance',
    'Landscape Cleanup': 'landscape-cleanup',
    'Landscape Design & Build': 'design-build',
    'Herbicide Application': 'herbicide-application',
    'Dump Trailer Services': 'dump-trailer-services',
    'Sod Installation': 'sod-installation',
    'Dirt Work & Site Work': 'dirt-work-site-work',
    'Pressure Washing': 'pressure-washing',
    'Irrigation': 'irrigation'
  };

  function serviceUrl(anchor) {
    return new URL('services.html#' + anchor, siteRoot).href;
  }

  // Keep every shared dropdown in sync with the single consolidated services page.
  document.querySelectorAll('.dropdown a').forEach(function (link) {
    var label = link.textContent.trim();
    var anchor = serviceTargets[label];
    if (anchor) link.href = serviceUrl(anchor);
  });

  var servicesRootLink = document.querySelector('.services-control > a');
  if (servicesRootLink) {
    servicesRootLink.href = new URL('services.html', siteRoot).href;
  }

  // Normalize older in-page links elsewhere on the site so cards and calls-to-action
  // land on the matching section even before legacy redirect pages are involved.
  document.querySelectorAll('a[href]').forEach(function (link) {
    var rawHref = link.getAttribute('href');
    if (!rawHref || /^(?:#|mailto:|tel:|javascript:)/i.test(rawHref)) return;

    var url;
    try {
      url = new URL(rawHref, window.location.href);
    } catch (error) {
      return;
    }

    if (url.origin !== window.location.origin) return;

    var path = url.pathname.replace(/\/+$/, '');
    var hash = url.hash;

    if (path.endsWith('/services/lawn-care.html')) {
      link.href = serviceUrl(hash === '#herbicide-application' ? 'herbicide-application' : 'lawn-maintenance');
    } else if (path.endsWith('/services/landscaping.html')) {
      if (hash === '#design-build') link.href = serviceUrl('design-build');
      else if (hash === '#sod-installation') link.href = serviceUrl('sod-installation');
      else link.href = serviceUrl('landscape-cleanup');
    } else if (path.endsWith('/services/irrigation.html')) {
      link.href = serviceUrl('irrigation');
    } else if (path.endsWith('/services/dirt-work-site-work.html')) {
      link.href = serviceUrl(hash === '#dump-trailer-services' ? 'dump-trailer-services' : 'dirt-work-site-work');
    } else if (path.endsWith('/services/soft-washing-pressure-washing.html')) {
      link.href = serviceUrl('pressure-washing');
    }
  });

  function setServicesOpen(isOpen) {
    if (!dropdownParent || !servicesToggle) return;
    dropdownParent.classList.toggle('services-open', isOpen);
    servicesToggle.setAttribute('aria-expanded', String(isOpen));
    servicesToggle.setAttribute('aria-label', isOpen ? 'Hide services' : 'Show services');
  }

  function setNavOpen(isOpen, restoreFocus) {
    if (!toggle || !nav || !backdrop) return;
    nav.classList.toggle('open', isOpen);
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    backdrop.hidden = !isOpen;
    document.body.classList.toggle('nav-open', isOpen);

    if (!isOpen) {
      setServicesOpen(false);
      if (restoreFocus) toggle.focus();
    } else {
      var firstLink = nav.querySelector('a');
      if (firstLink) firstLink.focus();
    }
  }

  if (toggle && nav && backdrop) {
    toggle.addEventListener('click', function () {
      setNavOpen(!nav.classList.contains('open'));
    });

    backdrop.addEventListener('click', function () {
      setNavOpen(false, true);
    });

    nav.addEventListener('click', function (event) {
      if (event.target.closest('a') && !desktopQuery.matches) setNavOpen(false);
    });
  }

  if (dropdownParent && servicesToggle) {
    servicesToggle.addEventListener('click', function () {
      setServicesOpen(!dropdownParent.classList.contains('services-open'));
    });

    dropdownParent.addEventListener('focusout', function (event) {
      if (desktopQuery.matches && !dropdownParent.contains(event.relatedTarget)) {
        setServicesOpen(false);
      }
    });
  }

  document.addEventListener('pointerdown', function (event) {
    if (desktopQuery.matches && dropdownParent && !dropdownParent.contains(event.target)) {
      setServicesOpen(false);
    }
  });

  desktopQuery.addEventListener('change', function () {
    setNavOpen(false);
    setServicesOpen(false);
  });

  var jobberShell = document.querySelector('.jobber-embed-shell');

  if (jobberShell) {
    function labelJobberFrame() {
      var jobberFrame = jobberShell.querySelector('iframe');
      if (!jobberFrame) return false;
      jobberFrame.title = "Request a quote from Ascension Mow N' Geaux";
      jobberFrame.classList.add('jobber-quote-frame');
      jobberFrame.style.visibility = 'visible';
      return true;
    }

    if (!labelJobberFrame()) {
      var jobberObserver = new MutationObserver(function () {
        if (labelJobberFrame()) jobberObserver.disconnect();
      });
      jobberObserver.observe(jobberShell, { childList: true, subtree: true });
    }
  }

  var galleryItems = document.querySelectorAll('[data-lightbox-label]');
  var lightbox = document.querySelector('.lightbox');
  var lastGalleryTrigger = null;

  function closeLightbox() {
    if (!lightbox || !lightbox.classList.contains('open')) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    if (lastGalleryTrigger) lastGalleryTrigger.focus();
  }

  if (galleryItems.length && lightbox) {
    var lightboxInner = lightbox.querySelector('.lightbox-inner');
    var closeBtn = lightbox.querySelector('.lightbox-close');

    galleryItems.forEach(function (item) {
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');

      function openItem() {
        var image = item.querySelector('img');
        var fullSrc = item.getAttribute('data-full') || (image && image.getAttribute('src'));
        var label = item.getAttribute('data-lightbox-label') || '';
        if (!fullSrc) return;

        lightboxInner.replaceChildren();
        var lightboxImage = document.createElement('img');
        lightboxImage.src = fullSrc;
        lightboxImage.alt = label;
        lightboxInner.appendChild(lightboxImage);
        lastGalleryTrigger = item;
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
        if (closeBtn) closeBtn.focus();
      }

      item.addEventListener('click', openItem);
      item.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openItem();
        }
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (event) {
      if (event.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;
    if (lightbox && lightbox.classList.contains('open')) {
      closeLightbox();
    } else if (nav && nav.classList.contains('open')) {
      setNavOpen(false, true);
    } else {
      setServicesOpen(false);
    }
  });
});
