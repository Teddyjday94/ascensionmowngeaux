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

  var existingAnimations = document.querySelector('link[data-amg-animations]');
  if (!existingAnimations) {
    var animations = document.createElement('link');
    animations.rel = 'stylesheet';
    animations.href = new URL('css/animations.css', siteRoot).href;
    animations.setAttribute('data-amg-animations', '');
    document.head.appendChild(animations);
  }
})();

function setupMotionSystem() {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var compactViewport = window.matchMedia('(max-width: 800px)');
  var revealTargets = [];
  var registeredTargets = new Set();

  document.documentElement.classList.add('motion-ready');

  function register(element, className, index) {
    if (!element) return;
    if (className) element.classList.add(className);
    if (typeof index === 'number') {
      element.style.setProperty('--motion-index', String(index));
    }
    if (!registeredTargets.has(element)) {
      registeredTargets.add(element);
      revealTargets.push(element);
    }
  }

  function addTargets(selector, className, startIndex) {
    document.querySelectorAll(selector).forEach(function (element, index) {
      register(element, className || 'motion-reveal', (startIndex || 0) + index);
    });
  }

  function addSectionHeadMotion() {
    document.querySelectorAll('.section-head, .transformation-head').forEach(function (head) {
      var index = 0;
      head.querySelectorAll(':scope > *').forEach(function (element) {
        var className = /^H[1-3]$/.test(element.tagName) ? 'motion-heading' : 'motion-reveal';
        register(element, className, index);
        index += 1;
      });
    });
  }

  function annotateHomepageMotion() {
    if (!document.querySelector('.hero')) return;

    document.querySelectorAll('.hero-copy > *').forEach(function (element, index) {
      register(element, /^H[1-3]$/.test(element.tagName) ? 'motion-heading' : 'motion-reveal', index);
    });

    document.querySelectorAll('.hero-photo').forEach(function (element) {
      register(element, 'motion-right', 1);
      element.classList.add('motion-depth');
    });

    document.querySelectorAll('.trust-item').forEach(function (element, index) {
      register(element, 'motion-reveal', index);
    });

    document.querySelectorAll('.split-block').forEach(function (block, blockIndex) {
      var copy = block.querySelector(':scope > div:not(.split-media)');
      if (copy) register(copy, block.classList.contains('reverse') ? 'motion-right' : 'motion-left', blockIndex);

      block.querySelectorAll('.split-media .photo-placeholder').forEach(function (element, index) {
        register(element, index % 2 === 0 ? 'motion-left' : 'motion-right', index);
      });
    });

    document.querySelectorAll('.service-card').forEach(function (element, index) {
      register(element, 'motion-reveal', index);
    });

    var workVideo = document.querySelector('.work-video');
    if (workVideo) workVideo.classList.add('motion-video-depth');

    document.querySelectorAll('.work-reel-content > *').forEach(function (element, index) {
      register(element, /^H[1-3]$/.test(element.tagName) ? 'motion-heading' : 'motion-reveal', index);
    });

    document.querySelectorAll('.project-proof').forEach(function (row) {
      var image = row.querySelector('.spotlight-photo');
      var copy = row.querySelector(':scope > div:last-child');
      if (image) register(image, 'motion-mask', 0);
      if (copy) register(copy, row.classList.contains('reverse') ? 'motion-left' : 'motion-right', 1);
    });

    document.querySelectorAll('.transformation-card').forEach(function (card, cardIndex) {
      register(card, 'motion-reveal', cardIndex);
      card.querySelectorAll('.transformation-pair figure').forEach(function (figure, index) {
        figure.style.setProperty('--motion-index', String(index));
      });
    });

    document.querySelectorAll('.gallery-strip .photo-placeholder').forEach(function (element, index) {
      register(element, 'motion-reveal', index);
    });

    var finalCta = document.querySelector('.cta-band');
    if (finalCta) {
      register(finalCta, 'motion-accent-sweep', 0);
      finalCta.querySelectorAll('.container > *').forEach(function (element, index) {
        register(element, 'motion-reveal', index);
      });
    }
  }

  function annotateInteriorMotion() {
    document.querySelectorAll('.page-header-copy > *').forEach(function (element, index) {
      register(element, /^H[1-3]$/.test(element.tagName) ? 'motion-heading' : 'motion-reveal', index);
    });

    document.querySelectorAll('.page-header-media').forEach(function (element) {
      element.classList.add('motion-hero-depth');
    });

    document.querySelectorAll('.split-block').forEach(function (block, blockIndex) {
      var children = block.querySelectorAll(':scope > div');
      children.forEach(function (element, index) {
        var isMedia = element.classList.contains('split-media');
        var fromLeft = block.classList.contains('reverse') ? !isMedia : isMedia;
        register(element, fromLeft ? 'motion-left' : 'motion-right', blockIndex + index);
      });
    });

    document.querySelectorAll('.value-item').forEach(function (element, index) {
      register(element, 'motion-reveal', index);
    });

    document.querySelectorAll('.gallery-grid .photo-placeholder').forEach(function (element, index) {
      register(element, 'motion-reveal', index % 6);
    });

    document.querySelectorAll('.service-section').forEach(function (section, sectionIndex) {
      var grid = section.querySelector('.service-section-grid');
      var copy = section.querySelector('.service-copy');
      var visual = section.querySelector('.service-visual');
      var reversed = grid && grid.classList.contains('reverse');

      if (copy) register(copy, reversed ? 'motion-right' : 'motion-left', 0);
      if (visual) register(visual, reversed ? 'motion-left' : 'motion-right', 1);

      section.querySelectorAll('.service-detail').forEach(function (element, index) {
        register(element, 'motion-reveal', index);
      });

      section.querySelectorAll('.service-pill').forEach(function (element, index) {
        register(element, 'motion-reveal', index);
      });

      section.style.setProperty('--motion-section-index', String(sectionIndex));
    });

    document.querySelectorAll('.services-hero-copy > *').forEach(function (element, index) {
      register(element, /^H[1-3]$/.test(element.tagName) ? 'motion-heading' : 'motion-reveal', index);
    });

    var quoteShell = document.querySelector('.jobber-embed-shell');
    var quoteCard = document.querySelector('.quote-contact-card');
    if (quoteShell) register(quoteShell, 'motion-left', 0);
    if (quoteCard) register(quoteCard, 'motion-right', 1);

    var servicesCta = document.querySelector('.services-cta');
    if (servicesCta) {
      register(servicesCta, 'motion-accent-sweep', 0);
      servicesCta.querySelectorAll('.container > *').forEach(function (element, index) {
        register(element, 'motion-reveal', index);
      });
    }

    var pageCta = document.querySelector('.cta-band');
    if (pageCta) {
      register(pageCta, 'motion-accent-sweep', 0);
      pageCta.querySelectorAll('.container > *').forEach(function (element, index) {
        register(element, 'motion-reveal', index);
      });
    }
  }

  addSectionHeadMotion();
  annotateHomepageMotion();
  annotateInteriorMotion();

  // Generic coverage for elements shared across multiple pages.
  addTargets('.service-detail', 'motion-reveal', 0);

  var observer = null;

  if (reduceMotion.matches || !('IntersectionObserver' in window)) {
    revealTargets.forEach(function (element) {
      element.classList.add('is-visible');
    });
  } else {
    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, {
      rootMargin: '0px 0px -9% 0px',
      threshold: 0.12
    });

    revealTargets.forEach(function (element) {
      observer.observe(element);
    });
  }

  var header = document.querySelector('.site-header');
  var depthTargets = document.querySelectorAll('.motion-depth, .motion-video-depth, .motion-hero-depth');
  var rafPending = false;

  function updateScrollMotion() {
    rafPending = false;
    var scrollY = window.scrollY || window.pageYOffset || 0;

    if (header) header.classList.toggle('is-scrolled', scrollY > 72);

    if (reduceMotion.matches || compactViewport.matches) {
      depthTargets.forEach(function (element) {
        element.style.setProperty('--motion-parallax-y', '0px');
      });
      return;
    }

    var viewportHeight = Math.max(window.innerHeight || 0, 1);

    depthTargets.forEach(function (element) {
      var rect = element.getBoundingClientRect();
      if (rect.bottom < -120 || rect.top > viewportHeight + 120) return;

      var center = rect.top + (rect.height / 2);
      var normalized = (center - (viewportHeight / 2)) / viewportHeight;
      var strength = element.classList.contains('motion-video-depth') ? -22 : -14;
      var shift = Math.max(-20, Math.min(20, normalized * strength));
      element.style.setProperty('--motion-parallax-y', shift.toFixed(2) + 'px');
    });
  }

  function scheduleScrollMotion() {
    if (rafPending) return;
    rafPending = true;
    window.requestAnimationFrame(updateScrollMotion);
  }

  window.addEventListener('scroll', scheduleScrollMotion, { passive: true });
  window.addEventListener('resize', scheduleScrollMotion);

  if (typeof reduceMotion.addEventListener === 'function') {
    reduceMotion.addEventListener('change', function () {
      revealTargets.forEach(function (element) {
        element.classList.add('is-visible');
      });
      scheduleScrollMotion();
    });
  }

  scheduleScrollMotion();

  return {
    reduceMotion: reduceMotion,
    revealTargets: revealTargets,
    observer: observer,
    scheduleScrollMotion: scheduleScrollMotion
  };
}

document.addEventListener('DOMContentLoaded', function () {
  var siteRoot = window.__amgSiteRoot || new URL('./', window.location.href);
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  var backdrop = document.querySelector('.nav-backdrop');
  var dropdownParent = document.querySelector('.has-dropdown');
  var servicesToggle = document.querySelector('.services-toggle');
  var desktopQuery = window.matchMedia('(min-width: 901px)');
  var motionSystem = setupMotionSystem();

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
    if (motionSystem && motionSystem.scheduleScrollMotion) motionSystem.scheduleScrollMotion();
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
