document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('siteNav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const navScrim = document.getElementById('navScrim');
  const scrollProgress = document.getElementById('scrollProgress');
  const backToTop = document.getElementById('backToTop');

  /* ---------- Scroll effects: nav bg, progress bar, back-to-top ---------- */
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 40);
    backToTop.classList.toggle('is-visible', y > 600);

    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - doc.clientHeight;
    const pct = scrollable > 0 ? (y / scrollable) * 100 : 0;
    scrollProgress.style.width = pct + '%';
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- Mobile nav toggle ---------- */
  const setMobileNav = (isOpen) => {
    navLinks.classList.toggle('is-open', isOpen);
    navToggle.classList.toggle('is-open', isOpen);
    navScrim.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  };
  navToggle.addEventListener('click', () => setMobileNav(!navLinks.classList.contains('is-open')));
  navScrim.addEventListener('click', () => setMobileNav(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setMobileNav(false);
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => setMobileNav(false));
  });

  /* ---------- Scroll-reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- Animated stat counters ---------- */
  const statEls = document.querySelectorAll('.stat__num');
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = el.dataset.decimal !== undefined ? 1 : 0;
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = decimals ? value.toFixed(1) : Math.round(value);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  statEls.forEach(el => statObserver.observe(el));

  /* ---------- Testimonial carousel ---------- */
  const track = document.getElementById('reviewsTrack');
  const slides = track ? Array.from(track.children) : [];
  const dotsWrap = document.getElementById('reviewDots');
  const prevBtn = document.getElementById('reviewPrev');
  const nextBtn = document.getElementById('reviewNext');
  let current = 0;
  let autoplayTimer;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `Go to review ${i + 1}`);
    if (i === 0) dot.classList.add('is-active');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('is-active', i === current));
    resetAutoplay();
  }
  function resetAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(() => goTo(current + 1), 6000);
  }
  if (slides.length) {
    prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn.addEventListener('click', () => goTo(current + 1));
    resetAutoplay();
  }

  /* ---------- Gallery lightbox ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  document.querySelectorAll('#galleryGrid img').forEach(img => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.src.replace(/\/\d+\/\d+$/, '/1600/1000');
      lightboxImg.alt = img.alt;
      lightbox.classList.add('is-open');
    });
  });
  const closeLightbox = () => lightbox.classList.remove('is-open');
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

  /* ---------- Booking form ---------- */
  const bookingForm = document.getElementById('bookingForm');
  const formError = document.getElementById('formError');
  const formSuccess = document.getElementById('formSuccess');
  const checkin = document.getElementById('checkin');
  const checkout = document.getElementById('checkout');

  const today = new Date().toISOString().split('T')[0];
  checkin.setAttribute('min', today);
  checkout.setAttribute('min', today);
  checkin.addEventListener('change', () => {
    checkout.setAttribute('min', checkin.value);
    if (checkout.value && checkout.value < checkin.value) checkout.value = '';
  });

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formError.textContent = '';
    formSuccess.textContent = '';

    const email = bookingForm.email.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!checkin.value || !checkout.value) {
      formError.textContent = 'Please select both check-in and check-out dates.';
      return;
    }
    if (checkout.value <= checkin.value) {
      formError.textContent = 'Check-out date must be after check-in date.';
      return;
    }
    if (!emailPattern.test(email)) {
      formError.textContent = 'Please enter a valid email address.';
      return;
    }

    formSuccess.textContent = `Thank you! Availability confirmed for ${checkin.value} → ${checkout.value}. Our concierge will email ${email} shortly.`;
    bookingForm.reset();
    checkin.setAttribute('min', today);
    checkout.setAttribute('min', today);
  });

  /* ---------- Newsletter form ---------- */
  const newsletterForm = document.getElementById('newsletterForm');
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = newsletterForm.querySelector('input');
    input.value = 'Subscribed ✓';
    input.disabled = true;
  });

  /* ---------- Footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();
});
