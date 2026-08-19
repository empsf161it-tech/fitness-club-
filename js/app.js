/* ==========================================================================
   APEX VOLT FITNESS CLUB - MAIN APPLICATION SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initSectionTracker();
  initMobileNav();
  initModals();
  initCalculators();
  initInteractiveWidgets();
  initBeforeAfterSlider();
});

/* --------------------------------------------------
   1. Section Tracker & Snap Scroll Navigation
   -------------------------------------------------- */
function initSectionTracker() {
  const container = document.querySelector('.page-container');
  const sections = document.querySelectorAll('.full-section');
  const trackerDots = document.querySelectorAll('.tracker-dot');
  const currentCounter = document.querySelector('.section-counter-badge .current');
  const totalCounter = document.querySelector('.section-counter-badge .total');

  if (!sections.length) return;

  if (totalCounter) {
    totalCounter.textContent = String(sections.length).padStart(2, '0');
  }

  // Update active dot and counter on scroll
  const isMobile = window.innerWidth <= 900;
  const observerOptions = {
    root: (container && window.innerWidth > 900) ? container : null,
    threshold: isMobile ? 0.15 : 0.4
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const index = Array.from(sections).indexOf(entry.target);
        
        // Update tracker dots
        trackerDots.forEach((dot, idx) => {
          dot.classList.toggle('active', idx === index);
        });

        // Update section counter
        if (currentCounter) {
          currentCounter.textContent = String(index + 1).padStart(2, '0');
        }

        // Trigger GSAP entry animation if available
        if (window.animateSectionEntry) {
          window.animateSectionEntry(entry.target);
        }
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));

  // Click dot to smooth scroll to section
  trackerDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      if (sections[index]) {
        sections[index].scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* --------------------------------------------------
   2. Mobile Navigation Drawer
   -------------------------------------------------- */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (!toggleBtn || !navLinks) return;

  toggleBtn.addEventListener('click', () => {
    navLinks.classList.toggle('mobile-open');
    const isOpen = navLinks.classList.contains('mobile-open');
    toggleBtn.innerHTML = isOpen ? '<i class="ri-close-line"></i>✕' : '<i class="ri-menu-line"></i>☰';
  });

  // Close nav on link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('mobile-open');
      if (toggleBtn) toggleBtn.innerHTML = '☰';
    });
  });
}

/* --------------------------------------------------
   3. Modal System (VIP Pass, Quick Booking, etc.)
   -------------------------------------------------- */
function initModals() {
  const modalTriggers = document.querySelectorAll('[data-modal]');
  const modalCloses = document.querySelectorAll('.modal-close, .modal-cancel');

  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = trigger.getAttribute('data-modal');
      const targetModal = document.getElementById(modalId);
      if (targetModal) {
        targetModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  modalCloses.forEach(btn => {
    btn.addEventListener('click', () => {
      const activeModal = btn.closest('.modal-overlay');
      if (activeModal) {
        activeModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // Close modal when clicking outer backdrop
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });
}

/* --------------------------------------------------
   4. Pricing Calculator & BMI Estimator
   -------------------------------------------------- */
function initCalculators() {
  // Pricing Estimator Slider
  const daysSlider = document.getElementById('days-slider');
  const ptSlider = document.getElementById('pt-slider');
  const daysVal = document.getElementById('days-val');
  const ptVal = document.getElementById('pt-val');
  const priceDisplay = document.getElementById('estimated-price');
  const spaCheck = document.getElementById('spa-check');

  function calculatePrice() {
    if (!daysSlider || !ptSlider || !priceDisplay) return;
    const days = parseInt(daysSlider.value);
    const ptSessions = parseInt(ptSlider.value);
    const hasSpa = spaCheck ? spaCheck.checked : false;

    if (daysVal) daysVal.textContent = `${days} Days / Wk`;
    if (ptVal) ptVal.textContent = `${ptSessions} Sessions`;

    let base = 49;
    base += (days * 12);
    base += (ptSessions * 35);
    if (hasSpa) base += 40;

    // Smooth count effect on price text
    priceDisplay.textContent = `$${base}`;
  }

  if (daysSlider) daysSlider.addEventListener('input', calculatePrice);
  if (ptSlider) ptSlider.addEventListener('input', calculatePrice);
  if (spaCheck) spaCheck.addEventListener('change', calculatePrice);

  // Initial calculation
  calculatePrice();
}

/* --------------------------------------------------
   5. Interactive Widgets (Class Filter, Booking, Badges)
   -------------------------------------------------- */
function initInteractiveWidgets() {
  // Class Filter Tabs
  const filterBtns = document.querySelectorAll('.class-filter-btn');
  const classCards = document.querySelectorAll('.class-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.getAttribute('data-filter');

      classCards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
          card.style.display = 'block';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Annual / Monthly Billing Switcher on Pricing Page
  const billingToggle = document.getElementById('billing-toggle');
  const priceValues = document.querySelectorAll('.pricing-value');

  if (billingToggle) {
    billingToggle.addEventListener('change', () => {
      const isAnnual = billingToggle.checked;
      priceValues.forEach(el => {
        const monthly = el.getAttribute('data-monthly');
        const annual = el.getAttribute('data-annual');
        if (isAnnual && annual) {
          el.textContent = annual;
        } else if (monthly) {
          el.textContent = monthly;
        }
      });
    });
  }

  // Spot / Locker Selection Simulator on Login Dashboard
  const spotGrid = document.querySelector('.spot-picker-grid');
  if (spotGrid) {
    for (let i = 1; i <= 16; i++) {
      const btn = document.createElement('button');
      btn.className = `spot-btn ${i === 4 ? 'occupied' : i === 7 ? 'selected' : ''}`;
      btn.textContent = String(i).padStart(2, '0');
      if (i === 4) btn.disabled = true;
      btn.addEventListener('click', () => {
        spotGrid.querySelectorAll('.spot-btn').forEach(b => b.classList.remove('selected'));
        if (!btn.classList.contains('occupied')) {
          btn.classList.add('selected');
          const statusText = document.getElementById('selected-spot-label');
          if (statusText) statusText.textContent = `Spot #${String(i).padStart(2, '0')} Reserved`;
        }
      });
      spotGrid.appendChild(btn);
    }
  }
}

/* --------------------------------------------------
   6. Before / After Interactive Slider
   -------------------------------------------------- */
function initBeforeAfterSlider() {
  const container = document.querySelector('.ba-slider-container');
  const afterImg = document.querySelector('.ba-after-img');
  const handle = document.querySelector('.ba-handle');

  if (!container || !afterImg || !handle) return;

  let isDragging = false;

  const moveSlider = (x) => {
    const rect = container.getBoundingClientRect();
    let posX = x - rect.left;
    if (posX < 0) posX = 0;
    if (posX > rect.width) posX = rect.width;

    const percentage = (posX / rect.width) * 100;
    afterImg.style.clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`;
    handle.style.left = `${percentage}%`;
  };

  handle.addEventListener('mousedown', () => isDragging = true);
  window.addEventListener('mouseup', () => isDragging = false);
  window.addEventListener('mousemove', (e) => {
    if (isDragging) moveSlider(e.clientX);
  });

  // Touch support
  handle.addEventListener('touchstart', () => isDragging = true);
  window.addEventListener('touchend', () => isDragging = false);
  window.addEventListener('touchmove', (e) => {
    if (isDragging && e.touches[0]) moveSlider(e.touches[0].clientX);
  });
}
