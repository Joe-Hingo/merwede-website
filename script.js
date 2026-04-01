/**
 * MERWEDE ARCHITECTURE — MAIN SCRIPT
 * - Sticky Nav with scroll detection
 * - Mobile nav toggle
 * - Smooth scroll
 * - Portfolio Carousel
 * - Flip Card interaction
 * - Scroll reveal animations
 * - Contact form handling
 */

'use strict';

/* =============================================
   1. STICKY NAVIGATION
   ============================================= */
const header = document.getElementById('header');

function handleHeaderScroll() {
  if (window.scrollY > 60) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleHeaderScroll, { passive: true });
handleHeaderScroll(); // run on init

/* =============================================
   2. MOBILE NAV TOGGLE
   ============================================= */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
let navOpen = false;

navToggle.addEventListener('click', () => {
  navOpen = !navOpen;
  navLinks.classList.toggle('open', navOpen);
  navToggle.setAttribute('aria-expanded', String(navOpen));

  // Animate hamburger -> X
  const spans = navToggle.querySelectorAll('span');
  if (navOpen) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

// Close nav when a link is clicked  
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navOpen = false;
    navLinks.classList.remove('open');
    const spans = navToggle.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  });
});

/* =============================================
   3. SMOOTH SCROLL for anchor links
   ============================================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 76;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* =============================================
   4. PORTFOLIO CAROUSEL
   ============================================= */
const track = document.getElementById('carouselTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dotsWrapper = document.getElementById('carouselDots');

let currentSlide = 0;
let visibleCount = 3; // how many cards visible at once

if (track && prevBtn && nextBtn && dotsWrapper) {
  function getVisibleCount() {
    if (window.innerWidth <= 640) return 1;
    if (window.innerWidth <= 960) return 2;
    return 3;
  }

  function initCarousel() {
    const cards = track.querySelectorAll('.flip-card');
    const total = cards.length;
    visibleCount = getVisibleCount();
    const maxSlide = total - visibleCount;

    // Create dots
    dotsWrapper.innerHTML = '';
    for (let i = 0; i <= maxSlide; i++) {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      dotsWrapper.appendChild(dot);
    }

    goToSlide(Math.min(currentSlide, maxSlide));
  }

  function goToSlide(index) {
    const cards = track.querySelectorAll('.flip-card');
    const total = cards.length;
    visibleCount = getVisibleCount();
    const maxSlide = total - visibleCount;

    currentSlide = Math.max(0, Math.min(index, maxSlide));

    // Gap is 24px between cards
    const cardWidth = track.offsetWidth / visibleCount;
    const gapWidth = 24;
    const offset = currentSlide * (cardWidth + gapWidth / visibleCount);

    // More precise: use actual rendered card width
    const firstCard = cards[0];
    const actualCardWidth = firstCard ? firstCard.offsetWidth + 24 : cardWidth + gapWidth / visibleCount;
    track.style.transform = `translateX(-${currentSlide * actualCardWidth}px)`;

    // Update dots
    dotsWrapper.querySelectorAll('.carousel-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });

    // Update arrows
    prevBtn.disabled = currentSlide === 0;
    nextBtn.disabled = currentSlide >= maxSlide;
  }

  prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
  nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

  // Touch/swipe support
  let touchStartX = 0;
  const viewport = document.getElementById('carouselViewport');
  if (viewport) {
    viewport.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    viewport.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) goToSlide(currentSlide + (dx < 0 ? 1 : -1));
    }, { passive: true });
  }

  window.addEventListener('resize', () => {
    initCarousel();
  }, { passive: true });

  initCarousel();
}

/* =============================================
   5. FLIP CARDS
   ============================================= */
let flipSliderIntervals = new Map();

function startFlipSlider(card) {
  const gallery = card.querySelector('.fc-gallery');
  const slides = gallery.querySelectorAll('.fc-slide');
  if (!gallery || slides.length <= 1) return;

  stopFlipSlider(card);

  const interval = setInterval(() => {
    // Dynamically calculate current index based on actual scroll position
    const slideWidth = gallery.offsetWidth;
    if (slideWidth === 0) return; // avoid division by zero if card is hidden

    let currentIndex = Math.round(gallery.scrollLeft / slideWidth);
    currentIndex++;

    if (currentIndex >= slides.length) {
      currentIndex = 0;
    }

    gallery.scrollTo({ left: currentIndex * slideWidth, behavior: 'smooth' });
  }, 2800);

  flipSliderIntervals.set(card, interval);
}

function stopFlipSlider(card) {
  if (flipSliderIntervals.has(card)) {
    clearInterval(flipSliderIntervals.get(card));
    flipSliderIntervals.delete(card);
  }
}

