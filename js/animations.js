/* ==========================================================================
   APEX VOLT FITNESS CLUB - ANIMATIONS & GSAP SETUP
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Check if GSAP is loaded via CDN
  if (typeof gsap !== 'undefined') {
    initGSAPAnimations();
  } else {
    // Fallback simple CSS entrance animations if GSAP CDN fails
    initFallbackAnimations();
  }
});

function initGSAPAnimations() {
  // Register ScrollTrigger plugin if present
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  const isMobile = window.innerWidth <= 900;

  // Initial Hero Fade In
  gsap.from('.hero-content > *', {
    y: 30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.12,
    ease: 'power3.out',
    delay: 0.1
  });

  // Stagger glass cards
  gsap.utils.toArray('.grid-2, .grid-3, .grid-4').forEach(grid => {
    const cards = grid.querySelectorAll('.glass-card, .stat-card');
    if (cards.length) {
      gsap.from(cards, {
        y: 25,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: grid,
          start: isMobile ? 'top 95%' : 'top 85%',
          once: true
        }
      });
    }
  });
}

// Global section entry trigger called by Section Tracker in app.js
window.animateSectionEntry = function(sectionElement) {
  if (typeof gsap === 'undefined') return;

  const title = sectionElement.querySelector('.section-title');
  const tagline = sectionElement.querySelector('.tagline');
  const desc = sectionElement.querySelector('.section-desc');
  const cards = sectionElement.querySelectorAll('.glass-card, .stat-card, .btn-volt, .btn-outline');
  const counters = sectionElement.querySelectorAll('.counter-num');

  const tl = gsap.timeline();

  if (tagline) {
    tl.fromTo(tagline, { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4, ease: 'power2.out' });
  }
  if (title) {
    tl.fromTo(title, { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }, '-=0.2');
  }
  if (desc) {
    tl.fromTo(desc, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }, '-=0.2');
  }
  if (cards.length) {
    tl.fromTo(cards, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out' }, '-=0.2');
  }

  // Count up trigger for stat numbers
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target') || '0');
    if (target > 0) {
      gsap.fromTo(counter, 
        { textContent: 0 },
        { 
          textContent: target, 
          duration: 1.8, 
          snap: { textContent: 1 }, 
          ease: 'power1.out' 
        }
      );
    }
  });
};

function initFallbackAnimations() {
  const cards = document.querySelectorAll('.glass-card');
  cards.forEach(card => {
    card.style.opacity = '1';
    card.style.transform = 'none';
  });
}
