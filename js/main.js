// Ascension Mow N' Geaux — shared behavior

document.addEventListener('DOMContentLoaded', function () {
  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // Mobile dropdown (Services) toggle — tap to expand on small screens
  var dropdownParent = document.querySelector('.has-dropdown');
  if (dropdownParent) {
    var dropdownLink = dropdownParent.querySelector('a');
    dropdownLink.addEventListener('click', function (e) {
      if (window.innerWidth <= 900) {
        e.preventDefault();
        dropdownParent.classList.toggle('open');
      }
    });
  }

  // Lightbox for gallery pages — shows the real photo, falls back to a label
  var galleryItems = document.querySelectorAll('[data-lightbox-label]');
  var lightbox = document.querySelector('.lightbox');

  if (galleryItems.length && lightbox) {
    var lightboxInner = lightbox.querySelector('.lightbox-inner');
    var closeBtn = lightbox.querySelector('.lightbox-close');

    galleryItems.forEach(function (item) {
      item.addEventListener('click', function () {
        var fullSrc = item.getAttribute('data-full') || item.querySelector('img') && item.querySelector('img').getAttribute('src');
        var label = item.getAttribute('data-lightbox-label') || '';
        if (fullSrc) {
          lightboxInner.innerHTML = '<img src="' + fullSrc + '" alt="' + label.replace(/"/g, '&quot;') + '">';
        } else {
          lightboxInner.innerHTML = '<div class="photo-placeholder">' + label + '</div>';
        }
        lightbox.classList.add('open');
      });
    });

    function closeLightbox() {
      lightbox.classList.remove('open');
    }

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeLightbox();
    });
  }
});