function flipCard(card) {
  // Un-flip all others first
  document.querySelectorAll('.flip-card.flipped').forEach(c => {
    if (c !== card) {
      c.classList.remove('flipped');
      stopFlipSlider(c);
    }
  });

  const isFlipping = !card.classList.contains('flipped');
  card.classList.toggle('flipped');

  if (isFlipping) {
    startFlipSlider(card);
  } else {
    stopFlipSlider(card);
  }
}

// Expose to HTML
window.flipCard = flipCard;

document.querySelectorAll('.pf-item.flip-card').forEach(card => {
  card.addEventListener('click', function(e) {
    // Only flip if the click didn't happen on an arrow or close button
    if (!e.target.closest('.fc-arrow') && !e.target.closest('.flip-card-close')) {
      flipCard(this);
    }
  });
});

/* =============================================
   6. SCROLL REVEAL ANIMATIONS
   ============================================= */
const revealElements = document.querySelectorAll(
  '.service-card, .section-header, .about-image-col, .about-content-col, .contact-form, .contact-map-col, .portfolio-header-content'
);

revealElements.forEach((el, i) => {
  el.classList.add('reveal');
  // stagger children in groups
  if (i % 3 === 1) el.classList.add('reveal-delay-1');
  if (i % 3 === 2) el.classList.add('reveal-delay-2');
});

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
);

revealElements.forEach(el => revealObserver.observe(el));

/* =============================================
   7. CONTACT FORM
   ============================================= */
function handleFormSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  const success = document.getElementById('formSuccess');
  const form = document.getElementById('contactForm');

  // Simulate loading state
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Sending…';

  setTimeout(() => {
    form.reset();
    window.location.href = 'thankyou.html';
  }, 1600);
}

// Expose to HTML
window.handleFormSubmit = handleFormSubmit;

/* =============================================
   8. ACTIVE NAV LINK HIGHLIGHTING on scroll
   ============================================= */
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link[href^="#"]');

const sectionObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinkEls.forEach(link => {
          const active = link.getAttribute('href') === `#${id}`;
          link.style.color = active ? '#fff' : '';
          link.style.background = active && !link.classList.contains('nav-cta')
            ? 'rgba(255,255,255,0.1)' : '';
        });
      }
    });
  },
  { threshold: 0.35 }
);

sections.forEach(s => sectionObserver.observe(s));

/* =============================================
   9. PROJECT MODAL + IMAGE SLIDER
   ============================================= */
let modalSlideIndex = 0;
let modalImages = [];

function openProject(data) {
  const modal = document.getElementById('projModal');
  const slides = document.getElementById('projSlides');
  const dots = document.getElementById('projDots');
  const title = document.getElementById('projTitle');
  const location = document.getElementById('projLocation');
  const desc = document.getElementById('projDesc');
  const meta = document.getElementById('projMeta');

  // Populate text
  title.textContent = data.title || '';
  location.textContent = data.location || '';
  desc.textContent = data.desc || '';

  // Meta chips
  meta.innerHTML = '';
  if (data.size) meta.innerHTML += `<span class="proj-meta-chip"><i class="fas fa-ruler-combined"></i>${data.size}</span>`;
  if (data.year) meta.innerHTML += `<span class="proj-meta-chip"><i class="fas fa-calendar"></i>${data.year}</span>`;
  if (data.status) meta.innerHTML += `<span class="proj-meta-chip"><i class="fas fa-landmark"></i>${data.status}</span>`;

  // Build slides
  modalImages = data.images || [];
  modalSlideIndex = 0;
  slides.innerHTML = '';
  dots.innerHTML = '';

  modalImages.forEach((img, i) => {
    const slide = document.createElement('div');
    slide.className = 'proj-slide';
    slide.style.backgroundImage = `url('${img}')`;
    slides.appendChild(slide);

    const dot = document.createElement('button');
    dot.className = 'proj-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to image ${i + 1}`);
    dot.addEventListener('click', () => goToSlide(i));
    dots.appendChild(dot);
  });

  updateSlider();

  // Show/hide prev/next depending on count
  document.querySelector('.proj-slide-btn--prev').style.display = modalImages.length > 1 ? '' : 'none';
  document.querySelector('.proj-slide-btn--next').style.display = modalImages.length > 1 ? '' : 'none';
  dots.style.display = modalImages.length > 1 ? '' : 'none';

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProject() {
  const modal = document.getElementById('projModal');
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

function slideImg(dir) {
  goToSlide(modalSlideIndex + dir);
}

function goToSlide(index) {
  modalSlideIndex = Math.max(0, Math.min(index, modalImages.length - 1));
  updateSlider();
}

function updateSlider() {
  const slides = document.getElementById('projSlides');
  const dots = document.getElementById('projDots');
  slides.style.transform = `translateX(-${modalSlideIndex * 100}%)`;
  dots.querySelectorAll('.proj-dot').forEach((d, i) => {
    d.classList.toggle('active', i === modalSlideIndex);
  });
}

// ESC key to close
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeProject();
});

