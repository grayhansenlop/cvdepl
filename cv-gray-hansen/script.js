/**
 * GRAY HANSEN LIMANTORO, S.Kom. (林福勝)
 * Haute Édition & Luxury Maison Interactive Script
 * Inspired by LVMH, Hermès & Cartier Digital Experiences
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================
  // 1. Current Year in Footer
  // =========================================================
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // =========================================================
  // 2. Dual Luxury Theme Toggle (Maison Blanche & Atelier Noir)
  // =========================================================
  const htmlRoot = document.documentElement;
  const themeButtons = document.querySelectorAll('[data-theme-set]');

  // Retrieve saved theme or default to 'blanche' (like LVMH.com)
  const savedTheme = localStorage.getItem('luxury-maison-theme') || 'blanche';
  setTheme(savedTheme, false);

  themeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTheme = btn.getAttribute('data-theme-set');
      if (targetTheme) {
        setTheme(targetTheme, true);
      }
    });
  });

  function setTheme(theme, triggerToast = false) {
    htmlRoot.setAttribute('data-theme', theme);
    localStorage.setItem('luxury-maison-theme', theme);

    themeButtons.forEach(btn => {
      const isTarget = btn.getAttribute('data-theme-set') === theme;
      btn.classList.toggle('active', isTarget);
      btn.setAttribute('aria-pressed', isTarget ? 'true' : 'false');
    });

    if (triggerToast && typeof showToast === 'function') {
      showToast(theme === 'noir' ? 'Mode Atelier Noir (Dark Mode) diaktifkan' : 'Mode Maison Blanche (Light Mode) diaktifkan');
    }
  }

  // =========================================================
  // 3. Fullscreen Editorial Menu Drawer (LVMH Style)
  // =========================================================
  const menuOpenBtn = document.getElementById('menuOpenBtn');
  const menuCloseBtn = document.getElementById('menuCloseBtn');
  const menuDrawer = document.getElementById('menuDrawer');
  const drawerNavLinks = document.querySelectorAll('#drawerNavList a, #drawerFeaturedLink');

  function openDrawer() {
    if (!menuDrawer) return;
    menuDrawer.classList.add('open');
    document.body.style.overflow = 'hidden';
    menuCloseBtn?.focus();
  }

  function closeDrawer() {
    if (!menuDrawer) return;
    menuDrawer.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (menuOpenBtn) menuOpenBtn.addEventListener('click', openDrawer);
  if (menuCloseBtn) menuCloseBtn.addEventListener('click', closeDrawer);

  drawerNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // Close drawer on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (menuDrawer && menuDrawer.classList.contains('open')) {
        closeDrawer();
      }
      if (modal && modal.classList.contains('open')) {
        closeModal();
      }
    }
  });

  // =========================================================
  // 4. Header Dynamic Blur & Border on Scroll
  // =========================================================
  const mainHeader = document.getElementById('mainHeader');
  function handleHeaderScroll() {
    if (!mainHeader) return;
    if (window.scrollY > 40) {
      mainHeader.classList.add('scrolled');
    } else {
      mainHeader.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  // =========================================================
  // 5. Scroll Spy: Active Nav Link Indicator
  // =========================================================
  const sections = Array.from(document.querySelectorAll('section[id], header[id]'));
  const headerNavLinks = Array.from(document.querySelectorAll('.header-nav-link'));

  function updateActiveNav() {
    const scrollPosition = window.scrollY + 160;
    let currentId = 'home';

    sections.forEach(sec => {
      if (scrollPosition >= sec.offsetTop) {
        currentId = sec.getAttribute('id');
      }
    });

    headerNavLinks.forEach(link => {
      const targetId = link.getAttribute('href')?.replace('#', '');
      link.classList.toggle('active', targetId === currentId);
    });
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  // =========================================================
  // 6. Scroll Reveal Observer with Stagger
  // =========================================================
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // =========================================================
  // 7. Metric Number Animation
  // =========================================================
  const counters = document.querySelectorAll('.counter');
  let animated = false;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counters.forEach(counter => {
          const target = parseFloat(counter.getAttribute('data-target') || '0');
          const isDecimal = String(target).includes('.');
          const duration = 1600;
          const startTime = performance.now();

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = target * easeProgress;

            counter.textContent = isDecimal ? currentVal.toFixed(1) : Math.floor(currentVal);

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              counter.textContent = target;
            }
          }

          requestAnimationFrame(updateCounter);
        });
      }
    });
  }, { threshold: 0.3 });

  const metricsSection = document.querySelector('.metrics-section');
  if (metricsSection) {
    counterObserver.observe(metricsSection);
  }

  // =========================================================
  // 8. Portfolio Category Filtering
  // =========================================================
  const filterButtons = document.querySelectorAll('#portfolioFilters .filter-btn');
  const workCards = document.querySelectorAll('#portfolioGrid .work-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      workCards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (filterVal === 'all' || cardCat === filterVal) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.classList.add('visible');
          }, 30);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // =========================================================
  // 9. Interactive Luxury Detail Modal
  // =========================================================
  const modal = document.getElementById('projectModal');
  const modalClose = document.getElementById('modalClose');
  const modalTitle = document.getElementById('modalTitle');
  const modalCategory = document.getElementById('modalCategory');
  const modalRoleBadge = document.getElementById('modalRoleBadge');
  const modalBody = document.getElementById('modalBody');
  const modalImage = document.getElementById('modalImage');
  const modalImageWrap = document.getElementById('modalImageWrap');
  const modalActionBtn = document.getElementById('modalActionBtn');

  function openModal(card) {
    if (!modal) return;

    const title = card.getAttribute('data-title') || 'Proyek';
    const catLabel = card.getAttribute('data-category-label') || 'Portofolio';
    const role = card.getAttribute('data-role') || '';
    const year = card.getAttribute('data-year') || '';
    const desc = card.getAttribute('data-desc') || '';
    const image = card.getAttribute('data-image') || '';
    const link = card.getAttribute('data-link') || '#';
    const linkLabel = card.getAttribute('data-link-label') || 'Ouvrir le Lien Officiel &nearr;';

    modalTitle.textContent = title;
    modalCategory.textContent = catLabel;
    modalRoleBadge.textContent = role ? `${role} • ${year}` : year;
    modalBody.textContent = desc;

    if (image) {
      modalImage.src = image;
      modalImage.alt = title;
      modalImageWrap.style.display = 'block';
    } else {
      modalImageWrap.style.display = 'none';
    }

    if (link && link !== '#') {
      modalActionBtn.href = link;
      modalActionBtn.innerHTML = `<span>${linkLabel}</span>`;
      modalActionBtn.style.display = 'inline-flex';
    } else {
      modalActionBtn.style.display = 'none';
    }

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    modalClose?.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  const allInteractiveCards = document.querySelectorAll('#portfolioGrid .work-card, .photosession-card');

  allInteractiveCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // If clicking directly on a link inside footer, don't hijack
      if (e.target.closest('a') && e.target.closest('a').getAttribute('href') !== '#') {
        return;
      }
      openModal(card);
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  // =========================================================
  // 10. Copy Email & Share Actions with Luxury Toast
  // =========================================================
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const footerShareLinkBtn = document.getElementById('footerShareLinkBtn');
  const toast = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');

  function showToast(message) {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = copyEmailBtn.getAttribute('data-email') || 'grayhansenl3@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('Adresse email copiée : ' + email);
      }).catch(() => {
        showToast('Email : ' + email);
      });
    });
  }

  if (footerShareLinkBtn) {
    footerShareLinkBtn.addEventListener('click', () => {
      const url = window.location.href;
      navigator.clipboard.writeText(url).then(() => {
        showToast('Lien du portfolio copié dans le presse-papier !');
      }).catch(() => {
        showToast('Partagez : ' + url);
      });
    });
  }

  // =========================================================
  // 11. PDF Dossier Print Preparation & Trigger
  // =========================================================
  function prepareForPrint() {
    // 1. Close menu drawer if open
    if (typeof closeDrawer === 'function') {
      closeDrawer();
    }

    // 2. Close modal if open
    if (typeof closeModal === 'function') {
      closeModal();
    }

    // 3. Make all scroll-reveal elements immediately visible
    document.querySelectorAll('.reveal').forEach(el => {
      el.classList.add('visible');
    });

    // 4. Force all lazy images to eager load for the print engine
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      img.setAttribute('loading', 'eager');
    });

    // 5. Ensure all portfolio work-cards are visible regardless of filter
    document.querySelectorAll('#portfolioGrid .work-card').forEach(card => {
      card.style.display = 'flex';
      card.classList.add('visible');
    });

    // 6. Ensure metric counters show exact target values
    document.querySelectorAll('.counter').forEach(counter => {
      const target = counter.getAttribute('data-target');
      if (target) {
        counter.textContent = target;
      }
    });
  }

  window.addEventListener('beforeprint', prepareForPrint);

  const printCvBtn = document.getElementById('printCvBtn');
  if (printCvBtn) {
    printCvBtn.addEventListener('click', (e) => {
      e.preventDefault();
      prepareForPrint();

      // Give browser a short tick to apply styles and load eager images
      setTimeout(() => {
        window.print();
      }, 120);
    });
  }

});
