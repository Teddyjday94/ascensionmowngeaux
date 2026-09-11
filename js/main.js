// Ascension Mow N' Geaux - shared interaction behavior

document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  var backdrop = document.querySelector('.nav-backdrop');
  var dropdownParent = document.querySelector('.has-dropdown');
  var servicesToggle = document.querySelector('.services-toggle');
  var desktopQuery = window.matchMedia('(min-width: 901px)');

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