// Expose functions to HTML onclick attributes
window.openProject = openProject;
window.closeProject = closeProject;
window.slideImg = slideImg;

/* =============================================
   10. SERVICES SECTION BACKGROUND SPLIT
   ============================================= */
function updateServicesBackground() {
  const servicesSection = document.getElementById('services');
  const serviceCards = document.querySelectorAll('.service-card');
  if (!servicesSection || serviceCards.length === 0) return;

  const firstCard = serviceCards[0];
  let el = firstCard;
  let topOffset = 0;

  // Walk up offsetParents until we hit the relative section
  while (el && el !== servicesSection) {
    topOffset += el.offsetTop;
    el = el.offsetParent;
  }

  let splitPoint = topOffset + (firstCard.offsetHeight / 2);

  // On mobile (when cards scroll horizontally), push the blue background fully below the cards 
  // so the sub-heading (which sits above) is totally encompassed in blue without a sharp cut line.
  if (window.innerWidth <= 768) {
    splitPoint = topOffset + firstCard.offsetHeight + 80;
  }

  servicesSection.style.background = `linear-gradient(to bottom, var(--dew) 0%, var(--dew) ${splitPoint}px, #FFFFFF ${splitPoint}px, #FFFFFF 100%)`;
}

window.addEventListener('resize', updateServicesBackground, { passive: true });
// Wait for images and layout to settle
window.addEventListener('load', () => setTimeout(updateServicesBackground, 250));
// Fallback if load already happened
setTimeout(updateServicesBackground, 1500);

/* =============================================
   11. FLIP CARD GALLERY SCROLL
   ============================================= */
function scrollFcGallery(btn, dir) {
  const card = btn.closest('.flip-card');
  const gallery = btn.parentElement.querySelector('.fc-gallery');
  const slides = gallery.querySelectorAll('.fc-slide');
  if (!gallery || slides.length === 0) return;

  const slideWidth = gallery.offsetWidth;
  if (slideWidth === 0) return;

  let currentIndex = Math.round(gallery.scrollLeft / slideWidth);
  currentIndex += dir;

  if (currentIndex < 0) {
    currentIndex = slides.length - 1;
  } else if (currentIndex >= slides.length) {
    currentIndex = 0;
  }

  gallery.scrollTo({ left: currentIndex * slideWidth, behavior: 'smooth' });

  // Reset the auto-slider timer so it doesn't immediately slide after a user click
  if (card && card.classList.contains('flipped')) {
    startFlipSlider(card);
  }
}
window.scrollFcGallery = scrollFcGallery;

/* =============================================
   12. ROBUST FLIP CARD EVENT LISTENERS
   ============================================= */
// Override inline handlers manually to guarantee event propagation is stopped
document.querySelectorAll('.flip-card-back').forEach(back => {
  back.addEventListener('click', function(e) {
    e.stopPropagation();
  });
});

document.querySelectorAll('.flip-card-close').forEach(btn => {
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    flipCard(btn.closest('.flip-card'));
  });
});

document.querySelectorAll('.fc-prev').forEach(btn => {
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    scrollFcGallery(btn, -1);
  });
});

document.querySelectorAll('.fc-next').forEach(btn => {
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    scrollFcGallery(btn, 1);
  });
});

/* =============================================
   13. MASONRY LIGHTBOX
   ============================================= */
document.addEventListener('DOMContentLoaded', () => {
  const masonryItems = document.querySelectorAll('.pf-masonry-item');
  if (masonryItems.length > 0) {
    // Create lightbox HTML dynamically
    const lightbox = document.createElement('div');
    lightbox.className = 'masonry-lightbox';
    lightbox.innerHTML = `
      <div class="ml-backdrop"></div>
      <div class="ml-content">
        <button class="ml-close" aria-label="Close Lightbox">&times;</button>
        <img class="ml-img" src="" alt="Enlarged View" />
        <div class="ml-caption"></div>
      </div>
    `;
    document.body.appendChild(lightbox);

    const mlImg = lightbox.querySelector('.ml-img');
    const mlCaption = lightbox.querySelector('.ml-caption');
    const mlClose = lightbox.querySelector('.ml-close');
    const mlBackdrop = lightbox.querySelector('.ml-backdrop');

    function openLightbox(src, caption) {
      mlImg.src = src;
      mlCaption.textContent = caption;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden'; 
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      setTimeout(() => { mlImg.src = ''; }, 300); // clear after fade out
    }

    mlClose.addEventListener('click', closeLightbox);
    mlBackdrop.addEventListener('click', closeLightbox);

    // Esc key close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });

    // Attach click events to masonry images
    masonryItems.forEach(item => {
      item.style.cursor = 'pointer'; // Make it clear it's clickable
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const overlay = item.querySelector('.pf-masonry-title');
        if (img) {
          openLightbox(img.src, overlay ? overlay.textContent : '');
        }
      });
    });
  }
});
